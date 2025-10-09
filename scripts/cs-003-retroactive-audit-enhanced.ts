import { createClient } from "@supabase/supabase-js"
import { GitLabAPIClient } from "../lib/services/gitlab-api"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface AuditStats {
  totalCommits: number
  linkedCommits: number
  unlinkedCommits: number
  tasksUpdated: number
  codeChangesCreated: number
  errors: string[]
}

async function runRetroactiveAudit(): Promise<AuditStats> {
  console.log("[v0] Starting retroactive code audit...")

  const stats: AuditStats = {
    totalCommits: 0,
    linkedCommits: 0,
    unlinkedCommits: 0,
    tasksUpdated: 0,
    codeChangesCreated: 0,
    errors: [],
  }

  try {
    // Initialize GitLab client
    const gitlabClient = new GitLabAPIClient()

    // Fetch all commits from GitLab
    console.log("[v0] Fetching commits from GitLab...")
    const commits = await gitlabClient.listCommits({ per_page: 100 })
    stats.totalCommits = commits.length

    console.log(`[v0] Found ${commits.length} commits to process`)

    // Process each commit
    for (const commit of commits) {
      try {
        // Extract task IDs from commit message
        const taskIdPattern = /([A-Z]+-\d+)/g
        const taskIds = commit.message.match(taskIdPattern) || []

        if (taskIds.length === 0) {
          stats.unlinkedCommits++
          continue
        }

        stats.linkedCommits++

        // Get commit diff for file changes
        const diff = await gitlabClient.getCommitDiff(commit.id)

        // Process each task ID
        for (const taskId of taskIds) {
          // Find the user story
          const { data: story } = await supabase.from("user_stories").select("*").eq("id", taskId).single()

          if (!story) {
            console.log(`[v0] Task ${taskId} not found, skipping`)
            continue
          }

          // Update story with commit info
          const gitCommits = Array.isArray(story.git_commits) ? story.git_commits : []
          if (!gitCommits.includes(commit.id)) {
            gitCommits.push(commit.id)

            await supabase
              .from("user_stories")
              .update({
                git_commits: gitCommits,
                updated_at: new Date().toISOString(),
              })
              .eq("id", taskId)

            stats.tasksUpdated++
          }

          // Create code_change_log entries for each file
          for (const file of diff) {
            const { error } = await supabase.from("code_change_log").insert({
              task_id: taskId,
              jira_issue_key: story.jira_issue_key,
              commit_sha: commit.id,
              commit_message: commit.message,
              author: commit.author_name,
              file_path: file.new_path || file.old_path,
              change_type: file.new_file ? "created" : file.deleted_file ? "deleted" : "modified",
              lines_added: file.diff?.split("\n").filter((l: string) => l.startsWith("+")).length || 0,
              lines_removed: file.diff?.split("\n").filter((l: string) => l.startsWith("-")).length || 0,
              changed_at: commit.committed_date,
              provider: "gitlab",
            })

            if (!error) {
              stats.codeChangesCreated++
            }
          }
        }
      } catch (error) {
        const errorMsg = `Error processing commit ${commit.short_id}: ${error instanceof Error ? error.message : "Unknown error"}`
        console.error(`[v0] ${errorMsg}`)
        stats.errors.push(errorMsg)
      }
    }

    console.log("[v0] Retroactive audit complete!")
    console.log("[v0] Stats:", stats)

    return stats
  } catch (error) {
    console.error("[v0] Fatal error in retroactive audit:", error)
    throw error
  }
}

// Run the audit
runRetroactiveAudit()
  .then((stats) => {
    console.log("\n=== AUDIT COMPLETE ===")
    console.log(`Total Commits: ${stats.totalCommits}`)
    console.log(`Linked Commits: ${stats.linkedCommits}`)
    console.log(`Unlinked Commits: ${stats.unlinkedCommits}`)
    console.log(`Tasks Updated: ${stats.tasksUpdated}`)
    console.log(`Code Changes Created: ${stats.codeChangesCreated}`)
    if (stats.errors.length > 0) {
      console.log(`\nErrors (${stats.errors.length}):`)
      stats.errors.forEach((err) => console.log(`  - ${err}`))
    }
    process.exit(0)
  })
  .catch((error) => {
    console.error("Audit failed:", error)
    process.exit(1)
  })
