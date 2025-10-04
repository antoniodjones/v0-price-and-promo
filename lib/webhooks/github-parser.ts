export interface ParsedCommit {
  sha: string
  message: string
  author: string
  authorEmail: string
  timestamp: string
  url: string
  branch: string
  files: {
    added: string[]
    modified: string[]
    removed: string[]
  }
  taskIds: string[]
}

export function parseGitHubPushPayload(payload: any): ParsedCommit[] {
  const commits = payload.commits || []
  const branch = payload.ref?.replace("refs/heads/", "") || "unknown"

  return commits.map((commit: any) => ({
    sha: commit.id,
    message: commit.message || "",
    author: commit.author?.name || "unknown",
    authorEmail: commit.author?.email || "",
    timestamp: commit.timestamp || new Date().toISOString(),
    url: commit.url || "",
    branch: branch,
    files: {
      added: commit.added || [],
      modified: commit.modified || [],
      removed: commit.removed || [],
    },
    taskIds: extractTaskIdsFromMessage(commit.message || ""),
  }))
}

export function extractTaskIdsFromMessage(message: string): string[] {
  const taskIds: string[] = []

  // Pattern matching for various task ID formats:
  // - "cs-003: description"
  // - "[approval-001] description"
  // - "tm-005 - description"
  // - "FMW-012: description"

  const patterns = [
    /\b([a-z]+-\d+):/gi, // task-id:
    /\[([a-z]+-\d+)\]/gi, // [task-id]
    /\b([a-z]+-\d+)\s+-/gi, // task-id -
  ]

  for (const pattern of patterns) {
    const matches = message.matchAll(pattern)
    for (const match of matches) {
      taskIds.push(match[1].toLowerCase())
    }
  }

  return Array.from(new Set(taskIds))
}

export function getFileChangeType(
  file: string,
  commit: { added?: string[]; modified?: string[]; removed?: string[] },
): "created" | "modified" | "deleted" {
  if (commit.added?.includes(file)) {
    return "created"
  } else if (commit.removed?.includes(file)) {
    return "deleted"
  }
  return "modified"
}

export function extractComponentName(filePath: string): string | null {
  // Extract component name from React/Next.js files
  const match = filePath.match(/([^/]+)\.(tsx?|jsx?)$/)
  if (match) {
    return match[1]
  }
  return null
}

export function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const crypto = require("crypto")
  const hmac = crypto.createHmac("sha256", secret)
  const digest = `sha256=${hmac.update(payload).digest("hex")}`
  return signature === digest
}
