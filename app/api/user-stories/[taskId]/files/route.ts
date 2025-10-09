/**
 * @task cs-014
 * @epic CODE-SYNC
 * @description API endpoint to retrieve all related files for a specific task
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId } = await params

    console.log(`[v0] Fetching related files for task: ${taskId}`)

    const supabase = await createClient()

    // Fetch unique files from code_change_log
    const { data: codeChanges, error: changesError } = await supabase
      .from("code_change_log")
      .select("file_path, change_type, component_name, lines_added, lines_removed, changed_at, commit_sha, commit_url")
      .eq("task_id", taskId)
      .order("changed_at", { ascending: false })

    if (changesError) {
      console.error("[v0] Error fetching files:", changesError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch files",
          message: changesError.message,
        },
        { status: 500 },
      )
    }

    // Group by file path and aggregate changes
    const fileMap = new Map<
      string,
      {
        file_path: string
        component_name: string | null
        total_changes: number
        total_lines_added: number
        total_lines_removed: number
        last_modified: string
        change_types: string[]
        commits: Array<{
          commit_sha: string
          commit_url: string
          changed_at: string
          lines_added: number
          lines_removed: number
          change_type: string
        }>
      }
    >()

    codeChanges?.forEach((change) => {
      const filePath = change.file_path

      if (!fileMap.has(filePath)) {
        fileMap.set(filePath, {
          file_path: filePath,
          component_name: change.component_name,
          total_changes: 0,
          total_lines_added: 0,
          total_lines_removed: 0,
          last_modified: change.changed_at || "",
          change_types: [],
          commits: [],
        })
      }

      const file = fileMap.get(filePath)!
      file.total_changes++
      file.total_lines_added += change.lines_added || 0
      file.total_lines_removed += change.lines_removed || 0

      if (!file.change_types.includes(change.change_type)) {
        file.change_types.push(change.change_type)
      }

      if (change.changed_at && change.changed_at > file.last_modified) {
        file.last_modified = change.changed_at
      }

      file.commits.push({
        commit_sha: change.commit_sha || "",
        commit_url: change.commit_url || "",
        changed_at: change.changed_at || "",
        lines_added: change.lines_added || 0,
        lines_removed: change.lines_removed || 0,
        change_type: change.change_type,
      })
    })

    const files = Array.from(fileMap.values())

    // Sort by last modified (most recent first)
    files.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime())

    // Calculate summary
    const summary = {
      total_files: files.length,
      total_changes: files.reduce((sum, f) => sum + f.total_changes, 0),
      total_lines_added: files.reduce((sum, f) => sum + f.total_lines_added, 0),
      total_lines_removed: files.reduce((sum, f) => sum + f.total_lines_removed, 0),
      file_types: Array.from(new Set(files.map((f) => f.file_path.split(".").pop() || "unknown"))),
    }

    console.log(`[v0] Found ${files.length} unique files for task ${taskId}`)

    return NextResponse.json({
      success: true,
      data: {
        task_id: taskId,
        files,
        summary,
      },
      message: "Related files retrieved successfully",
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/user-stories/[taskId]/files:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
