/**
 * @task cs-010
 * @epic Code Sync
 * @description API endpoint to detect code changes and trigger auto-commit
 */

import { type NextRequest, NextResponse } from "next/server"
import { getAutoCommitAgent, type CodeChangeDetection } from "@/lib/services/auto-commit-agent"
import type { FileChange } from "@/lib/services/github-workflow"

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
 * GET endpoint to check pending changes for a task
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "taskId query parameter is required" }, { status: 400 })
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
    console.error("[v0] Error checking pending changes:", error)
    return NextResponse.json(
      {
        error: "Failed to check pending changes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
