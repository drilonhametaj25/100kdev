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