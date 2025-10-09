/**
 * @task gl-006
 * @description GitLab webhook endpoint for push, MR, and issue events
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const eventType = request.headers.get("x-gitlab-event")
    const token = request.headers.get("x-gitlab-token")

    console.log("[v0] Received GitLab webhook:", eventType)

    // Verify webhook token
    if (token !== process.env.GITLAB_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Handle different event types
    switch (eventType) {
      case "Push Hook":
        await handlePushEvent(payload)
        break

      case "Merge Request Hook":
        await handleMergeRequestEvent(payload)
        break

      case "Issue Hook":
        await handleIssueEvent(payload)
        break

      default:
        console.log(`[v0] Unhandled GitLab event: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing GitLab webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handlePushEvent(payload: any) {
  try {
    const { commits, ref, project, user_name, user_email } = payload

    for (const commit of commits) {
      // Extract task IDs from commit message
      const taskIds = extractTaskIds(commit.message)

      // Get file changes
      const filesChanged = [...commit.added, ...commit.modified, ...commit.removed]

      // Create code change log entry
      await supabase.from("code_change_log").insert({
        task_id: taskIds[0] || null,
        commit_sha: commit.id,
        commit_message: commit.message,
        commit_url: commit.url,
        author: user_name,
        author_email: user_email,
        branch_name: ref.replace("refs/heads/", ""),
        file_path: filesChanged.join(", "),
        change_type: "update",
        changed_at: commit.timestamp,
        metadata: {
          provider: "gitlab",
          project: project.name,
          all_task_ids: taskIds,
          files_changed: filesChanged,
        },
      })

      // Update user stories with commit info
      for (const taskId of taskIds) {
        await supabase
          .from("user_stories")
          .update({
            git_commits: supabase.raw(`array_append(COALESCE(git_commits, '{}'), ?::text)`, [commit.id]),
          })
          .eq("id", taskId)
      }

      console.log(`[v0] Processed GitLab commit ${commit.id}`)
    }
  } catch (error) {
    console.error("[v0] Error in handlePushEvent:", error)
  }
}

async function handleMergeRequestEvent(payload: any) {
  try {
    const { object_attributes, user } = payload

    console.log(`[v0] GitLab MR ${object_attributes.action}: ${object_attributes.title}`)

    // Extract task IDs from MR title and description
    const taskIds = extractTaskIds(`${object_attributes.title} ${object_attributes.description}`)

    // Update related user stories
    for (const taskId of taskIds) {
      await supabase
        .from("user_stories")
        .update({
          pull_request_url: object_attributes.url,
          status: object_attributes.state === "merged" ? "Done" : "In Progress",
        })
        .eq("id", taskId)
    }
  } catch (error) {
    console.error("[v0] Error in handleMergeRequestEvent:", error)
  }
}

async function handleIssueEvent(payload: any) {
  try {
    const { object_attributes, user } = payload

    console.log(`[v0] GitLab Issue ${object_attributes.action}: ${object_attributes.title}`)

    // Sync GitLab issue with user story
    const { data: existing } = await supabase
      .from("user_stories")
      .select("id")
      .eq("metadata->gitlab_issue_iid", object_attributes.iid)
      .single()

    if (existing) {
      // Update existing story
      await supabase
        .from("user_stories")
        .update({
          title: object_attributes.title,
          description: object_attributes.description || "",
          status: object_attributes.state === "closed" ? "Done" : "To Do",
        })
        .eq("id", existing.id)
    } else if (object_attributes.action === "open") {
      // Create new story from GitLab issue
      await supabase.from("user_stories").insert({
        story_id: `GL-${object_attributes.iid}`,
        title: object_attributes.title,
        description: object_attributes.description || "",
        status: "To Do",
        epic: "GitLab Synced",
        metadata: {
          gitlab_issue_iid: object_attributes.iid,
          gitlab_issue_url: object_attributes.url,
        },
      })
    }
  } catch (error) {
    console.error("[v0] Error in handleIssueEvent:", error)
  }
}

function extractTaskIds(text: string): string[] {
  // Extract task IDs like #123, TASK-456, etc.
  const patterns = [
    /#(\d+)/g, // #123
    /([A-Z]+-\d+)/g, // TASK-456
    /\[(\d+)\]/g, // [123]
  ]

  const ids: string[] = []
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      ids.push(match[1])
    }
  }

  return [...new Set(ids)] // Remove duplicates
}
