"use client"

import { useEffect, useState } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { Award, TrendingUp, Target, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface LoyaltyData {
  lifetimeValue: number
  totalSavings: number
  savingsRate: number
  tierProgress: number
  nextTier: string
  nextTierThreshold: number
  loyaltyScore: number
  purchaseFrequency: number
  averageDiscount: number
}

export function LoyaltyMetrics({
  customerId,
  customer,
}: {
  customerId: string
  customer: any
}) {
  const [metrics, setMetrics] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLoyaltyMetrics()
  }, [customerId])

  const loadLoyaltyMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}/loyalty`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMetrics(result.data)
        }
      }
    } catch (err) {
      console.error("[v0] Error loading loyalty metrics:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <UnifiedCard key={i}>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-8 bg-muted rounded w-3/4" />
            </div>
          </UnifiedCard>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UnifiedCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Customer Lifetime Value</h3>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {formatCurrency(metrics?.lifetimeValue || customer.total_purchases || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total spend to date</p>
            </div>
          </div>
        </UnifiedCard>

        <UnifiedCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Total Savings</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(metrics?.totalSavings || 0)}</p>
              <p className="text-sm text-muted-foreground">{(metrics?.savingsRate || 0).toFixed(1)}% of total spend</p>
            </div>
          </div>
        </UnifiedCard>

        <UnifiedCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tier Progress</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current: {customer.tier}</span>
                <span className="text-muted-foreground">Next: {metrics?.nextTier || "Max Tier"}</span>
              </div>
              <Progress value={metrics?.tierProgress || 0} />
              <p className="text-xs text-muted-foreground">
                {metrics?.nextTierThreshold
                  ? `${formatCurrency(metrics.nextTierThreshold - (customer.total_purchases || 0))} to next tier`
                  : "Maximum tier reached"}
              </p>
            </div>
          </div>
        </UnifiedCard>

        <UnifiedCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Loyalty Score</h3>
            </div>
            <div>
              <p className="text-3xl font-bold">{metrics?.loyaltyScore || 0}/100</p>
              <p className="text-sm text-muted-foreground">Based on purchase frequency and value</p>
            </div>
          </div>
        </UnifiedCard>
      </div>

      <UnifiedCard>
        <div className="space-y-4">
          <h3 className="font-semibold">Purchase Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Purchase Frequency</p>
              <p className="text-xl font-bold">{metrics?.purchaseFrequency || 0} orders/month</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Discount</p>
              <p className="text-xl font-bold">{(metrics?.averageDiscount || 0).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-xl font-bold text-green-600">{(metrics?.savingsRate || 0).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </UnifiedCard>
    </div>
  )
}
