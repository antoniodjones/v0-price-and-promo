"use client"
import { PricingTierWizard } from "./pricing-tier-wizard"

interface VolumePricingWizardProps {
  onClose: () => void
  editMode?: boolean
  initialData?: any
  ruleId?: string
}

export function VolumePricingWizard({ onClose, editMode = false, initialData, ruleId }: VolumePricingWizardProps) {
  return (
    <PricingTierWizard mode="volume" onClose={onClose} editMode={editMode} initialData={initialData} ruleId={ruleId} />
  )
}
