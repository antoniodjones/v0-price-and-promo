"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"

export default function IntegrationsPage() {
  const [jiraStatus, setJiraStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [gitlabStatus, setGitlabStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    checkConnections()
    fetchSyncStatus()
  }, [])

  const checkConnections = async () => {
    // Check Jira
    try {
      const jiraRes = await fetch("/api/jira/test-connection")
      const jiraData = await jiraRes.json()
      setJiraStatus(jiraData.success ? "connected" : "disconnected")
    } catch {
      setJiraStatus("disconnected")
    }

    // Check GitLab
    try {
      const gitlabRes = await fetch("/api/gitlab/test-connection")
      const gitlabData = await gitlabRes.json()
      setGitlabStatus(gitlabData.success ? "connected" : "disconnected")
    } catch {
      setGitlabStatus("disconnected")
    }
  }

  const fetchSyncStatus = async () => {
    try {
      const res = await fetch("/api/jira/sync")
      const data = await res.json()
      setSyncStatus(data)
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    }
  }

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/jira/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      alert(`Synced ${data.synced} stories successfully`)
      await fetchSyncStatus()
    } catch (error) {
      alert("Sync failed: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setSyncing(false)
    }
  }

  const StatusBadge = ({ status }: { status: "checking" | "connected" | "disconnected" }) => {
    if (status === "checking") {
      return (
        <Badge variant="outline">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      )
    }
    if (status === "connected") {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      )
    }
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Disconnected
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Manage Jira and GitLab integrations</p>
      </div>

      <Tabs defaultValue="jira" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jira">Jira</TabsTrigger>
          <TabsTrigger value="gitlab">GitLab</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
        </TabsList>

        <TabsContent value="jira" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Jira Configuration</CardTitle>
                  <CardDescription>Configure Jira integration for bidirectional sync</CardDescription>
                </div>
                <StatusBadge status={jiraStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jira-url">Jira Base URL</Label>
                <Input
                  id="jira-url"
                  placeholder="https://yourcompany.atlassian.net"
                  defaultValue={process.env.NEXT_PUBLIC_JIRA_BASE_URL}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Configure via environment variable: JIRA_BASE_URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jira-email">Email</Label>
                <Input id="jira-email" type="email" placeholder="your-email@company.com" disabled />
                <p className="text-sm text-muted-foreground">Configure via environment variable: JIRA_EMAIL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jira-token">API Token</Label>
                <Input id="jira-token" type="password" placeholder="••••••••••••••••" disabled />
                <p className="text-sm text-muted-foreground">Configure via environment variable: JIRA_API_TOKEN</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jira-project">Project Key</Label>
                <Input
                  id="jira-project"
                  placeholder="PRICE"
                  defaultValue={process.env.NEXT_PUBLIC_JIRA_PROJECT_KEY}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Configure via environment variable: JIRA_PROJECT_KEY</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label>Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync changes via webhooks</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={checkConnections} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gitlab" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>GitLab Configuration</CardTitle>
                  <CardDescription>Configure GitLab integration for code tracking</CardDescription>
                </div>
                <StatusBadge status={gitlabStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gitlab-url">GitLab Base URL</Label>
                <Input id="gitlab-url" placeholder="https://gitlab.com" defaultValue="https://gitlab.com" disabled />
                <p className="text-sm text-muted-foreground">Configure via environment variable: GITLAB_BASE_URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gitlab-token">Personal Access Token</Label>
                <Input id="gitlab-token" type="password" placeholder="••••••••••••••••" disabled />
                <p className="text-sm text-muted-foreground">Configure via environment variable: GITLAB_TOKEN</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gitlab-project">Project ID</Label>
                <Input
                  id="gitlab-project"
                  placeholder="Green_Thumb/ecom/v0-price-and-promo"
                  defaultValue="Green_Thumb/ecom/v0-price-and-promo"
                  disabled
                />
                <p className="text-sm text-muted-foreground">Configure via environment variable: GITLAB_PROJECT_ID</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <Label>Webhook Processing</Label>
                  <p className="text-sm text-muted-foreground">Process push events and link commits to tasks</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button onClick={checkConnections} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sync Status</CardTitle>
                  <CardDescription>Monitor Jira synchronization status</CardDescription>
                </div>
                <Button onClick={handleManualSync} disabled={syncing}>
                  {syncing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {syncStatus && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Pending Stories</Label>
                      <div className="text-2xl font-bold">{syncStatus.pendingCount || 0}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Recent Syncs</Label>
                      <div className="text-2xl font-bold">{syncStatus.recentLogs?.length || 0}</div>
                    </div>
                  </div>

                  {syncStatus.recentLogs && syncStatus.recentLogs.length > 0 && (
                    <div className="space-y-2">
                      <Label>Recent Sync Operations</Label>
                      <div className="space-y-2">
                        {syncStatus.recentLogs.slice(0, 10).map((log: any) => (
                          <div key={log.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {log.sync_status === "success" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium">{log.jira_issue_key || log.task_id}</span>
                              <Badge variant="outline">{log.sync_type}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.synced_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
