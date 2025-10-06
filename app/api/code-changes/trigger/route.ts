/**
 * @task cs-010, cs-014
 * @epic Code Sync
 * @description API endpoint to manually trigger auto-commit or sync to GitHub
 */

import { type NextRequest, NextResponse } from "next/server"
import { getAutoCommitAgent } from "@/lib/services/auto-commit-agent"
import { createGitHubWorkflowService, type FileChange } from "@/lib/services/github-workflow"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, action, files, userId } = body

    if (!taskId || !action) {
      return NextResponse.json({ error: "Invalid request body. Required: taskId, action" }, { status: 400 })
    }

    const agent = getAutoCommitAgent()

    switch (action) {
      case "sync":
        if (!files || !Array.isArray(files) || files.length === 0) {
          return NextResponse.json({ error: "files array is required for sync action" }, { status: 400 })
        }

        // Get task info to determine branch name
        const supabase = await createClient()
        const { data: task } = await supabase
          .from("user_stories")
          .select("task_id, git_branch, title")
          .eq("task_id", taskId)
          .single()

        const branchName = task?.git_branch || `feature/${taskId}`
        const commitMessage = `[${taskId}] Manual sync: ${files.length} file(s) updated`

        // Execute GitHub workflow
        const service = createGitHubWorkflowService()
        const result = await service.executeWorkflow(
          {
            taskId,
            auto: false,
            userId,
            branchName,
            commitMessage,
            createPR: false,
          },
          files as FileChange[],
        )

        if (!result.success) {
          return NextResponse.json({ error: result.error }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: `Synced ${files.length} file(s) to GitHub`,
          taskId,
          branchName: result.branchName,
          commitSha: result.commitSha,
          commitUrl: result.commitUrl,
          branchUrl: `https://github.com/${process.env.GITHUB_OWNER || "antoniodjones"}/${process.env.GITHUB_REPO || "v0-price-and-promo"}/tree/${result.branchName}`,
        })

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
          { error: "Invalid action. Must be: sync, trigger, cancel, enable, or disable" },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("[v0] Error executing action:", error)
    return NextResponse.json(
      {
        error: "Failed to execute action",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
