"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Percent, DollarSign, TrendingUp, Plus, X } from "lucide-react"
import { RadioField, NumberField } from "@/lib/form-helpers"

const bundlePricingSchema = z.object({
  discountType: z.enum(["percentage", "fixed", "tiered"], {
    required_error: "Please select a discount type",
  }),
  discountValue: z.number().min(0, "Discount value must be positive").optional(),
  tieredPricing: z
    .array(
      z.object({
        minQuantity: z.number().min(1, "Min quantity must be at least 1"),
        maxQuantity: z.number().nullable(),
        discountType: z.enum(["percentage", "fixed"]),
        discountValue: z.number().min(0, "Discount value must be positive"),
      }),
    )
    .optional(),
})

type BundlePricingFormData = z.infer<typeof bundlePricingSchema>

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
  const form = useForm<BundlePricingFormData>({
    resolver: zodResolver(bundlePricingSchema),
    defaultValues: {
      discountType: data.discountType || undefined,
      discountValue: data.discountValue || 0,
      tieredPricing: data.tieredPricing || [],
    },
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values)
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  const tieredPricing = form.watch("tieredPricing") || []
  const discountType = form.watch("discountType")
  const discountValue = form.watch("discountValue")

  const addTier = () => {
    const newTiers = [
      ...tieredPricing,
      { minQuantity: 1, maxQuantity: null, discountType: "percentage" as const, discountValue: 0 },
    ]
    form.setValue("tieredPricing", newTiers)
  }

  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...tieredPricing]
    newTiers[index] = { ...newTiers[index], [field]: value }
    form.setValue("tieredPricing", newTiers)
  }

  const removeTier = (index: number) => {
    const newTiers = tieredPricing.filter((_: any, i: number) => i !== index)
    form.setValue("tieredPricing", newTiers)
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Bundle Type Context */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Configure Bundle Pricing</h4>
          <p className="text-sm text-muted-foreground">
            Set up the discount structure for your {data.bundleType} bundle
          </p>
        </div>

        {/* Discount Type Selection */}
        <div className="space-y-4">
          <RadioField
            form={form}
            name="discountType"
            label="Discount Type"
            required
            options={discountTypes.map((type) => ({
              value: type.id,
              label: type.title,
              description: type.description,
            }))}
          />
        </div>

        {/* Simple Discount Configuration */}
        {(discountType === "percentage" || discountType === "fixed") && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                form={form}
                name="discountValue"
                label={`Discount ${discountType === "percentage" ? "Percentage" : "Amount"}`}
                placeholder={discountType === "percentage" ? "20" : "15.00"}
                required
              />
            </div>
          </div>
        )}

        {/* Tiered Pricing Configuration */}
        {discountType === "tiered" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Pricing Tiers</label>
              <Button type="button" variant="outline" size="sm" onClick={addTier} className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add Tier
              </Button>
            </div>

            <div className="space-y-3">
              {tieredPricing.map((tier: any, index: number) => (
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
                        <label className="text-sm font-medium">Min Quantity</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={tier.minQuantity || ""}
                          onChange={(e) => updateTier(index, "minQuantity", Number.parseInt(e.target.value) || 1)}
                          min="1"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Max Quantity</label>
                        <input
                          type="number"
                          placeholder="Unlimited"
                          value={tier.maxQuantity || ""}
                          onChange={(e) => updateTier(index, "maxQuantity", Number.parseInt(e.target.value) || null)}
                          min="1"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Discount Type</label>
                        <select
                          value={tier.discountType || "percentage"}
                          onChange={(e) => updateTier(index, "discountType", e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Discount Value</label>
                        <input
                          type="number"
                          placeholder={tier.discountType === "percentage" ? "20" : "15.00"}
                          value={tier.discountValue || ""}
                          onChange={(e) => updateTier(index, "discountValue", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          max={tier.discountType === "percentage" ? 100 : undefined}
                          step={tier.discountType === "percentage" ? 1 : 0.01}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {tieredPricing.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pricing tiers configured yet</p>
                <p className="text-sm">Click "Add Tier" to create your first pricing tier</p>
              </div>
            )}
          </div>
        )}

        {/* Pricing Preview */}
        {discountType && (
          <div className="p-4 bg-gti-light-green rounded-lg">
            <h4 className="font-medium text-gti-dark-green mb-2">Pricing Preview</h4>
            <div className="text-sm text-gti-dark-green">
              {discountType === "percentage" && <p>Customers will receive {discountValue}% off the bundle total</p>}
              {discountType === "fixed" && <p>Customers will receive ${discountValue} off the bundle total</p>}
              {discountType === "tiered" && (
                <p>{tieredPricing.length || 0} pricing tiers configured with varying discounts</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Form>
  )
}
