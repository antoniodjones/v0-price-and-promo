"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package, Percent, DollarSign, Gift } from "lucide-react"

interface BogoRewardStepProps {
  formData: any
  updateFormData: (updates: any) => void
}

const rewardTypes = [
  {
    id: "percentage",
    name: "Percentage Off",
    description: "Give a percentage discount on the reward item",
    icon: Percent,
    example: "50% off second item",
  },
  {
    id: "dollar",
    name: "Dollar Amount Off",
    description: "Give a fixed dollar discount on the reward item",
    icon: DollarSign,
    example: "$10 off second item",
  },
  {
    id: "free",
    name: "Free Item",
    description: "Give the reward item completely free",
    icon: Gift,
    example: "Second item free",
  },
]

// Mock reward items based on trigger selection
const getRewardOptions = (triggerTarget: string, type: string) => {
  if (type === "item") {
    return [
      { id: "1", name: "Premium Gummies - 5mg", sku: "PG-5", category: "Edibles" },
      { id: "2", name: "Premium Gummies - 10mg", sku: "PG-10", category: "Edibles" },
      { id: "3", name: "Premium Gummies - 20mg", sku: "PG-20", category: "Edibles" },
    ]
  } else if (type === "brand") {
    return [{ id: "any", name: "Any Second Product from Same Brand", description: "Customer chooses second item" }]
  } else {
    return [{ id: "any", name: "Any Second Product from Same Category", description: "Customer chooses second item" }]
  }
}

export function BogoRewardStep({ formData, updateFormData }: BogoRewardStepProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const rewardOptions = getRewardOptions(formData.triggerTarget, formData.type)
  const filteredOptions = rewardOptions.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleRewardTypeSelection = (type: string) => {
    updateFormData({
      rewardType: type,
      rewardValue: type === "free" ? 100 : formData.rewardValue || 0,
    })
  }

  const handleRewardSelection = (item: any) => {
    updateFormData({ rewardTarget: item.name })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gti-dark-green mb-2">Configure Reward</h3>
        <p className="text-muted-foreground">Set up what customers will receive when they trigger the BOGO offer.</p>
      </div>

      {/* Reward Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Reward Type *</Label>
        <div className="grid gap-3">
          {rewardTypes.map((type) => {
            const Icon = type.icon
            const isSelected = formData.rewardType === type.id

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-gti-bright-green bg-gti-light-green/10" : "hover:bg-gray-50"
                }`}
                onClick={() => handleRewardTypeSelection(type.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{type.name}</CardTitle>
                      <CardDescription className="text-xs">{type.description}</CardDescription>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 bg-gti-bright-green rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600">{type.example}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Reward Value */}
      {formData.rewardType && formData.rewardType !== "free" && (
        <div className="space-y-2">
          <Label htmlFor="rewardValue">
            {formData.rewardType === "percentage" ? "Discount Percentage" : "Discount Amount"} *
          </Label>
          <div className="relative">
            <Input
              id="rewardValue"
              type="number"
              min="0"
              max={formData.rewardType === "percentage" ? "100" : undefined}
              step={formData.rewardType === "percentage" ? "1" : "0.01"}
              value={formData.rewardValue}
              onChange={(e) => updateFormData({ rewardValue: Number.parseFloat(e.target.value) || 0 })}
              className={formData.rewardType === "percentage" ? "pr-8" : "pl-8"}
            />
            {formData.rewardType === "percentage" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</div>
            )}
            {formData.rewardType === "dollar" && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</div>
            )}
          </div>
        </div>
      )}

      {/* Reward Product Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Reward Product *</Label>

        {formData.type === "item" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reward products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {filteredOptions.map((item: any) => (
                <div
                  key={item.id}
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                    formData.rewardTarget === item.name
                      ? "bg-gti-light-green/10 border-l-4 border-l-gti-bright-green"
                      : ""
                  }`}
                  onClick={() => handleRewardSelection(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gti-dark-green" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.sku && (
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.sku} • {item.category}
                          </p>
                        )}
                      </div>
                    </div>
                    {formData.rewardTarget === item.name && (
                      <div className="w-5 h-5 bg-gti-bright-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(formData.type === "brand" || formData.type === "category") && (
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Gift className="h-5 w-5 text-gti-bright-green" />
                <div>
                  <p className="font-medium">Flexible Reward Selection</p>
                  <p className="text-sm text-muted-foreground">
                    Customers can choose any second product from the same {formData.type} for their reward
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Advanced Settings</Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rewardQuantity">Reward Quantity</Label>
            <Input
              id="rewardQuantity"
              type="number"
              min="1"
              value={formData.rewardQuantity}
              onChange={(e) => updateFormData({ rewardQuantity: Number.parseInt(e.target.value) || 1 })}
            />
            <p className="text-xs text-muted-foreground">How many reward items customer receives</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRewards">Max Rewards Per Order</Label>
            <Input
              id="maxRewards"
              type="number"
              min="1"
              value={formData.maxRewardsPerOrder}
              onChange={(e) => updateFormData({ maxRewardsPerOrder: Number.parseInt(e.target.value) || 1 })}
            />
            <p className="text-xs text-muted-foreground">Limit how many times BOGO can apply per order</p>
          </div>
        </div>
      </div>

      {/* Reward Summary */}
      {formData.rewardType && formData.rewardTarget && (
        <Card className="bg-gti-light-green/10 border-gti-bright-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gti-dark-green">Reward Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Customers will receive{" "}
              <span className="font-semibold text-gti-dark-green">
                {formData.rewardQuantity} × {formData.rewardTarget}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-gti-dark-green">
                {formData.rewardType === "free"
                  ? "no cost (free)"
                  : formData.rewardType === "percentage"
                    ? `${formData.rewardValue}% off`
                    : `$${formData.rewardValue} off`}
              </span>
              {formData.maxRewardsPerOrder > 1 && <span>, up to {formData.maxRewardsPerOrder} times per order</span>}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
