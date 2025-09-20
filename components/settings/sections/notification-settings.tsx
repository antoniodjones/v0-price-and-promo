"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { NotificationSettings } from "@/lib/settings"

interface NotificationSettingsProps {
  settings: { notifications: NotificationSettings }
  updateSetting: (path: string, value: any) => void
}

export default function NotificationSettingsComponent({ settings, updateSetting }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>Configure when to send notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
            </div>
            <Switch
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(checked) => updateSetting("notifications.emailAlerts", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lowMarginThreshold">Low Margin Alert Threshold</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="lowMarginThreshold"
                type="number"
                min="0"
                max="100"
                value={settings.notifications.lowMarginThreshold}
                onChange={(e) => updateSetting("notifications.lowMarginThreshold", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Alert when margin falls below this percentage</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Failed Test Alerts</Label>
              <p className="text-sm text-muted-foreground">Notify when pricing tests fail</p>
            </div>
            <Switch
              checked={settings.notifications.failedTestAlerts}
              onCheckedChange={(checked) => updateSetting("notifications.failedTestAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Approval Requests</Label>
              <p className="text-sm text-muted-foreground">Notify managers of pending approvals</p>
            </div>
            <Switch
              checked={settings.notifications.approvalRequests}
              onCheckedChange={(checked) => updateSetting("notifications.approvalRequests", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
          <CardDescription>Configure automated reporting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reports</Label>
              <p className="text-sm text-muted-foreground">Send daily pricing summary reports</p>
            </div>
            <Switch
              checked={settings.notifications.dailyReports}
              onCheckedChange={(checked) => updateSetting("notifications.dailyReports", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Send weekly performance reports</p>
            </div>
            <Switch
              checked={settings.notifications.weeklyReports}
              onCheckedChange={(checked) => updateSetting("notifications.weeklyReports", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportEmail">Report Email Address</Label>
            <Input
              id="reportEmail"
              type="email"
              value={settings.notifications.reportEmail}
              onChange={(e) => updateSetting("notifications.reportEmail", e.target.value)}
              placeholder="reports@company.com"
            />
            <p className="text-sm text-muted-foreground">Email address for automated reports</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvalEmail">Approval Email Address</Label>
            <Input
              id="approvalEmail"
              type="email"
              value={settings.notifications.approvalEmail}
              onChange={(e) => updateSetting("notifications.approvalEmail", e.target.value)}
              placeholder="approvals@company.com"
            />
            <p className="text-sm text-muted-foreground">Email address for approval notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
