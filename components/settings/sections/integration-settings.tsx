"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { IntegrationSettings } from "@/lib/settings"

interface IntegrationSettingsProps {
  settings: { integrations: IntegrationSettings }
  updateSetting: (path: string, value: any) => void
}

export default function IntegrationSettingsComponent({ settings, updateSetting }: IntegrationSettingsProps) {
  return (
    <div className="space-y-6">
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
