"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Building, FolderOpen, Layers, Ruler, Archive } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

interface PromoLevelStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

const promoLevels = [
  {
    id: "item" as const,
    name: "Item Level",
    description: "Apply promotion to specific individual products",
    icon: Package,
    example: "25% off Blue Dream 1g Pre-roll",
    color: "bg-blue-500",
    batchOption: true,
  },
  {
    id: "brand" as const,
    name: "Brand Level",
    description: "Apply promotion to all products from a specific brand",
    icon: Building,
    example: "20% off all Stiiizy products",
    color: "bg-purple-500",
    batchOption: false,
  },
  {
    id: "category" as const,
    name: "Category Level",
    description: "Apply promotion to all products in a category",
    icon: FolderOpen,
    example: "15% off all Flower products",
    color: "bg-green-500",
    batchOption: false,
  },
  {
    id: "subcategory" as const,
    name: "Sub-Category Level",
    description: "Apply promotion to products in a specific sub-category",
    icon: Layers,
    example: "30% off all Gummies",
    color: "bg-orange-500",
    batchOption: false,
  },
  {
    id: "size" as const,
    name: "Size Level",
    description: "Apply promotion to products of a specific size",
    icon: Ruler,
    example: "10% off all 1g products",
    color: "bg-teal-500",
    batchOption: false,
  },
  {
    id: "batch" as const,
    name: "Batch Level",
    description: "Apply promotion to specific inventory batches (ideal for liquidation)",
    icon: Archive,
    example: "50% off Batch BH-2025-0892 (liquidation)",
    color: "bg-red-500",
    batchOption: false,
    isLiquidation: true,
  },
]

export function PromoLevelStep({ formData, updateFormData }: PromoLevelStepProps) {
  const handleLevelSelect = (level: typeof formData.level) => {
    console.log("[v0] Promo level selected:", level)
    updateFormData({
      level,
      // Reset dependent fields when level changes
      targetId: "",
      targetName: "",
      batchIds: [],
      batchNames: [],
      isLiquidation: level === "batch",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Choose Promotion Level</h2>
        <p className="text-muted-foreground mt-2">
          Select the level at which you want to apply the promotional discount
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promoLevels.map((level) => (
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
              {level.isLiquidation && (
                <div className="mt-2 bg-red-50 border border-red-200 p-2 rounded-md">
                  <p className="text-xs text-red-600 font-medium">🔥 Perfect for liquidation sales</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.level && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              Selected: {promoLevels.find((l) => l.id === formData.level)?.name}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {promoLevels.find((l) => l.id === formData.level)?.description}
          </p>
          {formData.level === "batch" && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded-md">
              <p className="text-xs text-yellow-700">
                💡 Batch-level promotions allow you to target specific inventory batches for liquidation or clearance
                sales
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
