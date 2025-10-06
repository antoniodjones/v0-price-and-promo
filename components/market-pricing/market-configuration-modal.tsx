"use client"

import { useState } from "react"
import { UnifiedModal } from "@/components/shared/unified-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, DollarSign } from "lucide-react"
import { VolumePricingWizard } from "./volume-pricing-wizard"
import { TieredPricingWizard } from "./tiered-pricing-wizard"

interface Market {
  id: string
  name: string
  strategy: "volume" | "tiered" | null
  status: "active" | "pending" | "inactive"
}

interface MarketConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedMarket: string
  markets: Market[]
}

export function MarketConfigurationModal({ isOpen, onClose, selectedMarket, markets }: MarketConfigurationModalProps) {
  const [configurationStep, setConfigurationStep] = useState<"select" | "volume" | "tiered">("select")

  const market = markets.find((m) => m.id === selectedMarket)

  const handleVolumeConfig = () => {
    setConfigurationStep("volume")
  }

  const handleTieredConfig = () => {
    setConfigurationStep("tiered")
  }

  const handleClose = () => {
    setConfigurationStep("select")
    onClose()
  }

  if (configurationStep === "volume") {
    return (
      <UnifiedModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Volume Pricing Configuration"
        size="xl"
        showFooter={false}
      >
        <VolumePricingWizard onClose={handleClose} />
      </UnifiedModal>
    )
  }

  if (configurationStep === "tiered") {
    return (
      <UnifiedModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Tiered Pricing Configuration"
        size="xl"
        showFooter={false}
      >
        <TieredPricingWizard onClose={handleClose} />
      </UnifiedModal>
    )
  }

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Configure Market Pricing Strategy"
      description={`Choose a pricing strategy for ${market?.name}`}
      size="lg"
      showFooter={true}
      footerContent={
        <div className="flex justify-end w-full">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Card className="cursor-pointer hover:border-gti-green transition-colors" onClick={handleVolumeConfig}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-lg">Volume-Based Pricing</CardTitle>
                <CardDescription>Discounts based on quantity purchased</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 ml-auto">Recommended</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Configure quantity-based discount tiers for different customer groups. Perfect for encouraging bulk
              purchases and rewarding high-volume customers.
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-gti-green transition-colors" onClick={handleTieredConfig}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-lg">Dollar-Based Tiered Pricing</CardTitle>
                <CardDescription>Discounts based on total order value</CardDescription>
              </div>
              <Badge className="bg-purple-100 text-purple-800 ml-auto">Available</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Configure dollar threshold-based discount tiers. Reward customers based on their total spending rather
              than quantity.
            </p>
          </CardContent>
        </Card>
      </div>
    </UnifiedModal>
  )
}
