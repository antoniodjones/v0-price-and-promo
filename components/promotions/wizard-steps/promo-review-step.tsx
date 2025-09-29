"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, Percent, DollarSign, Tag, Archive } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

interface PromoReviewStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

export function PromoReviewStep({ formData, updateFormData }: PromoReviewStepProps) {
  const getDiscountDisplay = () => {
    if (formData.discountType === "specific_price") {
      return `Specific price: $${formData.specificPrice?.toFixed(2) || "0.00"}`
    } else if (formData.discountType === "percentage") {
      return `${formData.discountValue}% off`
    } else if (formData.discountType === "fixed") {
      return `$${formData.discountValue.toFixed(2)} off`
    }
    return "Not set"
  }

  const getTargetDisplay = () => {
    if (formData.level === "batch") {
      return formData.batchNames.join(", ") || "No batches selected"
    }
    return formData.targetName || "Not selected"
  }

  const getDurationDisplay = () => {
    if (!formData.startDate || !formData.endDate) return "Not set"

    const diff = formData.endDate.getTime() - formData.startDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours > 0 ? `and ${hours} hour${hours > 1 ? "s" : ""}` : ""}`
    } else {
      return `${hours} hour${hours > 1 ? "s" : ""}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Review & Create Promotion</h2>
        <p className="text-muted-foreground mt-2">Review your promotion details and give it a name</p>
      </div>

      {/* Promotion Name */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Name</CardTitle>
          <CardDescription>Give your promotion a memorable name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="promo-name">Promotion Name</Label>
            <Input
              id="promo-name"
              placeholder="e.g., Spring Clearance Sale, Batch BH-2025-0892 Liquidation"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Promotion Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Promotion Summary</CardTitle>
          <CardDescription>Review all the details of your promotion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Level & Target */}
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-gti-bright-green mt-0.5" />
              <div>
                <p className="font-medium">Target</p>
                <p className="text-sm text-muted-foreground">
                  {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Level: {getTargetDisplay()}
                </p>
                {formData.level === "batch" && (
                  <Badge variant="secondary" className="mt-1 bg-red-100 text-red-800">
                    <Archive className="h-3 w-3 mr-1" />
                    Batch-Level Targeting
                  </Badge>
                )}
                {formData.isLiquidation && (
                  <Badge variant="destructive" className="mt-1 ml-2">
                    🔥 Liquidation Sale
                  </Badge>
                )}
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-start space-x-3">
              {formData.discountType === "percentage" ? (
                <Percent className="h-5 w-5 text-gti-bright-green mt-0.5" />
              ) : formData.discountType === "specific_price" ? (
                <Tag className="h-5 w-5 text-gti-bright-green mt-0.5" />
              ) : (
                <DollarSign className="h-5 w-5 text-gti-bright-green mt-0.5" />
              )}
              <div>
                <p className="font-medium">Discount</p>
                <p className="text-sm text-muted-foreground">{getDiscountDisplay()}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gti-bright-green mt-0.5" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formData.startDate && formData.endDate ? (
                    <>
                      {formData.startDate.toLocaleString()} - {formData.endDate.toLocaleString()}
                      <br />
                      <span className="text-xs">({getDurationDisplay()})</span>
                    </>
                  ) : (
                    "Not set"
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Details (if applicable) */}
      {formData.level === "batch" && formData.batchIds.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Batch Details
            </CardTitle>
            <CardDescription>Selected batches for this promotion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.batchIds.map((batchId, index) => (
                <div key={batchId} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="font-medium">{batchId}</span>
                  <Badge variant="outline">{formData.batchNames[index]}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-yellow-100 p-2 rounded">
              <p className="text-xs text-yellow-800">
                💡 Batch-level promotions are perfect for liquidation sales and moving specific inventory quickly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {!formData.name && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
          <p className="text-sm text-red-600">Please enter a promotion name to continue</p>
        </div>
      )}
    </div>
  )
}
