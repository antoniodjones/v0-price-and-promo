"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { useTableSort, useTableFilter, useTablePagination } from "@/lib/table-helpers"
import { formatDate } from "@/lib/table-formatters"
import {
  Building2,
  Settings,
  Plug,
  Database,
  FileText,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Loader2,
  RotateCcw,
  Upload,
  Download,
} from "lucide-react"
import {
  businessAdmin,
  type Tenant,
  type BusinessRule,
  type ExternalIntegration,
  type DataJob,
  type SystemConfig,
} from "@/lib/admin/business-administration"
import { useToast } from "@/components/ui/use-toast"

export function BusinessAdministrationDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([])
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([])
  const [dataJobs, setDataJobs] = useState<DataJob[]>([])
  const [systemConfig, setSystemConfig] = useState<SystemConfig[]>([])
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeIntegrations: 0,
    runningJobs: 0,
    businessRules: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"tenant" | "rule" | "integration" | "job" | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tenantsData, rulesData, integrationsData, jobsData, configData, statsData] = await Promise.all([
        businessAdmin.getTenants(),
        businessAdmin.getBusinessRules(),
        businessAdmin.getExternalIntegrations(),
        businessAdmin.getDataJobs(),
        businessAdmin.getSystemConfig(),
        businessAdmin.getSystemStats(),
      ])

      setTenants(tenantsData)
      setBusinessRules(rulesData)
      setIntegrations(integrationsData)
      setDataJobs(jobsData)
      setSystemConfig(configData)
      setStats(statsData)
    } catch (error) {
      console.error("Error loading business admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load business administration data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestIntegration = async (id: string) => {
    try {
      setProcessingId(id)
      const result = await businessAdmin.testIntegration(id)

      toast({
        title: result.success ? "Success" : "Test Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })

      await loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to test integration.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "testing":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "running":
        return "text-blue-500"
      case "failed":
        return "text-red-500"
      case "cancelled":
        return "text-gray-500"
      default:
        return "text-yellow-500"
    }
  }

  const tenantsSort = useTableSort(tenants, { key: "created_at", direction: "desc" })
  const tenantsFilter = useTableFilter(tenantsSort.sortedData, ["name", "slug", "domain"])
  const tenantsPagination = useTablePagination(tenantsFilter.filteredData, 10)

  const rulesSort = useTableSort(businessRules, { key: "priority", direction: "asc" })
  const rulesFilter = useTableFilter(rulesSort.sortedData, ["name", "description", "rule_type"])

  const integrationsSort = useTableSort(integrations, { key: "last_sync", direction: "desc" })
  const integrationsFilter = useTableFilter(integrationsSort.sortedData, ["name", "description", "integration_type"])

  const jobsSort = useTableSort(dataJobs, { key: "created_at", direction: "desc" })
  const jobsFilter = useTableFilter(jobsSort.sortedData, ["job_type", "data_type"])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading business administration...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Business Administration</h3>
          <p className="text-muted-foreground">Manage tenants, business rules, integrations, and data operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">Active organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.activeIntegrations}</div>
            <p className="text-xs text-muted-foreground">External connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.runningJobs}</div>
            <p className="text-xs text-muted-foreground">Data operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.businessRules}</div>
            <p className="text-xs text-muted-foreground">Active rules</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenant Management</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="config">System Config</TabsTrigger>
        </TabsList>

        {/* Tenant Management */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tenant Management</CardTitle>
                  <CardDescription>Manage multi-tenant organizations and their settings</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setDialogType("tenant")
                    setSelectedItem(null)
                    setShowDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tenant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={tenantsPagination.paginatedData}
                columns={[
                  {
                    key: "name",
                    header: "Organization",
                    sortable: true,
                    render: (tenant) => (
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">{tenant.slug}</div>
                      </div>
                    ),
                  },
                  { key: "domain", header: "Domain", render: (tenant) => tenant.domain || "Not set" },
                  {
                    key: "subscription_tier",
                    header: "Subscription",
                    render: (tenant) => (
                      <Badge variant="outline" className="capitalize">
                        {tenant.subscription_tier}
                      </Badge>
                    ),
                  },
                  {
                    key: "status",
                    header: "Status",
                    sortable: true,
                    render: (tenant) => (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tenant.status)}
                        <Badge variant={tenant.status === "active" ? "default" : "secondary"}>{tenant.status}</Badge>
                      </div>
                    ),
                  },
                  {
                    key: "created_at",
                    header: "Created",
                    sortable: true,
                    render: (tenant) => formatDate(tenant.created_at),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                sortState={tenantsSort}
                searchValue={tenantsFilter.searchTerm}
                onSearchChange={tenantsFilter.setSearchTerm}
                pagination={tenantsPagination}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Rules */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Business Rules</CardTitle>
                  <CardDescription>Configure automated business logic and decision rules</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setDialogType("rule")
                    setSelectedItem(null)
                    setShowDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={rulesFilter.filteredData}
                columns={[
                  {
                    key: "name",
                    header: "Rule Name",
                    sortable: true,
                    render: (rule) => (
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    ),
                  },
                  {
                    key: "rule_type",
                    header: "Type",
                    render: (rule) => <Badge variant="outline">{rule.rule_type}</Badge>,
                  },
                  { key: "priority", header: "Priority", sortable: true },
                  {
                    key: "enabled",
                    header: "Status",
                    render: (rule) => (
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.enabled} />
                        <span className="text-sm">{rule.enabled ? "Enabled" : "Disabled"}</span>
                      </div>
                    ),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 bg-transparent">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                sortState={rulesSort}
                searchValue={rulesFilter.searchTerm}
                onSearchChange={rulesFilter.setSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* External Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>External Integrations</CardTitle>
                  <CardDescription>Manage connections to external systems and APIs</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setDialogType("integration")
                    setSelectedItem(null)
                    setShowDialog(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Integration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={integrationsFilter.filteredData}
                columns={[
                  {
                    key: "name",
                    header: "Integration",
                    sortable: true,
                    render: (integration) => (
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-muted-foreground">{integration.description}</div>
                      </div>
                    ),
                  },
                  {
                    key: "integration_type",
                    header: "Type",
                    render: (integration) => <Badge variant="outline">{integration.integration_type}</Badge>,
                  },
                  {
                    key: "status",
                    header: "Status",
                    sortable: true,
                    render: (integration) => (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Badge
                          variant={
                            integration.status === "active"
                              ? "default"
                              : integration.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    key: "last_sync",
                    header: "Last Sync",
                    sortable: true,
                    render: (integration) =>
                      integration.last_sync ? new Date(integration.last_sync).toLocaleString() : "Never",
                  },
                  { key: "sync_frequency", header: "Frequency" },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (integration) => (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestIntegration(integration.id)}
                          disabled={processingId === integration.id}
                        >
                          {processingId === integration.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 bg-transparent">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                sortState={integrationsSort}
                searchValue={integrationsFilter.searchTerm}
                onSearchChange={integrationsFilter.setSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>Import data from external sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Data Type</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-full">
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="products">Products</option>
                            <option value="customers">Customers</option>
                            <option value="prices">Price Data</option>
                            <option value="discounts">Discounts</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Start Import
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>Export data for backup or analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Export Format</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-full">
                        <div className="relative">
                          <select className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                            <option value="excel">Excel</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Start Export
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Jobs History</CardTitle>
              <CardDescription>Track import and export operations</CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedDataTable
                data={jobsFilter.filteredData}
                columns={[
                  {
                    key: "job_type",
                    header: "Job Type",
                    render: (job) => (
                      <Badge variant="outline" className="capitalize">
                        {job.job_type}
                      </Badge>
                    ),
                  },
                  { key: "data_type", header: "Data Type" },
                  {
                    key: "status",
                    header: "Status",
                    sortable: true,
                    render: (job) => (
                      <span className={`font-medium capitalize ${getJobStatusColor(job.status)}`}>{job.status}</span>
                    ),
                  },
                  {
                    key: "progress",
                    header: "Progress",
                    render: (job) =>
                      job.records_total > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm">
                            {job.records_processed} / {job.records_total}
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(job.records_processed / job.records_total) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      ),
                  },
                  {
                    key: "created_at",
                    header: "Created",
                    sortable: true,
                    render: (job) => new Date(job.created_at).toLocaleString(),
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (job) => (
                      <div className="flex gap-2">
                        {job.status === "running" && (
                          <Button variant="outline" size="sm">
                            <Pause className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
                sortState={jobsSort}
                searchValue={jobsFilter.searchTerm}
                onSearchChange={jobsFilter.setSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage global system settings and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(
                  systemConfig.reduce(
                    (acc, config) => {
                      if (!acc[config.category]) acc[config.category] = []
                      acc[config.category].push(config)
                      return acc
                    },
                    {} as Record<string, SystemConfig[]>,
                  ),
                ).map(([category, configs]) => (
                  <div key={category} className="space-y-4">
                    <h4 className="text-lg font-semibold capitalize">{category} Settings</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {configs.map((config) => (
                        <div key={config.id} className="space-y-2">
                          <div className="text-sm font-medium">
                            {config.config_key.split(".").pop()?.replace(/_/g, " ")}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">{config.description}</div>
                          {typeof config.config_value.value === "boolean" ? (
                            <Switch checked={config.config_value.value} />
                          ) : (
                            <div className="relative">
                              <input
                                type={config.config_value.type === "integer" ? "number" : "text"}
                                value={config.config_value.value}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
