"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface TieredPricingModalProps {
  isOpen: boolean
  onClose: () => void
  rule?: any
  onSuccess: () => void
}

export function TieredPricingModal({ isOpen, onClose, rule, onSuccess }: TieredPricingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    customer_tiers: [] as string[],
    scope: "product" as "product" | "category" | "brand" | "global",
    scope_value: "",
    discount_type: "percentage",
    discount_value: 0,
    priority: 0,
    status: "active",
    start_date: "",
    end_date: "",
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || "",
        description: rule.description || "",
        customer_tiers: rule.customer_tiers || [],
        scope: rule.scope || "product",
        scope_value: rule.scope_value || "",
        discount_type: rule.discount_type || "percentage",
        discount_value: rule.discount_value || 0,
        priority: rule.priority || 0,
        status: rule.status || "active",
        start_date: rule.start_date || "",
        end_date: rule.end_date || "",
      })
    }
  }, [rule])

  const toggleTier = (tier: string) => {
    setFormData({
      ...formData,
      customer_tiers: formData.customer_tiers.includes(tier)
        ? formData.customer_tiers.filter((t) => t !== tier)
        : [...formData.customer_tiers, tier],
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const url = rule ? `/api/pricing-rules/tiered/${rule.id}` : "/api/pricing-rules/tiered"
      const method = rule ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error("[v0] Error saving tiered pricing rule:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Tiered Pricing Rule" : "Create Tiered Pricing Rule"}</DialogTitle>
          <DialogDescription>Configure customer tier-based pricing</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., VIP Customer Pricing"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this pricing rule..."
                rows={2}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Customer Tiers</Label>
              <div className="flex gap-2">
                {["A", "B", "C"].map((tier) => (
                  <Badge
                    key={tier}
                    variant={formData.customer_tiers.includes(tier) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTier(tier)}
                  >
                    Tier {tier}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={formData.scope} onValueChange={(value: any) => setFormData({ ...formData, scope: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope_value">Target</Label>
              <Input
                id="scope_value"
                value={formData.scope_value}
                onChange={(e) => setFormData({ ...formData, scope_value: e.target.value })}
                placeholder="e.g., Edibles, Wana Brand"
              />
            </div>

            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                  <SelectItem value="fixed_price">Fixed Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">Discount Value</Label>
              <Input
                id="discount_value"
                type="number"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.name || formData.customer_tiers.length === 0}
            className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
          >
            {saving ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
