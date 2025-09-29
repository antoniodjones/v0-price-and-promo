"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Eye, EyeOff, RefreshCw, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SSOConfig {
  enabled: boolean
  webhookUrl: string
  webhookSecret: string
  autoProvision: boolean
  defaultRole: string
  syncInterval: number
}

interface APIConfig {
  enabled: boolean
  apiKey: string
  rateLimitEnabled: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  allowBulkOperations: boolean
  requireApiKeyForBulk: boolean
}

export function SSOAPISettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [ssoConfig, setSSOConfig] = useState<SSOConfig>({
    enabled: false,
    webhookUrl: "",
    webhookSecret: "",
    autoProvision: true,
    defaultRole: "user",
    syncInterval: 300,
  })
  const [apiConfig, setAPIConfig] = useState<APIConfig>({
    enabled: true,
    apiKey: "",
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 3600,
    allowBulkOperations: true,
    requireApiKeyForBulk: true,
  })

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      const response = await fetch("/api/settings/sso-api")
      if (response.ok) {
        const data = await response.json()
        setSSOConfig(data.sso || ssoConfig)
        setAPIConfig(data.api || apiConfig)
      }
    } catch (error) {
      console.error("Failed to load configuration:", error)
    }
  }

  const saveConfiguration = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/settings/sso-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sso: ssoConfig, api: apiConfig }),
      })

      if (response.ok) {
        toast({
          title: "Configuration saved",
          description: "SSO and API settings have been updated successfully.",
        })
      } else {
        throw new Error("Failed to save configuration")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateApiKey = () => {
    const newKey =
      "gti_" +
      Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    setAPIConfig((prev) => ({ ...prev, apiKey: newKey }))
  }

  const generateWebhookSecret = () => {
    const newSecret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setSSOConfig((prev) => ({ ...prev, webhookSecret: newSecret }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    })
  }

  const testWebhook = async () => {
    if (!ssoConfig.webhookUrl) return

    setLoading(true)
    try {
      const response = await fetch("/api/settings/sso-api/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ssoConfig.webhookUrl, secret: ssoConfig.webhookSecret }),
      })

      if (response.ok) {
        toast({
          title: "Webhook test successful",
          description: "The webhook endpoint is responding correctly.",
        })
      } else {
        throw new Error("Webhook test failed")
      }
    } catch (error) {
      toast({
        title: "Webhook test failed",
        description: "Could not reach the webhook endpoint.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">SSO & API Configuration</h2>
        <p className="text-sm mt-1">
          Configure Single Sign-On integration and API access for automated user management.
        </p>
      </div>

      <Tabs defaultValue="sso" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sso">SSO Configuration</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="sso" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Single Sign-On Integration
                <Badge variant={ssoConfig.enabled ? "default" : "secondary"}>
                  {ssoConfig.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Configure SSO webhook integration for automated user provisioning and synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={ssoConfig.enabled}
                  onCheckedChange={(checked) => setSSOConfig((prev) => ({ ...prev, enabled: checked }))}
                />
                <Label>Enable SSO Integration</Label>
              </div>

              {ssoConfig.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://your-sso-provider.com/webhook"
                      value={ssoConfig.webhookUrl}
                      onChange={(e) => setSSOConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    />
                    <p className="text-xs">The URL where your SSO provider will send user events.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Webhook Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-secret"
                        type={showSecrets ? "text" : "password"}
                        value={ssoConfig.webhookSecret}
                        onChange={(e) => setSSOConfig((prev) => ({ ...prev, webhookSecret: e.target.value }))}
                        placeholder="Enter webhook secret"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowSecrets(!showSecrets)}>
                        {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={generateWebhookSecret}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(ssoConfig.webhookSecret, "Webhook secret")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={ssoConfig.autoProvision}
                      onCheckedChange={(checked) => setSSOConfig((prev) => ({ ...prev, autoProvision: checked }))}
                    />
                    <Label>Auto-provision new users</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default Role for New Users</Label>
                    <select
                      id="default-role"
                      className="w-full p-2 border rounded-md"
                      value={ssoConfig.defaultRole}
                      onChange={(e) => setSSOConfig((prev) => ({ ...prev, defaultRole: e.target.value }))}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Sync Interval (seconds)</Label>
                    <Input
                      id="sync-interval"
                      type="number"
                      min="60"
                      max="3600"
                      value={ssoConfig.syncInterval}
                      onChange={(e) =>
                        setSSOConfig((prev) => ({ ...prev, syncInterval: Number.parseInt(e.target.value) }))
                      }
                    />
                    <p className="text-xs">How often to sync user data from SSO provider (60-3600 seconds).</p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={testWebhook} variant="outline" disabled={loading || !ssoConfig.webhookUrl}>
                      Test Webhook
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                API Configuration
                <Badge variant={apiConfig.enabled ? "default" : "secondary"}>
                  {apiConfig.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>Configure API access and rate limiting for automated user management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={apiConfig.enabled}
                  onCheckedChange={(checked) => setAPIConfig((prev) => ({ ...prev, enabled: checked }))}
                />
                <Label>Enable API Access</Label>
              </div>

              {apiConfig.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type={showSecrets ? "text" : "password"}
                        value={apiConfig.apiKey}
                        onChange={(e) => setAPIConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="API key for authentication"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowSecrets(!showSecrets)}>
                        {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={generateApiKey}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(apiConfig.apiKey, "API key")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={apiConfig.rateLimitEnabled}
                      onCheckedChange={(checked) => setAPIConfig((prev) => ({ ...prev, rateLimitEnabled: checked }))}
                    />
                    <Label>Enable Rate Limiting</Label>
                  </div>

                  {apiConfig.rateLimitEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate-limit-requests">Requests per Window</Label>
                        <Input
                          id="rate-limit-requests"
                          type="number"
                          min="1"
                          max="10000"
                          value={apiConfig.rateLimitRequests}
                          onChange={(e) =>
                            setAPIConfig((prev) => ({ ...prev, rateLimitRequests: Number.parseInt(e.target.value) }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rate-limit-window">Window (seconds)</Label>
                        <Input
                          id="rate-limit-window"
                          type="number"
                          min="60"
                          max="86400"
                          value={apiConfig.rateLimitWindow}
                          onChange={(e) =>
                            setAPIConfig((prev) => ({ ...prev, rateLimitWindow: Number.parseInt(e.target.value) }))
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={apiConfig.allowBulkOperations}
                      onCheckedChange={(checked) => setAPIConfig((prev) => ({ ...prev, allowBulkOperations: checked }))}
                    />
                    <Label>Allow Bulk Operations</Label>
                  </div>

                  {apiConfig.allowBulkOperations && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={apiConfig.requireApiKeyForBulk}
                        onCheckedChange={(checked) =>
                          setAPIConfig((prev) => ({ ...prev, requireApiKeyForBulk: checked }))
                        }
                      />
                      <Label>Require API Key for Bulk Operations</Label>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available API Endpoints</CardTitle>
              <CardDescription>Documentation for user management API endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/api/users</code>
                  </div>
                  <p className="text-sm">List all users with optional filtering and pagination.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="text-sm">/api/users</code>
                  </div>
                  <p className="text-sm">Create a new user.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="text-sm">/api/users/bulk</code>
                  </div>
                  <p className="text-sm">Create, update, or delete multiple users in a single request.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="text-sm">/api/users/sync</code>
                  </div>
                  <p className="text-sm">Synchronize users from external SSO provider.</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">POST</Badge>
                    <code className="text-sm">/api/users/webhook</code>
                  </div>
                  <p className="text-sm">Webhook endpoint for receiving SSO user events.</p>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  All API endpoints require authentication. Include the API key in the Authorization header:
                  <code className="ml-1">Authorization: Bearer your-api-key</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveConfiguration} disabled={loading}>
          {loading ? "Saving..." : "Save Configuration"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
