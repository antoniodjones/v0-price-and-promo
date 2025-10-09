/**
 * @task cs-004
 * @description Jira API Integration Service - handles bi-directional sync with Jira
 */

interface JiraConfig {
  baseUrl: string
  email: string
  apiToken: string
  projectKey: string
}

interface JiraIssue {
  id: string
  key: string
  fields: {
    summary: string
    description: string
    status: { name: string }
    assignee?: { displayName: string; emailAddress: string }
    priority: { name: string }
    issuetype: { name: string }
    customfield_10016?: number // Story points
    parent?: { key: string }
  }
}

interface CreateIssuePayload {
  summary: string
  description: string
  issueType: string
  priority?: string
  storyPoints?: number
  parentKey?: string
}

export class JiraService {
  private config: JiraConfig
  private authHeader: string

  constructor(config: JiraConfig) {
    this.config = config
    // Jira uses Basic Auth with email:apiToken base64 encoded
    this.authHeader = `Basic ${Buffer.from(`${config.email}:${config.apiToken}`).toString("base64")}`
  }

  /**
   * Test connection to Jira
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/myself`, {
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      console.error("[v0] Jira connection test failed:", error)
      return false
    }
  }

  /**
   * Create a new Jira issue from a user story
   */
  async createIssue(payload: CreateIssuePayload): Promise<JiraIssue | null> {
    try {
      const body = {
        fields: {
          project: { key: this.config.projectKey },
          summary: payload.summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: payload.description }],
              },
            ],
          },
          issuetype: { name: payload.issueType || "Story" },
          priority: payload.priority ? { name: payload.priority } : undefined,
          customfield_10016: payload.storyPoints, // Story points field
          parent: payload.parentKey ? { key: payload.parentKey } : undefined,
        },
      }

      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue`, {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Failed to create Jira issue:", error)
        return null
      }

      const data = await response.json()
      return await this.getIssue(data.key)
    } catch (error) {
      console.error("[v0] Error creating Jira issue:", error)
      return null
    }
  }

  /**
   * Get a Jira issue by key
   */
  async getIssue(issueKey: string): Promise<JiraIssue | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}`, {
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Error fetching Jira issue:", error)
      return null
    }
  }

  /**
   * Update a Jira issue
   */
  async updateIssue(issueKey: string, updates: Partial<CreateIssuePayload>): Promise<boolean> {
    try {
      const fields: any = {}

      if (updates.summary) fields.summary = updates.summary
      if (updates.description) {
        fields.description = {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: updates.description }],
            },
          ],
        }
      }
      if (updates.priority) fields.priority = { name: updates.priority }
      if (updates.storyPoints !== undefined) fields.customfield_10016 = updates.storyPoints

      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}`, {
        method: "PUT",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      })

      return response.ok
    } catch (error) {
      console.error("[v0] Error updating Jira issue:", error)
      return false
    }
  }

  /**
   * Transition issue status (e.g., To Do -> In Progress -> Done)
   */
  async transitionIssue(issueKey: string, transitionName: string): Promise<boolean> {
    try {
      // First, get available transitions
      const transitionsResponse = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`, {
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
      })

      if (!transitionsResponse.ok) return false

      const { transitions } = await transitionsResponse.json()
      const transition = transitions.find((t: any) => t.name.toLowerCase() === transitionName.toLowerCase())

      if (!transition) {
        console.error(`[v0] Transition "${transitionName}" not found`)
        return false
      }

      // Execute the transition
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`, {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transition: { id: transition.id },
        }),
      })

      return response.ok
    } catch (error) {
      console.error("[v0] Error transitioning Jira issue:", error)
      return false
    }
  }

  /**
   * Add a comment to a Jira issue
   */
  async addComment(issueKey: string, comment: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/issue/${issueKey}/comment`, {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: comment }],
              },
            ],
          },
        }),
      })

      return response.ok
    } catch (error) {
      console.error("[v0] Error adding Jira comment:", error)
      return false
    }
  }

  /**
   * Search for issues using JQL
   */
  async searchIssues(jql: string, maxResults = 50): Promise<JiraIssue[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/rest/api/3/search`, {
        method: "POST",
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jql,
          maxResults,
          fields: [
            "summary",
            "description",
            "status",
            "assignee",
            "priority",
            "issuetype",
            "customfield_10016",
            "parent",
          ],
        }),
      })

      if (!response.ok) {
        return []
      }

      const data = await response.json()
      return data.issues || []
    } catch (error) {
      console.error("[v0] Error searching Jira issues:", error)
      return []
    }
  }
}

/**
 * Factory function to create a JiraService instance
 */
export function createJiraService(): JiraService | null {
  const baseUrl = process.env.JIRA_BASE_URL
  const email = process.env.JIRA_EMAIL
  const apiToken = process.env.JIRA_API_TOKEN
  const projectKey = process.env.JIRA_PROJECT_KEY

  if (!baseUrl || !email || !apiToken || !projectKey) {
    console.error("[v0] Missing Jira configuration environment variables")
    return null
  }

  return new JiraService({ baseUrl, email, apiToken, projectKey })
}
