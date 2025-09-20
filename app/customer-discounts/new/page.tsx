import { CustomerDiscountWizard } from "@/components/customer-discounts/customer-discount-wizard"

export default function NewCustomerDiscountPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Create Customer Discount</h1>
        <p className="text-muted-foreground">
          Follow the steps below to configure a new customer-specific discount rule
        </p>
      </div>

      <CustomerDiscountWizard />
    </div>
  )
}
