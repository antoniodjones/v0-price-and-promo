// Real-time analytics widget for dashboard integration

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRealtimeAnalytics } from "@/lib/analytics/hooks"
import { Activity, DollarSign, Users } from "lucide-react"

export function RealtimeAnalyticsWidget() {
  const { analytics, loading, error } = useRealtimeAnalytics()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load analytics data</p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Real-time Analytics
        </CardTitle>
        <CardDescription>Live performance metrics and recent activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Discounts</span>
              </div>
              <div className="text-2xl font-bold">{analytics.activeDiscounts}</div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Today's Savings</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalSavingsToday)}</div>
            </div>
          </div>

          {/* Average Discount Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Discount Rate</span>
              <span className="text-sm text-muted-foreground">{analytics.averageDiscountRate.toFixed(1)}%</span>
            </div>
            <Progress value={analytics.averageDiscountRate} className="h-2" />
          </div>

          {/* Top Performing Discount */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Top Performing Discount</span>
            <Badge variant="outline" className="w-full justify-center">
              {analytics.topPerformingDiscount}
            </Badge>
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <span className="text-sm font-medium">Recent Activity</span>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {analytics.recentActivity.slice(0, 5).map((event, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.type.replace("_", " ")}
                    </Badge>
                    <span className="text-muted-foreground">{event.market}</span>
                  </div>
                  <span className="font-medium text-green-600">{formatCurrency(event.value)}</span>
                </div>
              ))}
              {analytics.recentActivity.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
