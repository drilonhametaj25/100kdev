-- ============================================
-- 100KDEV - Gallery Projects Migration
-- ============================================

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

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_gallery_visible ON gallery_projects(is_visible, display_order) WHERE is_visible = TRUE;
CREATE INDEX idx_gallery_order ON gallery_projects(display_order DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE gallery_projects ENABLE ROW LEVEL SECURITY;

-- SELECT only visible for public
CREATE POLICY "gallery_select_visible" ON gallery_projects
  FOR SELECT USING (is_visible = TRUE);

-- Full access for service_role
CREATE POLICY "gallery_all_service" ON gallery_projects
  FOR ALL USING (auth.role() = 'service_role');
