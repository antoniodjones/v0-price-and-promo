/**
 * @task cs-012
 * @epic Code Sync
 * @description Task Events Service - logs and retrieves GitHub-related task events
 */

import { createClient } from "@supabase/supabase-js"

export type TaskEventType =
  | "branch_created"
  | "commit_created"
  | "pr_opened"
  | "pr_merged"
  | "pr_closed"
  | "task_completed"
  | "task_started"
  | "auto_commit_toggled"
  | "manual_sync"

export interface TaskEvent {
  id: string
  task_id: string
  event_type: TaskEventType
  triggered_by: string // 'agent' or user email
  metadata: Record<string, any>
  created_at: string
}

export interface TaskEventMetadata {
  branch_name?: string
  commit_sha?: string
  commit_message?: string
  commit_url?: string
  pr_number?: number
  pr_url?: string
  pr_title?: string
  files_changed?: number
  lines_added?: number
  lines_removed?: number
  auto_commit_enabled?: boolean
  [key: string]: any
}

export interface TaskEventStats {
  total_events: number
  agent_events: number
  user_events: number
  branches_created: number
  commits_made: number
  prs_opened: number
  last_activity: string | null
}

/**
 * Task Events Service
 * Handles logging and retrieval of task-related GitHub events
 */
export class TaskEventsService {
  private supabase: ReturnType<typeof createClient>

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  /**
   * Log a task event
   */
  async logEvent(
    taskId: string,
    eventType: TaskEventType,
    triggeredBy: string,
    metadata: TaskEventMetadata = {},
  ): Promise<{ success: boolean; error?: string }> {
    console.log(`[v0] Logging event: ${eventType} for task ${taskId}`)

    try {
      const { error } = await this.supabase.from("task_events").insert({
        task_id: taskId,
        event_type: eventType,
        triggered_by: triggeredBy,
        metadata,
      })

      if (error) {
        console.error(`[v0] Error logging event:`, error)
        return { success: false, error: error.message }
      }

      console.log(`[v0] ✓ Event logged: ${eventType}`)
      return { success: true }
    } catch (error) {
      console.error(`[v0] Error logging event:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get all events for a task
   */
  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    const { data, error } = await this.supabase
      .from("task_events")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`[v0] Error fetching task events:`, error)
      return []
    }

    return (data as TaskEvent[]) || []
  }

  /**
   * Get events by type
   */
  async getEventsByType(taskId: string, eventType: TaskEventType): Promise<TaskEvent[]> {
    const { data, error } = await this.supabase
      .from("task_events")
      .select("*")
      .eq("task_id", taskId)
      .eq("event_type", eventType)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`[v0] Error fetching events by type:`, error)
      return []
    }

    return (data as TaskEvent[]) || []
  }

  /**
   * Get task event statistics
   */
  async getTaskStats(taskId: string): Promise<TaskEventStats> {
    const events = await this.getTaskEvents(taskId)

    const stats: TaskEventStats = {
      total_events: events.length,
      agent_events: events.filter((e) => e.triggered_by === "agent").length,
      user_events: events.filter((e) => e.triggered_by !== "agent").length,
      branches_created: events.filter((e) => e.event_type === "branch_created").length,
      commits_made: events.filter((e) => e.event_type === "commit_created").length,
      prs_opened: events.filter((e) => e.event_type === "pr_opened").length,
      last_activity: events.length > 0 ? events[0].created_at : null,
    }

    return stats
  }

  /**
   * Get analytics for agent vs user contributions
   */
  async getContributionAnalytics(taskId: string): Promise<{
    agent: { commits: number; lines_added: number; lines_removed: number }
    user: { commits: number; lines_added: number; lines_removed: number }
  }> {
    const events = await this.getEventsByType(taskId, "commit_created")

    const analytics = {
      agent: { commits: 0, lines_added: 0, lines_removed: 0 },
      user: { commits: 0, lines_added: 0, lines_removed: 0 },
    }

    for (const event of events) {
      const isAgent = event.triggered_by === "agent"
      const target = isAgent ? analytics.agent : analytics.user

      target.commits++
      target.lines_added += (event.metadata.lines_added as number) || 0
      target.lines_removed += (event.metadata.lines_removed as number) || 0
    }

    return analytics
  }

  /**
   * Get recent activity across all tasks
   */
  async getRecentActivity(limit = 50): Promise<TaskEvent[]> {
    const { data, error } = await this.supabase
      .from("task_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`[v0] Error fetching recent activity:`, error)
      return []
    }

    return (data as TaskEvent[]) || []
  }
}

/**
 * Factory function to create a TaskEventsService instance
 */
export function createTaskEventsService(): TaskEventsService {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are required")
  }

  return new TaskEventsService(supabaseUrl, supabaseKey)
}
