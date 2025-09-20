"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserManagementSettings } from "@/lib/settings"

interface UserSettingsProps {
  settings: { userManagement: UserManagementSettings }
  updateSetting: (path: string, value: any) => void
}

export default function UserSettingsComponent({ settings, updateSetting }: UserSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Permissions</CardTitle>
          <CardDescription>Configure user roles and permission management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Role-Based Permissions</Label>
              <p className="text-sm text-muted-foreground">Use role-based access control for users</p>
            </div>
            <Switch
              checked={settings.userManagement.roleBasedPermissions.enabled}
              onCheckedChange={(checked) => updateSetting("userManagement.roleBasedPermissions.enabled", checked)}
            />
          </div>

          {settings.userManagement.roleBasedPermissions.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="defaultRole">Default Role</Label>
                <Select
                  value={settings.userManagement.roleBasedPermissions.defaultRole}
                  onValueChange={(value) => updateSetting("userManagement.roleBasedPermissions.defaultRole", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Default role assigned to new users</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval for New Users</Label>
                  <p className="text-sm text-muted-foreground">New users need admin approval before access</p>
                </div>
                <Switch
                  checked={settings.userManagement.roleBasedPermissions.requireApproval}
                  onCheckedChange={(checked) =>
                    updateSetting("userManagement.roleBasedPermissions.requireApproval", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Access</CardTitle>
          <CardDescription>Configure team size and access controls</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxUsers">Maximum Users</Label>
            <Input
              id="maxUsers"
              type="number"
              min="1"
              value={settings.userManagement.teamAccess.maxUsers}
              onChange={(e) => updateSetting("userManagement.teamAccess.maxUsers", Number.parseInt(e.target.value))}
            />
            <p className="text-sm text-muted-foreground">Maximum number of users allowed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="sessionTimeout"
                type="number"
                min="5"
                value={settings.userManagement.teamAccess.sessionTimeout}
                onChange={(e) =>
                  updateSetting("userManagement.teamAccess.sessionTimeout", Number.parseInt(e.target.value))
                }
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
          </div>

          <div className="flex items-center justify-between col-span-2">
            <div className="space-y-0.5">
              <Label>Require Multi-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Require MFA for all user accounts</p>
            </div>
            <Switch
              checked={settings.userManagement.teamAccess.requireMFA}
              onCheckedChange={(checked) => updateSetting("userManagement.teamAccess.requireMFA", checked)}
            />
          </div>

          <div className="flex items-center justify-between col-span-2">
            <div className="space-y-0.5">
              <Label>Allow Guest Access</Label>
              <p className="text-sm text-muted-foreground">Allow temporary guest access for demos</p>
            </div>
            <Switch
              checked={settings.userManagement.teamAccess.allowGuestAccess}
              onCheckedChange={(checked) => updateSetting("userManagement.teamAccess.allowGuestAccess", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval Workflows</CardTitle>
          <CardDescription>Configure approval processes for sensitive operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Approval Workflows</Label>
              <p className="text-sm text-muted-foreground">Require approvals for high-impact changes</p>
            </div>
            <Switch
              checked={settings.userManagement.approvalWorkflows.enabled}
              onCheckedChange={(checked) => updateSetting("userManagement.approvalWorkflows.enabled", checked)}
            />
          </div>

          {settings.userManagement.approvalWorkflows.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approvalLevels">Approval Levels</Label>
                  <Input
                    id="approvalLevels"
                    type="number"
                    min="1"
                    max="5"
                    value={settings.userManagement.approvalWorkflows.approvalLevels}
                    onChange={(e) =>
                      updateSetting("userManagement.approvalWorkflows.approvalLevels", Number.parseInt(e.target.value))
                    }
                  />
                  <p className="text-sm text-muted-foreground">Number of approval levels required</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escalationTime">Escalation Time</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="escalationTime"
                      type="number"
                      min="1"
                      value={settings.userManagement.approvalWorkflows.escalationTime}
                      onChange={(e) =>
                        updateSetting(
                          "userManagement.approvalWorkflows.escalationTime",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Time before escalating to next level</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify Approvers</Label>
                  <p className="text-sm text-muted-foreground">Send notifications to approvers</p>
                </div>
                <Switch
                  checked={settings.userManagement.approvalWorkflows.notifyApprovers}
                  onCheckedChange={(checked) =>
                    updateSetting("userManagement.approvalWorkflows.notifyApprovers", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
