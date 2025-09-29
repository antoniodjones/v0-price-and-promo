"use client"

import { useWebSocket } from "@/lib/websocket/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Package, Clock, Zap, CheckCircle, AlertCircle, X, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function InventoryAlerts() {
  const { connected, error, inventoryAlerts, clearInventoryAlerts } = useWebSocket({
    enableInventory: true,
  })

  const getAlertIcon = (alert: any) => {
    try {
      const alertType = alert?.type || "default"
      switch (alertType) {
        case "expiration":
          return <Clock className="h-4 w-4 text-orange-500" />
        case "low-thc":
          return <TrendingDown className="h-4 w-4 text-purple-500" />
        case "discount-applied":
          return <Zap className="h-4 w-4 text-gti-bright-green" />
        case "batch-alert":
          return <AlertTriangle className="h-4 w-4 text-red-500" />
        default:
          return <Package className="h-4 w-4 text-gray-500" />
      }
    } catch {
      return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (alert: any) => {
    try {
      const severity = alert?.severity || alert?.type || "default"
      switch (severity) {
        case "high":
        case "critical":
          return "border-red-200 bg-red-50/50"
        case "medium":
        case "expiration":
          return "border-orange-200 bg-orange-50/50"
        case "low":
        case "discount-applied":
          return "border-gti-light-green bg-gti-light-green/10"
        default:
          return "border-gray-200 bg-gray-50/50"
      }
    } catch {
      return "border-gray-200 bg-gray-50/50"
    }
  }

  const getSeverityBadge = (severity: string) => {
    try {
      const safeSeverity = (severity || "unknown").toLowerCase()
      switch (safeSeverity) {
        case "high":
        case "critical":
          return <Badge variant="destructive">{safeSeverity}</Badge>
        case "medium":
          return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{safeSeverity}</Badge>
        case "low":
          return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{safeSeverity}</Badge>
        default:
          return <Badge variant="outline">{safeSeverity}</Badge>
      }
    } catch {
      return <Badge variant="outline">unknown</Badge>
    }
  }

  const safeInventoryAlerts = Array.isArray(inventoryAlerts) ? inventoryAlerts : []

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Live Inventory Alerts</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {connected ? (
              <Badge className="bg-gti-bright-green text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            {safeInventoryAlerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  try {
                    clearInventoryAlerts?.()
                  } catch (error) {
                    console.error("[v0] Error clearing alerts:", error)
                  }
                }}
                className="h-6 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Real-time inventory monitoring and automatic discount alerts</CardDescription>
      </CardHeader>

      {error && (
        <CardContent className="pt-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error || "Connection error"}</span>
            </div>
          </div>
        </CardContent>
      )}

      <CardContent>
        {safeInventoryAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent inventory alerts</p>
            <p className="text-xs mt-1">System is monitoring inventory conditions</p>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {safeInventoryAlerts.map((alert, index) => {
                try {
                  const alertData = alert || {}
                  const batchNumber = alertData.batchNumber || alertData.productName || "Unknown Item"
                  const message = alertData.message || alertData.reason || "No details available"
                  const discountApplied = alertData.discountApplied
                  const daysToExpiration = alertData.daysToExpiration
                  const thcPercentage = alertData.thcPercentage
                  const timestamp = alertData.timestamp

                  return (
                    <div key={`alert-${index}`}>
                      <div className={`p-3 rounded-lg border ${getAlertColor(alertData)}`}>
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alertData)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium">{batchNumber}</p>
                              {alertData.severity && getSeverityBadge(alertData.severity)}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              {alertData.product && `${alertData.product} • `}
                              {alertData.brand && `${alertData.brand} • `}
                              {message}
                            </p>

                            {discountApplied && typeof discountApplied === "number" && (
                              <p className="text-xs text-gti-bright-green font-medium mt-1">
                                {discountApplied}% discount automatically applied
                              </p>
                            )}

                            {daysToExpiration !== undefined && typeof daysToExpiration === "number" && (
                              <p className="text-xs text-orange-600 mt-1">{daysToExpiration} days until expiration</p>
                            )}

                            {thcPercentage && typeof thcPercentage === "number" && (
                              <p className="text-xs text-purple-600 mt-1">{thcPercentage}% THC</p>
                            )}

                            <p className="text-xs text-muted-foreground mt-1">
                              {timestamp
                                ? (() => {
                                    try {
                                      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
                                    } catch {
                                      return "Recently"
                                    }
                                  })()
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < safeInventoryAlerts.length - 1 && <Separator className="my-2" />}
                    </div>
                  )
                } catch (alertError) {
                  console.error("[v0] Error rendering alert:", alertError)
                  return (
                    <div key={`error-alert-${index}`} className="p-3 rounded-lg border border-red-200 bg-red-50/50">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700">Error displaying alert</span>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
