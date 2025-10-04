"use client"

import { useState, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"

export interface UnifiedWizardStep<T = any> {
  id: number
  name: string
  description: string
  component: (props: { formData: T; updateFormData: (updates: Partial<T>) => void }) => ReactNode
  validate?: (formData: T) => boolean
}

export interface UnifiedWizardConfig<T = any> {
  steps: UnifiedWizardStep<T>[]
  title?: string
  initialData: T
  onComplete: (data: T) => Promise<void>
  navigationStyle?: "arrows" | "chevrons"
  progressStyle?: "percentage" | "steps"
  showStepIndicators?: boolean
  editMode?: boolean
}

interface UnifiedWizardProps<T = any> {
  config: UnifiedWizardConfig<T>
}

export function UnifiedWizard<T = any>({ config }: UnifiedWizardProps<T>) {
  const {
    steps,
    initialData,
    onComplete,
    navigationStyle = "arrows",
    progressStyle = "percentage",
    showStepIndicators = true,
  } = config

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<T>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    const step = steps[currentStep - 1]
    return step.validate ? step.validate(formData) : true
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setIsSubmitting(true)
    try {
      await onComplete(formData)
    } catch (error) {
      console.error("[v0] Error in wizard submission:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100
  const currentStepData = steps[currentStep - 1]

  const PrevIcon = navigationStyle === "chevrons" ? ChevronLeft : ArrowLeft
  const NextIcon = navigationStyle === "chevrons" ? ChevronRight : CustomArrow

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Step {currentStep} of {steps.length}
                {currentStepData.name && `: ${currentStepData.name}`}
              </CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {progressStyle === "percentage" && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Progress</div>
                  <div className="text-lg font-semibold text-gti-dark-green">{Math.round(progress)}%</div>
                </div>
              )}
              <Badge variant="outline" className="text-gti-dark-green border-gti-dark-green">
                {currentStepData.name}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </CardHeader>
      </Card>

      {/* Step Indicators */}
      {showStepIndicators && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
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
                  <div
                    className={`w-12 h-0.5 transition-all ${index + 1 < currentStep ? "bg-gti-bright-green" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">{currentStepData.component({ formData, updateFormData })}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between w-full gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="shrink-0 bg-transparent min-w-[120px]"
            >
              <PrevIcon className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {navigationStyle === "chevrons" && (
              <div className="flex items-center gap-2 justify-center flex-1">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full shrink-0 transition-all ${
                      step.id === currentStep
                        ? "bg-gti-bright-green"
                        : step.id < currentStep
                          ? "bg-gti-medium-green"
                          : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-gti-bright-green hover:bg-gti-medium-green text-white shrink-0 min-w-[120px] ml-auto"
              >
                Next
                {navigationStyle === "arrows" ? (
                  <CustomArrow className="ml-2 h-4 w-4" color="#ffffff" />
                ) : (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="bg-gti-bright-green hover:bg-gti-medium-green text-white shrink-0 min-w-[180px] ml-auto"
              >
                <Check className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
