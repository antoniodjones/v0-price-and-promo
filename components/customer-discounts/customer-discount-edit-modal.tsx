"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import { DiscountLevelStep } from "./wizard-steps/discount-level-step"
import { DiscountTargetStep } from "./wizard-steps/discount-target-step"
import { DiscountValueStep } from "./wizard-steps/discount-value-step"
import { DiscountDatesStep } from "./wizard-steps/discount-dates-step"
import { CustomerAssignmentStep } from "./wizard-steps/customer-assignment-step"
import { DiscountReviewStep } from "./wizard-steps/discount-review-step"
import { useToast } from "@/hooks/use-toast"
import type { DiscountFormData } from "./customer-discount-wizard"

interface CustomerDiscountEditModalProps {
  isOpen: boolean
  onClose: () => void
  discountId: string
  onSuccess: () => void
}

const steps = [
  { id: 1, name: "Discount Level", description: "Choose the level of discount" },
  { id: 2, name: "Select Target", description: "Choose specific item/brand/category" },
  { id: 3, name: "Set Discount", description: "Configure discount amount" },
  { id: 4, name: "Set Dates", description: "Configure start and end dates" },
  { id: 5, name: "Assign Customers", description: "Select customers for this discount" },
  { id: 6, name: "Review & Update", description: "Review and update the discount rule" },
]

export function CustomerDiscountEditModal({ isOpen, onClose, discountId, onSuccess }: CustomerDiscountEditModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  const { toast } = useToast()

  // Load existing discount data when modal opens
  useEffect(() => {
    if (isOpen && discountId) {
      loadDiscountData()
    }
  }, [isOpen, discountId])

  const loadDiscountData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/discounts/customer/${discountId}`)
      if (!response.ok) {
        throw new Error("Failed to load discount data")
      }

      const result = await response.json()
      if (result.success) {
        const discount = result.data

        // Transform API data to form data format
        setFormData({
          level: discount.level === "item" ? "customer" : discount.level === "brand" ? "tier" : "market",
          targetId: discount.target,
          targetName: discount.target,
          discountType: discount.type === "fixed" ? "dollar" : discount.type,
          discountValue: discount.value,
          startDate: discount.start_date ? new Date(discount.start_date) : null,
          endDate: discount.end_date ? new Date(discount.end_date) : null,
          customers: discount.customer_tiers || [],
          name: discount.name,
        })
      } else {
        throw new Error(result.message || "Failed to load discount")
      }
    } catch (error) {
      toast({
        title: "Error Loading Discount",
        description: error instanceof Error ? error.message : "Failed to load discount data",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (updates: Partial<DiscountFormData>) => {
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
    switch (currentStep) {
      case 1:
        return formData.level !== ""
      case 2:
        return formData.targetId !== "" && formData.targetName !== ""
      case 3:
        return formData.discountType !== "" && formData.discountValue > 0
      case 4:
        return formData.startDate !== null && formData.endDate !== null
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

  const handleSubmit = async () => {
    if (!canProceed()) {
      return
    }

    setIsSubmitting(true)

    try {
      let customerIds: string[] = []
      if (formData.customers.length > 0) {
        // Fetch all customers to get their IDs
        const customersResponse = await fetch("/api/customers")
        if (!customersResponse.ok) {
          throw new Error("Failed to fetch customers")
        }

        const customersResult = await customersResponse.json()
        const allCustomers = customersResult.data || []

        customerIds = []
        for (const customerName of formData.customers) {
          let customer = allCustomers.find((c: any) => c.name === customerName)

          if (!customer) {
            // Try fuzzy matching
            const fuzzyMatch = allCustomers.find(
              (c: any) =>
                c.name.toLowerCase().includes(customerName.toLowerCase()) ||
                customerName.toLowerCase().includes(c.name.toLowerCase()),
            )

            if (fuzzyMatch) {
              customer = fuzzyMatch
            } else {
              throw new Error(`Customer "${customerName}" not found`)
            }
          }

          customerIds.push(customer.id)
        }
      }

      const discountData = {
        name: formData.name,
        level: formData.level,
        target: formData.targetId,
        type: formData.discountType === "dollar" ? "fixed" : formData.discountType,
        value: formData.discountValue,
        startDate: formData.startDate?.toISOString(),
        endDate: formData.endDate?.toISOString(),
        customerIds: customerIds,
        status: "active" as const,
        markets: ["california"],
        customerTiers: ["A"],
      }

      const response = await fetch(`/api/discounts/customer/${discountId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discountData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || `HTTP ${response.status}: Failed to update discount`)
      }

      // Show success toast
      toast({
        title: "Discount Updated Successfully!",
        description: `${formData.name} has been updated.`,
      })

      // Close modal and refresh parent
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error Updating Discount",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setFormData({
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
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Customer Discount</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Loading discount data..."
                  : `Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].description}`}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              {!isLoading && (
                <Badge variant="outline" className="text-gti-dark-green border-gti-dark-green">
                  {steps[currentStep - 1].name}
                </Badge>
              )}
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {!isLoading && <Progress value={progress} className="mt-4" />}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gti-bright-green mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading discount data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Step Navigation */}
            <div className="flex justify-center py-4">
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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
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
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Updating..." : "Update Discount"}
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
