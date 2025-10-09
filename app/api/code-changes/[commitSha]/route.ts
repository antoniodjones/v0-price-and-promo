/**
 * @task cs-014
 * @epic CODE-SYNC
 * @description API endpoint to retrieve details of a specific commit
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ commitSha: string }> }) {
  try {
    const { commitSha } = await params

    console.log(`[v0] Fetching commit details for: ${commitSha}`)

    const supabase = await createClient()

    // Fetch all file changes for this commit
    const { data: fileChanges, error: changesError } = await supabase
      .from("code_change_log")
      .select("*")
      .eq("commit_sha", commitSha)
      .order("file_path", { ascending: true })

    if (changesError) {
      console.error("[v0] Error fetching commit details:", changesError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch commit details",
          message: changesError.message,
        },
        { status: 500 },
      )
    }

    if (!fileChanges || fileChanges.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Commit not found",
          message: `No commit found with SHA: ${commitSha}`,
        },
        { status: 404 },
      )
    }

    // Extract commit metadata from first record
    const firstChange = fileChanges[0]
    const commitDetails = {
      commit_sha: commitSha,
      commit_message: firstChange.commit_message || "",
      commit_url: firstChange.commit_url || "",
      branch_name: firstChange.branch_name || "",
      author: firstChange.author || "",
      author_email: firstChange.author_email || "",
      changed_at: firstChange.changed_at || "",
      task_id: firstChange.task_id || null,
      jira_issue_key: firstChange.jira_issue_key || null,
      synced_to_jira: firstChange.synced_to_jira || false,
    }

    // Process file changes
    const files = fileChanges.map((change) => ({
      id: change.id,
      file_path: change.file_path,
      change_type: change.change_type,
      lines_added: change.lines_added || 0,
      lines_removed: change.lines_removed || 0,
      component_name: change.component_name,
      metadata: change.metadata,
    }))

    // Calculate statistics
    const stats = {
      files_changed: files.length,
      total_lines_added: files.reduce((sum, f) => sum + f.lines_added, 0),
      total_lines_removed: files.reduce((sum, f) => sum + f.lines_removed, 0),
      change_types: {
        created: files.filter((f) => f.change_type === "created").length,
        modified: files.filter((f) => f.change_type === "modified").length,
        deleted: files.filter((f) => f.change_type === "deleted").length,
      },
      file_types: Array.from(new Set(files.map((f) => f.file_path.split(".").pop() || "unknown"))),
    }

    console.log(`[v0] Found commit ${commitSha} with ${files.length} file changes`)

    return NextResponse.json({
      success: true,
      data: {
        commit: commitDetails,
        files,
        stats,
      },
      message: "Commit details retrieved successfully",
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/code-changes/[commitSha]:", error)
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
