-- Add GitHub Workflow Automation tasks (cs-009 through cs-013)
-- These tasks implement automated GitHub integration for v0 and developer workflows

-- cs-009: Core GitHub Workflow Service
INSERT INTO user_stories (
  id,
  epic,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  labels
) VALUES (
  'cs-009',
  'CODE-SYNC',
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
  'github,automation,api,core-service'
);

-- cs-010: Agent Auto-Commit Integration
INSERT INTO user_stories (
  id,
  epic,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  labels,
  dependencies
) VALUES (
  'cs-010',
  'CODE-SYNC',
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
  'github,automation,agent,v0-integration',
  'cs-009'
);

-- cs-011: Task Actions UI Component
INSERT INTO user_stories (
  id,
  epic,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  labels,
  dependencies
) VALUES (
  'cs-011',
  'CODE-SYNC',
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
  'ui,github,developer-experience,task-management',
  'cs-009'
);

-- cs-012: Task Events & Audit Trail
INSERT INTO user_stories (
  id,
  epic,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  labels,
  dependencies
) VALUES (
  'cs-012',
  'CODE-SYNC',
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
  'database,audit,analytics,tracking',
  'cs-009,cs-010'
);

-- cs-013: Auto-Commit Toggle & Controls
INSERT INTO user_stories (
  id,
  epic,
  title,
  description,
  acceptance_criteria,
  story_points,
  priority,
  status,
  labels,
  dependencies
) VALUES (
  'cs-013',
  'CODE-SYNC',
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
  'ui,task-management,settings,developer-control',
  'cs-010'
);
