"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiscountRulesList } from "./discount-rules-list"
import { TierAssignmentsView } from "./tier-assignments-view"
import { TierAuditLog } from "./tier-audit-log"

export function TierManagementDashboard() {
  return (
    <Tabs defaultValue="rules" className="space-y-4">
      <TabsList>
        <TabsTrigger value="rules">Discount Rules</TabsTrigger>
        <TabsTrigger value="assignments">Customer Assignments</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <TabsContent value="rules" className="space-y-4">
        <DiscountRulesList />
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <TierAssignmentsView />
      </TabsContent>

      <TabsContent value="audit" className="space-y-4">
        <TierAuditLog />
      </TabsContent>
    </Tabs>
  )
}
