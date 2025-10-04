import type { UnifiedWizardConfig } from "@/components/shared/unified-wizard"
import { BogoTypeStep } from "@/components/promotions/wizard-steps/bogo-type-step"
import { BogoTriggerStep } from "@/components/promotions/wizard-steps/bogo-trigger-step"
import { BogoRewardStep } from "@/components/promotions/wizard-steps/bogo-reward-step"
import { BogoDatesStep } from "@/components/promotions/wizard-steps/bogo-dates-step"
import { BogoReviewStep } from "@/components/promotions/wizard-steps/bogo-review-step"

export interface BogoPromotionFormData {
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

export const createBogoPromotionWizardConfig = (
  onComplete: (data: BogoPromotionFormData) => Promise<void>,
): UnifiedWizardConfig<BogoPromotionFormData> => ({
  title: "BOGO Promotion Wizard",
  initialData: {
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
  },
  steps: [
    {
      id: 1,
      name: "Campaign Type",
      description: "Choose BOGO campaign level",
      component: ({ formData, updateFormData }) => <BogoTypeStep formData={formData} updateFormData={updateFormData} />,
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
      component: ({ formData, updateFormData }) => <BogoReviewStep formData={formData} />,
      validate: () => true,
    },
  ],
  onComplete,
  navigationStyle: "arrows",
  progressStyle: "percentage",
  showStepIndicators: true,
})
