"use client"

/**
 * @task cs-012
 * @epic Code Sync
 * @description Task Event Timeline - displays chronological timeline of task events
 */

import { useEffect, useState } from "react"
import { GitBranch, GitCommit, GitPullRequest, CheckCircle2, Play, ToggleLeft as Toggle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface TaskEvent {
  id: string
  task_id: string
  event_type: string
  triggered_by: string
  metadata: Record<string, any>
  created_at: string
}

interface TaskEventTimelineProps {
  taskId: string
}

export function TaskEventTimeline({ taskId }: TaskEventTimelineProps) {
  const [events, setEvents] = useState<TaskEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [taskId])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/task-events/${taskId}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Error fetching task events:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "branch_created":
        return <GitBranch className="h-4 w-4" />
      case "commit_created":
        return <GitCommit className="h-4 w-4" />
      case "pr_opened":
      case "pr_merged":
      case "pr_closed":
        return <GitPullRequest className="h-4 w-4" />
      case "task_completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "task_started":
        return <Play className="h-4 w-4" />
      case "auto_commit_toggled":
        return <Toggle className="h-4 w-4" />
      case "manual_sync":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <GitCommit className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "branch_created":
        return "bg-blue-500"
      case "commit_created":
        return "bg-green-500"
      case "pr_opened":
        return "bg-purple-500"
      case "pr_merged":
        return "bg-indigo-500"
      case "pr_closed":
        return "bg-gray-500"
      case "task_completed":
        return "bg-emerald-500"
      case "task_started":
        return "bg-yellow-500"
      case "auto_commit_toggled":
        return "bg-orange-500"
      case "manual_sync":
        return "bg-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatEventTitle = (event: TaskEvent) => {
    switch (event.event_type) {
      case "branch_created":
        return `Branch created: ${event.metadata.branch_name}`
      case "commit_created":
        return event.metadata.commit_message || "Commit created"
      case "pr_opened":
        return `PR #${event.metadata.pr_number} opened`
      case "pr_merged":
        return `PR #${event.metadata.pr_number} merged`
      case "pr_closed":
        return `PR #${event.metadata.pr_number} closed`
      case "task_completed":
        return "Task marked as complete"
      case "task_started":
        return "Task started"
      case "auto_commit_toggled":
        return `Auto-commit ${event.metadata.auto_commit_enabled ? "enabled" : "disabled"}`
      case "manual_sync":
        return "Manual sync to GitHub"
      default:
        return event.event_type
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No activity yet for this task.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

          {events.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Event icon */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${getEventColor(event.event_type)} text-white`}
              >
                {getEventIcon(event.event_type)}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{formatEventTitle(event)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={event.triggered_by === "agent" ? "secondary" : "outline"} className="text-xs">
                        {event.triggered_by === "agent" ? "Agent" : "User"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(event.created_at)}</span>
                    </div>

                    {/* Additional metadata */}
                    {event.metadata.commit_sha && (
                      <a
                        href={event.metadata.commit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 block"
                      >
                        {event.metadata.commit_sha.substring(0, 7)}
                      </a>
                    )}
                    {event.metadata.pr_url && (
                      <a
                        href={event.metadata.pr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 block"
                      >
                        View Pull Request
                      </a>
                    )}
                    {(event.metadata.lines_added || event.metadata.lines_removed) && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600">+{event.metadata.lines_added || 0}</span>
                        {" / "}
                        <span className="text-red-600">-{event.metadata.lines_removed || 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
