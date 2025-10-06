"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useWizard } from "@/lib/modal-helpers"
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
  { id: 1, title: "Discount Level", description: "Choose the level of discount" },
  { id: 2, title: "Select Target", description: "Choose specific item/brand/category" },
  { id: 3, title: "Set Discount", description: "Configure discount amount" },
  { id: 4, title: "Set Dates", description: "Configure start and end dates" },
  { id: 5, title: "Assign Customers", description: "Select customers for this discount" },
  { id: 6, title: "Review & Update", description: "Review and update the discount rule" },
]

export function CustomerDiscountEditModal({
  isOpen,
  onClose,
  discountId,
  initialStep = 1,
  onSuccess,
}: CustomerDiscountEditModalProps) {
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
      const response = await fetch(`/api/discounts/customer/${discountId}`)

      if (!response.ok) throw new Error("Failed to load discount data")

      const result = await response.json()

      if (result.success) {
        const discount = result.data
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

  const updateFormData = (updates: Partial<DiscountFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  async function handleSubmit() {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discountData),
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

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Customer Discount"
      description={isLoading ? "Loading discount data..." : undefined}
      mode="fullscreen"
      wizard={wizard}
      isLoading={isLoading}
      loadingMessage="Loading discount data..."
    >
      {renderStep()}
    </UnifiedModal>
  )
}
