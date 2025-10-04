"use client"

import { UnifiedWizard, type UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { BundleTypeStep } from "./wizard-steps/bundle-type-step"
import { BundleProductsStep } from "./wizard-steps/bundle-products-step"
import { BundlePricingStep } from "./wizard-steps/bundle-pricing-step"
import { BundleRulesStep } from "./wizard-steps/bundle-rules-step"
import { BundleDatesStep } from "./wizard-steps/bundle-dates-step"
import { BundleReviewStep } from "./wizard-steps/bundle-review-step"

interface BundleData {
  name: string
  description: string
  bundleType: string
  products: any[]
  categories: any[]
  discountType: string
  discountValue: number
  tieredPricing: any[]
  minQuantity: number
  maxQuantity: number | null
  customerTiers: any[]
  markets: any[]
  startDate: string
  endDate: string
  usageLimit: number | null
  perCustomerLimit: number | null
}

export function BundleDealWizard() {
  const initialData: BundleData = {
    name: "",
    description: "",
    bundleType: "",
    products: [],
    categories: [],
    discountType: "",
    discountValue: 0,
    tieredPricing: [],
    minQuantity: 1,
    maxQuantity: null,
    customerTiers: [],
    markets: [],
    startDate: "",
    endDate: "",
    usageLimit: null,
    perCustomerLimit: null,
  }

  const handleComplete = async (data: BundleData) => {
    console.log("[v0] Creating bundle deal:", data)
    // TODO: Implement bundle creation API call
  }

  const config: UnifiedWizardConfig<BundleData> = {
    steps: [
      {
        id: 1,
        name: "Bundle Type",
        description: "Choose bundle structure",
        component: ({ formData, updateFormData }) => <BundleTypeStep data={formData} onChange={updateFormData} />,
      },
      {
        id: 2,
        name: "Products",
        description: "Select products or categories",
        component: ({ formData, updateFormData }) => <BundleProductsStep data={formData} onChange={updateFormData} />,
      },
      {
        id: 3,
        name: "Pricing",
        description: "Set discount structure",
        component: ({ formData, updateFormData }) => <BundlePricingStep data={formData} onChange={updateFormData} />,
      },
      {
        id: 4,
        name: "Rules",
        description: "Configure bundle rules",
        component: ({ formData, updateFormData }) => <BundleRulesStep data={formData} onChange={updateFormData} />,
      },
      {
        id: 5,
        name: "Schedule",
        description: "Set dates and limits",
        component: ({ formData, updateFormData }) => <BundleDatesStep data={formData} onChange={updateFormData} />,
      },
      {
        id: 6,
        name: "Review",
        description: "Review and create bundle",
        component: ({ formData, updateFormData }) => <BundleReviewStep data={formData} onChange={updateFormData} />,
      },
    ],
    initialData,
    onComplete: handleComplete,
    navigationStyle: "chevrons",
    progressStyle: "percentage",
    showStepIndicators: true,
  }

  return <UnifiedWizard config={config} />
}
