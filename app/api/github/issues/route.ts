/**
 * @task cs-009
 * @epic Code Sync
 * @description API endpoint for GitHub issue management
 */

import { type NextRequest, NextResponse } from "next/server"
import { createGitHubWorkflowService } from "@/lib/services/github-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, issueNumber, title, body: issueBody, labels, assignees, state, comment } = body

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 })
    }

    const service = createGitHubWorkflowService()

    switch (action) {
      case "create": {
        if (!title || !issueBody) {
          return NextResponse.json({ error: "title and body are required for create action" }, { status: 400 })
        }

        const issue = await service.createIssue({
          title,
          body: issueBody,
          labels,
          assignees,
        })

        return NextResponse.json({ success: true, issue })
      }

      case "update": {
        if (!issueNumber) {
          return NextResponse.json({ error: "issueNumber is required for update action" }, { status: 400 })
        }

        const issue = await service.updateIssue(issueNumber, {
          title,
          body: issueBody,
          state,
          labels,
          assignees,
        })

        return NextResponse.json({ success: true, issue })
      }

      case "close": {
        if (!issueNumber) {
          return NextResponse.json({ error: "issueNumber is required for close action" }, { status: 400 })
        }

        const issue = await service.closeIssue(issueNumber)

        return NextResponse.json({ success: true, issue })
      }

      case "comment": {
        if (!issueNumber || !comment) {
          return NextResponse.json(
            { error: "issueNumber and comment are required for comment action" },
            { status: 400 },
          )
        }

        const result = await service.addIssueComment(issueNumber, comment)

        return NextResponse.json({ success: true, comment: result })
      }

      case "addLabels": {
        if (!issueNumber || !labels || !Array.isArray(labels)) {
          return NextResponse.json(
            { error: "issueNumber and labels array are required for addLabels action" },
            { status: 400 },
          )
        }

        const updatedLabels = await service.addLabels(issueNumber, labels)

        return NextResponse.json({ success: true, labels: updatedLabels })
      }

      case "removeLabel": {
        if (!issueNumber || !labels || !labels[0]) {
          return NextResponse.json(
            { error: "issueNumber and label are required for removeLabel action" },
            { status: 400 },
          )
        }

        await service.removeLabel(issueNumber, labels[0])

        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error in issues API:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const issueNumber = searchParams.get("issueNumber")
    const state = (searchParams.get("state") as "open" | "closed" | "all") || "open"
    const labels = searchParams.get("labels")?.split(",").filter(Boolean)

    const service = createGitHubWorkflowService()

    if (issueNumber) {
      const issue = await service.getIssue(Number.parseInt(issueNumber))
      return NextResponse.json({ issue })
    }

    const issues = await service.listIssues(state, labels)
    return NextResponse.json({ issues })
  } catch (error) {
    console.error("[v0] Error fetching issues:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
