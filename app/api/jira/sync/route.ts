import { type NextRequest, NextResponse } from "next/server"
import { JiraSyncEngine } from "@/lib/services/jira-sync-engine"

export async function POST(request: NextRequest) {
  try {
    const { taskId, direction } = await request.json()

    const syncEngine = new JiraSyncEngine()

    if (taskId) {
      // Sync specific task
      if (direction === "pull") {
        const log = await syncEngine.pullFromJira(taskId)
        return NextResponse.json({ success: true, log })
      } else {
        // Push to Jira - need to fetch story first
        const { createClient } = await import("@/lib/supabase/server")
        const supabase = await createClient()
        const { data: story } = await supabase.from("user_stories").select("*").eq("id", taskId).single()

        if (!story) {
          return NextResponse.json({ error: "Story not found" }, { status: 404 })
        }

        const log = await syncEngine.pushToJira(story)
        return NextResponse.json({ success: true, log })
      }
    } else {
      // Sync all pending stories
      const logs = await syncEngine.syncAll()
      return NextResponse.json({
        success: true,
        synced: logs.length,
        logs,
      })
    }
  } catch (error) {
    console.error("[v0] Error in Jira sync:", error)
    return NextResponse.json(
      { error: "Sync failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()

    // Get sync status
    const { data: logs } = await supabase
      .from("jira_sync_log")
      .select("*")
      .order("synced_at", { ascending: false })
      .limit(50)

    const { data: pendingStories } = await supabase
      .from("user_stories")
      .select("id, title, jira_sync_status")
      .or("jira_sync_status.is.null,jira_sync_status.eq.pending")

    return NextResponse.json({
      recentLogs: logs || [],
      pendingCount: pendingStories?.length || 0,
      pendingStories: pendingStories || [],
    })
  } catch (error) {
    console.error("[v0] Error getting sync status:", error)
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 })
  }
}
