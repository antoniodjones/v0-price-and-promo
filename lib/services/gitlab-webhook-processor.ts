import { createClient } from "@/lib/supabase/server"
import type { GitLabPushEvent, GitLabCommit } from "@/lib/types/gitlab"

export class GitLabWebhookProcessor {
  // Extract task IDs from commit message
  private extractTaskIds(message: string): string[] {
    const taskIdPattern = /([A-Z]+-\d+)/g
    const matches = message.match(taskIdPattern)
    return matches || []
  }

  // Process push event
  async processPushEvent(event: GitLabPushEvent): Promise<void> {
    console.log("[v0] Processing GitLab push event:", {
      ref: event.ref,
      commits: event.total_commits_count,
      user: event.user_name,
    })

    const supabase = await createClient()

    for (const commit of event.commits) {
      await this.processCommit(commit, event.project.path_with_namespace)
    }
  }

  // Process individual commit
  private async processCommit(commit: GitLabCommit, projectPath: string): Promise<void> {
    const supabase = await createClient()
    const taskIds = this.extractTaskIds(commit.message)

    console.log("[v0] Processing commit:", {
      sha: commit.short_id,
      message: commit.title,
      taskIds,
    })

    // Log to git_webhooks table
    await supabase.from("github_webhooks").insert({
      event_type: "push",
      payload: {
        commit_sha: commit.id,
        message: commit.message,
        author: commit.author_name,
        timestamp: commit.committed_date,
        provider: "gitlab",
      },
      processed: true,
      created_at: new Date().toISOString(),
    })

    // Link commit to tasks
    for (const taskId of taskIds) {
      // Find the user story
      const { data: story } = await supabase.from("user_stories").select("*").eq("id", taskId).single()

      if (story) {
        // Update story with commit info
        const gitCommits = Array.isArray(story.git_commits) ? story.git_commits : []
        if (!gitCommits.includes(commit.id)) {
          gitCommits.push(commit.id)

          await supabase
            .from("user_stories")
            .update({
              git_commits: gitCommits,
              git_branch: commit.id.substring(0, 7),
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)
        }

        // Create code_change_log entry
        await supabase.from("code_change_log").insert({
          task_id: taskId,
          jira_issue_key: story.jira_issue_key,
          commit_sha: commit.id,
          commit_message: commit.message,
          author: commit.author_name,
          file_path: "multiple", // Would need diff to get actual files
          change_type: "modified",
          lines_added: commit.stats?.additions || 0,
          lines_removed: commit.stats?.deletions || 0,
          changed_at: commit.committed_date,
          provider: "gitlab",
        })
      }
    }
  }
}
