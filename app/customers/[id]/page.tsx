import { Suspense } from "react"
import { CustomerDetailView } from "@/components/customers/customer-detail-view"
import { DocumentationLink } from "@/components/shared/documentation-link"

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Details</h1>
          <p className="text-muted-foreground">View purchase history, discounts, and loyalty metrics</p>
        </div>
        <DocumentationLink pageId="customers" />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Loading customer data...</p>
            </div>
          </div>
        }
      >
        <CustomerDetailView customerId={params.id} />
      </Suspense>
    </div>
  )
}
