"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, CheckCircle2, AlertCircle, Tag, Target, Users, Percent, DollarSign, Clock, Info } from "lucide-react"

interface WizardData {
  name: string
  description: string
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id: string
  target_name: string
  start_date: string
  end_date: string
  status: "active" | "inactive" | "scheduled" | "expired"
  tiers: Array<{
    tier: "A" | "B" | "C"
    discount_type: "percentage" | "fixed_amount" | "price_override"
    discount_value: number
    min_quantity?: number
    max_quantity?: number
  }>
  assignments: Array<{
    customer_id: string
    tier: "A" | "B" | "C"
  }>
}

interface ReviewSubmitStepProps {
  data: WizardData
  onUpdate: (data: Partial<WizardData>) => void
}

export function ReviewSubmitStep({ data, onUpdate }: ReviewSubmitStepProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleDateChange = (field: "start_date" | "end_date", value: string) => {
    onUpdate({ [field]: value })

    // Validate dates
    const errors: string[] = []
    const startDate = field === "start_date" ? new Date(value) : new Date(data.start_date)
    const endDate = field === "end_date" ? new Date(value) : data.end_date ? new Date(data.end_date) : null

    if (endDate && startDate >= endDate) {
      errors.push("End date must be after start date")
    }

    setValidationErrors(errors)
  }

  const getRuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      customer_discount: "Customer Discount",
      volume_pricing: "Volume Pricing",
      tiered_pricing: "Tiered Pricing",
      bogo: "Buy One Get One",
      bundle: "Bundle Discount",
    }
    return labels[type] || type
  }

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      brand: "Brand",
      category: "Category",
      subcategory: "Subcategory",
      product: "Product",
    }
    return labels[level] || level
  }

  const getDiscountTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      percentage: "Percentage Discount",
      fixed_amount: "Fixed Amount Off",
      price_override: "Price Override",
    }
    return labels[type] || type
  }

  const getTierIcon = (tier: "A" | "B" | "C") => {
    if (tier === "A") return "👑"
    if (tier === "B") return "⭐"
    return "📦"
  }

  const getTierColor = (tier: "A" | "B" | "C") => {
    if (tier === "A") return "bg-amber-100 text-amber-800 border-amber-300"
    if (tier === "B") return "bg-blue-100 text-blue-800 border-blue-300"
    return "bg-slate-100 text-slate-800 border-slate-300"
  }

  const assignmentsByTier = {
    A: data.assignments.filter((a) => a.tier === "A").length,
    B: data.assignments.filter((a) => a.tier === "B").length,
    C: data.assignments.filter((a) => a.tier === "C").length,
  }

  const isValid = data.start_date && validationErrors.length === 0

  return (
    <div className="space-y-6">
      {/* Date Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gti-bright-green" />
            <CardTitle>Effective Dates</CardTitle>
          </div>
          <CardDescription>Set when this discount rule will be active</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={data.start_date}
                onChange={(e) => handleDateChange("start_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-muted-foreground">When the discount rule becomes active</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={data.end_date}
                onChange={(e) => handleDateChange("end_date", e.target.value)}
                min={data.start_date}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no expiration</p>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {data.start_date && new Date(data.start_date) > new Date() && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This rule is scheduled to start on {new Date(data.start_date).toLocaleDateString()}. It will not be
                active until that date.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Review Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-gti-bright-green" />
            <CardTitle>Review Configuration</CardTitle>
          </div>
          <CardDescription>Review all settings before creating the discount rule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rule Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Rule Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Rule Name</div>
                <div className="font-medium">{data.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Rule Type</div>
                <Badge variant="outline">{getRuleTypeLabel(data.rule_type)}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{data.description || "No description provided"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={data.status === "active" ? "default" : "secondary"}>{data.status}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Target Configuration */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Level</div>
                <Badge variant="outline">{getLevelLabel(data.level)}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Target</div>
                <div className="font-medium">{data.target_name}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tier Configuration */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Tier Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.tiers.map((tier) => (
                <Card key={tier.tier} className={`border-2 ${getTierColor(tier.tier)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTierIcon(tier.tier)}</span>
                        <CardTitle className="text-lg">Tier {tier.tier}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Discount Type</div>
                      <div className="text-sm font-medium">{getDiscountTypeLabel(tier.discount_type)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Discount Value</div>
                      <div className="text-xl font-bold flex items-center gap-1">
                        {tier.discount_type === "percentage" ? (
                          <>
                            {tier.discount_value}
                            <Percent className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4" />
                            {tier.discount_value.toFixed(2)}
                          </>
                        )}
                      </div>
                    </div>
                    {(tier.min_quantity || tier.max_quantity) && (
                      <div>
                        <div className="text-xs text-muted-foreground">Quantity Range</div>
                        <div className="text-sm">
                          {tier.min_quantity || 0} - {tier.max_quantity || "∞"}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Customer Assignments */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Assignments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-amber-300 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-800">{assignmentsByTier.A}</div>
                    <div className="text-sm text-muted-foreground mt-1">Tier A Customers</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-800">{assignmentsByTier.B}</div>
                    <div className="text-sm text-muted-foreground mt-1">Tier B Customers</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-300 bg-slate-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">{assignmentsByTier.C}</div>
                    <div className="text-sm text-muted-foreground mt-1">Tier C Customers</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">{data.assignments.length}</span> customers
                  assigned across all tiers
                </span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {isValid ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All required fields are complete. You can now create this discount rule.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please fix the validation errors above before proceeding.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Approval Workflow Placeholder */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-muted-foreground">Approval Workflow (Coming Soon)</CardTitle>
          </div>
          <CardDescription>
            Future enhancement: Rules will require manager approval before becoming active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
            <p>
              Once implemented, this section will show the approval status and allow managers to review and approve
              discount rules before they go live.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
