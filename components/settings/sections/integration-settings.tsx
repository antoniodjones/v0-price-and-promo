"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Copy, RefreshCw, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IntegrationSettings } from "@/lib/settings"

interface IntegrationSettingsProps {
  settings: { integrations: IntegrationSettings }
  updateSetting: (path: string, value: any) => void
}

export default function IntegrationSettingsComponent({ settings, updateSetting }: IntegrationSettingsProps) {
  const [jiraStatus, setJiraStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [gitlabStatus, setGitlabStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [githubStatus, setGithubStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [syncing, setSyncing] = useState(false)

  const testJiraConnection = async () => {
    setJiraStatus("testing")
    try {
      const response = await fetch("/api/jira/test-connection")
      if (response.ok) {
        setJiraStatus("success")
      } else {
        setJiraStatus("error")
      }
    } catch (error) {
      setJiraStatus("error")
    }
  }

  const testGitLabConnection = async () => {
    setGitlabStatus("testing")
    try {
      const response = await fetch("/api/git-provider/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "gitlab" }),
      })
      if (response.ok) {
        setGitlabStatus("success")
      } else {
        setGitlabStatus("error")
      }
    } catch (error) {
      setGitlabStatus("error")
    }
  }

  const testGitHubConnection = async () => {
    setGithubStatus("testing")
    try {
      const response = await fetch("/api/git-provider/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "github" }),
      })
      if (response.ok) {
        setGithubStatus("success")
      } else {
        setGithubStatus("error")
      }
    } catch (error) {
      setGithubStatus("error")
    }
  }

  const triggerManualSync = async () => {
    setSyncing(true)
    try {
      await fetch("/api/jira/sync", { method: "POST" })
    } finally {
      setSyncing(false)
    }
  }

  const copyWebhookUrl = (type: "jira" | "gitlab" | "github") => {
    const baseUrl = window.location.origin
    const url = `${baseUrl}/api/webhooks/${type}`
    navigator.clipboard.writeText(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jira Integration</CardTitle>
              <CardDescription>Connect to Jira for bidirectional task synchronization</CardDescription>
            </div>
            {getStatusIcon(jiraStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jiraBaseUrl">Jira Base URL</Label>
            <Input
              id="jiraBaseUrl"
              type="url"
              placeholder="https://yourcompany.atlassian.net"
              defaultValue={process.env.NEXT_PUBLIC_JIRA_BASE_URL}
            />
            <p className="text-sm text-muted-foreground">Your Jira instance URL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jiraProjectKey">Project Key</Label>
            <Input id="jiraProjectKey" placeholder="PRICE" defaultValue={process.env.NEXT_PUBLIC_JIRA_PROJECT_KEY} />
            <p className="text-sm text-muted-foreground">Default Jira project key</p>
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/jira`}
                readOnly
              />
              <Button variant="outline" size="icon" onClick={() => copyWebhookUrl("jira")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Configure this URL in Jira webhook settings</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={testJiraConnection} disabled={jiraStatus === "testing"}>
              {jiraStatus === "testing" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Connection
            </Button>
            <Button variant="outline" onClick={triggerManualSync} disabled={syncing}>
              {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Sync Now
            </Button>
            <Button variant="ghost" asChild>
              <a href="/docs/WEBHOOK_CONFIGURATION_GUIDE.md" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Setup Guide
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>GitLab Integration</CardTitle>
              <CardDescription>Connect to GitLab for code change tracking</CardDescription>
            </div>
            {getStatusIcon(gitlabStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gitlabProjectId">Project ID</Label>
            <Input
              id="gitlabProjectId"
              placeholder="Green_Thumb/ecom/v0-price-and-promo"
              defaultValue="Green_Thumb/ecom/v0-price-and-promo"
            />
            <p className="text-sm text-muted-foreground">GitLab project path</p>
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/gitlab`}
                readOnly
              />
              <Button variant="outline" size="icon" onClick={() => copyWebhookUrl("gitlab")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Configure this URL in GitLab webhook settings</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={testGitLabConnection} disabled={gitlabStatus === "testing"}>
              {gitlabStatus === "testing" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test Connection
            </Button>
            <Button variant="ghost" asChild>
              <a
                href="https://gitlab.com/Green_Thumb/ecom/v0-price-and-promo/-/settings/integrations"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Configure in GitLab
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>GitHub Integration</CardTitle>
              <CardDescription>Connect to GitHub for code change tracking</CardDescription>
            </div>
            {getStatusIcon(githubStatus)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Already Configured</Badge>
            <span className="text-sm text-muted-foreground">GitHub webhook is active</span>
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/github`}
                readOnly
              />
              <Button variant="outline" size="icon" onClick={() => copyWebhookUrl("github")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button onClick={testGitHubConnection} disabled={githubStatus === "testing"}>
            {githubStatus === "testing" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Test Connection
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Connections</CardTitle>
          <CardDescription>Configure external API integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable API Connections</Label>
              <p className="text-sm text-muted-foreground">Allow connections to external APIs</p>
            </div>
            <Switch
              checked={settings.integrations.apiConnections.enabled}
              onCheckedChange={(checked) => updateSetting("integrations.apiConnections.enabled", checked)}
            />
          </div>

          {settings.integrations.apiConnections.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  type="url"
                  value={settings.integrations.apiConnections.baseUrl}
                  onChange={(e) => updateSetting("integrations.apiConnections.baseUrl", e.target.value)}
                  placeholder="https://api.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.integrations.apiConnections.apiKey}
                  onChange={(e) => updateSetting("integrations.apiConnections.apiKey", e.target.value)}
                  placeholder="Enter API key"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="timeout"
                      type="number"
                      min="1"
                      value={settings.integrations.apiConnections.timeout}
                      onChange={(e) =>
                        updateSetting("integrations.apiConnections.timeout", Number.parseInt(e.target.value))
                      }
                    />
                    <span className="text-sm text-muted-foreground">seconds</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    min="0"
                    max="10"
                    value={settings.integrations.apiConnections.retryAttempts}
                    onChange={(e) =>
                      updateSetting("integrations.apiConnections.retryAttempts", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhook notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Webhooks</Label>
              <p className="text-sm text-muted-foreground">Send webhook notifications for events</p>
            </div>
            <Switch
              checked={settings.integrations.webhooks.enabled}
              onCheckedChange={(checked) => updateSetting("integrations.webhooks.enabled", checked)}
            />
          </div>

          {settings.integrations.webhooks.enabled && (
            <div className="space-y-2">
              <Label htmlFor="secretKey">Webhook Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                value={settings.integrations.webhooks.secretKey}
                onChange={(e) => updateSetting("integrations.webhooks.secretKey", e.target.value)}
                placeholder="Enter webhook secret"
              />
              <p className="text-sm text-muted-foreground">Secret key for webhook authentication</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External Data Sources</CardTitle>
          <CardDescription>Configure data synchronization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Inventory Sync</Label>
              <p className="text-sm text-muted-foreground">Sync inventory data from external systems</p>
            </div>
            <Switch
              checked={settings.integrations.externalDataSources.inventorySync}
              onCheckedChange={(checked) => updateSetting("integrations.externalDataSources.inventorySync", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Price Feeds</Label>
              <p className="text-sm text-muted-foreground">Import pricing data from external feeds</p>
            </div>
            <Switch
              checked={settings.integrations.externalDataSources.priceFeeds}
              onCheckedChange={(checked) => updateSetting("integrations.externalDataSources.priceFeeds", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Data</Label>
              <p className="text-sm text-muted-foreground">Import market and competitor data</p>
            </div>
            <Switch
              checked={settings.integrations.externalDataSources.marketData}
              onCheckedChange={(checked) => updateSetting("integrations.externalDataSources.marketData", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="syncInterval">Sync Interval</Label>
            <Select
              value={settings.integrations.externalDataSources.syncInterval}
              onValueChange={(value) => updateSetting("integrations.externalDataSources.syncInterval", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="manual">Manual Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
