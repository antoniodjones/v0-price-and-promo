-- Add GitHub Enhancement tasks (cs-014 through cs-016)
-- These tasks enhance GitHub integration with additional developer workflow features

-- cs-014: Code Changes Detection & View API
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
  'cs-014',
  'CODE-SYNC',
  'Code Changes Detection & View API',
  'Create API endpoints to detect pending code changes and trigger GitHub sync. Enables "View Changes" and "Sync to GitHub" actions in task menu.',
  '- Create /api/code-changes/detect endpoint to find uncommitted changes
- Create /api/code-changes/trigger endpoint to manually sync to GitHub
- Detect file changes for specific task
- Show file diffs and change summary
- Support manual sync trigger with task context
- Return GitHub URLs for created commits/branches
- Handle errors gracefully with user feedback',
  5,
  'high',
  'todo',
  'api,github,code-detection,developer-tools',
  'cs-009,cs-011'
);

-- cs-015: GitHub Links & Navigation
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
  'cs-015',
  'CODE-SYNC',
  'GitHub Links & Navigation',
  'Make all GitHub references (commits, branches, PRs) clickable links that open the actual GitHub repository. Add "View on GitHub" action to task menu.',
  '- Add "View on GitHub" action to task menu
- Generate GitHub URLs for branches, commits, PRs
- Make commit IDs clickable links in UI
- Make branch names clickable links
- Make PR numbers clickable links
- Open links in new tab
- Handle missing GitHub data gracefully
- Show GitHub icon next to links',
  3,
  'high',
  'todo',
  'ui,github,navigation,developer-experience',
  'cs-011,cs-012'
);

-- cs-016: Advanced GitHub Actions
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
  'cs-016',
  'CODE-SYNC',
  'Advanced GitHub Actions',
  'Add advanced GitHub workflow actions: Merge PR, View PR Status, View Commit History. Complete the developer workflow loop.',
  '- Add "Merge Pull Request" action with merge options
- Add "View PR Status" showing CI/CD, reviews, conflicts
- Add "View Commit History" showing all task commits
- Add "Request Review" to assign reviewers
- Show PR approval status and checks
- Handle merge conflicts and errors
- Display commit timeline with authors and messages
- Link to GitHub for detailed views',
  8,
  'medium',
  'todo',
  'api,github,pr-management,developer-workflow',
  'cs-009,cs-011,cs-015'
);
