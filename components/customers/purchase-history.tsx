"use client"

import { useEffect, useState } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Package } from "lucide-react"

interface PurchaseRecord {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  original_price: number
  final_price: number
  total_discount: number
  applied_at: string
}

export function PurchaseHistory({ customerId }: { customerId: string }) {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPurchases()
  }, [customerId])

  const loadPurchases = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}/purchases`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setPurchases(result.data || [])
        }
      }
    } catch (err) {
      console.error("[v0] Error loading purchases:", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "applied_at",
      label: "Date",
      render: (value: string) => formatDate(value),
    },
    {
      key: "product_name",
      label: "Product",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "original_price",
      label: "Original Price",
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "final_price",
      label: "Final Price",
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "total_discount",
      label: "Discount",
      render: (value: number) => <Badge variant={value > 0 ? "default" : "secondary"}>{formatCurrency(value)}</Badge>,
    },
  ]

  if (loading) {
    return (
      <UnifiedCard>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </UnifiedCard>
    )
  }

  if (purchases.length === 0) {
    return (
      <UnifiedCard>
        <div className="text-center py-8 space-y-2">
          <Package className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No purchase history found</p>
        </div>
      </UnifiedCard>
    )
  }

  return (
    <UnifiedCard>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Purchase History</h3>
          <p className="text-sm text-muted-foreground">Complete history of purchases with applied discounts</p>
        </div>
        <UnifiedDataTable data={purchases} columns={columns} />
      </div>
    </UnifiedCard>
  )
}
