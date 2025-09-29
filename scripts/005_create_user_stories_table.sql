-- Create user stories table with comprehensive Jira-style fields
CREATE TABLE IF NOT EXISTS user_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  user_type TEXT NOT NULL, -- "As a [type of user]"
  goal TEXT NOT NULL, -- "I want [some goal]"
  reason TEXT NOT NULL, -- "so that [some reason]"
  description TEXT NOT NULL,
  acceptance_criteria JSONB DEFAULT '[]'::jsonb, -- Array of criteria
  priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')) DEFAULT 'Medium',
  status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')) DEFAULT 'To Do',
  story_points INTEGER CHECK (story_points >= 0 AND story_points <= 100),
  dependencies JSONB DEFAULT '[]'::jsonb, -- Array of dependency descriptions
  tasks JSONB DEFAULT '[]'::jsonb, -- Array of tasks with estimates and assignees
  related_issues JSONB DEFAULT '[]'::jsonb, -- Array of related issues/epics
  epic TEXT, -- Epic or theme this story belongs to
  assignee TEXT,
  reporter TEXT,
  labels JSONB DEFAULT '[]'::jsonb, -- Array of labels/tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_stories_status ON user_stories(status);
CREATE INDEX IF NOT EXISTS idx_user_stories_priority ON user_stories(priority);
CREATE INDEX IF NOT EXISTS idx_user_stories_epic ON user_stories(epic);
CREATE INDEX IF NOT EXISTS idx_user_stories_assignee ON user_stories(assignee);
CREATE INDEX IF NOT EXISTS idx_user_stories_created_at ON user_stories(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_stories_updated_at 
    BEFORE UPDATE ON user_stories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
