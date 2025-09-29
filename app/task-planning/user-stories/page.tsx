"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Download, Upload, Edit, Trash2, FileText } from "lucide-react"
import { UserStoryModal } from "@/components/user-stories/user-story-modal"

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
  created_at: string
  updated_at: string
}

export default function UserStoriesPage() {
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const [filteredStories, setFilteredStories] = useState<UserStory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [epicFilter, setEpicFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<UserStory | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user stories from API
  useEffect(() => {
    fetchUserStories()
  }, [])

  // Filter stories based on search and filters
  useEffect(() => {
    let filtered = userStories

    if (searchTerm) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.user_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.goal.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((story) => story.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((story) => story.priority === priorityFilter)
    }

    if (epicFilter !== "all") {
      filtered = filtered.filter((story) => story.epic === epicFilter)
    }

    setFilteredStories(filtered)
  }, [userStories, searchTerm, statusFilter, priorityFilter, epicFilter])

  const fetchUserStories = async () => {
    try {
      const response = await fetch("/api/user-stories")
      if (response.ok) {
        const data = await response.json()
        setUserStories(data)
      }
    } catch (error) {
      console.error("Failed to fetch user stories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStory = () => {
    setEditingStory(null)
    setIsModalOpen(true)
  }

  const handleEditStory = (story: UserStory) => {
    setEditingStory(story)
    setIsModalOpen(true)
  }

  const handleDeleteStory = async (id: string) => {
    if (confirm("Are you sure you want to delete this user story?")) {
      try {
        const response = await fetch(`/api/user-stories/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          fetchUserStories()
        }
      } catch (error) {
        console.error("Failed to delete user story:", error)
      }
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/user-stories/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `user-stories-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Failed to export CSV:", error)
    }
  }

  const handleJiraExport = async () => {
    try {
      const response = await fetch("/api/user-stories/jira-export")
      if (response.ok) {
        const data = await response.json()
        // Handle Jira API response or download formatted file
        console.log("Jira export successful:", data)
      }
    } catch (error) {
      console.error("Failed to export to Jira:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "default"
      case "In Progress":
        return "secondary"
      case "To Do":
        return "outline"
      default:
        return "outline"
    }
  }

  const uniqueEpics = [...new Set(userStories.map((story) => story.epic).filter(Boolean))]

  const stats = {
    total: userStories.length,
    todo: userStories.filter((s) => s.status === "To Do").length,
    inProgress: userStories.filter((s) => s.status === "In Progress").length,
    done: userStories.filter((s) => s.status === "Done").length,
    totalPoints: userStories.reduce((sum, story) => sum + (story.story_points || 0), 0),
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading user stories...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Stories</h1>
          <p className="text-muted-foreground">Manage user stories with Jira-style format and comprehensive tracking</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleJiraExport} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Export to Jira
          </Button>
          <Button onClick={handleCreateStory}>
            <Plus className="h-4 w-4 mr-2" />
            New Story
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={epicFilter} onValueChange={setEpicFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Epic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Epics</SelectItem>
            {uniqueEpics.map((epic) => (
              <SelectItem key={epic} value={epic}>
                {epic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* User Stories List */}
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <Badge variant="outline">{story.id}</Badge>
                  </div>
                  <div className="text-sm font-medium mb-2">
                    As a <span className="font-semibold">{story.user_type}</span>, I want{" "}
                    <span className="font-semibold">{story.goal}</span> so that{" "}
                    <span className="font-semibold">{story.reason}</span>.
                  </div>
                  <CardDescription>{story.description}</CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEditStory(story)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteStory(story.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Acceptance Criteria */}
                {story.acceptance_criteria.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Acceptance Criteria:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {story.acceptance_criteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {story.tasks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tasks:</h4>
                    <ul className="space-y-1 text-sm">
                      {story.tasks.map((task, index) => (
                        <li key={index} className="flex justify-between">
                          <span>• {task.task}</span>
                          <span className="text-muted-foreground">
                            {task.estimate} - {task.assignee}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dependencies and Related Issues */}
                <div className="flex gap-6 text-sm">
                  {story.dependencies.length > 0 && (
                    <div>
                      <span className="font-medium">Dependencies:</span>
                      <span className="ml-2">{story.dependencies.join(", ")}</span>
                    </div>
                  )}
                  {story.related_issues.length > 0 && (
                    <div>
                      <span className="font-medium">Related Issues:</span>
                      <span className="ml-2">{story.related_issues.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Badges and Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant={getPriorityColor(story.priority)}>{story.priority}</Badge>
                    <Badge variant={getStatusColor(story.status)}>{story.status}</Badge>
                    {story.story_points && <Badge variant="outline">{story.story_points} pts</Badge>}
                    {story.epic && <Badge variant="secondary">{story.epic}</Badge>}
                    {story.labels.map((label) => (
                      <Badge key={label} variant="outline">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {story.assignee && <span>Assigned to: {story.assignee}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No user stories found</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Story Modal */}
      <UserStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        story={editingStory}
        onSave={fetchUserStories}
      />
    </div>
  )
}
