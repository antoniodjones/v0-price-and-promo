/**
 * @task cs-010, cs-014
 * @epic Code Sync
 * @description API endpoint to detect code changes and show commit history with GitHub URLs
 */

import { type NextRequest, NextResponse } from "next/server"
import { getAutoCommitAgent, type CodeChangeDetection } from "@/lib/services/auto-commit-agent"
import type { FileChange } from "@/lib/services/github-workflow"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, files, triggeredBy = "agent" } = body

    if (!taskId || !files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Invalid request body. Required: taskId, files[]" }, { status: 400 })
    }

    // Validate file changes
    for (const file of files) {
      if (!file.path || !file.operation) {
        return NextResponse.json({ error: "Each file must have path and operation" }, { status: 400 })
      }
      if (!["create", "update", "delete"].includes(file.operation)) {
        return NextResponse.json({ error: "Invalid operation. Must be: create, update, or delete" }, { status: 400 })
      }
    }

    const detection: CodeChangeDetection = {
      taskId,
      files: files as FileChange[],
      triggeredBy,
      timestamp: new Date(),
    }

    const agent = getAutoCommitAgent()
    await agent.detectChanges(detection)

    return NextResponse.json({
      success: true,
      message: `Detected ${files.length} file changes for task ${taskId}`,
      taskId,
      fileCount: files.length,
    })
  } catch (error) {
    console.error("[v0] Error detecting code changes:", error)
    return NextResponse.json(
      {
        error: "Failed to detect code changes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * GET endpoint to check pending changes and view commit history for a task
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")
    const view = searchParams.get("view") // 'pending' or 'history'

    if (!taskId) {
      return NextResponse.json({ error: "taskId query parameter is required" }, { status: 400 })
    }

    if (view === "history") {
      const supabase = await createClient()

      const { data: task, error: taskError } = await supabase
        .from("user_stories")
        .select("id, git_branch, git_commits, pull_request_url")
        .eq("id", taskId)
        .single()

      if (taskError || !task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 })
      }

      // Get all code changes from code_change_log
      const { data: changes, error: changesError } = await supabase
        .from("code_change_log")
        .select("*")
        .eq("task_id", taskId)
        .order("changed_at", { ascending: false })

      if (changesError) {
        return NextResponse.json({ error: "Failed to fetch changes" }, { status: 500 })
      }

      // Group changes by commit
      const commitMap = new Map<string, any>()

      for (const change of changes || []) {
        const commitSha = change.commit_sha
        if (!commitMap.has(commitSha)) {
          commitMap.set(commitSha, {
            commitSha,
            commitMessage: change.commit_message,
            commitUrl: change.commit_url,
            branchName: change.branch_name,
            author: change.author,
            timestamp: change.changed_at,
            files: [],
            stats: {
              filesChanged: 0,
              linesAdded: 0,
              linesRemoved: 0,
            },
          })
        }

        const commit = commitMap.get(commitSha)
        commit.files.push({
          path: change.file_path,
          changeType: change.change_type,
          linesAdded: change.lines_added,
          linesRemoved: change.lines_removed,
        })
        commit.stats.filesChanged++
        commit.stats.linesAdded += change.lines_added || 0
        commit.stats.linesRemoved += change.lines_removed || 0
      }

      const commits = Array.from(commitMap.values())

      // Calculate total stats
      const totalStats = commits.reduce(
        (acc, commit) => ({
          filesChanged: acc.filesChanged + commit.stats.filesChanged,
          linesAdded: acc.linesAdded + commit.stats.linesAdded,
          linesRemoved: acc.linesRemoved + commit.stats.linesRemoved,
          commits: acc.commits + 1,
        }),
        { filesChanged: 0, linesAdded: 0, linesRemoved: 0, commits: 0 },
      )

      // Generate GitHub URLs
      const githubOwner = process.env.GITHUB_OWNER || "antoniodjones"
      const githubRepo = process.env.GITHUB_REPO || "v0-price-and-promo"
      const branchUrl = task.git_branch
        ? `https://github.com/${githubOwner}/${githubRepo}/tree/${task.git_branch}`
        : null

      return NextResponse.json({
        taskId,
        gitBranch: task.git_branch,
        branchUrl,
        pullRequestUrl: task.pull_request_url,
        commits,
        totalStats,
        hasChanges: commits.length > 0,
      })
    }

    const agent = getAutoCommitAgent()
    const pending = agent.getPendingChanges(taskId)

    if (!pending) {
      return NextResponse.json({
        hasPending: false,
        taskId,
      })
    }

    return NextResponse.json({
      hasPending: true,
      taskId,
      fileCount: pending.files.length,
      triggeredBy: pending.triggeredBy,
      timestamp: pending.timestamp,
    })
  } catch (error) {
    console.error("[v0] Error checking code changes:", error)
    return NextResponse.json(
      {
        error: "Failed to check code changes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
