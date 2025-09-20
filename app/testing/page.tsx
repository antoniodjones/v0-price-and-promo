"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TestTube, History, TrendingUp, AlertCircle } from "lucide-react"
import { BasketTesting } from "@/components/testing/basket-testing"
import { HistoricalTesting } from "@/components/testing/historical-testing"
import { ScenarioTesting } from "@/components/testing/scenario-testing"
import { TestResults } from "@/components/testing/test-results"

export default function TestingPage() {
  const [activeTests, setActiveTests] = useState(3)
  const [completedTests, setCompletedTests] = useState(47)

  const testStats = [
    {
      title: "Active Tests",
      value: activeTests.toString(),
      description: "Currently running",
      icon: TestTube,
      trend: "+2 today",
      color: "text-blue-600",
    },
    {
      title: "Completed Tests",
      value: completedTests.toString(),
      description: "This month",
      icon: History,
      trend: "+12 this week",
      color: "text-green-600",
    },
    {
      title: "Success Rate",
      value: "98.7%",
      description: "Test accuracy",
      icon: TrendingUp,
      trend: "+0.3% improvement",
      color: "text-gti-green",
    },
    {
      title: "Issues Found",
      value: "2",
      description: "Requiring attention",
      icon: AlertCircle,
      trend: "-3 from last week",
      color: "text-amber-600",
    },
  ]

  const recentTests = [
    {
      id: "test-001",
      name: "Massachusetts Volume Pricing Validation",
      type: "Basket Test",
      status: "completed",
      result: "passed",
      timestamp: "2 hours ago",
      duration: "1.2s",
    },
    {
      id: "test-002",
      name: "Incredibles Brand Discount Scenario",
      type: "Historical Test",
      status: "completed",
      result: "passed",
      timestamp: "4 hours ago",
      duration: "0.8s",
    },
    {
      id: "test-003",
      name: "Expiration Discount Edge Cases",
      type: "Scenario Test",
      status: "running",
      result: "pending",
      timestamp: "6 hours ago",
      duration: "running",
    },
  ]

  const getStatusBadge = (status: string, result: string) => {
    if (status === "running") {
      return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
    }
    if (result === "passed") {
      return <Badge className="bg-green-100 text-green-800">Passed</Badge>
    }
    if (result === "failed") {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    }
    return <Badge variant="outline">Pending</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Testing & Validation</h2>
          <p className="text-muted-foreground mt-2">Validate pricing scenarios and rules before deployment</p>
        </div>
        <Button className="bg-gti-green hover:bg-gti-green/90">
          <Plus className="h-4 w-4 mr-2" />
          New Test
        </Button>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              <p className="text-xs text-gti-green mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Test Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Activity</CardTitle>
          <CardDescription>Latest pricing validation tests and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gti-green/10 rounded-lg flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-gti-green" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{test.name}</div>
                    <div className="text-sm text-gray-600">
                      {test.type} • {test.timestamp}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{test.duration}</span>
                  {getStatusBadge(test.status, test.result)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testing Tools */}
      <Tabs defaultValue="basket-testing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basket-testing">Basket Testing</TabsTrigger>
          <TabsTrigger value="historical-testing">Historical Testing</TabsTrigger>
          <TabsTrigger value="scenario-testing">Scenario Testing</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
        </TabsList>

        <TabsContent value="basket-testing" className="space-y-4">
          <BasketTesting />
        </TabsContent>

        <TabsContent value="historical-testing" className="space-y-4">
          <HistoricalTesting />
        </TabsContent>

        <TabsContent value="scenario-testing" className="space-y-4">
          <ScenarioTesting />
        </TabsContent>

        <TabsContent value="test-results" className="space-y-4">
          <TestResults />
        </TabsContent>
      </Tabs>
    </div>
  )
}
