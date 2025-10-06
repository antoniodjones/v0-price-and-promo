-- Add metadata column to user_stories table for storing task-level settings
-- This enables features like auto-commit toggle, branch naming preferences, etc.

-- Add metadata JSONB column if it doesn't exist
ALTER TABLE user_stories 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Set default auto_commit_enabled to true for all existing tasks
-- Following the "agent moves fast" principle
UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{auto_commit_enabled}',
  'true'::jsonb
)
WHERE metadata IS NULL 
   OR NOT (metadata ? 'auto_commit_enabled');

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_user_stories_metadata 
ON user_stories USING GIN (metadata);

-- Add comment for documentation
COMMENT ON COLUMN user_stories.metadata IS 'Task-level settings including auto_commit_enabled, branch_naming_pattern, commit_message_template, etc.';

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_stories' 
  AND column_name = 'metadata';
