/**
 * @task CS-005
 * @description Task-Code Linker UI - displays code changes linked to tasks
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCode, GitCommit, ExternalLink, Plus } from "lucide-react"

interface CodeChange {
  id: string
  file_path: string
  change_type: string
  lines_added: number
  lines_removed: number
  commit_sha: string
  commit_message: string
  author: string
  changed_at: string
  provider: string
}

interface TaskCodeLinkerProps {
  taskId: string
}

export function TaskCodeLinker({ taskId }: TaskCodeLinkerProps) {
  const [codeChanges, setCodeChanges] = useState<CodeChange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCodeChanges()
  }, [taskId])

  const fetchCodeChanges = async () => {
    try {
      const response = await fetch(`/api/user-stories/${taskId}/code-changes`)
      if (response.ok) {
        const data = await response.json()
        setCodeChanges(data)
      }
    } catch (error) {
      console.error("Failed to fetch code changes:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading code changes...</div>
  }

  if (codeChanges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No code changes linked to this task yet</p>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Link Files Manually
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalAdditions = codeChanges.reduce((sum, change) => sum + change.lines_added, 0)
  const totalDeletions = codeChanges.reduce((sum, change) => sum + change.lines_removed, 0)
  const uniqueFiles = new Set(codeChanges.map((c) => c.file_path)).size

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Files Changed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueFiles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lines Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalAdditions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lines Removed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-{totalDeletions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Code Changes List */}
      <Card>
        <CardHeader>
          <CardTitle>Code Changes</CardTitle>
          <CardDescription>Files and commits linked to this task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {codeChanges.map((change) => (
              <div key={change.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm font-mono">{change.file_path}</code>
                    <Badge variant="outline">{change.change_type}</Badge>
                    <Badge variant="secondary">{change.provider}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <GitCommit className="h-3 w-3" />
                    <span className="font-mono">{change.commit_sha.substring(0, 7)}</span>
                    <span>•</span>
                    <span>{change.commit_message.split("\n")[0]}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600">+{change.lines_added}</span>
                    <span className="text-red-600">-{change.lines_removed}</span>
                    <span className="text-muted-foreground">by {change.author}</span>
                    <span className="text-muted-foreground">{new Date(change.changed_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
