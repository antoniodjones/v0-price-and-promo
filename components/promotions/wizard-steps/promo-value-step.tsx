"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Percent, DollarSign, Tag } from "lucide-react"
import { createNumberField } from "@/lib/form-helpers"
import type { PromoFormData } from "../promotional-discount-wizard"

const valueSchema = z
  .object({
    discountType: z.enum(["percentage", "fixed", "specific_price"], {
      required_error: "Please select a discount type",
    }),
    discountValue: z.number().min(0, "Value must be positive"),
    specificPrice: z.number().min(0, "Price must be positive").optional(),
  })
  .refine(
    (data) => {
      if (data.discountType === "percentage") {
        return data.discountValue <= 100
      }
      return true
    },
    {
      message: "Percentage cannot exceed 100%",
      path: ["discountValue"],
    },
  )

type ValueFormValues = z.infer<typeof valueSchema>

interface PromoValueStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

const discountTypes = [
  {
    id: "percentage" as const,
    name: "Percentage Off",
    description: "Discount as a percentage of the original price",
    icon: Percent,
    example: "25% off original price",
    color: "bg-blue-500",
  },
  {
    id: "fixed" as const,
    name: "Dollar Amount Off",
    description: "Fixed dollar amount discount",
    icon: DollarSign,
    example: "$5.00 off original price",
    color: "bg-green-500",
  },
  {
    id: "specific_price" as const,
    name: "Specific Price",
    description: "Set a specific sale price (great for liquidation)",
    icon: Tag,
    example: "Set price to $10.00",
    color: "bg-red-500",
  },
]

export function PromoValueStep({ formData, updateFormData }: PromoValueStepProps) {
  const form = useForm<ValueFormValues>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      discountType: formData.discountType || undefined,
      discountValue: formData.discountValue || 0,
      specificPrice: formData.specificPrice,
    },
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData({
        discountType: value.discountType,
        discountValue: value.discountValue || 0,
        specificPrice: value.specificPrice,
      })
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  const discountType = form.watch("discountType")
  const currentValue = form.watch(discountType === "specific_price" ? "specificPrice" : "discountValue")

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Promotion Amount</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to discount the {formData.level === "batch" ? "selected batches" : formData.targetName}
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* Discount Type Selection */}
          <div className="grid gap-4 md:grid-cols-3">
            {discountTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  discountType === type.id
                    ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                    : "hover:border-gti-light-green"
                }`}
                onClick={() => form.setValue("discountType", type.id, { shouldValidate: true })}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-md ${type.color}`}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <CardDescription className="text-sm">{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Example:</p>
                    <p className="text-sm font-medium">{type.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Value Input */}
          {discountType && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {discountType === "specific_price"
                    ? "Set Specific Price"
                    : discountType === "percentage"
                      ? "Percentage Amount"
                      : "Dollar Amount"}
                </CardTitle>
                <CardDescription>
                  {discountType === "specific_price"
                    ? "Enter the exact price customers will pay"
                    : discountType === "percentage"
                      ? "Enter the percentage discount (1-100)"
                      : "Enter the dollar amount to discount"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discountType === "specific_price"
                    ? createNumberField(form, "specificPrice", "Sale Price ($)", {
                        min: 0,
                        step: 0.01,
                        placeholder: "10.00",
                      })
                    : createNumberField(
                        form,
                        "discountValue",
                        discountType === "percentage" ? "Percentage (%)" : "Dollar Amount ($)",
                        {
                          min: 0,
                          max: discountType === "percentage" ? 100 : undefined,
                          step: discountType === "percentage" ? 1 : 0.01,
                          placeholder: discountType === "percentage" ? "25" : "5.00",
                        },
                      )}

                  {/* Preview */}
                  {currentValue && currentValue > 0 && (
                    <div className="bg-gti-light-green/10 border border-gti-light-green p-3 rounded-md">
                      <p className="text-sm text-gti-dark-green font-medium">
                        Preview:{" "}
                        {discountType === "specific_price"
                          ? `Sale price will be $${currentValue.toFixed(2)}`
                          : discountType === "percentage"
                            ? `${currentValue}% off original price`
                            : `$${currentValue.toFixed(2)} off original price`}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liquidation Notice */}
          {formData.isLiquidation && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">Liquidation Promotion</p>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This promotion is marked as a liquidation sale. Consider using aggressive discounts or specific pricing
                to move inventory quickly.
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
