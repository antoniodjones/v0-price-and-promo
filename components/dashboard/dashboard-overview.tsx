"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Package, DollarSign, Plus, Clock, AlertTriangle } from "lucide-react"
import { CustomArrow } from "@/components/ui/custom-arrow"
import Link from "next/link"

const stats = [
  {
    title: "Active Discounts",
    value: "127",
    change: "+12%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Customer Tiers",
    value: "24",
    change: "+3",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Auto Discounts Applied",
    value: "1,847",
    change: "+23%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Total Savings",
    value: "$47,892",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
]

const recentActivity = [
  {
    type: "discount",
    title: "New customer discount created",
    description: "Premium Cannabis Co - 8% off for Dispensary ABC",
    time: "2 hours ago",
    status: "active",
  },
  {
    type: "auto",
    title: "Auto discount applied",
    description: "30-day expiration discount on Batch BH-2025-0892",
    time: "4 hours ago",
    status: "applied",
  },
  {
    type: "alert",
    title: "Low inventory alert",
    description: "Blue Dream 1oz approaching expiration",
    time: "6 hours ago",
    status: "warning",
  },
]

const quickActions = [
  {
    title: "Create Customer Discount",
    description: "Set up new customer-specific pricing",
    href: "/customer-discounts/new",
    icon: Users,
    color: "bg-gti-bright-green",
  },
  {
    title: "Configure Auto Discount",
    description: "Set up inventory-based discounting",
    href: "/inventory-discounts/new",
    icon: Package,
    color: "bg-gti-medium-green",
  },
  {
    title: "Test Pricing Scenario",
    description: "Validate pricing rules with sample baskets",
    href: "/testing",
    icon: Clock,
    color: "bg-gti-light-green",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground">Manage your wholesale pricing and promotions with precision</p>
        </div>
        <Link href="/customer-discounts/new">
          <Button className="bg-gti-dark-green hover:bg-gti-medium-green text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Rule
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "positive" ? "text-gti-bright-green" : "text-red-500"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common pricing and promotion tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 hover:bg-gti-light-green/10 bg-transparent"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-md ${action.color} flex-shrink-0`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <CustomArrow className="h-6 w-6" color="#86efac" />
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest pricing and promotion updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === "alert" ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : activity.type === "auto" ? (
                      <Package className="h-5 w-5 text-gti-bright-green" />
                    ) : (
                      <Users className="h-5 w-5 text-gti-medium-green" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <Badge variant={activity.status === "warning" ? "destructive" : "secondary"} className="ml-2">
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
