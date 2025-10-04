"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Tag, Layers } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountTargetStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

const mockTargets = {
  product: [
    { id: "product-1", name: "Premium Flower - Indica", type: "Product", sku: "PF-IND-001" },
    { id: "product-2", name: "Vape Cartridge - Hybrid", type: "Product", sku: "VC-HYB-002" },
    { id: "product-3", name: "Edibles - Gummies 10mg", type: "Product", sku: "ED-GUM-003" },
    { id: "product-4", name: "Concentrate - Live Resin", type: "Product", sku: "CN-LR-004" },
  ],
  brand: [
    { id: "brand-1", name: "Green Harvest", type: "Premium Brand", productCount: 47 },
    { id: "brand-2", name: "Cloud Nine", type: "Vape Brand", productCount: 23 },
    { id: "brand-3", name: "Pure Bliss", type: "Edibles Brand", productCount: 89 },
    { id: "brand-4", name: "Crystal Clear", type: "Concentrate Brand", productCount: 34 },
  ],
  category: [
    { id: "category-1", name: "Flower", type: "Product Category", productCount: 234 },
    { id: "category-2", name: "Vapes", type: "Product Category", productCount: 89 },
    { id: "category-3", name: "Edibles", type: "Product Category", productCount: 156 },
    { id: "category-4", name: "Concentrates", type: "Product Category", productCount: 67 },
  ],
}

type TargetType = "product" | "brand" | "category"

export function DiscountTargetStep({ formData, updateFormData }: DiscountTargetStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [targetType, setTargetType] = useState<TargetType>("category")

  const getTargets = () => {
    return mockTargets[targetType] || []
  }

  const filteredTargets = getTargets().filter((target) => target.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTargetSelect = (target: any) => {
    console.log("[v0] Target selected:", target)
    updateFormData({
      targetId: target.id,
      targetName: target.name,
    })
  }

  const getLevelIcon = () => {
    switch (targetType) {
      case "product":
        return <Package className="h-4 w-4" />
      case "brand":
        return <Tag className="h-4 w-4" />
      case "category":
        return <Layers className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Select Discount Target</h2>
        <p className="text-muted-foreground mt-2">Choose which products, brands, or categories will be discounted</p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setTargetType("category")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            targetType === "category" ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Layers className="h-4 w-4 inline mr-2" />
          Category
        </button>
        <button
          onClick={() => setTargetType("brand")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            targetType === "brand" ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Tag className="h-4 w-4 inline mr-2" />
          Brand
        </button>
        <button
          onClick={() => setTargetType("product")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            targetType === "product" ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Package className="h-4 w-4 inline mr-2" />
          Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={`Search ${targetType}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Target Selection */}
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
                  {getLevelIcon()}
                  <div>
                    <p className="font-medium">{target.name}</p>
                    <p className="text-xs text-muted-foreground">{target.type}</p>
                    {target.sku && <p className="text-xs text-muted-foreground mt-1">SKU: {target.sku}</p>}
                  </div>
                </div>
                {target.productCount && (
                  <Badge variant="secondary" className="text-xs">
                    {target.productCount} items
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTargets.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No {targetType}s found matching "{searchTerm}"
          </p>
        </div>
      )}

      {formData.targetName && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">Selected: {formData.targetName}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Discount will apply to this {targetType} for selected customers
          </p>
        </div>
      )}
    </div>
  )
}
