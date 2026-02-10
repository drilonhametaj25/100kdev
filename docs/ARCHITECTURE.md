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