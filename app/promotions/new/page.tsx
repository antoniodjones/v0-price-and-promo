"use client"

import { BogoPromotionWizard } from "@/components/promotions/bogo-promotion-wizard"

export default function NewBogoPromotionPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Create BOGO Campaign</h1>
          <p className="text-muted-foreground">
            Set up a new buy-one-get-one promotional campaign with our step-by-step wizard
          </p>
        </div>
        <BogoPromotionWizard />
      </div>
    </div>
  )
}
