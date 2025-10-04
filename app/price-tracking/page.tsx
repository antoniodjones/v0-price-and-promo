"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  BellOff,
  Eye,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Percent,
  Loader2,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProtectedRoute } from "@/components/auth/protected-route"
import {
  priceTrackingDb,
  type PriceAlert,
  type PriceHistory,
  type TrackedProduct,
  type PriceTrackingStats,
} from "@/lib/price-tracking/database"

export default function PriceTrackingPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([])
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [stats, setStats] = useState<PriceTrackingStats>({
    active_alerts: 0,
    tracked_products: 0,
    price_updates_today: 0,
    avg_price_change: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [alertFilter, setAlertFilter] = useState<string>("all")
  const [showAddProductDialog, setShowAddProductDialog] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [selectedNewProduct, setSelectedNewProduct] = useState<string>("")
  const [newProductThreshold, setNewProductThreshold] = useState<string>("10")
  const { toast } = useToast()

  useEffect(() => {
    loadTrackingData()
    loadAvailableProducts()
  }, [])

  const loadAvailableProducts = async () => {
    try {
      const products = await priceTrackingDb.getAvailableProducts()
      setAvailableProducts(products)
    } catch (error) {
      console.error("[v0] Error loading available products:", error)
    }
  }

  const loadTrackingData = async () => {
    try {
      setLoading(true)
      console.log("[v0] Loading price tracking data...")
      const [statsData, alertsData, productsData, historyData] = await Promise.all([
        priceTrackingDb.getTrackingStats(),
        priceTrackingDb.getPriceAlerts(alertFilter),
        priceTrackingDb.getTrackedProducts(),
        priceTrackingDb.getPriceHistory(selectedProduct),
      ])

      console.log("[v0] Tracked products loaded:", productsData.length)
      setStats(statsData)
      setAlerts(alertsData)
      setTrackedProducts(productsData)
      setPriceHistory(historyData)
    } catch (error) {
      console.error("[v0] Error loading tracking data:", error)
      toast({
        title: "Error",
        description: `Failed to load price tracking data: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledgeAlert = async (alertId: string) => {
    const success = await priceTrackingDb.updateAlertStatus(alertId, "acknowledged")
    if (success) {
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)))
      toast({
        title: "Success",
        description: "Alert acknowledged successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to acknowledge alert.",
        variant: "destructive",
      })
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    const success = await priceTrackingDb.updateAlertStatus(alertId, "resolved")
    if (success) {
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
      toast({
        title: "Success",
        description: "Alert resolved successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to resolve alert.",
        variant: "destructive",
      })
    }
  }

  const handleToggleProductAlert = async (productId: string) => {
    const product = trackedProducts.find((p) => p.id === productId)
    if (!product) return

    const success = await priceTrackingDb.updateTrackingSettings(productId, {
      alert_enabled: !product.alert_enabled,
    })

    if (success) {
      setTrackedProducts(
        trackedProducts.map((p) => (p.id === productId ? { ...p, alert_enabled: !p.alert_enabled } : p)),
      )
      toast({
        title: "Success",
        description: `Alerts ${!product.alert_enabled ? "enabled" : "disabled"} for ${product.name}.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update alert settings.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshData = async () => {
    await loadTrackingData()
    toast({
      title: "Success",
      description: "Price tracking data refreshed successfully.",
    })
  }

  const handleAddProduct = async () => {
    if (!selectedNewProduct) {
      toast({
        title: "Error",
        description: "Please select a product to track.",
        variant: "destructive",
      })
      return
    }

    const threshold = Number.parseFloat(newProductThreshold)
    if (isNaN(threshold) || threshold <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid threshold value.",
        variant: "destructive",
      })
      return
    }

    const success = await priceTrackingDb.addProductToTracking(selectedNewProduct, threshold)

    if (success) {
      toast({
        title: "Success",
        description: "Product added to tracking successfully.",
      })
      setShowAddProductDialog(false)
      setSelectedNewProduct("")
      setNewProductThreshold("10")
      await loadTrackingData()
      await loadAvailableProducts()
    } else {
      toast({
        title: "Error",
        description: "Failed to add product to tracking.",
        variant: "destructive",
      })
    }
  }

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "price_increase":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "price_decrease":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "threshold":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "competitor":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "acknowledged":
        return <Badge variant="secondary">Acknowledged</Badge>
      case "resolved":
        return <Badge variant="default">Resolved</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriceChangeDisplay = (change: number, percentage: number) => {
    const isPositive = change > 0
    const color = isPositive ? "text-red-500" : "text-green-500"
    const icon = isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="font-medium">
          ${Math.abs(change).toFixed(2)} ({Math.abs(percentage).toFixed(1)}%)
        </span>
      </div>
    )
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === "all") return true
    return alert.status === alertFilter
  })

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading price tracking data...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Price Tracking</h2>
              <p className="text-muted-foreground">Monitor price changes and manage alerts across all sources</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" onClick={handleRefreshData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Prices
              </Button>
              <Button onClick={() => setShowAddProductDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Bell className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.active_alerts}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tracked Products</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tracked_products}</div>
                <p className="text-xs text-muted-foreground">Being monitored</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Price Updates Today</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.price_updates_today}</div>
                <p className="text-xs text-green-500">Live tracking active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price Change</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.avg_price_change.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Across all products</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
              <TabsTrigger value="tracked">Tracked Products</TabsTrigger>
              <TabsTrigger value="history">Price History</TabsTrigger>
              <TabsTrigger value="settings">Alert Settings</TabsTrigger>
            </TabsList>

            {/* Price Alerts Tab */}
            <TabsContent value="alerts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Price Alerts</h3>
                <div className="flex gap-2">
                  <Select value={alertFilter} onValueChange={setAlertFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => loadTrackingData()}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Price change notifications and threshold alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredAlerts.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Alerts</h3>
                      <p className="text-muted-foreground">No price alerts match your current filter.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Alert Type</TableHead>
                          <TableHead>Price Change</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.map((alert) => (
                          <TableRow key={alert.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{alert.products?.name || "Unknown Product"}</div>
                                <div className="text-sm text-muted-foreground">{alert.products?.sku}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getAlertIcon(alert.alert_type)}
                                <span className="capitalize">{alert.alert_type.replace("_", " ")}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">${alert.current_price.toFixed(2)}</div>
                                {getPriceChangeDisplay(alert.change_amount, alert.change_percentage)}
                              </div>
                            </TableCell>
                            <TableCell>{alert.price_sources?.name || "Unknown Source"}</TableCell>
                            <TableCell>{priceTrackingDb.formatLastUpdated(alert.triggered_at)}</TableCell>
                            <TableCell>{getStatusBadge(alert.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {alert.status === "active" && (
                                  <Button variant="outline" size="sm" onClick={() => handleAcknowledgeAlert(alert.id)}>
                                    Acknowledge
                                  </Button>
                                )}
                                {alert.status !== "resolved" && (
                                  <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
                                    Resolve
                                  </Button>
                                )}
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

            {/* Tracked Products Tab */}
            <TabsContent value="tracked" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tracked Products</h3>
                <Button onClick={() => setShowAddProductDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Price Monitoring</CardTitle>
                  <CardDescription>Products being tracked for price changes</CardDescription>
                </CardHeader>
                <CardContent>
                  {trackedProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Tracked Products</h3>
                      <p className="text-muted-foreground">Start tracking products to monitor price changes.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>24h Change</TableHead>
                          <TableHead>Price Range</TableHead>
                          <TableHead>Sources</TableHead>
                          <TableHead>Alerts</TableHead>
                          <TableHead>Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trackedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.sku} • {product.category}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">${product.current_price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                              {product.price_change_24h !== 0 &&
                                getPriceChangeDisplay(product.price_change_24h, product.price_change_percentage)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>Low: ${product.lowest_price.toFixed(2)}</div>
                                <div>High: ${product.highest_price.toFixed(2)}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{product.sources_count} sources</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={product.alert_enabled}
                                  onCheckedChange={() => handleToggleProductAlert(product.id)}
                                />
                                {product.alert_enabled ? (
                                  <Bell className="h-4 w-4 text-green-500" />
                                ) : (
                                  <BellOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{priceTrackingDb.formatLastUpdated(product.last_updated)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Price History Tab */}
            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Price History</h3>
                <div className="flex gap-2">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select product to view history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      {trackedProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historical Price Data</CardTitle>
                  <CardDescription>Track price movements over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {priceHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Price History</h3>
                      <p className="text-muted-foreground">No price history data available for the selected filter.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Change</TableHead>
                          <TableHead>Recorded At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {priceHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{record.products?.name || "Unknown Product"}</div>
                                <div className="text-sm text-muted-foreground">{record.products?.sku}</div>
                              </div>
                            </TableCell>
                            <TableCell>{record.price_sources?.name || "Unknown Source"}</TableCell>
                            <TableCell>
                              <div className="font-medium">${record.price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                              {record.change_from_previous &&
                                record.change_percentage &&
                                getPriceChangeDisplay(record.change_from_previous, record.change_percentage)}
                            </TableCell>
                            <TableCell>{priceTrackingDb.formatLastUpdated(record.recorded_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alert Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Configuration</CardTitle>
                  <CardDescription>Configure global alert settings and thresholds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Send email alerts when price thresholds are triggered
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Real-time alerts</Label>
                        <div className="text-sm text-muted-foreground">
                          Show immediate notifications for price changes
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Daily summary</Label>
                        <div className="text-sm text-muted-foreground">Receive daily reports of all price changes</div>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-threshold">Default Alert Threshold (%)</Label>
                      <Input id="default-threshold" type="number" placeholder="10" className="w-32" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-frequency">Alert Frequency</Label>
                      <Select defaultValue="immediate">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly digest</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product to Tracking</DialogTitle>
            <DialogDescription>
              Select a product to monitor for price changes and set an alert threshold.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product-select">Product</Label>
              <Select value={selectedNewProduct} onValueChange={setSelectedNewProduct}>
                <SelectTrigger id="product-select">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No products available
                    </SelectItem>
                  ) : (
                    availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Alert Threshold (%)</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="10"
                value={newProductThreshold}
                onChange={(e) => setNewProductThreshold(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                You'll be alerted when the price changes by this percentage
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  )
}
