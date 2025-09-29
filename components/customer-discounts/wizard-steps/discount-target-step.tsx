"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Users, Award, Globe } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface DiscountTargetStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

// Mock data - in real app this would come from API
const mockTargets = {
  customer: [
    { id: "customer-1", name: "Premium Cannabis Co", type: "Individual Customer", productCount: 47 },
    { id: "customer-2", name: "Incredibles Retail", type: "Business Customer", productCount: 23 },
    { id: "customer-3", name: "Green Thumb Dispensary", type: "Wholesale Customer", productCount: 89 },
    { id: "customer-4", name: "Rise Collective", type: "Premium Customer", productCount: 156 },
  ],
  tier: [
    { id: "tier-1", name: "Premium Tier", type: "High-value customers", productCount: 234 },
    { id: "tier-2", name: "Standard Tier", type: "Regular customers", productCount: 89 },
    { id: "tier-3", name: "Basic Tier", type: "New customers", productCount: 67 },
    { id: "tier-4", name: "VIP Tier", type: "Exclusive customers", productCount: 45 },
  ],
  market: [
    { id: "market-1", name: "California", type: "State Market", productCount: 1234 },
    { id: "market-2", name: "Bay Area", type: "Regional Market", productCount: 456 },
    { id: "market-3", name: "Los Angeles", type: "City Market", productCount: 789 },
    { id: "market-4", name: "San Diego", type: "City Market", productCount: 321 },
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
    console.log("[v0] Target selected:", target)
    updateFormData({
      targetId: target.id,
      targetName: target.name,
    })
  }

  const getLevelIcon = () => {
    switch (formData.level) {
      case "customer":
        return <Users className="h-4 w-4" />
      case "tier":
        return <Award className="h-4 w-4" />
      case "market":
        return <Globe className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getLevelTitle = () => {
    switch (formData.level) {
      case "customer":
        return "Select Customer"
      case "tier":
        return "Select Tier"
      case "market":
        return "Select Market"
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
                    <p className="text-xs text-muted-foreground">{target.type}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {target.productCount} items
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
            Discount will apply to all items in this {formData.level}
          </p>
        </div>
      )}
    </div>
  )
}
