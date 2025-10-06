import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import crypto from "crypto"

type SupabaseClient = ReturnType<typeof createServerClient>

interface GitHubCommit {
  id: string
  message?: string
  author?: {
    name?: string
    email?: string
  }
  timestamp?: string
  url?: string
  added?: string[]
  modified?: string[]
  removed?: string[]
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] GitHub Webhook: Received request")

    // Verify webhook signature
    const signature = request.headers.get("x-hub-signature-256")
    const body = await request.text()

    if (process.env.GITHUB_WEBHOOK_SECRET) {
      if (!signature) {
        console.error("[v0] GitHub Webhook: Missing signature")
        return NextResponse.json({ error: "Missing signature" }, { status: 401 })
      }

      const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET)
      const digest = `sha256=${hmac.update(body).digest("hex")}`

      if (signature !== digest) {
        console.error("[v0] GitHub Webhook: Invalid signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    const eventType = request.headers.get("x-github-event")

    console.log("[v0] GitHub Webhook: Event type:", eventType)

    // Only process push events
    if (eventType !== "push") {
      console.log("[v0] GitHub Webhook: Ignoring non-push event")
      return NextResponse.json({ message: "Event ignored" }, { status: 200 })
    }

    // Create Supabase client with service role for write access
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    })

    // Store webhook event
    const { data: webhookRecord, error: webhookError } = await supabase
      .from("github_webhooks")
      .insert({
        event_type: eventType,
        event_action: payload.action || null,
        repository: payload.repository?.full_name || null,
        branch: payload.ref?.replace("refs/heads/", "") || null,
        commit_sha: payload.after || null,
        commit_message: payload.head_commit?.message || null,
        author: payload.head_commit?.author?.name || null,
        author_email: payload.head_commit?.author?.email || null,
        files_changed: payload.head_commit?.modified || [],
        payload: payload,
        processed: false,
      })
      .select()
      .single()

    if (webhookError) {
      console.error("[v0] GitHub Webhook: Error storing webhook:", webhookError)
      return NextResponse.json({ error: "Failed to store webhook" }, { status: 500 })
    }

    console.log("[v0] GitHub Webhook: Stored webhook record:", webhookRecord.id)

    // Process commits
    const commits = payload.commits || []
    const branch = payload.ref?.replace("refs/heads/", "") || "unknown"
    const repository = payload.repository?.full_name || "unknown"

    console.log("[v0] GitHub Webhook: Processing", commits.length, "commits")

    let processedCount = 0
    let errorCount = 0

    for (const commit of commits) {
      try {
        await processCommit(supabase, commit, branch, repository)
        processedCount++
      } catch (error) {
        console.error("[v0] GitHub Webhook: Error processing commit:", commit.id, error)
        errorCount++
      }
    }

    // Mark webhook as processed
    await supabase
      .from("github_webhooks")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: errorCount > 0 ? `${errorCount} commits failed to process` : null,
      })
      .eq("id", webhookRecord.id)

    console.log("[v0] GitHub Webhook: Processed", processedCount, "commits,", errorCount, "errors")

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} commits`,
      errors: errorCount,
    })
  } catch (error) {
    console.error("[v0] GitHub Webhook: Fatal error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function processCommit(supabase: SupabaseClient, commit: GitHubCommit, branch: string, repository: string) {
  const commitSha = commit.id
  const commitMessage = commit.message || ""
  const author = commit.author?.name || "unknown"
  const authorEmail = commit.author?.email || ""
  const timestamp = commit.timestamp || new Date().toISOString()
  const commitUrl = commit.url || ""

  console.log("[v0] Processing commit:", commitSha.substring(0, 7), "-", commitMessage.substring(0, 50))

  const taskIds = extractTaskIds(commitMessage)

  console.log("[v0] Found task IDs:", taskIds)

  // Get all modified files
  const allFiles = [...(commit.added || []), ...(commit.modified || []), ...(commit.removed || [])]

  // If no task IDs found, still log the commit but without task association
  if (taskIds.length === 0) {
    console.log("[v0] No task IDs found in commit message, logging without task association")

    // Insert code changes without task_id
    for (const file of allFiles) {
      const changeType = getChangeType(file, commit)

      await supabase.from("code_change_log").insert({
        task_id: null,
        file_path: file,
        component_name: extractComponentName(file),
        change_type: changeType,
        lines_added: 0, // GitHub webhook doesn't provide line counts
        lines_removed: 0,
        commit_sha: commitSha,
        commit_message: commitMessage,
        commit_url: commitUrl,
        branch_name: branch,
        author: author,
        author_email: authorEmail,
        changed_at: timestamp,
        metadata: {
          repository: repository,
          untracked: true,
        },
      })
    }

    return
  }

  // Process each task ID
  for (const taskId of taskIds) {
    // Verify task exists
    const { data: task, error: taskError } = await supabase
      .from("user_stories")
      .select("id, git_commits, git_branch, related_files")
      .eq("id", taskId)
      .single()

    if (taskError || !task) {
      console.log("[v0] Task not found:", taskId, "- skipping")
      continue
    }

    console.log("[v0] Updating task:", taskId)

    // Insert code changes for each file
    for (const file of allFiles) {
      const changeType = getChangeType(file, commit)

      const { error: insertError } = await supabase.from("code_change_log").insert({
        task_id: taskId,
        file_path: file,
        component_name: extractComponentName(file),
        change_type: changeType,
        lines_added: 0, // GitHub webhook doesn't provide line counts
        lines_removed: 0,
        commit_sha: commitSha,
        commit_message: commitMessage,
        commit_url: commitUrl,
        branch_name: branch,
        author: author,
        author_email: authorEmail,
        changed_at: timestamp,
        metadata: {
          repository: repository,
        },
      })

      if (insertError) {
        console.error("[v0] Error inserting code change:", insertError)
      }
    }

    // Update user_stories with git info
    const existingCommits = task.git_commits || []
    const existingFiles = task.related_files || []

    const updatedCommits = Array.from(new Set([...existingCommits, commitSha]))
    const updatedFiles = Array.from(new Set([...existingFiles, ...allFiles]))

    const { error: updateError } = await supabase
      .from("user_stories")
      .update({
        git_commits: updatedCommits,
        git_branch: task.git_branch || branch,
        related_files: updatedFiles,
      })
      .eq("id", taskId)

    if (updateError) {
      console.error("[v0] Error updating user_stories:", updateError)
    }
  }
}

function extractTaskIds(message: string): string[] {
  const taskIds: string[] = []

  // Common patterns:
  // - "cs-003: fix bug"
  // - "[approval-001] add feature"
  // - "tm-005 - update UI"
  // - "FMW-012: refactor"

  // Pattern 1: task-id: or [task-id]
  const pattern1 = /\b([a-z]+-\d+):/gi
  const pattern2 = /\[([a-z]+-\d+)\]/gi
  const pattern3 = /\b([a-z]+-\d+)\s+-/gi

  const matches1 = message.matchAll(pattern1)
  const matches2 = message.matchAll(pattern2)
  const matches3 = message.matchAll(pattern3)

  for (const match of matches1) {
    taskIds.push(match[1].toLowerCase())
  }

  for (const match of matches2) {
    taskIds.push(match[1].toLowerCase())
  }

  for (const match of matches3) {
    taskIds.push(match[1].toLowerCase())
  }

  return Array.from(new Set(taskIds))
}

function getChangeType(file: string, commit: GitHubCommit): string {
  if (commit.added?.includes(file)) {
    return "created"
  } else if (commit.removed?.includes(file)) {
    return "deleted"
  } else if (commit.modified?.includes(file)) {
    return "modified"
  }
  return "modified"
}

function extractComponentName(filePath: string): string | null {
  // Extract component name from React/Next.js files
  const match = filePath.match(/([^/]+)\.(tsx?|jsx?)$/)
  if (match) {
    return match[1]
  }
  return null
}
