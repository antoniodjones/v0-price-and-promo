"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { useTableSort, useTableFilter, useTablePagination } from "@/lib/table-helpers"

interface TestResult {
  id: string
  name: string
  type: "basket" | "historical" | "scenario"
  status: "passed" | "failed" | "warning"
  runDate: string
  duration: string
  testCount: number
  passRate: number
  details: string
}

export function TestResults() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const testResults: TestResult[] = [
    {
      id: "result-001",
      name: "Massachusetts Volume Pricing Validation",
      type: "basket",
      status: "passed",
      runDate: "2024-03-15 14:30",
      duration: "1.2s",
      testCount: 15,
      passRate: 100,
      details: "All pricing calculations correct",
    },
    {
      id: "result-002",
      name: "Historical Order Simulation - March 2024",
      type: "historical",
      status: "warning",
      runDate: "2024-03-15 13:45",
      duration: "3.8s",
      testCount: 247,
      passRate: 96.8,
      details: "8 orders showed minor discrepancies",
    },
    {
      id: "result-003",
      name: "Multiple Discount Conflict Resolution",
      type: "scenario",
      status: "passed",
      runDate: "2024-03-15 12:15",
      duration: "2.1s",
      testCount: 12,
      passRate: 100,
      details: "No-stacking policy working correctly",
    },
    {
      id: "result-004",
      name: "Expiration Date Edge Cases",
      type: "scenario",
      status: "failed",
      runDate: "2024-03-15 11:30",
      duration: "1.8s",
      testCount: 8,
      passRate: 75,
      details: "2 edge cases failed validation",
    },
    {
      id: "result-005",
      name: "Customer Tier Assignment Validation",
      type: "basket",
      status: "passed",
      runDate: "2024-03-15 10:45",
      duration: "0.9s",
      testCount: 25,
      passRate: 100,
      details: "All tier assignments correct",
    },
  ]

  const resultsSort = useTableSort(testResults, { key: "runDate", direction: "desc" })
  const resultsFilter = useTableFilter(resultsSort.sortedData, ["name", "type", "status", "details"])
  const resultsPagination = useTablePagination(resultsFilter.filteredData, 10)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "basket":
        return <Badge variant="outline">Basket Test</Badge>
      case "historical":
        return <Badge variant="outline">Historical</Badge>
      case "scenario":
        return <Badge variant="outline">Scenario</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getPassRateColor = (passRate: number) => {
    if (passRate >= 95) return "text-green-600"
    if (passRate >= 85) return "text-amber-600"
    return "text-red-600"
  }

  const summaryStats = {
    totalTests: testResults.length,
    passedTests: testResults.filter((r) => r.status === "passed").length,
    failedTests: testResults.filter((r) => r.status === "failed").length,
    warningTests: testResults.filter((r) => r.status === "warning").length,
    avgPassRate: Math.round(testResults.reduce((sum, r) => sum + r.passRate, 0) / testResults.length),
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{summaryStats.totalTests}</div>
            <div className="text-sm text-gray-500">Total Tests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{summaryStats.passedTests}</div>
            <div className="text-sm text-gray-500">Passed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{summaryStats.warningTests}</div>
            <div className="text-sm text-gray-500">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{summaryStats.failedTests}</div>
            <div className="text-sm text-gray-500">Failed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">{summaryStats.avgPassRate}%</div>
            <div className="text-sm text-gray-500">Avg Pass Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results History</CardTitle>
          <CardDescription>View and manage all test execution results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search tests..."
                value={resultsFilter.searchTerm}
                onChange={resultsFilter.setSearchTerm}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="basket">Basket Test</SelectItem>
                <SelectItem value="historical">Historical</SelectItem>
                <SelectItem value="scenario">Scenario</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">More Filters</Button>

            <Button variant="outline">Export</Button>
          </div>

          <UnifiedDataTable
            data={resultsPagination.paginatedData}
            columns={[
              {
                key: "name",
                header: "Test Name",
                sortable: true,
                render: (result) => (
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.details}</div>
                  </div>
                ),
              },
              {
                key: "type",
                header: "Type",
                sortable: true,
                render: (result) => getTypeBadge(result.type),
              },
              {
                key: "status",
                header: "Status",
                sortable: true,
                render: (result) => getStatusBadge(result.status),
              },
              {
                key: "runDate",
                header: "Run Date",
                sortable: true,
                render: (result) => <span className="text-gray-500">{result.runDate}</span>,
              },
              {
                key: "duration",
                header: "Duration",
                render: (result) => <span className="text-gray-500">{result.duration}</span>,
              },
              {
                key: "testCount",
                header: "Tests",
                render: (result) => <span className="text-gray-500">{result.testCount}</span>,
              },
              {
                key: "passRate",
                header: "Pass Rate",
                sortable: true,
                render: (result) => (
                  <span className={`font-medium ${getPassRateColor(result.passRate)}`}>{result.passRate}%</span>
                ),
              },
              {
                key: "actions",
                header: "Actions",
                render: () => (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            sortState={resultsSort}
            searchValue={resultsFilter.searchTerm}
            onSearchChange={resultsFilter.setSearchTerm}
            pagination={resultsPagination}
          />
        </CardContent>
      </Card>

      {/* Test Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Trends</CardTitle>
          <CardDescription>Test execution patterns and quality metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tests run today</span>
                  </div>
                  <span className="font-medium text-green-600">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tests run this week</span>
                  </div>
                  <span className="font-medium text-blue-600">23</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Avg tests per day</span>
                  </div>
                  <span className="font-medium text-purple-600">3.2</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">Overall Test Coverage</div>
                  <div className="text-xs text-gray-600 mt-1">87% of pricing rules have test coverage</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900 text-sm">Test Reliability</div>
                  <div className="text-xs text-gray-600 mt-1">95% of tests pass consistently</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
