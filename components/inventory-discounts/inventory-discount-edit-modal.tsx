"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { DiscountTriggerStep } from "./wizard-steps/discount-trigger-step"
import { DiscountScopeStep } from "./wizard-steps/discount-scope-step"
import { TriggerValueStep } from "./wizard-steps/trigger-value-step"
import { AutoDiscountValueStep } from "./wizard-steps/auto-discount-value-step"
import { AutoDiscountDatesStep } from "./wizard-steps/auto-discount-dates-step"
import { AutoDiscountReviewStep } from "./wizard-steps/auto-discount-review-step"
import { useToast } from "@/hooks/use-toast"
import type { AutoDiscountFormData } from "./inventory-discount-wizard"

interface InventoryDiscountEditModalProps {
  isOpen: boolean
  onClose: () => void
  discountId: string
  initialStep?: number
  onSuccess: () => void
}

const steps = [
  { id: 1, title: "Trigger Type", description: "Choose trigger condition" },
  { id: 2, title: "Scope", description: "Set product scope" },
  { id: 3, title: "Trigger Value", description: "Set trigger threshold" },
  { id: 4, title: "Discount", description: "Configure discount" },
  { id: 5, title: "Schedule", description: "Set dates" },
  { id: 6, title: "Review", description: "Review and update" },
]

export function InventoryDiscountEditModal({
  isOpen,
  onClose,
  discountId,
  initialStep = 1,
  onSuccess,
}: InventoryDiscountEditModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<AutoDiscountFormData>({
    name: "",
    triggerType: "",
    triggerValue: 0,
    scope: "",
    scopeValue: "",
    discountType: "",
    discountValue: 0,
    startDate: null,
    endDate: null,
  })

  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep)
    }
  }, [initialStep, isOpen])

  useEffect(() => {
    if (isOpen && discountId) {
      loadDiscountData()
    }
  }, [isOpen, discountId])

  const loadDiscountData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/discounts/inventory/${discountId}`)
      if (!response.ok) {
        throw new Error("Failed to load discount data")
      }

      const result = await response.json()
      if (result.success) {
        const discount = result.data
        setFormData({
          name: discount.name || "",
          triggerType: discount.trigger_type || discount.triggerType || "",
          triggerValue: discount.trigger_value || discount.triggerValue || 0,
          scope: discount.scope || "",
          scopeValue: discount.scope_value || discount.scopeValue || "",
          discountType: discount.discount_type || discount.discountType || "",
          discountValue: discount.discount_value || discount.discountValue || 0,
          startDate: discount.start_date ? new Date(discount.start_date) : null,
          endDate: discount.end_date ? new Date(discount.end_date) : null,
        })
      } else {
        throw new Error(result.message || "Failed to load discount")
      }
    } catch (error) {
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

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
  }

  const handleDataChange = (data: Partial<AutoDiscountFormData>) => {
    setFormData({ ...formData, ...data })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/discounts/inventory/${discountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  const renderStep = () => {
    try {
      switch (currentStep) {
        case 1:
          return <DiscountTriggerStep formData={formData} updateFormData={handleDataChange} />
        case 2:
          return <DiscountScopeStep formData={formData} updateFormData={handleDataChange} />
        case 3:
          return <TriggerValueStep formData={formData} updateFormData={handleDataChange} />
        case 4:
          return <AutoDiscountValueStep formData={formData} updateFormData={handleDataChange} />
        case 5:
          return <AutoDiscountDatesStep formData={formData} updateFormData={handleDataChange} />
        case 6:
          return <AutoDiscountReviewStep formData={formData} updateFormData={handleDataChange} />
        default:
          return null
      }
    } catch (error) {
      console.error("[v0] InventoryDiscountEditModal: Error rendering step", currentStep, error)
      return <div className="text-red-500">Error loading step {currentStep}</div>
    }
  }

  const handleClose = () => {
    setCurrentStep(initialStep)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Inventory Discount</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Loading discount data..."
                  : `Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].description}`}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!isLoading && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
          )}
          {!isLoading && <Progress value={progress} className="h-2" />}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gti-bright-green mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading discount data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        index + 1 < currentStep
                          ? "bg-gti-bright-green border-gti-bright-green text-white cursor-pointer hover:bg-gti-medium-green"
                          : index + 1 === currentStep
                            ? "border-gti-bright-green text-gti-bright-green cursor-pointer hover:border-gti-medium-green"
                            : "border-gray-300 text-gray-300 cursor-pointer hover:border-gray-400"
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 ${index + 1 < currentStep ? "bg-gti-bright-green" : "bg-gray-300"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="py-6">{renderStep()}</div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="bg-gti-bright-green hover:bg-gti-medium-green">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gti-bright-green hover:bg-gti-medium-green"
                  >
                    {isSubmitting ? "Updating..." : "Update Discount"}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
