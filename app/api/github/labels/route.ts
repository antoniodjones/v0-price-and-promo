/**
 * @task cs-009
 * @epic Code Sync
 * @description API endpoint for GitHub label management
 */

import { type NextRequest, NextResponse } from "next/server"
import { createGitHubWorkflowService } from "@/lib/services/github-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, name, color, description } = body

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 })
    }

    const service = createGitHubWorkflowService()

    switch (action) {
      case "create": {
        if (!name || !color) {
          return NextResponse.json({ error: "name and color are required for create action" }, { status: 400 })
        }

        const label = await service.createLabel(name, color, description)

        return NextResponse.json({ success: true, label })
      }

      case "delete": {
        if (!name) {
          return NextResponse.json({ error: "name is required for delete action" }, { status: 400 })
        }

        await service.deleteLabel(name)

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error in labels API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const service = createGitHubWorkflowService()
    const labels = await service.listLabels()

    return NextResponse.json({ labels })
  } catch (error) {
    console.error("[v0] Error fetching labels:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
