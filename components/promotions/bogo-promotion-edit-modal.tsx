"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { BogoTypeStep } from "./wizard-steps/bogo-type-step"
import { BogoTriggerStep } from "./wizard-steps/bogo-trigger-step"
import { BogoRewardStep } from "./wizard-steps/bogo-reward-step"
import { BogoDatesStep } from "./wizard-steps/bogo-dates-step"
import { BogoReviewStep } from "./wizard-steps/bogo-review-step"
import { useToast } from "@/hooks/use-toast"
import type { BogoFormData } from "./bogo-promotion-wizard"

interface BogoPromotionEditModalProps {
  isOpen: boolean
  onClose: () => void
  promotionId: string
  initialStep?: number
  onSuccess: () => void
}

const steps = [
  { id: 1, title: "BOGO Type", description: "Choose BOGO structure" },
  { id: 2, title: "Trigger", description: "Set trigger products" },
  { id: 3, title: "Reward", description: "Configure reward" },
  { id: 4, title: "Schedule", description: "Set dates" },
  { id: 5, title: "Review", description: "Review and update" },
]

export function BogoPromotionEditModal({
  isOpen,
  onClose,
  promotionId,
  initialStep = 1,
  onSuccess,
}: BogoPromotionEditModalProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<BogoFormData>({
    name: "",
    bogoType: "",
    triggerType: "",
    triggerProducts: [],
    triggerBrand: "",
    triggerCategory: "",
    triggerQuantity: 1,
    rewardType: "",
    rewardProducts: [],
    rewardBrand: "",
    rewardCategory: "",
    rewardValue: 0,
    rewardValueType: "",
    startDate: null,
    endDate: null,
    usageLimit: null,
    perCustomerLimit: null,
  })

  const { toast } = useToast()

  // Update current step when initialStep changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep)
    }
  }, [initialStep, isOpen])

  // Load existing promotion data when modal opens
  useEffect(() => {
    if (isOpen && promotionId) {
      loadPromotionData()
    }
  }, [isOpen, promotionId])

  const loadPromotionData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/promotions/bogo/${promotionId}`)
      if (!response.ok) {
        throw new Error("Failed to load promotion data")
      }

      const result = await response.json()
      if (result.success) {
        const promo = result.data
        setFormData({
          name: promo.name || "",
          bogoType: promo.bogo_type || promo.bogoType || "",
          triggerType: promo.trigger_type || promo.triggerType || "",
          triggerProducts: promo.trigger_products || promo.triggerProducts || [],
          triggerBrand: promo.trigger_brand || promo.triggerBrand || "",
          triggerCategory: promo.trigger_category || promo.triggerCategory || "",
          triggerQuantity: promo.trigger_quantity || promo.triggerQuantity || 1,
          rewardType: promo.reward_type || promo.rewardType || "",
          rewardProducts: promo.reward_products || promo.rewardProducts || [],
          rewardBrand: promo.reward_brand || promo.rewardBrand || "",
          rewardCategory: promo.reward_category || promo.rewardCategory || "",
          rewardValue: promo.reward_value || promo.rewardValue || 0,
          rewardValueType: promo.reward_value_type || promo.rewardValueType || "",
          startDate: promo.start_date ? new Date(promo.start_date) : null,
          endDate: promo.end_date ? new Date(promo.end_date) : null,
          usageLimit: promo.usage_limit || promo.usageLimit || null,
          perCustomerLimit: promo.per_customer_limit || promo.perCustomerLimit || null,
        })
      } else {
        throw new Error(result.message || "Failed to load promotion")
      }
    } catch (error) {
      toast({
        title: "Error Loading Promotion",
        description: error instanceof Error ? error.message : "Failed to load promotion data",
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

  const handleDataChange = (data: Partial<BogoFormData>) => {
    setFormData({ ...formData, ...data })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/promotions/bogo/${promotionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to update promotion`)
      }

      toast({
        title: "Promotion Updated Successfully!",
        description: `${formData.name} has been updated.`,
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Promotion",
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
          return <BogoTypeStep formData={formData} updateFormData={handleDataChange} />
        case 2:
          return <BogoTriggerStep formData={formData} updateFormData={handleDataChange} />
        case 3:
          return <BogoRewardStep formData={formData} updateFormData={handleDataChange} />
        case 4:
          return <BogoDatesStep formData={formData} updateFormData={handleDataChange} />
        case 5:
          return <BogoReviewStep formData={formData} updateFormData={handleDataChange} />
        default:
          return null
      }
    } catch (error) {
      console.error("[v0] BogoPromotionEditModal: Error rendering step", currentStep, error)
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
              <DialogTitle>Edit BOGO Promotion</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Loading promotion data..."
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
              <p className="text-muted-foreground">Loading promotion data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Step Navigation with clickable indicators */}
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

            {/* Step Content */}
            <div className="py-6">{renderStep()}</div>

            {/* Navigation */}
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
                    {isSubmitting ? "Updating..." : "Update Promotion"}
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
