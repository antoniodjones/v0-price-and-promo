/**
 * @task cs-004
 * @description API endpoint to manually trigger Jira sync
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createJiraService } from "@/lib/services/jira-service"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { storyId, direction = "to_jira" } = await request.json()

    const jiraService = createJiraService()
    if (!jiraService) {
      return NextResponse.json({ error: "Jira service not configured" }, { status: 500 })
    }

    // Get the user story
    const { data: story, error: fetchError } = await supabase
      .from("user_stories")
      .select("*")
      .eq("id", storyId)
      .single()

    if (fetchError || !story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    let result
    if (direction === "to_jira") {
      result = await syncToJira(story, jiraService)
    } else {
      result = await syncFromJira(story, jiraService)
    }

    // Log the sync
    await supabase.from("jira_sync_log").insert({
      task_id: storyId,
      jira_issue_key: story.jira_issue_key || result.issueKey,
      sync_type: "manual",
      sync_direction: direction,
      sync_status: result.success ? "success" : "error",
      error_message: result.error,
      changes_synced: result.changes,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in Jira sync:", error)
    return NextResponse.json({ error: "Sync failed", details: String(error) }, { status: 500 })
  }
}

async function syncToJira(story: any, jiraService: any) {
  try {
    if (story.jira_issue_key) {
      // Update existing issue
      const success = await jiraService.updateIssue(story.jira_issue_key, {
        summary: story.title,
        description: story.description,
        priority: story.priority,
        storyPoints: story.story_points,
      })

      if (success) {
        // Update sync status
        await supabase
          .from("user_stories")
          .update({
            jira_sync_status: "synced",
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", story.id)

        return {
          success: true,
          issueKey: story.jira_issue_key,
          changes: { updated: true },
        }
      }

      return { success: false, error: "Failed to update Jira issue" }
    } else {
      // Create new issue
      const issue = await jiraService.createIssue({
        summary: story.title,
        description: story.description || "",
        issueType: story.story_type || "Story",
        priority: story.priority,
        storyPoints: story.story_points,
        parentKey: story.parent_id,
      })

      if (issue) {
        // Update story with Jira key
        await supabase
          .from("user_stories")
          .update({
            jira_issue_key: issue.key,
            jira_sync_status: "synced",
            last_synced_at: new Date().toISOString(),
          })
          .eq("id", story.id)

        return {
          success: true,
          issueKey: issue.key,
          changes: { created: true },
        }
      }

      return { success: false, error: "Failed to create Jira issue" }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

async function syncFromJira(story: any, jiraService: any) {
  try {
    if (!story.jira_issue_key) {
      return { success: false, error: "No Jira issue key found" }
    }

    const issue = await jiraService.getIssue(story.jira_issue_key)
    if (!issue) {
      return { success: false, error: "Jira issue not found" }
    }

    // Update local story with Jira data
    await supabase
      .from("user_stories")
      .update({
        title: issue.fields.summary,
        description: issue.fields.description || "",
        status: mapJiraStatus(issue.fields.status.name),
        priority: mapJiraPriority(issue.fields.priority?.name),
        story_points: issue.fields.customfield_10016,
        jira_sync_status: "synced",
        last_synced_at: new Date().toISOString(),
      })
      .eq("id", story.id)

    return {
      success: true,
      issueKey: story.jira_issue_key,
      changes: { synced_from_jira: true },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

function mapJiraStatus(jiraStatus: string): string {
  const statusMap: Record<string, string> = {
    "To Do": "To Do",
    "In Progress": "In Progress",
    Done: "Done",
    Backlog: "To Do",
    "In Review": "In Progress",
    Closed: "Done",
  }
  return statusMap[jiraStatus] || "To Do"
}

function mapJiraPriority(jiraPriority?: string): string {
  if (!jiraPriority) return "Medium"
  const priorityMap: Record<string, string> = {
    Highest: "Critical",
    High: "High",
    Medium: "Medium",
    Low: "Low",
    Lowest: "Low",
  }
  return priorityMap[jiraPriority] || "Medium"
}
