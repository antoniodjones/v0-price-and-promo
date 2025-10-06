/**
 * GitHub URL utilities for generating links to GitHub resources
 */

const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || ""
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || ""
const GITHUB_BASE_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`

export const githubUrls = {
  /**
   * Get URL for a specific commit
   */
  commit: (sha: string) => `${GITHUB_BASE_URL}/commit/${sha}`,

  /**
   * Get URL for a specific branch
   */
  branch: (branchName: string) => `${GITHUB_BASE_URL}/tree/${branchName}`,

  /**
   * Get URL for a specific pull request
   */
  pr: (prNumber: number) => `${GITHUB_BASE_URL}/pull/${prNumber}`,

  /**
   * Get URL for comparing two branches
   */
  compare: (base: string, head: string) => `${GITHUB_BASE_URL}/compare/${base}...${head}`,

  /**
   * Get URL for commit history of a branch
   */
  commits: (branchName = "main") => `${GITHUB_BASE_URL}/commits/${branchName}`,

  /**
   * Get URL for a specific file at a commit
   */
  file: (filePath: string, ref = "main") => `${GITHUB_BASE_URL}/blob/${ref}/${filePath}`,

  /**
   * Get base repository URL
   */
  repo: () => GITHUB_BASE_URL,
}

/**
 * Format a commit SHA for display (first 7 characters)
 */
export function formatCommitSha(sha: string): string {
  return sha.substring(0, 7)
}

/**
 * Check if GitHub is configured
 */
export function isGitHubConfigured(): boolean {
  return Boolean(GITHUB_OWNER && GITHUB_REPO)
}
