"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { useTableSort, useTableFilter } from "@/lib/table-helpers"
import { formatDate } from "@/lib/table-formatters"
import {
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  RotateCcw,
  Activity,
  Database,
  BarChart3,
  Users,
} from "lucide-react"
import {
  moduleManager,
  type SystemModule,
  type ModuleAuditLog,
  type ModuleValidationResult,
} from "@/lib/admin/module-management"
import { useToast } from "@/components/ui/use-toast" // Import useToast hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ModuleManagementDashboard() {
  const [modules, setModules] = useState<SystemModule[]>([])
  const [auditLogs, setAuditLogs] = useState<ModuleAuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<SystemModule | null>(null)
  const [showToggleDialog, setShowToggleDialog] = useState(false)
  const [toggleReason, setToggleReason] = useState("")
  const [validation, setValidation] = useState<ModuleValidationResult | null>(null)
  const [processingModule, setProcessingModule] = useState<string | null>(null)
  const { toast } = useToast() // Declare useToast hook

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [modulesData, auditData] = await Promise.all([
        moduleManager.getAllModules(),
        moduleManager.getModuleAuditLog(undefined, 20),
      ])
      setModules(modulesData)
      setAuditLogs(auditData)
    } catch (error) {
      console.error("Error loading module data:", error)
      toast({
        title: "Error",
        description: "Failed to load module data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleModuleToggle = async (module: SystemModule) => {
    try {
      setSelectedModule(module)
      setProcessingModule(module.module_id)

      // Validate dependencies
      const validationResult = await moduleManager.validateModuleDependencies(module.module_id, !module.enabled)
      setValidation(validationResult)

      if (!validationResult.valid) {
        setShowToggleDialog(true)
        return
      }

      // If validation passes, toggle immediately
      await moduleManager.toggleModule(module.module_id, !module.enabled)
      await loadData()

      toast({
        title: "Success",
        description: `Module ${module.name} ${!module.enabled ? "enabled" : "disabled"} successfully.`,
      })
    } catch (error) {
      console.error("Error toggling module:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle module.",
        variant: "destructive",
      })
    } finally {
      setProcessingModule(null)
    }
  }

  const confirmToggle = async () => {
    if (!selectedModule) return

    try {
      setProcessingModule(selectedModule.module_id)
      await moduleManager.toggleModule(selectedModule.module_id, !selectedModule.enabled, toggleReason)
      await loadData()

      toast({
        title: "Success",
        description: `Module ${selectedModule.name} ${!selectedModule.enabled ? "enabled" : "disabled"} successfully.`,
      })

      setShowToggleDialog(false)
      setToggleReason("")
      setSelectedModule(null)
      setValidation(null)
    } catch (error) {
      console.error("Error confirming toggle:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle module.",
        variant: "destructive",
      })
    } finally {
      setProcessingModule(null)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "high":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-400" />
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "core":
        return <Settings className="h-4 w-4" />
      case "pricing":
        return <Database className="h-4 w-4" />
      case "analytics":
        return <BarChart3 className="h-4 w-4" />
      case "admin":
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getModuleStats = () => {
    const total = modules.length
    const enabled = modules.filter((m) => m.enabled).length
    const byDomain = modules.reduce(
      (acc, m) => {
        acc[m.domain] = (acc[m.domain] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const byRisk = modules.reduce(
      (acc, m) => {
        acc[m.risk_level] = (acc[m.risk_level] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { total, enabled, byDomain, byRisk }
  }

  const modulesSort = useTableSort(modules, { key: "domain", direction: "asc" })
  const modulesFilter = useTableFilter(modulesSort.sortedData, ["name", "description", "domain", "module_id"])

  const auditSort = useTableSort(auditLogs, { key: "created_at", direction: "desc" })
  const auditFilter = useTableFilter(auditSort.sortedData, ["module_id", "action", "changed_by"])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading module management...</span>
        </div>
      </div>
    )
  }

  const stats = getModuleStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Module Management</h3>
          <p className="text-muted-foreground">Control system modules and feature flags for safe deployment</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">System components</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enabled Modules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.enabled}</div>
            <p className="text-xs text-muted-foreground">Out of {stats.total} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Modules</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.byRisk.high || 0}</div>
            <p className="text-xs text-muted-foreground">Require careful management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Modules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byDomain.core || 0}</div>
            <p className="text-xs text-muted-foreground">Essential system components</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">System Modules</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Modules</CardTitle>
              <CardDescription>Manage feature flags and module dependencies for safe system operation</CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={modulesFilter.filteredData}
                columns={[
                  {
                    key: "name",
                    header: "Module",
                    sortable: true,
                    render: (module) => (
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-sm text-muted-foreground">{module.description}</div>
                      </div>
                    ),
                  },
                  {
                    key: "domain",
                    header: "Domain",
                    sortable: true,
                    render: (module) => (
                      <div className="flex items-center gap-2">
                        {getDomainIcon(module.domain)}
                        <Badge variant="outline" className="capitalize">
                          {module.domain}
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    key: "risk_level",
                    header: "Risk Level",
                    sortable: true,
                    render: (module) => (
                      <div className="flex items-center gap-2">
                        {getRiskLevelIcon(module.risk_level)}
                        <span className={`text-sm font-medium capitalize ${getRiskLevelColor(module.risk_level)}`}>
                          {module.risk_level}
                        </span>
                      </div>
                    ),
                  },
                  {
                    key: "dependencies",
                    header: "Dependencies",
                    render: (module) => (
                      <div className="flex flex-wrap gap-1">
                        {module.dependencies.length > 0 ? (
                          module.dependencies.map((dep) => (
                            <Badge key={dep} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: "enabled",
                    header: "Status",
                    sortable: true,
                    render: (module) => (
                      <div className="flex items-center gap-2">
                        {module.enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant={module.enabled ? "default" : "secondary"}>
                          {module.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (module) => (
                      <div className="flex gap-2">
                        <Switch
                          checked={module.enabled}
                          onCheckedChange={() => handleModuleToggle(module)}
                          disabled={processingModule === module.module_id}
                        />
                        {processingModule === module.module_id && <Loader2 className="h-4 w-4 animate-spin" />}
                      </div>
                    ),
                  },
                ]}
                sortState={modulesSort}
                searchValue={modulesFilter.searchTerm}
                onSearchChange={modulesFilter.setSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Audit Log</CardTitle>
              <CardDescription>Track all module changes and system modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={auditFilter.filteredData}
                columns={[
                  {
                    key: "created_at",
                    header: "Timestamp",
                    sortable: true,
                    render: (log) => (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(log.created_at, true)}</span>
                      </div>
                    ),
                  },
                  {
                    key: "module_id",
                    header: "Module",
                    render: (log) => <Badge variant="outline">{log.module_id}</Badge>,
                  },
                  {
                    key: "action",
                    header: "Action",
                    sortable: true,
                    render: (log) => (
                      <Badge
                        variant={
                          log.action === "enabled" ? "default" : log.action === "disabled" ? "secondary" : "outline"
                        }
                        className="capitalize"
                      >
                        {log.action}
                      </Badge>
                    ),
                  },
                  {
                    key: "changed_by",
                    header: "Changed By",
                    render: (log) => (
                      <span className="text-sm text-muted-foreground">{log.changed_by || "System"}</span>
                    ),
                  },
                  {
                    key: "reason",
                    header: "Reason",
                    render: (log) => <span className="text-sm">{log.reason || "No reason provided"}</span>,
                  },
                ]}
                sortState={auditSort}
                searchValue={auditFilter.searchTerm}
                onSearchChange={auditFilter.setSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toggle Confirmation Dialog */}
      <Dialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedModule?.enabled ? "Disable" : "Enable"} Module: {selectedModule?.name}
            </DialogTitle>
            <DialogDescription>
              {validation?.valid
                ? `Are you sure you want to ${selectedModule?.enabled ? "disable" : "enable"} this module?`
                : "This action cannot be completed due to validation errors."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Validation Results */}
            {validation && (
              <div className="space-y-2">
                {validation.errors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-700">Errors</span>
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-700">Warnings</span>
                    </div>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="toggle-reason">Reason (Optional)</Label>
              <Textarea
                id="toggle-reason"
                placeholder="Provide a reason for this change..."
                value={toggleReason}
                onChange={(e) => setToggleReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowToggleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmToggle}
              disabled={!validation?.valid || processingModule === selectedModule?.module_id}
              variant={validation?.valid ? "default" : "destructive"}
            >
              {processingModule === selectedModule?.module_id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {validation?.valid ? "Confirm" : "Cannot Proceed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
