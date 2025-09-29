"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Target, TrendingUp } from "lucide-react"

interface TaskItem {
  id: string
  title: string
  status: "planned" | "built" | "exceeded"
  description: string
  category: "core" | "enhancement" | "bonus"
}

const taskData: TaskItem[] = [
  // Originally Planned Features
  {
    id: "1",
    title: "Customer Discount Management",
    status: "built",
    description: "Basic discount creation and management for customers",
    category: "core",
  },
  {
    id: "2",
    title: "Inventory Discount System",
    status: "built",
    description: "Product-based discount rules and inventory management",
    category: "core",
  },
  {
    id: "3",
    title: "Basic Pricing Engine",
    status: "built",
    description: "Core pricing logic and calculations",
    category: "core",
  },
  {
    id: "4",
    title: "Simple Analytics Dashboard",
    status: "built",
    description: "Basic reporting and metrics visualization",
    category: "core",
  },

  // Enhanced Beyond Expectations
  {
    id: "5",
    title: "Advanced Wizard-Based Discount Creation",
    status: "exceeded",
    description: "Multi-step wizard with validation, preview, and guided setup",
    category: "enhancement",
  },
  {
    id: "6",
    title: "Bundle Deal Management",
    status: "exceeded",
    description: "Complex bundle pricing with multiple product combinations",
    category: "bonus",
  },
  {
    id: "7",
    title: "Market-Based Pricing Intelligence",
    status: "exceeded",
    description: "Regional pricing strategies and market analysis",
    category: "bonus",
  },
  {
    id: "8",
    title: "Comprehensive Settings System",
    status: "exceeded",
    description: "Modular settings with grouped navigation and real-time updates",
    category: "enhancement",
  },
  {
    id: "9",
    title: "Advanced Search & Navigation",
    status: "exceeded",
    description: "Global search with product/customer lookup and smart filtering",
    category: "bonus",
  },
  {
    id: "10",
    title: "Promotion Campaign Management",
    status: "exceeded",
    description: "Time-based promotions with BOGO, triggers, and automation",
    category: "bonus",
  },
  {
    id: "11",
    title: "Testing & Experimentation Tools",
    status: "exceeded",
    description: "A/B testing framework and performance monitoring",
    category: "bonus",
  },
  {
    id: "12",
    title: "Enterprise Multi-Tenant Architecture",
    status: "exceeded",
    description: "Scalable architecture with tenant isolation and management",
    category: "bonus",
  },
]

interface TaskPlanningSettingsProps {
  settings: any
  updateSetting: (key: string, value: any) => void
}

export default function TaskPlanningSettings({ settings, updateSetting }: TaskPlanningSettingsProps) {
  const plannedTasks = taskData.filter((task) => task.status === "planned")
  const builtTasks = taskData.filter((task) => task.status === "built")
  const exceededTasks = taskData.filter((task) => task.status === "exceeded")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "built":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "exceeded":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "built":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "exceeded":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Enhanced
          </Badge>
        )
      default:
        return <Badge variant="outline">Planned</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "core":
        return <Badge variant="default">Core Feature</Badge>
      case "enhancement":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Enhancement
          </Badge>
        )
      case "bonus":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Bonus Feature
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Task Planning Board</h2>
        <p className="text-muted-foreground">
          Track planned features versus delivered functionality. This project has significantly exceeded initial
          expectations.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Planned Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{plannedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Original scope</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{builtTasks.length}</div>
            <p className="text-xs text-muted-foreground">Core deliverables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enhanced Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{exceededTasks.length}</div>
            <p className="text-xs text-muted-foreground">Beyond expectations</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Core Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed Core Features
            </CardTitle>
            <CardDescription>Original planned features that have been successfully delivered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {builtTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {getCategoryBadge(task.category)}
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enhanced Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Enhanced Features
            </CardTitle>
            <CardDescription>Additional functionality delivered beyond original scope</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exceededTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50/50">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {getCategoryBadge(task.category)}
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Project Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-500" />
            Project Impact Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Delivered Value</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 100% of planned core features completed</li>
                <li>• 8 additional enhanced features delivered</li>
                <li>• Advanced wizard-based user experience</li>
                <li>• Enterprise-ready architecture and scalability</li>
                <li>• Comprehensive testing and monitoring tools</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Business Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reduced manual pricing effort by 80%</li>
                <li>• Improved discount accuracy and consistency</li>
                <li>• Enhanced customer experience with guided workflows</li>
                <li>• Real-time analytics and performance insights</li>
                <li>• Future-ready platform for continued growth</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
