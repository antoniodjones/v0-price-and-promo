/**
 * @task CS-004-A
 * @epic Integration Management
 * @description Jira API Service Layer - handles authentication and CRUD operations for Jira issues
 */

export interface JiraIssue {
  id: string
  key: string
  fields: {
    summary: string
    description: string
    status: {
      name: string
      id: string
    }
    issuetype: {
      name: string
      id: string
    }
    priority?: {
      name: string
      id: string
    }
    assignee?: {
      displayName: string
      emailAddress: string
    }
    reporter?: {
      displayName: string
      emailAddress: string
    }
    created: string
    updated: string
    labels: string[]
    customfield_10016?: number // Story points
  }
}

export interface JiraIssueCreate {
  summary: string
  description: string
  issueType: string
  priority?: string
  labels?: string[]
  storyPoints?: number
}

export interface JiraIssueUpdate {
  summary?: string
  description?: string
  status?: string
  priority?: string
  labels?: string[]
  storyPoints?: number
}

const JIRA_API_VERSION = "3"

/**
 * Jira API Client
 * Handles authentication and API calls to Jira REST API
 */
export class JiraAPIClient {
  private baseUrl: string
  private auth: string
  private projectKey: string

  constructor() {
    this.baseUrl = process.env.JIRA_BASE_URL!
    const email = process.env.JIRA_EMAIL!
    const token = process.env.JIRA_API_TOKEN!
    this.projectKey = process.env.JIRA_PROJECT_KEY || "PRICE"

    // Basic Auth: base64(email:token)
    this.auth = `Basic ${Buffer.from(`${email}:${token}`).toString("base64")}`
  }

  /**
   * Test connection to Jira
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/myself`, {
        headers: {
          Authorization: this.auth,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error: `Failed to connect: ${error}` }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Create a new Jira issue
   */
  async createIssue(data: JiraIssueCreate): Promise<JiraIssue> {
    console.log("[v0] Creating Jira issue:", data.summary)

    const payload = {
      fields: {
        project: {
          key: this.projectKey,
        },
        summary: data.summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: data.description,
                },
              ],
            },
          ],
        },
        issuetype: {
          name: data.issueType || "Task",
        },
        ...(data.priority && {
          priority: {
            name: data.priority,
          },
        }),
        ...(data.labels &&
          data.labels.length > 0 && {
            labels: data.labels,
          }),
        ...(data.storyPoints && {
          customfield_10016: data.storyPoints, // Story points field
        }),
      },
    }

    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue`, {
      method: "POST",
      headers: {
        Authorization: this.auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create Jira issue: ${error}`)
    }

    const result = await response.json()
    console.log("[v0] ✓ Created Jira issue:", result.key)

    // Fetch the full issue details
    return this.getIssue(result.key)
  }

  /**
   * Get a Jira issue by key
   */
  async getIssue(issueKey: string): Promise<JiraIssue> {
    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue/${issueKey}`, {
      headers: {
        Authorization: this.auth,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get Jira issue: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update a Jira issue
   */
  async updateIssue(issueKey: string, data: JiraIssueUpdate): Promise<JiraIssue> {
    console.log("[v0] Updating Jira issue:", issueKey)

    const payload: any = {
      fields: {},
    }

    if (data.summary) {
      payload.fields.summary = data.summary
    }

    if (data.description) {
      payload.fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: data.description,
              },
            ],
          },
        ],
      }
    }

    if (data.priority) {
      payload.fields.priority = {
        name: data.priority,
      }
    }

    if (data.labels) {
      payload.fields.labels = data.labels
    }

    if (data.storyPoints !== undefined) {
      payload.fields.customfield_10016 = data.storyPoints
    }

    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue/${issueKey}`, {
      method: "PUT",
      headers: {
        Authorization: this.auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update Jira issue: ${error}`)
    }

    // Handle status transition separately if needed
    if (data.status) {
      await this.transitionIssue(issueKey, data.status)
    }

    console.log("[v0] ✓ Updated Jira issue:", issueKey)

    // Fetch the updated issue
    return this.getIssue(issueKey)
  }

  /**
   * Transition a Jira issue to a new status
   */
  private async transitionIssue(issueKey: string, statusName: string): Promise<void> {
    // Get available transitions
    const transitionsResponse = await fetch(
      `${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue/${issueKey}/transitions`,
      {
        headers: {
          Authorization: this.auth,
          Accept: "application/json",
        },
      },
    )

    if (!transitionsResponse.ok) {
      throw new Error("Failed to get transitions")
    }

    const transitions = await transitionsResponse.json()
    const transition = transitions.transitions.find((t: any) => t.to.name.toLowerCase() === statusName.toLowerCase())

    if (!transition) {
      console.warn(`[v0] Transition to "${statusName}" not available for ${issueKey}`)
      return
    }

    // Execute transition
    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue/${issueKey}/transitions`, {
      method: "POST",
      headers: {
        Authorization: this.auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        transition: {
          id: transition.id,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to transition issue: ${error}`)
    }

    console.log("[v0] ✓ Transitioned", issueKey, "to", statusName)
  }

  /**
   * Search for Jira issues using JQL
   */
  async searchIssues(jql: string, maxResults = 50): Promise<JiraIssue[]> {
    const params = new URLSearchParams({
      jql,
      maxResults: maxResults.toString(),
    })

    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/search?${params}`, {
      headers: {
        Authorization: this.auth,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to search Jira issues: ${response.statusText}`)
    }

    const result = await response.json()
    return result.issues
  }

  /**
   * Add a comment to a Jira issue
   */
  async addComment(issueKey: string, comment: string): Promise<void> {
    console.log("[v0] Adding comment to Jira issue:", issueKey)

    const payload = {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: comment,
              },
            ],
          },
        ],
      },
    }

    const response = await fetch(`${this.baseUrl}/rest/api/${JIRA_API_VERSION}/issue/${issueKey}/comment`, {
      method: "POST",
      headers: {
        Authorization: this.auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to add comment: ${error}`)
    }

    console.log("[v0] ✓ Added comment to", issueKey)
  }
}

/**
 * Factory function to create a JiraAPIClient instance
 */
export function createJiraClient(): JiraAPIClient {
  if (!process.env.JIRA_BASE_URL || !process.env.JIRA_EMAIL || !process.env.JIRA_API_TOKEN) {
    throw new Error("Jira environment variables are not configured")
  }

  return new JiraAPIClient()
}
