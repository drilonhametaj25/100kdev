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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=