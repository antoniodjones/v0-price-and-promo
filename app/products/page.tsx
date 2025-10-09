"use client"

import { Suspense, useState } from "react"
import { ProductsHeader } from "@/components/products/products-header"
import { ProductsList } from "@/components/products/products-list"
import { ProductsFilters } from "@/components/products/products-filters"
import { DocumentationLink } from "@/components/shared/documentation-link"

export default function ProductsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("name-asc")

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <ProductsHeader
            onProductAdded={handleProductAdded}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
        <DocumentationLink pageId="products" />
      </div>

      <div className="flex gap-6">
        <aside className="w-80 space-y-6">
          <ProductsFilters />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList refreshTrigger={refreshTrigger} viewMode={viewMode} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
