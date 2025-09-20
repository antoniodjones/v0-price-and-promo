"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Play, Download, History } from "lucide-react"

interface HistoricalTest {
  id: string
  orderId: string
  customer: string
  date: string
  originalTotal: number
  simulatedTotal: number
  difference: number
  status: "passed" | "failed" | "warning"
  details: string
}

export function HistoricalTesting() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [selectedRules, setSelectedRules] = useState("")
  const [testResults, setTestResults] = useState<HistoricalTest[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const mockHistoricalTests: HistoricalTest[] = [
    {
      id: "hist-001",
      orderId: "ORD-2024-1234",
      customer: "Elite Cannabis Co",
      date: "2024-03-15",
      originalTotal: 2400.0,
      simulatedTotal: 2208.0,
      difference: -192.0,
      status: "passed",
      details: "Customer discount applied correctly",
    },
    {
      id: "hist-002",
      orderId: "ORD-2024-1235",
      customer: "Premium Dispensary LLC",
      date: "2024-03-15",
      originalTotal: 1650.0,
      simulatedTotal: 1650.0,
      difference: 0.0,
      status: "passed",
      details: "No discounts applicable - correct",
    },
    {
      id: "hist-003",
      orderId: "ORD-2024-1236",
      customer: "High Volume Buyer",
      date: "2024-03-15",
      originalTotal: 3200.0,
      simulatedTotal: 3040.0,
      difference: -160.0,
      status: "warning",
      details: "Volume discount difference detected",
    },
  ]

  const runHistoricalTest = async () => {
    setIsRunning(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setTestResults(mockHistoricalTests)
    setIsRunning(false)
  }

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

  const getDifferenceDisplay = (difference: number) => {
    if (difference === 0) {
      return <span className="text-gray-600">$0.00</span>
    }
    if (difference < 0) {
      return <span className="text-red-600">${Math.abs(difference).toFixed(2)} less</span>
    }
    return <span className="text-green-600">+${difference.toFixed(2)} more</span>
  }

  return (
    <div className="space-y-6">
      {/* Historical Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-gti-green" />
            Historical Pricing Simulation
          </CardTitle>
          <CardDescription>Test current pricing rules against historical orders to validate accuracy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="testDate">Test Date</Label>
              <Input id="testDate" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="customer">Customer (Optional)</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="elite">Elite Cannabis Co</SelectItem>
                  <SelectItem value="premium">Premium Dispensary LLC</SelectItem>
                  <SelectItem value="high-volume">High Volume Buyer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rules">Rule Set</Label>
              <Select value={selectedRules} onValueChange={setSelectedRules}>
                <SelectTrigger>
                  <SelectValue placeholder="Current rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Rules</SelectItem>
                  <SelectItem value="proposed">Proposed Rules</SelectItem>
                  <SelectItem value="custom">Custom Rule Set</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runHistoricalTest}
              disabled={!selectedDate || isRunning}
              className="bg-gti-green hover:bg-gti-green/90"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running Simulation..." : "Run Historical Test"}
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Summary */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
            <CardDescription>Historical pricing simulation results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                <div className="text-sm text-gray-600">Orders Tested</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.filter((t) => t.status === "passed").length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {testResults.filter((t) => t.status === "warning").length}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.filter((t) => t.status === "failed").length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
            <CardDescription>Order-by-order comparison of historical vs simulated pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Original Total</TableHead>
                  <TableHead>Simulated Total</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.orderId}</TableCell>
                    <TableCell>{result.customer}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>${result.originalTotal.toFixed(2)}</TableCell>
                    <TableCell>${result.simulatedTotal.toFixed(2)}</TableCell>
                    <TableCell>{getDifferenceDisplay(result.difference)}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">{result.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Historical Insights */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Insights</CardTitle>
            <CardDescription>Key findings from historical pricing analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Accuracy Analysis</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">High Accuracy</div>
                    <div className="text-sm text-green-700">
                      {Math.round((testResults.filter((t) => t.status === "passed").length / testResults.length) * 100)}
                      % of orders match expected pricing
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-amber-800">Minor Discrepancies</div>
                    <div className="text-sm text-amber-700">
                      {testResults.filter((t) => t.status === "warning").length} orders show small differences
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-gray-900 text-sm">Rule Validation</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Current rules show 95% accuracy against historical data
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-gray-900 text-sm">Volume Discount Review</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Consider adjusting volume thresholds based on historical patterns
                    </div>
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
