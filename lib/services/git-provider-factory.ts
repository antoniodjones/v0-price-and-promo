/**
 * @task GL-011
 * @description Factory for creating Git provider instances
 */

import type { GitProvider } from "./git-provider-interface"
import { GitHubProvider } from "./github-provider"
import { GitLabProvider } from "./gitlab-provider"

export type ProviderType = "github" | "gitlab" | "both"

export class GitProviderFactory {
  static create(type: ProviderType): GitProvider | GitProvider[] {
    switch (type) {
      case "github":
        return new GitHubProvider()
      case "gitlab":
        return new GitLabProvider()
      case "both":
        return [new GitHubProvider(), new GitLabProvider()]
      default:
        throw new Error(`Unknown provider type: ${type}`)
    }
  }

  static async testAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    try {
      const github = new GitHubProvider()
      results.github = await github.testConnection()
    } catch {
      results.github = false
    }

    try {
      const gitlab = new GitLabProvider()
      results.gitlab = await gitlab.testConnection()
    } catch {
      results.gitlab = false
    }

    return results
  }
}
