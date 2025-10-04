"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react"
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
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep)
    }
  }, [initialStep, isOpen])

  // Load existing bundle data when modal opens
  useEffect(() => {
    if (isOpen && bundleId) {
      loadBundleData()
    }
  }, [isOpen, bundleId])

  const loadBundleData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bundles/${bundleId}`)
      if (!response.ok) {
        throw new Error("Failed to load bundle data")
      }

      const result = await response.json()
      if (result.success) {
        const bundle = result.data

        // Transform API data to form data format
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

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDataChange = (data: any) => {
    setBundleData({ ...bundleData, ...data })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bundleData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to update bundle`)
      }

      // Show success toast
      toast({
        title: "Bundle Updated Successfully!",
        description: `${bundleData.name} has been updated.`,
      })

      // Close modal and refresh parent
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Bundle",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    try {
      switch (currentStep) {
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
    } catch (error) {
      console.error("[v0] BundleDealEditModal: Error rendering step", currentStep, error)
      return <div className="text-red-500">Error loading step {currentStep}</div>
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setBundleData({
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
    onClose()
  }

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Bundle Deal</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Loading bundle data..."
                  : `Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].description}`}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!isLoading && (
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
          )}
          {!isLoading && <Progress value={progress} className="h-2" />}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gti-bright-green mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading bundle data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        index + 1 < currentStep
                          ? "bg-gti-bright-green border-gti-bright-green text-white cursor-pointer hover:bg-gti-medium-green"
                          : index + 1 === currentStep
                            ? "border-gti-bright-green text-gti-bright-green cursor-pointer hover:border-gti-medium-green"
                            : "border-gray-300 text-gray-300 cursor-pointer hover:border-gray-400"
                      }`}
                    >
                      {index + 1 < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-0.5 ${index + 1 < currentStep ? "bg-gti-bright-green" : "bg-gray-300"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="py-6">{renderStep()}</div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="bg-gti-bright-green hover:bg-gti-medium-green">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gti-bright-green hover:bg-gti-medium-green"
                  >
                    {isSubmitting ? "Updating..." : "Update Bundle"}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
