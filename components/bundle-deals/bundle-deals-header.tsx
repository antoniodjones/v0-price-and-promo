"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Filter } from "lucide-react"
import Link from "next/link"

export function BundleDealsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bundle Deals</h1>
        <p className="text-muted-foreground mt-2">Manage multi-product bundle pricing and promotional campaigns</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>

        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Link href="/bundle-deals/new">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Bundle
          </Button>
        </Link>
      </div>
    </div>
  )
}
