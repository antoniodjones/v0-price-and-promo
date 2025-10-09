/**
 * @task GL-011
 * @epic Integration Management
 * @description Git Provider Abstraction Layer - unified interface for GitHub and GitLab
 */

export interface GitCommit {
  sha: string
  message: string
  author: string
  authorEmail: string
  date: string
  url: string
  stats?: {
    additions: number
    deletions: number
    total: number
  }
}

export interface GitRepository {
  id: string | number
  name: string
  fullName: string
  url: string
  defaultBranch: string
}

export interface GitProvider {
  name: "github" | "gitlab"

  // Repository operations
  getRepository(): Promise<GitRepository>
  listCommits(options?: { branch?: string; since?: string; limit?: number }): Promise<GitCommit[]>
  getCommit(sha: string): Promise<GitCommit>
  getCommitDiff(sha: string): Promise<any[]>

  // Connection
  testConnection(): Promise<boolean>

  // Metadata
  getProviderName(): string
  getProjectIdentifier(): string
}

export interface DualSyncOptions {
  providers: GitProvider[]
  syncMode: "parallel" | "sequential"
  failureStrategy: "continue" | "stop"
}
