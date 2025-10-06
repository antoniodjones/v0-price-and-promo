"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  Circle,
  Filter,
  BarChart3,
  Code,
  TestTube,
  FileText,
  Palette,
  ExternalLink,
  Wrench,
  Plus,
  ChevronsUpDown,
  Check,
  ComponentIcon,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { APPLICATION_PAGES } from "@/lib/unified-tasks-data"
import {
  getUserStories,
  toggleTaskCompletion,
  createUserStory,
  getTaskStatistics,
  type UserStory,
} from "@/lib/actions/user-stories"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TaskDetailSheet } from "@/components/user-stories/task-detail-sheet"

interface UnifiedTask {
  id: string
  title: string
  description: string
  type: "Build" | "Testing" | "Design" | "Requirements" | "Documentation" | "Framework" | "Component"
  category: string
  epic: string
  status: "To Do" | "In Progress" | "Done"
  priority: "Critical" | "High" | "Medium" | "Low"
  storyPoints: number
  estimateDuration: string
  dueDate: string
  completedDate: string | null
  phase: string
  link?: string
  expectedResult?: string
  assignee?: string
  component?: string
}

function convertToUnifiedTask(story: UserStory): UnifiedTask {
  return {
    id: story.id,
    title: story.title,
    description: story.description,
    type: story.type,
    category: story.category,
    epic: story.epic,
    status: story.status,
    priority: story.priority,
    storyPoints: story.story_points,
    estimateDuration: story.estimate_duration,
    dueDate: story.due_date,
    completedDate: story.completed_date,
    phase: story.phase,
    link: story.link || undefined,
    expectedResult: story.expected_result || undefined,
    assignee: story.assignee || undefined,
    component: story.component || undefined,
  }
}

export default function UnifiedTaskManagerPage() {
  const [tasks, setTasks] = useState<UnifiedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [epicFilter, setEpicFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [selectedTask, setSelectedTask] = useState<UserStory | null>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)

  useEffect(() => {
    console.log("[v0] Task Planning Page: Component mounted")
    loadTasks()
    loadStatistics()
  }, [])

  useEffect(() => {
    if (!loading) {
      console.log("[v0] Task Planning Page: Filters changed, reloading tasks")
      loadTasks()
    }
  }, [typeFilter, statusFilter, priorityFilter, epicFilter, searchTerm])

  const loadTasks = async () => {
    try {
      console.log("[v0] Task Planning Page: Loading tasks...")
      setLoading(true)
      setError(null)

      const stories = await getUserStories({
        type: typeFilter,
        status: statusFilter,
        priority: priorityFilter,
        epic: epicFilter,
        search: searchTerm,
      })

      console.log("[v0] Task Planning Page: Loaded", stories.length, "tasks")
      setTasks(stories.map(convertToUnifiedTask))
    } catch (error) {
      console.error("[v0] Task Planning Page: Error loading tasks:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(`Failed to load tasks: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      console.log("[v0] Task Planning Page: Loading statistics...")
      const stats = await getTaskStatistics()
      console.log("[v0] Task Planning Page: Statistics loaded:", stats)
      setStatistics(stats)
    } catch (error) {
      console.error("[v0] Task Planning Page: Error loading statistics:", error)
      // Don't set error state for statistics failure, just log it
    }
  }

  const handleToggleTaskCompletion = async (taskId: string) => {
    try {
      console.log("[v0] Task Planning Page: Toggling task", taskId)
      await toggleTaskCompletion(taskId)
      await loadTasks()
      await loadStatistics()
    } catch (error) {
      console.error("[v0] Task Planning Page: Error toggling task:", error)
      setError("Failed to update task status")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (typeFilter !== "all" && task.type !== typeFilter) return false
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false
    if (epicFilter !== "all" && task.epic !== epicFilter) return false
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const allTaskTypes = ["Build", "Testing", "Design", "Requirements", "Documentation", "Framework", "Component"]
  const uniqueEpics = Array.from(new Set(tasks.map((task) => task.epic)))

  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    totalStoryPoints: 0,
    completedStoryPoints: 0,
    completionPercentage: 0,
    statsByType: [] as any[],
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<UnifiedTask>>({
    type: "Component",
    status: "To Do",
    priority: "Medium",
    storyPoints: 3,
    phase: "Current Sprint",
  })
  const [componentOpen, setComponentOpen] = useState(false)

  const handleTaskDoubleClick = async (taskId: string) => {
    console.log("[v0] Task Planning Page: Double-click detected on task:", taskId)
    try {
      const stories = await getUserStories({})
      console.log("[v0] Task Planning Page: Fetched all stories:", stories.length)

      const foundStory = stories.find((s) => s.id === taskId)
      console.log("[v0] Task Planning Page: Found story:", foundStory)

      if (foundStory) {
        setSelectedTask(foundStory)
        setIsDetailSheetOpen(true)
        console.log("[v0] Task Planning Page: Opening detail sheet")
      } else {
        console.error("[v0] Task Planning Page: Task not found:", taskId)
      }
    } catch (error) {
      console.error("[v0] Task Planning Page: Error loading task details:", error)
    }
  }

  const handleTaskUpdate = async (updatedTask: UserStory) => {
    console.log("[v0] Task Planning Page: Task updated:", updatedTask)
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? convertToUnifiedTask(updatedTask) : task)),
    )
    // Update statistics without reloading tasks
    await loadStatistics()
  }

  const {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    totalStoryPoints,
    completedStoryPoints,
    completionPercentage,
    statsByType,
  } = statistics

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Build":
        return Code
      case "Testing":
        return TestTube
      case "Design":
        return Palette
      case "Requirements":
        return FileText
      case "Documentation":
        return FileText
      case "Framework":
        return Wrench
      case "Component":
        return ComponentIcon
      default:
        return Circle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "High":
        return "default"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleCreateTask = async () => {
    const taskId = `component-${Date.now()}`

    const story: Omit<UserStory, "created_at" | "updated_at"> = {
      id: taskId,
      title: newTask.title || "New Task",
      description: newTask.description || "",
      type: (newTask.type as UserStory["type"]) || "Component",
      category: newTask.category || "Page Enhancement",
      epic: newTask.epic || "Component Work",
      status: (newTask.status as UserStory["status"]) || "To Do",
      priority: (newTask.priority as UserStory["priority"]) || "Medium",
      story_points: newTask.storyPoints || 3,
      estimate_duration: newTask.estimateDuration || "1 day",
      due_date: newTask.dueDate || new Date().toISOString().split("T")[0],
      completed_date: null,
      phase: newTask.phase || "Current Sprint",
      component: newTask.component || null,
      link: newTask.component || null,
      tasks: [],
      dependencies: [],
      labels: [newTask.type || "Component", newTask.category || "Page Enhancement"],
      expected_result: null,
      assignee: null,
    }

    try {
      console.log("[v0] Task Planning Page: Creating task:", story)
      await createUserStory(story)
      await loadTasks()
      await loadStatistics()
      setIsDialogOpen(false)
      setNewTask({
        type: "Component",
        status: "To Do",
        priority: "Medium",
        storyPoints: 3,
        phase: "Current Sprint",
      })
    } catch (error) {
      console.error("[v0] Task Planning Page: Error creating task:", error)
      setError("Failed to create task")
    }
  }

  console.log("[v0] Task Planning Page: Rendering, loading=", loading, "error=", error, "tasks=", tasks.length)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-medium">Loading tasks...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Tasks</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
            <div className="mt-4">
              <p className="text-sm mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>
                  Run the SQL script: <code className="bg-black/10 px-1 rounded">scripts/seed-user-stories.sql</code>
                </li>
                <li>This will populate the database with all task data</li>
                <li>Refresh this page after running the script</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0 && !loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Unified Task Manager (UTM)</h1>
            <p className="text-muted-foreground mt-1">
              Consolidated view of all build, testing, design, documentation, framework, and component tasks
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Tasks Found</CardTitle>
            <CardDescription>The database is empty. Please run the seed scripts to populate task data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database Setup Required</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">To get started:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Run <code className="bg-muted px-1 rounded">scripts/seed-user-stories.sql</code>
                  </li>
                  <li>
                    Run <code className="bg-muted px-1 rounded">scripts/seed-archive-push-task.sql</code>
                  </li>
                  <li>Refresh this page</li>
                </ol>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unified Task Manager (UTM)</h1>
          <p className="text-muted-foreground mt-1">
            Consolidated view of all build, testing, design, documentation, framework, and component tasks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gti-green hover:bg-gti-dark-green">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to the Unified Task Manager</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Task Type</Label>
                    <Select
                      value={newTask.type}
                      onValueChange={(value) => setNewTask({ ...newTask, type: value as UnifiedTask["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Component">Component</SelectItem>
                        <SelectItem value="Build">Build</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Requirements">Requirements</SelectItem>
                        <SelectItem value="Documentation">Documentation</SelectItem>
                        <SelectItem value="Framework">Framework</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value as UnifiedTask["priority"] })}
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
                </div>

                {newTask.type === "Component" && (
                  <div className="space-y-2">
                    <Label>Related Page/Component</Label>
                    <Popover open={componentOpen} onOpenChange={setComponentOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={componentOpen}
                          className="w-full justify-between bg-transparent"
                        >
                          {newTask.component
                            ? APPLICATION_PAGES.find((page) => page.value === newTask.component)?.label
                            : "Select page..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search pages..." />
                          <CommandList>
                            <CommandEmpty>No page found.</CommandEmpty>
                            <CommandGroup>
                              {APPLICATION_PAGES.map((page) => (
                                <CommandItem
                                  key={page.value}
                                  value={page.value}
                                  onSelect={(currentValue) => {
                                    setNewTask({ ...newTask, component: currentValue })
                                    setComponentOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newTask.component === page.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {page.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Page Enhancement"
                      value={newTask.category || ""}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epic">Epic</Label>
                    <Input
                      id="epic"
                      placeholder="e.g., Component Work"
                      value={newTask.epic || ""}
                      onChange={(e) => setNewTask({ ...newTask, epic: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storyPoints">Story Points</Label>
                    <Input
                      id="storyPoints"
                      type="number"
                      min="1"
                      max="13"
                      value={newTask.storyPoints || 3}
                      onChange={(e) => setNewTask({ ...newTask, storyPoints: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 2 days"
                      value={newTask.estimateDuration || ""}
                      onChange={(e) => setNewTask({ ...newTask, estimateDuration: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate || ""}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phase">Phase</Label>
                  <Input
                    id="phase"
                    placeholder="e.g., Current Sprint"
                    value={newTask.phase || ""}
                    onChange={(e) => setNewTask({ ...newTask, phase: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} className="bg-gti-green hover:bg-gti-dark-green">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <div className="text-2xl font-bold text-gti-dark-green">
              {completedStoryPoints} / {totalStoryPoints} SP
            </div>
            <div className="text-sm text-muted-foreground">{completionPercentage}% Complete</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{totalStoryPoints} story points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks}</div>
            <p className="text-xs text-muted-foreground">Pending tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Circle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gti-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <BarChart3 className="h-4 w-4 text-gti-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-green">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="h-2 mt-2 [&>div]:bg-gti-green" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress by Task Type</CardTitle>
          <CardDescription>Breakdown of completion across different work categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            {statsByType.map((stat) => {
              const TypeIcon = getTypeIcon(stat.type)
              return (
                <div key={stat.type} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-4 w-4 text-gti-green" />
                    <span className="font-medium text-sm">{stat.type}</span>
                  </div>
                  <div className="text-2xl font-bold text-gti-dark-green">
                    {stat.completed} / {stat.total}
                  </div>
                  <Progress value={stat.percentage} className="h-2 [&>div]:bg-gti-green" />
                  <p className="text-xs text-muted-foreground">
                    {stat.completedPoints} / {stat.points} SP
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allTaskTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Epic</label>
              <Select value={epicFilter} onValueChange={setEpicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Epics" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Showing {filteredTasks.length} of {totalTasks} tasks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const TypeIcon = getTypeIcon(task.type)
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer ${
                    task.status === "Done" ? "bg-green-50 border-green-200" : ""
                  }`}
                  onDoubleClick={() => handleTaskDoubleClick(task.id)}
                  title="Double-click to view details"
                >
                  <Checkbox
                    checked={task.status === "Done"}
                    onCheckedChange={() => handleToggleTaskCompletion(task.id)}
                    className="flex-shrink-0"
                  />

                  <div className="flex-shrink-0 w-24">
                    <Badge variant="outline" className="font-mono text-xs">
                      {task.id}
                    </Badge>
                  </div>

                  <div className="flex-shrink-0">
                    <TypeIcon className="h-5 w-5 text-gti-green" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium ${task.status === "Done" ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                    {task.component && (
                      <div className="text-xs text-gti-green mt-1 flex items-center gap-1">
                        <ComponentIcon className="h-3 w-3" />
                        {APPLICATION_PAGES.find((p) => p.value === task.component)?.label || task.component}
                      </div>
                    )}
                    {task.expectedResult && (
                      <div className="text-xs text-blue-600 mt-1">Expected: {task.expectedResult}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                    <Badge variant="secondary">{task.type}</Badge>
                    <Badge variant="outline">{task.storyPoints} SP</Badge>
                    {task.link && (
                      <Link href={task.link}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  {task.status === "Done" && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <TaskDetailSheet
        task={selectedTask}
        open={isDetailSheetOpen}
        onOpenChange={setIsDetailSheetOpen}
        onUpdate={handleTaskUpdate}
      />
    </div>
  )
}
