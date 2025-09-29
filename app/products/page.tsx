"use client"

import { Suspense, useState } from "react"
import { ProductsHeader } from "@/components/products/products-header"
import { ProductsList } from "@/components/products/products-list"
import { ProductsFilters } from "@/components/products/products-filters"

export default function ProductsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <ProductsHeader onProductAdded={handleProductAdded} />

      <div className="flex gap-6">
        <aside className="w-80 space-y-6">
          <ProductsFilters />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList refreshTrigger={refreshTrigger} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
