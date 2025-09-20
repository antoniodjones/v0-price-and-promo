"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, Users, DollarSign, Package } from "lucide-react"
import { MarketPricingList } from "@/components/market-pricing/market-pricing-list"
import { MarketSelection } from "@/components/market-pricing/market-selection"

export default function MarketPricingPage() {
  const [selectedMarket, setSelectedMarket] = useState("massachusetts")

  const markets = [
    { id: "massachusetts", name: "Massachusetts", strategy: "volume", status: "active" },
    { id: "ohio", name: "Ohio", strategy: "tiered", status: "active" },
    { id: "illinois", name: "Illinois", strategy: null, status: "pending" },
    { id: "pennsylvania", name: "Pennsylvania", strategy: "volume", status: "active" },
  ]

  const stats = [
    {
      title: "Active Markets",
      value: "3",
      description: "Markets with pricing strategies",
      icon: TrendingUp,
      trend: "+1 this month",
    },
    {
      title: "Volume Strategies",
      value: "2",
      description: "Markets using volume pricing",
      icon: Package,
      trend: "67% of markets",
    },
    {
      title: "Tiered Strategies",
      value: "1",
      description: "Markets using dollar tiers",
      icon: DollarSign,
      trend: "33% of markets",
    },
    {
      title: "Customer Groups",
      value: "12",
      description: "Total pricing tiers",
      icon: Users,
      trend: "Across all markets",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black">Market Pricing Strategy</h2>
          <p className="text-muted-foreground mt-2">Configure volume or tiered pricing strategies by market</p>
        </div>
        <Button className="bg-gti-green hover:bg-gti-green/90">
          <Plus className="h-4 w-4 mr-2" />
          Configure Market
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gti-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              <p className="text-xs text-gti-green mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Selection and Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MarketSelection markets={markets} selectedMarket={selectedMarket} onMarketSelect={setSelectedMarket} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="volume">Volume Pricing</TabsTrigger>
              <TabsTrigger value="tiered">Tiered Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <MarketPricingList selectedMarket={selectedMarket} />
            </TabsContent>

            <TabsContent value="volume" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Volume-Based Pricing</CardTitle>
                  <CardDescription>
                    Configure quantity-based discounts for {markets.find((m) => m.id === selectedMarket)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Volume Pricing Configuration</h3>
                    <p className="text-gray-600 mb-4">Set up quantity-based discount tiers</p>
                    <Button className="bg-gti-green hover:bg-gti-green/90">Configure Volume Tiers</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiered" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dollar-Based Tiered Pricing</CardTitle>
                  <CardDescription>
                    Configure dollar threshold-based discounts for {markets.find((m) => m.id === selectedMarket)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tiered Pricing Configuration</h3>
                    <p className="text-gray-600 mb-4">Set up dollar amount-based discount tiers</p>
                    <Button className="bg-gti-green hover:bg-gti-green/90">Configure Dollar Tiers</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
