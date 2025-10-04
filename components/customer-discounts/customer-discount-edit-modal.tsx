"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Edit } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { DiscountLevelStep } from "./wizard-steps/discount-level-step"
import { DiscountTargetStep } from "./wizard-steps/discount-target-step"
import { DiscountValueStep } from "./wizard-steps/discount-value-step"
import { DiscountDatesStep } from "./wizard-steps/discount-dates-step"
import { CustomerAssignmentStep } from "./wizard-steps/customer-assignment-step"
import { DiscountReviewStep } from "./wizard-steps/discount-review-step"
import { useToast } from "@/hooks/use-toast"
import type { DiscountFormData } from "./customer-discount-wizard"

interface CustomerDiscountEditModalProps {
  isOpen: boolean
  onClose: () => void
  discountId: string
  initialStep?: number
  onSuccess: () => void
}

const steps = [
  { id: 1, name: "Discount Level", description: "Choose the level of discount" },
  { id: 2, name: "Select Target", description: "Choose specific item/brand/category" },
  { id: 3, name: "Set Discount", description: "Configure discount amount" },
  { id: 4, name: "Set Dates", description: "Configure start and end dates" },
  { id: 5, name: "Assign Customers", description: "Select customers for this discount" },
  { id: 6, name: "Review & Update", description: "Review and update the discount rule" },
]

export function CustomerDiscountEditModal({
  isOpen,
  onClose,
  discountId,
  initialStep = 1,
  onSuccess,
}: CustomerDiscountEditModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<DiscountFormData>({
    level: "",
    targetId: "",
    targetName: "",
    discountType: "",
    discountValue: 0,
    startDate: null,
    endDate: null,
    customers: [],
    name: "",
  })

  const { toast } = useToast()

  // Load existing discount data when modal opens
  useEffect(() => {
    if (isOpen && discountId) {
      loadDiscountData()
      setCurrentStep(initialStep)
    }
  }, [isOpen, discountId, initialStep])

  const loadDiscountData = async () => {
    try {
      setIsLoading(true)
      console.log("[v0] Loading discount data for ID:", discountId)
      const response = await fetch(`/api/discounts/customer/${discountId}`)
      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        throw new Error("Failed to load discount data")
      }

      const result = await response.json()
      console.log("[v0] Loaded discount data:", result)

      if (result.success) {
        const discount = result.data
        console.log("[v0] Discount details:", discount)
        console.log("[v0] Customer IDs:", discount.customer_ids)

        setFormData({
          level: discount.level || "",
          targetId: discount.target || "",
          targetName: discount.target || "",
          discountType: discount.type === "fixed" ? "dollar" : discount.type || "",
          discountValue: discount.value || 0,
          startDate: discount.start_date ? new Date(discount.start_date) : null,
          endDate: discount.end_date ? new Date(discount.end_date) : null,
          customers: discount.customer_ids || [],
          name: discount.name || "",
        })

        console.log("[v0] Form data set:", {
          level: discount.level,
          targetId: discount.target,
          discountType: discount.type === "fixed" ? "dollar" : discount.type,
          discountValue: discount.value,
          customers: discount.customer_ids,
          name: discount.name,
        })
      } else {
        throw new Error(result.message || "Failed to load discount")
      }
    } catch (error) {
      console.error("[v0] Error loading discount:", error)
      toast({
        title: "Error Loading Discount",
        description: error instanceof Error ? error.message : "Failed to load discount data",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (updates: Partial<DiscountFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  const nextStep = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.level !== ""
      case 2:
        return formData.targetId !== "" && formData.targetName !== ""
      case 3:
        return formData.discountType !== "" && formData.discountValue > 0
      case 4:
        return formData.startDate !== null && formData.endDate !== null
      case 5:
        return formData.customers.length > 0
      case 6:
        return formData.name !== ""
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DiscountLevelStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <DiscountTargetStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <DiscountValueStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <DiscountDatesStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <CustomerAssignmentStep formData={formData} updateFormData={updateFormData} />
      case 6:
        return <DiscountReviewStep formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  const handleSubmit = async () => {
    if (!canProceed()) {
      return
    }

    setIsSubmitting(true)

    try {
      const customerIds = Array.isArray(formData.customers) ? formData.customers : []

      const discountData = {
        name: formData.name,
        level: formData.level,
        target: formData.targetId,
        type: formData.discountType === "dollar" ? "fixed" : formData.discountType,
        value: formData.discountValue,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        customerIds: customerIds,
        status: "active" as const,
        markets: ["california"],
        customerTiers: ["A"],
      }

      const response = await fetch(`/api/discounts/customer/${discountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to update discount`)
      }

      toast({
        title: "Discount Updated Successfully!",
        description: `${formData.name} has been updated.`,
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Discount",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(initialStep)
    setFormData({
      level: "",
      targetId: "",
      targetName: "",
      discountType: "",
      discountValue: 0,
      startDate: null,
      endDate: null,
      customers: [],
      name: "",
    })
    onClose()
  }

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gti-bright-green mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading discount data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={handleClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Discounts
          </Button>
          <Badge variant="default" className="bg-gti-bright-green text-white gap-2 px-4 py-2">
            <Edit className="h-4 w-4" />
            Edit Mode
          </Badge>
        </div>

        <div className="space-y-6">
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

          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => goToStep(index + 1)}
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      index + 1 < currentStep
                        ? "bg-gti-bright-green border-gti-bright-green text-white hover:bg-gti-medium-green hover:scale-110"
                        : index + 1 === currentStep
                          ? "border-gti-bright-green text-gti-bright-green bg-gti-bright-green/10 hover:bg-gti-bright-green/20"
                          : "border-gray-300 text-gray-400 hover:border-gti-bright-green hover:text-gti-bright-green hover:scale-105"
                    }`}
                    title={`Go to ${step.name}`}
                  >
                    {index + 1 < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </button>
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
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between w-full gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="shrink-0 bg-transparent min-w-[120px]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="bg-gti-bright-green hover:bg-gti-medium-green text-white shrink-0 min-w-[120px] ml-auto"
                  >
                    Next
                    <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-gti-bright-green hover:bg-gti-medium-green text-white shrink-0 min-w-[180px] ml-auto"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Discount"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
