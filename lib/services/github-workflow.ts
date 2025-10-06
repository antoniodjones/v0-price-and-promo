/**
 * @task cs-009
 * @epic Code Sync
 * @description Core GitHub Workflow Service - handles branch creation, commits, and PR management
 */

import { createClient } from "@supabase/supabase-js"
import { createTaskEventsService } from "./task-events"

export interface GitHubWorkflowConfig {
  taskId: string
  auto: boolean // true for agent-triggered, false for user-triggered
  userId?: string
  branchName?: string // Optional custom branch name
  commitMessage?: string // Optional custom commit message
  createPR?: boolean // Whether to create a PR after commit
  prTitle?: string
  prBody?: string
}

export interface GitHubWorkflowResult {
  success: boolean
  branchName: string
  commitSha?: string
  commitUrl?: string
  prUrl?: string
  error?: string
}

export interface FileChange {
  path: string
  content: string
  operation: "create" | "update" | "delete"
}

export interface GitHubIssue {
  number: number
  title: string
  body: string
  state: "open" | "closed"
  url: string
  labels: string[]
  assignees: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateIssueParams {
  title: string
  body: string
  labels?: string[]
  assignees?: string[]
  milestone?: number
}

export interface UpdateIssueParams {
  title?: string
  body?: string
  state?: "open" | "closed"
  labels?: string[]
  assignees?: string[]
}

export interface GitHubPullRequest {
  number: number
  title: string
  body: string
  state: "open" | "closed" | "merged"
  url: string
  head: string
  base: string
  mergeable: boolean | null
  merged: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdatePRParams {
  title?: string
  body?: string
  state?: "open" | "closed"
  base?: string
}

export interface GitHubLabel {
  name: string
  color: string
  description: string
}

const GITHUB_API = "https://api.github.com"
const GITHUB_OWNER = process.env.GITHUB_OWNER || "antoniodjones"
const GITHUB_REPO = process.env.GITHUB_REPO || "v0-price-and-promo"

/**
 * Core GitHub Workflow Service
 * Handles branch creation, commits, and PR management for both agent and user workflows
 */
export class GitHubWorkflowService {
  private githubToken: string
  private supabase: ReturnType<typeof createClient>

  constructor(githubToken: string, supabaseUrl: string, supabaseKey: string) {
    this.githubToken = githubToken
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  /**
   * Execute the complete workflow: create branch, commit changes, optionally create PR
   */
  async executeWorkflow(config: GitHubWorkflowConfig, files: FileChange[]): Promise<GitHubWorkflowResult> {
    console.log(`[v0] Starting GitHub workflow for task ${config.taskId}`)

    const eventsService = createTaskEventsService()

    try {
      // Check if task has auto-commit disabled
      const autoCommitEnabled = await this.isAutoCommitEnabled(config.taskId)
      if (config.auto && !autoCommitEnabled) {
        console.log(`[v0] Auto-commit disabled for task ${config.taskId}, skipping workflow`)
        return {
          success: false,
          branchName: "",
          error: "Auto-commit is disabled for this task",
        }
      }

      // Get or create branch
      const branchName = config.branchName || this.generateBranchName(config.taskId)
      await this.createOrSwitchBranch(branchName)

      await eventsService.logEvent(config.taskId, "branch_created", config.auto ? "agent" : config.userId || "user", {
        branch_name: branchName,
      })

      // Commit changes
      const commitMessage = config.commitMessage || this.generateCommitMessage(config.taskId, files)
      const commitResult = await this.commitFiles(branchName, files, commitMessage, config.taskId)

      if (!commitResult.success) {
        return {
          success: false,
          branchName,
          error: commitResult.error,
        }
      }

      const linesAdded = files.reduce(
        (sum, f) => sum + (f.operation !== "delete" ? f.content.split("\n").length : 0),
        0,
      )
      const linesRemoved = files.reduce(
        (sum, f) => sum + (f.operation === "delete" ? f.content.split("\n").length : 0),
        0,
      )

      await eventsService.logEvent(config.taskId, "commit_created", config.auto ? "agent" : config.userId || "user", {
        commit_sha: commitResult.sha,
        commit_message: commitMessage,
        commit_url: commitResult.url,
        branch_name: branchName,
        files_changed: files.length,
        lines_added: linesAdded,
        lines_removed: linesRemoved,
      })

      // Log to code_change_log
      await this.logCodeChanges(config.taskId, files, commitResult.sha!, branchName, commitMessage, config.userId)

      // Create PR if requested
      let prUrl: string | undefined
      if (config.createPR) {
        const prResult = await this.createPullRequest(
          branchName,
          config.prTitle || `[${config.taskId}] ${commitMessage}`,
          config.prBody || `Automated PR for task ${config.taskId}`,
        )
        prUrl = prResult.url

        await eventsService.logEvent(config.taskId, "pr_opened", config.auto ? "agent" : config.userId || "user", {
          pr_number: prResult.number,
          pr_url: prResult.url,
          pr_title: config.prTitle || `[${config.taskId}] ${commitMessage}`,
          branch_name: branchName,
        })
      }

      // Update task metadata
      await this.updateTaskMetadata(config.taskId, branchName, commitResult.sha!)

      console.log(`[v0] ✓ GitHub workflow completed for task ${config.taskId}`)

      return {
        success: true,
        branchName,
        commitSha: commitResult.sha,
        commitUrl: commitResult.url,
        prUrl,
      }
    } catch (error) {
      console.error(`[v0] Error in GitHub workflow:`, error)
      return {
        success: false,
        branchName: config.branchName || "",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Check if auto-commit is enabled for a task
   */
  private async isAutoCommitEnabled(taskId: string): Promise<boolean> {
    const { data, error } = await this.supabase.from("user_stories").select("metadata").eq("task_id", taskId).single()

    if (error || !data) {
      return true // Default to enabled if task not found or no metadata
    }

    const metadata = data.metadata as { auto_commit_enabled?: boolean } | null
    return metadata?.auto_commit_enabled !== false // Default to true
  }

  /**
   * Generate branch name from task ID
   */
  private generateBranchName(taskId: string): string {
    return `feature/${taskId}`
  }

  /**
   * Generate commit message from task ID and files
   */
  private generateCommitMessage(taskId: string, files: FileChange[]): string {
    const fileCount = files.length
    const operations = {
      create: files.filter((f) => f.operation === "create").length,
      update: files.filter((f) => f.operation === "update").length,
      delete: files.filter((f) => f.operation === "delete").length,
    }

    let message = `[${taskId}] `

    if (operations.create > 0) message += `Create ${operations.create} file(s)`
    if (operations.update > 0) message += `${operations.create > 0 ? ", " : ""}Update ${operations.update} file(s)`
    if (operations.delete > 0)
      message += `${operations.create > 0 || operations.update > 0 ? ", " : ""}Delete ${operations.delete} file(s)`

    return message
  }

  /**
   * Create or switch to a branch
   */
  private async createOrSwitchBranch(branchName: string): Promise<void> {
    console.log(`[v0] Creating/switching to branch: ${branchName}`)

    // Get the default branch's latest commit SHA
    const defaultBranch = await this.getDefaultBranch()
    const latestCommit = await this.getLatestCommit(defaultBranch)

    // Check if branch exists
    const branchExists = await this.branchExists(branchName)

    if (!branchExists) {
      // Create new branch
      await this.createBranch(branchName, latestCommit.sha)
      console.log(`[v0] ✓ Created branch: ${branchName}`)
    } else {
      console.log(`[v0] ✓ Branch already exists: ${branchName}`)
    }
  }

  /**
   * Get the default branch name
   */
  private async getDefaultBranch(): Promise<string> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get repository info: ${response.statusText}`)
    }

    const data = await response.json()
    return data.default_branch || "main"
  }

  /**
   * Get latest commit SHA for a branch
   */
  private async getLatestCommit(branch: string): Promise<{ sha: string; url: string }> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${branch}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get latest commit: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      sha: data.object.sha,
      url: data.object.url,
    }
  }

  /**
   * Check if a branch exists
   */
  private async branchExists(branchName: string): Promise<boolean> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${branchName}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    return response.ok
  }

  /**
   * Create a new branch
   */
  private async createBranch(branchName: string, fromSha: string): Promise<void> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: fromSha,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create branch: ${error}`)
    }
  }

  /**
   * Commit files to a branch
   */
  private async commitFiles(
    branchName: string,
    files: FileChange[],
    message: string,
    taskId: string,
  ): Promise<{ success: boolean; sha?: string; url?: string; error?: string }> {
    console.log(`[v0] Committing ${files.length} files to ${branchName}`)

    try {
      // Get the latest commit on the branch
      const latestCommit = await this.getLatestCommit(branchName)

      // Get the tree SHA from the latest commit
      const commitDetails = await this.getCommitDetails(latestCommit.sha)
      const baseTreeSha = commitDetails.tree.sha

      // Create blobs for each file
      const treeItems = await Promise.all(
        files.map(async (file) => {
          if (file.operation === "delete") {
            return {
              path: file.path,
              mode: "100644" as const,
              type: "blob" as const,
              sha: null, // null SHA means delete
            }
          }

          const blob = await this.createBlob(file.content)
          return {
            path: file.path,
            mode: "100644" as const,
            type: "blob" as const,
            sha: blob.sha,
          }
        }),
      )

      // Create a new tree
      const tree = await this.createTree(baseTreeSha, treeItems)

      // Create a new commit
      const commit = await this.createCommit(message, tree.sha, latestCommit.sha)

      // Update the branch reference
      await this.updateRef(branchName, commit.sha)

      const commitUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${commit.sha}`

      console.log(`[v0] ✓ Committed to ${branchName}: ${commit.sha.substring(0, 7)}`)

      return {
        success: true,
        sha: commit.sha,
        url: commitUrl,
      }
    } catch (error) {
      console.error(`[v0] Error committing files:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Get commit details
   */
  private async getCommitDetails(sha: string): Promise<any> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${sha}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get commit details: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a blob
   */
  private async createBlob(content: string): Promise<{ sha: string }> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: Buffer.from(content).toString("base64"),
        encoding: "base64",
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create blob: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a tree
   */
  private async createTree(baseTreeSha: string, tree: any[]): Promise<{ sha: string }> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create tree: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a commit
   */
  private async createCommit(message: string, treeSha: string, parentSha: string): Promise<{ sha: string }> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to create commit: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update a branch reference
   */
  private async updateRef(branchName: string, sha: string): Promise<void> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${branchName}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sha,
        force: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update ref: ${response.statusText}`)
    }
  }

  /**
   * Create a pull request
   */
  private async createPullRequest(
    branchName: string,
    title: string,
    body: string,
  ): Promise<{ url: string; number: number }> {
    console.log(`[v0] Creating pull request from ${branchName}`)

    const defaultBranch = await this.getDefaultBranch()

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
        head: branchName,
        base: defaultBranch,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create pull request: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Created PR #${data.number}: ${data.html_url}`)

    return {
      url: data.html_url,
      number: data.number,
    }
  }

  /**
   * Log code changes to database
   */
  private async logCodeChanges(
    taskId: string,
    files: FileChange[],
    commitSha: string,
    branchName: string,
    commitMessage: string,
    userId?: string,
  ): Promise<void> {
    console.log(`[v0] Logging ${files.length} file changes to database`)

    const commitUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${commitSha}`

    for (const file of files) {
      const changeType = file.operation === "create" ? "created" : file.operation === "delete" ? "deleted" : "modified"

      // Calculate lines added/removed (simplified - in real implementation, would do proper diff)
      const lines = file.content.split("\n").length
      const linesAdded = file.operation === "delete" ? 0 : lines
      const linesRemoved = file.operation === "delete" ? lines : 0

      await this.supabase.from("code_change_log").insert({
        task_id: taskId,
        file_path: file.path,
        change_type: changeType,
        lines_added: linesAdded,
        lines_removed: linesRemoved,
        commit_sha: commitSha,
        commit_message: commitMessage,
        commit_url: commitUrl,
        branch_name: branchName,
        author: userId || "v0-agent",
        author_email: userId ? undefined : "v0@vercel.com",
        changed_at: new Date().toISOString(),
      })
    }

    console.log(`[v0] ✓ Logged ${files.length} file changes`)
  }

  /**
   * Update task metadata with git information
   */
  private async updateTaskMetadata(taskId: string, branchName: string, commitSha: string): Promise<void> {
    const { data: task } = await this.supabase
      .from("user_stories")
      .select("git_commits, git_branch")
      .eq("task_id", taskId)
      .single()

    const existingCommits = (task?.git_commits as string[]) || []
    const updatedCommits = [...new Set([...existingCommits, commitSha])]

    await this.supabase
      .from("user_stories")
      .update({
        git_branch: branchName,
        git_commits: updatedCommits,
        last_synced_at: new Date().toISOString(),
      })
      .eq("task_id", taskId)

    console.log(`[v0] ✓ Updated task metadata for ${taskId}`)
  }

  /**
   * Create a GitHub issue
   */
  async createIssue(params: CreateIssueParams): Promise<GitHubIssue> {
    console.log(`[v0] Creating GitHub issue: ${params.title}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: params.title,
        body: params.body,
        labels: params.labels || [],
        assignees: params.assignees || [],
        milestone: params.milestone,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create issue: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Created issue #${data.number}: ${data.html_url}`)

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      labels: data.labels.map((l: any) => l.name),
      assignees: data.assignees.map((a: any) => a.login),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Get an issue by number
   */
  async getIssue(issueNumber: number): Promise<GitHubIssue> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get issue: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      labels: data.labels.map((l: any) => l.name),
      assignees: data.assignees.map((a: any) => a.login),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Update an issue
   */
  async updateIssue(issueNumber: number, params: UpdateIssueParams): Promise<GitHubIssue> {
    console.log(`[v0] Updating issue #${issueNumber}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update issue: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Updated issue #${issueNumber}`)

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      labels: data.labels.map((l: any) => l.name),
      assignees: data.assignees.map((a: any) => a.login),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Close an issue
   */
  async closeIssue(issueNumber: number): Promise<GitHubIssue> {
    return this.updateIssue(issueNumber, { state: "closed" })
  }

  /**
   * List issues
   */
  async listIssues(state: "open" | "closed" | "all" = "open", labels?: string[]): Promise<GitHubIssue[]> {
    const params = new URLSearchParams({ state })
    if (labels && labels.length > 0) {
      params.append("labels", labels.join(","))
    }

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?${params}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list issues: ${response.statusText}`)
    }

    const data = await response.json()

    return data.map((issue: any) => ({
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      url: issue.html_url,
      labels: issue.labels.map((l: any) => l.name),
      assignees: issue.assignees.map((a: any) => a.login),
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }))
  }

  /**
   * Add a comment to an issue
   */
  async addIssueComment(issueNumber: number, body: string): Promise<{ id: number; url: string }> {
    console.log(`[v0] Adding comment to issue #${issueNumber}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to add comment: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Added comment to issue #${issueNumber}`)

    return {
      id: data.id,
      url: data.html_url,
    }
  }

  /**
   * Get a pull request by number
   */
  async getPullRequest(prNumber: number): Promise<GitHubPullRequest> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get pull request: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      head: data.head.ref,
      base: data.base.ref,
      mergeable: data.mergeable,
      merged: data.merged,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Update a pull request
   */
  async updatePullRequest(prNumber: number, params: UpdatePRParams): Promise<GitHubPullRequest> {
    console.log(`[v0] Updating PR #${prNumber}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update pull request: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Updated PR #${prNumber}`)

    return {
      number: data.number,
      title: data.title,
      body: data.body,
      state: data.state,
      url: data.html_url,
      head: data.head.ref,
      base: data.base.ref,
      mergeable: data.mergeable,
      merged: data.merged,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
   * Merge a pull request
   */
  async mergePullRequest(
    prNumber: number,
    commitTitle?: string,
    commitMessage?: string,
    mergeMethod: "merge" | "squash" | "rebase" = "merge",
  ): Promise<{ sha: string; merged: boolean; message: string }> {
    console.log(`[v0] Merging PR #${prNumber} using ${mergeMethod}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls/${prNumber}/merge`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commit_title: commitTitle,
        commit_message: commitMessage,
        merge_method: mergeMethod,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to merge pull request: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Merged PR #${prNumber}`)

    return {
      sha: data.sha,
      merged: data.merged,
      message: data.message,
    }
  }

  /**
   * Close a pull request
   */
  async closePullRequest(prNumber: number): Promise<GitHubPullRequest> {
    return this.updatePullRequest(prNumber, { state: "closed" })
  }

  /**
   * List pull requests
   */
  async listPullRequests(state: "open" | "closed" | "all" = "open"): Promise<GitHubPullRequest[]> {
    const params = new URLSearchParams({ state })

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls?${params}`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list pull requests: ${response.statusText}`)
    }

    const data = await response.json()

    return data.map((pr: any) => ({
      number: pr.number,
      title: pr.title,
      body: pr.body,
      state: pr.state,
      url: pr.html_url,
      head: pr.head.ref,
      base: pr.base.ref,
      mergeable: pr.mergeable,
      merged: pr.merged,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
    }))
  }

  /**
   * Add a comment to a pull request
   */
  async addPRComment(prNumber: number, body: string): Promise<{ id: number; url: string }> {
    console.log(`[v0] Adding comment to PR #${prNumber}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${prNumber}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to add comment: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Added comment to PR #${prNumber}`)

    return {
      id: data.id,
      url: data.html_url,
    }
  }

  /**
   * Add labels to an issue or PR
   */
  async addLabels(issueNumber: number, labels: string[]): Promise<string[]> {
    console.log(`[v0] Adding labels to #${issueNumber}: ${labels.join(", ")}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/labels`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ labels }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to add labels: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Added labels to #${issueNumber}`)

    return data.map((label: any) => label.name)
  }

  /**
   * Remove a label from an issue or PR
   */
  async removeLabel(issueNumber: number, label: string): Promise<void> {
    console.log(`[v0] Removing label "${label}" from #${issueNumber}`)

    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/labels/${encodeURIComponent(label)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!response.ok && response.status !== 404) {
      const error = await response.text()
      throw new Error(`Failed to remove label: ${error}`)
    }

    console.log(`[v0] ✓ Removed label "${label}" from #${issueNumber}`)
  }

  /**
   * Set labels for an issue or PR (replaces all existing labels)
   */
  async setLabels(issueNumber: number, labels: string[]): Promise<string[]> {
    console.log(`[v0] Setting labels for #${issueNumber}: ${labels.join(", ")}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/labels`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ labels }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to set labels: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Set labels for #${issueNumber}`)

    return data.map((label: any) => label.name)
  }

  /**
   * Create a label in the repository
   */
  async createLabel(name: string, color: string, description?: string): Promise<GitHubLabel> {
    console.log(`[v0] Creating label: ${name}`)

    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/labels`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        color: color.replace("#", ""), // Remove # if present
        description: description || "",
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create label: ${error}`)
    }

    const data = await response.json()
    console.log(`[v0] ✓ Created label: ${name}`)

    return {
      name: data.name,
      color: data.color,
      description: data.description,
    }
  }

  /**
   * List all labels in the repository
   */
  async listLabels(): Promise<GitHubLabel[]> {
    const response = await fetch(`${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/labels`, {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to list labels: ${response.statusText}`)
    }

    const data = await response.json()

    return data.map((label: any) => ({
      name: label.name,
      color: label.color,
      description: label.description,
    }))
  }

  /**
   * Delete a label from the repository
   */
  async deleteLabel(name: string): Promise<void> {
    console.log(`[v0] Deleting label: ${name}`)

    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/labels/${encodeURIComponent(name)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!response.ok && response.status !== 404) {
      const error = await response.text()
      throw new Error(`Failed to delete label: ${error}`)
    }

    console.log(`[v0] ✓ Deleted label: ${name}`)
  }
}

/**
 * Factory function to create a GitHubWorkflowService instance
 */
export function createGitHubWorkflowService(): GitHubWorkflowService {
  const githubToken = process.env.GITHUB_TOKEN
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!githubToken) {
    throw new Error("GITHUB_TOKEN environment variable is required")
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are required")
  }

  return new GitHubWorkflowService(githubToken, supabaseUrl, supabaseKey)
}
