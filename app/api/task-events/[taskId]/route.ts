/**
 * @task cs-012
 * @epic Code Sync
 * @description API endpoint to fetch task events
 */

import { type NextRequest, NextResponse } from "next/server"
import { createTaskEventsService } from "@/lib/services/task-events"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const eventsService = createTaskEventsService()
    const events = await eventsService.getTaskEvents(taskId)
    const stats = await eventsService.getTaskStats(taskId)
    const analytics = await eventsService.getContributionAnalytics(taskId)

    return NextResponse.json({
      events,
      stats,
      analytics,
    })
  } catch (error) {
    console.error("Error fetching task events:", error)
    return NextResponse.json({ error: "Failed to fetch task events" }, { status: 500 })
  }
}
