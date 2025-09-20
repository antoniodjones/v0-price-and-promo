import { InventoryDiscountWizard } from "@/components/inventory-discounts/inventory-discount-wizard"

export default function NewInventoryDiscountPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Create Automated Discount</h1>
        <p className="text-muted-foreground">
          Set up automatic discounts based on inventory attributes like expiration dates and THC levels
        </p>
      </div>

      <InventoryDiscountWizard />
    </div>
  )
}
