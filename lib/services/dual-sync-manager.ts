/**
 * @task GL-011
 * @description Manages dual deployment to both GitHub and GitLab
 */

import type { GitProvider } from "./git-provider-interface"
import { GitProviderFactory } from "./git-provider-factory"

export class DualSyncManager {
  private providers: GitProvider[]

  constructor(providerType: "github" | "gitlab" | "both" = "both") {
    const result = GitProviderFactory.create(providerType)
    this.providers = Array.isArray(result) ? result : [result]
  }

  async syncCommits(options: { since?: string; limit?: number } = {}): Promise<{
    github: any[]
    gitlab: any[]
    errors: string[]
  }> {
    const results = {
      github: [] as any[],
      gitlab: [] as any[],
      errors: [] as string[],
    }

    for (const provider of this.providers) {
      try {
        const commits = await provider.listCommits(options)
        if (provider.name === "github") {
          results.github = commits
        } else {
          results.gitlab = commits
        }
      } catch (error) {
        results.errors.push(`${provider.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return results
  }

  async testAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {}

    for (const provider of this.providers) {
      try {
        results[provider.name] = await provider.testConnection()
      } catch {
        results[provider.name] = false
      }
    }

    return results
  }

  getActiveProviders(): string[] {
    return this.providers.map((p) => p.getProviderName())
  }
}
