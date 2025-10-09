import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createTaskEventsService } from "@/lib/services/task-events"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params
    const body = await request.json()

    console.log("[v0] Updating task:", taskId, "with data:", Object.keys(body))

    const supabase = await createClient()

    // Fetch current task to compare changes
    const { data: currentTask, error: fetchError } = await supabase
      .from("user_stories")
      .select("*")
      .eq("id", taskId)
      .single()

    if (fetchError) {
      console.error("[v0] Failed to fetch current task:", fetchError)
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Update the task
    const { data: updatedTask, error: updateError } = await supabase
      .from("user_stories")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Failed to update task:", updateError)
      return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
    }

    // Log the update event
    try {
      const eventsService = createTaskEventsService()

      // Determine which fields changed
      const changedFields = Object.keys(body).filter((key) => currentTask[key] !== body[key])

      await eventsService.logEvent(taskId, "task_updated", "user", {
        changed_fields: changedFields,
        old_values: changedFields.reduce(
          (acc, field) => {
            acc[field] = currentTask[field]
            return acc
          },
          {} as Record<string, any>,
        ),
        new_values: changedFields.reduce(
          (acc, field) => {
            acc[field] = body[field]
            return acc
          },
          {} as Record<string, any>,
        ),
      })

      console.log("[v0] Task updated successfully:", taskId, "Changed fields:", changedFields)
    } catch (eventError) {
      console.error("[v0] Failed to log update event:", eventError)
      // Don't fail the request if event logging fails
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
    })
  } catch (error) {
    console.error("[v0] Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
