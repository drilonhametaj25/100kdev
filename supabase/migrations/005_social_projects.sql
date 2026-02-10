-- ============================================
-- 100KDEV - Social Projects Migration
-- ============================================

CREATE TABLE social_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tiktok_url TEXT NOT NULL,
  tiktok_embed_html TEXT,
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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_social_projects_active ON social_projects(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_social_projects_status ON social_projects(status);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE social_projects ENABLE ROW LEVEL SECURITY;

-- SELECT for all
CREATE POLICY "social_projects_select_all" ON social_projects
  FOR SELECT USING (true);

-- CUD for service_role only
CREATE POLICY "social_projects_all_service" ON social_projects
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE social_projects;

-- ============================================
-- FUNCTION: Calculate social price
-- ============================================

CREATE OR REPLACE FUNCTION calculate_social_price(project_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  project social_projects%ROWTYPE;
  raw_price DECIMAL;
BEGIN
  SELECT * INTO project FROM social_projects WHERE id = project_id;

  IF project IS NULL THEN
    RETURN 0;
  END IF;

  -- Formula: (views * 1) + (likes * 10) + (comments * 50) + (shares * 100) + (saves * 75)
  raw_price := (project.views_count * 1) +
               (project.likes_count * 10) +
               (project.comments_count * 50) +
               (project.shares_count * 100) +
               (project.saves_count * 75);

  -- Apply floor and cap
  IF raw_price < project.floor_price THEN
    raw_price := project.floor_price;
  ELSIF raw_price > project.cap_price THEN
    raw_price := project.cap_price;
  END IF;

  RETURN raw_price;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Update calculated_price on metrics change
-- ============================================

CREATE OR REPLACE FUNCTION update_calculated_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.calculated_price := calculate_social_price(NEW.id);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_social_price
  BEFORE UPDATE ON social_projects
  FOR EACH ROW
  WHEN (
    OLD.views_count IS DISTINCT FROM NEW.views_count OR
    OLD.likes_count IS DISTINCT FROM NEW.likes_count OR
    OLD.comments_count IS DISTINCT FROM NEW.comments_count OR
    OLD.shares_count IS DISTINCT FROM NEW.shares_count OR
    OLD.saves_count IS DISTINCT FROM NEW.saves_count
  )
  EXECUTE FUNCTION update_calculated_price();
