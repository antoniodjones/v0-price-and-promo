"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Users, TrendingUp, AlertTriangle } from "lucide-react"

interface MarketPricingListProps {
  selectedMarket: string
}

export function MarketPricingList({ selectedMarket }: MarketPricingListProps) {
  // Mock data for the selected market
  const pricingRules = [
    {
      id: "1",
      name: "Total Order Volume - A Tier",
      type: "volume",
      scope: "Total Order",
      tiers: "3 tiers (50-75, 76-99, 100+ units)",
      customers: 15,
      status: "active",
      performance: "+12%",
    },
    {
      id: "2",
      name: "Incredibles Brand Volume",
      type: "volume",
      scope: "Brand: Incredibles",
      tiers: "2 tiers (20-49, 50+ cases)",
      customers: 8,
      status: "active",
      performance: "+8%",
    },
    {
      id: "3",
      name: "Flower Category Volume",
      type: "volume",
      scope: "Category: Flower",
      tiers: "3 tiers (25-49, 50-99, 100+ units)",
      customers: 22,
      status: "active",
      performance: "+15%",
    },
  ]

  const marketInfo = {
    massachusetts: {
      name: "Massachusetts",
      strategy: "Volume-Based Pricing",
      totalRules: 3,
      activeCustomers: 45,
      avgDiscount: "6.2%",
    },
  }

  const info = marketInfo[selectedMarket as keyof typeof marketInfo] || marketInfo.massachusetts

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{info.name} Market Overview</CardTitle>
          <CardDescription>Current pricing strategy and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gti-green/5 rounded-lg">
              <div className="text-2xl font-bold text-gti-green">{info.strategy.split("-")[0]}</div>
              <div className="text-sm text-ada-secondary">Pricing Strategy</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{info.totalRules}</div>
              <div className="text-sm text-ada-secondary">Active Rules</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{info.activeCustomers}</div>
              <div className="text-sm text-ada-secondary">Customers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{info.avgDiscount}</div>
              <div className="text-sm text-ada-secondary">Avg Discount</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pricing Rules</CardTitle>
          <CardDescription>Volume-based pricing configurations for this market</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Tier Structure</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="font-medium">{rule.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.scope}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-ada-secondary">{rule.tiers}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {rule.customers}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      {rule.performance}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">{rule.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strategy Constraint Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Market Strategy Constraint</h3>
              <p className="text-sm text-amber-700 mt-1">
                This market is configured for <strong>Volume-Based Pricing</strong> only. To enable Dollar-Based Tiered
                Pricing, you must first disable volume pricing and confirm the strategy change.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
