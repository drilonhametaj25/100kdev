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