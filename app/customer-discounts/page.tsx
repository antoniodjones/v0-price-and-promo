import { CustomerDiscountsList } from "@/components/customer-discounts/customer-discounts-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CustomerDiscountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Customer Discounts</h2>
          <p className="text-muted-foreground">
            Manage customer-specific pricing at brand, category, and product levels
          </p>
        </div>
        <Link href="/customer-discounts/new">
          <Button className="bg-gti-bright-green hover:bg-gti-medium-green text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </Link>
      </div>

      <CustomerDiscountsList />
    </div>
  )
}
