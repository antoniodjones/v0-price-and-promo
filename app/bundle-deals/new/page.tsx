import { BundleDealWizard } from "@/components/bundle-deals/bundle-deal-wizard"

export default function NewBundleDealPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-black">Create Bundle Deal</h2>
          <p className="text-muted-foreground">Set up multi-product bundle pricing with flexible discount structures</p>
        </div>

        <BundleDealWizard />
      </div>
    </div>
  )
}
