"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Database,
  Activity,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Loader2,
  Link2,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { adminDb, type PriceSource, type AdminStats, type CreateSourceData } from "@/lib/admin/database"
import { ModuleManagementDashboard } from "@/components/admin/module-management-dashboard"
import { BusinessAdministrationDashboard } from "@/components/admin/business-administration-dashboard"
import { UserManagementDashboard } from "@/components/admin/user-management-dashboard"
import { AuditLoggingDashboard } from "@/components/admin/audit-logging-dashboard"
import { ScriptRunner } from "@/components/admin/script-runner"
import { CustomerManagementDashboard } from "@/components/admin/customer-management-dashboard"

export default function AdminDashboard() {
  const [sources, setSources] = useState<PriceSource[]>([])
  const [stats, setStats] = useState<AdminStats>({
    total_products: 0,
    active_sources: 0,
    price_updates_today: 0,
    alerts_triggered: 0,
    system_health: "healthy",
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const { toast } = useToast()

  const [showNewSource, setShowNewSource] = useState(false)
  const [newSource, setNewSource] = useState<CreateSourceData>({
    name: "",
    url: "",
    api_endpoint: "",
    sync_frequency: "Every 4 hours",
  })

  const [linkingStories, setLinkingStories] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, sourcesData] = await Promise.all([adminDb.getAdminStats(), adminDb.getPriceSources()])

      setStats(statsData)
      setSources(sourcesData)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSource = async () => {
    if (!newSource.name || !newSource.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const createdSource = await adminDb.createPriceSource(newSource)
      if (createdSource) {
        setSources([createdSource, ...sources])
        setNewSource({ name: "", url: "", api_endpoint: "", sync_frequency: "Every 4 hours" })
        setShowNewSource(false)
        toast({
          title: "Success",
          description: "Price source created successfully.",
        })
        const newStats = await adminDb.getAdminStats()
        setStats(newStats)
      } else {
        throw new Error("Failed to create source")
      }
    } catch (error) {
      console.error("Error creating source:", error)
      toast({
        title: "Error",
        description: "Failed to create price source. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSource = async (id: string) => {
    try {
      const success = await adminDb.deletePriceSource(id)
      if (success) {
        setSources(sources.filter((source) => source.id !== id))
        toast({
          title: "Success",
          description: "Price source deleted successfully.",
        })
        const newStats = await adminDb.getAdminStats()
        setStats(newStats)
      } else {
        throw new Error("Failed to delete source")
      }
    } catch (error) {
      console.error("Error deleting source:", error)
      toast({
        title: "Error",
        description: "Failed to delete price source. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSyncSource = async (id: string) => {
    try {
      setSyncing(id)
      const success = await adminDb.syncPriceSource(id)
      if (success) {
        setSources(
          sources.map((source) =>
            source.id === id ? { ...source, last_sync: "Just now", status: "active" as const } : source,
          ),
        )
        toast({
          title: "Success",
          description: "Price source synced successfully.",
        })
        const newStats = await adminDb.getAdminStats()
        setStats(newStats)
      } else {
        throw new Error("Failed to sync source")
      }
    } catch (error) {
      console.error("Error syncing source:", error)
      toast({
        title: "Error",
        description: "Failed to sync price source. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSyncing(null)
    }
  }

  const handleRefreshAll = async () => {
    await loadDashboardData()
    toast({
      title: "Success",
      description: "Dashboard data refreshed successfully.",
    })
  }

  const handleLinkStories = async () => {
    try {
      setLinkingStories(true)
      const response = await fetch("/api/admin/link-stories", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: `Linked ${result.linked} stories to code. ${result.skipped} stories skipped.`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error linking stories:", error)
      toast({
        title: "Error",
        description: "Failed to link stories to code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLinkingStories(false)
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
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
              <p className="text-muted-foreground">
                Manage price sources, monitor system health, and configure settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefreshAll}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh All
              </Button>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_products.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all sources</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active_sources}</div>
                <p className="text-xs text-muted-foreground">Out of {sources.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Updates Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.price_updates_today}</div>
                <p className="text-xs text-green-500">Live tracking active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold capitalize ${getHealthColor(stats.system_health)}`}>
                  {stats.system_health}
                </div>
                <p className="text-xs text-muted-foreground">{stats.alerts_triggered} alerts triggered</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="sources" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sources">Price Sources</TabsTrigger>
              <TabsTrigger value="modules">Module Management</TabsTrigger>
              <TabsTrigger value="business">Business Admin</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="audit">Audit Logging</TabsTrigger>
              <TabsTrigger value="products">Product Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
              <TabsTrigger value="scripts">Database Scripts</TabsTrigger>
              <TabsTrigger value="story-linking">Story Linking</TabsTrigger>
            </TabsList>

            {/* Price Sources Tab */}
            <TabsContent value="sources" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Price Sources</h3>
                <Button onClick={() => setShowNewSource(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </div>

              {/* New Source Form */}
              {showNewSource && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Price Source</CardTitle>
                    <CardDescription>Configure a new data source for price tracking</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="source-name">Source Name *</Label>
                        <Input
                          id="source-name"
                          placeholder="e.g., Premium Distributors"
                          value={newSource.name}
                          onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source-url">Website URL *</Label>
                        <Input
                          id="source-url"
                          placeholder="e.g., premiumdist.com"
                          value={newSource.url}
                          onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-endpoint">API Endpoint (Optional)</Label>
                      <Input
                        id="api-endpoint"
                        placeholder="e.g., https://api.premiumdist.com/v1/products"
                        value={newSource.api_endpoint}
                        onChange={(e) => setNewSource({ ...newSource, api_endpoint: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sync-frequency">Sync Frequency</Label>
                      <Select
                        value={newSource.sync_frequency}
                        onValueChange={(value) => setNewSource({ ...newSource, sync_frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Every hour">Every hour</SelectItem>
                          <SelectItem value="Every 2 hours">Every 2 hours</SelectItem>
                          <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                          <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                          <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                          <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                          <SelectItem value="Daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateSource}>Add Source</Button>
                      <Button variant="outline" onClick={() => setShowNewSource(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sources Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Configured Sources</CardTitle>
                  <CardDescription>Manage your price data sources and sync settings</CardDescription>
                </CardHeader>
                <CardContent>
                  {sources.length === 0 ? (
                    <div className="text-center py-12">
                      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Price Sources</h3>
                      <p className="text-muted-foreground mb-4">
                        Add your first price source to start tracking product prices
                      </p>
                      <Button onClick={() => setShowNewSource(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Source
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Products</TableHead>
                          <TableHead>Last Sync</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sources.map((source) => (
                          <TableRow key={source.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{source.name}</div>
                                <div className="text-sm text-muted-foreground">{source.url}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(source.status)}
                                <Badge
                                  variant={
                                    source.status === "active"
                                      ? "default"
                                      : source.status === "error"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {source.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{source.products_count.toLocaleString()}</TableCell>
                            <TableCell>{source.last_sync}</TableCell>
                            <TableCell>{source.sync_frequency}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSyncSource(source.id)}
                                  disabled={syncing === source.id}
                                >
                                  {syncing === source.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <RefreshCw className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteSource(source.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Module Management Tab */}
            <TabsContent value="modules" className="space-y-4">
              <ModuleManagementDashboard />
            </TabsContent>

            {/* Business Administration Tab */}
            <TabsContent value="business" className="space-y-4">
              <BusinessAdministrationDashboard />
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-4">
              <CustomerManagementDashboard />
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-4">
              <UserManagementDashboard />
            </TabsContent>

            {/* Audit Logging Tab */}
            <TabsContent value="audit" className="space-y-4">
              <AuditLoggingDashboard />
            </TabsContent>

            {/* Product Management Tab */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Manage product mappings and price tracking settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Product Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced product mapping and categorization tools coming soon
                    </p>
                    <Button>Configure Products</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Trends</CardTitle>
                    <CardDescription>Market price movements over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Price trend charts coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Source Performance</CardTitle>
                    <CardDescription>Data quality and sync reliability metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Performance metrics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Global settings for the price tracking system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-sync enabled</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically sync price data from all active sources
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Price alerts</Label>
                        <div className="text-sm text-muted-foreground">
                          Send notifications when significant price changes occur
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data retention</Label>
                        <div className="text-sm text-muted-foreground">Keep historical price data for analysis</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Data Retention Period</Label>
                    <Select defaultValue="90">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Scripts Tab */}
            <TabsContent value="scripts" className="space-y-4">
              <ScriptRunner />
            </TabsContent>

            {/* Story Linking Tab */}
            <TabsContent value="story-linking" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Link Stories to Code</CardTitle>
                  <CardDescription>
                    Automatically link user stories to their implementation files for traceability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This tool will analyze all 172 user stories and automatically link them to:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Implementation files (components, pages, API routes)</li>
                      <li>Related components used in the story</li>
                      <li>File modification counts</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">How it works:</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>Extracts keywords from each story title</li>
                      <li>Maps epics to their implementation directories</li>
                      <li>Finds matching files based on keywords and epic location</li>
                      <li>Updates stories with related_files and related_components</li>
                    </ol>
                  </div>

                  <Button onClick={handleLinkStories} disabled={linkingStories}>
                    {linkingStories ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Linking Stories...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Link All Stories to Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
