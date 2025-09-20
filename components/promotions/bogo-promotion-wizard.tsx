"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { BogoTypeStep } from "./wizard-steps/bogo-type-step"
import { BogoTriggerStep } from "./wizard-steps/bogo-trigger-step"
import { BogoRewardStep } from "./wizard-steps/bogo-reward-step"
import { BogoDatesStep } from "./wizard-steps/bogo-dates-step"
import { BogoReviewStep } from "./wizard-steps/bogo-review-step"

interface BogoFormData {
  campaignName: string
  type: "item" | "brand" | "category" | ""
  triggerLevel: string
  triggerTarget: string
  triggerQuantity: number
  rewardType: "percentage" | "dollar" | "free" | ""
  rewardValue: number
  rewardTarget: string
  rewardQuantity: number
  maxRewardsPerOrder: number
  startDate: Date | undefined
  endDate: Date | undefined
  description: string
}

const initialFormData: BogoFormData = {
  campaignName: "",
  type: "",
  triggerLevel: "",
  triggerTarget: "",
  triggerQuantity: 1,
  rewardType: "",
  rewardValue: 0,
  rewardTarget: "",
  rewardQuantity: 1,
  maxRewardsPerOrder: 1,
  startDate: undefined,
  endDate: undefined,
  description: "",
}

const steps = [
  { id: 1, name: "Campaign Type", description: "Choose BOGO campaign level" },
  { id: 2, name: "Trigger Product", description: "Select trigger product/category" },
  { id: 3, name: "Reward Setup", description: "Configure reward details" },
  { id: 4, name: "Schedule", description: "Set campaign dates" },
  { id: 5, name: "Review", description: "Review and create campaign" },
]

export function BogoPromotionWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BogoFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (updates: Partial<BogoFormData>) => {
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Redirect to campaigns list
    window.location.href = "/promotions"
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.type !== "" && formData.campaignName !== ""
      case 2:
        return formData.triggerTarget !== ""
      case 3:
        return formData.rewardType !== "" && formData.rewardValue > 0 && formData.rewardTarget !== ""
      case 4:
        return formData.startDate !== undefined && formData.endDate !== undefined
      case 5:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BogoTypeStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <BogoTriggerStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <BogoRewardStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <BogoDatesStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <BogoReviewStep formData={formData} />
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-xl text-gti-dark-green">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
              </CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-lg font-semibold text-gti-dark-green">{Math.round(progress)}%</div>
            </div>
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
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id < currentStep
                  ? "bg-gti-bright-green text-white"
                  : step.id === currentStep
                    ? "bg-gti-dark-green text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
            </div>
          ))}
        </div>

        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            disabled={!isStepValid(currentStep)}
            className="bg-gti-bright-green hover:bg-gti-medium-green"
          >
            Next
            <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid(currentStep) || isSubmitting}
            className="bg-gti-bright-green hover:bg-gti-medium-green"
          >
            {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        )}
      </div>
    </div>
  )
}
