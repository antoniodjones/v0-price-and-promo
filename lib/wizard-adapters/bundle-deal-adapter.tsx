"use client"

import type { UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { BundleTypeStep } from "@/components/bundle-deals/wizard-steps/bundle-type-step"
import { BundleProductsStep } from "@/components/bundle-deals/wizard-steps/bundle-products-step"
import { BundlePricingStep } from "@/components/bundle-deals/wizard-steps/bundle-pricing-step"
import { BundleRulesStep } from "@/components/bundle-deals/wizard-steps/bundle-rules-step"
import { BundleDatesStep } from "@/components/bundle-deals/wizard-steps/bundle-dates-step"
import { BundleReviewStep } from "@/components/bundle-deals/wizard-steps/bundle-review-step"

export interface BundleDealFormData {
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

export const createBundleDealWizardConfig = (
  onComplete: (data: BundleDealFormData) => Promise<void>,
): UnifiedWizardConfig<BundleDealFormData> => ({
  title: "Bundle Deal Wizard",
  initialData: {
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
  },
  steps: [
    {
      id: 1,
      name: "Bundle Type",
      description: "Choose bundle structure",
      component: ({ formData, updateFormData }) => <BundleTypeStep data={formData} onChange={updateFormData} />,
      validate: (data) => data.bundleType !== "" && data.name !== "",
    },
    {
      id: 2,
      name: "Products",
      description: "Select products or categories",
      component: ({ formData, updateFormData }) => <BundleProductsStep data={formData} onChange={updateFormData} />,
      validate: (data) => data.products.length > 0 || data.categories.length > 0,
    },
    {
      id: 3,
      name: "Pricing",
      description: "Set discount structure",
      component: ({ formData, updateFormData }) => <BundlePricingStep data={formData} onChange={updateFormData} />,
      validate: (data) => data.discountType !== "" && data.discountValue > 0,
    },
    {
      id: 4,
      name: "Rules",
      description: "Configure bundle rules",
      component: ({ formData, updateFormData }) => <BundleRulesStep data={formData} onChange={updateFormData} />,
      validate: (data) => data.minQuantity > 0,
    },
    {
      id: 5,
      name: "Schedule",
      description: "Set dates and limits",
      component: ({ formData, updateFormData }) => <BundleDatesStep data={formData} onChange={updateFormData} />,
      validate: (data) => data.startDate !== "" && data.endDate !== "",
    },
    {
      id: 6,
      name: "Review",
      description: "Review and create bundle",
      component: ({ formData, updateFormData }) => <BundleReviewStep data={formData} onChange={updateFormData} />,
      validate: () => true,
    },
  ],
  onComplete,
  navigationStyle: "chevrons",
  progressStyle: "percentage",
  showStepIndicators: true,
})
