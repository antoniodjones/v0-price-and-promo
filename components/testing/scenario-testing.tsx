"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Play, Save, Settings, AlertTriangle } from "lucide-react"

interface TestScenario {
  id: string
  name: string
  description: string
  type: "edge-case" | "business-rule" | "performance" | "integration"
  status: "draft" | "ready" | "running" | "completed"
  lastRun?: string
  result?: "passed" | "failed" | "warning"
}

interface ScenarioResult {
  scenario: string
  expected: string
  actual: string
  status: "passed" | "failed" | "warning"
  details: string
}

export function ScenarioTesting() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    {
      id: "scenario-001",
      name: "Multiple Discount Conflict Resolution",
      description: "Test no-stacking policy when customer has multiple applicable discounts",
      type: "business-rule",
      status: "ready",
      lastRun: "2024-03-15",
      result: "passed",
    },
    {
      id: "scenario-002",
      name: "Expiration Date Edge Cases",
      description: "Test automated discounts for products expiring exactly at midnight",
      type: "edge-case",
      status: "ready",
      lastRun: "2024-03-14",
      result: "warning",
    },
    {
      id: "scenario-003",
      name: "High Volume Order Processing",
      description: "Test system performance with 1000+ item orders",
      type: "performance",
      status: "draft",
    },
  ])

  const [selectedScenario, setSelectedScenario] = useState("")
  const [newScenarioName, setNewScenarioName] = useState("")
  const [newScenarioDescription, setNewScenarioDescription] = useState("")
  const [newScenarioType, setNewScenarioType] = useState("")
  const [testResults, setTestResults] = useState<ScenarioResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const mockScenarioResults: ScenarioResult[] = [
    {
      scenario: "Customer with 8% discount + 20% expiration discount",
      expected: "Apply 20% expiration discount (best deal)",
      actual: "Applied 20% expiration discount",
      status: "passed",
      details: "No-stacking policy correctly enforced",
    },
    {
      scenario: "Customer with volume discount + THC discount",
      expected: "Apply volume discount (6% > 4% THC discount)",
      actual: "Applied volume discount (6%)",
      status: "passed",
      details: "Best deal logic working correctly",
    },
    {
      scenario: "Edge case: Zero quantity order",
      expected: "Return validation error",
      actual: "Returned validation error",
      status: "passed",
      details: "Input validation working as expected",
    },
    {
      scenario: "Batch with null THC percentage",
      expected: "Skip THC-based discounts",
      actual: "Applied default discount instead",
      status: "warning",
      details: "Should skip THC discounts for null values",
    },
  ]

  const runScenarioTest = async () => {
    if (!selectedScenario) return

    setIsRunning(true)

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setTestResults(mockScenarioResults)

    // Update scenario status
    setScenarios(
      scenarios.map((s) =>
        s.id === selectedScenario
          ? { ...s, status: "completed", lastRun: new Date().toISOString().split("T")[0], result: "passed" }
          : s,
      ),
    )

    setIsRunning(false)
  }

  const createNewScenario = () => {
    if (!newScenarioName || !newScenarioDescription || !newScenarioType) return

    const newScenario: TestScenario = {
      id: `scenario-${Date.now()}`,
      name: newScenarioName,
      description: newScenarioDescription,
      type: newScenarioType as TestScenario["type"],
      status: "draft",
    }

    setScenarios([...scenarios, newScenario])
    setNewScenarioName("")
    setNewScenarioDescription("")
    setNewScenarioType("")
  }

  const getStatusBadge = (status: TestScenario["status"]) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
      case "running":
        return <Badge className="bg-amber-100 text-amber-800">Running</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getResultBadge = (result?: TestScenario["result"]) => {
    if (!result) return null

    switch (result) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: TestScenario["type"]) => {
    switch (type) {
      case "edge-case":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "business-rule":
        return <Settings className="h-4 w-4 text-blue-500" />
      case "performance":
        return <Settings className="h-4 w-4 text-green-500" />
      case "integration":
        return <Settings className="h-4 w-4 text-purple-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Create New Scenario */}
      <Card>
        <CardHeader>
          <CardTitle>Create Test Scenario</CardTitle>
          <CardDescription>Define custom test scenarios for edge cases and business rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scenarioName">Scenario Name</Label>
              <Input
                id="scenarioName"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="e.g., Multiple BOGO Conflicts"
              />
            </div>
            <div>
              <Label htmlFor="scenarioType">Scenario Type</Label>
              <Select value={newScenarioType} onValueChange={setNewScenarioType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="edge-case">Edge Case</SelectItem>
                  <SelectItem value="business-rule">Business Rule</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="scenarioDescription">Description</Label>
            <Textarea
              id="scenarioDescription"
              value={newScenarioDescription}
              onChange={(e) => setNewScenarioDescription(e.target.value)}
              placeholder="Describe the test scenario and expected behavior..."
              rows={3}
            />
          </div>
          <Button onClick={createNewScenario} className="bg-gti-dark-green hover:bg-gti-medium-green">
            <Plus className="h-4 w-4 mr-2" />
            Create Scenario
          </Button>
        </CardContent>
      </Card>

      {/* Existing Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
          <CardDescription>Manage and execute custom test scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scenario</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {getTypeIcon(scenario.type)}
                      <div>
                        <div className="font-medium">{scenario.name}</div>
                        <div className="text-sm text-gray-600 max-w-md">{scenario.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{scenario.type.replace("-", " ")}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(scenario.status)}</TableCell>
                  <TableCell className="text-gray-600">{scenario.lastRun || "Never"}</TableCell>
                  <TableCell>{getResultBadge(scenario.result)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedScenario(scenario.id)}
                        disabled={scenario.status === "draft"}
                      >
                        Select
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={runScenarioTest}
              disabled={!selectedScenario || isRunning}
              className="bg-gti-dark-green hover:bg-gti-medium-green"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running Test..." : "Run Selected Scenario"}
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Test Suite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scenario Test Results</CardTitle>
            <CardDescription>Detailed results from scenario execution</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Case</TableHead>
                  <TableHead>Expected Result</TableHead>
                  <TableHead>Actual Result</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium max-w-xs">{result.scenario}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">{result.expected}</TableCell>
                    <TableCell className="text-sm max-w-xs">{result.actual}</TableCell>
                    <TableCell>{getResultBadge(result.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">{result.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Tests</div>
                  <div className="font-medium text-lg">{testResults.length}</div>
                </div>
                <div>
                  <div className="text-gray-600">Passed</div>
                  <div className="font-medium text-lg text-green-600">
                    {testResults.filter((r) => r.status === "passed").length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Warnings</div>
                  <div className="font-medium text-lg text-amber-600">
                    {testResults.filter((r) => r.status === "warning").length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
