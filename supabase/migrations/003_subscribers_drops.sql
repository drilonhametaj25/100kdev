-- ============================================
-- 100KDEV - Subscribers & Drops Migration
-- ============================================

-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'it')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Drops table
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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_confirmed ON subscribers(confirmed) WHERE confirmed = TRUE;
CREATE INDEX idx_subscribers_token ON subscribers(confirmation_token);
CREATE INDEX idx_drops_scheduled ON drops(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX idx_drops_status ON drops(status);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;

-- subscribers: INSERT per tutti, SELECT/UPDATE/DELETE solo per service_role
CREATE POLICY "subscribers_insert_all" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "subscribers_select_service" ON subscribers
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "subscribers_update_service" ON subscribers
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "subscribers_delete_service" ON subscribers
  FOR DELETE USING (auth.role() = 'service_role');

-- drops: SELECT per tutti, INSERT/UPDATE/DELETE solo per service_role
CREATE POLICY "drops_select_all" ON drops
  FOR SELECT USING (true);

CREATE POLICY "drops_insert_service" ON drops
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "drops_update_service" ON drops
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "drops_delete_service" ON drops
  FOR DELETE USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTION: Check if drop is active
-- ============================================

CREATE OR REPLACE FUNCTION is_drop_active()
RETURNS BOOLEAN AS $$
DECLARE
  active_drop drops%ROWTYPE;
BEGIN
  SELECT * INTO active_drop
  FROM drops
  WHERE status = 'active'
    AND scheduled_at <= NOW()
    AND scheduled_at + (duration_minutes * INTERVAL '1 minute') > NOW()
  LIMIT 1;

  RETURN active_drop IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Start drop (called by cron)
-- ============================================

CREATE OR REPLACE FUNCTION start_scheduled_drops()
RETURNS void AS $$
DECLARE
  drop_record drops%ROWTYPE;
BEGIN
  -- Find drops that should start
  FOR drop_record IN
    SELECT * FROM drops
    WHERE status = 'scheduled'
      AND scheduled_at <= NOW()
  LOOP
    -- Update drop status
    UPDATE drops SET status = 'active' WHERE id = drop_record.id;

    -- Update counter_state to show drop price
    UPDATE counter_state
    SET
      is_drop_active = TRUE,
      drop_price = drop_record.drop_price,
      updated_at = NOW()
    WHERE id = '00000000-0000-0000-0000-000000000001';

    -- Log event
    INSERT INTO counter_history (event_type, price_at_event, details)
    VALUES ('drop_start', drop_record.drop_price, jsonb_build_object('drop_id', drop_record.id));
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: End expired drops (called by cron)
-- ============================================

CREATE OR REPLACE FUNCTION end_expired_drops()
RETURNS void AS $$
DECLARE
  drop_record drops%ROWTYPE;
  current_price DECIMAL;
BEGIN
  -- Find active drops that have ended
  FOR drop_record IN
    SELECT * FROM drops
    WHERE status = 'active'
      AND scheduled_at + (duration_minutes * INTERVAL '1 minute') <= NOW()
  LOOP
    -- Get current calculated price
    current_price := calculate_current_price();

    -- Update drop status
    UPDATE drops SET status = 'completed' WHERE id = drop_record.id;

    -- Update counter_state to disable drop
    UPDATE counter_state
    SET
      is_drop_active = FALSE,
      drop_price = NULL,
      updated_at = NOW()
    WHERE id = '00000000-0000-0000-0000-000000000001';

    -- Log event
    INSERT INTO counter_history (event_type, price_at_event, details)
    VALUES ('drop_end', current_price, jsonb_build_object('drop_id', drop_record.id));
  END LOOP;
END;
$$ LANGUAGE plpgsql;
