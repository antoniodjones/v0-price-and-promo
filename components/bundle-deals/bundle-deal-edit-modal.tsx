"use client"

import { useState, useEffect } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useWizard } from "@/lib/modal-helpers"
import { BundleTypeStep } from "./wizard-steps/bundle-type-step"
import { BundleProductsStep } from "./wizard-steps/bundle-products-step"
import { BundlePricingStep } from "./wizard-steps/bundle-pricing-step"
import { BundleRulesStep } from "./wizard-steps/bundle-rules-step"
import { BundleDatesStep } from "./wizard-steps/bundle-dates-step"
import { BundleReviewStep } from "./wizard-steps/bundle-review-step"
import { useToast } from "@/hooks/use-toast"

interface BundleDealEditModalProps {
  isOpen: boolean
  onClose: () => void
  bundleId: string
  initialStep?: number
  onSuccess: () => void
}

const steps = [
  { id: 1, title: "Bundle Type", description: "Choose bundle structure" },
  { id: 2, title: "Products", description: "Select products or categories" },
  { id: 3, title: "Pricing", description: "Set discount structure" },
  { id: 4, title: "Rules", description: "Configure bundle rules" },
  { id: 5, title: "Schedule", description: "Set dates and limits" },
  { id: 6, title: "Review", description: "Review and update bundle" },
]

export function BundleDealEditModal({
  isOpen,
  onClose,
  bundleId,
  initialStep = 1,
  onSuccess,
}: BundleDealEditModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [bundleData, setBundleData] = useState({
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
  })

  const { toast } = useToast()

  const wizard = useWizard({
    steps,
    initialStep,
    onComplete: handleSubmit,
  })

  useEffect(() => {
    if (isOpen && bundleId) {
      loadBundleData()
    }
  }, [isOpen, bundleId])

  const loadBundleData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bundles/${bundleId}`)
      if (!response.ok) throw new Error("Failed to load bundle data")

      const result = await response.json()
      if (result.success) {
        const bundle = result.data
        setBundleData({
          name: bundle.name || "",
          description: bundle.description || "",
          bundleType: bundle.bundle_type || bundle.bundleType || "",
          products: bundle.products || [],
          categories: bundle.categories || [],
          discountType: bundle.discount_type || bundle.discountType || "",
          discountValue: bundle.discount_value || bundle.discountValue || 0,
          tieredPricing: bundle.tiered_pricing || bundle.tieredPricing || [],
          minQuantity: bundle.min_quantity || bundle.minQuantity || 1,
          maxQuantity: bundle.max_quantity || bundle.maxQuantity || null,
          customerTiers: bundle.customer_tiers || bundle.customerTiers || [],
          markets: bundle.markets || [],
          startDate: bundle.start_date || bundle.startDate || "",
          endDate: bundle.end_date || bundle.endDate || "",
          usageLimit: bundle.usage_limit || bundle.usageLimit || null,
          perCustomerLimit: bundle.per_customer_limit || bundle.perCustomerLimit || null,
        })
      } else {
        throw new Error(result.message || "Failed to load bundle")
      }
    } catch (error) {
      toast({
        title: "Error Loading Bundle",
        description: error instanceof Error ? error.message : "Failed to load bundle data",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleDataChange = (data: any) => {
    setBundleData({ ...bundleData, ...data })
  }

  async function handleSubmit() {
    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundleData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to update bundle")
      }

      toast({
        title: "Bundle Updated Successfully!",
        description: `${bundleData.name} has been updated.`,
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Bundle",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      throw error
    }
  }

  const renderStep = () => {
    switch (wizard.currentStep) {
      case 1:
        return <BundleTypeStep data={bundleData} onChange={handleDataChange} />
      case 2:
        return <BundleProductsStep data={bundleData} onChange={handleDataChange} />
      case 3:
        return <BundlePricingStep data={bundleData} onChange={handleDataChange} />
      case 4:
        return <BundleRulesStep data={bundleData} onChange={handleDataChange} />
      case 5:
        return <BundleDatesStep data={bundleData} onChange={handleDataChange} />
      case 6:
        return <BundleReviewStep data={bundleData} onChange={handleDataChange} />
      default:
        return null
    }
  }

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Bundle Deal"
      description={isLoading ? "Loading bundle data..." : undefined}
      mode="wizard"
      size="lg"
      wizard={wizard}
      isLoading={isLoading}
      loadingMessage="Loading bundle data..."
    >
      {renderStep()}
    </UnifiedModal>
  )
}
