"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface DiscountRuleModalProps {
  isOpen: boolean
  onClose: () => void
  rule?: any
  onSuccess: () => void
}

interface TierConfig {
  tier: "A" | "B" | "C"
  discount_type: "percentage" | "fixed_amount" | "price_override"
  discount_value: number
  min_quantity?: number
  max_quantity?: number
}

export function DiscountRuleModal({ isOpen, onClose, rule, onSuccess }: DiscountRuleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rule_type: "tiered_pricing" as "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle",
    level: "brand" as "brand" | "category" | "subcategory" | "product",
    target_id: "",
    target_name: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "active" as "active" | "inactive" | "scheduled" | "expired",
  })

  const [tiers, setTiers] = useState<TierConfig[]>([
    { tier: "A", discount_type: "percentage", discount_value: 0 },
    { tier: "B", discount_type: "percentage", discount_value: 0 },
    { tier: "C", discount_type: "percentage", discount_value: 0 },
  ])

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || "",
        description: rule.description || "",
        rule_type: rule.rule_type || "tiered_pricing",
        level: rule.level || "brand",
        target_id: rule.target_id || "",
        target_name: rule.target_name || "",
        start_date: rule.start_date ? rule.start_date.split("T")[0] : new Date().toISOString().split("T")[0],
        end_date: rule.end_date ? rule.end_date.split("T")[0] : "",
        status: rule.status || "active",
      })

      if (rule.tiers && rule.tiers.length > 0) {
        setTiers(rule.tiers)
      }
    }
  }, [rule])

  const handleSave = async () => {
    try {
      setSaving(true)

      const payload = {
        ...formData,
        tiers,
      }

      const url = rule ? `/api/discount-rules/${rule.id}` : "/api/discount-rules"
      const method = rule ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error("[v0] Error saving discount rule:", err)
    } finally {
      setSaving(false)
    }
  }

  const updateTier = (tierLetter: "A" | "B" | "C", field: keyof TierConfig, value: any) => {
    setTiers(
      tiers.map((t) =>
        t.tier === tierLetter
          ? {
              ...t,
              [field]: value,
            }
          : t,
      ),
    )
  }

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title={rule ? "Edit Discount Rule" : "Create Discount Rule"}
      description="Configure tiered pricing with A/B/C customer segments"
      size="xl"
      showFooter={true}
      footerContent={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.name}
            className="bg-gti-dark-green hover:bg-gti-medium-green text-white"
          >
            {saving ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Brand Tiered Pricing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this pricing rule..."
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Rule Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rule Type</Label>
            <Select
              value={formData.rule_type}
              onValueChange={(value: any) => setFormData({ ...formData, rule_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiered_pricing">Tiered Pricing</SelectItem>
                <SelectItem value="customer_discount">Customer Discount</SelectItem>
                <SelectItem value="volume_pricing">Volume Pricing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={formData.level} onValueChange={(value: any) => setFormData({ ...formData, level: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="subcategory">Sub-category</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-name">Target Name</Label>
            <Input
              id="target-name"
              value={formData.target_name}
              onChange={(e) => setFormData({ ...formData, target_name: e.target.value })}
              placeholder="e.g., Premium Cannabis Co"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-id">Target ID (Optional)</Label>
            <Input
              id="target-id"
              value={formData.target_id}
              onChange={(e) => setFormData({ ...formData, target_id: e.target.value })}
              placeholder="Product/Brand ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date (Optional)</Label>
            <Input
              id="end-date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>

        <Separator />

        {/* Tier Configuration */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Tier Pricing Configuration</Label>

          {(["A", "B", "C"] as const).map((tierLetter) => {
            const tier = tiers.find((t) => t.tier === tierLetter)
            if (!tier) return null

            return (
              <div key={tierLetter} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-base">
                    Tier {tierLetter}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <Select
                      value={tier.discount_type}
                      onValueChange={(value: any) => updateTier(tierLetter, "discount_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                        <SelectItem value="price_override">Price Override</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Discount Value</Label>
                    <Input
                      type="number"
                      value={tier.discount_value}
                      onChange={(e) => updateTier(tierLetter, "discount_value", Number(e.target.value))}
                      placeholder="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Min Quantity</Label>
                    <Input
                      type="number"
                      value={tier.min_quantity || ""}
                      onChange={(e) =>
                        updateTier(tierLetter, "min_quantity", e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </UnifiedModal>
  )
}
