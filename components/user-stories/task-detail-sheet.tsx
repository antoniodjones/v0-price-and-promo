"use client"

import { useState, useEffect, useRef } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, User, Link2, CheckSquare, MessageSquare, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { RichTextEditor } from "@/components/user-stories/rich-text-editor"
import { TaskActionsMenu } from "@/components/user-stories/task-actions-menu"
import { TaskModeToggle } from "@/components/user-stories/task-mode-toggle"

interface UserStory {
  id: string
  title: string
  description: string | null
  user_type: string | null
  goal: string | null
  reason: string | null
  status: string
  priority: string | null
  story_points: number | null
  assignee: string | null
  reporter: string | null
  epic: string | null
  acceptance_criteria: string | null
  tasks: string | null
  dependencies: string | null
  labels: string | null
  related_issues: string | null
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

interface TaskDetailSheetProps {
  task: UserStory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (task: UserStory) => void
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: Date
}

export function TaskDetailSheet({ task, open, onOpenChange, onUpdate }: TaskDetailSheetProps) {
  const [editedTask, setEditedTask] = useState<UserStory | null>(task)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [autoCommitEnabled, setAutoCommitEnabled] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [mode, setMode] = useState<"agent" | "user">("agent")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const saveTaskToDatabase = async (taskToSave: UserStory) => {
    if (!taskToSave) return

    try {
      setIsSaving(true)
      console.log("[v0] Saving task to database:", taskToSave.id)

      const response = await fetch(`/api/user-stories/${taskToSave.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSave),
      })

      if (response.ok) {
        console.log("[v0] Task saved successfully")
        setHasUnsavedChanges(false)

        if (onUpdate) {
          onUpdate(taskToSave)
        }
      } else {
        console.error("[v0] Failed to save task:", response.status)
      }
    } catch (error) {
      console.error("[v0] Error saving task:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const debouncedSave = (taskToSave: UserStory) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      saveTaskToDatabase(taskToSave)
    }, 1500)
  }

  const handleModeChange = async (newMode: "agent" | "user") => {
    if (!editedTask) return

    const oldMode = mode
    setMode(newMode)

    const newAutoCommit = newMode === "agent"
    setAutoCommitEnabled(newAutoCommit)

    try {
      const response = await fetch(`/api/user-stories/${editedTask.id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode, auto_commit_enabled: newAutoCommit }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to update mode setting")
        setMode(oldMode)
        setAutoCommitEnabled(!newAutoCommit)
      } else {
        console.log("[v0] Mode setting updated:", newMode)
      }
    } catch (error) {
      console.error("[v0] Error updating mode setting:", error)
      setMode(oldMode)
      setAutoCommitEnabled(!newAutoCommit)
    }
  }

  const handleAutoCommitToggle = async (enabled: boolean) => {
    if (!editedTask) return

    setAutoCommitEnabled(enabled)

    try {
      const response = await fetch(`/api/user-stories/${editedTask.id}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_commit_enabled: enabled }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to update auto-commit setting")
        setAutoCommitEnabled(!enabled)
      } else {
        console.log("[v0] Auto-commit setting updated:", enabled)
      }
    } catch (error) {
      console.error("[v0] Error updating auto-commit setting:", error)
      setAutoCommitEnabled(!enabled)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!editedTask) {
      console.warn("[v0] Cannot update status - no task loaded")
      return
    }

    const oldStatus = editedTask.status

    handleFieldChange("status", newStatus)

    try {
      const response = await fetch(`/api/user-stories/${editedTask.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.auto_commit_enabled !== undefined) {
          setAutoCommitEnabled(data.auto_commit_enabled)
        }
        console.log("[v0] Task status updated:", { oldStatus, newStatus, autoCommitEnabled: data.auto_commit_enabled })
      } else {
        console.error("[v0] Failed to update task status")
        handleFieldChange("status", oldStatus)
      }
    } catch (error) {
      console.error("[v0] Error updating task status:", error)
      handleFieldChange("status", oldStatus)
    }
  }

  const handleFieldChange = (field: keyof UserStory, value: any) => {
    if (!editedTask) {
      console.warn("[v0] Cannot update field - no task loaded")
      return
    }

    console.log("[v0] Field change triggered:", field, value)
    const updated = { ...editedTask, [field]: value, updated_at: new Date().toISOString() }
    setEditedTask(updated)
    setHasUnsavedChanges(true)

    console.log("[v0] Task field updated locally:", { taskId: editedTask.id, field, value, timestamp: new Date() })

    debouncedSave(updated)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"
      case "in progress":
        return "secondary"
      case "blocked":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      timestamp: new Date(),
    }

    setComments([...comments, comment])
    console.log("[v0] Comment added:", { taskId: editedTask.id, comment, timestamp: new Date() })
    setNewComment("")
  }

  const isEditable = mode === "user"

  useEffect(() => {
    if (task) {
      console.log("[v0] TaskDetailSheet: Task changed, updating state:", task.id)
      setEditedTask(task)
      setHasUnsavedChanges(false)
      setComments([
        {
          id: "1",
          author: "System",
          content: "Task created",
          timestamp: new Date(task.created_at),
        },
      ])
      loadTaskSettings(task.id)
    }
  }, [task])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  const loadTaskSettings = async (taskId: string) => {
    try {
      setLoadingSettings(true)
      console.log("[v0] Loading settings for task:", taskId)
      const response = await fetch(`/api/user-stories/${taskId}/settings`)

      if (!response.ok) {
        console.error("[v0] Settings API returned error status:", response.status)
        setMode("agent")
        setAutoCommitEnabled(true)
        return
      }

      const text = await response.text()
      console.log("[v0] Settings API response text:", text)

      try {
        const data = JSON.parse(text)
        console.log("[v0] Parsed settings data:", data)
        setMode(data.settings?.mode || "agent")
        setAutoCommitEnabled(data.settings?.auto_commit_enabled ?? true)
      } catch (parseError) {
        console.error("[v0] Failed to parse settings response:", parseError, "Response:", text)
        setMode("agent")
        setAutoCommitEnabled(true)
      }
    } catch (error) {
      console.error("[v0] Error fetching task settings:", error)
      setMode("agent")
      setAutoCommitEnabled(true)
    } finally {
      setLoadingSettings(false)
    }
  }

  console.log("[v0] TaskDetailSheet: Rendering, open=", open, "task=", task?.id, "editedTask=", editedTask?.id)

  if (!editedTask) {
    console.log("[v0] TaskDetailSheet: No edited task, returning null")
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0"
        onClick={(e) => {
          console.log("[v0] SheetContent: Click event captured")
          e.stopPropagation()
        }}
        onMouseDown={(e) => {
          console.log("[v0] SheetContent: MouseDown event captured")
          e.stopPropagation()
        }}
        onDoubleClick={(e) => {
          console.log("[v0] SheetContent: DoubleClick event captured and stopped")
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-sm font-mono text-muted-foreground">{editedTask.id}</SheetTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        copyToClipboard(editedTask.id)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <TaskActionsMenu
                      taskId={editedTask.id}
                      taskTitle={editedTask.title}
                      autoCommitEnabled={autoCommitEnabled}
                      onAutoCommitToggle={handleAutoCommitToggle}
                    />
                    {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
                    {hasUnsavedChanges && !isSaving && (
                      <span className="text-xs text-muted-foreground">Unsaved changes</span>
                    )}
                  </div>
                  <Input
                    value={editedTask.title}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleFieldChange("title", e.target.value)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xl font-semibold border-none px-0 focus-visible:ring-0"
                    placeholder="Task title"
                    disabled={!isEditable}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={editedTask.status} onValueChange={handleStatusChange} disabled={!isEditable}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetHeader>

            <TaskModeToggle mode={mode} onModeChange={handleModeChange} disabled={loadingSettings} />

            <Separator />

            {(editedTask.user_type || editedTask.goal || editedTask.reason) && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">User Story</h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">As a</span>
                    <Input
                      value={editedTask.user_type || ""}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleFieldChange("user_type", e.target.value)
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-7 text-sm"
                      placeholder="user type"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">I want</span>
                    <Input
                      value={editedTask.goal || ""}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleFieldChange("goal", e.target.value)
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-7 text-sm"
                      placeholder="goal"
                      disabled={!isEditable}
                    />
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">So that</span>
                    <Input
                      value={editedTask.reason || ""}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleFieldChange("reason", e.target.value)
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 h-7 text-sm"
                      placeholder="reason"
                      disabled={!isEditable}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editedTask.description || ""}
                onChange={(e) => {
                  e.stopPropagation()
                  handleFieldChange("description", e.target.value)
                }}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                placeholder="Add a description..."
                className="min-h-[100px]"
                disabled={!isEditable}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Acceptance Criteria
              </Label>
              <RichTextEditor
                content={editedTask.acceptance_criteria || ""}
                onChange={(content) => handleFieldChange("acceptance_criteria", content)}
                placeholder="Define what 'done' means... Use the toolbar to format text with bullets, headers, and more."
                disabled={!isEditable}
              />
            </div>

            {editedTask.tasks && (
              <div className="space-y-2">
                <Label>Tasks</Label>
                <Textarea
                  value={editedTask.tasks}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("tasks", e.target.value)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="List subtasks..."
                  className="min-h-[60px]"
                  disabled={!isEditable}
                />
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={editedTask.priority || "Medium"}
                  onValueChange={(value) => handleFieldChange("priority", value)}
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Story Points</Label>
                <Input
                  type="number"
                  value={editedTask.story_points || ""}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("story_points", Number.parseInt(e.target.value) || null)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="0"
                  disabled={!isEditable}
                />
              </div>

              <div className="space-y-2">
                <Label>Epic</Label>
                <Input
                  value={editedTask.epic || ""}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("epic", e.target.value)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Epic name"
                  disabled={!isEditable}
                />
              </div>

              <div className="space-y-2">
                <Label>Labels</Label>
                <Input
                  value={editedTask.labels || ""}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("labels", e.target.value)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="tag1, tag2"
                  disabled={!isEditable}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Dependencies
                </Label>
                <Input
                  value={editedTask.dependencies || ""}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("dependencies", e.target.value)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="task-001, task-002"
                  disabled={!isEditable}
                />
              </div>

              <div className="space-y-2">
                <Label>Related Issues</Label>
                <Input
                  value={editedTask.related_issues || ""}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleFieldChange("related_issues", e.target.value)
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="issue-001, issue-002"
                  disabled={!isEditable}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                People & Tracking
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <Input
                    value={editedTask.assignee || ""}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleFieldChange("assignee", e.target.value)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Unassigned"
                    className="mt-1 h-8"
                    disabled={!isEditable}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">Reporter</p>
                  <Input
                    value={editedTask.reporter || ""}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleFieldChange("reporter", e.target.value)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Reporter"
                    className="mt-1 h-8"
                    disabled={!isEditable}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground">Created by</p>
                  <p className="font-medium mt-1">{editedTask.created_by || "System"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(editedTask.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last updated</p>
                  <p className="font-medium mt-1">{editedTask.updated_by || "System"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(editedTask.updated_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Activity & Comments
              </h3>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => {
                    e.stopPropagation()
                    setNewComment(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Add a comment..."
                  className="min-h-[60px]"
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddComment()
                  }}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Press Cmd/Ctrl + Enter to send</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
