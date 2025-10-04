"use client"

import { UnifiedWizard, type UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { BogoTypeStep } from "./wizard-steps/bogo-type-step"
import { BogoTriggerStep } from "./wizard-steps/bogo-trigger-step"
import { BogoRewardStep } from "./wizard-steps/bogo-reward-step"
import { BogoDatesStep } from "./wizard-steps/bogo-dates-step"
import { BogoReviewStep } from "./wizard-steps/bogo-review-step"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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

export function BogoPromotionWizard() {
  const router = useRouter()
  const { toast } = useToast()

  const initialData: BogoFormData = {
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

  const handleComplete = async (formData: BogoFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "BOGO Campaign Created!",
      description: `${formData.campaignName} has been created successfully.`,
    })
    router.push("/promotions")
  }

  const config: UnifiedWizardConfig<BogoFormData> = {
    steps: [
      {
        id: 1,
        name: "Campaign Type",
        description: "Choose BOGO campaign level",
        component: ({ formData, updateFormData }) => (
          <BogoTypeStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.type !== "" && data.campaignName !== "",
      },
      {
        id: 2,
        name: "Trigger Product",
        description: "Select trigger product/category",
        component: ({ formData, updateFormData }) => (
          <BogoTriggerStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.triggerTarget !== "",
      },
      {
        id: 3,
        name: "Reward Setup",
        description: "Configure reward details",
        component: ({ formData, updateFormData }) => (
          <BogoRewardStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.rewardType !== "" && data.rewardValue > 0 && data.rewardTarget !== "",
      },
      {
        id: 4,
        name: "Schedule",
        description: "Set campaign dates",
        component: ({ formData, updateFormData }) => (
          <BogoDatesStep formData={formData} updateFormData={updateFormData} />
        ),
        validate: (data) => data.startDate !== undefined && data.endDate !== undefined,
      },
      {
        id: 5,
        name: "Review",
        description: "Review and create campaign",
        component: ({ formData }) => <BogoReviewStep formData={formData} />,
        validate: () => true,
      },
    ],
    initialData,
    onComplete: handleComplete,
    navigationStyle: "arrows",
    progressStyle: "percentage",
    showStepIndicators: true,
  }

  return <UnifiedWizard config={config} />
}
