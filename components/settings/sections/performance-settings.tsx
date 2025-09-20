"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { PerformanceSettings } from "@/lib/settings"

interface PerformanceSettingsProps {
  settings: { performance: PerformanceSettings }
  updateSetting: (path: string, value: any) => void
}

export default function PerformanceSettingsComponent({ settings, updateSetting }: PerformanceSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring</CardTitle>
          <CardDescription>Configure system performance monitoring thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Monitoring</Label>
              <p className="text-sm text-muted-foreground">Monitor system performance metrics</p>
            </div>
            <Switch
              checked={settings.performance.systemMonitoring.enableMonitoring}
              onCheckedChange={(checked) => updateSetting("performance.systemMonitoring.enableMonitoring", checked)}
            />
          </div>

          {settings.performance.systemMonitoring.enableMonitoring && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cpuThreshold">CPU Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="cpuThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.performance.systemMonitoring.cpuThreshold}
                    onChange={(e) =>
                      updateSetting("performance.systemMonitoring.cpuThreshold", Number.parseInt(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">Alert when CPU usage exceeds this threshold</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memoryThreshold">Memory Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="memoryThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.performance.systemMonitoring.memoryThreshold}
                    onChange={(e) =>
                      updateSetting("performance.systemMonitoring.memoryThreshold", Number.parseInt(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">Alert when memory usage exceeds this threshold</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diskThreshold">Disk Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="diskThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.performance.systemMonitoring.diskThreshold}
                    onChange={(e) =>
                      updateSetting("performance.systemMonitoring.diskThreshold", Number.parseInt(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">Alert when disk usage exceeds this threshold</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseTimeThreshold">Response Time Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="responseTimeThreshold"
                    type="number"
                    min="100"
                    value={settings.performance.systemMonitoring.responseTimeThreshold}
                    onChange={(e) =>
                      updateSetting(
                        "performance.systemMonitoring.responseTimeThreshold",
                        Number.parseInt(e.target.value),
                      )
                    }
                  />
                  <span className="text-sm text-muted-foreground">ms</span>
                </div>
                <p className="text-sm text-muted-foreground">Alert when response time exceeds this threshold</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto Scaling</CardTitle>
          <CardDescription>Configure automatic scaling based on load</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Scaling</Label>
              <p className="text-sm text-muted-foreground">Automatically scale resources based on demand</p>
            </div>
            <Switch
              checked={settings.performance.autoScaling.enabled}
              onCheckedChange={(checked) => updateSetting("performance.autoScaling.enabled", checked)}
            />
          </div>

          {settings.performance.autoScaling.enabled && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minInstances">Minimum Instances</Label>
                <Input
                  id="minInstances"
                  type="number"
                  min="1"
                  value={settings.performance.autoScaling.minInstances}
                  onChange={(e) =>
                    updateSetting("performance.autoScaling.minInstances", Number.parseInt(e.target.value))
                  }
                />
                <p className="text-sm text-muted-foreground">Minimum number of running instances</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxInstances">Maximum Instances</Label>
                <Input
                  id="maxInstances"
                  type="number"
                  min="1"
                  value={settings.performance.autoScaling.maxInstances}
                  onChange={(e) =>
                    updateSetting("performance.autoScaling.maxInstances", Number.parseInt(e.target.value))
                  }
                />
                <p className="text-sm text-muted-foreground">Maximum number of running instances</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scaleUpThreshold">Scale Up Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="scaleUpThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.performance.autoScaling.scaleUpThreshold}
                    onChange={(e) =>
                      updateSetting("performance.autoScaling.scaleUpThreshold", Number.parseInt(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">CPU threshold to trigger scaling up</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scaleDownThreshold">Scale Down Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="scaleDownThreshold"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.performance.autoScaling.scaleDownThreshold}
                    onChange={(e) =>
                      updateSetting("performance.autoScaling.scaleDownThreshold", Number.parseInt(e.target.value))
                    }
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-sm text-muted-foreground">CPU threshold to trigger scaling down</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Management</CardTitle>
          <CardDescription>Configure resource limits and caching</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxConcurrentRequests">Max Concurrent Requests</Label>
            <Input
              id="maxConcurrentRequests"
              type="number"
              min="1"
              value={settings.performance.resourceManagement.maxConcurrentRequests}
              onChange={(e) =>
                updateSetting("performance.resourceManagement.maxConcurrentRequests", Number.parseInt(e.target.value))
              }
            />
            <p className="text-sm text-muted-foreground">Maximum concurrent requests to handle</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestTimeout">Request Timeout</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="requestTimeout"
                type="number"
                min="1"
                value={settings.performance.resourceManagement.requestTimeout}
                onChange={(e) =>
                  updateSetting("performance.resourceManagement.requestTimeout", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum time to wait for request completion</p>
          </div>

          <div className="flex items-center justify-between col-span-2">
            <div className="space-y-0.5">
              <Label>Enable Caching</Label>
              <p className="text-sm text-muted-foreground">Use caching to improve performance</p>
            </div>
            <Switch
              checked={settings.performance.resourceManagement.cacheEnabled}
              onCheckedChange={(checked) => updateSetting("performance.resourceManagement.cacheEnabled", checked)}
            />
          </div>

          {settings.performance.resourceManagement.cacheEnabled && (
            <div className="space-y-2 col-span-2">
              <Label htmlFor="cacheTTL">Cache TTL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="cacheTTL"
                  type="number"
                  min="1"
                  value={settings.performance.resourceManagement.cacheTTL}
                  onChange={(e) =>
                    updateSetting("performance.resourceManagement.cacheTTL", Number.parseInt(e.target.value))
                  }
                />
                <span className="text-sm text-muted-foreground">seconds</span>
              </div>
              <p className="text-sm text-muted-foreground">How long to keep items in cache</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
