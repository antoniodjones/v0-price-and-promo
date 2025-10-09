"use client"

import { useEffect, useState } from "react"
import { UnifiedCard } from "@/components/shared/unified-card"
import { TrendingUp, TrendingDown, DollarSign, Package, Gift, Percent } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface OverviewStats {
  totalSpend: number
  totalSavings: number
  averageOrderValue: number
  orderCount: number
  activePromotions: number
  savingsRate: number
}

export function CustomerOverview({
  customerId,
  customer,
}: {
  customerId: string
  customer: any
}) {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOverviewStats()
  }, [customerId])

  const loadOverviewStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}/overview`)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      }
    } catch (err) {
      console.error("[v0] Error loading overview stats:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
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

  const statCards = [
    {
      title: "Total Spend",
      value: formatCurrency(stats?.totalSpend || customer.total_purchases || 0),
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Savings",
      value: formatCurrency(stats?.totalSavings || 0),
      icon: Gift,
      description: "From discounts & promotions",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(stats?.averageOrderValue || 0),
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats?.orderCount || 0,
      icon: Package,
    },
    {
      title: "Active Promotions",
      value: stats?.activePromotions || 0,
      icon: Gift,
      description: "Currently eligible",
    },
    {
      title: "Savings Rate",
      value: `${(stats?.savingsRate || 0).toFixed(1)}%`,
      icon: Percent,
      description: "Of total spend",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <UnifiedCard key={index}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          {stat.trend && (
            <div className="flex items-center gap-1 mt-2 text-sm">
              {stat.trendUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={stat.trendUp ? "text-green-500" : "text-red-500"}>{stat.trend}</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </UnifiedCard>
      ))}
    </div>
  )
}
