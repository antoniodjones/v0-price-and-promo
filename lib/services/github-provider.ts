/**
 * @task GL-011
 * @description GitHub implementation of GitProvider interface
 */

import type { GitProvider, GitRepository, GitCommit } from "./git-provider-interface"

export class GitHubProvider implements GitProvider {
  name = "github" as const
  private token: string
  private owner: string
  private repo: string

  constructor() {
    this.token = process.env.GITHUB_TOKEN!
    this.owner = process.env.GITHUB_OWNER!
    this.repo = process.env.GITHUB_REPO!
  }

  async getRepository(): Promise<GitRepository> {
    const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      url: data.html_url,
      defaultBranch: data.default_branch,
    }
  }

  async listCommits(options?: { branch?: string; since?: string; limit?: number }): Promise<GitCommit[]> {
    const params = new URLSearchParams()
    if (options?.branch) params.append("sha", options.branch)
    if (options?.since) params.append("since", options.since)
    if (options?.limit) params.append("per_page", options.limit.toString())

    const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/commits?${params}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      url: commit.html_url,
      stats: commit.stats,
    }))
  }

  async getCommit(sha: string): Promise<GitCommit> {
    const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/commits/${sha}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const commit = await response.json()
    return {
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      authorEmail: commit.commit.author.email,
      date: commit.commit.author.date,
      url: commit.html_url,
      stats: commit.stats,
    }
  }

  async getCommitDiff(sha: string): Promise<any[]> {
    const response = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/commits/${sha}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.files || []
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getRepository()
      return true
    } catch {
      return false
    }
  }

  getProviderName(): string {
    return "GitHub"
  }

  getProjectIdentifier(): string {
    return `${this.owner}/${this.repo}`
  }
}
