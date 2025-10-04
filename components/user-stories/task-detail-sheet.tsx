"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    if (task) {
      console.log("[v0] TaskDetailSheet: Task changed, updating state:", task.id)
      setEditedTask(task)
      setComments([
        {
          id: "1",
          author: "System",
          content: "Task created",
          timestamp: new Date(task.created_at),
        },
      ])
    }
  }, [task])

  console.log("[v0] TaskDetailSheet: Rendering, open=", open, "task=", task?.id, "editedTask=", editedTask?.id)

  if (!editedTask) {
    console.log("[v0] TaskDetailSheet: No edited task, returning null")
    return null
  }

  const handleFieldChange = (field: keyof UserStory, value: any) => {
    console.log("[v0] Field change triggered:", field, value)
    const updated = { ...editedTask, [field]: value, updated_at: new Date().toISOString() }
    setEditedTask(updated)

    console.log("[v0] Task field updated:", { taskId: editedTask.id, field, value, timestamp: new Date() })

    if (onUpdate) {
      onUpdate(updated)
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
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={editedTask.status} onValueChange={(value) => handleFieldChange("status", value)}>
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
