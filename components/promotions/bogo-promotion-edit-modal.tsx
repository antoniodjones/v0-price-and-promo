"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useWizard } from "@/lib/modal-helpers"
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

  const wizard = useWizard({
    steps,
    initialStep,
    onComplete: handleSubmit,
  })

  useEffect(() => {
    if (isOpen && promotionId) {
      loadPromotionData()
    }
  }, [isOpen, promotionId])

  const loadPromotionData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/promotions/bogo/${promotionId}`)
      if (!response.ok) throw new Error("Failed to load promotion data")

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

  const handleDataChange = (data: Partial<BogoFormData>) => {
    setFormData({ ...formData, ...data })
  }

  async function handleSubmit() {
    try {
      const response = await fetch(`/api/promotions/bogo/${promotionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to update promotion")
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
      throw error
    }
  }

  const renderStep = () => {
    switch (wizard.currentStep) {
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
  }

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit BOGO Promotion"
      description={isLoading ? "Loading promotion data..." : undefined}
      mode="wizard"
      size="lg"
      wizard={wizard}
      isLoading={isLoading}
      loadingMessage="Loading promotion data..."
    >
      {renderStep()}
    </UnifiedModal>
  )
}
