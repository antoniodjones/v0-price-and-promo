"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, DollarSign, Users } from "lucide-react"

const stats = [
  {
    title: "Active Bundles",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: Package,
  },
  {
    title: "Bundle Revenue",
    value: "$45,230",
    change: "+18% vs last month",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Avg Bundle Size",
    value: "3.2",
    change: "items per bundle",
    trend: "neutral",
    icon: TrendingUp,
  },
  {
    title: "Bundle Customers",
    value: "89",
    change: "+12 this month",
    trend: "up",
    icon: Users,
  },
]

export function BundleDealsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-gti-bright-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gti-dark-green">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {stat.trend === "up" && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "neutral" && <span className="text-muted-foreground">{stat.change}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
