/**
 * @task cs-004
 * @description Jira webhook endpoint for bi-directional sync
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log("[v0] Received Jira webhook:", payload.webhookEvent)

    // Verify webhook (optional - implement signature verification)
    // const signature = request.headers.get('x-hub-signature')

    const { webhookEvent, issue, changelog } = payload

    // Log the webhook event
    await supabase.from("jira_sync_log").insert({
      sync_type: "webhook",
      sync_direction: "from_jira",
      jira_issue_key: issue?.key,
      sync_status: "pending",
      changes_synced: payload,
    })

    // Handle different event types
    switch (webhookEvent) {
      case "jira:issue_created":
        await handleIssueCreated(issue)
        break

      case "jira:issue_updated":
        await handleIssueUpdated(issue, changelog)
        break

      case "jira:issue_deleted":
        await handleIssueDeleted(issue)
        break

      default:
        console.log(`[v0] Unhandled Jira event: ${webhookEvent}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing Jira webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handleIssueCreated(issue: any) {
  try {
    // Check if story already exists
    const { data: existing } = await supabase.from("user_stories").select("id").eq("jira_issue_key", issue.key).single()

    if (existing) {
      console.log(`[v0] Story already exists for ${issue.key}`)
      return
    }

    // Create new user story from Jira issue
    const { error } = await supabase.from("user_stories").insert({
      story_id: `JIRA-${issue.key}`,
      title: issue.fields.summary,
      description: issue.fields.description || "",
      status: mapJiraStatus(issue.fields.status.name),
      priority: mapJiraPriority(issue.fields.priority?.name),
      story_points: issue.fields.customfield_10016 || null,
      jira_issue_key: issue.key,
      jira_sync_status: "synced",
      last_synced_at: new Date().toISOString(),
      epic: "Jira Synced",
      story_type: issue.fields.issuetype.name.toLowerCase(),
      parent_id: issue.fields.parent?.key || null,
    })

    if (error) {
      console.error("[v0] Error creating user story from Jira:", error)
    } else {
      console.log(`[v0] Created user story from Jira issue ${issue.key}`)
    }
  } catch (error) {
    console.error("[v0] Error in handleIssueCreated:", error)
  }
}

async function handleIssueUpdated(issue: any, changelog: any) {
  try {
    const updates: any = {
      title: issue.fields.summary,
      description: issue.fields.description || "",
      status: mapJiraStatus(issue.fields.status.name),
      priority: mapJiraPriority(issue.fields.priority?.name),
      story_points: issue.fields.customfield_10016 || null,
      jira_sync_status: "synced",
      last_synced_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("user_stories").update(updates).eq("jira_issue_key", issue.key)

    if (error) {
      console.error("[v0] Error updating user story from Jira:", error)
    } else {
      console.log(`[v0] Updated user story from Jira issue ${issue.key}`)
    }
  } catch (error) {
    console.error("[v0] Error in handleIssueUpdated:", error)
  }
}

async function handleIssueDeleted(issue: any) {
  try {
    // Mark as deleted or remove jira_issue_key
    const { error } = await supabase
      .from("user_stories")
      .update({
        jira_issue_key: null,
        jira_sync_status: "disabled",
      })
      .eq("jira_issue_key", issue.key)

    if (error) {
      console.error("[v0] Error handling deleted Jira issue:", error)
    } else {
      console.log(`[v0] Handled deletion of Jira issue ${issue.key}`)
    }
  } catch (error) {
    console.error("[v0] Error in handleIssueDeleted:", error)
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
