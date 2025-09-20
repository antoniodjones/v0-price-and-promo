"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Package, Layers, Ruler } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountLevelStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

const discountLevels = [
  {
    id: "brand" as const,
    name: "Brand Level",
    description: "Apply discount to all products from a specific brand",
    icon: Tag,
    example: "8% off all Premium Cannabis Co products",
    color: "bg-gti-bright-green",
  },
  {
    id: "category" as const,
    name: "Category Level",
    description: "Apply discount to all products in a category",
    icon: Package,
    example: "5% off all Flower products",
    color: "bg-gti-medium-green",
  },
  {
    id: "subcategory" as const,
    name: "Sub-Category Level",
    description: "Apply discount to products in a specific sub-category",
    icon: Layers,
    example: "$5 off all Gummies in Edibles category",
    color: "bg-gti-light-green",
  },
  {
    id: "size" as const,
    name: "Size Level",
    description: "Apply discount to specific product sizes",
    icon: Ruler,
    example: "12% off all 1oz Flower products",
    color: "bg-gti-purple",
  },
]

export function DiscountLevelStep({ formData, updateFormData }: DiscountLevelStepProps) {
  const handleLevelSelect = (level: typeof formData.level) => {
    updateFormData({
      level,
      // Reset dependent fields when level changes
      targetId: "",
      targetName: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Choose Discount Level</h2>
        <p className="text-muted-foreground mt-2">Select the level at which you want to apply the customer discount</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {discountLevels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.level === level.id
                ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                : "hover:border-gti-light-green"
            }`}
            onClick={() => handleLevelSelect(level.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-md ${level.color}`}>
                  <level.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{level.name}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Example:</p>
                <p className="text-sm font-medium">{level.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.level && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              Selected: {discountLevels.find((l) => l.id === formData.level)?.name}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {discountLevels.find((l) => l.id === formData.level)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
