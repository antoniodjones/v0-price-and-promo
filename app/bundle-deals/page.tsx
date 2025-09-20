import { Suspense } from "react"
import { BundleDealsHeader } from "@/components/bundle-deals/bundle-deals-header"
import { BundleDealsList } from "@/components/bundle-deals/bundle-deals-list"
import { BundleDealsStats } from "@/components/bundle-deals/bundle-deals-stats"

export default function BundleDealsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <BundleDealsHeader />

      <Suspense fallback={<div>Loading stats...</div>}>
        <BundleDealsStats />
      </Suspense>

      <Suspense fallback={<div>Loading bundle deals...</div>}>
        <BundleDealsList />
      </Suspense>
    </div>
  )
}
