-- Task Events & Audit Trail Schema
-- Creates table to track all GitHub-related actions on tasks

-- Create task_events table
CREATE TABLE IF NOT EXISTS task_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT NOT NULL REFERENCES user_stories(id),
  event_type TEXT NOT NULL, -- 'branch_created', 'commit_created', 'pr_opened', 'pr_merged', 'task_completed', 'auto_commit_toggled'
  triggered_by TEXT NOT NULL, -- 'agent' or 'user' or user email
  metadata JSONB DEFAULT '{}', -- Flexible storage for event-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_task_events_task_id ON task_events(task_id);
CREATE INDEX IF NOT EXISTS idx_task_events_event_type ON task_events(event_type);
CREATE INDEX IF NOT EXISTS idx_task_events_triggered_by ON task_events(triggered_by);
CREATE INDEX IF NOT EXISTS idx_task_events_created_at ON task_events(created_at DESC);

-- Add comments
COMMENT ON TABLE task_events IS 'Audit trail of all GitHub-related actions on tasks';
COMMENT ON COLUMN task_events.event_type IS 'Type of event: branch_created, commit_created, pr_opened, pr_merged, task_completed, auto_commit_toggled';
COMMENT ON COLUMN task_events.triggered_by IS 'Who triggered the event: agent, user email, or system';
COMMENT ON COLUMN task_events.metadata IS 'Event-specific data: branch_name, commit_sha, pr_url, commit_message, etc.';
