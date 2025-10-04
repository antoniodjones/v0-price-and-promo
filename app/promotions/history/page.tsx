"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, TrendingUp, DollarSign, Package, Loader2, AlertTriangle } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ErrorBoundary } from "@/components/error-boundary"

interface PromotionHistory {
  id: string
  promotion_id: string
  product_id: string | null
  promotion_type: string
  date_tracked: string
  usage_count: number
  revenue_impact: number
  cost_impact: number
  metadata: {
    promotion_name?: string
    product_name?: string
    discount_percentage?: number
    [key: string]: any
  }
}

interface HistoryStats {
  totalPromotions: number
  totalUsage: number
  totalRevenue: number
  totalCost: number
  avgRevenuePerPromotion: number
  avgUsagePerPromotion: number
}

export default function PromotionHistoryPage() {
  const [history, setHistory] = useState<PromotionHistory[]>([])
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30d")

  useEffect(() => {
    loadPromotionHistory()
  }, [typeFilter, dateRange])

  const loadPromotionHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      params.append("dateRange", dateRange)

      const response = await fetch(`/api/promotions/history?${params.toString()}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to load promotion history")
      }

      setHistory(result.data.history)
      setStats(result.data.stats)
    } catch (err) {
      console.error("[v0] Error loading promotion history:", err)
      setError(err instanceof Error ? err.message : "Failed to load promotion history")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPromotionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      bogo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      discount: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      bundle: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      inventory: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    }

    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-800"} variant="outline">
        {type.toUpperCase()}
      </Badge>
    )
  }

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.metadata?.promotion_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.promotion_type.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading promotion history...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Error Loading History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadPromotionHistory}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Promotion History</h1>
                <p className="text-muted-foreground mt-1">View past promotions and their performance metrics</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={loadPromotionHistory}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Promotions</CardTitle>
                    <Package className="h-4 w-4 text-chart-1" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPromotions}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg {stats.avgUsagePerPromotion.toFixed(1)} uses each
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Times promotions were used</p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Impact</CardTitle>
                    <DollarSign className="h-4 w-4 text-chart-3" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Avg {formatCurrency(stats.avgRevenuePerPromotion)} per promotion
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Cost Impact</CardTitle>
                    <DollarSign className="h-4 w-4 text-chart-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalCost)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Net: {formatCurrency(stats.totalRevenue - stats.totalCost)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bogo">BOGO</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* History Table */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Promotion Records</CardTitle>
                <CardDescription>Detailed history of all promotional activities and their impact</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No promotion history found</p>
                    <p className="text-sm mt-2">
                      {searchTerm || typeFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Promotion history will appear here once promotions are used"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Promotion Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Usage Count</TableHead>
                          <TableHead className="text-right">Revenue Impact</TableHead>
                          <TableHead className="text-right">Cost Impact</TableHead>
                          <TableHead className="text-right">Net Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{formatDate(item.date_tracked)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {item.metadata?.promotion_name || "Unnamed Promotion"}
                                </span>
                                {item.metadata?.discount_percentage && (
                                  <span className="text-xs text-muted-foreground">
                                    {item.metadata.discount_percentage}% off
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getPromotionTypeBadge(item.promotion_type)}</TableCell>
                            <TableCell>
                              <span className="text-sm">{item.metadata?.product_name || "N/A"}</span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.usage_count.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-green-600 dark:text-green-400">
                              {formatCurrency(item.revenue_impact)}
                            </TableCell>
                            <TableCell className="text-right text-orange-600 dark:text-orange-400">
                              {formatCurrency(item.cost_impact)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              <span
                                className={
                                  item.revenue_impact - item.cost_impact >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }
                              >
                                {formatCurrency(item.revenue_impact - item.cost_impact)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
