/**
 * @task gl-001
 * @description GitLab API Integration Service - handles repository operations and webhooks
 */

interface GitLabConfig {
  baseUrl: string
  token: string
  projectId: string
}

interface GitLabCommit {
  id: string
  short_id: string
  title: string
  message: string
  author_name: string
  author_email: string
  authored_date: string
  committed_date: string
  web_url: string
}

interface GitLabMergeRequest {
  id: number
  iid: number
  title: string
  description: string
  state: string
  source_branch: string
  target_branch: string
  author: { name: string; username: string }
  web_url: string
}

interface GitLabIssue {
  id: number
  iid: number
  title: string
  description: string
  state: string
  labels: string[]
  assignees: Array<{ name: string; username: string }>
  web_url: string
}

export class GitLabService {
  private config: GitLabConfig

  constructor(config: GitLabConfig) {
    this.config = config
  }

  private get headers() {
    return {
      "PRIVATE-TOKEN": this.config.token,
      "Content-Type": "application/json",
    }
  }

  /**
   * Test connection to GitLab
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/user`, {
        headers: this.headers,
      })
      return response.ok
    } catch (error) {
      console.error("[v0] GitLab connection test failed:", error)
      return false
    }
  }

  /**
   * Get project information
   */
  async getProject() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/projects/${this.config.projectId}`, {
        headers: this.headers,
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching GitLab project:", error)
      return null
    }
  }

  /**
   * Get recent commits
   */
  async getCommits(branch = "main", since?: string): Promise<GitLabCommit[]> {
    try {
      const params = new URLSearchParams({ ref_name: branch })
      if (since) params.append("since", since)

      const response = await fetch(
        `${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/repository/commits?${params}`,
        { headers: this.headers },
      )

      if (!response.ok) return []
      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching GitLab commits:", error)
      return []
    }
  }

  /**
   * Get commit details with diff
   */
  async getCommitDiff(commitSha: string) {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/repository/commits/${commitSha}/diff`,
        { headers: this.headers },
      )

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching GitLab commit diff:", error)
      return null
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchName: string, ref = "main"): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/repository/branches`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({ branch: branchName, ref }),
        },
      )

      return response.ok
    } catch (error) {
      console.error("[v0] Error creating GitLab branch:", error)
      return false
    }
  }

  /**
   * Create a merge request
   */
  async createMergeRequest(
    sourceBranch: string,
    targetBranch: string,
    title: string,
    description: string,
  ): Promise<GitLabMergeRequest | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/merge_requests`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          source_branch: sourceBranch,
          target_branch: targetBranch,
          title,
          description,
        }),
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("[v0] Error creating GitLab merge request:", error)
      return null
    }
  }

  /**
   * Create an issue
   */
  async createIssue(title: string, description: string, labels: string[] = []): Promise<GitLabIssue | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/issues`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          title,
          description,
          labels: labels.join(","),
        }),
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("[v0] Error creating GitLab issue:", error)
      return null
    }
  }

  /**
   * Update an issue
   */
  async updateIssue(
    issueIid: number,
    updates: {
      title?: string
      description?: string
      state_event?: "close" | "reopen"
      labels?: string[]
    },
  ): Promise<boolean> {
    try {
      const body: any = { ...updates }
      if (updates.labels) {
        body.labels = updates.labels.join(",")
      }

      const response = await fetch(
        `${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/issues/${issueIid}`,
        {
          method: "PUT",
          headers: this.headers,
          body: JSON.stringify(body),
        },
      )

      return response.ok
    } catch (error) {
      console.error("[v0] Error updating GitLab issue:", error)
      return false
    }
  }

  /**
   * Add a comment to an issue
   */
  async addIssueComment(issueIid: number, body: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/issues/${issueIid}/notes`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({ body }),
        },
      )

      return response.ok
    } catch (error) {
      console.error("[v0] Error adding GitLab issue comment:", error)
      return false
    }
  }

  /**
   * Get project labels
   */
  async getLabels() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/labels`, {
        headers: this.headers,
      })

      if (!response.ok) return []
      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching GitLab labels:", error)
      return []
    }
  }

  /**
   * Create a project label
   */
  async createLabel(name: string, color: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v4/projects/${this.config.projectId}/labels`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ name, color }),
      })

      return response.ok
    } catch (error) {
      console.error("[v0] Error creating GitLab label:", error)
      return false
    }
  }
}

/**
 * Factory function to create a GitLabService instance
 */
export function createGitLabService(): GitLabService | null {
  const baseUrl = process.env.GITLAB_BASE_URL || "https://gitlab.com"
  const token = process.env.GITLAB_TOKEN
  const projectId = process.env.GITLAB_PROJECT_ID

  if (!token || !projectId) {
    console.error("[v0] Missing GitLab configuration environment variables")
    return null
  }

  return new GitLabService({ baseUrl, token, projectId })
}
