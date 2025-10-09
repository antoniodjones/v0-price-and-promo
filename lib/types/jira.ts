// Jira API Types
export interface JiraIssue {
  id: string
  key: string
  fields: {
    summary: string
    description?: string
    status: {
      name: string
      id: string
    }
    priority: {
      name: string
      id: string
    }
    issuetype: {
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
    customfield_10016?: number // Story points
    labels?: string[]
  }
}

export interface JiraIssueCreate {
  fields: {
    project: {
      key: string
    }
    summary: string
    description?: string
    issuetype: {
      name: string
    }
    priority?: {
      name: string
    }
    labels?: string[]
    customfield_10016?: number // Story points
  }
}

export interface JiraIssueUpdate {
  fields?: {
    summary?: string
    description?: string
    priority?: {
      name: string
    }
    labels?: string[]
    customfield_10016?: number
  }
  transition?: {
    id: string
  }
}

export interface JiraTransition {
  id: string
  name: string
  to: {
    name: string
    id: string
  }
}

export interface JiraSyncLog {
  id: string
  task_id: string
  jira_issue_key: string
  sync_type: "push" | "pull" | "create" | "update"
  sync_status: "success" | "error" | "partial"
  changes_synced: Record<string, any>
  error_message?: string
  synced_at: string
}
