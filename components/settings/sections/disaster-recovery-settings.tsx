"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { EnterpriseSettings } from "@/lib/settings"

interface DisasterRecoverySettingsProps {
  settings: { enterprise: EnterpriseSettings }
  updateSetting: (path: string, value: any) => void
}

export default function DisasterRecoverySettingsComponent({ settings, updateSetting }: DisasterRecoverySettingsProps) {
  const handleEmergencyContactsChange = (value: string) => {
    const contacts = value.split("\n").filter(Boolean)
    updateSetting("enterprise.disasterRecovery.businessContinuity.emergencyContacts", contacts)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup Strategy</CardTitle>
          <CardDescription>Configure automated backup and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Backups</Label>
              <p className="text-sm text-muted-foreground">Automatically backup critical data</p>
            </div>
            <Switch
              checked={settings.enterprise.disasterRecovery.backupStrategy.enabled}
              onCheckedChange={(checked) =>
                updateSetting("enterprise.disasterRecovery.backupStrategy.enabled", checked)
              }
            />
          </div>

          {settings.enterprise.disasterRecovery.backupStrategy.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Backup Frequency</Label>
                  <Select
                    value={settings.enterprise.disasterRecovery.backupStrategy.frequency}
                    onValueChange={(value) =>
                      updateSetting("enterprise.disasterRecovery.backupStrategy.frequency", value)
                    }
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

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Retention Period</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="retentionPeriod"
                      type="number"
                      min="1"
                      value={settings.enterprise.disasterRecovery.backupStrategy.retentionPeriod}
                      onChange={(e) =>
                        updateSetting(
                          "enterprise.disasterRecovery.backupStrategy.retentionPeriod",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Off-Site Backup</Label>
                  <p className="text-sm text-muted-foreground">Store backups in geographically separate location</p>
                </div>
                <Switch
                  checked={settings.enterprise.disasterRecovery.backupStrategy.offSiteBackup}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.disasterRecovery.backupStrategy.offSiteBackup", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Encrypt Backups</Label>
                  <p className="text-sm text-muted-foreground">Encrypt backup data for security</p>
                </div>
                <Switch
                  checked={settings.enterprise.disasterRecovery.backupStrategy.encryptBackups}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.disasterRecovery.backupStrategy.encryptBackups", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Failover Configuration</CardTitle>
          <CardDescription>Configure automatic failover and recovery settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Failover</Label>
              <p className="text-sm text-muted-foreground">Automatically failover to backup systems</p>
            </div>
            <Switch
              checked={settings.enterprise.disasterRecovery.failoverConfiguration.enabled}
              onCheckedChange={(checked) =>
                updateSetting("enterprise.disasterRecovery.failoverConfiguration.enabled", checked)
              }
            />
          </div>

          {settings.enterprise.disasterRecovery.failoverConfiguration.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryRegion">Primary Region</Label>
                  <Select
                    value={settings.enterprise.disasterRecovery.failoverConfiguration.primaryRegion}
                    onValueChange={(value) =>
                      updateSetting("enterprise.disasterRecovery.failoverConfiguration.primaryRegion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryRegion">Secondary Region</Label>
                  <Select
                    value={settings.enterprise.disasterRecovery.failoverConfiguration.secondaryRegion}
                    onValueChange={(value) =>
                      updateSetting("enterprise.disasterRecovery.failoverConfiguration.secondaryRegion", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Failover</Label>
                  <p className="text-sm text-muted-foreground">Automatically trigger failover when issues detected</p>
                </div>
                <Switch
                  checked={settings.enterprise.disasterRecovery.failoverConfiguration.autoFailover}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.disasterRecovery.failoverConfiguration.autoFailover", checked)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="failoverThreshold">Failover Threshold</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="failoverThreshold"
                      type="number"
                      min="1"
                      value={settings.enterprise.disasterRecovery.failoverConfiguration.failoverThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "enterprise.disasterRecovery.failoverConfiguration.failoverThreshold",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Time before triggering failover</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recoveryTimeObjective">Recovery Time Objective</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="recoveryTimeObjective"
                      type="number"
                      min="1"
                      value={settings.enterprise.disasterRecovery.failoverConfiguration.recoveryTimeObjective}
                      onChange={(e) =>
                        updateSetting(
                          "enterprise.disasterRecovery.failoverConfiguration.recoveryTimeObjective",
                          Number.parseInt(e.target.value),
                        )
                      }
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Target time to restore service</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Continuity</CardTitle>
          <CardDescription>Configure business continuity planning and communication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContacts">Emergency Contacts</Label>
            <Textarea
              id="emergencyContacts"
              value={settings.enterprise.disasterRecovery.businessContinuity.emergencyContacts.join("\n")}
              onChange={(e) => handleEmergencyContactsChange(e.target.value)}
              placeholder="john.doe@company.com&#10;jane.smith@company.com&#10;+1-555-0123"
              rows={4}
            />
            <p className="text-sm text-muted-foreground">Emergency contact emails and phone numbers (one per line)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalationProcedure">Escalation Procedure</Label>
            <Textarea
              id="escalationProcedure"
              value={settings.enterprise.disasterRecovery.businessContinuity.escalationProcedure}
              onChange={(e) =>
                updateSetting("enterprise.disasterRecovery.businessContinuity.escalationProcedure", e.target.value)
              }
              placeholder="1. Contact primary on-call engineer&#10;2. If no response in 15 minutes, contact backup&#10;3. Escalate to management after 30 minutes"
              rows={4}
            />
            <p className="text-sm text-muted-foreground">Step-by-step escalation procedure</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="communicationPlan">Communication Plan</Label>
            <Textarea
              id="communicationPlan"
              value={settings.enterprise.disasterRecovery.businessContinuity.communicationPlan}
              onChange={(e) =>
                updateSetting("enterprise.disasterRecovery.businessContinuity.communicationPlan", e.target.value)
              }
              placeholder="Internal: Slack #incidents channel&#10;External: Status page updates&#10;Customers: Email notifications"
              rows={4}
            />
            <p className="text-sm text-muted-foreground">How to communicate during incidents</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testSchedule">Disaster Recovery Test Schedule</Label>
            <Select
              value={settings.enterprise.disasterRecovery.businessContinuity.testSchedule}
              onValueChange={(value) =>
                updateSetting("enterprise.disasterRecovery.businessContinuity.testSchedule", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">How often to test disaster recovery procedures</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
