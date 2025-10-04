"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface VolumePricingModalProps {
  isOpen: boolean
  onClose: () => void
  rule?: any
  onSuccess: () => void
}

export function VolumePricingModal({ isOpen, onClose, rule, onSuccess }: VolumePricingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scope: "product" as "product" | "category" | "brand" | "global",
    scope_value: "",
    status: "active",
    start_date: "",
    end_date: "",
  })

  const [tiers, setTiers] = useState([
    { min_quantity: 1, max_quantity: 10, discount_type: "percentage", discount_value: 0, tier_label: "" },
  ])

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name || "",
        description: rule.description || "",
        scope: rule.scope || "product",
        scope_value: rule.scope_value || "",
        status: rule.status || "active",
        start_date: rule.start_date || "",
        end_date: rule.end_date || "",
      })
      if (rule.tiers) {
        setTiers(rule.tiers)
      }
    }
  }, [rule])

  const addTier = () => {
    setTiers([
      ...tiers,
      { min_quantity: 1, max_quantity: 10, discount_type: "percentage", discount_value: 0, tier_label: "" },
    ])
  }

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
  }

  const updateTier = (index: number, field: string, value: any) => {
    const updated = [...tiers]
    updated[index] = { ...updated[index], [field]: value }
    setTiers(updated)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const payload = { ...formData, tiers }
      const url = rule ? `/api/pricing-rules/volume/${rule.id}` : "/api/pricing-rules/volume"
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
      console.error("[v0] Error saving volume pricing rule:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Volume Pricing Rule" : "Create Volume Pricing Rule"}</DialogTitle>
          <DialogDescription>Configure quantity-based discounts</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Bulk Discount - Edibles"
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Volume Tiers</Label>
              <Button onClick={addTier} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>

            {tiers.map((tier, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tier {index + 1}</span>
                  {tiers.length > 1 && (
                    <Button onClick={() => removeTier(index)} size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>Min Qty</Label>
                    <Input
                      type="number"
                      value={tier.min_quantity}
                      onChange={(e) => updateTier(index, "min_quantity", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Qty</Label>
                    <Input
                      type="number"
                      value={tier.max_quantity || ""}
                      onChange={(e) =>
                        updateTier(index, "max_quantity", e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="∞"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={tier.discount_type}
                      onValueChange={(value) => updateTier(index, "discount_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed_amount">$</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={tier.discount_value}
                      onChange={(e) => updateTier(index, "discount_value", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formData.name}
            className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
          >
            {saving ? "Saving..." : rule ? "Update Rule" : "Create Rule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
