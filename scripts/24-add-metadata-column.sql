-- Add metadata column to user_stories table for storing task settings
-- This supports features like auto_commit_enabled and other flexible settings

-- Add metadata column as JSONB
ALTER TABLE user_stories 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create index for faster metadata queries
CREATE INDEX IF NOT EXISTS idx_user_stories_metadata 
ON user_stories USING gin(metadata);

-- Add comment
COMMENT ON COLUMN user_stories.metadata IS 'Flexible JSONB field for storing task settings like auto_commit_enabled, custom configurations, etc.';

-- Initialize metadata for existing tasks with default auto_commit_enabled = true
UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{auto_commit_enabled}',
  'true'::jsonb
)
WHERE metadata IS NULL OR NOT (metadata ? 'auto_commit_enabled');

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_stories' AND column_name = 'metadata';
