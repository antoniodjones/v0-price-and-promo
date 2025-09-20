"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { DiscountSettings } from "@/lib/settings"

interface DiscountSettingsProps {
  settings: { discounts: DiscountSettings }
  updateSetting: (path: string, value: any) => void
}

export default function DiscountSettingsComponent({ settings, updateSetting }: DiscountSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default Discount Limits</CardTitle>
          <CardDescription>Set maximum discount percentages to protect profit margins</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerDiscountMax">Customer Discount Maximum</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="customerDiscountMax"
                type="number"
                min="0"
                max="100"
                value={settings.discounts.customerDiscountMax}
                onChange={(e) => updateSetting("discounts.customerDiscountMax", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum discount for customer-specific promotions</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventoryDiscountMax">Inventory Discount Maximum</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="inventoryDiscountMax"
                type="number"
                min="0"
                max="100"
                value={settings.discounts.inventoryDiscountMax}
                onChange={(e) => updateSetting("discounts.inventoryDiscountMax", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum discount for expiring inventory</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundleDiscountMax">Bundle Discount Maximum</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="bundleDiscountMax"
                type="number"
                min="0"
                max="100"
                value={settings.discounts.bundleDiscountMax}
                onChange={(e) => updateSetting("discounts.bundleDiscountMax", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum discount for bundle deals</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volumeDiscountMax">Volume Discount Maximum</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="volumeDiscountMax"
                type="number"
                min="0"
                max="100"
                value={settings.discounts.volumeDiscountMax}
                onChange={(e) => updateSetting("discounts.volumeDiscountMax", Number.parseInt(e.target.value))}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground">Maximum discount for volume purchases</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount Policies</CardTitle>
          <CardDescription>Configure approval requirements and stacking rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Approval for High Discounts</Label>
              <p className="text-sm text-muted-foreground">Discounts above 50% require manager approval</p>
            </div>
            <Switch
              checked={settings.discounts.requireApproval}
              onCheckedChange={(checked) => updateSetting("discounts.requireApproval", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stack Multiple Discounts</Label>
              <p className="text-sm text-muted-foreground">Allow combining customer and inventory discounts</p>
            </div>
            <Switch
              checked={settings.discounts.stackDiscounts}
              onCheckedChange={(checked) => updateSetting("discounts.stackDiscounts", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
