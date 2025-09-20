"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { DiscountLevelStep } from "./wizard-steps/discount-level-step"
import { DiscountTargetStep } from "./wizard-steps/discount-target-step"
import { DiscountValueStep } from "./wizard-steps/discount-value-step"
import { DiscountDatesStep } from "./wizard-steps/discount-dates-step"
import { CustomerAssignmentStep } from "./wizard-steps/customer-assignment-step"
import { DiscountReviewStep } from "./wizard-steps/discount-review-step"

export interface DiscountFormData {
  level: "brand" | "category" | "subcategory" | "size" | ""
  targetId: string
  targetName: string
  discountType: "percentage" | "dollar" | ""
  discountValue: number
  startDate: Date | null
  endDate: Date | null
  customers: string[]
  name: string
}

const steps = [
  { id: 1, name: "Discount Level", description: "Choose the level of discount" },
  { id: 2, name: "Select Target", description: "Choose specific item/brand/category" },
  { id: 3, name: "Set Discount", description: "Configure discount amount" },
  { id: 4, name: "Set Dates", description: "Configure start and end dates" },
  { id: 5, name: "Assign Customers", description: "Select customers for this discount" },
  { id: 6, name: "Review & Create", description: "Review and create the discount rule" },
]

export function CustomerDiscountWizard() {
  const [currentStep, setCurrentStep] = useState(1)
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

  const updateFormData = (updates: Partial<DiscountFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.level !== ""
      case 2:
        return formData.targetId !== "" && formData.targetName !== ""
      case 3:
        return formData.discountType !== "" && formData.discountValue > 0
      case 4:
        return formData.startDate !== null
      case 5:
        return formData.customers.length > 0
      case 6:
        return formData.name !== ""
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
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

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of {steps.length}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-gti-dark-green border-gti-dark-green">
              {steps[currentStep - 1].name}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index + 1 < currentStep
                    ? "bg-gti-bright-green border-gti-bright-green text-white"
                    : index + 1 === currentStep
                      ? "border-gti-bright-green text-gti-bright-green"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ${index + 1 < currentStep ? "bg-gti-bright-green" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              Next
              <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Handle form submission
                console.log("Creating discount:", formData)
                // In real app, this would call an API
              }}
              disabled={!canProceed()}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              Create Discount
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
