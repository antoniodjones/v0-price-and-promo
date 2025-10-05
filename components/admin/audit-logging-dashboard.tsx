"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Loader2,
  Users,
  Database,
  Settings,
  Eye,
  BarChart3,
} from "lucide-react"
import type { AuditLogFilter, AuditLogStats } from "@/lib/audit/audit-logger"
import { getAuditLogsAction, getAuditStatsAction, cleanupExpiredLogsAction } from "@/app/actions/audit-actions"

interface AuditLog {
  id: string
  event_type: string
  event_category: string
  event_action: string
  resource_type?: string
  resource_id?: string
  user_email?: string
  severity: string
  status: string
  error_message?: string
  created_at: string
  event_data?: Record<string, any>
  metadata?: Record<string, any>
}

export function AuditLoggingDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditLogStats>({
    total_events: 0,
    events_today: 0,
    errors_today: 0,
    warnings_today: 0,
    unique_users_today: 0,
    top_event_types: [],
    recent_critical_events: 0,
    system_health_score: 100,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AuditLogFilter>({
    event_category: "",
    severity: "",
    status: "",
    search: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAuditData()
  }, [filters, pagination.page])

  const loadAuditData = async () => {
    try {
      setLoading(true)
      const [logsResponse, statsData] = await Promise.all([
        getAuditLogsAction(filters, pagination.page, pagination.limit),
        getAuditStatsAction(),
      ])

      setAuditLogs(logsResponse.data)
      setPagination((prev) => ({ ...prev, total: logsResponse.total }))
      setStats(statsData)
    } catch (error) {
      console.error("Error loading audit data:", error)
      toast({
        title: "Error",
        description: "Failed to load audit data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadAuditData()
    toast({
      title: "Success",
      description: "Audit data refreshed successfully.",
    })
  }

  const handleCleanupLogs = async () => {
    try {
      const deletedCount = await cleanupExpiredLogsAction()
      toast({
        title: "Cleanup Complete",
        description: `${deletedCount} expired audit logs were removed.`,
      })
      await loadAuditData()
    } catch (error) {
      console.error("Error cleaning up logs:", error)
      toast({
        title: "Error",
        description: "Failed to cleanup expired logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failure":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "user":
        return <Users className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      case "business":
        return <BarChart3 className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "data":
        return <Database className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const formatEventData = (data: Record<string, any> | undefined) => {
    if (!data) return "—"
    return JSON.stringify(data, null, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit Logging</h3>
          <p className="text-sm text-muted-foreground">Monitor system activities and security events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCleanupLogs}>
            <Database className="mr-2 h-4 w-4" />
            Cleanup Expired
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.events_today} events today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthScoreColor(stats.system_health_score)}`}>
              {stats.system_health_score}%
            </div>
            <p className="text-xs text-muted-foreground">Health score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors Today</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.errors_today}</div>
            <p className="text-xs text-muted-foreground">{stats.warnings_today} warnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unique_users_today}</div>
            <p className="text-xs text-muted-foreground">Unique users today</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Event Types */}
      {stats.top_event_types.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Event Types (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.top_event_types.map((eventType, index) => (
                <div key={eventType.event_type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-sm">{eventType.event_type}</span>
                  </div>
                  <Badge variant="outline">{eventType.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={filters.event_category || "all"}
                onValueChange={(value) => setFilters({ ...filters, event_category: value === "all" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity-filter">Severity</Label>
              <Select
                value={filters.severity || "all"}
                onValueChange={(value) => setFilters({ ...filters, severity: value === "all" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>System activity and security event logs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading audit logs...</span>
              </div>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Audit Logs Found</h3>
              <p className="text-muted-foreground mb-4">
                No audit logs match your current filters or the system is just getting started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.event_type}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.resource_type && `${log.resource_type}${log.resource_id ? ` (${log.resource_id})` : ""}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.event_category)}
                        <span className="capitalize">{log.event_category}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.user_email || "System"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <Badge variant={getSeverityBadgeVariant(log.severity)}>{log.severity}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge
                          variant={
                            log.status === "success"
                              ? "default"
                              : log.status === "failure"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(log.created_at).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page * pagination.limit >= pagination.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Audit Log Details</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Event Type</Label>
                  <p className="text-sm">{selectedLog.event_type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm capitalize">{selectedLog.event_category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Action</Label>
                  <p className="text-sm">{selectedLog.event_action}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p className="text-sm">{selectedLog.user_email || "System"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <Badge variant={getSeverityBadgeVariant(selectedLog.severity)}>{selectedLog.severity}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    variant={
                      selectedLog.status === "success"
                        ? "default"
                        : selectedLog.status === "failure"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {selectedLog.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Resource</Label>
                  <p className="text-sm">
                    {selectedLog.resource_type
                      ? `${selectedLog.resource_type}${selectedLog.resource_id ? ` (${selectedLog.resource_id})` : ""}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <p className="text-sm">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedLog.error_message && (
                <div>
                  <Label className="text-sm font-medium">Error Message</Label>
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{selectedLog.error_message}</p>
                </div>
              )}

              {selectedLog.event_data && (
                <div>
                  <Label className="text-sm font-medium">Event Data</Label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {formatEventData(selectedLog.event_data)}
                  </pre>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <Label className="text-sm font-medium">Metadata</Label>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {formatEventData(selectedLog.metadata)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
