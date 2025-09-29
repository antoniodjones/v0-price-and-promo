"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, MapPin, ShoppingCart } from "lucide-react"

interface BundleRulesStepProps {
  data: any
  onChange: (data: any) => void
}

const customerTiers = [
  { id: "bronze", name: "Bronze", description: "New customers" },
  { id: "silver", name: "Silver", description: "Regular customers" },
  { id: "gold", name: "Gold", description: "VIP customers" },
  { id: "platinum", name: "Platinum", description: "Premium customers" },
]

const markets = [
  { id: "massachusetts", name: "Massachusetts" },
  { id: "illinois", name: "Illinois" },
  { id: "pennsylvania", name: "Pennsylvania" },
  { id: "new-jersey", name: "New Jersey" },
]

export function BundleRulesStep({ data, onChange }: BundleRulesStepProps) {
  const handleCustomerTierToggle = (tierId: string) => {
    const currentTiers = data.customerTiers || []
    const isSelected = currentTiers.includes(tierId)

    let newTiers
    if (isSelected) {
      newTiers = currentTiers.filter((t: string) => t !== tierId)
    } else {
      newTiers = [...currentTiers, tierId]
    }

    onChange({ customerTiers: newTiers })
  }

  const handleMarketToggle = (marketId: string) => {
    const currentMarkets = data.markets || []
    const isSelected = currentMarkets.includes(marketId)

    let newMarkets
    if (isSelected) {
      newMarkets = currentMarkets.filter((m: string) => m !== marketId)
    } else {
      newMarkets = [...currentMarkets, marketId]
    }

    onChange({ markets: newMarkets })
  }

  return (
    <div className="space-y-6">
      {/* Bundle Context */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Configure Bundle Rules</h4>
        <p className="text-sm text-muted-foreground">
          Set quantity limits, customer eligibility, and market availability for your bundle
        </p>
      </div>

      {/* Quantity Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <ShoppingCart className="w-5 h-5" />
            Quantity Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum Quantity</Label>
              <Input
                id="minQuantity"
                type="number"
                placeholder="1"
                value={data.minQuantity || ""}
                onChange={(e) => onChange({ minQuantity: Number.parseInt(e.target.value) || 1 })}
                min="1"
              />
              <p className="text-xs text-muted-foreground">Minimum number of items required for bundle</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxQuantity">Maximum Quantity (Optional)</Label>
              <Input
                id="maxQuantity"
                type="number"
                placeholder="Unlimited"
                value={data.maxQuantity || ""}
                onChange={(e) => onChange({ maxQuantity: Number.parseInt(e.target.value) || null })}
                min="1"
              />
              <p className="text-xs text-muted-foreground">Leave empty for unlimited quantity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Users className="w-5 h-5" />
            Customer Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Customer Tiers (Select all that apply)</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {customerTiers.map((tier) => (
                <Card
                  key={tier.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    (data.customerTiers || []).includes(tier.id) ? "ring-2 ring-gti-bright-green" : ""
                  }`}
                  onClick={() => handleCustomerTierToggle(tier.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">{tier.description}</div>
                      </div>
                      <Checkbox
                        checked={(data.customerTiers || []).includes(tier.id)}
                        onChange={() => handleCustomerTierToggle(tier.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              If no tiers are selected, bundle will be available to all customers
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Market Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <MapPin className="w-5 h-5" />
            Market Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Available Markets (Select all that apply)</Label>
            <div className="grid gap-3 md:grid-cols-2">
              {markets.map((market) => (
                <Card
                  key={market.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    (data.markets || []).includes(market.id) ? "ring-2 ring-gti-bright-green" : ""
                  }`}
                  onClick={() => handleMarketToggle(market.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{market.name}</div>
                      <Checkbox
                        checked={(data.markets || []).includes(market.id)}
                        onChange={() => handleMarketToggle(market.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Bundle will only be available in selected markets</p>
          </div>
        </CardContent>
      </Card>

      {/* Rules Summary */}
      {(data.minQuantity ||
        data.maxQuantity ||
        (data.customerTiers && data.customerTiers.length > 0) ||
        (data.markets && data.markets.length > 0)) && (
        <div className="p-4 bg-gti-light-green rounded-lg">
          <h4 className="font-medium text-gti-dark-green mb-3">Rules Summary</h4>
          <div className="space-y-2 text-sm text-gti-dark-green">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>
                Quantity: {data.minQuantity || 1} - {data.maxQuantity || "unlimited"} items
              </span>
            </div>

            {data.customerTiers && data.customerTiers.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  Customer Tiers:{" "}
                  {data.customerTiers.map((id: string) => customerTiers.find((t) => t.id === id)?.name).join(", ")}
                </span>
              </div>
            )}

            {data.markets && data.markets.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  Markets: {data.markets.map((id: string) => markets.find((m) => m.id === id)?.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
