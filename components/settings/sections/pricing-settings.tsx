"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PricingSettings } from "@/lib/settings"

interface PricingSettingsProps {
  settings: { pricing: PricingSettings }
  updateSetting: (path: string, value: any) => void
}

export default function PricingSettingsComponent({ settings, updateSetting }: PricingSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
          <CardDescription>Configure minimum margins and bulk pricing thresholds</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="minimumMargin">Minimum Margin</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="minimumMargin"
                type="number"
                min="0"
                max="100"
                value={settings.pricing.minimumMargin}
                onChange={(e) => updateSetting("pricing.minimumMargin", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Minimum profit margin to maintain</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulkThreshold">Bulk Pricing Threshold</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="bulkThreshold"
                type="number"
                min="1"
                value={settings.pricing.bulkThreshold}
                onChange={(e) => updateSetting("pricing.bulkThreshold", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">units</span>
            </div>
            <p className="text-sm text-muted-foreground">Minimum quantity for bulk pricing</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="premiumMarkup">Premium Product Markup</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="premiumMarkup"
                type="number"
                min="0"
                max="200"
                value={settings.pricing.premiumMarkup}
                onChange={(e) => updateSetting("pricing.premiumMarkup", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Additional markup for premium products</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Default Currency</Label>
            <Select
              value={settings.pricing.currency}
              onValueChange={(value) => updateSetting("pricing.currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="cad">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Primary currency for pricing</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
