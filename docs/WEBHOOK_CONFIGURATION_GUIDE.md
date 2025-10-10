# Webhook Configuration Guide

Complete guide for setting up Jira and GitLab webhooks to integrate with the GTI Promotions pricing engine.

---

## Prerequisites

Before configuring webhooks, ensure you have:

1. **Deployed Application**: Your app must be deployed and accessible via HTTPS
2. **Environment Variables**: All required env vars configured in Vercel
3. **Admin Access**: Admin permissions in both Jira and GitLab

---

## Jira Webhook Configuration

### Step 1: Get Your Webhook URL

Your Jira webhook endpoint is:
\`\`\`
https://your-app-domain.vercel.app/api/webhooks/jira
\`\`\`

### Step 2: Create Webhook in Jira

1. **Navigate to Jira Settings**
   - Go to Jira → Settings (gear icon) → System
   - Click "WebHooks" in the left sidebar

2. **Create New Webhook**
   - Click "Create a WebHook"
   - Name: `GTI Pricing Engine Sync`
   - Status: Enabled
   - URL: `https://your-app-domain.vercel.app/api/webhooks/jira`

3. **Configure Events**
   Select these events:
   - ✅ Issue → created
   - ✅ Issue → updated
   - ✅ Issue → deleted
   - ✅ Issue → assigned
   - ✅ Comment → created

4. **Set JQL Filter** (Optional)
   To only sync specific issues:
   \`\`\`jql
   project = PRICE OR project = CM OR project = CS OR project = GL
   \`\`\`

5. **Configure Security**
   - Leave "Exclude body" unchecked
   - Add custom header for verification:
     - Header: `X-Webhook-Secret`
     - Value: Your `JIRA_WEBHOOK_SECRET` from env vars

6. **Save Webhook**

### Step 3: Test Jira Webhook

1. Create a test issue in Jira
2. Check your app logs for webhook receipt
3. Verify the issue appears in your user stories table

---

## GitLab Webhook Configuration

### Step 1: Get Your Webhook URL

Your GitLab webhook endpoint is:
\`\`\`
https://your-app-domain.vercel.app/api/webhooks/gitlab
\`\`\`

### Step 2: Create Webhook in GitLab

1. **Navigate to Project Settings**
   - Go to your GitLab project: `Green_Thumb/ecom/v0-price-and-promo`
   - Click Settings → Webhooks

2. **Add New Webhook**
   - URL: `https://your-app-domain.vercel.app/api/webhooks/gitlab`
   - Secret token: Your `GITLAB_WEBHOOK_SECRET` from env vars

3. **Configure Triggers**
   Select these events:
   - ✅ Push events (all branches)
   - ✅ Tag push events
   - ✅ Merge request events
   - ✅ Wiki page events (optional)

4. **SSL Verification**
   - ✅ Enable SSL verification

5. **Add Webhook**

### Step 3: Test GitLab Webhook

1. Make a test commit with a task ID in the message:
   \`\`\`bash
   git commit -m "PROD-001: Test webhook integration"
   git push
   \`\`\`

2. Check GitLab webhook logs:
   - Settings → Webhooks → Edit → Recent Deliveries

3. Verify the commit appears in your `code_change_log` table

---

## GitHub Webhook Configuration (Already Configured)

Your GitHub webhook should already be configured. To verify:

1. Go to your GitHub repo → Settings → Webhooks
2. Verify webhook URL: `https://your-app-domain.vercel.app/api/webhooks/github`
3. Ensure these events are selected:
   - ✅ Push
   - ✅ Pull request
   - ✅ Issue comment

---

## Environment Variables Checklist

Ensure all these environment variables are set in Vercel:

### Jira Variables
\`\`\`bash
JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=PRICE
JIRA_WEBHOOK_SECRET=your_random_secret_string
\`\`\`

### GitLab Variables
\`\`\`bash
GITLAB_BASE_URL=https://gitlab.com
GITLAB_TOKEN=your_gitlab_personal_access_token
GITLAB_PROJECT_ID=Green_Thumb/ecom/v0-price-and-promo
GITLAB_WEBHOOK_SECRET=your_random_secret_string
\`\`\`

### GitHub Variables (Already Set)
\`\`\`bash
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_github_secret
GITHUB_OWNER=your_github_owner
GITHUB_REPO=your_github_repo
\`\`\`

---

## Generating Webhook Secrets

For security, generate strong random secrets:

\`\`\`bash
# Generate a random secret (Mac/Linux)
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

Use the same secret in both:
1. Your environment variable (`JIRA_WEBHOOK_SECRET` or `GITLAB_WEBHOOK_SECRET`)
2. The webhook configuration in Jira/GitLab

---

## Webhook Payload Examples

### Jira Issue Created
\`\`\`json
{
  "webhookEvent": "jira:issue_created",
  "issue": {
    "key": "PRICE-123",
    "fields": {
      "summary": "Add volume pricing feature",
      "description": "Implement volume-based pricing...",
      "status": { "name": "To Do" },
      "priority": { "name": "High" },
      "assignee": { "displayName": "John Doe" }
    }
  }
}
\`\`\`

### GitLab Push Event
\`\`\`json
{
  "object_kind": "push",
  "project": {
    "id": 12345,
    "name": "v0-price-and-promo"
  },
  "commits": [
    {
      "id": "abc123...",
      "message": "PROD-001: Add product detail page",
      "author": { "name": "Jane Smith" },
      "added": ["app/products/[id]/page.tsx"],
      "modified": ["lib/services/products.ts"],
      "removed": []
    }
  ]
}
\`\`\`

---

## Troubleshooting

### Webhook Not Firing

1. **Check Webhook Status**
   - Jira: Settings → System → WebHooks → View recent deliveries
   - GitLab: Settings → Webhooks → Edit → Recent Deliveries

2. **Verify URL is Accessible**
   \`\`\`bash
   curl -X POST https://your-app-domain.vercel.app/api/webhooks/jira \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   \`\`\`

3. **Check Application Logs**
   - Vercel Dashboard → Your Project → Logs
   - Look for webhook receipt messages

### Webhook Failing

1. **Verify Secret Token**
   - Ensure `JIRA_WEBHOOK_SECRET` matches the secret in Jira
   - Ensure `GITLAB_WEBHOOK_SECRET` matches the secret in GitLab

2. **Check Payload Format**
   - Enable debug logging in webhook handlers
   - Inspect the payload structure

3. **SSL Certificate Issues**
   - Ensure your domain has a valid SSL certificate
   - GitLab requires valid SSL for webhooks

### Data Not Syncing

1. **Check Database Connection**
   - Verify Supabase connection is active
   - Check `jira_sync_log` table for errors

2. **Verify Task ID Format**
   - Commit messages must contain task IDs like `PROD-001`, `CM-003`
   - Regex pattern: `/([A-Z]+-\d+)/g`

3. **Check Sync Engine Logs**
   - Look for sync errors in application logs
   - Verify `jira_sync_status` field in `user_stories` table

---

## Testing Checklist

### Jira Integration
- [ ] Create issue in Jira → Appears in local DB
- [ ] Update issue in Jira → Updates local DB
- [ ] Create task locally → Creates Jira issue
- [ ] Update task locally → Updates Jira issue
- [ ] Manual sync button works
- [ ] Sync status shows in UI

### GitLab Integration
- [ ] Push commit with task ID → Links to task
- [ ] Commit appears in `code_change_log`
- [ ] File changes are tracked
- [ ] Lines added/removed calculated correctly
- [ ] Multiple commits in one push all processed

### Dual Deployment
- [ ] Push to GitHub → Webhook received
- [ ] Push to GitLab → Webhook received
- [ ] Both providers show in UI
- [ ] Code changes tracked from both sources

---

## Security Best Practices

1. **Use Strong Secrets**
   - Generate random 32+ character secrets
   - Never commit secrets to git
   - Rotate secrets periodically

2. **Verify Webhook Signatures**
   - Always verify the webhook secret
   - Reject requests with invalid signatures

3. **Use HTTPS Only**
   - Never use HTTP for webhooks
   - Ensure valid SSL certificates

4. **Limit Webhook Scope**
   - Only enable necessary events
   - Use JQL filters in Jira to limit issues

5. **Monitor Webhook Activity**
   - Review webhook logs regularly
   - Set up alerts for failed webhooks

---

## Next Steps

After configuring webhooks:

1. **Run Retroactive Audit**
   - Import historical commits: `npm run audit:retroactive`
   - Verify historical data in `code_change_log`

2. **Configure Sync Schedule**
   - Set up scheduled sync in settings UI
   - Test manual sync button

3. **Train Team**
   - Show team how to use task IDs in commits
   - Demonstrate the Task-Code Linker UI

4. **Monitor Integration Health**
   - Check Analytics Dashboard regularly
   - Review sync success rates

---

*Last Updated: 2025-01-09*  
*Version: 1.0*
