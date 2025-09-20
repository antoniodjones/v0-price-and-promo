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

// Mock data - in real app this would come from API
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
  size: [
    { id: "size-1", name: "1oz", category: "Flower", productCount: 89 },
    { id: "size-2", name: "500mg", category: "Edibles", productCount: 45 },
    { id: "size-3", name: "1000mg", category: "Edibles", productCount: 34 },
    { id: "size-4", name: "2g", category: "Concentrates", productCount: 23 },
  ],
}

export function DiscountTargetStep({ formData, updateFormData }: DiscountTargetStepProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const getTargets = () => {
    if (!formData.level) return []
    return mockTargets[formData.level] || []
  }

  const filteredTargets = getTargets().filter((target) => target.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTargetSelect = (target: any) => {
    updateFormData({
      targetId: target.id,
      targetName: target.name,
    })
  }

  const getLevelIcon = () => {
    switch (formData.level) {
      case "brand":
        return <Tag className="h-4 w-4" />
      case "category":
        return <Package className="h-4 w-4" />
      case "subcategory":
        return <Layers className="h-4 w-4" />
      case "size":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getLevelTitle = () => {
    switch (formData.level) {
      case "brand":
        return "Select Brand"
      case "category":
        return "Select Category"
      case "subcategory":
        return "Select Sub-Category"
      case "size":
        return "Select Size"
      default:
        return "Select Target"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">{getLevelTitle()}</h2>
        <p className="text-muted-foreground mt-2">Choose the specific {formData.level} for this discount rule</p>
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
                    {"parent" in target && <p className="text-xs text-muted-foreground">{target.parent}</p>}
                    {"category" in target && <p className="text-xs text-muted-foreground">{target.category}</p>}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {target.productCount} products
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTargets.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No {formData.level}s found matching "{searchTerm}"
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
            Discount will apply to all products in this {formData.level}
          </p>
        </div>
      )}
    </div>
  )
}
