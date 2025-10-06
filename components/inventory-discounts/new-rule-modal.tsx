"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface NewRuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: InventoryDiscountRule) => void
  editingRule?: InventoryDiscountRule | null
}

interface InventoryDiscountRule {
  id?: string
  name: string
  description: string
  ruleType: "expiration" | "inventory" | "thc" | "category" | "brand"
  conditions: {
    daysUntilExpiration?: number
    inventoryThreshold?: number
    thcPercentage?: number
    categories?: string[]
    brands?: string[]
  }
  discountType: "percentage" | "fixed"
  discountValue: number
  isActive: boolean
  priority: number
}

export function NewRuleModal({ isOpen, onClose, onSave, editingRule }: NewRuleModalProps) {
  const [formData, setFormData] = useState<InventoryDiscountRule>({
    name: "",
    description: "",
    ruleType: "expiration",
    conditions: {},
    discountType: "percentage",
    discountValue: 0,
    isActive: true,
    priority: 1,
  })

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  useEffect(() => {
    if (editingRule) {
      setFormData(editingRule)
      setSelectedCategories(editingRule.conditions.categories || [])
      setSelectedBrands(editingRule.conditions.brands || [])
    } else {
      setFormData({
        name: "",
        description: "",
        ruleType: "expiration",
        conditions: {},
        discountType: "percentage",
        discountValue: 0,
        isActive: true,
        priority: 1,
      })
      setSelectedCategories([])
      setSelectedBrands([])
    }
  }, [editingRule, isOpen])

  const handleSave = () => {
    const ruleToSave = {
      ...formData,
      id: editingRule?.id || `rule-${Date.now()}`,
      conditions: {
        ...formData.conditions,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        brands: selectedBrands.length > 0 ? selectedBrands : undefined,
      },
    }

    onSave(ruleToSave)
    onClose()
  }

  const availableCategories = ["Flower", "Edibles", "Concentrates", "Vapes", "Topicals", "Accessories"]
  const availableBrands = ["Rythm", "Cresco", "Good Green", "Verano", "Curaleaf", "Trulieve"]

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingRule ? "Edit Discount Rule" : "Create New Discount Rule"}
      description={
        editingRule
          ? "Modify the automated discount rule"
          : "Configure a new automated discount rule for your inventory"
      }
      size="lg"
      showFooter={true}
      footerContent={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.name || !formData.discountValue}
            className="bg-gti-dark-green hover:bg-gti-medium-green text-white"
          >
            {editingRule ? "Update Rule" : "Create Rule"}
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
              placeholder="e.g., 30-Day Expiration Discount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe when this rule should apply..."
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Rule Type */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rule Type</Label>
            <Select
              value={formData.ruleType}
              onValueChange={(value: any) => setFormData({ ...formData, ruleType: value, conditions: {} })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiration">Expiration Date</SelectItem>
                <SelectItem value="inventory">Inventory Level</SelectItem>
                <SelectItem value="thc">THC Percentage</SelectItem>
                <SelectItem value="category">Product Category</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields Based on Rule Type */}
          {formData.ruleType === "expiration" && (
            <div className="space-y-2">
              <Label htmlFor="expiration-days">Days Until Expiration</Label>
              <Input
                id="expiration-days"
                type="number"
                value={formData.conditions.daysUntilExpiration || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, daysUntilExpiration: Number(e.target.value) },
                  })
                }
                placeholder="30"
                min="1"
                max="365"
              />
              <p className="text-sm text-muted-foreground">
                Apply discount when products are within this many days of expiration
              </p>
            </div>
          )}

          {formData.ruleType === "inventory" && (
            <div className="space-y-2">
              <Label htmlFor="inventory-threshold">Inventory Threshold</Label>
              <Input
                id="inventory-threshold"
                type="number"
                value={formData.conditions.inventoryThreshold || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, inventoryThreshold: Number(e.target.value) },
                  })
                }
                placeholder="10"
                min="1"
              />
              <p className="text-sm text-muted-foreground">Apply discount when inventory falls below this amount</p>
            </div>
          )}

          {formData.ruleType === "thc" && (
            <div className="space-y-2">
              <Label htmlFor="thc-percentage">Minimum THC Percentage</Label>
              <Input
                id="thc-percentage"
                type="number"
                value={formData.conditions.thcPercentage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditions: { ...formData.conditions, thcPercentage: Number(e.target.value) },
                  })
                }
                placeholder="25"
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-sm text-muted-foreground">
                Apply discount to products with THC percentage above this value
              </p>
            </div>
          )}

          {formData.ruleType === "category" && (
            <div className="space-y-2">
              <Label>Product Categories</Label>
              <Select
                onValueChange={(category) => {
                  if (category && !selectedCategories.includes(category)) {
                    setSelectedCategories([...selectedCategories, category])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select categories..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== category))}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {formData.ruleType === "brand" && (
            <div className="space-y-2">
              <Label>Brands</Label>
              <Select
                onValueChange={(brand) => {
                  if (brand && !selectedBrands.includes(brand)) {
                    setSelectedBrands([...selectedBrands, brand])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brands..." />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBrands.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBrands.map((brand) => (
                    <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                      {brand}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Discount Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <Select
              value={formData.discountType}
              onValueChange={(value: any) => setFormData({ ...formData, discountType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-value">
              Discount {formData.discountType === "percentage" ? "Percentage" : "Amount"}
            </Label>
            <Input
              id="discount-value"
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              placeholder={formData.discountType === "percentage" ? "15" : "5.00"}
              min="0"
              max={formData.discountType === "percentage" ? "100" : undefined}
              step={formData.discountType === "percentage" ? "1" : "0.01"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
              min="1"
              max="10"
            />
            <p className="text-sm text-muted-foreground">
              Higher priority rules are applied first (1 = highest priority)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-active">Enable Rule</Label>
            <Switch
              id="is-active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>
      </div>
    </UnifiedModal>
  )
}
