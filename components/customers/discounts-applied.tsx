"use client"

import { useEffect, useState } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Gift, Tag } from "lucide-react"

interface DiscountRecord {
  id: string
  name: string
  type: string
  discount_value: number
  times_used: number
  total_savings: number
  last_used: string
  status: string
}

export function DiscountsApplied({ customerId }: { customerId: string }) {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>([])
  const [activePromotions, setActivePromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDiscounts()
    loadActivePromotions()
  }, [customerId])

  const loadDiscounts = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/discounts`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setDiscounts(result.data || [])
        }
      }
    } catch (err) {
      console.error("[v0] Error loading discounts:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadActivePromotions = async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}/promotions`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setActivePromotions(result.data || [])
        }
      }
    } catch (err) {
      console.error("[v0] Error loading promotions:", err)
    }
  }

  const columns = [
    {
      key: "name",
      label: "Discount/Promotion",
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "times_used",
      label: "Times Used",
    },
    {
      key: "total_savings",
      label: "Total Savings",
      render: (value: number) => <span className="font-medium text-green-600">{formatCurrency(value)}</span>,
    },
    {
      key: "last_used",
      label: "Last Used",
      render: (value: string) => formatDate(value),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>,
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

  return (
    <div className="space-y-4">
      {/* Active Promotions */}
      <UnifiedCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Active Promotions</h3>
          </div>
          {activePromotions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active promotions available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePromotions.map((promo) => (
                <div key={promo.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{promo.name}</p>
                      <p className="text-sm text-muted-foreground">{promo.description}</p>
                    </div>
                    <Badge>{promo.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">Valid until {formatDate(promo.end_date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </UnifiedCard>

      {/* Discount History */}
      <UnifiedCard>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Discount History</h3>
          </div>
          {discounts.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No discounts applied yet</p>
            </div>
          ) : (
            <UnifiedDataTable data={discounts} columns={columns} />
          )}
        </div>
      </UnifiedCard>
    </div>
  )
}
