"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, AlertCircle, Clock, Loader2 } from "lucide-react"

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
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadScripts = async () => {
      try {
        console.log("[v0] Loading scripts from API...")
        const response = await fetch("/api/admin/scripts/list")

        if (!response.ok) {
          throw new Error(`Failed to load scripts: ${response.statusText}`)
        }

        const data = await response.json()
        console.log(`[v0] Loaded ${data.scripts.length} scripts`)
        setScripts(data.scripts)
        setError(null)
      } catch (err) {
        console.error("[v0] Error loading scripts:", err)
        setError(err instanceof Error ? err.message : "Failed to load scripts")
      } finally {
        setLoading(false)
      }
    }

    loadScripts()
  }, [])

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading scripts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-900 mb-2">Error Loading Scripts</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Script Runner</h2>
          <p className="text-muted-foreground">
            Execute database setup and seeding scripts in the correct order ({scripts.length} scripts available)
          </p>
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
