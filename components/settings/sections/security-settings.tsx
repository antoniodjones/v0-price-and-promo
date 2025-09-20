"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { SecuritySettings } from "@/lib/settings"

interface SecuritySettingsProps {
  settings: { security: SecuritySettings }
  updateSetting: (path: string, value: any) => void
}

export default function SecuritySettingsComponent({ settings, updateSetting }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Configure authentication and session security</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                value={settings.security.authentication.sessionTimeout}
                onChange={(e) =>
                  updateSetting("security.authentication.sessionTimeout", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              min="1"
              max="10"
              value={settings.security.authentication.maxLoginAttempts}
              onChange={(e) =>
                updateSetting("security.authentication.maxLoginAttempts", Number.parseInt(e.target.value))
              }
            />
            <p className="text-sm text-muted-foreground">Maximum failed login attempts before lockout</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lockoutDuration">Lockout Duration</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="lockoutDuration"
                type="number"
                min="1"
                value={settings.security.authentication.lockoutDuration}
                onChange={(e) =>
                  updateSetting("security.authentication.lockoutDuration", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-sm text-muted-foreground">Account lockout duration after failed attempts</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordChangeInterval">Password Change Interval</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="passwordChangeInterval"
                type="number"
                min="30"
                value={settings.security.authentication.passwordChangeInterval}
                onChange={(e) =>
                  updateSetting("security.authentication.passwordChangeInterval", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground">Required password change frequency</p>
          </div>

          <div className="flex items-center justify-between col-span-2">
            <div className="space-y-0.5">
              <Label>Require Password Change</Label>
              <p className="text-sm text-muted-foreground">Force users to change passwords periodically</p>
            </div>
            <Switch
              checked={settings.security.authentication.requirePasswordChange}
              onCheckedChange={(checked) => updateSetting("security.authentication.requirePasswordChange", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>Configure network and access security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
            </div>
            <Switch
              checked={settings.security.accessControl.enableIPWhitelist}
              onCheckedChange={(checked) => updateSetting("security.accessControl.enableIPWhitelist", checked)}
            />
          </div>

          {settings.security.accessControl.enableIPWhitelist && (
            <div className="space-y-2">
              <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
              <Textarea
                id="allowedIPs"
                value={settings.security.accessControl.allowedIPs.join("\n")}
                onChange={(e) =>
                  updateSetting("security.accessControl.allowedIPs", e.target.value.split("\n").filter(Boolean))
                }
                placeholder="192.168.1.1&#10;10.0.0.0/8&#10;172.16.0.0/12"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">One IP address or CIDR block per line</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require SSL</Label>
              <p className="text-sm text-muted-foreground">Force HTTPS connections only</p>
            </div>
            <Switch
              checked={settings.security.accessControl.requireSSL}
              onCheckedChange={(checked) => updateSetting("security.accessControl.requireSSL", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Audit Log</Label>
              <p className="text-sm text-muted-foreground">Log all user actions for security auditing</p>
            </div>
            <Switch
              checked={settings.security.accessControl.enableAuditLog}
              onCheckedChange={(checked) => updateSetting("security.accessControl.enableAuditLog", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Protection</CardTitle>
          <CardDescription>Configure data encryption and backup security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Encrypt Sensitive Data</Label>
              <p className="text-sm text-muted-foreground">Encrypt sensitive data at rest</p>
            </div>
            <Switch
              checked={settings.security.dataProtection.encryptSensitiveData}
              onCheckedChange={(checked) => updateSetting("security.dataProtection.encryptSensitiveData", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataRetentionDays">Data Retention Period</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="dataRetentionDays"
                type="number"
                min="30"
                value={settings.security.dataProtection.dataRetentionDays}
                onChange={(e) =>
                  updateSetting("security.dataProtection.dataRetentionDays", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground">How long to retain user data</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup data</p>
            </div>
            <Switch
              checked={settings.security.dataProtection.enableBackups}
              onCheckedChange={(checked) => updateSetting("security.dataProtection.enableBackups", checked)}
            />
          </div>

          {settings.security.dataProtection.enableBackups && (
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Backup Frequency</Label>
              <Select
                value={settings.security.dataProtection.backupFrequency}
                onValueChange={(value) => updateSetting("security.dataProtection.backupFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
