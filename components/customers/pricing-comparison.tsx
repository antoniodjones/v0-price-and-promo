"use client"

import { useEffect, useState } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

interface PricingComparison {
  product_name: string
  standard_price: number
  customer_price: number
  savings: number
  savings_percent: number
  tier_benefit: string
}

export function PricingComparison({
  customerId,
  customer,
}: {
  customerId: string
  customer: any
}) {
  const [comparisons, setComparisons] = useState<PricingComparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPricingComparison()
  }, [customerId])

  const loadPricingComparison = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}/pricing-comparison`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setComparisons(result.data || [])
        }
      }
    } catch (err) {
      console.error("[v0] Error loading pricing comparison:", err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: "product_name",
      label: "Product",
    },
    {
      key: "standard_price",
      label: "Standard Price",
      render: (value: number) => formatCurrency(value),
    },
    {
      key: "customer_price",
      label: `${customer.tier} Price`,
      render: (value: number) => <span className="font-medium text-green-600">{formatCurrency(value)}</span>,
    },
    {
      key: "savings",
      label: "Savings",
      render: (value: number, row: PricingComparison) => (
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-green-500" />
          <span className="font-medium text-green-600">{formatCurrency(value)}</span>
          <Badge variant="secondary">{row.savings_percent.toFixed(1)}%</Badge>
        </div>
      ),
    },
    {
      key: "tier_benefit",
      label: "Tier Benefit",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
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

  const totalSavings = comparisons.reduce((sum, item) => sum + item.savings, 0)
  const avgSavingsPercent =
    comparisons.length > 0 ? comparisons.reduce((sum, item) => sum + item.savings_percent, 0) / comparisons.length : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UnifiedCard>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Tier</p>
            <p className="text-2xl font-bold">{customer.tier}</p>
          </div>
        </UnifiedCard>

        <UnifiedCard>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Savings</p>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <p className="text-2xl font-bold text-green-600">{avgSavingsPercent.toFixed(1)}%</p>
            </div>
          </div>
        </UnifiedCard>

        <UnifiedCard>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Potential Savings</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
          </div>
        </UnifiedCard>
      </div>

      <UnifiedCard>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Pricing Comparison</h3>
            <p className="text-sm text-muted-foreground">Compare {customer.tier} tier pricing vs. standard rates</p>
          </div>
          {comparisons.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No pricing comparison data available</p>
            </div>
          ) : (
            <UnifiedDataTable data={comparisons} columns={columns} />
          )}
        </div>
      </UnifiedCard>
    </div>
  )
}
