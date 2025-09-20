"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { EnterpriseSettings } from "@/lib/settings"

interface MultiTenantSettingsProps {
  settings: { enterprise: EnterpriseSettings }
  updateSetting: (path: string, value: any) => void
}

export default function MultiTenantSettingsComponent({ settings, updateSetting }: MultiTenantSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Tenant Configuration</CardTitle>
          <CardDescription>Configure multi-tenant organization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Multi-Tenant Mode</Label>
              <p className="text-sm text-muted-foreground">Support multiple organizations in single instance</p>
            </div>
            <Switch
              checked={settings.enterprise.multiTenant.enabled}
              onCheckedChange={(checked) => updateSetting("enterprise.multiTenant.enabled", checked)}
            />
          </div>

          {settings.enterprise.multiTenant.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={settings.enterprise.multiTenant.organizationName}
                  onChange={(e) => updateSetting("enterprise.multiTenant.organizationName", e.target.value)}
                  placeholder="Your Organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={settings.enterprise.multiTenant.customDomain}
                  onChange={(e) => updateSetting("enterprise.multiTenant.customDomain", e.target.value)}
                  placeholder="pricing.yourcompany.com"
                />
                <p className="text-sm text-muted-foreground">Custom domain for this organization</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {settings.enterprise.multiTenant.enabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>White Labeling</CardTitle>
              <CardDescription>Customize branding and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable White Labeling</Label>
                  <p className="text-sm text-muted-foreground">Customize branding for this organization</p>
                </div>
                <Switch
                  checked={settings.enterprise.multiTenant.whiteLabeling.enabled}
                  onCheckedChange={(checked) => updateSetting("enterprise.multiTenant.whiteLabeling.enabled", checked)}
                />
              </div>

              {settings.enterprise.multiTenant.whiteLabeling.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      type="url"
                      value={settings.enterprise.multiTenant.whiteLabeling.logoUrl}
                      onChange={(e) => updateSetting("enterprise.multiTenant.whiteLabeling.logoUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.enterprise.multiTenant.whiteLabeling.primaryColor}
                          onChange={(e) =>
                            updateSetting("enterprise.multiTenant.whiteLabeling.primaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.enterprise.multiTenant.whiteLabeling.primaryColor}
                          onChange={(e) =>
                            updateSetting("enterprise.multiTenant.whiteLabeling.primaryColor", e.target.value)
                          }
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.enterprise.multiTenant.whiteLabeling.secondaryColor}
                          onChange={(e) =>
                            updateSetting("enterprise.multiTenant.whiteLabeling.secondaryColor", e.target.value)
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.enterprise.multiTenant.whiteLabeling.secondaryColor}
                          onChange={(e) =>
                            updateSetting("enterprise.multiTenant.whiteLabeling.secondaryColor", e.target.value)
                          }
                          placeholder="#64748b"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customCSS">Custom CSS</Label>
                    <Textarea
                      id="customCSS"
                      value={settings.enterprise.multiTenant.whiteLabeling.customCSS}
                      onChange={(e) => updateSetting("enterprise.multiTenant.whiteLabeling.customCSS", e.target.value)}
                      placeholder="/* Custom CSS styles */"
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">Additional CSS for custom styling</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tenant Isolation</CardTitle>
              <CardDescription>Configure isolation levels between tenants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Isolation</Label>
                  <p className="text-sm text-muted-foreground">Completely isolate tenant data</p>
                </div>
                <Switch
                  checked={settings.enterprise.multiTenant.tenantIsolation.dataIsolation}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.multiTenant.tenantIsolation.dataIsolation", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resource Isolation</Label>
                  <p className="text-sm text-muted-foreground">Isolate compute and memory resources</p>
                </div>
                <Switch
                  checked={settings.enterprise.multiTenant.tenantIsolation.resourceIsolation}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.multiTenant.tenantIsolation.resourceIsolation", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Network Isolation</Label>
                  <p className="text-sm text-muted-foreground">Isolate network traffic between tenants</p>
                </div>
                <Switch
                  checked={settings.enterprise.multiTenant.tenantIsolation.networkIsolation}
                  onCheckedChange={(checked) =>
                    updateSetting("enterprise.multiTenant.tenantIsolation.networkIsolation", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
