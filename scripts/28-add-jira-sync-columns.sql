-- Add story_type and parent_id columns for Jira bidirectional sync
-- These columns are required to match Jira's structure and enable proper sync

ALTER TABLE user_stories 
ADD COLUMN IF NOT EXISTS story_type TEXT DEFAULT 'task',
ADD COLUMN IF NOT EXISTS parent_id TEXT;

-- Add comment for documentation
COMMENT ON COLUMN user_stories.story_type IS 'Jira issue type: epic, story, task, subtask, bug';
COMMENT ON COLUMN user_stories.parent_id IS 'Parent story/epic ID for hierarchical relationships';

-- Create index for parent_id lookups
CREATE INDEX IF NOT EXISTS idx_user_stories_parent_id ON user_stories(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_story_type ON user_stories(story_type);
