"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, Tag, Package, Layers, Box } from "lucide-react"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface DiscountScopeStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

const scopeLevels = [
  {
    id: "global" as const,
    name: "Global Rule",
    description: "Apply to all products across all categories and brands",
    icon: Globe,
    example: "All products get discounted when conditions are met",
    color: "bg-gti-bright-green",
  },
  {
    id: "brand" as const,
    name: "Brand Level",
    description: "Apply to all products from a specific brand",
    icon: Tag,
    example: "Only Premium Cannabis Co products get discounted",
    color: "bg-gti-medium-green",
  },
  {
    id: "category" as const,
    name: "Category Level",
    description: "Apply to all products in a specific category",
    icon: Package,
    example: "Only Flower products get discounted",
    color: "bg-gti-light-green",
  },
  {
    id: "subcategory" as const,
    name: "Sub-Category Level",
    description: "Apply to products in a specific sub-category",
    icon: Layers,
    example: "Only Gummies in Edibles get discounted",
    color: "bg-gti-purple",
  },
  {
    id: "product" as const,
    name: "Product Level",
    description: "Apply to a specific product only",
    icon: Box,
    example: "Only Blue Dream 1oz gets discounted",
    color: "bg-gti-yellow",
  },
]

// Mock data - same as customer discount wizard
const mockTargets = {
  brand: [
    { id: "brand-1", name: "Premium Cannabis Co", productCount: 47 },
    { id: "brand-2", name: "Incredibles", productCount: 23 },
    { id: "brand-3", name: "Green Thumb", productCount: 89 },
    { id: "brand-4", name: "Rise", productCount: 156 },
  ],
  category: [
    { id: "cat-1", name: "Flower", productCount: 234 },
    { id: "cat-2", name: "Edibles", productCount: 89 },
    { id: "cat-3", name: "Concentrates", productCount: 67 },
    { id: "cat-4", name: "Vapes", productCount: 45 },
  ],
  subcategory: [
    { id: "sub-1", name: "Gummies", parent: "Edibles", productCount: 34 },
    { id: "sub-2", name: "Chocolates", parent: "Edibles", productCount: 23 },
    { id: "sub-3", name: "Beverages", parent: "Edibles", productCount: 12 },
    { id: "sub-4", name: "Disposables", parent: "Vapes", productCount: 28 },
  ],
  product: [
    { id: "prod-1", name: "Blue Dream 1oz", category: "Flower", productCount: 1 },
    { id: "prod-2", name: "Sour Diesel 1oz", category: "Flower", productCount: 1 },
    { id: "prod-3", name: "Wedding Cake 1oz", category: "Flower", productCount: 1 },
    { id: "prod-4", name: "OG Kush 1oz", category: "Flower", productCount: 1 },
  ],
}

export function DiscountScopeStep({ formData, updateFormData }: DiscountScopeStepProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleLevelSelect = (level: typeof formData.level) => {
    updateFormData({
      level,
      // Reset target when level changes
      targetId: "",
      targetName: "",
    })
  }

  const handleTargetSelect = (target: any) => {
    updateFormData({
      targetId: target.id,
      targetName: target.name,
    })
  }

  const getTargets = () => {
    if (!formData.level || formData.level === "global") return []
    return mockTargets[formData.level] || []
  }

  const filteredTargets = getTargets().filter((target) => target.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getLevelIcon = (level: string) => {
    const levelConfig = scopeLevels.find((l) => l.id === level)
    return levelConfig ? <levelConfig.icon className="h-4 w-4" /> : <Package className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Set Discount Scope</h2>
        <p className="text-muted-foreground mt-2">Choose the scope for your {formData.triggerType} discount rule</p>
      </div>

      {/* Scope Level Selection */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {scopeLevels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.level === level.id
                ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                : "hover:border-gti-light-green"
            }`}
            onClick={() => handleLevelSelect(level.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${level.color}`}>
                  <level.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Target Selection (if not global) */}
      {formData.level && formData.level !== "global" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gti-dark-green">
              Select {scopeLevels.find((l) => l.id === formData.level)?.name.replace(" Level", "")}
            </h3>
            <p className="text-sm text-muted-foreground">Choose the specific {formData.level} for this discount rule</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${formData.level}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Target List */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredTargets.map((target) => (
              <Card
                key={target.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.targetId === target.id
                    ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                    : "hover:border-gti-light-green"
                }`}
                onClick={() => handleTargetSelect(target)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getLevelIcon(formData.level)}
                      <div>
                        <p className="font-medium text-sm">{target.name}</p>
                        {"parent" in target && <p className="text-xs text-muted-foreground">{target.parent}</p>}
                        {"category" in target && <p className="text-xs text-muted-foreground">{target.category}</p>}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {target.productCount} {target.productCount === 1 ? "product" : "products"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {formData.level && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              Scope: {scopeLevels.find((l) => l.id === formData.level)?.name}
              {formData.targetName && ` - ${formData.targetName}`}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formData.level === "global"
              ? "This rule will apply to all products when trigger conditions are met"
              : `This rule will apply only to ${formData.targetName || "selected"} products when trigger conditions are met`}
          </p>
        </div>
      )}
    </div>
  )
}
