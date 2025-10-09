/**
 * @task GL-011
 * @description GitLab implementation of GitProvider interface
 */

import type { GitProvider, GitRepository, GitCommit } from "./git-provider-interface"
import { GitLabAPIClient } from "./gitlab-api"

export class GitLabProvider implements GitProvider {
  name = "gitlab" as const
  private client: GitLabAPIClient

  constructor() {
    this.client = new GitLabAPIClient()
  }

  async getRepository(): Promise<GitRepository> {
    const project = await this.client.getProject()
    return {
      id: project.id,
      name: project.name,
      fullName: project.path_with_namespace,
      url: project.web_url,
      defaultBranch: project.default_branch,
    }
  }

  async listCommits(options?: { branch?: string; since?: string; limit?: number }): Promise<GitCommit[]> {
    const commits = await this.client.listCommits({
      ref_name: options?.branch,
      since: options?.since,
      per_page: options?.limit,
    })

    return commits.map((commit) => ({
      sha: commit.id,
      message: commit.message,
      author: commit.author_name,
      authorEmail: commit.author_email,
      date: commit.authored_date,
      url: commit.web_url,
      stats: commit.stats,
    }))
  }

  async getCommit(sha: string): Promise<GitCommit> {
    const commit = await this.client.getCommit(sha)
    return {
      sha: commit.id,
      message: commit.message,
      author: commit.author_name,
      authorEmail: commit.author_email,
      date: commit.authored_date,
      url: commit.web_url,
      stats: commit.stats,
    }
  }

  async getCommitDiff(sha: string): Promise<any[]> {
    return this.client.getCommitDiff(sha)
  }

  async testConnection(): Promise<boolean> {
    return this.client.testConnection()
  }

  getProviderName(): string {
    return "GitLab"
  }

  getProjectIdentifier(): string {
    return this.client.getProjectId()
  }
}
