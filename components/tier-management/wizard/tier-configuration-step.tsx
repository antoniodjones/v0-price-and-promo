"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Percent, DollarSign, Tag } from "lucide-react"

interface TierConfigurationStepProps {
  data: {
    tiers: Array<{
      tier: "A" | "B" | "C"
      discount_type: "percentage" | "fixed_amount" | "price_override"
      discount_value: number
      min_quantity?: number
      max_quantity?: number
    }>
  }
  onUpdate: (data: any) => void
}

const TIER_INFO = {
  A: {
    name: "Tier A",
    color: "bg-green-500",
    description: "Premium tier - Highest discount level",
    icon: "🏆",
  },
  B: {
    name: "Tier B",
    color: "bg-blue-500",
    description: "Standard tier - Mid-level discount",
    icon: "⭐",
  },
  C: {
    name: "Tier C",
    color: "bg-orange-500",
    description: "Basic tier - Entry-level discount",
    icon: "📦",
  },
}

export function TierConfigurationStep({ data, onUpdate }: TierConfigurationStepProps) {
  const handleTierChange = (tierIndex: number, field: string, value: any) => {
    const updatedTiers = [...data.tiers]
    updatedTiers[tierIndex] = {
      ...updatedTiers[tierIndex],
      [field]: value,
    }
    onUpdate({ tiers: updatedTiers })
  }

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-4 w-4" />
      case "fixed_amount":
        return <DollarSign className="h-4 w-4" />
      case "price_override":
        return <Tag className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium">Configure Tier Pricing</p>
          <p className="text-xs mt-1">
            Set up discount values for each customer tier (A, B, C). Tier A typically receives the highest discount,
            followed by B and C. You can use percentage discounts, fixed amounts, or price overrides.
          </p>
        </div>
      </div>

      {/* Tier Configuration Cards */}
      {data.tiers.map((tier, index) => {
        const tierInfo = TIER_INFO[tier.tier]
        return (
          <Card key={tier.tier} className="border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{tierInfo.icon}</div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {tierInfo.name}
                      <Badge className={tierInfo.color}>{tier.tier}</Badge>
                    </CardTitle>
                    <CardDescription>{tierInfo.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Discount Type and Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`tier-${tier.tier}-type`}>
                    Discount Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={tier.discount_type}
                    onValueChange={(value: any) => handleTierChange(index, "discount_type", value)}
                  >
                    <SelectTrigger id={`tier-${tier.tier}-type`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Percentage Discount</span>
                            <span className="text-xs text-muted-foreground">e.g., 15% off</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed_amount">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Fixed Amount</span>
                            <span className="text-xs text-muted-foreground">e.g., $10 off</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="price_override">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">Price Override</span>
                            <span className="text-xs text-muted-foreground">Set specific price</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`tier-${tier.tier}-value`}>
                    {tier.discount_type === "percentage"
                      ? "Discount Percentage"
                      : tier.discount_type === "fixed_amount"
                        ? "Discount Amount ($)"
                        : "Override Price ($)"}
                    <span className="text-red-500"> *</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {getDiscountIcon(tier.discount_type)}
                    </div>
                    <Input
                      id={`tier-${tier.tier}-value`}
                      type="number"
                      min="0"
                      step={tier.discount_type === "percentage" ? "0.01" : "0.01"}
                      max={tier.discount_type === "percentage" ? "100" : undefined}
                      value={tier.discount_value}
                      onChange={(e) =>
                        handleTierChange(index, "discount_value", Number.parseFloat(e.target.value) || 0)
                      }
                      className="pl-10"
                      placeholder={
                        tier.discount_type === "percentage"
                          ? "e.g., 15"
                          : tier.discount_type === "fixed_amount"
                            ? "e.g., 10.00"
                            : "e.g., 45.00"
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tier.discount_type === "percentage"
                      ? "Enter percentage (0-100)"
                      : tier.discount_type === "fixed_amount"
                        ? "Enter dollar amount to discount"
                        : "Enter the final price customers will pay"}
                  </p>
                </div>
              </div>

              {/* Volume Pricing (Optional) */}
              <div className="pt-4 border-t">
                <div className="mb-3">
                  <Label className="text-sm font-medium">Volume Pricing (Optional)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set quantity thresholds for this tier's discount to apply
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`tier-${tier.tier}-min`} className="text-sm">
                      Minimum Quantity
                    </Label>
                    <Input
                      id={`tier-${tier.tier}-min`}
                      type="number"
                      min="0"
                      value={tier.min_quantity || ""}
                      onChange={(e) =>
                        handleTierChange(
                          index,
                          "min_quantity",
                          e.target.value ? Number.parseInt(e.target.value) : undefined,
                        )
                      }
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`tier-${tier.tier}-max`} className="text-sm">
                      Maximum Quantity
                    </Label>
                    <Input
                      id={`tier-${tier.tier}-max`}
                      type="number"
                      min={tier.min_quantity || 0}
                      value={tier.max_quantity || ""}
                      onChange={(e) =>
                        handleTierChange(
                          index,
                          "max_quantity",
                          e.target.value ? Number.parseInt(e.target.value) : undefined,
                        )
                      }
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <div className="text-sm">
                  <span className="font-medium">Preview: </span>
                  {tier.discount_type === "percentage" && (
                    <span>
                      Customers in Tier {tier.tier} receive{" "}
                      <span className="font-semibold text-gti-bright-green">{tier.discount_value}% off</span>
                    </span>
                  )}
                  {tier.discount_type === "fixed_amount" && (
                    <span>
                      Customers in Tier {tier.tier} receive{" "}
                      <span className="font-semibold text-gti-bright-green">${tier.discount_value} off</span>
                    </span>
                  )}
                  {tier.discount_type === "price_override" && (
                    <span>
                      Customers in Tier {tier.tier} pay{" "}
                      <span className="font-semibold text-gti-bright-green">${tier.discount_value}</span>
                    </span>
                  )}
                  {(tier.min_quantity || tier.max_quantity) && (
                    <span className="text-muted-foreground">
                      {" "}
                      (for quantities{" "}
                      {tier.min_quantity && tier.max_quantity
                        ? `${tier.min_quantity}-${tier.max_quantity}`
                        : tier.min_quantity
                          ? `${tier.min_quantity}+`
                          : `up to ${tier.max_quantity}`}
                      )
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-gti-bright-green/5 to-gti-medium-green/5 border-gti-bright-green/20">
        <CardHeader>
          <CardTitle className="text-lg">Tier Summary</CardTitle>
          <CardDescription>Quick overview of your tier configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.tiers.map((tier) => {
              const tierInfo = TIER_INFO[tier.tier]
              return (
                <div key={tier.tier} className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{tierInfo.icon}</span>
                    <Badge className={tierInfo.color}>{tier.tier}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gti-bright-green">
                    {tier.discount_type === "percentage" && `${tier.discount_value}%`}
                    {tier.discount_type === "fixed_amount" && `$${tier.discount_value}`}
                    {tier.discount_type === "price_override" && `$${tier.discount_value}`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tier.discount_type === "percentage" && "Percentage off"}
                    {tier.discount_type === "fixed_amount" && "Dollar discount"}
                    {tier.discount_type === "price_override" && "Fixed price"}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
