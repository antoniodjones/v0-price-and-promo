"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { MarketSettings } from "@/lib/settings"

interface MarketSettingsProps {
  settings: { markets: MarketSettings }
  updateSetting: (path: string, value: any) => void
}

const availableMarkets = [
  { value: "massachusetts", label: "Massachusetts" },
  { value: "california", label: "California" },
  { value: "new-york", label: "New York" },
  { value: "texas", label: "Texas" },
  { value: "florida", label: "Florida" },
]

export default function MarketSettingsComponent({ settings, updateSetting }: MarketSettingsProps) {
  const handleMarketToggle = (marketValue: string, checked: boolean) => {
    const currentMarkets = settings.markets.activeMarkets
    if (checked) {
      updateSetting("markets.activeMarkets", [...currentMarkets, marketValue])
    } else {
      updateSetting(
        "markets.activeMarkets",
        currentMarkets.filter((m) => m !== marketValue),
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Configuration</CardTitle>
          <CardDescription>Configure primary market and tax settings</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryMarket">Primary Market</Label>
            <Select
              value={settings.markets.primaryMarket}
              onValueChange={(value) => updateSetting("markets.primaryMarket", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMarkets.map((market) => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Default market for pricing calculations</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="50"
                step="0.01"
                value={settings.markets.taxRate}
                onChange={(e) => updateSetting("markets.taxRate", Number.parseFloat(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Default tax rate for primary market</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Markets</CardTitle>
          <CardDescription>Select which markets are currently active for sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {availableMarkets.map((market) => (
              <div key={market.value} className="flex items-center space-x-2">
                <Checkbox
                  id={market.value}
                  checked={settings.markets.activeMarkets.includes(market.value)}
                  onCheckedChange={(checked) => handleMarketToggle(market.value, checked as boolean)}
                />
                <Label htmlFor={market.value}>{market.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
