"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Activity, Percent, Eye } from "lucide-react"

export default function PriceTrackingSimplePage() {
  const [loading, setLoading] = useState(false)

  // Mock data for testing
  const stats = {
    active_alerts: 3,
    tracked_products: 12,
    price_updates_today: 45,
    avg_price_change: -2.3,
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Price Tracking</h2>
          <p className="text-muted-foreground">Monitor price changes and manage alerts across all sources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button variant="outline">Refresh Prices</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Product</Button>
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
            <p className="text-xs text-green-600">Live tracking active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price Change</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avg_price_change.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Alert Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Price Alerts</CardTitle>
          <CardDescription>Price change notifications and threshold alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">iPhone 15 Pro</div>
                  <div className="text-sm text-muted-foreground">Price decreased by $50 (4.2%)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Active</Badge>
                <Button variant="outline" size="sm">
                  Acknowledge
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <div>
                  <div className="font-medium">MacBook Pro M3</div>
                  <div className="text-sm text-muted-foreground">Price increased by $100 (5.1%)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Acknowledged</Badge>
                <Button variant="outline" size="sm">
                  Resolve
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium">Samsung Galaxy S24</div>
                  <div className="text-sm text-muted-foreground">Threshold alert: Below $800</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Resolved</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
