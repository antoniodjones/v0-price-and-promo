"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

interface UserStory {
  id: string
  title: string
  user_type: string
  goal: string
  reason: string
  description: string
  acceptance_criteria: string[]
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
  story_points: number
  dependencies: string[]
  tasks: Array<{
    task: string
    estimate: string
    assignee: string
  }>
  related_issues: string[]
  epic: string
  assignee: string
  reporter: string
  labels: string[]
}

interface UserStoryModalProps {
  isOpen: boolean
  onClose: () => void
  story?: UserStory | null
  onSave: () => void
}

export function UserStoryModal({ isOpen, onClose, story, onSave }: UserStoryModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    user_type: "",
    goal: "",
    reason: "",
    description: "",
    acceptance_criteria: [""],
    priority: "Medium" as const,
    status: "To Do" as const,
    story_points: 0,
    dependencies: [""],
    tasks: [{ task: "", estimate: "", assignee: "" }],
    related_issues: [""],
    epic: "",
    assignee: "",
    reporter: "",
    labels: [""],
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        user_type: story.user_type,
        goal: story.goal,
        reason: story.reason,
        description: story.description,
        acceptance_criteria: story.acceptance_criteria.length > 0 ? story.acceptance_criteria : [""],
        priority: story.priority,
        status: story.status,
        story_points: story.story_points || 0,
        dependencies: story.dependencies.length > 0 ? story.dependencies : [""],
        tasks: story.tasks.length > 0 ? story.tasks : [{ task: "", estimate: "", assignee: "" }],
        related_issues: story.related_issues.length > 0 ? story.related_issues : [""],
        epic: story.epic || "",
        assignee: story.assignee || "",
        reporter: story.reporter || "",
        labels: story.labels.length > 0 ? story.labels : [""],
      })
    } else {
      // Reset form for new story
      setFormData({
        title: "",
        user_type: "",
        goal: "",
        reason: "",
        description: "",
        acceptance_criteria: [""],
        priority: "Medium",
        status: "To Do",
        story_points: 0,
        dependencies: [""],
        tasks: [{ task: "", estimate: "", assignee: "" }],
        related_issues: [""],
        epic: "",
        assignee: "",
        reporter: "",
        labels: [""],
      })
    }
  }, [story, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up empty arrays
      const cleanedData = {
        ...formData,
        acceptance_criteria: formData.acceptance_criteria.filter((c) => c.trim()),
        dependencies: formData.dependencies.filter((d) => d.trim()),
        tasks: formData.tasks.filter((t) => t.task.trim()),
        related_issues: formData.related_issues.filter((i) => i.trim()),
        labels: formData.labels.filter((l) => l.trim()),
      }

      const url = story ? `/api/user-stories/${story.id}` : "/api/user-stories"
      const method = story ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        console.error("Failed to save user story")
      }
    } catch (error) {
      console.error("Error saving user story:", error)
    } finally {
      setLoading(false)
    }
  }

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field as keyof typeof prev] as any[]),
        field === "tasks" ? { task: "", estimate: "", assignee: "" } : "",
      ],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayItem = (field: string, index: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).map((item, i) => (i === index ? value : item)),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{story ? "Edit User Story" : "Create New User Story"}</DialogTitle>
          <DialogDescription>Create a comprehensive user story following Jira-style format</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">User Story Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Brief descriptive title"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="user_type">User Type *</Label>
                <Input
                  id="user_type"
                  value={formData.user_type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user_type: e.target.value }))}
                  placeholder="e.g., pricing manager"
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="goal">Goal *</Label>
              <Input
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData((prev) => ({ ...prev, goal: e.target.value }))}
                placeholder="What the user wants to accomplish"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Why this is valuable to the user"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description including context, requirements, and constraints"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Acceptance Criteria</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("acceptance_criteria")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Criteria
              </Button>
            </div>
            <div className="space-y-2">
              {formData.acceptance_criteria.map((criteria, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={criteria}
                    onChange={(e) => updateArrayItem("acceptance_criteria", index, e.target.value)}
                    placeholder={`Acceptance Criteria #${index + 1}`}
                  />
                  {formData.acceptance_criteria.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("acceptance_criteria", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Tasks</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("tasks")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {formData.tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={task.task}
                    onChange={(e) => updateArrayItem("tasks", index, { ...task, task: e.target.value })}
                    placeholder="Task description"
                    className="flex-1"
                  />
                  <Input
                    value={task.estimate}
                    onChange={(e) => updateArrayItem("tasks", index, { ...task, estimate: e.target.value })}
                    placeholder="Estimate"
                    className="w-24"
                  />
                  <Input
                    value={task.assignee}
                    onChange={(e) => updateArrayItem("tasks", index, { ...task, assignee: e.target.value })}
                    placeholder="Assignee"
                    className="w-32"
                  />
                  {formData.tasks.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("tasks", index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="story_points">Story Points</Label>
              <Input
                id="story_points"
                type="number"
                min="0"
                max="100"
                value={formData.story_points}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, story_points: Number.parseInt(e.target.value) || 0 }))
                }
              />
            </div>
            <div>
              <Label htmlFor="epic">Epic</Label>
              <Input
                id="epic"
                value={formData.epic}
                onChange={(e) => setFormData((prev) => ({ ...prev, epic: e.target.value }))}
                placeholder="Epic or theme"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
                placeholder="Assigned developer"
              />
            </div>
            <div>
              <Label htmlFor="reporter">Reporter</Label>
              <Input
                id="reporter"
                value={formData.reporter}
                onChange={(e) => setFormData((prev) => ({ ...prev, reporter: e.target.value }))}
                placeholder="Story reporter"
              />
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Dependencies</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("dependencies")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Dependency
              </Button>
            </div>
            <div className="space-y-2">
              {formData.dependencies.map((dependency, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={dependency}
                    onChange={(e) => updateArrayItem("dependencies", index, e.target.value)}
                    placeholder="Dependency description"
                  />
                  {formData.dependencies.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("dependencies", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Issues */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Related Issues</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("related_issues")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Issue
              </Button>
            </div>
            <div className="space-y-2">
              {formData.related_issues.map((issue, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={issue}
                    onChange={(e) => updateArrayItem("related_issues", index, e.target.value)}
                    placeholder="Related issue or epic"
                  />
                  {formData.related_issues.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("related_issues", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Labels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Labels</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("labels")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Label
              </Button>
            </div>
            <div className="space-y-2">
              {formData.labels.map((label, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={label}
                    onChange={(e) => updateArrayItem("labels", index, e.target.value)}
                    placeholder="Label or tag"
                  />
                  {formData.labels.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeArrayItem("labels", index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : story ? "Update Story" : "Create Story"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
