import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PricingCalculator } from "@/components/pricing/pricing-calculator"
import { DiscountConflictResolver } from "@/components/pricing/discount-conflict-resolver"
import { PricingAuditTrail } from "@/components/pricing/pricing-audit-trail"

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black">Best Deal Logic Engine</h2>
        <p className="text-muted-foreground">
          Transparent pricing calculations with no-stacking policy enforcement and complete audit trails
        </p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Pricing Calculator</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Resolution</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <PricingCalculator />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6">
          <DiscountConflictResolver />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <PricingAuditTrail />
        </TabsContent>
      </Tabs>
    </div>
  )
}
