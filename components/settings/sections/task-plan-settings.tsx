"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  planId: string
  epic: string
  name: string
  storyPoints: number
  estimateDuration: string
  dueDate: string
  completedDate: string | null
  completed: boolean
  phase: string
}

const ALL_TASKS: Task[] = [
  // EPIC: Completed Core Features (from Task Planning Board)
  {
    id: "core-1",
    planId: "CORE-001",
    epic: "Completed Core Features",
    name: "Customer Discount Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-15",
    completedDate: "2025-09-15",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-2",
    planId: "CORE-002",
    epic: "Completed Core Features",
    name: "Inventory Discount System",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-20",
    completedDate: "2025-09-20",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-3",
    planId: "CORE-003",
    epic: "Completed Core Features",
    name: "Basic Pricing Engine",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-09-25",
    completedDate: "2025-09-25",
    completed: true,
    phase: "Core Features",
  },
  {
    id: "core-4",
    planId: "CORE-004",
    epic: "Completed Core Features",
    name: "Simple Analytics Dashboard",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-09-27",
    completedDate: "2025-09-27",
    completed: true,
    phase: "Core Features",
  },

  // EPIC: Enhanced Features (from Task Planning Board)
  {
    id: "enh-1",
    planId: "ENH-001",
    epic: "Enhanced Features",
    name: "Advanced Wizard-Based Discount Creation",
    storyPoints: 21,
    estimateDuration: "8 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-2",
    planId: "ENH-002",
    epic: "Enhanced Features",
    name: "Bundle Deal Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-3",
    planId: "ENH-003",
    epic: "Enhanced Features",
    name: "Market-Based Pricing Intelligence",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-4",
    planId: "ENH-004",
    epic: "Enhanced Features",
    name: "Comprehensive Settings System",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-5",
    planId: "ENH-005",
    epic: "Enhanced Features",
    name: "Advanced Search & Navigation",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-6",
    planId: "ENH-006",
    epic: "Enhanced Features",
    name: "Promotion Campaign Management",
    storyPoints: 13,
    estimateDuration: "5 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-7",
    planId: "ENH-007",
    epic: "Enhanced Features",
    name: "Testing & Experimentation Tools",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },
  {
    id: "enh-8",
    planId: "ENH-008",
    epic: "Enhanced Features",
    name: "Enterprise Multi-Tenant Architecture",
    storyPoints: 21,
    estimateDuration: "8 days",
    dueDate: "2025-10-01",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Enhanced Features",
  },

  // EPIC: Tier Management Implementation (from Task Plan)
  // Phase 1: Database & Core APIs
  {
    id: "1.1",
    planId: "TM-001",
    epic: "Tier Management Implementation",
    name: "Create discount_rules table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.2",
    planId: "TM-002",
    epic: "Tier Management Implementation",
    name: "Create discount_rule_tiers table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.3",
    planId: "TM-003",
    epic: "Tier Management Implementation",
    name: "Create customer_tier_assignments table",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-03",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.4",
    planId: "TM-004",
    epic: "Tier Management Implementation",
    name: "Create database indexes for performance",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-04",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "1.5",
    planId: "TM-005",
    epic: "Tier Management Implementation",
    name: "Create seed data migration script",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-04",
    completedDate: "2025-09-28",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.1",
    planId: "TM-006",
    epic: "Tier Management Implementation",
    name: "Build POST /api/discount-rules (Create rule)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-07",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.2",
    planId: "TM-007",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules (List all rules)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-08",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.3",
    planId: "TM-008",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules/[id] (Get rule details)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-08",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.4",
    planId: "TM-009",
    epic: "Tier Management Implementation",
    name: "Build PUT /api/discount-rules/[id] (Update rule)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-10",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.5",
    planId: "TM-010",
    epic: "Tier Management Implementation",
    name: "Build DELETE /api/discount-rules/[id] (Delete rule)",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-10",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.6",
    planId: "TM-011",
    epic: "Tier Management Implementation",
    name: "Build POST /api/discount-rules/[id]/assignments (Assign customers)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-11",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.7",
    planId: "TM-012",
    epic: "Tier Management Implementation",
    name: "Build GET /api/discount-rules/[id]/assignments (Get assignments)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-11",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.8",
    planId: "TM-013",
    epic: "Tier Management Implementation",
    name: "Build PUT /api/discount-rules/[id]/assignments/[customerId] (Update tier)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-14",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.9",
    planId: "TM-014",
    epic: "Tier Management Implementation",
    name: "Build DELETE /api/discount-rules/[id]/assignments/[customerId] (Remove assignment)",
    storyPoints: 2,
    estimateDuration: "0.5 day",
    dueDate: "2025-10-14",
    completedDate: "2025-09-29",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },
  {
    id: "2.10",
    planId: "TM-015",
    epic: "Tier Management Implementation",
    name: "Build GET /api/customers/[id]/tiers (Get customer tiers)",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-10-14",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 1: Database & Core APIs",
  },

  // Phase 2: Wizard UI Enhancement
  {
    id: "3.1",
    planId: "TM-016",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 1: Rule Configuration UI",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-17",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.2",
    planId: "TM-017",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 2: Tier Configuration UI (A/B/C tiers)",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-21",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.3",
    planId: "TM-018",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 3: Customer Assignment to Tiers UI",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-24",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.4",
    planId: "TM-019",
    epic: "Tier Management Implementation",
    name: "Create wizard Step 4: Dates & Review UI",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-25",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.5",
    planId: "TM-020",
    epic: "Tier Management Implementation",
    name: "Build Tier Assignment Matrix component",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-10-28",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },
  {
    id: "3.6",
    planId: "TM-021",
    epic: "Tier Management Implementation",
    name: "Add search and filter for customer assignment",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-10-29",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 2: Wizard UI Enhancement",
  },

  // Phase 3: Pricing Engine Integration
  {
    id: "4.1",
    planId: "TM-022",
    epic: "Tier Management Implementation",
    name: "Implement findApplicableRules() function",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-01",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.2",
    planId: "TM-023",
    epic: "Tier Management Implementation",
    name: "Implement getCustomerTierAssignment() function",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-11-04",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.3",
    planId: "TM-024",
    epic: "Tier Management Implementation",
    name: "Implement getTierDiscount() function",
    storyPoints: 3,
    estimateDuration: "1 day",
    dueDate: "2025-11-04",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.4",
    planId: "TM-025",
    epic: "Tier Management Implementation",
    name: "Implement calculateCustomerPrice() main function",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-07",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.5",
    planId: "TM-026",
    epic: "Tier Management Implementation",
    name: "Implement best discount selection logic (no stacking)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-08",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.6",
    planId: "TM-027",
    epic: "Tier Management Implementation",
    name: "Add audit logging for pricing calculations",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-11",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },
  {
    id: "4.7",
    planId: "TM-028",
    epic: "Tier Management Implementation",
    name: "Optimize pricing calculation performance (<200ms)",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-12",
    completedDate: null,
    completed: false,
    phase: "Phase 3: Pricing Engine Integration",
  },

  // Phase 4: Testing & Management Tools
  {
    id: "5.1",
    planId: "TM-029",
    epic: "Tier Management Implementation",
    name: "Build Customer Tier Dashboard page",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-15",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.2",
    planId: "TM-030",
    epic: "Tier Management Implementation",
    name: "Build Bulk Tier Assignment tool (CSV upload)",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-18",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.3",
    planId: "TM-031",
    epic: "Tier Management Implementation",
    name: "Create comprehensive test suite for tier management",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-21",
    completedDate: null,
    completed: false,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.4",
    planId: "TM-032",
    epic: "Tier Management Implementation",
    name: "Create comprehensive test suite for pricing engine",
    storyPoints: 8,
    estimateDuration: "3 days",
    dueDate: "2025-11-22",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.5",
    planId: "TM-033",
    epic: "Tier Management Implementation",
    name: "Write user documentation for tier management",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-25",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },
  {
    id: "5.6",
    planId: "TM-034",
    epic: "Tier Management Implementation",
    name: "Write technical documentation for pricing engine",
    storyPoints: 5,
    estimateDuration: "2 days",
    dueDate: "2025-11-26",
    completedDate: "2025-10-01",
    completed: true,
    phase: "Phase 4: Testing & Management Tools",
  },
]

export default function TaskPlanSettings() {
  const [tasks, setTasks] = useState<Task[]>(ALL_TASKS)
  const [epicFilter, setEpicFilter] = useState<string>("all")
  const [taskNameFilter, setTaskNameFilter] = useState<string>("")
  const [completedFilter, setCompletedFilter] = useState<string>("all")

  // Load task completion state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("task-plan-completion")
    if (saved) {
      const completionState = JSON.parse(saved)
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          completed: completionState[task.id]?.completed ?? task.completed,
          completedDate: completionState[task.id]?.completedDate ?? task.completedDate,
        })),
      )
    }
  }, [])

  // Save task completion state to localStorage
  useEffect(() => {
    const completionState = tasks.reduce(
      (acc, task) => {
        acc[task.id] = {
          completed: task.completed,
          completedDate: task.completedDate,
        }
        return acc
      },
      {} as Record<string, { completed: boolean; completedDate: string | null }>,
    )
    localStorage.setItem("task-plan-completion", JSON.stringify(completionState))
  }, [tasks])

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedDate: !task.completed ? new Date().toISOString().split("T")[0] : null,
            }
          : task,
      ),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesEpic = epicFilter === "all" || task.epic === epicFilter
    const matchesTaskName = taskNameFilter === "" || task.name.toLowerCase().includes(taskNameFilter.toLowerCase())
    const matchesCompleted =
      completedFilter === "all" ||
      (completedFilter === "completed" && task.completed) ||
      (completedFilter === "incomplete" && !task.completed)

    return matchesEpic && matchesTaskName && matchesCompleted
  })

  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.phase]) {
        acc[task.phase] = []
      }
      acc[task.phase].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const uniqueEpics = Array.from(new Set(tasks.map((task) => task.epic)))

  const totalStoryPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0)
  const completedStoryPoints = tasks.filter((t) => t.completed).reduce((sum, task) => sum + task.storyPoints, 0)
  const completionPercentage = Math.round((completedStoryPoints / totalStoryPoints) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Plan</h2>
          <p className="text-muted-foreground mt-1">Consolidated Implementation Tracker</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-2xl font-bold">
            {completedStoryPoints} / {totalStoryPoints} SP
          </div>
          <div className="text-sm text-muted-foreground">{completionPercentage}% Complete</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">EPIC</label>
              <Select value={epicFilter} onValueChange={setEpicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All EPICs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All EPICs</SelectItem>
                  {uniqueEpics.map((epic) => (
                    <SelectItem key={epic} value={epic}>
                      {epic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Name</label>
              <Input
                placeholder="Search tasks..."
                value={taskNameFilter}
                onChange={(e) => setTaskNameFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={completedFilter} onValueChange={setCompletedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className="bg-gti-dark-green h-4 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedTasks).map(([phase, phaseTasks]) => {
        const phaseCompleted = phaseTasks.filter((t) => t.completed).length
        const phaseTotal = phaseTasks.length
        const phaseStoryPoints = phaseTasks.reduce((sum, t) => sum + t.storyPoints, 0)
        const phaseCompletedPoints = phaseTasks.filter((t) => t.completed).reduce((sum, t) => sum + t.storyPoints, 0)

        return (
          <Card key={phase}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{phase}</CardTitle>
                  <CardDescription>
                    {phaseCompleted} / {phaseTotal} tasks • {phaseCompletedPoints} / {phaseStoryPoints} story points
                  </CardDescription>
                </div>
                <Badge
                  variant={phaseCompleted === phaseTotal ? "default" : "secondary"}
                  className={phaseCompleted === phaseTotal ? "bg-gti-dark-green hover:bg-gti-dark-green/90" : ""}
                >
                  {phaseCompleted === phaseTotal ? "Complete" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phaseTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      task.completed ? "bg-green-50/50 border-green-200" : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-gti-green" />
                      ) : (
                        <div className="h-5 w-5 rounded border-2 border-gray-300" />
                      )}
                    </div>

                    <div className="flex-shrink-0 w-24">
                      <Badge variant="outline" className="font-mono text-xs">
                        {task.planId}
                      </Badge>
                    </div>

                    <div className="flex-shrink-0 w-48">
                      <Badge variant="secondary" className="text-xs">
                        {task.epic}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Story Points</div>
                        <div className="font-semibold">{task.storyPoints}</div>
                      </div>

                      <div className="text-center min-w-[80px]">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="text-sm">{task.estimateDuration}</div>
                      </div>

                      <div className="text-center min-w-[100px]">
                        <div className="text-xs text-muted-foreground">Due Date</div>
                        <div className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </div>
                      </div>

                      <div className="text-center min-w-[120px]">
                        <div className="text-xs text-muted-foreground">Completed</div>
                        <div className="text-sm">
                          {task.completedDate ? (
                            <span className="text-gti-green font-medium">{task.completedDate}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
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
      })}
    </div>
  )
}
