"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Tag, Package, Percent, DollarSign, Calendar, Users, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountReviewStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

export function DiscountReviewStep({ formData, updateFormData }: DiscountReviewStepProps) {
  const generateDefaultName = () => {
    const discountText =
      formData.discountType === "percentage" ? `${formData.discountValue}%` : `$${formData.discountValue}`

    const customerText =
      formData.customers.length === 1 ? formData.customers[0] : `${formData.customers.length} customers`

    return `${formData.targetName} ${discountText} - ${customerText}`
  }

  const handleNameChange = (name: string) => {
    updateFormData({ name })
  }

  // Auto-generate name if empty
  if (!formData.name && formData.targetName && formData.discountValue && formData.customers.length > 0) {
    updateFormData({ name: generateDefaultName() })
  }

  const getLevelIcon = () => {
    switch (formData.level) {
      case "brand":
        return <Tag className="h-4 w-4 text-gti-bright-green" />
      case "category":
      case "subcategory":
      case "size":
        return <Package className="h-4 w-4 text-gti-bright-green" />
      default:
        return <Package className="h-4 w-4 text-gti-bright-green" />
    }
  }

  const getDiscountIcon = () => {
    return formData.discountType === "percentage" ? (
      <Percent className="h-4 w-4 text-gti-bright-green" />
    ) : (
      <DollarSign className="h-4 w-4 text-gti-bright-green" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Review & Create</h2>
        <p className="text-muted-foreground mt-2">Review your discount configuration and create the rule</p>
      </div>

      {/* Discount Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discount Rule Name</CardTitle>
          <CardDescription>Give this discount rule a descriptive name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="discount-name">Rule Name</Label>
            <Input
              id="discount-name"
              placeholder="Enter a name for this discount rule"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {!formData.name && <p className="text-sm text-muted-foreground">Suggested: {generateDefaultName()}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configuration Summary</CardTitle>
          <CardDescription>Review all settings before creating the discount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level & Target */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getLevelIcon()}
              <div>
                <p className="font-medium">Discount Level</p>
                <p className="text-sm text-muted-foreground">
                  {formData.level?.charAt(0).toUpperCase() + formData.level?.slice(1)} level discount
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formData.targetName}</p>
              <Badge variant="outline">{formData.level}</Badge>
            </div>
          </div>

          <Separator />

          {/* Discount Value */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getDiscountIcon()}
              <div>
                <p className="font-medium">Discount Amount</p>
                <p className="text-sm text-muted-foreground">
                  {formData.discountType === "percentage" ? "Percentage" : "Dollar amount"} discount
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gti-dark-green">
                {formData.discountType === "percentage"
                  ? `${formData.discountValue}% off`
                  : `$${formData.discountValue.toFixed(2)} off`}
              </p>
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gti-bright-green" />
              <div>
                <p className="font-medium">Active Period</p>
                <p className="text-sm text-muted-foreground">When this discount is active</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formData.startDate ? format(formData.startDate, "MMM d, yyyy") : "Not set"}
              </p>
              <p className="text-sm text-muted-foreground">
                {formData.endDate ? `to ${format(formData.endDate, "MMM d, yyyy")}` : "No end date"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customers */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-gti-bright-green" />
              <div>
                <p className="font-medium">Assigned Customers</p>
                <p className="text-sm text-muted-foreground">
                  {formData.customers.length} customer{formData.customers.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
            <div className="text-right max-w-xs">
              <div className="flex flex-wrap gap-1 justify-end">
                {formData.customers.slice(0, 3).map((customer) => (
                  <Badge key={customer} variant="secondary" className="text-xs">
                    {customer}
                  </Badge>
                ))}
                {formData.customers.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{formData.customers.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expected Impact</CardTitle>
          <CardDescription>Preview of how this discount will work</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-gti-bright-green mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-gti-dark-green">
                  {formData.customers.length} customer{formData.customers.length !== 1 ? "s" : ""} will receive{" "}
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue}% off`
                    : `$${formData.discountValue.toFixed(2)} off`}{" "}
                  all products in {formData.targetName}
                </p>
                <p className="text-sm text-muted-foreground">
                  This discount will be automatically applied to qualifying orders starting{" "}
                  {formData.startDate ? format(formData.startDate, "MMMM d, yyyy") : "immediately"}
                  {formData.endDate && ` and ending ${format(formData.endDate, "MMMM d, yyyy")}`}.
                </p>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="mt-4 p-4 bg-white border rounded-lg">
            <p className="font-medium mb-3">Example Order Impact:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sample product from {formData.targetName}:</span>
                <span>$100.00</span>
              </div>
              <div className="flex justify-between text-gti-dark-green">
                <span>Discount applied:</span>
                <span>
                  -
                  {formData.discountType === "percentage"
                    ? `$${((100 * formData.discountValue) / 100).toFixed(2)}`
                    : `$${Math.min(formData.discountValue, 100).toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Customer pays:</span>
                <span>
                  $
                  {formData.discountType === "percentage"
                    ? (100 - (100 * formData.discountValue) / 100).toFixed(2)
                    : Math.max(0, 100 - formData.discountValue).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Warnings */}
      {(!formData.name || formData.name.trim().length < 3) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              Please provide a descriptive name for this discount rule
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
