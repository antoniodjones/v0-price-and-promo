-- ============================================================================
-- Task: cs-001 - Create Enhanced Database Schema
-- Epic: Code Sync
-- Description: Establish complete data model for task-code traceability
--              with GitHub and Jira integration support
-- ============================================================================

-- Step 1: Enhance user_stories table with code tracking fields
-- ============================================================================

ALTER TABLE user_stories 
ADD COLUMN IF NOT EXISTS related_files TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS related_components TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS git_branch TEXT,
ADD COLUMN IF NOT EXISTS git_commits TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pull_request_url TEXT,
ADD COLUMN IF NOT EXISTS jira_issue_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS jira_sync_status TEXT DEFAULT 'pending' CHECK (jira_sync_status IN ('pending', 'synced', 'error', 'disabled')),
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS lines_added INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lines_removed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS files_modified INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS retroactive BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN user_stories.related_files IS 'Array of file paths modified for this task';
COMMENT ON COLUMN user_stories.related_components IS 'Array of component names created/modified';
COMMENT ON COLUMN user_stories.git_branch IS 'Feature branch name for this task';
COMMENT ON COLUMN user_stories.git_commits IS 'Array of commit SHAs associated with this task';
COMMENT ON COLUMN user_stories.pull_request_url IS 'GitHub pull request URL';
COMMENT ON COLUMN user_stories.jira_issue_key IS 'Jira issue key (e.g., PRICE-123)';
COMMENT ON COLUMN user_stories.jira_sync_status IS 'Status of Jira synchronization';
COMMENT ON COLUMN user_stories.last_synced_at IS 'Last successful sync with Jira';
COMMENT ON COLUMN user_stories.retroactive IS 'Flag indicating if task was created retroactively';

-- Step 2: Create code_change_log table (source of truth for all code changes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS code_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT REFERENCES user_stories(id),
  jira_issue_key TEXT,
  file_path TEXT NOT NULL,
  component_name TEXT,
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'modified', 'deleted', 'renamed', 'moved')),
  lines_added INTEGER DEFAULT 0,
  lines_removed INTEGER DEFAULT 0,
  commit_sha TEXT NOT NULL,
  commit_message TEXT,
  commit_url TEXT,
  branch_name TEXT,
  author TEXT,
  author_email TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_to_jira BOOLEAN DEFAULT false,
  sync_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE code_change_log IS 'Complete audit trail of all code changes linked to tasks';
COMMENT ON COLUMN code_change_log.task_id IS 'Reference to user story task ID';
COMMENT ON COLUMN code_change_log.change_type IS 'Type of change: created, modified, deleted, renamed, moved';
COMMENT ON COLUMN code_change_log.metadata IS 'Additional metadata (PR number, review status, etc.)';

-- Step 3: Create jira_sync_log table (audit trail for Jira integration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS jira_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id TEXT,
  jira_issue_key TEXT,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('push', 'pull', 'create', 'update')),
  sync_status TEXT NOT NULL CHECK (sync_status IN ('success', 'error', 'partial')),
  sync_direction TEXT CHECK (sync_direction IN ('to_jira', 'from_jira', 'bidirectional')),
  changes_synced JSONB DEFAULT '{}',
  error_message TEXT,
  error_code TEXT,
  retry_count INTEGER DEFAULT 0,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE jira_sync_log IS 'Audit trail for all Jira synchronization operations';
COMMENT ON COLUMN jira_sync_log.sync_type IS 'Type of sync operation';
COMMENT ON COLUMN jira_sync_log.changes_synced IS 'JSON object of fields that were synced';
COMMENT ON COLUMN jira_sync_log.retry_count IS 'Number of retry attempts for failed syncs';

-- Step 4: Create github_webhooks table (track webhook events)
-- ============================================================================

CREATE TABLE IF NOT EXISTS github_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_action TEXT,
  repository TEXT,
  branch TEXT,
  commit_sha TEXT,
  commit_message TEXT,
  author TEXT,
  author_email TEXT,
  files_changed TEXT[],
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE github_webhooks IS 'Log of all GitHub webhook events received';
COMMENT ON COLUMN github_webhooks.payload IS 'Complete webhook payload from GitHub';
COMMENT ON COLUMN github_webhooks.processed IS 'Whether the webhook has been processed';

-- Step 5: Create task_file_mapping view (denormalized view for quick queries)
-- ============================================================================

CREATE OR REPLACE VIEW task_file_mapping AS
SELECT 
  us.id as task_id,
  us.title as task_title,
  us.epic,
  us.status,
  ccl.file_path,
  ccl.component_name,
  ccl.change_type,
  ccl.lines_added,
  ccl.lines_removed,
  ccl.commit_sha,
  ccl.author,
  ccl.changed_at,
  ccl.branch_name
FROM user_stories us
LEFT JOIN code_change_log ccl ON us.id = ccl.task_id
WHERE ccl.file_path IS NOT NULL
ORDER BY ccl.changed_at DESC;

COMMENT ON VIEW task_file_mapping IS 'Denormalized view showing all file changes per task';

-- Step 6: Create indexes for performance
-- ============================================================================

-- Indexes on code_change_log
CREATE INDEX IF NOT EXISTS idx_code_change_task_id ON code_change_log(task_id);
CREATE INDEX IF NOT EXISTS idx_code_change_file_path ON code_change_log(file_path);
CREATE INDEX IF NOT EXISTS idx_code_change_commit_sha ON code_change_log(commit_sha);
CREATE INDEX IF NOT EXISTS idx_code_change_author ON code_change_log(author);
CREATE INDEX IF NOT EXISTS idx_code_change_changed_at ON code_change_log(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_code_change_jira_key ON code_change_log(jira_issue_key);
CREATE INDEX IF NOT EXISTS idx_code_change_branch ON code_change_log(branch_name);

-- Indexes on jira_sync_log
CREATE INDEX IF NOT EXISTS idx_jira_sync_task_id ON jira_sync_log(task_id);
CREATE INDEX IF NOT EXISTS idx_jira_sync_issue_key ON jira_sync_log(jira_issue_key);
CREATE INDEX IF NOT EXISTS idx_jira_sync_status ON jira_sync_log(sync_status);
CREATE INDEX IF NOT EXISTS idx_jira_sync_synced_at ON jira_sync_log(synced_at DESC);

-- Indexes on github_webhooks
CREATE INDEX IF NOT EXISTS idx_github_webhook_commit ON github_webhooks(commit_sha);
CREATE INDEX IF NOT EXISTS idx_github_webhook_processed ON github_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_github_webhook_created_at ON github_webhooks(created_at DESC);

-- Indexes on user_stories (new columns)
CREATE INDEX IF NOT EXISTS idx_user_stories_jira_key ON user_stories(jira_issue_key);
CREATE INDEX IF NOT EXISTS idx_user_stories_git_branch ON user_stories(git_branch);
CREATE INDEX IF NOT EXISTS idx_user_stories_jira_sync_status ON user_stories(jira_sync_status);

-- Step 7: Create helper functions
-- ============================================================================

-- Function to get all files for a task
CREATE OR REPLACE FUNCTION get_task_files(p_task_id TEXT)
RETURNS TABLE (
  file_path TEXT,
  change_type TEXT,
  lines_added INTEGER,
  lines_removed INTEGER,
  last_modified TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ccl.file_path,
    ccl.change_type,
    ccl.lines_added,
    ccl.lines_removed,
    MAX(ccl.changed_at) as last_modified
  FROM code_change_log ccl
  WHERE ccl.task_id = p_task_id
  GROUP BY ccl.file_path, ccl.change_type, ccl.lines_added, ccl.lines_removed
  ORDER BY last_modified DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get all tasks for a file
CREATE OR REPLACE FUNCTION get_file_tasks(p_file_path TEXT)
RETURNS TABLE (
  task_id TEXT,
  task_title TEXT,
  epic TEXT,
  change_type TEXT,
  changed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    us.title,
    us.epic,
    ccl.change_type,
    ccl.changed_at
  FROM code_change_log ccl
  JOIN user_stories us ON ccl.task_id = us.id
  WHERE ccl.file_path = p_file_path
  ORDER BY ccl.changed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to update task metrics from code_change_log
CREATE OR REPLACE FUNCTION update_task_metrics(p_task_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE user_stories
  SET 
    lines_added = COALESCE((
      SELECT SUM(lines_added) 
      FROM code_change_log 
      WHERE task_id = p_task_id
    ), 0),
    lines_removed = COALESCE((
      SELECT SUM(lines_removed) 
      FROM code_change_log 
      WHERE task_id = p_task_id
    ), 0),
    files_modified = COALESCE((
      SELECT COUNT(DISTINCT file_path) 
      FROM code_change_log 
      WHERE task_id = p_task_id
    ), 0),
    related_files = COALESCE((
      SELECT ARRAY_AGG(DISTINCT file_path) 
      FROM code_change_log 
      WHERE task_id = p_task_id
    ), '{}'),
    git_commits = COALESCE((
      SELECT ARRAY_AGG(DISTINCT commit_sha) 
      FROM code_change_log 
      WHERE task_id = p_task_id
    ), '{}')
  WHERE id = p_task_id;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger to auto-update task metrics
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_task_metrics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_task_metrics(NEW.task_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_code_change_insert
  AFTER INSERT ON code_change_log
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_task_metrics();

-- Step 9: Set up Row Level Security (RLS)
-- ============================================================================

ALTER TABLE code_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE jira_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_webhooks ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read
CREATE POLICY "Allow authenticated read on code_change_log"
  ON code_change_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on jira_sync_log"
  ON jira_sync_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated read on github_webhooks"
  ON github_webhooks FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role all on code_change_log"
  ON code_change_log FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role all on jira_sync_log"
  ON jira_sync_log FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role all on github_webhooks"
  ON github_webhooks FOR ALL
  TO service_role
  USING (true);

-- Step 10: Verify the schema
-- ============================================================================

SELECT 'Schema enhancement complete!' as status;
SELECT 'New columns added to user_stories:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_stories' 
  AND column_name IN ('related_files', 'git_branch', 'jira_issue_key', 'retroactive')
ORDER BY column_name;

SELECT 'New tables created:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('code_change_log', 'jira_sync_log', 'github_webhooks')
ORDER BY table_name;

SELECT 'Indexes created:' as info;
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_code_change%' 
  OR indexname LIKE 'idx_jira_sync%'
  OR indexname LIKE 'idx_github_webhook%'
ORDER BY indexname;
