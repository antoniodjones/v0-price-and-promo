"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { PromoLevelStep } from "./wizard-steps/promo-level-step"
import { PromoTargetStep } from "./wizard-steps/promo-target-step"
import { PromoValueStep } from "./wizard-steps/promo-value-step"
import { PromoDatesStep } from "./wizard-steps/promo-dates-step"
import { PromoReviewStep } from "./wizard-steps/promo-review-step"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export interface PromoFormData {
  level: "item" | "brand" | "category" | "subcategory" | "size" | "batch" | ""
  targetId: string
  targetName: string
  batchIds: string[]
  batchNames: string[]
  discountType: "percentage" | "fixed" | "specific_price" | ""
  discountValue: number
  specificPrice?: number
  startDate: Date | null
  endDate: Date | null
  name: string
  isLiquidation: boolean
}

const steps = [
  { id: 1, name: "Promo Level", description: "Choose the level of promotion (Item, Brand, Category, Batch)" },
  { id: 2, name: "Select Target", description: "Choose specific item/brand/category/batch" },
  { id: 3, name: "Set Promo Amount", description: "Configure discount amount (%, $, or specific price)" },
  { id: 4, name: "Set Dates", description: "Configure start and end dates" },
  { id: 5, name: "Review & Create", description: "Review and create the promotional discount" },
]

export function PromotionalDiscountWizard() {
  console.log("[v0] PromotionalDiscountWizard component mounting")

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PromoFormData>({
    level: "",
    targetId: "",
    targetName: "",
    batchIds: [],
    batchNames: [],
    discountType: "",
    discountValue: 0,
    specificPrice: undefined,
    startDate: null,
    endDate: null,
    name: "",
    isLiquidation: false,
  })

  console.log("[v0] Current wizard state - step:", currentStep, "formData:", formData)

  const { toast } = useToast()
  const router = useRouter()

  const updateFormData = (updates: Partial<PromoFormData>) => {
    console.log("[v0] Updating form data with:", updates)
    setFormData((prev) => {
      const newData = { ...prev, ...updates }
      console.log("[v0] New form data:", newData)
      return newData
    })
  }

  const nextStep = () => {
    console.log("[v0] Next step clicked - current step:", currentStep)
    console.log("[v0] Can proceed?", canProceed())
    console.log("[v0] Current form data:", formData)

    if (currentStep < steps.length && canProceed()) {
      const newStep = currentStep + 1
      console.log("[v0] Moving to step:", newStep)
      setCurrentStep(newStep)
    } else {
      console.log("[v0] Cannot proceed to next step")
    }
  }

  const prevStep = () => {
    console.log("[v0] Going back to previous step from", currentStep)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      console.log("[v0] Moved to step", currentStep - 1)
    }
  }

  const canProceed = () => {
    let result = false
    switch (currentStep) {
      case 1:
        result = formData.level !== ""
        console.log("[v0] Step 1 validation - level:", formData.level, "can proceed:", result)
        break
      case 2:
        if (formData.level === "batch") {
          result = formData.batchIds.length > 0 && formData.batchNames.length > 0
          console.log(
            "[v0] Step 2 validation (batch) - batchIds:",
            formData.batchIds,
            "batchNames:",
            formData.batchNames,
            "can proceed:",
            result,
          )
        } else {
          result = formData.targetId !== "" && formData.targetName !== ""
          console.log(
            "[v0] Step 2 validation - targetId:",
            formData.targetId,
            "targetName:",
            formData.targetName,
            "can proceed:",
            result,
          )
        }
        break
      case 3:
        if (formData.discountType === "specific_price") {
          result = formData.specificPrice !== undefined && formData.specificPrice > 0
        } else {
          result = formData.discountType !== "" && formData.discountValue > 0
        }
        console.log(
          "[v0] Step 3 validation - discountType:",
          formData.discountType,
          "discountValue:",
          formData.discountValue,
          "specificPrice:",
          formData.specificPrice,
          "can proceed:",
          result,
        )
        break
      case 4:
        result = formData.startDate !== null && formData.endDate !== null
        console.log(
          "[v0] Step 4 validation - startDate:",
          formData.startDate,
          "endDate:",
          formData.endDate,
          "can proceed:",
          result,
        )
        break
      case 5:
        result = formData.name !== ""
        console.log("[v0] Step 5 validation - name:", formData.name, "can proceed:", result)
        break
      default:
        result = false
    }
    return result
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PromoLevelStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <PromoTargetStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <PromoValueStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <PromoDatesStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <PromoReviewStep formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  const handleSubmit = async () => {
    console.log("[v0] SUBMIT BUTTON CLICKED!")
    console.log("[v0] Can proceed?", canProceed())
    console.log("[v0] Form data at submission:", formData)

    if (!canProceed()) {
      console.log("[v0] Cannot proceed with submission")
      return
    }

    console.log("[v0] Creating promotional discount with data:", formData)

    setIsSubmitting(true)

    try {
      const promoData = {
        name: formData.name,
        level: formData.level,
        target: formData.level === "batch" ? "batch" : formData.targetId,
        targetName: formData.level === "batch" ? formData.batchNames.join(", ") : formData.targetName,
        batchIds: formData.level === "batch" ? formData.batchIds : undefined,
        type: formData.discountType === "specific_price" ? "fixed" : formData.discountType,
        value: formData.discountType === "specific_price" ? 0 : formData.discountValue,
        specificPrice: formData.discountType === "specific_price" ? formData.specificPrice : undefined,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        status: "active" as const,
        isLiquidation: formData.isLiquidation,
      }

      console.log("[v0] Sending API request to create promotional discount:", JSON.stringify(promoData, null, 2))

      const response = await fetch("/api/promotions/promotional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promoData),
      })

      console.log("[v0] Response status:", response.status)

      const result = await response.json()
      console.log("[v0] API response:", JSON.stringify(result, null, 2))

      if (!response.ok) {
        console.error("[v0] API error response:", result)
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to create promotion`)
      }

      // Show success toast
      toast({
        title: "Promotion Created Successfully!",
        description: `${formData.name} has been created and is now active.`,
      })

      console.log("[v0] Promotion created successfully, redirecting...")
      // Redirect to promotions list
      router.push("/promotions")
    } catch (error) {
      console.error("[v0] Error creating promotion:", error)
      toast({
        title: "Error Creating Promotion",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log("[v0] Rendering wizard - current step:", currentStep, "of", steps.length)

  return (
    <div className="space-y-6">
      <div className="bg-blue-100 p-2 text-xs font-mono">
        DEBUG: Step {currentStep}, Level: "{formData.level}", Target: "{formData.targetName}", Type: "
        {formData.discountType}", Value: {formData.discountValue}, Batches: [{formData.batchNames.join(", ")}]
      </div>

      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of {steps.length}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-gti-dark-green border-gti-dark-green">
              {steps[currentStep - 1].name}
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
              {isSubmitting ? "Creating..." : "Create Promotion"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
