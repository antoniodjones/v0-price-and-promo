import { InventoryDiscountsList } from "@/components/inventory-discounts/inventory-discounts-list"
import { InventoryMonitoring } from "@/components/inventory-discounts/inventory-monitoring"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function InventoryDiscountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Automated Inventory Discounts</h2>
          <p className="text-muted-foreground">
            Manage automatic discounts based on expiration dates and THC percentages
          </p>
        </div>
        <Link href="/inventory-discounts/new">
          <Button className="bg-gti-bright-green hover:bg-gti-medium-green text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Auto Discount
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InventoryDiscountsList />
        </div>
        <div className="lg:col-span-1">
          <InventoryMonitoring />
        </div>
      </div>
    </div>
  )
}
