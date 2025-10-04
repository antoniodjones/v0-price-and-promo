import { PricingRulesDashboard } from "@/components/pricing-rules/pricing-rules-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PricingRulesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Volume & Tiered Pricing</h2>
          <p className="text-muted-foreground">Manage volume-based and customer tier pricing rules</p>
        </div>
        <Link href="/pricing-rules/new">
          <Button size="lg" className="bg-gti-bright-green hover:bg-gti-medium-green text-white shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Pricing Rule
          </Button>
        </Link>
      </div>

      <PricingRulesDashboard />
    </div>
  )
}
