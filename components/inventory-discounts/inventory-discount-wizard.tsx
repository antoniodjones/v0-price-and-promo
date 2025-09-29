"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { DiscountTriggerStep } from "./wizard-steps/discount-trigger-step"
import { DiscountScopeStep } from "./wizard-steps/discount-scope-step"
import { TriggerValueStep } from "./wizard-steps/trigger-value-step"
import { AutoDiscountValueStep } from "./wizard-steps/auto-discount-value-step"
import { AutoDiscountDatesStep } from "./wizard-steps/auto-discount-dates-step"
import { AutoDiscountReviewStep } from "./wizard-steps/auto-discount-review-step"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export interface AutoDiscountFormData {
  triggerType: "expiration" | "thc" | ""
  level: "global" | "brand" | "category" | "subcategory" | "product" | ""
  targetId: string
  targetName: string
  triggerValue: number
  triggerUnit: string
  discountType: "percentage" | "dollar" | ""
  discountValue: number
  startDate: Date | null
  endDate: Date | null
  name: string
}

const steps = [
  { id: 1, name: "Trigger Type", description: "Choose expiration or THC trigger" },
  { id: 2, name: "Scope", description: "Set the scope of the rule" },
  { id: 3, name: "Trigger Value", description: "Configure trigger conditions" },
  { id: 4, name: "Discount Amount", description: "Set discount value" },
  { id: 5, name: "Schedule", description: "Configure dates" },
  { id: 6, name: "Review & Create", description: "Review and create the rule" },
]

export function InventoryDiscountWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<AutoDiscountFormData>({
    triggerType: "",
    level: "",
    targetId: "",
    targetName: "",
    triggerValue: 0,
    triggerUnit: "",
    discountType: "",
    discountValue: 0,
    startDate: null,
    endDate: null,
    name: "",
  })

  const { toast } = useToast()
  const router = useRouter()

  const updateFormData = (updates: Partial<AutoDiscountFormData>) => {
    try {
      setFormData((prev) => ({ ...prev, ...updates }))
    } catch (error) {
      console.error("[v0] Error updating form data:", error)
    }
  }

  const nextStep = () => {
    try {
      if (currentStep < steps.length && canProceed()) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error("[v0] Error navigating to next step:", error)
    }
  }

  const prevStep = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    } catch (error) {
      console.error("[v0] Error navigating to previous step:", error)
    }
  }

  const canProceed = () => {
    try {
      switch (currentStep) {
        case 1:
          return formData.triggerType !== ""
        case 2:
          return (
            formData.level !== "" &&
            (formData.level === "global" || (formData.targetId !== "" && formData.targetName !== ""))
          )
        case 3:
          return formData.triggerValue > 0 && formData.triggerUnit !== ""
        case 4:
          return formData.discountType !== "" && formData.discountValue > 0
        case 5:
          return formData.startDate !== null
        case 6:
          return formData.name !== ""
        default:
          return false
      }
    } catch {
      return false
    }
  }

  const renderStep = () => {
    try {
      switch (currentStep) {
        case 1:
          return <DiscountTriggerStep formData={formData} updateFormData={updateFormData} />
        case 2:
          return <DiscountScopeStep formData={formData} updateFormData={updateFormData} />
        case 3:
          return <TriggerValueStep formData={formData} updateFormData={updateFormData} />
        case 4:
          return <AutoDiscountValueStep formData={formData} updateFormData={updateFormData} />
        case 5:
          return <AutoDiscountDatesStep formData={formData} updateFormData={updateFormData} />
        case 6:
          return <AutoDiscountReviewStep formData={formData} updateFormData={updateFormData} />
        default:
          return (
            <div className="text-center py-8 text-muted-foreground">
              <p>Invalid step</p>
            </div>
          )
      }
    } catch (error) {
      console.error("[v0] Error rendering step:", error)
      return (
        <div className="text-center py-8 text-red-600">
          <p>Error loading step content</p>
        </div>
      )
    }
  }

  const progress = (currentStep / steps.length) * 100

  const handleSubmit = async () => {
    if (!canProceed()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("[v0] Creating inventory discount:", formData)

      const discountData = {
        name: formData.name || "Unnamed Inventory Discount",
        type: formData.triggerType || "expiration",
        triggerValue: formData.triggerValue || 30,
        discountType: formData.discountType === "dollar" ? "fixed" : formData.discountType || "percentage",
        discountValue: formData.discountValue || 0,
        scope: formData.level === "global" ? "all" : formData.level || "all",
        scopeValue: formData.level === "global" ? null : formData.targetId || null,
        status: "active" as const,
      }

      const response = await fetch("/api/discounts/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] API error response:", errorText)

        let errorMessage = "Failed to create inventory discount"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData?.message || errorData?.error || errorMessage
        } catch {
          errorMessage = `HTTP ${response.status}: ${errorText || "Unknown error"}`
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log("[v0] Inventory discount created successfully:", result)

      toast({
        title: "Inventory Discount Created!",
        description: `${formData.name || "Your discount rule"} has been created and is now active.`,
      })

      router.push("/inventory-discounts")
    } catch (error) {
      console.error("[v0] Error creating inventory discount:", error)
      toast({
        title: "Error Creating Discount",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of {steps.length}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1]?.description || "Unknown step"}</CardDescription>
            </div>
            <Badge variant="outline" className="text-gti-dark-green border-gti-dark-green">
              {steps[currentStep - 1]?.name || "Unknown"}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index + 1 < currentStep
                    ? "bg-gti-bright-green border-gti-bright-green text-white"
                    : index + 1 === currentStep
                      ? "border-gti-bright-green text-gti-bright-green"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${index + 1 < currentStep ? "bg-gti-bright-green" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              Next
              <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Auto Discount"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
