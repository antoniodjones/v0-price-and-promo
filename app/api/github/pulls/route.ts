/**
 * @task cs-009
 * @epic Code Sync
 * @description API endpoint for GitHub pull request management
 */

import { type NextRequest, NextResponse } from "next/server"
import { createGitHubWorkflowService } from "@/lib/services/github-workflow"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      action,
      prNumber,
      title,
      body: prBody,
      state,
      base,
      comment,
      commitTitle,
      commitMessage,
      mergeMethod,
    } = body

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 })
    }

    const service = createGitHubWorkflowService()

    switch (action) {
      case "update": {
        if (!prNumber) {
          return NextResponse.json({ error: "prNumber is required for update action" }, { status: 400 })
        }

        const pr = await service.updatePullRequest(prNumber, {
          title,
          body: prBody,
          state,
          base,
        })

        return NextResponse.json({ success: true, pr })
      }

      case "merge": {
        if (!prNumber) {
          return NextResponse.json({ error: "prNumber is required for merge action" }, { status: 400 })
        }

        const result = await service.mergePullRequest(prNumber, commitTitle, commitMessage, mergeMethod || "merge")

        return NextResponse.json({ success: true, merge: result })
      }

      case "close": {
        if (!prNumber) {
          return NextResponse.json({ error: "prNumber is required for close action" }, { status: 400 })
        }

        const pr = await service.closePullRequest(prNumber)

        return NextResponse.json({ success: true, pr })
      }

      case "comment": {
        if (!prNumber || !comment) {
          return NextResponse.json({ error: "prNumber and comment are required for comment action" }, { status: 400 })
        }

        const result = await service.addPRComment(prNumber, comment)

        return NextResponse.json({ success: true, comment: result })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error in pulls API:", error)
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
    const prNumber = searchParams.get("prNumber")
    const state = (searchParams.get("state") as "open" | "closed" | "all") || "open"

    const service = createGitHubWorkflowService()

    if (prNumber) {
      const pr = await service.getPullRequest(Number.parseInt(prNumber))
      return NextResponse.json({ pr })
    }

    const prs = await service.listPullRequests(state)
    return NextResponse.json({ prs })
  } catch (error) {
    console.error("[v0] Error fetching pull requests:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
