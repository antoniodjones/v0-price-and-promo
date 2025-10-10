import { NextResponse } from "next/server"
import { JiraAPIClient } from "@/lib/services/jira-api"

export async function GET() {
  try {
    const jiraClient = new JiraAPIClient()
    const result = await jiraClient.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to Jira",
        projectKey: process.env.JIRA_PROJECT_KEY || "PRICE",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Failed to connect to Jira",
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
