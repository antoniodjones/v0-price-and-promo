import { NextResponse } from "next/server"
import { JiraAPIClient } from "@/lib/services/jira-api"

export async function GET() {
  try {
    const jiraClient = new JiraAPIClient()
    const isConnected = await jiraClient.testConnection()

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to Jira",
        projectKey: jiraClient.getProjectKey(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to Jira",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Jira connection test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
