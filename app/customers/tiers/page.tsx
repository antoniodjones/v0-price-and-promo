import { CustomerTierDashboard } from "@/components/tier-management/customer-tier-dashboard"

export default function CustomerTiersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-black">Customer Tier Dashboard</h2>
        <p className="text-muted-foreground">View and manage customer tier assignments across all discount rules</p>
      </div>

      <CustomerTierDashboard />
    </div>
  )
}
