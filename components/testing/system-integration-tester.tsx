"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Database,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  FileText,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface IntegrationTest {
  id: string
  name: string
  category: "workflow" | "api" | "database" | "security" | "performance" | "ui"
  description: string
  status: "running" | "passed" | "failed" | "pending" | "skipped"
  duration: number
  startTime: number
  endTime?: number
  steps: TestStep[]
  dependencies: string[]
  criticalPath: boolean
  error?: string
  metrics?: {
    responseTime: number
    throughput: number
    errorRate: number
    resourceUsage: number
  }
}

interface TestStep {
  id: string
  name: string
  status: "running" | "passed" | "failed" | "pending" | "skipped"
  duration: number
  details: string
  error?: string
}

interface SystemHealth {
  overall: number
  components: {
    database: number
    api: number
    ui: number
    cache: number
    security: number
  }
  issues: Array<{
    component: string
    severity: "low" | "medium" | "high" | "critical"
    description: string
    impact: string
  }>
}

interface TestSuite {
  id: string
  name: string
  description: string
  tests: IntegrationTest[]
  status: "running" | "passed" | "failed" | "idle"
  progress: number
  estimatedDuration: number
  actualDuration: number
}

export function SystemIntegrationTester() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedSuite, setSelectedSuite] = useState<string>("all")
  const [testEnvironment, setTestEnvironment] = useState<string>("staging")
  const [lastRun, setLastRun] = useState<Date | null>(null)

  useEffect(() => {
    initializeTestSuites()
    generateSystemHealth()
  }, [])

  const initializeTestSuites = () => {
    const suites: TestSuite[] = [
      {
        id: "critical-workflows",
        name: "Critical Business Workflows",
        description: "End-to-end testing of core business processes",
        tests: [],
        status: "idle",
        progress: 0,
        estimatedDuration: 180000,
        actualDuration: 0,
      },
      {
        id: "api-integration",
        name: "API Integration Tests",
        description: "Cross-service API communication and data flow",
        tests: [],
        status: "idle",
        progress: 0,
        estimatedDuration: 120000,
        actualDuration: 0,
      },
      {
        id: "database-integrity",
        name: "Database Integrity Tests",
        description: "Data consistency and transaction reliability",
        tests: [],
        status: "idle",
        progress: 0,
        estimatedDuration: 90000,
        actualDuration: 0,
      },
      {
        id: "security-validation",
        name: "Security Validation Tests",
        description: "Authentication, authorization, and data protection",
        tests: [],
        status: "idle",
        progress: 0,
        estimatedDuration: 150000,
        actualDuration: 0,
      },
      {
        id: "performance-load",
        name: "Performance & Load Tests",
        description: "System behavior under various load conditions",
        tests: [],
        status: "idle",
        progress: 0,
        estimatedDuration: 300000,
        actualDuration: 0,
      },
    ]

    setTestSuites(suites)
  }

  const generateSystemHealth = () => {
    const health: SystemHealth = {
      overall: 94.2,
      components: {
        database: 96.8,
        api: 93.5,
        ui: 91.2,
        cache: 98.1,
        security: 95.7,
      },
      issues: [
        {
          component: "API Gateway",
          severity: "medium",
          description: "Response time increased by 15% in last 24 hours",
          impact: "Potential user experience degradation",
        },
        {
          component: "Database Connection Pool",
          severity: "low",
          description: "Connection pool utilization at 75%",
          impact: "May need scaling during peak hours",
        },
        {
          component: "Cache Layer",
          severity: "low",
          description: "Cache hit rate dropped to 87%",
          impact: "Slightly increased database load",
        },
      ],
    }

    setSystemHealth(health)
  }

  const generateMockTests = (suiteId: string): IntegrationTest[] => {
    const testDefinitions = {
      "critical-workflows": [
        {
          name: "Complete Purchase Flow",
          description: "User registration → product selection → pricing calculation → payment → confirmation",
          steps: [
            "Create user account",
            "Browse product catalog",
            "Add items to cart",
            "Apply promotions",
            "Calculate final pricing",
            "Process payment",
            "Generate confirmation",
          ],
        },
        {
          name: "Admin Promotion Management",
          description: "Admin creates, configures, and activates bulk pricing promotions",
          steps: [
            "Admin authentication",
            "Create promotion campaign",
            "Configure pricing rules",
            "Set activation schedule",
            "Validate promotion logic",
            "Activate promotion",
            "Monitor usage metrics",
          ],
        },
        {
          name: "Real-time Price Updates",
          description: "Price changes propagate across all system components",
          steps: [
            "Update base product price",
            "Recalculate promotion impacts",
            "Update cache layers",
            "Notify connected clients",
            "Validate UI updates",
            "Check analytics tracking",
          ],
        },
      ],
      "api-integration": [
        {
          name: "Pricing API Chain",
          description: "Complete pricing calculation through all API layers",
          steps: [
            "Product service lookup",
            "Promotion engine query",
            "Discount calculation",
            "Tax computation",
            "Final price assembly",
            "Response validation",
          ],
        },
        {
          name: "External Service Integration",
          description: "Integration with payment gateways and third-party services",
          steps: [
            "Payment gateway connection",
            "Tax service integration",
            "Inventory system sync",
            "Analytics service calls",
            "Error handling validation",
          ],
        },
      ],
      "database-integrity": [
        {
          name: "Transaction Consistency",
          description: "Multi-table transaction rollback and consistency",
          steps: [
            "Begin complex transaction",
            "Update multiple tables",
            "Simulate failure condition",
            "Verify rollback completion",
            "Check data consistency",
          ],
        },
        {
          name: "Data Migration Validation",
          description: "Validate data integrity after schema changes",
          steps: [
            "Backup current data",
            "Apply schema migration",
            "Validate data integrity",
            "Check foreign key constraints",
            "Verify index performance",
          ],
        },
      ],
      "security-validation": [
        {
          name: "Authentication Flow Security",
          description: "Complete authentication and authorization validation",
          steps: [
            "Test login security",
            "Validate JWT tokens",
            "Check session management",
            "Test role-based access",
            "Verify logout cleanup",
          ],
        },
        {
          name: "Data Protection Compliance",
          description: "Ensure sensitive data is properly protected",
          steps: [
            "Validate data encryption",
            "Check access logging",
            "Test data anonymization",
            "Verify audit trails",
            "Check compliance rules",
          ],
        },
      ],
      "performance-load": [
        {
          name: "Concurrent User Load Test",
          description: "System behavior with 1000+ concurrent users",
          steps: [
            "Ramp up user load",
            "Monitor response times",
            "Check error rates",
            "Validate auto-scaling",
            "Measure resource usage",
          ],
        },
        {
          name: "Database Performance Under Load",
          description: "Database performance with high query volume",
          steps: [
            "Generate query load",
            "Monitor connection pools",
            "Check query performance",
            "Validate caching",
            "Test failover scenarios",
          ],
        },
      ],
    }

    const suiteTests = testDefinitions[suiteId as keyof typeof testDefinitions] || []

    return suiteTests.map((testDef, index) => ({
      id: `${suiteId}_${index}`,
      name: testDef.name,
      category: suiteId.includes("workflow")
        ? "workflow"
        : suiteId.includes("api")
          ? "api"
          : suiteId.includes("database")
            ? "database"
            : suiteId.includes("security")
              ? "security"
              : "performance",
      description: testDef.description,
      status: "pending" as const,
      duration: 0,
      startTime: 0,
      steps: testDef.steps.map((stepName, stepIndex) => ({
        id: `${suiteId}_${index}_${stepIndex}`,
        name: stepName,
        status: "pending" as const,
        duration: 0,
        details: `Executing: ${stepName}`,
      })),
      dependencies: index > 0 ? [`${suiteId}_${index - 1}`] : [],
      criticalPath: index < 2, // First two tests are critical
      metrics: {
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        resourceUsage: 0,
      },
    }))
  }

  const runIntegrationTests = async (suiteId?: string) => {
    setIsRunning(true)
    setLastRun(new Date())

    const suitesToRun = suiteId ? testSuites.filter((s) => s.id === suiteId) : testSuites

    for (const suite of suitesToRun) {
      // Initialize tests for the suite
      const tests = generateMockTests(suite.id)

      setTestSuites((prev) =>
        prev.map((s) =>
          s.id === suite.id
            ? {
                ...s,
                status: "running" as const,
                tests,
                progress: 0,
                actualDuration: 0,
              }
            : s,
        ),
      )

      // Run each test in the suite
      for (let testIndex = 0; testIndex < tests.length; testIndex++) {
        const test = tests[testIndex]

        // Update test status to running
        setTestSuites((prev) =>
          prev.map((s) =>
            s.id === suite.id
              ? {
                  ...s,
                  tests: s.tests.map((t) =>
                    t.id === test.id
                      ? {
                          ...t,
                          status: "running" as const,
                          startTime: Date.now(),
                        }
                      : t,
                  ),
                  progress: (testIndex / tests.length) * 100,
                }
              : s,
          ),
        )

        // Simulate test execution with steps
        for (let stepIndex = 0; stepIndex < test.steps.length; stepIndex++) {
          const step = test.steps[stepIndex]

          // Update step status to running
          setTestSuites((prev) =>
            prev.map((s) =>
              s.id === suite.id
                ? {
                    ...s,
                    tests: s.tests.map((t) =>
                      t.id === test.id
                        ? {
                            ...t,
                            steps: t.steps.map((st) =>
                              st.id === step.id
                                ? {
                                    ...st,
                                    status: "running" as const,
                                  }
                                : st,
                            ),
                          }
                        : t,
                    ),
                  }
                : s,
            ),
          )

          // Simulate step execution time
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

          // Complete step (with occasional failures for realism)
          const stepStatus = Math.random() > 0.05 ? "passed" : "failed"
          const stepDuration = 1000 + Math.random() * 2000

          setTestSuites((prev) =>
            prev.map((s) =>
              s.id === suite.id
                ? {
                    ...s,
                    tests: s.tests.map((t) =>
                      t.id === test.id
                        ? {
                            ...t,
                            steps: t.steps.map((st) =>
                              st.id === step.id
                                ? {
                                    ...st,
                                    status: stepStatus,
                                    duration: stepDuration,
                                    error:
                                      stepStatus === "failed"
                                        ? "Step failed due to timeout or assertion error"
                                        : undefined,
                                  }
                                : st,
                            ),
                          }
                        : t,
                    ),
                  }
                : s,
            ),
          )

          // If step failed and it's a critical test, fail the entire test
          if (stepStatus === "failed" && test.criticalPath) {
            break
          }
        }

        // Complete the test
        const testDuration = Date.now() - test.startTime
        const failedSteps = test.steps.filter((s) => s.status === "failed").length
        const testStatus = failedSteps > 0 && test.criticalPath ? "failed" : "passed"

        setTestSuites((prev) =>
          prev.map((s) =>
            s.id === suite.id
              ? {
                  ...s,
                  tests: s.tests.map((t) =>
                    t.id === test.id
                      ? {
                          ...t,
                          status: testStatus,
                          duration: testDuration,
                          endTime: Date.now(),
                          error: testStatus === "failed" ? `Test failed: ${failedSteps} step(s) failed` : undefined,
                          metrics: {
                            responseTime: 150 + Math.random() * 300,
                            throughput: 50 + Math.random() * 100,
                            errorRate: testStatus === "failed" ? 5 + Math.random() * 10 : Math.random() * 2,
                            resourceUsage: 30 + Math.random() * 40,
                          },
                        }
                      : t,
                  ),
                }
              : s,
          ),
        )

        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Complete the suite
      const suiteDuration = tests.reduce((sum, t) => sum + t.duration, 0)
      const failedTests = tests.filter((t) => t.status === "failed").length
      const suiteStatus = failedTests > 0 ? "failed" : "passed"

      setTestSuites((prev) =>
        prev.map((s) =>
          s.id === suite.id
            ? {
                ...s,
                status: suiteStatus,
                progress: 100,
                actualDuration: suiteDuration,
              }
            : s,
        ),
      )
    }

    setIsRunning(false)
    generateSystemHealth()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workflow":
        return <Globe className="h-4 w-4" />
      case "api":
        return <Zap className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const healthData = systemHealth
    ? [
        { name: "Database", value: systemHealth.components.database, color: "#10b981" },
        { name: "API", value: systemHealth.components.api, color: "#3b82f6" },
        { name: "UI", value: systemHealth.components.ui, color: "#f59e0b" },
        { name: "Cache", value: systemHealth.components.cache, color: "#8b5cf6" },
        { name: "Security", value: systemHealth.components.security, color: "#ef4444" },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Integration Testing</h2>
          <p className="text-muted-foreground">Comprehensive end-to-end system validation and reliability testing</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={testEnvironment} onValueChange={setTestEnvironment}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSuite} onValueChange={setSelectedSuite}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Test Suites</SelectItem>
              <SelectItem value="critical-workflows">Critical Workflows</SelectItem>
              <SelectItem value="api-integration">API Integration</SelectItem>
              <SelectItem value="database-integrity">Database Integrity</SelectItem>
              <SelectItem value="security-validation">Security Validation</SelectItem>
              <SelectItem value="performance-load">Performance & Load</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => runIntegrationTests(selectedSuite === "all" ? undefined : selectedSuite)}
            disabled={isRunning}
          >
            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isRunning ? "Running..." : "Run Tests"}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>System Health Status</CardTitle>
              <CardDescription>Overall system component health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Overall Health Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">{systemHealth.overall}%</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <Progress value={systemHealth.overall} className="h-2" />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  {Object.entries(systemHealth.components).map(([component, health]) => (
                    <div key={component} className="text-center">
                      <div className="text-lg font-bold">{health}%</div>
                      <div className="text-sm text-muted-foreground capitalize">{component}</div>
                      <Progress value={health} className="mt-1 h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Health</CardTitle>
              <CardDescription>Health distribution by component</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Issues */}
      {systemHealth && systemHealth.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>System Issues & Recommendations</CardTitle>
            <CardDescription>Detected issues and suggested actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.issues.map((issue, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={
                              issue.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : issue.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : issue.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }
                          >
                            {issue.severity}
                          </Badge>
                          <span className="font-medium">{issue.component}</span>
                        </div>
                        <div className="text-sm">{issue.description}</div>
                        <div className="text-sm text-muted-foreground mt-1">Impact: {issue.impact}</div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="suites" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="reports">Test Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="suites" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testSuites
              .filter((suite) => selectedSuite === "all" || suite.id === selectedSuite)
              .map((suite) => (
                <Card key={suite.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      <Badge className={getStatusColor(suite.status)}>{suite.status}</Badge>
                    </div>
                    <CardDescription>{suite.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tests</span>
                          <div className="font-medium">{suite.tests.length}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <div className="font-medium">
                            {suite.actualDuration > 0
                              ? formatDuration(suite.actualDuration)
                              : formatDuration(suite.estimatedDuration)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Progress</span>
                          <div className="font-medium">{suite.progress.toFixed(0)}%</div>
                        </div>
                      </div>

                      {suite.status === "running" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Execution Progress</span>
                            <span>{suite.progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={suite.progress} />
                        </div>
                      )}

                      {suite.tests.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Test Results</h4>
                          <div className="space-y-1">
                            {suite.tests.slice(0, 3).map((test) => (
                              <div key={test.id} className="flex items-center gap-2 text-sm">
                                {getStatusIcon(test.status)}
                                <span className="flex-1 truncate">{test.name}</span>
                                {test.duration > 0 && (
                                  <span className="text-muted-foreground">{formatDuration(test.duration)}</span>
                                )}
                              </div>
                            ))}
                            {suite.tests.length > 3 && (
                              <div className="text-sm text-muted-foreground">
                                +{suite.tests.length - 3} more tests...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => runIntegrationTests(suite.id)}>
                          <Play className="h-3 w-3 mr-1" />
                          Run Suite
                        </Button>
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Test Results</CardTitle>
              <CardDescription>Step-by-step execution results for all integration tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {testSuites
                    .filter((suite) => selectedSuite === "all" || suite.id === selectedSuite)
                    .flatMap((suite) =>
                      suite.tests.map((test) => (
                        <div key={test.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(test.category)}
                              <h4 className="font-medium">{test.name}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {test.criticalPath && (
                                <Badge variant="outline" className="text-xs">
                                  Critical
                                </Badge>
                              )}
                              <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">{test.description}</p>

                          {test.steps.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Execution Steps:</h5>
                              <div className="space-y-1">
                                {test.steps.map((step) => (
                                  <div key={step.id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                                    {getStatusIcon(step.status)}
                                    <span className="flex-1">{step.name}</span>
                                    {step.duration > 0 && (
                                      <span className="text-muted-foreground">{formatDuration(step.duration)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {test.error && (
                            <Alert>
                              <XCircle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Error:</strong> {test.error}
                              </AlertDescription>
                            </Alert>
                          )}

                          {test.metrics && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Response Time</span>
                                <div className="font-medium">{test.metrics.responseTime.toFixed(0)}ms</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Throughput</span>
                                <div className="font-medium">{test.metrics.throughput.toFixed(0)}/s</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Error Rate</span>
                                <div className="font-medium">{test.metrics.errorRate.toFixed(1)}%</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Resource Usage</span>
                                <div className="font-medium">{test.metrics.resourceUsage.toFixed(0)}%</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )),
                    )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Response time and throughput trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { time: "00:00", responseTime: 120, throughput: 85 },
                      { time: "00:05", responseTime: 135, throughput: 78 },
                      { time: "00:10", responseTime: 142, throughput: 82 },
                      { time: "00:15", responseTime: 128, throughput: 89 },
                      { time: "00:20", responseTime: 115, throughput: 92 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="responseTime" stroke="#3b82f6" name="Response Time (ms)" />
                    <Line type="monotone" dataKey="throughput" stroke="#10b981" name="Throughput (req/s)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Analysis</CardTitle>
                <CardDescription>Error rates by test category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { category: "Workflow", errors: 2.1, tests: 15 },
                      { category: "API", errors: 1.8, tests: 23 },
                      { category: "Database", errors: 0.5, tests: 12 },
                      { category: "Security", errors: 1.2, tests: 18 },
                      { category: "Performance", errors: 3.2, tests: 8 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="errors" fill="#ef4444" name="Error Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
              <CardDescription>System resource usage during test execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45%</div>
                  <div className="text-sm text-muted-foreground">CPU Usage</div>
                  <Progress value={45} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">62%</div>
                  <div className="text-sm text-muted-foreground">Memory Usage</div>
                  <Progress value={62} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">28%</div>
                  <div className="text-sm text-muted-foreground">Disk I/O</div>
                  <Progress value={28} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">34%</div>
                  <div className="text-sm text-muted-foreground">Network I/O</div>
                  <Progress value={34} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Summary Report</CardTitle>
                <CardDescription>Executive summary of integration test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-4 border rounded">
                      <div className="text-2xl font-bold text-blue-600">76</div>
                      <div className="text-sm text-muted-foreground">Tests Executed</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Key Findings:</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>All critical business workflows passed successfully</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>API integration tests show 98.5% reliability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Performance tests indicate 15% increase in response time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Security validation passed all compliance checks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download detailed test reports and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Executive Summary (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Detailed Test Results (HTML)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Performance Metrics (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Security Audit Report (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    System Health Report (JSON)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Suggested improvements based on test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Optimization:</strong> Consider implementing caching strategies to reduce API
                    response times by an estimated 25-30%.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Enhancement:</strong> Add rate limiting to API endpoints to prevent potential DoS
                    attacks during high load periods.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Database Optimization:</strong> Consider adding database connection pooling to handle
                    concurrent user loads more efficiently.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Monitoring Enhancement:</strong> Implement real-time alerting for critical workflow failures
                    to reduce mean time to resolution.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
