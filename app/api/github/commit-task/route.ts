/**
 * @task cs-009
 * @epic Code Sync
 * @description API endpoint for manual GitHub workflow invocation
 */

import { type NextRequest, NextResponse } from "next/server"
import { createGitHubWorkflowService, type FileChange, type GitHubWorkflowConfig } from "@/lib/services/github-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { taskId, files, branchName, commitMessage, createPR, prTitle, prBody, userId } = body

    // Validation
    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 })
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "files array is required and must not be empty" }, { status: 400 })
    }

    // Validate file structure
    for (const file of files) {
      if (!file.path || !file.operation) {
        return NextResponse.json({ error: "Each file must have path and operation" }, { status: 400 })
      }

      if (!["create", "update", "delete"].includes(file.operation)) {
        return NextResponse.json(
          { error: "Invalid file operation. Must be create, update, or delete" },
          { status: 400 },
        )
      }

      if (file.operation !== "delete" && !file.content) {
        return NextResponse.json(
          { error: "File content is required for create and update operations" },
          { status: 400 },
        )
      }
    }

    // Create workflow config
    const config: GitHubWorkflowConfig = {
      taskId,
      auto: false, // Manual invocation
      userId,
      branchName,
      commitMessage,
      createPR: createPR || false,
      prTitle,
      prBody,
    }

    // Execute workflow
    const service = createGitHubWorkflowService()
    const result = await service.executeWorkflow(config, files as FileChange[])

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      branchName: result.branchName,
      commitSha: result.commitSha,
      commitUrl: result.commitUrl,
      prUrl: result.prUrl,
    })
  } catch (error) {
    console.error("[v0] Error in commit-task API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to check workflow status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const taskId = searchParams.get("taskId")

  if (!taskId) {
    return NextResponse.json({ error: "taskId query parameter is required" }, { status: 400 })
  }

  try {
    // Return task's git information
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = createClient()

    const { data, error } = await supabase
      .from("user_stories")
      .select("task_id, git_branch, git_commits, pull_request_url, last_synced_at, metadata")
      .eq("task_id", taskId)
      .single()

    if (error) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const metadata = data.metadata as { auto_commit_enabled?: boolean } | null

    return NextResponse.json({
      taskId: data.task_id,
      gitBranch: data.git_branch,
      gitCommits: data.git_commits,
      pullRequestUrl: data.pull_request_url,
      lastSyncedAt: data.last_synced_at,
      autoCommitEnabled: metadata?.auto_commit_enabled !== false,
    })
  } catch (error) {
    console.error("[v0] Error fetching task status:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
