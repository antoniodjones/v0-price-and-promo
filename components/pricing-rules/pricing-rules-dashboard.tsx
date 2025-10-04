"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VolumePricingList } from "./volume-pricing-list"
import { TieredPricingList } from "./tiered-pricing-list"
import { PricingAnalytics } from "./pricing-analytics"

export function PricingRulesDashboard() {
  return (
    <Tabs defaultValue="volume" className="space-y-4">
      <TabsList>
        <TabsTrigger value="volume">Volume Pricing</TabsTrigger>
        <TabsTrigger value="tiered">Tiered Pricing</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="volume" className="space-y-4">
        <VolumePricingList />
      </TabsContent>

      <TabsContent value="tiered" className="space-y-4">
        <TieredPricingList />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <PricingAnalytics />
      </TabsContent>
    </Tabs>
  )
}
