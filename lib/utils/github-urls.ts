/**
 * @task cs-015
 * @epic Code Sync
 * @description GitHub URL utilities for generating clickable links
 */

const GITHUB_OWNER = process.env.GITHUB_OWNER || process.env.NEXT_PUBLIC_GITHUB_OWNER || "antoniodjones"
const GITHUB_REPO = process.env.GITHUB_REPO || process.env.NEXT_PUBLIC_GITHUB_REPO || "v0-price-and-promo"

export interface GitHubUrls {
  repo: string
  branch: (branchName: string) => string
  commit: (commitSha: string) => string
  pr: (prNumber: number) => string
  issue: (issueNumber: number) => string
  compare: (base: string, head: string) => string
  file: (filePath: string, ref?: string) => string
  blob: (filePath: string, ref?: string) => string
}

/**
 * Generate GitHub URLs for various resources
 */
export const githubUrls: GitHubUrls = {
  repo: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,

  branch: (branchName: string) => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/tree/${branchName}`,

  commit: (commitSha: string) => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${commitSha}`,

  pr: (prNumber: number) => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/pull/${prNumber}`,

  issue: (issueNumber: number) => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`,

  compare: (base: string, head: string) =>
    `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/compare/${base}...${head}`,

  file: (filePath: string, ref = "main") => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${ref}/${filePath}`,

  blob: (filePath: string, ref = "main") => `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${ref}/${filePath}`,
}

/**
 * Extract GitHub information from URLs
 */
export function parseGitHubUrl(url: string): {
  owner?: string
  repo?: string
  type?: "commit" | "pr" | "issue" | "branch" | "file"
  value?: string | number
} | null {
  const patterns = {
    commit: /github\.com\/([^/]+)\/([^/]+)\/commit\/([a-f0-9]+)/,
    pr: /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
    issue: /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/,
    branch: /github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)/,
    file: /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/,
  }

  for (const [type, pattern] of Object.entries(patterns)) {
    const match = url.match(pattern)
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
        type: type as any,
        value: type === "pr" || type === "issue" ? Number.parseInt(match[3]) : match[3],
      }
    }
  }

  return null
}

/**
 * Format commit SHA for display (short version)
 */
export function formatCommitSha(sha: string, length = 7): string {
  return sha.substring(0, length)
}

/**
 * Get GitHub owner and repo from environment
 */
export function getGitHubConfig() {
  return {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    fullName: `${GITHUB_OWNER}/${GITHUB_REPO}`,
  }
}
