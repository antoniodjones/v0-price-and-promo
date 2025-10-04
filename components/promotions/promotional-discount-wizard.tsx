"use client"

import { UnifiedWizard, type UnifiedWizardConfig } from "@/components/shared/unified-wizard"
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

export function PromotionalDiscountWizard() {
  const { toast } = useToast()
  const router = useRouter()

  const initialData: PromoFormData = {
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
  }

  const handleComplete = async (formData: PromoFormData) => {
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

    const response = await fetch("/api/promotions/promotional", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promoData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to create promotion`)
    }

    toast({
      title: "Promotion Created Successfully!",
      description: `${formData.name} has been created and is now active.`,
    })

    router.push("/promotions")
  }

  const config: UnifiedWizardConfig<PromoFormData> = {
    steps: [
      {
        id: 1,
        name: "Promo Level",
        description: "Choose the level of promotion (Item, Brand, Category, Batch)",
        component: ({ formData, updateFormData }) => (
          <PromoLevelStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.level !== "",
      },
      {
        id: 2,
        name: "Select Target",
        description: "Choose specific item/brand/category/batch",
        component: ({ formData, updateFormData }) => (
          <PromoTargetStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => {
          if (data.level === "batch") {
            return data.batchIds.length > 0 && data.batchNames.length > 0
          }
          return data.targetId !== "" && data.targetName !== ""
        },
      },
      {
        id: 3,
        name: "Set Promo Amount",
        description: "Configure discount amount (%, $, or specific price)",
        component: ({ formData, updateFormData }) => (
          <PromoValueStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => {
          if (data.discountType === "specific_price") {
            return data.specificPrice !== undefined && data.specificPrice > 0
          }
          return data.discountType !== "" && data.discountValue > 0
        },
      },
      {
        id: 4,
        name: "Set Dates",
        description: "Configure start and end dates",
        component: ({ formData, updateFormData }) => (
          <PromoDatesStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.startDate !== null && data.endDate !== null,
      },
      {
        id: 5,
        name: "Review & Create",
        description: "Review and create the promotional discount",
        component: ({ formData, updateFormData }) => (
          <PromoReviewStep formData={formData} updateFormData={updateFormData} />
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
