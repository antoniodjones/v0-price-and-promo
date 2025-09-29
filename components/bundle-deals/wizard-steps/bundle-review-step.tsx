"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Package, Percent, DollarSign, TrendingUp, Users, Calendar, ShoppingCart, CheckCircle } from "lucide-react"

interface BundleReviewStepProps {
  data: any
  onChange: (data: any) => void
}

const bundleTypeLabels = {
  fixed: "Fixed Product Bundle",
  category: "Category Bundle",
  "mix-match": "Mix & Match",
  tiered: "Tiered Bundle",
}

const discountTypeLabels = {
  percentage: "Percentage Discount",
  fixed: "Fixed Amount Discount",
  tiered: "Tiered Pricing",
}

const customerTiers = [
  { id: "bronze", name: "Bronze" },
  { id: "silver", name: "Silver" },
  { id: "gold", name: "Gold" },
  { id: "platinum", name: "Platinum" },
]

const markets = [
  { id: "massachusetts", name: "Massachusetts" },
  { id: "illinois", name: "Illinois" },
  { id: "pennsylvania", name: "Pennsylvania" },
  { id: "new-jersey", name: "New Jersey" },
]

export function BundleReviewStep({ data, onChange }: BundleReviewStepProps) {
  const handleCreateBundle = async () => {
    console.log("[v0] BundleReviewStep: Creating bundle with data:", data)

    try {
      const response = await fetch("/api/bundle-deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create bundle")
      }

      const result = await response.json()
      console.log("[v0] BundleReviewStep: Bundle created successfully:", result)

      // You could redirect or show success message here
      // For now, just log success
      alert("Bundle created successfully!")
    } catch (error) {
      console.error("[v0] BundleReviewStep: Error creating bundle:", error)
      alert("Failed to create bundle. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Review Bundle Configuration</h4>
        <p className="text-sm text-muted-foreground">Review all settings before creating your bundle deal</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Package className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Bundle Name</Label>
            <p className="text-sm text-muted-foreground">{data.name || "Not specified"}</p>
          </div>

          {data.description && (
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium">Bundle Type</Label>
            <Badge variant="outline" className="ml-2">
              {bundleTypeLabels[data.bundleType as keyof typeof bundleTypeLabels] || data.bundleType}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products & Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <ShoppingCart className="w-5 h-5" />
            Products & Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.categories && data.categories.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Categories</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.categories.map((category: string) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {data.products && data.products.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Products</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.products.map((product: any) => (
                  <Badge key={product.id} variant="secondary">
                    {product.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(!data.categories || data.categories.length === 0) && (!data.products || data.products.length === 0) && (
            <p className="text-sm text-muted-foreground">No products or categories selected</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            {data.discountType === "percentage" && <Percent className="w-5 h-5" />}
            {data.discountType === "fixed" && <DollarSign className="w-5 h-5" />}
            {data.discountType === "tiered" && <TrendingUp className="w-5 h-5" />}
            Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Discount Type</Label>
            <Badge variant="outline" className="ml-2">
              {discountTypeLabels[data.discountType as keyof typeof discountTypeLabels] || data.discountType}
            </Badge>
          </div>

          {data.discountType === "percentage" && (
            <div>
              <Label className="text-sm font-medium">Discount Percentage</Label>
              <p className="text-sm text-muted-foreground">{data.discountValue}%</p>
            </div>
          )}

          {data.discountType === "fixed" && (
            <div>
              <Label className="text-sm font-medium">Discount Amount</Label>
              <p className="text-sm text-muted-foreground">${data.discountValue}</p>
            </div>
          )}

          {data.discountType === "tiered" && data.tieredPricing && (
            <div>
              <Label className="text-sm font-medium">Pricing Tiers</Label>
              <div className="space-y-2 mt-1">
                {data.tieredPricing.map((tier: any, index: number) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm">
                    <span className="font-medium">Tier {index + 1}:</span> {tier.minQuantity}-{tier.maxQuantity || "∞"}{" "}
                    items → {tier.discountValue}
                    {tier.discountType === "percentage" ? "%" : "$"} off
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules & Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Users className="w-5 h-5" />
            Rules & Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Quantity Range</Label>
            <p className="text-sm text-muted-foreground">
              {data.minQuantity || 1} - {data.maxQuantity || "unlimited"} items
            </p>
          </div>

          {data.customerTiers && data.customerTiers.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Customer Tiers</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.customerTiers.map((tierId: string) => {
                  const tier = customerTiers.find((t) => t.id === tierId)
                  return tier ? (
                    <Badge key={tierId} variant="secondary">
                      {tier.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}

          {data.markets && data.markets.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Available Markets</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.markets.map((marketId: string) => {
                  const market = markets.find((m) => m.id === marketId)
                  return market ? (
                    <Badge key={marketId} variant="secondary">
                      {market.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule & Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gti-dark-green">
            <Calendar className="w-5 h-5" />
            Schedule & Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.startDate && (
            <div>
              <Label className="text-sm font-medium">Active Period</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(data.startDate).toLocaleDateString()}
                {data.endDate ? ` - ${new Date(data.endDate).toLocaleDateString()}` : " (no end date)"}
              </p>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">Total Usage Limit</Label>
              <p className="text-sm text-muted-foreground">{data.usageLimit || "Unlimited"}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Per Customer Limit</Label>
              <p className="text-sm text-muted-foreground">{data.perCustomerLimit || "Unlimited"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Bundle Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleCreateBundle}
          className="bg-gti-bright-green hover:bg-gti-medium-green text-white px-8 py-2"
          size="lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Create Bundle Deal
        </Button>
      </div>
    </div>
  )
}
