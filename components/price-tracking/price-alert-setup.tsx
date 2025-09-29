"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react"

interface PriceAlert {
  id: string
  product_name: string
  brand: string
  alert_type: "price_drop" | "price_increase" | "back_in_stock" | "promotion_start"
  threshold_value?: number
  threshold_percentage?: number
  is_active: boolean
  created_at: string
}

const mockAlerts: PriceAlert[] = [
  {
    id: "1",
    product_name: "Blue Dream 1oz",
    brand: "Premium Cannabis Co",
    alert_type: "price_drop",
    threshold_percentage: 10,
    is_active: true,
    created_at: "2024-01-15",
  },
  {
    id: "2",
    product_name: "OG Kush Cartridge 1g",
    brand: "Elite Extracts",
    alert_type: "back_in_stock",
    is_active: true,
    created_at: "2024-01-14",
  },
]

export function PriceAlertSetup() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts)
  const [showNewAlert, setShowNewAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({
    product_name: "",
    brand: "",
    alert_type: "price_drop" as const,
    threshold_value: "",
    threshold_percentage: "",
    is_active: true,
  })

  const handleCreateAlert = () => {
    const alert: PriceAlert = {
      id: Date.now().toString(),
      product_name: newAlert.product_name,
      brand: newAlert.brand,
      alert_type: newAlert.alert_type,
      threshold_value: newAlert.threshold_value ? Number.parseFloat(newAlert.threshold_value) : undefined,
      threshold_percentage: newAlert.threshold_percentage
        ? Number.parseFloat(newAlert.threshold_percentage)
        : undefined,
      is_active: newAlert.is_active,
      created_at: new Date().toISOString().split("T")[0],
    }

    setAlerts([...alerts, alert])
    setNewAlert({
      product_name: "",
      brand: "",
      alert_type: "price_drop",
      threshold_value: "",
      threshold_percentage: "",
      is_active: true,
    })
    setShowNewAlert(false)
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, is_active: !alert.is_active } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-4 w-4 text-gti-bright-green" />
      case "price_increase":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "back_in_stock":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "promotion_start":
        return <Bell className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "price_drop":
        return "Price Drop"
      case "price_increase":
        return "Price Increase"
      case "back_in_stock":
        return "Back in Stock"
      case "promotion_start":
        return "Promotion Started"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Price Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Get notified when prices change or products come back in stock
          </p>
        </div>
        <Button
          onClick={() => setShowNewAlert(true)}
          className="bg-gti-dark-green hover:bg-gti-medium-green text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Alert
        </Button>
      </div>

      {/* New Alert Form */}
      {showNewAlert && (
        <Card>
          <CardHeader>
            <CardTitle>Create Price Alert</CardTitle>
            <CardDescription>Set up notifications for price changes and stock updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Blue Dream 1oz"
                  value={newAlert.product_name}
                  onChange={(e) => setNewAlert({ ...newAlert, product_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Premium Cannabis Co"
                  value={newAlert.brand}
                  onChange={(e) => setNewAlert({ ...newAlert, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select
                value={newAlert.alert_type}
                onValueChange={(value: any) => setNewAlert({ ...newAlert, alert_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_drop">Price Drop</SelectItem>
                  <SelectItem value="price_increase">Price Increase</SelectItem>
                  <SelectItem value="back_in_stock">Back in Stock</SelectItem>
                  <SelectItem value="promotion_start">Promotion Started</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newAlert.alert_type === "price_drop" || newAlert.alert_type === "price_increase") && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="threshold-value">Threshold Amount ($)</Label>
                  <Input
                    id="threshold-value"
                    type="number"
                    placeholder="e.g., 10.00"
                    value={newAlert.threshold_value}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold_value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold-percentage">Threshold Percentage (%)</Label>
                  <Input
                    id="threshold-percentage"
                    type="number"
                    placeholder="e.g., 10"
                    value={newAlert.threshold_percentage}
                    onChange={(e) => setNewAlert({ ...newAlert, threshold_percentage: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newAlert.is_active}
                onCheckedChange={(checked) => setNewAlert({ ...newAlert, is_active: checked })}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAlert} className="bg-gti-dark-green hover:bg-gti-medium-green text-white">
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowNewAlert(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Alerts */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.alert_type)}
                  <div>
                    <div className="font-medium">{alert.product_name}</div>
                    <div className="text-sm text-muted-foreground">{alert.brand}</div>
                  </div>
                  <Badge variant="secondary">{getAlertTypeLabel(alert.alert_type)}</Badge>
                  {(alert.threshold_value || alert.threshold_percentage) && (
                    <Badge variant="outline">
                      {alert.threshold_value && `$${alert.threshold_value}`}
                      {alert.threshold_percentage && `${alert.threshold_percentage}%`}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch checked={alert.is_active} onCheckedChange={() => handleToggleAlert(alert.id)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {alerts.length === 0 && !showNewAlert && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No price alerts set up</h3>
              <p className="text-muted-foreground mb-4">Create your first alert to get notified of price changes</p>
              <Button
                onClick={() => setShowNewAlert(true)}
                className="bg-gti-dark-green hover:bg-gti-medium-green text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
