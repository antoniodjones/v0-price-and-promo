"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Filter } from "lucide-react"
import Link from "next/link"

export function BundleDealsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gti-dark-green">Bundle Deals</h1>
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
          <Button className="bg-gti-bright-green hover:bg-gti-medium-green">
            <Plus className="w-4 h-4 mr-2" />
            Create Bundle
          </Button>
        </Link>
      </div>
    </div>
  )
}
