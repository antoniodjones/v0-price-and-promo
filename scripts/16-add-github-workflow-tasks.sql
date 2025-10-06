-- Add GitHub Workflow Automation tasks (cs-009 through cs-013)
-- These tasks implement automated GitHub integration for v0 and developer workflows

-- cs-009: Core GitHub Workflow Service
INSERT INTO user_stories (
  id,
  epic_id,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  assigned_to,
  tags,
  metadata
) VALUES (
  'cs-009',
  (SELECT id FROM epics WHERE epic_key = 'CODE-SYNC'),
  'Core GitHub Workflow Service',
  'Create unified service for GitHub workflow automation (branch creation, commits, PRs). Provides core logic used by both agent auto-commit and manual developer actions.',
  '- Implement github-workflow service with branch/commit/PR creation
- Add GitHub API integration with proper authentication
- Create API endpoints for manual invocation
- Support configuration (auto vs manual, task linking)
- Handle errors and provide detailed logging
- Respect task-level settings (auto-commit toggle)',
  8,
  'high',
  'todo',
  NULL,
  ARRAY['github', 'automation', 'api', 'core-service'],
  jsonb_build_object(
    'technical_notes', 'Foundation for all GitHub automation. Must be robust and flexible.',
    'dependencies', ARRAY['cs-001', 'cs-002'],
    'api_endpoints', ARRAY['/api/github/create-branch', '/api/github/commit', '/api/github/create-pr']
  )
);

-- cs-010: Agent Auto-Commit Integration
INSERT INTO user_stories (
  id,
  epic_id,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  assigned_to,
  tags,
  metadata
) VALUES (
  'cs-010',
  (SELECT id FROM epics WHERE epic_key = 'CODE-SYNC'),
  'Agent Auto-Commit Integration',
  'Integrate auto-commit workflow into v0 agent. When v0 makes code changes, automatically create commits and push to GitHub with proper task linking.',
  '- Hook into v0 code change detection
- Auto-trigger workflow after agent edits
- Respect task auto-commit toggle setting
- Generate meaningful commit messages with task IDs
- Handle multiple files changed in single commit
- Skip auto-commit when toggle is disabled
- Auto-enable on task completion',
  5,
  'high',
  'todo',
  NULL,
  ARRAY['github', 'automation', 'agent', 'v0-integration'],
  jsonb_build_object(
    'technical_notes', 'Requires integration with v0 code generation lifecycle',
    'dependencies', ARRAY['cs-009'],
    'commit_message_format', '[TASK-ID] Brief description of changes'
  )
);

-- cs-011: Task Actions UI Component
INSERT INTO user_stories (
  id,
  epic_id,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  assigned_to,
  tags,
  metadata
) VALUES (
  'cs-011',
  (SELECT id FROM epics WHERE epic_key = 'CODE-SYNC'),
  'Task Actions UI Component',
  'Create Jira-style action menu on task cards with developer workflow actions: Create Branch, Create Commit, Create PR, View Changes, Sync to GitHub.',
  '- Design task action menu component (dropdown/expandable)
- Add "Create Branch" with branch naming options
- Add "Create Commit" with message templates
- Add "Create PR" with PR creation dialog
- Add "View Changes" to show uncommitted diffs
- Add "Sync to GitHub" manual trigger
- Integrate with github-workflow service
- Show loading states and success/error feedback',
  8,
  'medium',
  'todo',
  NULL,
  ARRAY['ui', 'github', 'developer-experience', 'task-management'],
  jsonb_build_object(
    'technical_notes', 'Jira-like UX for developer actions',
    'dependencies', ARRAY['cs-009'],
    'design_reference', 'Jira task actions menu'
  )
);

-- cs-012: Task Events & Audit Trail
INSERT INTO user_stories (
  id,
  epic_id,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  assigned_to,
  tags,
  metadata
) VALUES (
  'cs-012',
  (SELECT id FROM epics WHERE epic_key = 'CODE-SYNC'),
  'Task Events & Audit Trail',
  'Create task events system to log all GitHub actions (branch created, commit made, PR opened) with full audit trail showing who did what and when.',
  '- Create task_events table (event_type, triggered_by, metadata)
- Log events: branch_created, commit_created, pr_opened, task_completed
- Track triggered_by: agent vs user
- Store metadata: branch_name, commit_sha, pr_url, etc
- Create event timeline view on task cards
- Add analytics for agent vs user contributions
- Show event history in task details',
  5,
  'medium',
  'todo',
  NULL,
  ARRAY['database', 'audit', 'analytics', 'tracking'],
  jsonb_build_object(
    'technical_notes', 'Provides full traceability of all GitHub actions',
    'dependencies', ARRAY['cs-009', 'cs-010'],
    'table_name', 'task_events'
  )
);

-- cs-013: Auto-Commit Toggle & Controls
INSERT INTO user_stories (
  id,
  epic_id,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  assigned_to,
  tags,
  metadata
) VALUES (
  'cs-013',
  (SELECT id FROM epics WHERE epic_key = 'CODE-SYNC'),
  'Auto-Commit Toggle & Controls',
  'Add toggle component on task cards to temporarily disable auto-commit. Auto-enables when task marked complete, allowing developers to control when commits are made.',
  '- Add auto_commit_enabled field to user_stories.metadata
- Create toggle component on task cards
- Default: enabled for agent tasks, disabled for user tasks
- When disabled: v0 skips auto-commit
- When task marked complete: auto-enable and commit pending changes
- Show toggle state clearly in UI
- Add task settings management panel
- Persist toggle state across sessions',
  3,
  'medium',
  'todo',
  NULL,
  ARRAY['ui', 'task-management', 'settings', 'developer-control'],
  jsonb_build_object(
    'technical_notes', 'Gives developers control over when commits happen',
    'dependencies', ARRAY['cs-010'],
    'default_behavior', 'Enabled for agent tasks, disabled for manual tasks'
  )
);

-- Update task dependencies
UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{blocks}',
  '["cs-010", "cs-011", "cs-012", "cs-013"]'::jsonb
)
WHERE id = 'cs-009';

UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{blocks}',
  '["cs-013"]'::jsonb
)
WHERE id = 'cs-010';

UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{blocked_by}',
  '["cs-009"]'::jsonb
)
WHERE id IN ('cs-010', 'cs-011', 'cs-012');

UPDATE user_stories 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{blocked_by}',
  '["cs-009", "cs-010"]'::jsonb
)
WHERE id = 'cs-013';
