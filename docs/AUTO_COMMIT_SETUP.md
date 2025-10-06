# Auto-Commit Setup Guide

## Overview

The auto-commit system automatically pushes code changes to GitHub when v0 makes edits. This eliminates manual commit steps and ensures all changes are tracked.

## Quick Start

### 1. Environment Variables

Add these to your `.env` file or Vercel project settings:

\`\`\`bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
\`\`\`

### 2. Enable Auto-Commit

Run the setup script:

\`\`\`bash
# Enable auto-commit for all refactor tasks
npm run db:execute scripts/35-enable-auto-commit-for-refactors.sql
\`\`\`

### 3. Verify Setup

Check that auto-commit is enabled:

\`\`\`sql
SELECT task_id, metadata->>'auto_commit_enabled' 
FROM user_stories 
WHERE task_id LIKE 'refactor-%';
\`\`\`

## How It Works

1. **Detection**: When v0 makes code changes, the system detects them
2. **Batching**: Changes within 5 seconds are batched together
3. **Commit**: Automatically creates a commit with task ID in message
4. **Push**: Pushes to feature branch (e.g., `feature/refactor-003-c`)
5. **Tracking**: Links commit to task in `code_change_log` table

## Configuration

### Global Settings

Edit `lib/config/auto-commit-config.ts`:

\`\`\`typescript
export const AUTO_COMMIT_CONFIG = {
  enabled: true,           // Enable/disable globally
  batchWindow: 5000,       // Milliseconds to batch changes
  autoCreatePR: false,     // Auto-create pull requests
}
\`\`\`

### Per-Task Settings

Enable/disable for specific tasks via API:

\`\`\`typescript
await fetch(`/api/user-stories/${taskId}/settings`, {
  method: 'PATCH',
  body: JSON.stringify({ auto_commit_enabled: true })
})
\`\`\`

### Task Patterns

Configure auto-commit for task patterns:

- `refactor-*`: 3 second batch window (fast commits)
- `feature-*`: 5 second batch window (standard)
- `bug-*`: 2 second batch window (quick fixes)

## Monitoring

### View Commit History

\`\`\`bash
curl "/api/code-changes/detect?taskId=refactor-003-c&view=history"
\`\`\`

### Check Pending Changes

\`\`\`bash
curl "/api/code-changes/detect?taskId=refactor-003-c&view=pending"
\`\`\`

### Task Timeline

View auto-commit events in the Task Detail Sheet UI.

## Manual Control

### Trigger Immediate Commit

\`\`\`typescript
await fetch('/api/code-changes/trigger', {
  method: 'POST',
  body: JSON.stringify({ taskId: 'refactor-003-c', action: 'commit' })
})
\`\`\`

### Cancel Pending Commit

\`\`\`typescript
import { getAutoCommitAgent } from '@/lib/services/auto-commit-agent'
const agent = getAutoCommitAgent()
agent.cancelPendingCommit('refactor-003-c')
\`\`\`

## Troubleshooting

### Changes Not Pushing

1. Check `GITHUB_TOKEN` is set with `repo` scope
2. Verify auto-commit is enabled: `SELECT metadata FROM user_stories WHERE task_id = 'your-task'`
3. Check console logs for `[v0]` prefixed messages

### Permission Errors

- GitHub token needs `repo` scope for private repositories
- Token must have write access to the repository

### Batch Window Too Long

Adjust in `lib/config/auto-commit-config.ts`:

\`\`\`typescript
batchWindow: 2000  // 2 seconds instead of 5
\`\`\`

## Best Practices

1. **Enable for automation tasks**: Refactors, migrations, bulk updates
2. **Disable for exploratory work**: When you want manual control
3. **Use task patterns**: Configure once, applies to all matching tasks
4. **Monitor the timeline**: Check Task Detail Sheet for commit events
5. **Review before merging**: Auto-commits go to feature branches, not main

## Next Steps

- [GitHub Workflow Guide](./GITHUB_WORKFLOW.md)
- [Task Management](./TASK_MANAGEMENT.md)
- [Code Change Tracking](./CODE_CHANGE_TRACKING.md)
