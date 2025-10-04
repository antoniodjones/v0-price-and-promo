"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"

interface RuleConfigurationStepProps {
  data: {
    name: string
    description: string
    rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
    level: "brand" | "category" | "subcategory" | "product"
    target_id: string
    target_name: string
    start_date: string
    end_date: string
    status: "active" | "inactive" | "scheduled" | "expired"
  }
  onUpdate: (data: any) => void
}

export function RuleConfigurationStep({ data, onUpdate }: RuleConfigurationStepProps) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
          <CardDescription>Define the core details of your discount rule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">
              Rule Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rule-name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Premium Brand Tiered Pricing Q4 2025"
              className="max-w-2xl"
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name that identifies the rule's purpose
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the purpose and details of this pricing rule..."
              rows={3}
              className="max-w-2xl"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add context about when and why this rule should be applied
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rule Type & Target */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rule Type & Target</CardTitle>
          <CardDescription>Specify what type of discount and what it applies to</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select value={data.rule_type} onValueChange={(value: any) => handleChange("rule_type", value)}>
                <SelectTrigger id="rule-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tiered_pricing">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Tiered Pricing</span>
                      <span className="text-xs text-muted-foreground">Different prices for A/B/C tiers</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="customer_discount">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Customer Discount</span>
                      <span className="text-xs text-muted-foreground">Flat discount per customer tier</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="volume_pricing">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Volume Pricing</span>
                      <span className="text-xs text-muted-foreground">Quantity-based tier discounts</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Application Level</Label>
              <Select value={data.level} onValueChange={(value: any) => handleChange("level", value)}>
                <SelectTrigger id="level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand Level</SelectItem>
                  <SelectItem value="category">Category Level</SelectItem>
                  <SelectItem value="subcategory">Sub-category Level</SelectItem>
                  <SelectItem value="product">Product Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-name">
                Target Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="target-name"
                value={data.target_name}
                onChange={(e) => handleChange("target_name", e.target.value)}
                placeholder="e.g., Premium Cannabis Co"
              />
              <p className="text-xs text-muted-foreground">The brand, category, or product this rule applies to</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-id">Target ID (Optional)</Label>
              <Input
                id="target-id"
                value={data.target_id}
                onChange={(e) => handleChange("target_id", e.target.value)}
                placeholder="e.g., BRAND-001"
              />
              <p className="text-xs text-muted-foreground">System ID if available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dates & Status</CardTitle>
          <CardDescription>Set when this rule is active</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={data.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Input
                id="end-date"
                type="date"
                value={data.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                min={data.start_date}
              />
              <p className="text-xs text-muted-foreground">Leave empty for no end date</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={data.status} onValueChange={(value: any) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Active</Badge>
                      <span className="text-xs">Rule is currently active</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scheduled">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500">Scheduled</Badge>
                      <span className="text-xs">Will activate on start date</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Inactive</Badge>
                      <span className="text-xs">Rule is disabled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Next Steps</p>
              <p className="text-xs mt-1">
                After configuring the basic rule details, you'll set up tier-specific pricing (A/B/C) and assign
                customers to each tier.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
