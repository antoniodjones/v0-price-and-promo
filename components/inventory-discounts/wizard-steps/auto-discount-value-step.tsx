"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { RadioField, NumberField } from "@/lib/form-helpers"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

const autoDiscountValueSchema = z.object({
  discountType: z.enum(["percentage", "dollar"], {
    required_error: "Please select a discount type",
  }),
  discountValue: z
    .number()
    .min(0, "Discount value must be positive")
    .refine((val) => val > 0, "Discount value is required"),
})

type AutoDiscountValueFormData = z.infer<typeof autoDiscountValueSchema>

interface AutoDiscountValueStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

export function AutoDiscountValueStep({ formData, updateFormData }: AutoDiscountValueStepProps) {
  const form = useForm<AutoDiscountValueFormData>({
    resolver: zodResolver(autoDiscountValueSchema),
    defaultValues: {
      discountType: formData.discountType || undefined,
      discountValue: formData.discountValue || 0,
    },
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      updateFormData(values as Partial<AutoDiscountFormData>)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  const discountType = form.watch("discountType")
  const discountValue = form.watch("discountValue")

  const getRecommendedValues = () => {
    if (formData.triggerType === "expiration") {
      return discountType === "percentage" ? [15, 20, 25, 30] : [5, 10, 15, 20]
    } else {
      return discountType === "percentage" ? [5, 10, 15, 20] : [3, 5, 8, 10]
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gti-dark-green">Set Discount Amount</h2>
          <p className="text-muted-foreground mt-2">
            Configure the automatic discount value for {formData.triggerType} triggers
          </p>
        </div>

        {/* Discount Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discount Type</CardTitle>
            <CardDescription>Choose between percentage or dollar amount discount</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioField
              form={form}
              name="discountType"
              label=""
              options={[
                { value: "percentage", label: "Percentage Off" },
                { value: "dollar", label: "Dollar Amount Off" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Discount Value Input */}
        {discountType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discount Value</CardTitle>
              <CardDescription>
                Enter the {discountType === "percentage" ? "percentage" : "dollar amount"} to automatically discount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-w-xs">
                  <NumberField
                    form={form}
                    name="discountValue"
                    label=""
                    placeholder={discountType === "percentage" ? "20" : "10.00"}
                    required
                  />
                </div>

                {/* Recommended Values */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Recommended for {formData.triggerType === "expiration" ? "Expiration" : "THC"} Discounts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedValues().map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => form.setValue("discountValue", value)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                          discountValue === value
                            ? "bg-gti-bright-green text-white border-gti-bright-green"
                            : "hover:border-gti-light-green"
                        }`}
                      >
                        {discountType === "percentage" ? `${value}%` : `$${value}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business Guidance */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800 mb-1">Business Guidance:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {formData.triggerType === "expiration" ? (
                      <>
                        <li>• 15-25% for products 30+ days from expiration</li>
                        <li>• 25-35% for products 14-30 days from expiration</li>
                        <li>• 35-50% for products under 14 days from expiration</li>
                      </>
                    ) : (
                      <>
                        <li>• 5-10% for slightly below-average THC levels</li>
                        <li>• 10-15% for significantly below-average THC levels</li>
                        <li>• Consider category-specific thresholds</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview */}
        {discountType && discountValue > 0 && (
          <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
              <p className="text-sm font-medium text-gti-dark-green">Automatic Discount Preview</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              When trigger conditions are met, products will automatically receive{" "}
              <span className="font-medium text-gti-dark-green">
                {discountType === "percentage" ? `${discountValue}% off` : `$${discountValue.toFixed(2)} off`}
              </span>
            </p>

            {/* Example calculation */}
            <div className="mt-3 p-3 bg-white rounded border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Example Batch Impact:</p>
              <div className="flex justify-between text-sm">
                <span>Original price: $100.00</span>
                <span className="text-gti-dark-green font-medium">
                  Auto price: $
                  {discountType === "percentage"
                    ? (100 - (100 * discountValue) / 100).toFixed(2)
                    : Math.max(0, 100 - discountValue).toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Applied automatically when {formData.triggerType} conditions are met
              </div>
            </div>
          </div>
        )}
      </div>
    </Form>
  )
}
