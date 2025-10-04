"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, AlertCircle, Clock } from "lucide-react"

interface Script {
  name: string
  description: string
  file: string
  order: number
  status: "pending" | "running" | "completed" | "error"
  output?: string
  error?: string
}

export function ScriptRunner() {
  const [scripts, setScripts] = useState<Script[]>([
    {
      name: "Price Tracking Tables",
      description: "Create price_sources and price_history tables",
      file: "001_create_price_tracking_tables.sql",
      order: 1,
      status: "pending",
    },
    {
      name: "Price Sources Seed Data",
      description: "Load initial price source competitors",
      file: "002_seed_price_sources.sql",
      order: 2,
      status: "pending",
    },
    {
      name: "Complete Database Setup",
      description: "Run all database setup scripts in proper order",
      file: "run_all_setup.sql",
      order: 3,
      status: "pending",
    },
    {
      name: "Seed Basic Data",
      description: "Load initial customer and product data",
      file: "run-seed-data.sql",
      order: 4,
      status: "pending",
    },
    {
      name: "Price Tracking Data",
      description: "Initialize price tracking and history",
      file: "seed_price_tracking_data.sql",
      order: 5,
      status: "pending",
    },
    {
      name: "Performance Monitoring",
      description: "Create performance monitoring and analytics tables",
      file: "015_create_performance_monitoring_tables.sql",
      order: 6,
      status: "pending",
    },
    {
      name: "CI Testing Infrastructure",
      description: "Create continuous integration testing infrastructure",
      file: "018_create_ci_testing_tables.sql",
      order: 7,
      status: "pending",
    },
    {
      name: "Integration Test Data",
      description: "Load comprehensive test data for validation",
      file: "019_create_final_integration_test_data.sql",
      order: 8,
      status: "pending",
    },
    {
      name: "B2B Customer Enhancement",
      description: "Add business fields for wholesale cannabis operations",
      file: "020_enhance_customers_b2b.sql",
      order: 9,
      status: "pending",
    },
    {
      name: "Tier Management Tables",
      description: "Create discount rules and tier assignment tables",
      file: "021_create_tier_management_tables.sql",
      order: 10,
      status: "pending",
    },
    {
      name: "Tier Management Seed Data",
      description: "Load sample tier management data",
      file: "022_seed_tier_management_data.sql",
      order: 11,
      status: "pending",
    },
  ])

  const runScript = async (scriptIndex: number) => {
    const newScripts = [...scripts]
    newScripts[scriptIndex].status = "running"
    newScripts[scriptIndex].output = ""
    newScripts[scriptIndex].error = ""
    setScripts(newScripts)

    try {
      console.log(`[v0] Executing script: ${newScripts[scriptIndex].file}`)

      const response = await fetch("/api/admin/execute-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scriptName: newScripts[scriptIndex].file,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        newScripts[scriptIndex].status = "completed"
        newScripts[scriptIndex].output = result.output || "Script executed successfully"
        console.log(`[v0] Script completed: ${newScripts[scriptIndex].file}`)
      } else {
        throw new Error(result.error || "Script execution failed")
      }
    } catch (error) {
      console.error(`[v0] Script execution error:`, error)
      newScripts[scriptIndex].status = "error"
      newScripts[scriptIndex].error = error instanceof Error ? error.message : "Unknown error occurred"
    }

    setScripts(newScripts)
  }

  const runAllScripts = async () => {
    for (let i = 0; i < scripts.length; i++) {
      await runScript(i)
    }
  }

  const getStatusIcon = (status: Script["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: Script["status"]) => {
    const variants = {
      pending: "secondary",
      running: "default",
      completed: "default",
      error: "destructive",
    } as const

    const colors = {
      pending: "bg-gray-100 text-gray-700",
      running: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Script Runner</h2>
          <p className="text-muted-foreground">Execute database setup and seeding scripts in the correct order</p>
        </div>
        <Button
          onClick={runAllScripts}
          disabled={scripts.some((s) => s.status === "running")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="h-4 w-4 mr-2" />
          Run All Scripts
        </Button>
      </div>

      <div className="grid gap-4">
        {scripts.map((script, index) => (
          <Card key={script.file}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(script.status)}
                  <div>
                    <CardTitle className="text-lg">{script.name}</CardTitle>
                    <CardDescription>{script.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(script.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runScript(index)}
                    disabled={script.status === "running"}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">
                <strong>File:</strong> scripts/{script.file}
              </div>
              {script.output && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  <strong>Output:</strong> {script.output}
                </div>
              )}
              {script.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <strong>Error:</strong> {script.error}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Execution Order</h3>
        <p className="text-sm text-blue-700">
          Scripts should be run in the order shown above to ensure proper database initialization and data
          relationships. The "Run All Scripts" button will execute them sequentially.
        </p>
      </div>
    </div>
  )
}
