-- ============================================
-- Add expires_at field to social_projects
-- ============================================

ALTER TABLE social_projects
ADD COLUMN expires_at TIMESTAMPTZ;

-- Index for efficient queries on expiration
CREATE INDEX idx_social_projects_expires ON social_projects(expires_at)
WHERE expires_at IS NOT NULL;

-- Update existing active projects with 48h from now
UPDATE social_projects
SET expires_at = NOW() + INTERVAL '48 hours'
WHERE expires_at IS NULL AND is_active = TRUE;
