# CS-002: GitHub Webhook Setup Guide

## Overview

This guide explains how to set up the GitHub webhook integration for automatic code-to-task tracking.

## Prerequisites

1. Database schema from cs-001 must be deployed
2. GitHub repository with admin access
3. Vercel deployment or public URL for webhook endpoint

## Setup Steps

### 1. Add Environment Variable

Add the following environment variable to your Vercel project:

\`\`\`
GITHUB_WEBHOOK_SECRET=your-secure-random-string
\`\`\`

Generate a secure secret:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

### 2. Configure GitHub Webhook

1. Go to your GitHub repository
2. Navigate to **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: (paste the same secret from step 1)
   - **Events**: Select "Just the push event"
   - **Active**: ✓ Checked

4. Click **Add webhook**

### 3. Test the Webhook

Make a commit with a task ID in the message:

\`\`\`bash
git commit -m "cs-002: test webhook integration"
git push
\`\`\`

Check the webhook delivery in GitHub:
- Go to **Settings** → **Webhooks** → Click your webhook
- View **Recent Deliveries**
- Should see a 200 response

### 4. Verify Database Updates

Query the database to confirm data was recorded:

\`\`\`sql
-- Check webhook events
SELECT * FROM github_webhooks ORDER BY created_at DESC LIMIT 5;

-- Check code changes
SELECT * FROM code_change_log ORDER BY changed_at DESC LIMIT 10;

-- Check task updates
SELECT id, title, git_commits, git_branch, related_files 
FROM user_stories 
WHERE git_commits IS NOT NULL AND array_length(git_commits, 1) > 0;
\`\`\`

## Commit Message Format

To link commits to tasks, use one of these formats:

- `task-id: description` → `cs-003: fix validation bug`
- `[task-id] description` → `[approval-001] add approval UI`
- `task-id - description` → `tm-005 - update dashboard`

**Examples:**
\`\`\`
cs-002: implement webhook endpoint
[cs-003] add retroactive audit script
approval-001 - create approval database schema
\`\`\`

## What Gets Tracked

For each commit, the webhook records:

1. **code_change_log table:**
   - File path
   - Change type (created/modified/deleted)
   - Commit SHA, message, author
   - Branch name
   - Timestamp

2. **user_stories table:**
   - `git_commits` array (all commit SHAs)
   - `git_branch` (feature branch)
   - `related_files` array (all modified files)

3. **github_webhooks table:**
   - Complete webhook payload
   - Processing status
   - Error messages (if any)

## Troubleshooting

### Webhook Returns 401 (Unauthorized)

- Check that `GITHUB_WEBHOOK_SECRET` matches in both GitHub and Vercel
- Verify the secret is set correctly in environment variables

### Webhook Returns 500 (Server Error)

- Check Vercel logs for detailed error messages
- Verify database schema is deployed (cs-001)
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set

### Commits Not Linking to Tasks

- Verify task ID exists in `user_stories` table
- Check commit message format matches patterns
- Task IDs are case-insensitive but must match exactly

### Files Not Appearing in related_files

- Check that files are actually modified in the commit
- Verify the webhook payload includes file changes
- Check `code_change_log` table for raw data

## GitLab Webhook (Future)

Once GitHub webhook is working, we'll create a similar endpoint for GitLab at:
- `/api/webhooks/gitlab`

The implementation will be similar but adapted for GitLab's webhook payload format.

## Support

For issues or questions:
1. Check Vercel logs: `vercel logs`
2. Check GitHub webhook deliveries
3. Query database tables for debugging
4. Review this documentation

## Next Steps

After webhook is working:
1. Test with multiple commits
2. Verify task updates are accurate
3. Build cs-003 for retroactive audit
4. Create GitLab webhook variant
