import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createTaskEventsService } from "@/lib/services/task-events"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params

    console.log("[v0] Fetching settings for task:", taskId)

    const supabase = await createClient()
    const { data: task, error } = await supabase.from("user_stories").select("metadata").eq("id", taskId).single()

    if (error) {
      console.error("[v0] Database error fetching task metadata:", error)
      // Return default settings if task not found
      return NextResponse.json({
        settings: {
          mode: "agent",
          auto_commit_enabled: true,
          branch_naming_pattern: "feature",
          commit_message_template: "default",
        },
      })
    }

    const metadata = task?.metadata || {}
    const settings = {
      mode: metadata.mode || "agent",
      auto_commit_enabled: metadata.auto_commit_enabled ?? true,
      branch_naming_pattern: metadata.branch_naming_pattern || "feature",
      commit_message_template: metadata.commit_message_template || "default",
    }

    console.log("[v0] Returning settings from database:", settings)

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("[v0] Error fetching task settings:", error)
    return NextResponse.json(
      {
        settings: {
          mode: "agent",
          auto_commit_enabled: true,
          branch_naming_pattern: "feature",
          commit_message_template: "default",
        },
      },
      { status: 200 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params
    const body = await request.json()
    const { mode, auto_commit_enabled, branch_naming_pattern, commit_message_template } = body

    const supabase = await createClient()

    const { data: currentTask } = await supabase.from("user_stories").select("metadata").eq("id", taskId).single()

    const currentMetadata = currentTask?.metadata || {}

    const updatedMetadata = {
      ...currentMetadata,
      ...(mode && { mode }),
      ...(auto_commit_enabled !== undefined && { auto_commit_enabled }),
      ...(branch_naming_pattern && { branch_naming_pattern }),
      ...(commit_message_template && { commit_message_template }),
    }

    const { error: updateError } = await supabase
      .from("user_stories")
      .update({ metadata: updatedMetadata })
      .eq("id", taskId)

    if (updateError) {
      console.error("[v0] Error updating task metadata:", updateError)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    if (mode !== undefined || auto_commit_enabled !== undefined) {
      try {
        const eventsService = createTaskEventsService()
        await eventsService.logEvent(taskId, mode !== undefined ? "mode_changed" : "auto_commit_toggled", "user", {
          mode,
          auto_commit_enabled,
          changed_at: new Date().toISOString(),
        })
      } catch (eventError) {
        console.error("[v0] Failed to log settings change event:", eventError)
      }
    }

    return NextResponse.json({
      success: true,
      settings: {
        mode: updatedMetadata.mode,
        auto_commit_enabled: updatedMetadata.auto_commit_enabled,
        branch_naming_pattern: updatedMetadata.branch_naming_pattern,
        commit_message_template: updatedMetadata.commit_message_template,
      },
    })
  } catch (error) {
    console.error("[v0] Error updating task settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
