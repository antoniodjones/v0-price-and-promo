"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Settings, Package, DollarSign } from "lucide-react"

interface Market {
  id: string
  name: string
  strategy: "volume" | "tiered" | null
  status: "active" | "pending" | "inactive"
}

interface MarketSelectionProps {
  markets: Market[]
  selectedMarket: string
  onMarketSelect: (marketId: string) => void
  onConfigureStrategy?: () => void
}

export function MarketSelection({
  markets,
  selectedMarket,
  onMarketSelect,
  onConfigureStrategy,
}: MarketSelectionProps) {
  const getStrategyIcon = (strategy: Market["strategy"]) => {
    switch (strategy) {
      case "volume":
        return <Package className="h-4 w-4" />
      case "tiered":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getStrategyColor = (strategy: Market["strategy"]) => {
    switch (strategy) {
      case "volume":
        return "bg-blue-100 text-blue-800"
      case "tiered":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: Market["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gti-dark-green" />
          Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {markets.map((market) => (
          <div
            key={market.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedMarket === market.id
                ? "border-gti-dark-green bg-gti-dark-green/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onMarketSelect(market.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{market.name}</h3>
              <Badge className={getStatusColor(market.status)}>{market.status}</Badge>
            </div>

            <div className="flex items-center gap-2">
              {getStrategyIcon(market.strategy)}
              <Badge className={getStrategyColor(market.strategy)}>
                {market.strategy ? `${market.strategy} pricing` : "Not configured"}
              </Badge>
            </div>

            {selectedMarket === market.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button
                  size="sm"
                  className="w-full bg-gti-dark-green hover:bg-gti-medium-green"
                  onClick={() => {
                    console.log("[v0] Configure Strategy button clicked for market:", market.id)
                    onConfigureStrategy?.()
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Strategy
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
