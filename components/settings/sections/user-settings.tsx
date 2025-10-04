"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Shield, Mail } from "lucide-react"
import type { Settings } from "@/lib/settings"

interface UserSettingsProps {
  settings: Settings
  updateSetting: (key: string, value: any) => void
}

export default function UserSettings({ settings, updateSetting }: UserSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <p className="text-muted-foreground">Manage internal users and permissions for this application</p>
      </div>

      {/* User Access Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-gti-green" />
            <CardTitle>Access Control</CardTitle>
          </div>
          <CardDescription>Configure user access and permission settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Admin Approval</Label>
              <p className="text-sm text-muted-foreground">New users must be approved by an administrator</p>
            </div>
            <Switch
              checked={settings.userManagement?.requireAdminApproval ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.requireAdminApproval", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Role-Based Access Control</Label>
              <p className="text-sm text-muted-foreground">Enable role-based permissions for users</p>
            </div>
            <Switch
              checked={settings.userManagement?.enableRBAC ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.enableRBAC", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out inactive users</p>
            </div>
            <Switch
              checked={settings.userManagement?.sessionTimeout ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.sessionTimeout", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Session Duration (minutes)</Label>
            <Input
              type="number"
              value={settings.userManagement?.sessionDuration ?? 60}
              onChange={(e) => updateSetting("userManagement.sessionDuration", Number.parseInt(e.target.value))}
              min={15}
              max={480}
            />
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gti-green" />
            <CardTitle>User Roles</CardTitle>
          </div>
          <CardDescription>Define and manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Administrator</div>
                <p className="text-sm text-muted-foreground">Full system access and user management</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Manager</div>
                <p className="text-sm text-muted-foreground">Can manage pricing and promotions</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Analyst</div>
                <p className="text-sm text-muted-foreground">Read-only access to reports and analytics</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Viewer</div>
                <p className="text-sm text-muted-foreground">Limited read-only access</p>
              </div>
              <Badge variant="secondary">Inactive</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            <UserPlus className="mr-2 h-4 w-4" />
            Configure Roles
          </Button>
        </CardContent>
      </Card>

      {/* User Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gti-green" />
            <CardTitle>User Notifications</CardTitle>
          </div>
          <CardDescription>Configure notifications for user account events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Welcome Email</Label>
              <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
            </div>
            <Switch
              checked={settings.userManagement?.sendWelcomeEmail ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.sendWelcomeEmail", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Password Reset Notifications</Label>
              <p className="text-sm text-muted-foreground">Notify users of password changes</p>
            </div>
            <Switch
              checked={settings.userManagement?.passwordResetNotifications ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.passwordResetNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Account Activity Alerts</Label>
              <p className="text-sm text-muted-foreground">Alert users of suspicious activity</p>
            </div>
            <Switch
              checked={settings.userManagement?.activityAlerts ?? true}
              onCheckedChange={(checked) => updateSetting("userManagement.activityAlerts", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* User Directory */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory Integration</CardTitle>
          <CardDescription>Connect to your organization's user directory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Directory Type</Label>
            <Input placeholder="e.g., Active Directory, LDAP, Azure AD" disabled />
          </div>

          <div className="space-y-2">
            <Label>Directory URL</Label>
            <Input placeholder="ldap://directory.company.com" disabled />
          </div>

          <Button variant="outline" disabled>
            Configure Directory Integration
          </Button>
          <p className="text-xs text-muted-foreground">
            Contact your system administrator to configure directory integration
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
