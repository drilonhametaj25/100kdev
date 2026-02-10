-- ============================================
-- 100KDEV - Counter Tables Migration
-- ============================================

-- Counter State (singola riga, sempre aggiornata)
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

-- Counter History (log di tutti gli eventi)
CREATE TABLE counter_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('reset', 'purchase', 'drop_start', 'drop_end', 'auto_reset')),
  price_at_event DECIMAL(10,2) NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INSERIMENTO RIGA INIZIALE COUNTER
-- ============================================

-- ID fisso per la riga counter_state (sempre la stessa)
INSERT INTO counter_state (
  id,
  current_price,
  last_reset_at,
  increment_per_second
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  1000.0000,
  NOW(),
  0.027778
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_counter_history_created_at ON counter_history(created_at DESC);
CREATE INDEX idx_counter_history_event_type ON counter_history(event_type);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Abilita RLS
ALTER TABLE counter_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter_history ENABLE ROW LEVEL SECURITY;

-- counter_state: SELECT per tutti, UPDATE/INSERT/DELETE solo per service_role
CREATE POLICY "counter_state_select_all" ON counter_state
  FOR SELECT USING (true);

CREATE POLICY "counter_state_update_service" ON counter_state
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "counter_state_insert_service" ON counter_state
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "counter_state_delete_service" ON counter_state
  FOR DELETE USING (auth.role() = 'service_role');

-- counter_history: SELECT per tutti, INSERT solo per service_role
CREATE POLICY "counter_history_select_all" ON counter_history
  FOR SELECT USING (true);

CREATE POLICY "counter_history_insert_service" ON counter_history
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- REALTIME
-- ============================================

-- Abilita Realtime per counter_state
ALTER PUBLICATION supabase_realtime ADD TABLE counter_state;

-- ============================================
-- FUNZIONE PER CALCOLO PREZZO CORRENTE
-- ============================================

CREATE OR REPLACE FUNCTION calculate_current_price()
RETURNS DECIMAL AS $$
DECLARE
  state counter_state%ROWTYPE;
  seconds_elapsed DECIMAL;
  calculated_price DECIMAL;
BEGIN
  SELECT * INTO state FROM counter_state WHERE id = '00000000-0000-0000-0000-000000000001';

  -- Se drop attivo, ritorna drop_price
  IF state.is_drop_active AND state.drop_price IS NOT NULL THEN
    RETURN state.drop_price;
  END IF;

  -- Calcola secondi passati dall'ultimo reset
  seconds_elapsed := EXTRACT(EPOCH FROM (NOW() - state.last_reset_at));

  -- Calcola prezzo: start + (seconds * increment)
  calculated_price := 1000 + (seconds_elapsed * state.increment_per_second);

  -- Cap a 100000
  IF calculated_price > 100000 THEN
    calculated_price := 100000;
  END IF;

  RETURN ROUND(calculated_price, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNZIONE PER RESET CONTATORE
-- ============================================

CREATE OR REPLACE FUNCTION reset_counter(reason TEXT DEFAULT 'manual')
RETURNS void AS $$
DECLARE
  current_price DECIMAL;
BEGIN
  -- Ottieni prezzo corrente prima del reset
  current_price := calculate_current_price();

  -- Logga l'evento
  INSERT INTO counter_history (event_type, price_at_event, details)
  VALUES ('reset', current_price, jsonb_build_object('reason', reason));

  -- Reset counter_state
  UPDATE counter_state
  SET
    current_price = 1000.0000,
    last_reset_at = NOW(),
    updated_at = NOW()
  WHERE id = '00000000-0000-0000-0000-000000000001';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER PER AUTO-RESET A 100K
-- ============================================

CREATE OR REPLACE FUNCTION check_auto_reset()
RETURNS TRIGGER AS $$
DECLARE
  current_price DECIMAL;
BEGIN
  current_price := calculate_current_price();

  IF current_price >= 100000 THEN
    -- Logga auto-reset
    INSERT INTO counter_history (event_type, price_at_event, details)
    VALUES ('auto_reset', 100000, jsonb_build_object('reason', 'max_price_reached'));

    -- Reset
    NEW.current_price := 1000.0000;
    NEW.last_reset_at := NOW();
    NEW.updated_at := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger che controlla ad ogni update
CREATE TRIGGER trigger_check_auto_reset
  BEFORE UPDATE ON counter_state
  FOR EACH ROW
  EXECUTE FUNCTION check_auto_reset();
