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
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Discount
          </Button>
        </Link>
      </div>

      <CustomerDiscountsList />
    </div>
  )
}
