/**
 * @task cs-004, gl-001
 * @description Test endpoint for Jira and GitLab connections
 */

import { NextResponse } from "next/server"
import { createJiraService } from "@/lib/services/jira-service"
import { createGitLabService } from "@/lib/services/gitlab-service"

export async function GET() {
  const results: any = {
    jira: { configured: false, connected: false },
    gitlab: { configured: false, connected: false },
  }

  // Test Jira
  const jiraService = createJiraService()
  if (jiraService) {
    results.jira.configured = true
    results.jira.connected = await jiraService.testConnection()
  }

  // Test GitLab
  const gitlabService = createGitLabService()
  if (gitlabService) {
    results.gitlab.configured = true
    results.gitlab.connected = await gitlabService.testConnection()
    if (results.gitlab.connected) {
      results.gitlab.project = await gitlabService.getProject()
    }
  }

  return NextResponse.json(results)
}
