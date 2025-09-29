"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  Settings,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
  Shield,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface CIPipeline {
  id: string
  name: string
  branch: string
  status: "running" | "passed" | "failed" | "queued" | "cancelled"
  startTime: Date
  duration: number
  stages: CIStage[]
  coverage: number
  testResults: {
    total: number
    passed: number
    failed: number
    skipped: number
  }
  artifacts: string[]
  triggeredBy: string
}

interface CIStage {
  id: string
  name: string
  status: "running" | "passed" | "failed" | "skipped" | "pending"
  duration: number
  logs: string[]
  startTime: Date
}

interface CIMetrics {
  successRate: number
  avgDuration: number
  deploymentsToday: number
  testsRun: number
  coverageTrend: Array<{
    date: string
    coverage: number
    tests: number
    duration: number
  }>
}

export function ContinuousIntegrationDashboard() {
  const [pipelines, setPipelines] = useState<CIPipeline[]>([])
  const [metrics, setMetrics] = useState<CIMetrics | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null)

  useEffect(() => {
    generateMockData()

    if (autoRefresh) {
      const interval = setInterval(generateMockData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const generateMockData = () => {
    const mockPipelines: CIPipeline[] = [
      {
        id: "1",
        name: "GTI Pricing Engine - Main",
        branch: "main",
        status: "passed",
        startTime: new Date(Date.now() - 1200000),
        duration: 847000,
        coverage: 87.3,
        testResults: { total: 247, passed: 231, failed: 12, skipped: 4 },
        artifacts: ["test-results.xml", "coverage-report.html", "build-artifacts.zip"],
        triggeredBy: "john.doe@company.com",
        stages: [
          {
            id: "1",
            name: "Checkout & Setup",
            status: "passed",
            duration: 45000,
            startTime: new Date(Date.now() - 1200000),
            logs: ["Checking out code...", "Installing dependencies...", "Setup complete"],
          },
          {
            id: "2",
            name: "Unit Tests",
            status: "passed",
            duration: 234000,
            startTime: new Date(Date.now() - 1155000),
            logs: ["Running unit tests...", "156 tests passed", "Coverage: 89.2%"],
          },
          {
            id: "3",
            name: "Integration Tests",
            status: "passed",
            duration: 456000,
            startTime: new Date(Date.now() - 921000),
            logs: ["Running integration tests...", "67 tests passed", "API tests completed"],
          },
          {
            id: "4",
            name: "Security Scan",
            status: "passed",
            duration: 112000,
            startTime: new Date(Date.now() - 465000),
            logs: ["Running security scan...", "No vulnerabilities found", "Scan completed"],
          },
        ],
      },
      {
        id: "2",
        name: "GTI Pricing Engine - Feature/bulk-pricing",
        branch: "feature/bulk-pricing",
        status: "running",
        startTime: new Date(Date.now() - 300000),
        duration: 0,
        coverage: 0,
        testResults: { total: 0, passed: 0, failed: 0, skipped: 0 },
        artifacts: [],
        triggeredBy: "jane.smith@company.com",
        stages: [
          {
            id: "1",
            name: "Checkout & Setup",
            status: "passed",
            duration: 42000,
            startTime: new Date(Date.now() - 300000),
            logs: ["Checking out code...", "Installing dependencies...", "Setup complete"],
          },
          {
            id: "2",
            name: "Unit Tests",
            status: "running",
            duration: 0,
            startTime: new Date(Date.now() - 258000),
            logs: ["Running unit tests...", "Progress: 45/156 tests completed"],
          },
          {
            id: "3",
            name: "Integration Tests",
            status: "pending",
            duration: 0,
            startTime: new Date(),
            logs: [],
          },
        ],
      },
    ]

    const mockMetrics: CIMetrics = {
      successRate: 94.2,
      avgDuration: 12.5,
      deploymentsToday: 8,
      testsRun: 1847,
      coverageTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        coverage: 85 + Math.random() * 5,
        tests: 200 + Math.floor(Math.random() * 50),
        duration: 10 + Math.random() * 5,
      })),
    }

    setPipelines(mockPipelines)
    setMetrics(mockMetrics)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-500" />
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
      case "queued":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <GitBranch className="h-8 w-8 text-blue-500" />
            Continuous Integration
          </h2>
          <p className="text-muted-foreground">Automated testing and deployment pipeline monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label htmlFor="auto-refresh">Auto Refresh</Label>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{metrics.successRate}%</div>
              <div className="text-sm text-muted-foreground">Last 30 days</div>
              <Progress value={metrics.successRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Avg Duration</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{metrics.avgDuration}m</div>
              <div className="text-sm text-muted-foreground">Pipeline runtime</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Deployments</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{metrics.deploymentsToday}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Tests Run</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{metrics.testsRun}</div>
              <div className="text-sm text-muted-foreground">This week</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="pipelines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipelines">Active Pipelines</TabsTrigger>
          <TabsTrigger value="history">Pipeline History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="space-y-4">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                        <CardDescription>
                          Branch: {pipeline.branch} • Triggered by {pipeline.triggeredBy}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(pipeline.status)}>{pipeline.status}</Badge>
                      {pipeline.status === "running" && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Pipeline Stages */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Pipeline Stages</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {pipeline.stages.map((stage) => (
                          <div key={stage.id} className="flex items-center gap-2 p-2 border rounded">
                            {getStatusIcon(stage.status)}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{stage.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {stage.status === "running" ? "Running..." : formatDuration(stage.duration)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pipeline Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration</span>
                        <div className="font-medium">
                          {pipeline.status === "running" ? "Running..." : formatDuration(pipeline.duration)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tests</span>
                        <div className="font-medium">
                          {pipeline.testResults.passed}/{pipeline.testResults.total}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coverage</span>
                        <div className="font-medium">{pipeline.coverage.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Started</span>
                        <div className="font-medium">{pipeline.startTime.toLocaleTimeString()}</div>
                      </div>
                    </div>

                    {/* Progress Bar for Running Pipelines */}
                    {pipeline.status === "running" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {pipeline.stages.filter((s) => s.status === "passed").length}/{pipeline.stages.length}{" "}
                            stages
                          </span>
                        </div>
                        <Progress
                          value={
                            (pipeline.stages.filter((s) => s.status === "passed").length / pipeline.stages.length) * 100
                          }
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedPipeline(pipeline.id)}>
                        View Logs
                      </Button>
                      <Button size="sm" variant="ghost">
                        Download Artifacts
                      </Button>
                      {pipeline.status !== "running" && (
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3 mr-1" />
                          Rerun
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline History</CardTitle>
              <CardDescription>Recent pipeline executions and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {Array.from({ length: 20 }, (_, i) => ({
                    id: i + 1,
                    name: `GTI Pricing Engine - ${i % 3 === 0 ? "main" : i % 3 === 1 ? "develop" : "feature/new-feature"}`,
                    status: Math.random() > 0.2 ? "passed" : "failed",
                    duration: Math.random() * 600000 + 300000,
                    timestamp: new Date(Date.now() - i * 3600000),
                    coverage: 80 + Math.random() * 15,
                  })).map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(run.status)}
                        <div>
                          <div className="font-medium text-sm">{run.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {run.timestamp.toLocaleString()} • {formatDuration(run.duration)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {run.coverage.toFixed(1)}% coverage
                        </Badge>
                        <Badge className={getStatusColor(run.status)}>{run.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Trends</CardTitle>
                  <CardDescription>Test coverage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.coverageTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="coverage" stroke="#3b82f6" name="Coverage %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pipeline Performance</CardTitle>
                  <CardDescription>Duration and test count trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics.coverageTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="duration" fill="#10b981" name="Duration (min)" />
                      <Bar dataKey="tests" fill="#f59e0b" name="Tests Run" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quality Insights</CardTitle>
              <CardDescription>Automated analysis of pipeline health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Improvement Detected:</strong> Test coverage has increased by 5.2% over the last week,
                    indicating better code quality practices.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Performance Warning:</strong> Pipeline duration has increased by 15% in the last 3 days.
                    Consider optimizing test execution or adding parallel processing.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Success Rate:</strong> Your pipeline success rate of 94.2% is above the industry average of
                    85%. Great job maintaining code quality!
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Configuration</CardTitle>
                <CardDescription>Configure automated testing and deployment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-trigger on push</Label>
                    <p className="text-sm text-muted-foreground">Automatically run tests when code is pushed</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Parallel test execution</Label>
                    <p className="text-sm text-muted-foreground">Run tests in parallel to reduce duration</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Fail fast on errors</Label>
                    <p className="text-sm text-muted-foreground">Stop pipeline on first test failure</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Deploy on success</Label>
                    <p className="text-sm text-muted-foreground">Automatically deploy when all tests pass</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email alerts for pipeline failures</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Slack integration</Label>
                    <p className="text-sm text-muted-foreground">Post updates to Slack channels</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Coverage threshold alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when coverage drops below 80%</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Performance alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when pipeline duration increases significantly
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
