"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { ExpirationSettings } from "@/lib/settings"

interface ExpirationSettingsProps {
  settings: { expiration: ExpirationSettings }
  updateSetting: (path: string, value: any) => void
}

export default function ExpirationSettingsComponent({ settings, updateSetting }: ExpirationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expiration Thresholds</CardTitle>
          <CardDescription>Configure when to apply expiration discounts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="warningDays">Warning Period</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="warningDays"
                type="number"
                min="1"
                value={settings.expiration.warningDays}
                onChange={(e) => updateSetting("expiration.warningDays", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground">Days before expiration to start warning discounts</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalDays">Critical Period</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="criticalDays"
                type="number"
                min="1"
                value={settings.expiration.criticalDays}
                onChange={(e) => updateSetting("expiration.criticalDays", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground">Days before expiration for critical discounts</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warningDiscount">Warning Discount</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="warningDiscount"
                type="number"
                min="0"
                max="100"
                value={settings.expiration.warningDiscount}
                onChange={(e) => updateSetting("expiration.warningDiscount", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Discount percentage during warning period</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalDiscount">Critical Discount</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="criticalDiscount"
                type="number"
                min="0"
                max="100"
                value={settings.expiration.criticalDiscount}
                onChange={(e) => updateSetting("expiration.criticalDiscount", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Discount percentage during critical period</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Settings</CardTitle>
          <CardDescription>Configure automatic discount application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Apply Expiration Discounts</Label>
              <p className="text-sm text-muted-foreground">Automatically apply discounts when thresholds are reached</p>
            </div>
            <Switch
              checked={settings.expiration.autoApply}
              onCheckedChange={(checked) => updateSetting("expiration.autoApply", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email alerts when expiration discounts are applied</p>
            </div>
            <Switch
              checked={settings.expiration.emailNotifications}
              onCheckedChange={(checked) => updateSetting("expiration.emailNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
