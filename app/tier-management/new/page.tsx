"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { RuleConfigurationStep } from "@/components/tier-management/wizard/rule-configuration-step"
import { TierConfigurationStep } from "@/components/tier-management/wizard/tier-configuration-step"
import { CustomerAssignmentStep } from "@/components/tier-management/wizard/customer-assignment-step"
import { ReviewSubmitStep } from "@/components/tier-management/wizard/review-submit-step"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface WizardData {
  // Step 1: Rule Configuration
  name: string
  description: string
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id: string
  target_name: string
  start_date: string
  end_date: string
  status: "active" | "inactive" | "scheduled" | "expired"

  // Step 2: Tier Configuration (to be implemented)
  tiers: Array<{
    tier: "A" | "B" | "C"
    discount_type: "percentage" | "fixed_amount" | "price_override"
    discount_value: number
    min_quantity?: number
    max_quantity?: number
  }>

  // Step 3: Customer Assignments (to be implemented)
  assignments: Array<{
    customer_id: string
    tier: "A" | "B" | "C"
  }>
}

const WIZARD_STEPS = [
  { id: 1, name: "Rule Configuration", description: "Basic rule details" },
  { id: 2, name: "Tier Configuration", description: "A/B/C tier pricing" },
  { id: 3, name: "Customer Assignment", description: "Assign customers to tiers" },
  { id: 4, name: "Review & Submit", description: "Review and create rule" },
]

export default function NewDiscountRulePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wizardData, setWizardData] = useState<WizardData>({
    name: "",
    description: "",
    rule_type: "tiered_pricing",
    level: "brand",
    target_id: "",
    target_name: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "active",
    tiers: [
      { tier: "A", discount_type: "percentage", discount_value: 0 },
      { tier: "B", discount_type: "percentage", discount_value: 0 },
      { tier: "C", discount_type: "percentage", discount_value: 0 },
    ],
    assignments: [],
  })

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCancel = () => {
    router.push("/tier-management")
  }

  const canProceed = () => {
    if (currentStep === 1) {
      return wizardData.name.trim() !== "" && wizardData.target_name.trim() !== ""
    }
    if (currentStep === 2) {
      return wizardData.tiers.every((tier) => tier.discount_value > 0)
    }
    if (currentStep === 3) {
      return wizardData.assignments.length > 0
    }
    return true
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const ruleResponse = await fetch("/api/discount-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wizardData.name,
          description: wizardData.description,
          rule_type: wizardData.rule_type,
          level: wizardData.level,
          target_id: wizardData.target_id,
          target_name: wizardData.target_name,
          start_date: wizardData.start_date,
          end_date: wizardData.end_date || null,
          status: wizardData.status,
          tiers: wizardData.tiers,
        }),
      })

      if (!ruleResponse.ok) {
        const errorData = await ruleResponse.json()
        throw new Error(errorData.message || "Failed to create discount rule")
      }

      const ruleData = await ruleResponse.json()
      const ruleId = ruleData.data.id

      if (wizardData.assignments.length > 0) {
        const assignmentResponse = await fetch(`/api/discount-rules/${ruleId}/assignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignments: wizardData.assignments,
          }),
        })

        if (!assignmentResponse.ok) {
          const errorData = await assignmentResponse.json()
          throw new Error(errorData.message || "Failed to create customer assignments")
        }
      }

      toast({
        title: "Success!",
        description: "Discount rule created successfully",
      })

      router.push("/tier-management")
    } catch (error) {
      console.error("Error creating discount rule:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create discount rule",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Discount Rule</h1>
          <p className="text-muted-foreground mt-1">Set up tiered pricing with customer assignments</p>
        </div>
        <Button variant="outline" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? "bg-gti-bright-green border-gti-bright-green text-white"
                        : currentStep === step.id
                          ? "border-gti-bright-green text-gti-bright-green"
                          : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-4 transition-colors ${
                      currentStep > step.id ? "bg-gti-bright-green" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{WIZARD_STEPS[currentStep - 1].name}</CardTitle>
              <CardDescription>{WIZARD_STEPS[currentStep - 1].description}</CardDescription>
            </div>
            <Badge variant="outline">
              Step {currentStep} of {WIZARD_STEPS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <RuleConfigurationStep data={wizardData} onUpdate={updateWizardData} />}

          {currentStep === 2 && <TierConfigurationStep data={wizardData} onUpdate={updateWizardData} />}

          {currentStep === 3 && <CustomerAssignmentStep data={wizardData} onUpdate={updateWizardData} />}

          {currentStep === 4 && <ReviewSubmitStep data={wizardData} onUpdate={updateWizardData} />}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          {currentStep < WIZARD_STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Rule
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
