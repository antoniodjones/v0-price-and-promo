"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { MapPin, TrendingUp, AlertCircle, CheckCircle, DollarSign } from "lucide-react"

const MARKET_DATA = [
  {
    state: "Illinois",
    type: "adult-use",
    customerSegment: "Adult-Use + Medical",
    revenue: "$45.2M",
    growth: "+12%",
    compliance: 98,
    facilities: 8,
    retail: 12,
    population: "12.6M",
    marketSize: "$1.2B",
  },
  {
    state: "Pennsylvania",
    type: "medical",
    customerSegment: "Medical Only",
    revenue: "$38.7M",
    growth: "+8%",
    compliance: 100,
    facilities: 6,
    retail: 9,
    population: "13.0M",
    marketSize: "$800M",
  },
  {
    state: "New Jersey",
    type: "adult-use",
    customerSegment: "Adult-Use + Medical",
    revenue: "$32.1M",
    growth: "+15%",
    compliance: 97,
    facilities: 4,
    retail: 7,
    population: "9.3M",
    marketSize: "$950M",
  },
  {
    state: "Florida",
    type: "medical",
    customerSegment: "Medical Only",
    revenue: "$41.8M",
    growth: "+10%",
    compliance: 99,
    facilities: 7,
    retail: 11,
    population: "22.6M",
    marketSize: "$1.8B",
  },
  {
    state: "Ohio",
    type: "dual-use",
    customerSegment: "Dual-Use Transition",
    revenue: "$28.9M",
    growth: "+22%",
    compliance: 96,
    facilities: 5,
    retail: 8,
    population: "11.8M",
    marketSize: "$700M",
  },
]

export default function MarketComplianceDashboard() {
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [selectedSegment, setSelectedSegment] = useState<string>("all")

  const filteredMarkets =
    selectedMarket === "all" ? MARKET_DATA : MARKET_DATA.filter((market) => market.state === selectedMarket)

  const segmentedMarkets =
    selectedSegment === "all"
      ? filteredMarkets
      : filteredMarkets.filter((market) =>
          selectedSegment === "medical"
            ? market.type === "medical"
            : selectedSegment === "adult-use"
              ? market.type === "adult-use"
              : selectedSegment === "dual-use"
                ? market.type === "dual-use"
                : true,
        )

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Compliance Dashboard</h1>
          <p className="text-muted-foreground">GTI operations across medical, adult-use, and dual-use markets</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Customer Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="medical">Medical Only</SelectItem>
              <SelectItem value="adult-use">Adult-Use</SelectItem>
              <SelectItem value="dual-use">Dual-Use</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              {MARKET_DATA.map((market) => (
                <SelectItem key={market.state} value={market.state}>
                  {market.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Market Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {segmentedMarkets.map((market) => (
          <Card key={market.state} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {market.state}
                </CardTitle>
                <Badge
                  variant={
                    market.type === "adult-use" ? "default" : market.type === "medical" ? "secondary" : "outline"
                  }
                  className="capitalize"
                >
                  {market.type.replace("-", " ")}
                </Badge>
              </div>
              <CardDescription>{market.customerSegment}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Revenue & Growth */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{market.revenue}</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {market.growth}
                </Badge>
              </div>

              {/* Compliance Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Compliance Score</span>
                  <span className="font-medium">{market.compliance}%</span>
                </div>
                <Progress value={market.compliance} className="h-2" />
                {market.compliance >= 98 ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Excellent compliance
                  </div>
                ) : market.compliance >= 95 ? (
                  <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <AlertCircle className="w-3 h-3" />
                    Good compliance
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    Needs attention
                  </div>
                )}
              </div>

              {/* Facilities & Retail */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold">{market.facilities}</div>
                  <div className="text-xs text-muted-foreground">Facilities</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{market.retail}</div>
                  <div className="text-xs text-muted-foreground">RISE Stores</div>
                </div>
              </div>

              {/* Market Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                <div>Population: {market.population}</div>
                <div>Market Size: {market.marketSize}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {segmentedMarkets.reduce((sum, market) => sum + market.facilities, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Facilities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {segmentedMarkets.reduce((sum, market) => sum + market.retail, 0)}
            </div>
            <div className="text-sm text-muted-foreground">RISE Locations</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                segmentedMarkets.reduce((sum, market) => sum + market.compliance, 0) / segmentedMarkets.length,
              )}
              %
            </div>
            <div className="text-sm text-muted-foreground">Avg Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{segmentedMarkets.length}</div>
            <div className="text-sm text-muted-foreground">Active Markets</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
