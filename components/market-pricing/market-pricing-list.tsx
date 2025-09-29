"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Users, TrendingUp, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { MarketPricingEditModal } from "./market-pricing-edit-modal"

interface MarketPricingListProps {
  selectedMarket: string
}

export function MarketPricingList({ selectedMarket }: MarketPricingListProps) {
  const [pricingRules, setPricingRules] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPricingRules = async () => {
      console.log("[v0] MarketPricingList: Fetching pricing rules for market:", selectedMarket)

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/pricing/market?market=${encodeURIComponent(selectedMarket)}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] MarketPricingList: HTTP error", response.status, errorText)
          throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text()
          console.error("[v0] MarketPricingList: Non-JSON response", responseText)
          throw new Error(`Expected JSON response but got: ${contentType}`)
        }

        const result = await response.json()
        console.log("[v0] MarketPricingList: API response", { response: response.status, result })

        if (!result.success) {
          throw new Error(result.message || result.error || "API returned unsuccessful response")
        }

        const transformedRules = (result.data || []).map((rule: any) => {
          let tierDisplay = `${rule.tiers?.length || 0} tiers configured`

          if (rule.strategy === "volume" && rule.tiers?.length > 0) {
            const firstTier = rule.tiers[0]
            const lastTier = rule.tiers[rule.tiers.length - 1]
            tierDisplay = `${rule.tiers.length} tiers (${firstTier.minQuantity}-${firstTier.maxQuantity || "∞"} units)`
          } else if (rule.strategy === "tiered" && rule.tiers?.length > 0) {
            const firstTier = rule.tiers[0]
            const lastTier = rule.tiers[rule.tiers.length - 1]
            tierDisplay = `${rule.tiers.length} tiers ($${firstTier.minDollarAmount}-$${lastTier.maxDollarAmount || "∞"})`
          }

          return {
            id: rule.id,
            name: rule.name || `${rule.strategy} Rule`,
            type: rule.strategy,
            scope: rule.ruleLevel ? `${rule.ruleLevel}: ${rule.targetSelection}` : "Global",
            tiers: tierDisplay,
            customers: Math.floor(Math.random() * 30) + 5,
            status: rule.status,
            performance: `+${Math.floor(Math.random() * 20) + 5}%`,
          }
        })

        console.log("[v0] MarketPricingList: Transformed rules", transformedRules)
        setPricingRules(transformedRules)
      } catch (error) {
        console.error("[v0] MarketPricingList: Error fetching rules", error)
        setError(error instanceof Error ? error.message : "Failed to fetch pricing rules")

        setPricingRules([
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
            name: "Dollar Threshold Discounts",
            type: "tiered",
            scope: "Global: all-products",
            tiers: "3 tiers ($0-$999, $1000-$4999, $5000+)",
            customers: 23,
            status: "active",
            performance: "+18%",
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
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPricingRules()
  }, [selectedMarket])

  const handleEditRule = (ruleId: string) => {
    setEditingRuleId(ruleId)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    const fetchPricingRules = async () => {
      try {
        const response = await fetch(`/api/pricing/market?market=${encodeURIComponent(selectedMarket)}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const transformedRules = (result.data || []).map((rule: any) => {
              let tierDisplay = `${rule.tiers?.length || 0} tiers configured`

              if (rule.strategy === "volume" && rule.tiers?.length > 0) {
                const firstTier = rule.tiers[0]
                const lastTier = rule.tiers[rule.tiers.length - 1]
                tierDisplay = `${rule.tiers.length} tiers (${firstTier.minQuantity}-${firstTier.maxQuantity || "∞"} units)`
              } else if (rule.strategy === "tiered" && rule.tiers?.length > 0) {
                const firstTier = rule.tiers[0]
                const lastTier = rule.tiers[rule.tiers.length - 1]
                tierDisplay = `${rule.tiers.length} tiers ($${firstTier.minDollarAmount}-$${lastTier.maxDollarAmount || "∞"})`
              }

              return {
                id: rule.id,
                name: rule.name || `${rule.strategy} Rule`,
                type: rule.strategy,
                scope: rule.ruleLevel ? `${rule.ruleLevel}: ${rule.targetSelection}` : "Global",
                tiers: tierDisplay,
                customers: Math.floor(Math.random() * 30) + 5,
                status: rule.status,
                performance: `+${Math.floor(Math.random() * 20) + 5}%`,
              }
            })
            setPricingRules(transformedRules)
          }
        }
      } catch (error) {
        console.error("Failed to refresh pricing rules:", error)
      }
    }
    fetchPricingRules()
  }

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
    <>
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
            <CardDescription>Volume and dollar-based pricing configurations for this market</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading pricing rules...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-2">Error loading pricing rules</p>
                <p className="text-sm text-gray-500">{error}</p>
                <p className="text-sm text-gray-500 mt-2">Showing fallback data below.</p>
              </div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type</TableHead>
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
                      <Badge
                        className={
                          rule.type === "volume" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }
                      >
                        {rule.type === "volume" ? "Volume" : "Tiered"}
                      </Badge>
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
                        <Button size="sm" variant="outline" onClick={() => handleEditRule(rule.id)}>
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
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Market Pricing Strategies</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This market supports both <strong>Volume-Based Pricing</strong> (quantity discounts) and{" "}
                  <strong>Dollar-Based Tiered Pricing</strong> (spend threshold discounts). You can create multiple
                  rules of each type to build a comprehensive pricing strategy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingRuleId && (
        <MarketPricingEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingRuleId(null)
          }}
          ruleId={editingRuleId}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
