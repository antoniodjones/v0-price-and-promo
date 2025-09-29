"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { VolumePricingWizard } from "./volume-pricing-wizard"
import { TieredPricingWizard } from "./tiered-pricing-wizard"
import { useToast } from "@/hooks/use-toast"

interface MarketPricingEditModalProps {
  isOpen: boolean
  onClose: () => void
  ruleId: string
  onSuccess: () => void
}

export function MarketPricingEditModal({ isOpen, onClose, ruleId, onSuccess }: MarketPricingEditModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [ruleData, setRuleData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && ruleId) {
      loadRuleData()
    }
  }, [isOpen, ruleId])

  const loadRuleData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/pricing/market/${ruleId}`)
      if (!response.ok) {
        throw new Error("Failed to load pricing rule data")
      }

      const result = await response.json()
      if (result.success) {
        setRuleData(result.data)
      } else {
        throw new Error(result.message || "Failed to load pricing rule")
      }
    } catch (error) {
      toast({
        title: "Error Loading Pricing Rule",
        description: error instanceof Error ? error.message : "Failed to load pricing rule data",
        variant: "destructive",
      })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRuleData(null)
    onClose()
  }

  const handleSuccess = () => {
    onSuccess()
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Market Pricing Rule</DialogTitle>
              <DialogDescription>
                {isLoading
                  ? "Loading pricing rule data..."
                  : `Modify the pricing rule: ${ruleData?.name || "Unnamed Rule"}`}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gti-bright-green mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading pricing rule data...</p>
            </div>
          </div>
        ) : (
          <>
            {ruleData?.strategy === "tiered" ? (
              <TieredPricingWizard onClose={handleSuccess} editMode={true} initialData={ruleData} ruleId={ruleId} />
            ) : (
              <VolumePricingWizard onClose={handleSuccess} editMode={true} initialData={ruleData} ruleId={ruleId} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
