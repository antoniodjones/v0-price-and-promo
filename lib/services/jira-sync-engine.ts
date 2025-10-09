/**
 * @task CS-004-C
 * @epic Integration Management
 * @description Bidirectional Sync Engine - syncs user stories with Jira issues
 */

import { createClient } from "@supabase/supabase-js"
import { createJiraClient, type JiraIssue, type JiraIssueCreate, type JiraIssueUpdate } from "./jira-api"

export interface SyncResult {
  success: boolean
  taskId: string
  jiraIssueKey?: string
  operation: "create" | "update" | "pull"
  error?: string
  conflictResolved?: boolean
}

export interface SyncOptions {
  direction: "push" | "pull" | "bidirectional"
  taskIds?: string[]
  forceSync?: boolean
}

/**
 * Jira Sync Engine
 * Handles bidirectional synchronization between local user stories and Jira issues
 */
export class JiraSyncEngine {
  private jiraClient: ReturnType<typeof createJiraClient>
  private supabase: ReturnType<typeof createClient>

  constructor() {
    this.jiraClient = createJiraClient()
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }

  /**
   * Sync a single user story to Jira
   */
  async syncToJira(taskId: string): Promise<SyncResult> {
    console.log("[v0] Syncing task to Jira:", taskId)

    try {
      // Get user story from database
      const { data: story, error: fetchError } = await this.supabase
        .from("user_stories")
        .select("*")
        .eq("id", taskId)
        .single()

      if (fetchError || !story) {
        return {
          success: false,
          taskId,
          operation: "update",
          error: "Task not found",
        }
      }

      const startTime = Date.now()

      // Check if issue already exists in Jira
      if (story.jira_issue_key) {
        // Update existing issue
        const updateData: JiraIssueUpdate = {
          summary: story.title,
          description: this.formatDescription(story),
          status: this.mapStatusToJira(story.status),
          priority: this.mapPriorityToJira(story.priority),
          labels: story.labels ? JSON.parse(story.labels) : [],
          storyPoints: story.story_points,
        }

        await this.jiraClient.updateIssue(story.jira_issue_key, updateData)

        // Log sync operation
        await this.logSync(taskId, story.jira_issue_key, "update", "push", "success", Date.now() - startTime)

        // Update last synced timestamp
        await this.supabase
          .from("user_stories")
          .update({
            last_synced_at: new Date().toISOString(),
            jira_sync_status: "synced",
          })
          .eq("id", taskId)

        return {
          success: true,
          taskId,
          jiraIssueKey: story.jira_issue_key,
          operation: "update",
        }
      } else {
        // Create new issue
        const createData: JiraIssueCreate = {
          summary: story.title,
          description: this.formatDescription(story),
          issueType: "Task",
          priority: this.mapPriorityToJira(story.priority),
          labels: story.labels ? JSON.parse(story.labels) : [],
          storyPoints: story.story_points,
        }

        const jiraIssue = await this.jiraClient.createIssue(createData)

        // Update user story with Jira issue key
        await this.supabase
          .from("user_stories")
          .update({
            jira_issue_key: jiraIssue.key,
            last_synced_at: new Date().toISOString(),
            jira_sync_status: "synced",
          })
          .eq("id", taskId)

        // Log sync operation
        await this.logSync(taskId, jiraIssue.key, "create", "push", "success", Date.now() - startTime)

        return {
          success: true,
          taskId,
          jiraIssueKey: jiraIssue.key,
          operation: "create",
        }
      }
    } catch (error) {
      console.error("[v0] Error syncing to Jira:", error)

      // Log failed sync
      await this.logSync(
        taskId,
        null,
        "update",
        "push",
        "error",
        0,
        error instanceof Error ? error.message : "Unknown error",
      )

      return {
        success: false,
        taskId,
        operation: "update",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Sync a Jira issue to local user story
   */
  async syncFromJira(jiraIssueKey: string): Promise<SyncResult> {
    console.log("[v0] Syncing from Jira:", jiraIssueKey)

    try {
      const startTime = Date.now()

      // Get issue from Jira
      const jiraIssue = await this.jiraClient.getIssue(jiraIssueKey)

      // Find matching user story
      const { data: story, error: fetchError } = await this.supabase
        .from("user_stories")
        .select("*")
        .eq("jira_issue_key", jiraIssueKey)
        .single()

      if (fetchError || !story) {
        // Create new user story
        const { data: newStory, error: createError } = await this.supabase
          .from("user_stories")
          .insert({
            id: jiraIssueKey.toLowerCase(),
            title: jiraIssue.fields.summary,
            description: this.extractDescription(jiraIssue),
            status: this.mapStatusFromJira(jiraIssue.fields.status.name),
            priority: this.mapPriorityFromJira(jiraIssue.fields.priority?.name),
            story_points: jiraIssue.fields.customfield_10016 || null,
            jira_issue_key: jiraIssueKey,
            jira_sync_status: "synced",
            last_synced_at: new Date().toISOString(),
            created_by: "jira-sync",
            updated_by: "jira-sync",
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }

        await this.logSync(newStory!.id, jiraIssueKey, "create", "pull", "success", Date.now() - startTime)

        return {
          success: true,
          taskId: newStory!.id,
          jiraIssueKey,
          operation: "create",
        }
      }

      // Check for conflicts (last-write-wins strategy)
      const jiraUpdated = new Date(jiraIssue.fields.updated)
      const localUpdated = new Date(story.updated_at)
      const conflictDetected = Math.abs(jiraUpdated.getTime() - localUpdated.getTime()) < 60000 // Within 1 minute

      // Update existing user story (Jira wins in conflict)
      await this.supabase
        .from("user_stories")
        .update({
          title: jiraIssue.fields.summary,
          description: this.extractDescription(jiraIssue),
          status: this.mapStatusFromJira(jiraIssue.fields.status.name),
          priority: this.mapPriorityFromJira(jiraIssue.fields.priority?.name),
          story_points: jiraIssue.fields.customfield_10016 || story.story_points,
          jira_sync_status: "synced",
          last_synced_at: new Date().toISOString(),
          updated_by: "jira-sync",
        })
        .eq("id", story.id)

      await this.logSync(story.id, jiraIssueKey, "update", "pull", "success", Date.now() - startTime, undefined, {
        conflict_detected: conflictDetected,
        conflict_resolution: "jira_wins",
      })

      return {
        success: true,
        taskId: story.id,
        jiraIssueKey,
        operation: "update",
        conflictResolved: conflictDetected,
      }
    } catch (error) {
      console.error("[v0] Error syncing from Jira:", error)

      await this.logSync(
        jiraIssueKey,
        jiraIssueKey,
        "update",
        "pull",
        "error",
        0,
        error instanceof Error ? error.message : "Unknown error",
      )

      return {
        success: false,
        taskId: jiraIssueKey,
        operation: "pull",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Sync all pending changes
   */
  async syncAll(options: SyncOptions = { direction: "bidirectional" }): Promise<SyncResult[]> {
    console.log("[v0] Starting bulk sync, direction:", options.direction)

    const results: SyncResult[] = []

    if (options.direction === "push" || options.direction === "bidirectional") {
      // Get all user stories that need syncing
      let query = this.supabase.from("user_stories").select("id, jira_issue_key, updated_at, last_synced_at")

      if (options.taskIds && options.taskIds.length > 0) {
        query = query.in("id", options.taskIds)
      } else if (!options.forceSync) {
        // Only sync stories updated since last sync
        query = query.or("last_synced_at.is.null,updated_at.gt.last_synced_at")
      }

      const { data: stories, error } = await query

      if (!error && stories) {
        for (const story of stories) {
          const result = await this.syncToJira(story.id)
          results.push(result)
        }
      }
    }

    if (options.direction === "pull" || options.direction === "bidirectional") {
      // Get all Jira issues from the project
      const jql = `project = ${process.env.JIRA_PROJECT_KEY} ORDER BY updated DESC`
      const jiraIssues = await this.jiraClient.searchIssues(jql, 100)

      for (const issue of jiraIssues) {
        const result = await this.syncFromJira(issue.key)
        results.push(result)
      }
    }

    console.log("[v0] ✓ Bulk sync complete:", results.length, "items processed")

    return results
  }

  /**
   * Log sync operation to database
   */
  private async logSync(
    taskId: string,
    jiraIssueKey: string | null,
    syncType: string,
    syncDirection: string,
    syncStatus: string,
    durationMs: number,
    errorMessage?: string,
    metadata?: any,
  ): Promise<void> {
    await this.supabase.from("jira_sync_log").insert({
      task_id: taskId,
      jira_issue_key: jiraIssueKey,
      sync_type: syncType,
      sync_direction: syncDirection,
      sync_status: syncStatus,
      duration_ms: durationMs,
      error_message: errorMessage,
      changes_synced: metadata || {},
      synced_at: new Date().toISOString(),
    })
  }

  /**
   * Format user story description for Jira
   */
  private formatDescription(story: any): string {
    let description = story.description || ""

    if (story.acceptance_criteria) {
      description += "\n\n**Acceptance Criteria:**\n" + story.acceptance_criteria
    }

    if (story.technical_notes) {
      description += "\n\n**Technical Notes:**\n" + story.technical_notes
    }

    return description
  }

  /**
   * Extract description from Jira issue
   */
  private extractDescription(jiraIssue: JiraIssue): string {
    // Jira uses ADF (Atlassian Document Format), extract plain text
    const description = jiraIssue.fields.description
    if (!description) return ""

    // Simple extraction - in production, use proper ADF parser
    return JSON.stringify(description)
  }

  /**
   * Map local status to Jira status
   */
  private mapStatusToJira(status: string): string {
    const mapping: Record<string, string> = {
      todo: "To Do",
      "in-progress": "In Progress",
      "in-review": "In Review",
      done: "Done",
      blocked: "Blocked",
    }

    return mapping[status] || "To Do"
  }

  /**
   * Map Jira status to local status
   */
  private mapStatusFromJira(jiraStatus: string): string {
    const mapping: Record<string, string> = {
      "to do": "todo",
      "in progress": "in-progress",
      "in review": "in-review",
      done: "done",
      blocked: "blocked",
    }

    return mapping[jiraStatus.toLowerCase()] || "todo"
  }

  /**
   * Map local priority to Jira priority
   */
  private mapPriorityToJira(priority: string): string {
    const mapping: Record<string, string> = {
      critical: "Highest",
      high: "High",
      medium: "Medium",
      low: "Low",
    }

    return mapping[priority] || "Medium"
  }

  /**
   * Map Jira priority to local priority
   */
  private mapPriorityFromJira(jiraPriority?: string): string {
    if (!jiraPriority) return "medium"

    const mapping: Record<string, string> = {
      highest: "critical",
      high: "high",
      medium: "medium",
      low: "low",
      lowest: "low",
    }

    return mapping[jiraPriority.toLowerCase()] || "medium"
  }
}

/**
 * Factory function to create a JiraSyncEngine instance
 */
export function createJiraSyncEngine(): JiraSyncEngine {
  return new JiraSyncEngine()
}
