"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Percent, DollarSign, Tag } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

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
  const handleTypeSelect = (type: typeof formData.discountType) => {
    console.log("[v0] Discount type selected:", type)
    updateFormData({
      discountType: type,
      discountValue: 0,
      specificPrice: undefined,
    })
  }

  const handleValueChange = (value: number) => {
    if (formData.discountType === "specific_price") {
      updateFormData({ specificPrice: value })
    } else {
      updateFormData({ discountValue: value })
    }
  }

  const getCurrentValue = () => {
    if (formData.discountType === "specific_price") {
      return formData.specificPrice || 0
    }
    return formData.discountValue
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Promotion Amount</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you want to discount the {formData.level === "batch" ? "selected batches" : formData.targetName}
        </p>
      </div>

      {/* Discount Type Selection */}
      <div className="grid gap-4 md:grid-cols-3">
        {discountTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.discountType === type.id
                ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                : "hover:border-gti-light-green"
            }`}
            onClick={() => handleTypeSelect(type.id)}
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
      {formData.discountType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {formData.discountType === "specific_price"
                ? "Set Specific Price"
                : formData.discountType === "percentage"
                  ? "Percentage Amount"
                  : "Dollar Amount"}
            </CardTitle>
            <CardDescription>
              {formData.discountType === "specific_price"
                ? "Enter the exact price customers will pay"
                : formData.discountType === "percentage"
                  ? "Enter the percentage discount (1-100)"
                  : "Enter the dollar amount to discount"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="discount-value">
                  {formData.discountType === "specific_price"
                    ? "Sale Price ($)"
                    : formData.discountType === "percentage"
                      ? "Percentage (%)"
                      : "Dollar Amount ($)"}
                </Label>
                <div className="relative">
                  {(formData.discountType === "fixed" || formData.discountType === "specific_price") && (
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  )}
                  {formData.discountType === "percentage" && (
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  )}
                  <Input
                    id="discount-value"
                    type="number"
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : undefined}
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                    value={getCurrentValue()}
                    onChange={(e) => handleValueChange(Number.parseFloat(e.target.value) || 0)}
                    className={formData.discountType === "percentage" ? "pr-10" : "pl-10"}
                    placeholder={
                      formData.discountType === "specific_price"
                        ? "10.00"
                        : formData.discountType === "percentage"
                          ? "25"
                          : "5.00"
                    }
                  />
                </div>
              </div>

              {/* Validation Messages */}
              {formData.discountType === "percentage" && getCurrentValue() > 100 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                  <p className="text-sm text-red-600">Percentage cannot exceed 100%</p>
                </div>
              )}

              {getCurrentValue() > 0 && (
                <div className="bg-gti-light-green/10 border border-gti-light-green p-3 rounded-md">
                  <p className="text-sm text-gti-dark-green font-medium">
                    Preview:{" "}
                    {formData.discountType === "specific_price"
                      ? `Sale price will be $${getCurrentValue().toFixed(2)}`
                      : formData.discountType === "percentage"
                        ? `${getCurrentValue()}% off original price`
                        : `$${getCurrentValue().toFixed(2)} off original price`}
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
            This promotion is marked as a liquidation sale. Consider using aggressive discounts or specific pricing to
            move inventory quickly.
          </p>
        </div>
      )}
    </div>
  )
}
