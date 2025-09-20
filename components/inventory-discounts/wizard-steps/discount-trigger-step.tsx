"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Zap } from "lucide-react"
import type { AutoDiscountFormData } from "../inventory-discount-wizard"

interface DiscountTriggerStepProps {
  formData: AutoDiscountFormData
  updateFormData: (updates: Partial<AutoDiscountFormData>) => void
}

const triggerTypes = [
  {
    id: "expiration" as const,
    name: "Expiration Date",
    description: "Automatically discount products approaching their expiration date",
    icon: Clock,
    example: "20% off products within 30 days of expiration",
    color: "bg-orange-500",
    priority: "Higher Priority",
  },
  {
    id: "thc" as const,
    name: "THC Percentage",
    description: "Automatically discount products with low THC potency",
    icon: Zap,
    example: "10% off flower products with THC below 15%",
    color: "bg-gti-purple",
    priority: "Lower Priority",
  },
]

export function DiscountTriggerStep({ formData, updateFormData }: DiscountTriggerStepProps) {
  const handleTriggerSelect = (triggerType: typeof formData.triggerType) => {
    updateFormData({
      triggerType,
      // Reset dependent fields when trigger type changes
      triggerValue: 0,
      triggerUnit: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Choose Discount Trigger</h2>
        <p className="text-muted-foreground mt-2">Select what inventory attribute should trigger automatic discounts</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {triggerTypes.map((trigger) => (
          <Card
            key={trigger.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.triggerType === trigger.id
                ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                : "hover:border-gti-light-green"
            }`}
            onClick={() => handleTriggerSelect(trigger.id)}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-md ${trigger.color}`}>
                  <trigger.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{trigger.name}</CardTitle>
                  <CardDescription>{trigger.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Example:</p>
                  <p className="text-sm font-medium">{trigger.example}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Business Priority:</span>
                  <span
                    className={`text-sm font-medium ${
                      trigger.priority === "Higher Priority" ? "text-orange-600" : "text-gti-purple"
                    }`}
                  >
                    {trigger.priority}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.triggerType && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              Selected: {triggerTypes.find((t) => t.id === formData.triggerType)?.name}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {triggerTypes.find((t) => t.id === formData.triggerType)?.description}
          </p>
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Key Benefits:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {formData.triggerType === "expiration" ? (
                <>
                  <li>• Prevents inventory write-offs</li>
                  <li>• Batch-level precision</li>
                  <li>• Real-time monitoring</li>
                </>
              ) : (
                <>
                  <li>• Moves lower potency inventory</li>
                  <li>• Pricing reflects product quality</li>
                  <li>• Automatic batch evaluation</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
