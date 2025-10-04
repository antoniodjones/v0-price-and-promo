import type { UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { DiscountLevelStep } from "@/components/customer-discounts/wizard-steps/discount-level-step"
import { DiscountTargetStep } from "@/components/customer-discounts/wizard-steps/discount-target-step"
import { DiscountValueStep } from "@/components/customer-discounts/wizard-steps/discount-value-step"
import { DiscountDatesStep } from "@/components/customer-discounts/wizard-steps/discount-dates-step"
import { CustomerAssignmentStep } from "@/components/customer-discounts/wizard-steps/customer-assignment-step"
import { DiscountReviewStep } from "@/components/customer-discounts/wizard-steps/discount-review-step"

export interface CustomerDiscountFormData {
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

export const createCustomerDiscountWizardConfig = (
  onComplete: (data: CustomerDiscountFormData) => Promise<void>,
): UnifiedWizardConfig<CustomerDiscountFormData> => ({
  title: "Customer Discount Wizard",
  initialData: {
    level: "",
    targetId: "",
    targetName: "",
    discountType: "",
    discountValue: 0,
    startDate: null,
    endDate: null,
    customers: [],
    name: "",
  },
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
  onComplete,
  navigationStyle: "arrows",
  progressStyle: "percentage",
  showStepIndicators: true,
})
