"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Award, Globe } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountLevelStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

const discountLevels = [
  {
    id: "customer" as const,
    name: "Customer Level",
    description: "Apply discount to specific individual customers",
    icon: Users,
    example: "15% off for VIP customer John Smith",
    color: "bg-gti-bright-green",
  },
  {
    id: "tier" as const,
    name: "Tier Level",
    description: "Apply discount to customers in a specific tier",
    icon: Award,
    example: "10% off for all Gold tier customers",
    color: "bg-gti-medium-green",
  },
  {
    id: "market" as const,
    name: "Market Level",
    description: "Apply discount to customers in a specific market/region",
    icon: Globe,
    example: "8% off for all Bay Area customers",
    color: "bg-gti-light-green",
  },
]

export function DiscountLevelStep({ formData, updateFormData }: DiscountLevelStepProps) {
  const handleLevelSelect = (level: typeof formData.level) => {
    console.log("[v0] Level selected:", level)
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
