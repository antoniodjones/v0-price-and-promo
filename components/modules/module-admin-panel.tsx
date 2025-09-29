// Module Administration Panel - For super users to manage modules
"use client"

import { useState } from "react"
import { useModuleRegistry, type ModuleDomain } from "@/lib/modules/module-registry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, CheckCircle, Clock, XCircle, Shield, Zap, AlertCircle, Loader2 } from "lucide-react"

const DOMAIN_ICONS = {
  core: Shield,
  pricing: Zap,
  analytics: AlertCircle,
  admin: Shield,
  auth: Shield,
}

const RISK_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
}

const STATUS_ICONS = {
  enabled: CheckCircle,
  disabled: XCircle,
  loading: Clock,
  error: AlertTriangle,
}

export function ModuleAdminPanel() {
  const { registry, enableModule, disableModule, canEnableModule, getModulesByDomain } = useModuleRegistry()

  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggleModule = async (moduleId: string, currentlyEnabled: boolean) => {
    setLoading(moduleId)
    setError(null)

    try {
      const result = currentlyEnabled ? await disableModule(moduleId) : await enableModule(moduleId)

      if (!result.success) {
        setError(result.error || "Unknown error occurred")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(null)
    }
  }

  const renderModuleCard = (module: any) => {
    const StatusIcon = STATUS_ICONS[module.status]
    const DomainIcon = DOMAIN_ICONS[module.domain]
    const isEnabled = registry.enabledModules.has(module.id)
    const canEnable = canEnableModule(module.id)
    const isLoading = loading === module.id

    return (
      <Card key={module.id} className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <DomainIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-lg">{module.name}</CardTitle>
                <CardDescription className="text-sm">{module.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={RISK_COLORS[module.riskLevel]}>{module.riskLevel} risk</Badge>
              <div className="flex items-center space-x-1">
                <StatusIcon
                  className={`h-4 w-4 ${
                    module.status === "enabled"
                      ? "text-green-600"
                      : module.status === "error"
                        ? "text-red-600"
                        : module.status === "loading"
                          ? "text-yellow-600"
                          : "text-gray-400"
                  }`}
                />
                <span className="text-sm capitalize">{module.status}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Dependencies */}
          {module.dependencies.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Dependencies:</h4>
              <div className="flex flex-wrap gap-1">
                {module.dependencies.map((depId: string) => {
                  const depModule = registry.modules[depId]
                  const depEnabled = registry.enabledModules.has(depId)
                  return (
                    <Badge key={depId} variant={depEnabled ? "default" : "destructive"} className="text-xs">
                      {depModule?.name || depId}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Components */}
          {module.components.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Components:</h4>
              <div className="text-xs text-muted-foreground">{module.components.join(", ")}</div>
            </div>
          )}

          {/* Routes */}
          {module.routes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Routes:</h4>
              <div className="text-xs text-muted-foreground">{module.routes.join(", ")}</div>
            </div>
          )}

          {/* Error Message */}
          {module.status === "error" && module.errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">{module.errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Toggle Switch */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isEnabled}
                disabled={isLoading || !canEnable.canEnable}
                onCheckedChange={() => handleToggleModule(module.id, isEnabled)}
              />
              <span className="text-sm">{isLoading ? "Processing..." : isEnabled ? "Enabled" : "Disabled"}</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>

            {!canEnable.canEnable && !isEnabled && <span className="text-xs text-red-600">{canEnable.reason}</span>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const domains: ModuleDomain[] = ["core", "auth", "pricing", "analytics", "admin"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Module Administration</h2>
        <p className="text-muted-foreground">Manage application modules and their dependencies</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{registry.enabledModules.size}</div>
            <div className="text-sm text-muted-foreground">Enabled Modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{registry.loadedModules.size}</div>
            <div className="text-sm text-muted-foreground">Loaded Modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{Object.keys(registry.modules).length}</div>
            <div className="text-sm text-muted-foreground">Total Modules</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="core" className="space-y-4">
        <TabsList>
          {domains.map((domain) => (
            <TabsTrigger key={domain} value={domain} className="capitalize">
              {domain}
            </TabsTrigger>
          ))}
        </TabsList>

        {domains.map((domain) => (
          <TabsContent key={domain} value={domain} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getModulesByDomain(domain).map(renderModuleCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
