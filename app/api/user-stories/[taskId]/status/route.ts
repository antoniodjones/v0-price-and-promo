import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createTaskEventsService } from "@/lib/services/task-events"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: currentTask, error: fetchError } = await supabase
      .from("user_stories")
      .select("status, metadata")
      .eq("id", taskId)
      .single()

    if (fetchError) {
      console.error("[v0] Failed to fetch current task:", fetchError)
      return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
    }

    const oldStatus = currentTask.status
    const metadata = currentTask.metadata || {}
    const settings = metadata.settings || {
      mode: "agent",
      auto_commit_enabled: true,
      branch_naming_pattern: "feature",
      commit_message_template: "default",
    }

    let updatedSettings = settings
    if (status.toLowerCase() === "completed" && oldStatus.toLowerCase() !== "completed") {
      updatedSettings = {
        ...settings,
        auto_commit_enabled: true,
        mode: "agent",
      }

      // Update metadata with new settings
      const { error: metadataError } = await supabase
        .from("user_stories")
        .update({
          metadata: {
            ...metadata,
            settings: updatedSettings,
          },
        })
        .eq("id", taskId)

      if (metadataError) {
        console.error("[v0] Failed to update metadata:", metadataError)
      } else {
        console.log("[v0] Task completed - auto-enabling auto-commit for task:", taskId)
      }
    }

    const { error: updateError } = await supabase
      .from("user_stories")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)

    if (updateError) {
      console.error("[v0] Failed to update task status:", updateError)
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }

    // Log status change event
    try {
      const eventsService = createTaskEventsService()
      await eventsService.logEvent({
        task_id: taskId,
        event_type: "task_status_changed",
        triggered_by: "user",
        metadata: {
          old_status: oldStatus,
          new_status: status,
          auto_commit_re_enabled: status.toLowerCase() === "completed" && !settings.auto_commit_enabled,
        },
      })
    } catch (eventError) {
      console.error("[v0] Failed to log status change event:", eventError)
    }

    return NextResponse.json({
      success: true,
      status,
      auto_commit_enabled: updatedSettings.auto_commit_enabled,
    })
  } catch (error) {
    console.error("[v0] Error updating task status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
