import { NextResponse } from "next/server"
import { GitLabAPIClient } from "@/lib/services/gitlab-api"

export async function GET() {
  try {
    const gitlabClient = new GitLabAPIClient()
    const isConnected = await gitlabClient.testConnection()

    if (isConnected) {
      const project = await gitlabClient.getProject()
      return NextResponse.json({
        success: true,
        message: "Successfully connected to GitLab",
        project: {
          id: project.id,
          name: project.name,
          path: project.path_with_namespace,
          url: project.web_url,
        },
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to GitLab",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] GitLab connection test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
