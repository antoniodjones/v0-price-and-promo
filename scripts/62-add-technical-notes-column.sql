-- Migration: Add technical_notes column to user_stories table
-- Purpose: Store technical implementation details for user stories and refactoring tasks

-- Add technical_notes column
ALTER TABLE user_stories 
ADD COLUMN IF NOT EXISTS technical_notes TEXT;

-- Add comment to document the column purpose
COMMENT ON COLUMN user_stories.technical_notes IS 'Technical implementation details, architecture notes, and refactoring documentation';

-- Create index for searching technical notes
CREATE INDEX IF NOT EXISTS idx_user_stories_technical_notes ON user_stories USING gin(to_tsvector('english', technical_notes));

SELECT 'Successfully added technical_notes column to user_stories table' AS result;
