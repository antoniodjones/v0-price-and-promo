"use client"

import { UnifiedWizard, type UnifiedWizardConfig } from "@/components/shared/unified-wizard"
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

export function InventoryDiscountWizard() {
  const { toast } = useToast()
  const router = useRouter()

  const initialData: AutoDiscountFormData = {
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
  }

  const handleComplete = async (formData: AutoDiscountFormData) => {
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

    toast({
      title: "Inventory Discount Created!",
      description: `${formData.name || "Your discount rule"} has been created and is now active.`,
    })

    router.push("/inventory-discounts")
  }

  const config: UnifiedWizardConfig<AutoDiscountFormData> = {
    steps: [
      {
        id: 1,
        name: "Trigger Type",
        description: "Choose expiration or THC trigger",
        component: ({ formData, updateFormData }) => (
          <DiscountTriggerStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.triggerType !== "",
      },
      {
        id: 2,
        name: "Scope",
        description: "Set the scope of the rule",
        component: ({ formData, updateFormData }) => (
          <DiscountScopeStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) =>
          data.level !== "" && (data.level === "global" || (data.targetId !== "" && data.targetName !== "")),
      },
      {
        id: 3,
        name: "Trigger Value",
        description: "Configure trigger conditions",
        component: ({ formData, updateFormData }) => (
          <TriggerValueStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.triggerValue > 0 && data.triggerUnit !== "",
      },
      {
        id: 4,
        name: "Discount Amount",
        description: "Set discount value",
        component: ({ formData, updateFormData }) => (
          <AutoDiscountValueStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.discountType !== "" && data.discountValue > 0,
      },
      {
        id: 5,
        name: "Schedule",
        description: "Configure dates",
        component: ({ formData, updateFormData }) => (
          <AutoDiscountDatesStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.startDate !== null,
      },
      {
        id: 6,
        name: "Review & Create",
        description: "Review and create the rule",
        component: ({ formData, updateFormData }) => (
          <AutoDiscountReviewStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.name !== "",
      },
    ],
    initialData,
    onComplete: handleComplete,
    navigationStyle: "arrows",
    progressStyle: "percentage",
    showStepIndicators: true,
  }

  return <UnifiedWizard config={config} />
}
