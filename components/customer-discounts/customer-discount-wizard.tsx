"use client"

import { UnifiedWizard, type UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { DiscountLevelStep } from "./wizard-steps/discount-level-step"
import { DiscountTargetStep } from "./wizard-steps/discount-target-step"
import { DiscountValueStep } from "./wizard-steps/discount-value-step"
import { DiscountDatesStep } from "./wizard-steps/discount-dates-step"
import { CustomerAssignmentStep } from "./wizard-steps/customer-assignment-step"
import { DiscountReviewStep } from "./wizard-steps/discount-review-step"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export interface DiscountFormData {
  level: "customer" | "tier" | "market" | ""
  targetId: string
  targetName: string
  discountType: "percentage" | "dollar" | ""
  discountValue: number
  startDate: Date | null
  endDate: Date | null
  customers: string[]
  name: string
}

export function CustomerDiscountWizard() {
  const { toast } = useToast()
  const router = useRouter()

  const initialData: DiscountFormData = {
    level: "",
    targetId: "",
    targetName: "",
    discountType: "",
    discountValue: 0,
    startDate: null,
    endDate: null,
    customers: [],
    name: "",
  }

  const handleComplete = async (formData: DiscountFormData) => {
    console.log("[v0] Starting discount creation...")

    const customerIds = Array.isArray(formData.customers) ? formData.customers : []

    const discountData = {
      name: formData.name || "Unnamed Discount",
      level: formData.level || "customer",
      target: formData.targetId || "unknown",
      type: formData.discountType === "dollar" ? "fixed" : formData.discountType || "percentage",
      value: formData.discountValue || 0,
      startDate: formData.startDate?.toISOString() || new Date().toISOString(),
      endDate: formData.endDate?.toISOString() || null,
      customerIds: customerIds,
      status: "active" as const,
      markets: ["california"],
      customerTiers: ["A"],
    }

    console.log("[v0] Submitting discount data:", discountData)

    const response = await fetch("/api/discounts/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discountData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] API error response:", errorText)

      let errorMessage = "Failed to create discount"
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData?.message || errorData?.error || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${errorText || "Unknown error"}`
      }

      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log("[v0] Discount created successfully:", result)

    toast({
      title: "Discount Created Successfully!",
      description: `${formData.name || "Your discount"} has been created and is now active.`,
    })

    router.push("/customer-discounts")
  }

  const config: UnifiedWizardConfig<DiscountFormData> = {
    steps: [
      {
        id: 1,
        name: "Discount Level",
        description: "Choose the level of discount",
        component: ({ formData, updateFormData }) => (
          <DiscountLevelStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.level !== "",
      },
      {
        id: 2,
        name: "Select Target",
        description: "Choose products, brands, or categories",
        component: ({ formData, updateFormData }) => (
          <DiscountTargetStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.targetId !== "" && data.targetName !== "",
      },
      {
        id: 3,
        name: "Set Discount",
        description: "Configure discount amount",
        component: ({ formData, updateFormData }) => (
          <DiscountValueStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.discountType !== "" && data.discountValue > 0,
      },
      {
        id: 4,
        name: "Set Dates",
        description: "Configure start and end dates",
        component: ({ formData, updateFormData }) => (
          <DiscountDatesStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.startDate !== null && data.endDate !== null,
      },
      {
        id: 5,
        name: "Assign Customers",
        description: "Select customers for this discount",
        component: ({ formData, updateFormData }) => (
          <CustomerAssignmentStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => Array.isArray(data.customers) && data.customers.length > 0,
      },
      {
        id: 6,
        name: "Review & Create",
        description: "Review and create the discount rule",
        component: ({ formData, updateFormData }) => (
          <DiscountReviewStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.name !== "" && data.name.trim().length >= 3,
      },
    ],
    initialData,
    onComplete: handleComplete,
    navigationStyle: "arrows",
    progressStyle: "steps",
    showStepIndicators: true,
  }

  return <UnifiedWizard config={config} />
}
