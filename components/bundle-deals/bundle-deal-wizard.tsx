"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BundleTypeStep } from "./wizard-steps/bundle-type-step"
import { BundleProductsStep } from "./wizard-steps/bundle-products-step"
import { BundlePricingStep } from "./wizard-steps/bundle-pricing-step"
import { BundleRulesStep } from "./wizard-steps/bundle-rules-step"
import { BundleDatesStep } from "./wizard-steps/bundle-dates-step"
import { BundleReviewStep } from "./wizard-steps/bundle-review-step"

const steps = [
  { id: 1, title: "Bundle Type", description: "Choose bundle structure" },
  { id: 2, title: "Products", description: "Select products or categories" },
  { id: 3, title: "Pricing", description: "Set discount structure" },
  { id: 4, title: "Rules", description: "Configure bundle rules" },
  { id: 5, title: "Schedule", description: "Set dates and limits" },
  { id: 6, title: "Review", description: "Review and create bundle" },
]

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
  const [currentStep, setCurrentStep] = useState(1)
  const [bundleData, setBundleData] = useState<BundleData>({
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

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    try {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    } catch (error) {
      console.error("Error navigating to next step:", error)
    }
  }

  const handlePrevious = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    } catch (error) {
      console.error("Error navigating to previous step:", error)
    }
  }

  const handleDataChange = (data: Partial<BundleData>) => {
    try {
      setBundleData({ ...bundleData, ...data })
    } catch (error) {
      console.error("Error updating bundle data:", error)
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
          return <div className="text-center py-8">Invalid step</div>
      }
    } catch (error) {
      console.error("Error rendering step", currentStep, error)
      return <div className="text-red-500 text-center py-8">Error loading step {currentStep}</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-gti-dark-green">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title || "Unknown Step"}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {steps[currentStep - 1]?.description || "Step description unavailable"}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full ${
                step.id === currentStep
                  ? "bg-gti-bright-green"
                  : step.id < currentStep
                    ? "bg-gti-medium-green"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className="bg-gti-bright-green hover:bg-gti-medium-green"
        >
          {currentStep === steps.length ? "Create Bundle" : "Next"}
          {currentStep < steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
