"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Zap, AlertTriangle, TrendingUp, Package, Eye } from "lucide-react"

// Mock data for real-time monitoring
const mockBatchAlerts = [
  {
    id: "batch-1",
    batchNumber: "BH-2025-0892",
    product: "Blue Dream 1oz",
    brand: "Premium Cannabis Co",
    expirationDate: "2025-11-15",
    daysToExpiration: 25,
    thcPercentage: 18.5,
    currentDiscount: 20,
    discountReason: "30-day expiration rule",
    status: "discounted",
    severity: "medium",
  },
  {
    id: "batch-2",
    batchNumber: "BH-2025-0893",
    product: "Sour Diesel 1oz",
    brand: "Green Thumb",
    expirationDate: "2025-11-08",
    daysToExpiration: 18,
    thcPercentage: 12.3,
    currentDiscount: 30,
    discountReason: "Multiple rules applied (best: 30% expiration)",
    status: "discounted",
    severity: "high",
  },
  {
    id: "batch-3",
    batchNumber: "BH-2025-0894",
    product: "Wedding Cake 1oz",
    brand: "Rise",
    expirationDate: "2025-12-01",
    daysToExpiration: 41,
    thcPercentage: 13.8,
    currentDiscount: 10,
    discountReason: "Low THC discount",
    status: "discounted",
    severity: "low",
  },
  {
    id: "batch-4",
    batchNumber: "BH-2025-0895",
    product: "OG Kush 1oz",
    brand: "Premium Cannabis Co",
    expirationDate: "2025-11-05",
    daysToExpiration: 15,
    thcPercentage: 19.2,
    currentDiscount: 0,
    discountReason: "Approaching 14-day threshold",
    status: "pending",
    severity: "high",
  },
]

const mockStats = {
  totalBatchesMonitored: 1247,
  batchesWithDiscounts: 43,
  averageDiscount: 18.5,
  totalSavingsToday: 2340.0,
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "low":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "discounted":
      return <TrendingUp className="h-3 w-3 text-gti-bright-green" />
    case "pending":
      return <Clock className="h-3 w-3 text-orange-500" />
    default:
      return <Package className="h-3 w-3 text-gray-500" />
  }
}

export function InventoryMonitoring() {
  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-4 w-4 text-gti-bright-green" />
            <span>Real-time Monitoring</span>
          </CardTitle>
          <CardDescription>Live inventory discount tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gti-dark-green">{mockStats.totalBatchesMonitored}</div>
              <div className="text-xs text-muted-foreground">Batches Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gti-bright-green">{mockStats.batchesWithDiscounts}</div>
              <div className="text-xs text-muted-foreground">Active Discounts</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Average Discount</span>
              <span className="font-medium">{mockStats.averageDiscount}%</span>
            </div>
            <Progress value={mockStats.averageDiscount} className="h-2" />
          </div>
          <div className="text-center pt-2 border-t">
            <div className="text-lg font-bold text-gti-dark-green">${mockStats.totalSavingsToday.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Savings Applied Today</div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span>Batch Alerts</span>
          </CardTitle>
          <CardDescription>Batches requiring attention or recently discounted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBatchAlerts.map((batch) => (
              <div key={batch.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(batch.status)}
                      <span className="font-medium text-sm">{batch.batchNumber}</span>
                      <Badge variant="outline" className={getSeverityColor(batch.severity)}>
                        {batch.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {batch.product} • {batch.brand}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {batch.daysToExpiration} days to expiration • {batch.thcPercentage}% THC
                    </div>
                    {batch.currentDiscount > 0 && (
                      <div className="text-xs text-gti-bright-green font-medium mt-1">
                        {batch.currentDiscount}% discount applied
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">{batch.discountReason}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Package className="mr-2 h-4 w-4" />
            View All Discounted Batches
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Expiring Soon Report
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Zap className="mr-2 h-4 w-4" />
            Low THC Inventory
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
