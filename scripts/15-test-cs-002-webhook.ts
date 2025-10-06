/**
 * Test script for cs-002 GitHub Webhook Integration
 *
 * This script tests the webhook endpoint by simulating a GitHub push event.
 * It verifies that commits are properly parsed, task IDs are extracted,
 * and the code_change_log is populated correctly.
 *
 * Prerequisites:
 * - cs-001 database schema must be deployed
 * - GITHUB_WEBHOOK_SECRET must be set in environment variables
 * - At least one task must exist in user_stories table
 *
 * Usage:
 * 1. Ensure you have a test task in the database (e.g., cs-002)
 * 2. Run this script to send a test webhook payload
 * 3. Check the database to verify the data was recorded
 */

import crypto from "crypto"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/github`
  : "http://localhost:3000/api/webhooks/github"

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

// Sample GitHub push event payload
const testPayload = {
  ref: "refs/heads/main",
  after: "abc123def456",
  repository: {
    full_name: "test-org/test-repo",
    name: "test-repo",
  },
  head_commit: {
    id: "abc123def456",
    message: "cs-002: test webhook integration",
    timestamp: new Date().toISOString(),
    url: "https://github.com/test-org/test-repo/commit/abc123def456",
    author: {
      name: "Test User",
      email: "test@example.com",
    },
    added: ["app/api/webhooks/github/route.ts"],
    modified: ["docs/cs-002-github-webhook-setup.md"],
    removed: [],
  },
  commits: [
    {
      id: "abc123def456",
      message: "cs-002: test webhook integration",
      timestamp: new Date().toISOString(),
      url: "https://github.com/test-org/test-repo/commit/abc123def456",
      author: {
        name: "Test User",
        email: "test@example.com",
      },
      added: ["app/api/webhooks/github/route.ts"],
      modified: ["docs/cs-002-github-webhook-setup.md"],
      removed: [],
    },
  ],
}

async function testWebhook() {
  console.log("🧪 Testing GitHub Webhook Integration (cs-002)")
  console.log("=".repeat(60))
  console.log()

  // Check prerequisites
  if (!WEBHOOK_SECRET) {
    console.error("❌ GITHUB_WEBHOOK_SECRET not set in environment variables")
    console.log("   Please set this variable before testing")
    process.exit(1)
  }

  console.log("✓ GITHUB_WEBHOOK_SECRET is set")
  console.log(`✓ Webhook URL: ${WEBHOOK_URL}`)
  console.log()

  // Create signature
  const payloadString = JSON.stringify(testPayload)
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET)
  const signature = `sha256=${hmac.update(payloadString).digest("hex")}`

  console.log("📤 Sending test webhook payload...")
  console.log(`   Commit: ${testPayload.head_commit.id.substring(0, 7)}`)
  console.log(`   Message: ${testPayload.head_commit.message}`)
  console.log(`   Files: ${testPayload.head_commit.added.length + testPayload.head_commit.modified.length}`)
  console.log()

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-GitHub-Event": "push",
        "X-Hub-Signature-256": signature,
      },
      body: payloadString,
    })

    const result = await response.json()

    console.log(`📥 Response Status: ${response.status}`)
    console.log()

    if (response.ok) {
      console.log("✅ Webhook processed successfully!")
      console.log()
      console.log("Response:", JSON.stringify(result, null, 2))
      console.log()
      console.log("🔍 Next Steps:")
      console.log("   1. Check github_webhooks table for the event record")
      console.log("   2. Check code_change_log table for file changes")
      console.log("   3. Check user_stories table for updated git fields")
      console.log()
      console.log("SQL Queries to verify:")
      console.log()
      console.log("-- Check webhook events")
      console.log("SELECT * FROM github_webhooks ORDER BY created_at DESC LIMIT 5;")
      console.log()
      console.log("-- Check code changes")
      console.log("SELECT * FROM code_change_log ORDER BY changed_at DESC LIMIT 10;")
      console.log()
      console.log("-- Check task updates")
      console.log("SELECT id, title, git_commits, git_branch, related_files FROM user_stories WHERE id = 'cs-002';")
    } else {
      console.error("❌ Webhook failed!")
      console.error()
      console.error("Error:", JSON.stringify(result, null, 2))
      console.error()
      console.error("Troubleshooting:")
      console.error("   - Check that cs-001 database schema is deployed")
      console.error("   - Verify GITHUB_WEBHOOK_SECRET matches")
      console.error("   - Check Vercel logs for detailed error messages")
      console.error("   - Ensure Supabase connection is working")
    }
  } catch (error) {
    console.error("❌ Failed to send webhook request")
    console.error()
    console.error("Error:", error instanceof Error ? error.message : "Unknown error")
    console.error()
    console.error("Possible causes:")
    console.error("   - Application is not running")
    console.error("   - Network connectivity issues")
    console.error("   - Invalid webhook URL")
    process.exit(1)
  }

  console.log()
  console.log("=".repeat(60))
  console.log("✅ Test complete!")
}

// Run the test
testWebhook().catch(console.error)
