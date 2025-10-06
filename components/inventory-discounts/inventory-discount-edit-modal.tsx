"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useWizard } from "@/lib/modal-helpers"
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

  const wizard = useWizard({
    steps,
    initialStep,
    onComplete: handleSubmit,
  })

  useEffect(() => {
    if (isOpen && discountId) {
      loadDiscountData()
    }
  }, [isOpen, discountId])

  const loadDiscountData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/discounts/inventory/${discountId}`)
      if (!response.ok) throw new Error("Failed to load discount data")

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

  const handleDataChange = (data: Partial<AutoDiscountFormData>) => {
    setFormData({ ...formData, ...data })
  }

  async function handleSubmit() {
    try {
      const response = await fetch(`/api/discounts/inventory/${discountId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to update discount")
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
      throw error
    }
  }

  const renderStep = () => {
    switch (wizard.currentStep) {
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
  }

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Inventory Discount"
      description={isLoading ? "Loading discount data..." : undefined}
      mode="wizard"
      size="lg"
      wizard={wizard}
      isLoading={isLoading}
      loadingMessage="Loading discount data..."
    >
      {renderStep()}
    </UnifiedModal>
  )
}
