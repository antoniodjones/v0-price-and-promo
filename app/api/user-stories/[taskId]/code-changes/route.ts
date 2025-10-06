/**
 * @task cs-014
 * @epic CODE-SYNC
 * @description API endpoint to retrieve all code changes (commits and files) for a specific task
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const { taskId } = params

    console.log(`[v0] Fetching code changes for task: ${taskId}`)

    const supabase = await createClient()

    // Fetch all code changes for this task from code_change_log
    const { data: codeChanges, error: changesError } = await supabase
      .from("code_change_log")
      .select("*")
      .eq("task_id", taskId)
      .order("changed_at", { ascending: false })

    if (changesError) {
      console.error("[v0] Error fetching code changes:", changesError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch code changes",
          message: changesError.message,
        },
        { status: 500 },
      )
    }

    // Group changes by commit
    const commitMap = new Map<
      string,
      {
        commit_sha: string
        commit_message: string
        commit_url: string
        branch_name: string
        author: string
        author_email: string
        changed_at: string
        files: Array<{
          id: string
          file_path: string
          change_type: string
          lines_added: number
          lines_removed: number
          component_name: string | null
        }>
        total_lines_added: number
        total_lines_removed: number
        files_changed: number
      }
    >()

    codeChanges?.forEach((change) => {
      const commitSha = change.commit_sha
      if (!commitSha) return

      if (!commitMap.has(commitSha)) {
        commitMap.set(commitSha, {
          commit_sha: commitSha,
          commit_message: change.commit_message || "",
          commit_url: change.commit_url || "",
          branch_name: change.branch_name || "",
          author: change.author || "",
          author_email: change.author_email || "",
          changed_at: change.changed_at || "",
          files: [],
          total_lines_added: 0,
          total_lines_removed: 0,
          files_changed: 0,
        })
      }

      const commit = commitMap.get(commitSha)!
      commit.files.push({
        id: change.id,
        file_path: change.file_path,
        change_type: change.change_type,
        lines_added: change.lines_added || 0,
        lines_removed: change.lines_removed || 0,
        component_name: change.component_name,
      })
      commit.total_lines_added += change.lines_added || 0
      commit.total_lines_removed += change.lines_removed || 0
      commit.files_changed = commit.files.length
    })

    const commits = Array.from(commitMap.values())

    // Calculate summary statistics
    const summary = {
      total_commits: commits.length,
      total_files_changed: codeChanges?.length || 0,
      total_lines_added: commits.reduce((sum, c) => sum + c.total_lines_added, 0),
      total_lines_removed: commits.reduce((sum, c) => sum + c.total_lines_removed, 0),
      unique_files: new Set(codeChanges?.map((c) => c.file_path)).size,
      authors: Array.from(new Set(commits.map((c) => c.author))),
      branches: Array.from(new Set(commits.map((c) => c.branch_name))),
    }

    console.log(
      `[v0] Found ${commits.length} commits with ${summary.total_files_changed} file changes for task ${taskId}`,
    )

    return NextResponse.json({
      success: true,
      data: {
        task_id: taskId,
        commits,
        summary,
      },
      message: "Code changes retrieved successfully",
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/user-stories/[taskId]/code-changes:", error)
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
