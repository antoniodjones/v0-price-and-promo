"use client"

import { useWebSocket } from "@/lib/websocket/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Zap, TrendingUp, Clock, DollarSign, AlertCircle, CheckCircle, Loader2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PricingStreamProps {
  customerId?: string
  showCalculationProgress?: boolean
}

export function PricingStream({ customerId, showCalculationProgress = true }: PricingStreamProps) {
  const { connected, error, pricingUpdates, calculationProgress, clearPricingUpdates } = useWebSocket({
    customerId,
    enablePricing: true,
  })

  const getUpdateIcon = (update: any) => {
    switch (update.type) {
      case "discount-activation":
        return <TrendingUp className="h-4 w-4 text-gti-bright-green" />
      case "price-change":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "market-update":
        return <Zap className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getUpdateColor = (update: any) => {
    if (update.isPersonalized) return "border-gti-bright-green bg-gti-light-green/5"
    switch (update.type) {
      case "discount-activation":
        return "border-gti-bright-green bg-gti-light-green/10"
      case "price-change":
        return "border-blue-200 bg-blue-50/50"
      case "market-update":
        return "border-orange-200 bg-orange-50/50"
      default:
        return "border-gray-200 bg-gray-50/50"
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gti-bright-green" />
              <span>Live Pricing Stream</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {connected ? (
                <Badge className="bg-gti-bright-green text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {pricingUpdates.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearPricingUpdates} className="h-6 px-2">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            Real-time pricing updates and discount notifications
            {customerId && " • Personalized for your account"}
          </CardDescription>
        </CardHeader>

        {error && (
          <CardContent className="pt-0">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Calculation Progress */}
      {showCalculationProgress && calculationProgress && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-gti-bright-green" />
              <span>Calculating Pricing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{calculationProgress.message}</span>
                <span>
                  {calculationProgress.step}/{calculationProgress.totalSteps}
                </span>
              </div>
              <Progress value={(calculationProgress.step / calculationProgress.totalSteps) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Updates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Updates</CardTitle>
          <CardDescription>
            {pricingUpdates.length === 0
              ? "No recent pricing updates"
              : `${pricingUpdates.length} recent update${pricingUpdates.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pricingUpdates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for pricing updates...</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {pricingUpdates.map((update, index) => (
                  <div key={index}>
                    <div className={`p-3 rounded-lg border ${getUpdateColor(update)}`}>
                      <div className="flex items-start space-x-3">
                        {getUpdateIcon(update)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">
                              {update.type === "discount-activation" && update.discount?.name}
                              {update.type === "price-change" && "Price Update"}
                              {update.type === "market-update" && "Market Change"}
                              {!update.type && "Pricing Update"}
                            </p>
                            {update.isPersonalized && (
                              <Badge variant="outline" className="text-xs bg-gti-bright-green text-white">
                                Personal
                              </Badge>
                            )}
                          </div>

                          {update.discount && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {update.discount.discountType === "percentage"
                                ? `${update.discount.discountValue}% discount`
                                : `$${update.discount.discountValue} off`}{" "}
                              • {update.discount.reason || "Automatic discount applied"}
                            </p>
                          )}

                          {update.priceChange && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {update.priceChange.product} • ${update.priceChange.oldPrice} → $
                              {update.priceChange.newPrice}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground mt-1">
                            {update.timestamp
                              ? formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < pricingUpdates.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
