"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target, BarChart3, Calendar } from "lucide-react"

interface BogoTypeStepProps {
  formData: any
  updateFormData: (updates: any) => void
}

const campaignTypes = [
  {
    id: "item",
    name: "Item Level BOGO",
    description: "Buy specific item, get another item discounted",
    icon: Target,
    example: "Buy Premium Gummies 10mg → Get Premium Gummies 5mg 50% off",
  },
  {
    id: "brand",
    name: "Brand Level BOGO",
    description: "Buy any brand product, get second brand product discounted",
    icon: BarChart3,
    example: "Buy any Incredibles → Get second Incredibles product 25% off",
  },
  {
    id: "category",
    name: "Category Level BOGO",
    description: "Buy any category product, get second category product discounted",
    icon: Calendar,
    example: "Buy any Edible → Get second Edible $10 off",
  },
]

export function BogoTypeStep({ formData, updateFormData }: BogoTypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gti-dark-green mb-2">Campaign Details</h3>
        <p className="text-muted-foreground mb-4">
          Start by giving your BOGO campaign a name and selecting the campaign type.
        </p>
      </div>

      {/* Campaign Name */}
      <div className="space-y-2">
        <Label htmlFor="campaignName">Campaign Name *</Label>
        <Input
          id="campaignName"
          placeholder="e.g., Premium Gummies BOGO November"
          value={formData.campaignName}
          onChange={(e) => updateFormData({ campaignName: e.target.value })}
        />
      </div>

      {/* Campaign Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the campaign purpose and goals..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={3}
        />
      </div>

      {/* Campaign Type Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Campaign Type *</Label>
          <p className="text-sm text-muted-foreground">Choose the level at which your BOGO campaign will operate</p>
        </div>

        <div className="grid gap-4">
          {campaignTypes.map((type) => {
            const Icon = type.icon
            const isSelected = formData.type === type.id

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-gti-bright-green bg-gti-light-green/10" : "hover:bg-gray-50"
                }`}
                onClick={() => updateFormData({ type: type.id })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-gti-bright-green text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{type.name}</CardTitle>
                      <CardDescription className="text-sm">{type.description}</CardDescription>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-gti-bright-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Example:</span> {type.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
