"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Clock, Zap, Globe, Tag, Package, Calendar, AlertCircle, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface AutoDiscountReviewStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

export function AutoDiscountReviewStep({ formData, updateFormData }: AutoDiscountReviewStepProps) {
  const generateDefaultName = () => {
    const triggerText =
      formData.triggerType === "expiration"
        ? `${formData.triggerValue}-Day Expiration`
        : `THC Below ${formData.triggerValue}%`

    const scopeText = formData.level === "global" ? "Auto Discount" : `${formData.targetName} Auto Discount`

    return `${triggerText} ${scopeText}`
  }

  const handleNameChange = (name: string) => {
    updateFormData({ name })
  }

  // Auto-generate name if empty
  if (!formData.name && formData.triggerValue && formData.startDate) {
    updateFormData({ name: generateDefaultName() })
  }

  const getTriggerIcon = () => {
    return formData.triggerType === "expiration" ? (
      <Clock className="h-4 w-4 text-orange-500" />
    ) : (
      <Zap className="h-4 w-4 text-gti-purple" />
    )
  }

  const getScopeIcon = () => {
    switch (formData.level) {
      case "global":
        return <Globe className="h-4 w-4 text-gti-bright-green" />
      case "brand":
        return <Tag className="h-4 w-4 text-gti-bright-green" />
      default:
        return <Package className="h-4 w-4 text-gti-bright-green" />
    }
  }

  const getDiscountIcon = () => {
    return formData.discountType === "percentage" ? (
      <TrendingUp className="h-4 w-4 text-gti-bright-green" />
    ) : (
      <TrendingUp className="h-4 w-4 text-gti-bright-green" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Review & Create</h2>
        <p className="text-muted-foreground mt-2">Review your automatic discount configuration and create the rule</p>
      </div>

      {/* Rule Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automatic Discount Rule Name</CardTitle>
          <CardDescription>Give this automatic rule a descriptive name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="auto-discount-name">Rule Name</Label>
            <Input
              id="auto-discount-name"
              placeholder="Enter a name for this automatic discount rule"
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
          <CardDescription>Review all automatic discount settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trigger Configuration */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getTriggerIcon()}
              <div>
                <p className="font-medium">Trigger Type</p>
                <p className="text-sm text-muted-foreground">
                  {formData.triggerType === "expiration" ? "Expiration date based" : "THC percentage based"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formData.triggerType === "expiration"
                  ? `${formData.triggerValue} days before expiration`
                  : `THC below ${formData.triggerValue}%`}
              </p>
              <Badge
                variant="outline"
                className={
                  formData.triggerType === "expiration"
                    ? "border-orange-200 text-orange-800"
                    : "border-purple-200 text-purple-800"
                }
              >
                {formData.triggerType === "expiration" ? "Expiration" : "THC Level"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Scope Configuration */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getScopeIcon()}
              <div>
                <p className="font-medium">Rule Scope</p>
                <p className="text-sm text-muted-foreground">
                  {formData.level === "global" ? "Applies to all products" : `Applies to ${formData.level} level`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formData.level === "global" ? "All Products" : formData.targetName}</p>
              <Badge variant="outline">{formData.level}</Badge>
            </div>
          </div>

          <Separator />

          {/* Discount Value */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getDiscountIcon()}
              <div>
                <p className="font-medium">Automatic Discount</p>
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

          {/* Schedule */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gti-bright-green" />
              <div>
                <p className="font-medium">Active Period</p>
                <p className="text-sm text-muted-foreground">When automatic processing is active</p>
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
        </CardContent>
      </Card>

      {/* Automation Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Automation Preview</CardTitle>
          <CardDescription>How this automatic rule will work in practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-gti-bright-green mt-0.5" />
              <div className="space-y-2">
                <p className="font-medium text-gti-dark-green">
                  Automatic{" "}
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue}% discount`
                    : `$${formData.discountValue.toFixed(2)} discount`}
                  will be applied to {formData.level === "global" ? "all products" : formData.targetName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.triggerType === "expiration"
                    ? `When products are within ${formData.triggerValue} days of expiration`
                    : `When products have THC percentage below ${formData.triggerValue}%`}
                  , the system will automatically apply the discount in real-time.
                </p>
                <p className="text-sm text-muted-foreground">
                  Processing begins {formData.startDate ? format(formData.startDate, "MMMM d, yyyy") : "immediately"}
                  {formData.endDate && ` and ends ${format(formData.endDate, "MMMM d, yyyy")}`}.
                </p>
              </div>
            </div>
          </div>

          {/* Example Scenario */}
          <div className="mt-4 p-4 bg-white border rounded-lg">
            <p className="font-medium mb-3">Example Automatic Processing:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Batch BH-2025-0900 detected:</span>
                <span className="text-muted-foreground">
                  {formData.triggerType === "expiration"
                    ? `${formData.triggerValue - 5} days to expiration`
                    : `${formData.triggerValue - 2}% THC`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trigger condition met:</span>
                <span className="text-orange-600">✓ Automatic processing</span>
              </div>
              <div className="flex justify-between text-gti-dark-green">
                <span>Discount applied instantly:</span>
                <span className="font-medium">
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue}% off`
                    : `$${formData.discountValue.toFixed(2)} off`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Customer sees updated price:</span>
                <span className="font-medium">
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
              Please provide a descriptive name for this automatic discount rule
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
