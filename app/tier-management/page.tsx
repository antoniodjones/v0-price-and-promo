import { TierManagementDashboard } from "@/components/tier-management/tier-management-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TierManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Tier Management</h2>
          <p className="text-muted-foreground">
            Manage discount rules with A/B/C tier pricing and customer assignments
          </p>
        </div>
        <Link href="/tier-management/new">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Discount Rule
          </Button>
        </Link>
      </div>

      <TierManagementDashboard />
    </div>
  )
}
