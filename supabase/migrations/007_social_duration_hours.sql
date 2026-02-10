-- Add duration_hours column to store the original offer duration
-- This allows expires_at to be calculated as created_at + duration_hours

ALTER TABLE social_projects
ADD COLUMN duration_hours INTEGER NOT NULL DEFAULT 48;

-- Update existing projects: calculate duration_hours from expires_at - created_at
UPDATE social_projects
SET duration_hours = GREATEST(1, EXTRACT(EPOCH FROM (expires_at - created_at)) / 3600)::INTEGER
WHERE expires_at IS NOT NULL;

-- Recalculate expires_at based on created_at + duration_hours for consistency
UPDATE social_projects
SET expires_at = created_at + (duration_hours || ' hours')::INTERVAL
WHERE is_active = TRUE;
