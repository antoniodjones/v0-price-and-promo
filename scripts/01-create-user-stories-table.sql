-- Migration script to create the user_stories table
-- This script must be run BEFORE the seed scripts

-- Drop the table if it exists (optional - remove if you want to keep existing data)
DROP TABLE IF EXISTS user_stories CASCADE;

-- Create the user_stories table with all required columns
CREATE TABLE user_stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_type TEXT,
  goal TEXT,
  reason TEXT,
  status TEXT DEFAULT 'To Do',
  priority TEXT DEFAULT 'Medium',
  story_points INTEGER,
  assignee TEXT,
  reporter TEXT,
  epic TEXT,
  acceptance_criteria TEXT,
  tasks TEXT,
  dependencies TEXT,
  labels TEXT,
  related_issues TEXT,
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_user_stories_status ON user_stories(status);
CREATE INDEX idx_user_stories_priority ON user_stories(priority);
CREATE INDEX idx_user_stories_epic ON user_stories(epic);
CREATE INDEX idx_user_stories_created_at ON user_stories(created_at);

-- Add a comment to the table
COMMENT ON TABLE user_stories IS 'Stores all user stories, tasks, and work items for the Unified Task Manager';
