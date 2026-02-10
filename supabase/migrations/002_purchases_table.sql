-- ============================================
-- 100KDEV - Purchases Table Migration
-- ============================================

-- Purchases table
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

-- Purchase status log (for auditing)
CREATE TABLE purchase_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT, -- 'system', 'admin', 'stripe_webhook'
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_email ON purchases(customer_email);
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX idx_purchases_stripe_session ON purchases(stripe_checkout_session_id);
CREATE INDEX idx_purchase_status_log_purchase_id ON purchase_status_log(purchase_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_status_log ENABLE ROW LEVEL SECURITY;

-- purchases: INSERT per tutti (via API), SELECT/UPDATE/DELETE solo per service_role
CREATE POLICY "purchases_insert_all" ON purchases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "purchases_select_service" ON purchases
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "purchases_update_service" ON purchases
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "purchases_delete_service" ON purchases
  FOR DELETE USING (auth.role() = 'service_role');

-- purchase_status_log: solo service_role
CREATE POLICY "purchase_status_log_all_service" ON purchase_status_log
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE purchases;

-- ============================================
-- TRIGGER per updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER per log status changes
-- ============================================

CREATE OR REPLACE FUNCTION log_purchase_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO purchase_status_log (purchase_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_purchase_status
  AFTER UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION log_purchase_status_change();

-- ============================================
-- FUNCTION per reset counter dopo acquisto
-- ============================================

CREATE OR REPLACE FUNCTION handle_purchase_completed(purchase_id UUID)
RETURNS void AS $$
DECLARE
  purchase_record purchases%ROWTYPE;
BEGIN
  SELECT * INTO purchase_record FROM purchases WHERE id = purchase_id;

  IF purchase_record IS NULL THEN
    RAISE EXCEPTION 'Purchase not found';
  END IF;

  -- Log evento purchase in counter_history
  INSERT INTO counter_history (event_type, price_at_event, details)
  VALUES (
    'purchase',
    purchase_record.price_locked,
    jsonb_build_object(
      'purchase_id', purchase_id,
      'customer_email', purchase_record.customer_email,
      'deposit_amount', purchase_record.deposit_amount
    )
  );

  -- Reset counter
  UPDATE counter_state
  SET
    current_price = 1000.0000,
    last_reset_at = NOW(),
    last_purchase_price = purchase_record.price_locked,
    last_purchase_at = NOW(),
    updated_at = NOW()
  WHERE id = '00000000-0000-0000-0000-000000000001';
END;
$$ LANGUAGE plpgsql;
