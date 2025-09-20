"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Percent, DollarSign } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountValueStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

export function DiscountValueStep({ formData, updateFormData }: DiscountValueStepProps) {
  const handleDiscountTypeChange = (type: "percentage" | "dollar") => {
    updateFormData({
      discountType: type,
      discountValue: 0, // Reset value when type changes
    })
  }

  const handleValueChange = (value: string) => {
    const numValue = Number.parseFloat(value) || 0
    updateFormData({ discountValue: numValue })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Discount Amount</h2>
        <p className="text-muted-foreground mt-2">Configure the discount value for {formData.targetName}</p>
      </div>

      {/* Discount Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discount Type</CardTitle>
          <CardDescription>Choose between percentage or dollar amount discount</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.discountType}
            onValueChange={handleDiscountTypeChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="flex items-center space-x-2 cursor-pointer">
                <Percent className="h-4 w-4 text-gti-bright-green" />
                <span>Percentage Off</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dollar" id="dollar" />
              <Label htmlFor="dollar" className="flex items-center space-x-2 cursor-pointer">
                <DollarSign className="h-4 w-4 text-gti-bright-green" />
                <span>Dollar Amount Off</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Discount Value Input */}
      {formData.discountType && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Discount Value</CardTitle>
            <CardDescription>
              Enter the {formData.discountType === "percentage" ? "percentage" : "dollar amount"} to discount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative max-w-xs">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {formData.discountType === "percentage" ? (
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Input
                  type="number"
                  placeholder={formData.discountType === "percentage" ? "8" : "5.00"}
                  value={formData.discountValue || ""}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="pl-10"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {formData.discountType === "percentage" ? "%" : "USD"}
                </div>
              </div>

              {/* Validation Messages */}
              {formData.discountType === "percentage" && formData.discountValue > 100 && (
                <p className="text-sm text-red-600">Percentage cannot exceed 100%</p>
              )}
              {formData.discountValue < 0 && <p className="text-sm text-red-600">Discount value cannot be negative</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {formData.discountType && formData.discountValue > 0 && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">Discount Preview</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customers will receive{" "}
            <span className="font-medium text-gti-dark-green">
              {formData.discountType === "percentage"
                ? `${formData.discountValue}% off`
                : `$${formData.discountValue.toFixed(2)} off`}
            </span>{" "}
            all products in {formData.targetName}
          </p>

          {/* Example calculation */}
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Example:</p>
            <div className="flex justify-between text-sm">
              <span>Product price: $100.00</span>
              <span className="text-gti-dark-green font-medium">
                Final price: $
                {formData.discountType === "percentage"
                  ? (100 - (100 * formData.discountValue) / 100).toFixed(2)
                  : Math.max(0, 100 - formData.discountValue).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
