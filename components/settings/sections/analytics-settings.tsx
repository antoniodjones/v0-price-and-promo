"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { AnalyticsSettings } from "@/lib/settings"

interface AnalyticsSettingsProps {
  settings: { analytics: AnalyticsSettings }
  updateSetting: (path: string, value: any) => void
}

const availableWidgets = [
  { value: "pricing-trends", label: "Pricing Trends" },
  { value: "margin-analysis", label: "Margin Analysis" },
  { value: "discount-usage", label: "Discount Usage" },
  { value: "revenue-impact", label: "Revenue Impact" },
  { value: "competitor-comparison", label: "Competitor Comparison" },
]

export default function AnalyticsSettingsComponent({ settings, updateSetting }: AnalyticsSettingsProps) {
  const handleWidgetToggle = (widgetValue: string, checked: boolean) => {
    const currentWidgets = settings.analytics.dashboardPreferences.customWidgets
    if (checked) {
      updateSetting("analytics.dashboardPreferences.customWidgets", [...currentWidgets, widgetValue])
    } else {
      updateSetting(
        "analytics.dashboardPreferences.customWidgets",
        currentWidgets.filter((w) => w !== widgetValue),
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Preferences</CardTitle>
          <CardDescription>Configure dashboard display and refresh settings</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="defaultView">Default View</Label>
            <Select
              value={settings.analytics.dashboardPreferences.defaultView}
              onValueChange={(value) => updateSetting("analytics.dashboardPreferences.defaultView", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="pricing">Pricing Analysis</SelectItem>
                <SelectItem value="margins">Margin Analysis</SelectItem>
                <SelectItem value="discounts">Discount Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refreshInterval">Refresh Interval</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="refreshInterval"
                type="number"
                min="30"
                value={settings.analytics.dashboardPreferences.refreshInterval}
                onChange={(e) =>
                  updateSetting("analytics.dashboardPreferences.refreshInterval", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          </div>

          <div className="flex items-center justify-between col-span-2">
            <div className="space-y-0.5">
              <Label>Show Advanced Metrics</Label>
              <p className="text-sm text-muted-foreground">Display detailed analytics and KPIs</p>
            </div>
            <Switch
              checked={settings.analytics.dashboardPreferences.showAdvancedMetrics}
              onCheckedChange={(checked) =>
                updateSetting("analytics.dashboardPreferences.showAdvancedMetrics", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Widgets</CardTitle>
          <CardDescription>Select which widgets to display on the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableWidgets.map((widget) => (
              <div key={widget.value} className="flex items-center space-x-2">
                <Checkbox
                  id={widget.value}
                  checked={settings.analytics.dashboardPreferences.customWidgets.includes(widget.value)}
                  onCheckedChange={(checked) => handleWidgetToggle(widget.value, checked as boolean)}
                />
                <Label htmlFor={widget.value}>{widget.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Scheduling</CardTitle>
          <CardDescription>Configure automated report generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Scheduled Reports</Label>
              <p className="text-sm text-muted-foreground">Automatically generate and send reports</p>
            </div>
            <Switch
              checked={settings.analytics.reportScheduling.enabled}
              onCheckedChange={(checked) => updateSetting("analytics.reportScheduling.enabled", checked)}
            />
          </div>

          {settings.analytics.reportScheduling.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={settings.analytics.reportScheduling.frequency}
                    onValueChange={(value) => updateSetting("analytics.reportScheduling.frequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Report Format</Label>
                  <Select
                    value={settings.analytics.reportScheduling.format}
                    onValueChange={(value) => updateSetting("analytics.reportScheduling.format", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Charts</Label>
                  <p className="text-sm text-muted-foreground">Include visual charts in reports</p>
                </div>
                <Switch
                  checked={settings.analytics.reportScheduling.includeCharts}
                  onCheckedChange={(checked) => updateSetting("analytics.reportScheduling.includeCharts", checked)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Configure data export and retention settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Export</Label>
              <p className="text-sm text-muted-foreground">Automatically export data for backup</p>
            </div>
            <Switch
              checked={settings.analytics.dataExport.autoExport}
              onCheckedChange={(checked) => updateSetting("analytics.dataExport.autoExport", checked)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select
                value={settings.analytics.dataExport.exportFormat}
                onValueChange={(value) => updateSetting("analytics.dataExport.exportFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionDays">Retention Period</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="retentionDays"
                  type="number"
                  min="1"
                  value={settings.analytics.dataExport.retentionDays}
                  onChange={(e) => updateSetting("analytics.dataExport.retentionDays", Number.parseInt(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Include Raw Data</Label>
              <p className="text-sm text-muted-foreground">Include detailed transaction data in exports</p>
            </div>
            <Switch
              checked={settings.analytics.dataExport.includeRawData}
              onCheckedChange={(checked) => updateSetting("analytics.dataExport.includeRawData", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
