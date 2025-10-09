import type { GitLabProject, GitLabCommit } from "@/lib/types/gitlab"

export class GitLabAPIClient {
  private baseUrl: string
  private token: string
  private projectId: string

  constructor() {
    this.baseUrl = process.env.GITLAB_BASE_URL || "https://gitlab.com"
    this.token = process.env.GITLAB_TOKEN!
    this.projectId = process.env.GITLAB_PROJECT_ID!
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/v4/${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "PRIVATE-TOKEN": this.token,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] GitLab API error:", {
        status: response.status,
        statusText: response.statusText,
        error,
      })
      throw new Error(`GitLab API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getProject(): Promise<GitLabProject> {
    return this.request<GitLabProject>(`projects/${encodeURIComponent(this.projectId)}`)
  }

  async listCommits(options?: {
    ref_name?: string
    since?: string
    until?: string
    per_page?: number
  }): Promise<GitLabCommit[]> {
    const params = new URLSearchParams()
    if (options?.ref_name) params.append("ref_name", options.ref_name)
    if (options?.since) params.append("since", options.since)
    if (options?.until) params.append("until", options.until)
    if (options?.per_page) params.append("per_page", options.per_page.toString())

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request<GitLabCommit[]>(`projects/${encodeURIComponent(this.projectId)}/repository/commits${query}`)
  }

  async getCommit(sha: string): Promise<GitLabCommit> {
    return this.request<GitLabCommit>(`projects/${encodeURIComponent(this.projectId)}/repository/commits/${sha}`)
  }

  async getCommitDiff(sha: string): Promise<any[]> {
    return this.request<any[]>(`projects/${encodeURIComponent(this.projectId)}/repository/commits/${sha}/diff`)
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getProject()
      return true
    } catch (error) {
      console.error("[v0] GitLab connection test failed:", error)
      return false
    }
  }

  getProjectId(): string {
    return this.projectId
  }
}
