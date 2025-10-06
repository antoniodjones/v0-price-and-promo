/**
 * @task cs-010
 * @epic Code Sync
 * @description API endpoint to manually trigger or cancel auto-commit
 */

import { type NextRequest, NextResponse } from "next/server"
import { getAutoCommitAgent } from "@/lib/services/auto-commit-agent"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, action } = body

    if (!taskId || !action) {
      return NextResponse.json({ error: "Invalid request body. Required: taskId, action" }, { status: 400 })
    }

    const agent = getAutoCommitAgent()

    switch (action) {
      case "trigger":
        await agent.triggerImmediateCommit(taskId)
        return NextResponse.json({
          success: true,
          message: `Triggered immediate commit for task ${taskId}`,
          taskId,
        })

      case "cancel":
        agent.cancelPendingCommit(taskId)
        return NextResponse.json({
          success: true,
          message: `Cancelled pending commit for task ${taskId}`,
          taskId,
        })

      case "enable":
        agent.setEnabled(true)
        return NextResponse.json({
          success: true,
          message: "Auto-commit enabled globally",
        })

      case "disable":
        agent.setEnabled(false)
        return NextResponse.json({
          success: true,
          message: "Auto-commit disabled globally",
        })

      default:
        return NextResponse.json(
          { error: "Invalid action. Must be: trigger, cancel, enable, or disable" },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("[v0] Error triggering auto-commit action:", error)
    return NextResponse.json(
      {
        error: "Failed to execute action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
