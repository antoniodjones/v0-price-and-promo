// GitLab API Types
export interface GitLabProject {
  id: number
  name: string
  path: string
  path_with_namespace: string
  web_url: string
  default_branch: string
}

export interface GitLabCommit {
  id: string
  short_id: string
  title: string
  message: string
  author_name: string
  author_email: string
  authored_date: string
  committer_name: string
  committer_email: string
  committed_date: string
  web_url: string
  stats?: {
    additions: number
    deletions: number
    total: number
  }
}

export interface GitLabPushEvent {
  object_kind: "push"
  event_name: "push"
  before: string
  after: string
  ref: string
  checkout_sha: string
  user_id: number
  user_name: string
  user_email: string
  project_id: number
  project: GitLabProject
  commits: GitLabCommit[]
  total_commits_count: number
}

export interface GitLabMergeRequestEvent {
  object_kind: "merge_request"
  event_type: "merge_request"
  user: {
    name: string
    username: string
    email: string
  }
  project: GitLabProject
  object_attributes: {
    id: number
    iid: number
    title: string
    description: string
    state: string
    merge_status: string
    source_branch: string
    target_branch: string
    last_commit: {
      id: string
      message: string
      timestamp: string
    }
  }
}
