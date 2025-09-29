"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, BellRing, Trash2, Plus } from "lucide-react"
import type { PriceAlert } from "@/lib/types"

interface PriceAlertsProps {
  alerts: PriceAlert[]
  productId: string
  currentPrice: number
  onCreateAlert: (alert: Omit<PriceAlert, "id" | "created_at" | "triggered_at">) => void
  onDeleteAlert: (alertId: string) => void
}

export function PriceAlerts({ alerts, productId, currentPrice, onCreateAlert, onDeleteAlert }: PriceAlertsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAlert, setNewAlert] = useState({
    target_price: currentPrice * 0.9,
    alert_type: "price_drop",
  })

  const handleCreateAlert = () => {
    onCreateAlert({
      user_id: "current-user", // TODO: Get from auth
      product_id: productId,
      target_price: newAlert.target_price,
      alert_type: newAlert.alert_type,
      is_active: true,
      notification_sent: false,
    })
    setShowCreateForm(false)
    setNewAlert({
      target_price: currentPrice * 0.9,
      alert_type: "price_drop",
    })
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "price_drop":
        return "Price Drop"
      case "price_increase":
        return "Price Increase"
      case "back_in_stock":
        return "Back in Stock"
      case "low_stock":
        return "Low Stock"
      default:
        return type
    }
  }

  const getAlertStatus = (alert: PriceAlert) => {
    if (!alert.is_active) return { status: "inactive", color: "secondary" }
    if (alert.notification_sent) return { status: "triggered", color: "destructive" }

    if (alert.alert_type === "price_drop" && currentPrice <= alert.target_price) {
      return { status: "ready", color: "default" }
    }
    if (alert.alert_type === "price_increase" && currentPrice >= alert.target_price) {
      return { status: "ready", color: "default" }
    }

    return { status: "waiting", color: "outline" }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Price Alerts
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create Alert Form */}
        {showCreateForm && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select
                  value={newAlert.alert_type}
                  onValueChange={(value) => setNewAlert({ ...newAlert, alert_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_drop">Price Drop</SelectItem>
                    <SelectItem value="price_increase">Price Increase</SelectItem>
                    <SelectItem value="back_in_stock">Back in Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target-price">Target Price</Label>
                <Input
                  id="target-price"
                  type="number"
                  step="0.01"
                  value={newAlert.target_price}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      target_price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateAlert} size="sm">
                Create Alert
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Current Price Reference */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm text-muted-foreground">Current Price</div>
          <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
        </div>

        {/* Active Alerts */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No price alerts set</p>
              <p className="text-sm">Create an alert to get notified of price changes</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const { status, color } = getAlertStatus(alert)

              return (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        status === "ready"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                          : status === "triggered"
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {status === "triggered" ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="font-medium">{getAlertTypeLabel(alert.alert_type)}</div>
                      <div className="text-sm text-muted-foreground">Target: ${alert.target_price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={color as any}>
                      {status === "ready"
                        ? "Ready"
                        : status === "triggered"
                          ? "Triggered"
                          : status === "inactive"
                            ? "Inactive"
                            : "Waiting"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAlert(alert.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
