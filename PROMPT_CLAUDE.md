# 100KDEV — Prompt Completo per Claude Code

## CONTESTO DEL PROGETTO

Devo costruire **100KDEV** — una piattaforma web dove vendo i miei servizi da sviluppatore con un meccanismo di prezzo non convenzionale. Due modalità di vendita:

1. **Counter Mode**: Un contatore parte da $1.000 e sale in tempo reale (~$0.17 ogni secondo = $10/minuto). Quando qualcuno compra, il contatore resetta a $1.000. Il cliente può comprare **qualsiasi cosa** — nessun limite di categoria o tier. Il prezzo è quello che segna il contatore nel momento dell'acquisto. Pagamento del 5% subito come caparra non rimborsabile via Stripe, il resto viene fatturato dopo una call.

2. **Social Price Mode**: Pubblico un video TikTok con un progetto da realizzare. Le interazioni sul video determinano il prezzo: view=$1, like=$10, commento=$50, condivisione=$100, salvataggio=$75. Il video TikTok è embedded nella pagina come controprova. Il prezzo si aggiorna in tempo reale leggendo le stats del video.

Include anche: Flash Drop mensile (il contatore crasha a $100 per 15 minuti — data e ora segrete, solo gli iscritti alla newsletter vengono avvisati), galleria pubblica dei progetti completati, sistema bilingue IT/EN con auto-detect.

---

## STEP 0: LEGGI PRIMA QUESTI FILE (SE ESISTONO)

```
Leggi questi file se presenti nel progetto:
- /docs/ARCHITECTURE.md
- /docs/DATA_MODEL.md
- /docs/API_CONTRACTS.md
- /docs/CONVENTIONS.md
- README_CLAUDE.md

Se non esistono, li creeremo ora.
```

---

## STEP 1: ARCHITETTURA — CREA /docs/ARCHITECTURE.md

```markdown
# 100KDEV - Architecture

## Overview
Piattaforma web con pricing dinamico in tempo reale per servizi di sviluppo software.
Stack: Next.js 14 (App Router) + TypeScript + Supabase + Stripe + TailwindCSS

## Moduli Core

### 1. Counter Module
**Responsabilità:** Gestione contatore prezzo in tempo reale
**Tabelle:** counter_state, counter_history
**Logica:**
- Il contatore parte da $1,000.00
- Sale di $0.006944 ogni secondo (= $10.00 ogni ~24 minuti per rendere visibile il movimento, $0.1667/sec sarebbe troppo veloce visivamente)
- NOTA: calibrare la velocità in base all'effetto desiderato. Opzioni:
  - Aggressivo: $10/minuto ($0.1667/sec) — arriva a $100k in ~7 giorni
  - Moderato: $10/ora ($0.00278/sec) — arriva a $100k in ~416 giorni
  - Bilanciato (CONSIGLIATO): $100/ora ($0.02778/sec) — arriva a $100k in ~41 giorni
- Quando qualcuno compra → reset a $1,000.00
- Se raggiunge $100,000.00 senza acquisti → reset automatico a $1,000.00
- Il valore corrente è persistito su Supabase e sincronizzato via Realtime
- Il frontend interpola i centesimi localmente per fluidità, sync col server ogni 5 secondi
**Exports:** getCurrentPrice(), resetCounter(), subscribeToPrice()
**Dipendenze:** Nessuna

### 2. Checkout Module
**Responsabilità:** Gestione acquisti e pagamenti Stripe
**Tabelle:** purchases, purchase_status_log
**Logica:**
- Il cliente descrive il progetto in un textarea
- Inserisce nome, email, telefono (opzionale)
- Paga il 5% del prezzo corrente come caparra via Stripe Checkout
- Minimo caparra: $50 (se il 5% è inferiore)
- Dopo il pagamento: il contatore resetta a $1,000.00
- L'admin (io) riceve notifica email con dettagli progetto + prezzo bloccato
- L'admin può accettare o rifiutare (se rifiuta → rimborso caparra via Stripe Refund API)
**Exports:** createCheckoutSession(), handleWebhook(), refundDeposit()
**Dipendenze:** Counter (prezzo corrente), Stripe API

### 3. Social Price Module
**Responsabilità:** Pricing basato su engagement TikTok
**Tabelle:** social_projects, social_price_snapshots
**Logica:**
- Admin crea un "social project" con: titolo, descrizione, URL video TikTok, floor price, cap price
- La pagina mostra il video TikTok embedded (iframe ufficiale TikTok)
- Le metriche del video (views, likes, comments, shares, saves) determinano il prezzo
- Formula: (views × $1) + (likes × $10) + (comments × $50) + (shares × $100) + (saves × $75)
- Il prezzo non scende mai sotto il floor e non supera il cap
- Le metriche vengono aggiornate: lato client tramite polling ogni 30 secondi, lato server tramite cron job ogni 5 minuti che salva snapshot
- NOTA TECNICA TIKTOK: L'API ufficiale TikTok (Research API o Display API) richiede approvazione. 
  In alternativa:
  - Fase 1 (MVP): inserimento manuale delle metriche dall'admin panel
  - Fase 2: scraping con puppeteer/playwright come cron job server-side
  - Fase 3: TikTok API ufficiale quando approvata
  - Per la demo/MVP, i dati vengono inseriti manualmente dall'admin e il frontend li legge da Supabase Realtime
**Exports:** getSocialProject(), updateMetrics(), calculateSocialPrice()
**Dipendenze:** Supabase Realtime

### 4. Drop Module
**Responsabilità:** Gestione Flash Drop mensili
**Tabelle:** drops, drop_subscribers
**Logica:**
- Admin programma un drop: data, ora, durata (default 15 min), prezzo drop (default $100)
- Quando il drop è attivo: il contatore mostra il prezzo drop invece del prezzo calcolato
- Solo gli iscritti alla newsletter ricevono notifica 5 minuti prima (via email)
- Finito il drop: il contatore riprende dal valore pre-drop
- Un solo acquisto per drop (first come first served)
**Exports:** scheduleFlashDrop(), isDropActive(), getNextDrop()
**Dipendenze:** Counter, Newsletter

### 5. Newsletter Module
**Responsabilità:** Gestione iscrizioni per notifiche drop
**Tabelle:** subscribers
**Logica:**
- Form email con double opt-in (conferma email)
- Invio notifiche pre-drop via Resend (o SendGrid)
- Pagina unsubscribe
**Exports:** subscribe(), unsubscribe(), notifySubscribers()
**Dipendenze:** Nessuna

### 6. Gallery Module
**Responsabilità:** Portfolio pubblico progetti completati
**Tabelle:** gallery_projects
**Logica:**
- Admin aggiunge progetti completati con: titolo, descrizione, prezzo pagato, screenshot/link, data
- Ordine cronologico inverso (ultimo primo)
- Ogni progetto mostra il prezzo a cui è stato acquistato
**Exports:** getGalleryProjects(), addGalleryProject()
**Dipendenze:** Nessuna

### 7. Admin Module
**Responsabilità:** Pannello gestione per l'admin
**Tabelle:** admin_users (o semplice auth Supabase)
**Logica:**
- Login admin (singolo utente, auth Supabase)
- Dashboard: prezzo corrente, acquisti pendenti, subscriber count
- Gestione acquisti: accetta/rifiuta con note
- Gestione social projects: CRUD + aggiornamento manuale metriche
- Programmazione Flash Drop
- Gestione galleria
- Reset manuale contatore
**Exports:** Tutte le operazioni CRUD admin
**Dipendenze:** Tutti i moduli

### 8. i18n Module
**Responsabilità:** Internazionalizzazione IT/EN
**Logica:**
- Auto-detect lingua browser (navigator.language)
- Se inizia con "it" → italiano, altrimenti → inglese
- Toggle manuale in header
- Persistenza scelta in localStorage
- File traduzioni: /src/i18n/it.ts e /src/i18n/en.ts
**Exports:** useTranslation(), setLanguage(), detectLanguage()
**Dipendenze:** Nessuna

## Data Flow
Counter ← Realtime Supabase → Frontend (interpolazione locale centesimi)
Checkout → Stripe → Webhook → Counter reset + Email notifica admin
Social Price ← TikTok metrics (manual/scraping) → Supabase → Frontend Realtime
Drop → Counter (override prezzo) + Newsletter (notifica subscribers)
Gallery ← Admin CRUD → Frontend

## Infrastruttura
- **Hosting**: Vercel (Next.js)
- **Database**: Supabase (PostgreSQL + Realtime + Auth + Storage)
- **Pagamenti**: Stripe (Checkout Sessions + Webhooks + Refunds)
- **Email**: Resend (transazionali + notifiche drop)
- **Dominio**: 100kdev.dev (o simile)
- **Analytics**: Vercel Analytics o Plausible
```

---

## STEP 2: CREA /docs/DATA_MODEL.md

```markdown
# 100KDEV - Data Model

## Tables

### counter_state
```sql
CREATE TABLE counter_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_price DECIMAL(10,4) NOT NULL DEFAULT 1000.0000,
  last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_purchase_price DECIMAL(10,2),
  last_purchase_at TIMESTAMPTZ,
  increment_per_second DECIMAL(10,6) NOT NULL DEFAULT 0.027778, -- $100/ora
  is_drop_active BOOLEAN NOT NULL DEFAULT FALSE,
  drop_price DECIMAL(10,2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Singola riga, sempre ID fisso. Aggiornata dal cron/trigger.
```

### counter_history
```sql
CREATE TABLE counter_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('reset', 'purchase', 'drop_start', 'drop_end', 'auto_reset')),
  price_at_event DECIMAL(10,2) NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### purchases
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_locked DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  project_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deposit_paid', 'accepted', 'rejected', 'refunded', 'completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### social_projects
```sql
CREATE TABLE social_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tiktok_url TEXT NOT NULL,
  tiktok_embed_html TEXT, -- HTML embed code da TikTok oEmbed API
  floor_price DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  cap_price DECIMAL(10,2) NOT NULL DEFAULT 50000.00,
  views_count INTEGER NOT NULL DEFAULT 0,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  saves_count INTEGER NOT NULL DEFAULT 0,
  calculated_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'sold', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### drops
```sql
CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  drop_price DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  notified_at TIMESTAMPTZ,
  purchased_by UUID REFERENCES purchases(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### subscribers
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'it')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);
```

### gallery_projects
```sql
CREATE TABLE gallery_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_paid DECIMAL(10,2) NOT NULL,
  project_url TEXT,
  screenshot_url TEXT,
  purchase_id UUID REFERENCES purchases(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Relationships
- purchases.id → gallery_projects.purchase_id (1:1 opzionale)
- purchases.id → drops.purchased_by (1:1 opzionale)

## Indexes
```sql
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_email ON purchases(customer_email);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_confirmed ON subscribers(confirmed) WHERE confirmed = TRUE;
CREATE INDEX idx_social_projects_active ON social_projects(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_drops_scheduled ON drops(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_gallery_visible ON gallery_projects(is_visible, display_order) WHERE is_visible = TRUE;
```

## Supabase Realtime
Abilitare Realtime su:
- counter_state (per aggiornamenti prezzo live)
- social_projects (per aggiornamenti metriche live)
- purchases (per notifiche admin)

## RLS Policies
- counter_state: SELECT per tutti, UPDATE solo per service_role
- purchases: INSERT per tutti (via API), SELECT/UPDATE solo per admin
- subscribers: INSERT per tutti, SELECT/UPDATE/DELETE solo per admin
- social_projects: SELECT per tutti, INSERT/UPDATE/DELETE solo per admin
- gallery_projects: SELECT (is_visible=true) per tutti, full access per admin
- drops: SELECT per tutti, INSERT/UPDATE/DELETE solo per admin
```

---

## STEP 3: CREA /docs/API_CONTRACTS.md

```markdown
# 100KDEV - API Contracts

## Public API (no auth)

### GET /api/counter
Ritorna il prezzo corrente del contatore.
```typescript
Response: {
  price: number;           // prezzo corrente calcolato
  lastResetAt: string;     // ISO timestamp ultimo reset
  lastPurchasePrice: number | null;
  lastPurchaseAt: string | null;
  isDropActive: boolean;
  dropPrice: number | null;
  incrementPerSecond: number;
}
```
**Note:** Il frontend usa `incrementPerSecond` e `lastResetAt` per calcolare il prezzo localmente tra un poll e l'altro, garantendo fluidità dei centesimi senza bombardare il server.

### POST /api/checkout
Crea una Stripe Checkout Session.
```typescript
Request: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  projectDescription: string;
  lockedPrice: number;     // prezzo al momento del click
}
Response: {
  checkoutUrl: string;     // URL Stripe Checkout
  sessionId: string;
  depositAmount: number;
}
```
**Validazione:** 
- lockedPrice deve essere entro ±$50 dal prezzo server attuale (tolleranza per latenza)
- Se il contatore ha resettato tra click e submit → errore 409 Conflict

### POST /api/webhook/stripe
Webhook Stripe per conferma pagamento.
- Evento: checkout.session.completed
- Azione: aggiorna purchase status, resetta contatore, invia email admin

### POST /api/subscribe
Iscrizione newsletter.
```typescript
Request: { email: string; language: 'en' | 'it' }
Response: { success: boolean; message: string }
```

### GET /api/subscribe/confirm?token=UUID
Conferma email (double opt-in).

### GET /api/gallery
Lista progetti pubblici.
```typescript
Response: {
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    pricePaid: number;
    projectUrl: string | null;
    screenshotUrl: string | null;
    createdAt: string;
  }>
}
```

### GET /api/social-projects
Lista social projects attivi.
```typescript
Response: {
  projects: Array<{
    id: string;
    title: string;
    description: string;
    tiktokUrl: string;
    tiktokEmbedHtml: string | null;
    metrics: { views: number; likes: number; comments: number; shares: number; saves: number };
    calculatedPrice: number;
    floorPrice: number;
    capPrice: number;
    status: 'live' | 'sold' | 'expired';
  }>
}
```

## Admin API (auth required — Supabase Auth JWT)

### GET /api/admin/dashboard
### GET /api/admin/purchases
### PATCH /api/admin/purchases/:id (accept/reject/refund)
### POST /api/admin/gallery (add project)
### PUT /api/admin/gallery/:id
### DELETE /api/admin/gallery/:id
### POST /api/admin/drops (schedule drop)
### PATCH /api/admin/drops/:id (cancel)
### POST /api/admin/social-projects (create)
### PATCH /api/admin/social-projects/:id (update metrics + details)
### POST /api/admin/counter/reset (manual reset)
```

---

## STEP 4: CREA /docs/CONVENTIONS.md

```markdown
# 100KDEV - Conventions

## Stack
- Next.js 14 con App Router
- TypeScript strict mode
- TailwindCSS per styling
- Supabase client: @supabase/supabase-js + @supabase/ssr
- Stripe: stripe + @stripe/stripe-js
- Email: resend
- Validazione: zod

## Naming
- camelCase: variabili, funzioni, props
- PascalCase: componenti React, tipi, interfacce
- kebab-case: file e cartelle
- snake_case: colonne database, tabelle
- SCREAMING_SNAKE_CASE: costanti e env vars

## File Structure
```
/src
  /app                    # Next.js App Router pages
    /(public)             # Pagine pubbliche
      /page.tsx           # Homepage con contatore
      /social-price/page.tsx
    /admin                # Pannello admin (protetto)
      /page.tsx
      /purchases/page.tsx
      /social/page.tsx
      /drops/page.tsx
      /gallery/page.tsx
    /api                  # API Routes
      /counter/route.ts
      /checkout/route.ts
      /webhook/stripe/route.ts
      /subscribe/route.ts
      /gallery/route.ts
      /social-projects/route.ts
      /admin/...
  /components
    /counter              # Componenti contatore
      /price-display.tsx  # Display prezzo con animazione centesimi
      /counter-stats.tsx  # Stats sotto contatore
    /checkout
      /checkout-modal.tsx
      /checkout-form.tsx
    /social
      /tiktok-embed.tsx   # Embed video TikTok
      /metrics-display.tsx
      /social-price-display.tsx
    /drop
      /drop-banner.tsx
      /subscribe-form.tsx
    /gallery
      /gallery-grid.tsx
      /gallery-card.tsx
    /layout
      /header.tsx
      /footer.tsx
      /lang-toggle.tsx
    /ui                   # Componenti UI riutilizzabili
      /button.tsx
      /input.tsx
      /modal.tsx
      /badge.tsx
  /lib
    /supabase
      /client.ts          # Browser client
      /server.ts          # Server client
      /admin.ts           # Service role client
    /stripe
      /client.ts          # Stripe server instance
      /checkout.ts        # Checkout session logic
      /webhook.ts         # Webhook handler
    /email
      /resend.ts          # Email client
      /templates/         # Email templates
    /counter
      /calculator.ts      # Logica calcolo prezzo
      /interpolator.ts    # Interpolazione client-side centesimi
    /utils
      /format.ts          # Formattazione prezzi, date
      /constants.ts       # Costanti globali
  /hooks
    /use-counter.ts       # Hook Realtime per prezzo contatore
    /use-language.ts      # Hook per i18n
    /use-social-price.ts  # Hook per social price Realtime
  /i18n
    /en.ts
    /it.ts
    /types.ts
  /types
    /shared
      /index.ts           # Tutti i tipi condivisi
      /counter.ts
      /purchase.ts
      /social.ts
      /drop.ts
      /subscriber.ts
      /gallery.ts
      /schemas.ts         # Zod schemas
/docs
  /ARCHITECTURE.md
  /DATA_MODEL.md
  /API_CONTRACTS.md
  /CONVENTIONS.md
/supabase
  /migrations/            # SQL migrations
```

## Import Rules
```typescript
// ✅ CORRETTO — importa da shared
import { Purchase, CounterState } from '@/types/shared';

// ❌ SBAGLIATO — tipo duplicato locale
interface Purchase { ... }

// ✅ CORRETTO — path alias
import { PriceDisplay } from '@/components/counter/price-display';

// ❌ SBAGLIATO — path relativo profondo
import { PriceDisplay } from '../../../components/counter/price-display';
```

## Design System
- **Font**: JetBrains Mono (monospace, techy, riconoscibile)
- **Theme**: Dark mode only (#030303 background)
- **Accent colors**: Cambiano in base al prezzo
  - $1k-$3k: verde (#22c55e)
  - $3k-$10k: blu (#3b82f6)  
  - $10k-$30k: ambra (#f59e0b)
  - $30k+: rosso (#ef4444)
  - Social price: viola (#a855f7)
- **Effetti**: Glow/shadow che cambia col colore accent, grain overlay, animazioni minimal
- **Spacing**: Generoso, respiro, minimal content density
- **Approach**: Brutalist-tech — raw monospace, grandi numeri, poco testo, tanto impatto visivo

## Error Handling
- API: sempre risposta JSON con { error: string, code: string }
- Frontend: toast notifications per errori
- Stripe: logging completo di ogni webhook event
- Supabase: retry automatico su connection loss

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=
```
```

---

## STEP 5: CREA I TIPI CONDIVISI /src/types/shared/index.ts

```typescript
// SINGLE SOURCE OF TRUTH — tutti i tipi del sistema

export interface CounterState {
  id: string;
  currentPrice: number;
  lastResetAt: string;
  lastPurchasePrice: number | null;
  lastPurchaseAt: string | null;
  incrementPerSecond: number;
  isDropActive: boolean;
  dropPrice: number | null;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  priceLocked: number;
  depositAmount: number;
  depositPaid: boolean;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  projectDescription: string;
  status: PurchaseStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseStatus = 'pending' | 'deposit_paid' | 'accepted' | 'rejected' | 'refunded' | 'completed';

export interface SocialProject {
  id: string;
  title: string;
  description: string;
  tiktokUrl: string;
  tiktokEmbedHtml: string | null;
  floorPrice: number;
  capPrice: number;
  metrics: SocialMetrics;
  calculatedPrice: number;
  isActive: boolean;
  status: SocialProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
}

export type SocialProjectStatus = 'live' | 'sold' | 'expired';

export const SOCIAL_MULTIPLIERS = {
  views: 1,
  likes: 10,
  comments: 50,
  shares: 100,
  saves: 75,
} as const;

export interface Drop {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  dropPrice: number;
  status: DropStatus;
  notifiedAt: string | null;
  purchasedBy: string | null;
  createdAt: string;
}

export type DropStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  language: 'en' | 'it';
  createdAt: string;
  unsubscribedAt: string | null;
}

export interface GalleryProject {
  id: string;
  title: string;
  description: string | null;
  pricePaid: number;
  projectUrl: string | null;
  screenshotUrl: string | null;
  purchaseId: string | null;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
}

// Counter constants
export const COUNTER_CONFIG = {
  startPrice: 1000,
  maxPrice: 100000,
  incrementPerSecond: 0.027778, // $100/ora
  minDeposit: 50,
  depositPercentage: 0.05,
} as const;

// Utility types
export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: { message: string; code: string };
};
```

---

## STEP 6: IMPLEMENTAZIONE — ORDINE DEI MODULI (Vertical Slice)

Implementa in questo ordine. Ogni modulo deve essere completo (DB + API + UI) prima di passare al successivo.

### Iterazione 1: Setup + Counter (il cuore)
```
1. Inizializza progetto Next.js 14 con App Router + TypeScript + TailwindCSS
2. Configura Supabase: progetto, tabelle (migration per counter_state, counter_history)
3. Crea /src/lib/supabase/ (client, server, admin)
4. Crea /src/lib/counter/calculator.ts — logica calcolo prezzo:
   - calculateCurrentPrice(lastResetAt, incrementPerSecond): number
   - Prende lastResetAt, calcola secondi passati, moltiplica per increment
5. Crea /src/lib/counter/interpolator.ts — interpolazione client-side:
   - useCounterInterpolation(serverPrice, incrementPerSecond): animatedPrice
   - Usa requestAnimationFrame per aggiornare centesimi ogni frame
   - Sync col server ogni 5 secondi via Supabase Realtime
6. Crea /src/hooks/use-counter.ts:
   - Sottoscrizione Supabase Realtime su counter_state
   - Combina con interpolator per prezzo fluido
   - Espone: { price, lastResetAt, lastPurchasePrice, isDropActive }
7. Crea API GET /api/counter
8. Crea componente PriceDisplay:
   - Mostra prezzo con centesimi che scorrono fluidi
   - Colore glow che cambia in base al range di prezzo
   - Pallino rosso LIVE pulsante
   - Font grande, impattante, JetBrains Mono
9. Crea la homepage (/) con:
   - PriceDisplay centrato
   - Tagline "The dev who starts at" / "Il dev che parte da"
   - Sottotitolo esplicativo
   - Bottone CTA "LOCK THIS PRICE"
   - Background scuro con grain overlay e glow radiale
10. Testa: il contatore si muove fluido, i centesimi scorrono, il colore cambia
```

### Iterazione 2: Checkout + Stripe
```
1. Migration DB: tabella purchases
2. Configura Stripe: account, API keys, webhook endpoint
3. Crea /src/lib/stripe/ (client.ts, checkout.ts, webhook.ts)
4. Crea API POST /api/checkout:
   - Valida input con Zod
   - Verifica prezzo server (tolleranza ±$50)
   - Crea Stripe Checkout Session in mode 'payment'
   - Salva purchase con status 'pending'
   - Ritorna checkout URL
5. Crea API POST /api/webhook/stripe:
   - Verifica signature Stripe
   - Su checkout.session.completed: 
     - Aggiorna purchase status a 'deposit_paid'
     - Resetta counter_state a $1,000
     - Logga evento in counter_history
     - Invia email notifica admin (per ora console.log, email in iterazione successiva)
6. Crea componente CheckoutModal:
   - Si apre al click di "LOCK THIS PRICE"
   - Mostra prezzo corrente (continua ad aggiornarsi!)
   - Form: nome, email, telefono, textarea progetto
   - Mostra deposito calcolato (5%, min $50)
   - Bottone "PAY DEPOSIT & LOCK"
   - Redirect a Stripe Checkout
7. Crea pagina /checkout/success e /checkout/cancel
8. Testa: intero flusso da click a pagamento a reset contatore
```

### Iterazione 3: i18n
```
1. Crea /src/i18n/en.ts e /src/i18n/it.ts con tutte le stringhe
2. Crea /src/hooks/use-language.ts:
   - Auto-detect da navigator.language
   - Persistenza scelta in cookie (non localStorage — SSR compatibility)
   - Funzione t(key) per traduzione
3. Crea componente LangToggle (IT/EN in header)
4. Applica traduzioni a tutti i componenti esistenti
5. Testa: switch lingua, auto-detect, persistenza
```

### Iterazione 4: Newsletter + Drop
```
1. Migration DB: tabelle subscribers, drops
2. Configura Resend per invio email
3. Crea API POST /api/subscribe (con double opt-in)
4. Crea API GET /api/subscribe/confirm?token=...
5. Crea componente SubscribeForm:
   - Sezione dedicata sulla homepage sotto il contatore
   - Stile rosso/urgente: "⚡ FLASH DROP"
   - Spiega il meccanismo
   - Form email + bottone
   - Feedback: "YOU'RE IN ✓"
6. Crea logica drop nel backend:
   - Cron job (Vercel Cron o Supabase pg_cron) che controlla drops.scheduled_at
   - Quando è ora: attiva drop, notifica subscribers, override prezzo contatore
   - Dopo duration_minutes: disattiva drop
7. Crea admin UI per programmare drop
8. Testa: iscrizione, conferma email, notifica, drop attivo, acquisto durante drop
```

### Iterazione 5: Gallery
```
1. Migration DB: tabella gallery_projects
2. Crea API GET /api/gallery
3. Crea componente GalleryGrid:
   - Lista progetti con #numero, titolo, prezzo pagato
   - Design minimal, righe con bordo sottile
   - Prezzo colorato in base al range
4. Aggiungi sezione Gallery alla homepage
5. Admin CRUD per gestione gallery
6. Testa: visualizzazione, ordine, admin
```

### Iterazione 6: Social Price
```
1. Migration DB: tabella social_projects, social_price_snapshots
2. Crea API GET /api/social-projects
3. Crea /src/components/social/tiktok-embed.tsx:
   - Usa oEmbed API TikTok per ottenere HTML embed: GET https://www.tiktok.com/oembed?url={VIDEO_URL}
   - Renderizza iframe/embed in modo responsive
   - Fallback: link diretto al video se embed non disponibile
4. Crea /src/components/social/metrics-display.tsx:
   - 5 card con icona, conteggio, moltiplicatore
   - Numeri che si aggiornano (animazione contatore)
5. Crea /src/components/social/social-price-display.tsx:
   - Prezzo totale calcolato grande, viola, con glow
   - Pallino live pulsante
6. Crea pagina /social-price:
   - Header con titolo e spiegazione
   - Video TikTok embedded
   - Metriche in tempo reale
   - Prezzo totale
   - Form per proporre progetto
7. Admin: CRUD social projects + form aggiornamento manuale metriche
8. Testa: embed video funziona, metriche si aggiornano, prezzo si calcola
```

### Iterazione 7: Admin Panel
```
1. Setup auth Supabase (email/password, singolo admin)
2. Crea layout admin con sidebar
3. Dashboard: KPI (prezzo corrente, acquisti totali, subscriber count, revenue totale)
4. Pagina acquisti: lista, dettagli, accetta/rifiuta con refund Stripe
5. Pagina drops: programma, cancella, storico
6. Pagina gallery: CRUD
7. Pagina social: CRUD + aggiornamento metriche
8. Bottone reset manuale contatore
9. Proteggi tutte le route admin con middleware auth
```

### Iterazione 8: Polish + Deploy
```
1. Animazioni: page transitions, hover effects, scroll reveals
2. SEO: meta tags, OG image (generata con il prezzo corrente?), sitemap
3. Performance: lazy loading, optimistic UI, error boundaries
4. Mobile: test responsive completo, touch-friendly
5. Analytics: setup tracking
6. Deploy su Vercel
7. Configura dominio
8. Stripe in modalità live
9. Test end-to-end completo
```

---

## STEP 7: IL PROMPT MAGICO (usalo per ogni iterazione)

Prima di scrivere codice per ogni iterazione, rispondi:

1. **Quali file LEGGERAI** per contestualizzare?
2. **Quali file MODIFICHERAI o CREERAI?**
3. **Quali tipi/interfacce USERAI** da /src/types/shared/?
4. **Quali moduli potrebbero ROMPERSI?**
5. **Come VERIFICHERAI** che tutto funziona?

Aspetto risposta prima di procedere.

---

## NOTE TECNICHE CRITICHE

### Contatore fluido — come funziona
Il contatore NON fa polling ogni secondo. Sarebbe troppo pesante.

**Server-side:**
- Supabase tiene `counter_state` con `current_price` e `last_reset_at`
- Un trigger/cron aggiorna `current_price` periodicamente (ogni 10 sec)
- Supabase Realtime invia update al frontend

**Client-side:**
- Il frontend riceve `lastResetAt` e `incrementPerSecond` dal server
- Calcola localmente: `price = 1000 + (secondsSinceReset × incrementPerSecond)`
- Usa `requestAnimationFrame` per aggiornare i centesimi ogni frame (~60fps)
- Ogni 5 secondi si sincronizza col server per correggere drift
- Risultato: centesimi che scorrono fluidi senza carico server

### Embed TikTok
```javascript
// Per ottenere l'embed HTML di un video TikTok:
const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`);
const data = await res.json();
// data.html contiene il codice embed completo
// Renderizzalo con dangerouslySetInnerHTML (sanitizzato)
```

### Stripe Checkout
```javascript
// Crea sessione per il deposito
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: '100KDEV — Project Deposit',
        description: `Deposit for project at ${formatPrice(lockedPrice)}. Non-refundable.`,
      },
      unit_amount: depositAmount * 100, // Stripe usa centesimi
    },
    quantity: 1,
  }],
  metadata: {
    purchaseId: purchase.id,
    lockedPrice: lockedPrice.toString(),
  },
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
});
```

### Tolleranza prezzo
Tra il click del cliente e il completamento del checkout passano secondi. Il prezzo sale. Gestisci così:
- Al click: salva `lockedPrice` nel purchase
- Al checkout: verifica che `lockedPrice` sia entro ±$50 dal prezzo server attuale
- Se il contatore ha resettato (qualcun altro ha comprato): errore 409, il cliente deve riprovare
- Il deposito è calcolato sul `lockedPrice`, non sul prezzo corrente

---

## INIZIO IMPLEMENTAZIONE

Ora che hai letto tutta l'architettura, inizia dall'Iterazione 1 (Setup + Counter).

Ricorda il Prompt Magico: prima di scrivere codice, dimmi quali file leggerai, creerai, quali tipi userai, cosa potrebbe rompersi e come verificherai.

Procedi.