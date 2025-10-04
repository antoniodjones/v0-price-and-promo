"use client"
import { PricingTierWizard } from "./pricing-tier-wizard"

interface TieredPricingWizardProps {
  onClose: () => void
  editMode?: boolean
  initialData?: any
  ruleId?: string
}

export function TieredPricingWizard({ onClose, editMode = false, initialData, ruleId }: TieredPricingWizardProps) {
  return (
    <PricingTierWizard mode="dollar" onClose={onClose} editMode={editMode} initialData={initialData} ruleId={ruleId} />
  )
}
