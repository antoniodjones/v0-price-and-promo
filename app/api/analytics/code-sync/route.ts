/**
 * @task CS-007
 * @description API endpoint for code sync analytics data
 */

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total commits
    const { count: totalCommits } = await supabase.from("code_change_log").select("*", { count: "exact", head: true })

    // Get linked tasks
    const { data: linkedTasks } = await supabase.from("code_change_log").select("task_id").not("task_id", "is", null)

    const uniqueLinkedTasks = new Set(linkedTasks?.map((t) => t.task_id)).size

    // Get sync success rate
    const { data: syncLogs } = await supabase
      .from("jira_sync_log")
      .select("sync_status")
      .gte("synced_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

    const successCount = syncLogs?.filter((log) => log.sync_status === "success").length || 0
    const totalSyncs = syncLogs?.length || 1
    const syncSuccessRate = Math.round((successCount / totalSyncs) * 100)

    // Get commits by day (last 30 days)
    const { data: commits } = await supabase
      .from("code_change_log")
      .select("changed_at")
      .gte("changed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("changed_at", { ascending: true })

    const commitsByDay = commits?.reduce(
      (acc, commit) => {
        const date = new Date(commit.changed_at).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const commitsByDayArray = Object.entries(commitsByDay || {}).map(([date, commits]) => ({
      date,
      commits,
    }))

    // Get top tasks by lines changed
    const { data: topTasksData } = await supabase.from("code_change_log").select("task_id, lines_added, lines_removed")

    const taskStats = topTasksData?.reduce(
      (acc, change) => {
        if (!change.task_id) return acc
        if (!acc[change.task_id]) {
          acc[change.task_id] = { taskId: change.task_id, linesAdded: 0, linesRemoved: 0 }
        }
        acc[change.task_id].linesAdded += change.lines_added || 0
        acc[change.task_id].linesRemoved += change.lines_removed || 0
        return acc
      },
      {} as Record<string, any>,
    )

    const topTasks = Object.values(taskStats || {})
      .sort((a: any, b: any) => b.linesAdded + b.linesRemoved - (a.linesAdded + a.linesRemoved))
      .slice(0, 10)

    return NextResponse.json({
      totalCommits: totalCommits || 0,
      linkedTasks: uniqueLinkedTasks,
      syncSuccessRate,
      commitsByDay: commitsByDayArray,
      topTasks,
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
