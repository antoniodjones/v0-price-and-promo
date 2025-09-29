"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Percent, DollarSign, TrendingUp, Plus, X } from "lucide-react"

interface BundlePricingStepProps {
  data: any
  onChange: (data: any) => void
}

const discountTypes = [
  {
    id: "percentage",
    title: "Percentage Discount",
    description: "Fixed percentage off the total bundle price",
    icon: Percent,
    example: "20% off when buying all items together",
  },
  {
    id: "fixed",
    title: "Fixed Amount Discount",
    description: "Fixed dollar amount off the total bundle price",
    icon: DollarSign,
    example: "$15 off when buying all items together",
  },
  {
    id: "tiered",
    title: "Tiered Pricing",
    description: "Different discounts based on quantity purchased",
    icon: TrendingUp,
    example: "2-3 items: 10% off, 4+ items: 20% off",
  },
]

export function BundlePricingStep({ data, onChange }: BundlePricingStepProps) {
  const addTier = () => {
    const newTiers = [
      ...(data.tieredPricing || []),
      { minQuantity: 1, maxQuantity: null, discountType: "percentage", discountValue: 0 },
    ]
    onChange({ tieredPricing: newTiers })
  }

  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...(data.tieredPricing || [])]
    newTiers[index] = { ...newTiers[index], [field]: value }
    onChange({ tieredPricing: newTiers })
  }

  const removeTier = (index: number) => {
    const newTiers = (data.tieredPricing || []).filter((_: any, i: number) => i !== index)
    onChange({ tieredPricing: newTiers })
  }

  return (
    <div className="space-y-6">
      {/* Bundle Type Context */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Configure Bundle Pricing</h4>
        <p className="text-sm text-muted-foreground">Set up the discount structure for your {data.bundleType} bundle</p>
      </div>

      {/* Discount Type Selection */}
      <div className="space-y-4">
        <Label>Discount Type *</Label>
        <RadioGroup value={data.discountType} onValueChange={(value) => onChange({ discountType: value })}>
          <div className="grid gap-4">
            {discountTypes.map((type) => (
              <div key={type.id}>
                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                <Label htmlFor={type.id} className="flex cursor-pointer">
                  <Card className="w-full peer-checked:ring-2 peer-checked:ring-gti-bright-green hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gti-light-green rounded-lg">
                          <type.icon className="w-5 h-5 text-gti-dark-green" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-gti-dark-green">{type.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="p-2 bg-muted rounded text-xs">
                        <strong>Example:</strong> {type.example}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Simple Discount Configuration */}
      {(data.discountType === "percentage" || data.discountType === "fixed") && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount {data.discountType === "percentage" ? "Percentage" : "Amount"} *
              </Label>
              <div className="relative">
                {data.discountType === "percentage" && (
                  <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                )}
                {data.discountType === "fixed" && (
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={data.discountType === "percentage" ? "20" : "15.00"}
                  value={data.discountValue || ""}
                  onChange={(e) => onChange({ discountValue: Number.parseFloat(e.target.value) || 0 })}
                  className="pl-10"
                  min="0"
                  max={data.discountType === "percentage" ? "100" : undefined}
                  step={data.discountType === "percentage" ? "1" : "0.01"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tiered Pricing Configuration */}
      {data.discountType === "tiered" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Pricing Tiers</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTier} className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-3">
            {(data.tieredPricing || []).map((tier: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Tier {index + 1}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTier(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Min Quantity</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={tier.minQuantity || ""}
                        onChange={(e) => updateTier(index, "minQuantity", Number.parseInt(e.target.value) || 1)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Quantity</Label>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={tier.maxQuantity || ""}
                        onChange={(e) => updateTier(index, "maxQuantity", Number.parseInt(e.target.value) || null)}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Type</Label>
                      <RadioGroup
                        value={tier.discountType || "percentage"}
                        onValueChange={(value) => updateTier(index, "discountType", value)}
                      >
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id={`percentage-${index}`} />
                            <Label htmlFor={`percentage-${index}`} className="text-sm">
                              %
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id={`fixed-${index}`} />
                            <Label htmlFor={`fixed-${index}`} className="text-sm">
                              $
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Discount Value</Label>
                      <Input
                        type="number"
                        placeholder={tier.discountType === "percentage" ? "20" : "15.00"}
                        value={tier.discountValue || ""}
                        onChange={(e) => updateTier(index, "discountValue", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        max={tier.discountType === "percentage" ? "100" : undefined}
                        step={tier.discountType === "percentage" ? "1" : "0.01"}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!data.tieredPricing || data.tieredPricing.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pricing tiers configured yet</p>
              <p className="text-sm">Click "Add Tier" to create your first pricing tier</p>
            </div>
          )}
        </div>
      )}

      {/* Pricing Preview */}
      {data.discountType && (
        <div className="p-4 bg-gti-light-green rounded-lg">
          <h4 className="font-medium text-gti-dark-green mb-2">Pricing Preview</h4>
          <div className="text-sm text-gti-dark-green">
            {data.discountType === "percentage" && (
              <p>Customers will receive {data.discountValue}% off the bundle total</p>
            )}
            {data.discountType === "fixed" && <p>Customers will receive ${data.discountValue} off the bundle total</p>}
            {data.discountType === "tiered" && (
              <p>{data.tieredPricing?.length || 0} pricing tiers configured with varying discounts</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
