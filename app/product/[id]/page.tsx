"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PriceChart } from "@/components/price-chart"
import { CompetitorComparison } from "@/components/competitor-comparison"
import { PriceAlerts } from "@/components/price-alerts"
import { ArrowLeft, Heart, Share2, TrendingUp, Package, Calendar } from "lucide-react"
import type { Product, PriceHistory, CompetitorAnalysis, PriceAlert } from "@/lib/types"
import Link from "next/link"

// Mock data for demonstration
const mockProduct: Product = {
  id: "1",
  name: "Premium Cannabis Flower - Blue Dream",
  sku: "BD-001",
  brand: "Green Valley",
  category: "Flower",
  price: 45.99,
  cost: 25.0,
  inventory_count: 15,
  thc_percentage: 22.5,
  batch_id: "BV-2024-001",
  expiration_date: "2024-12-31",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T14:30:00Z",
}

const mockPriceHistory: PriceHistory[] = [
  {
    id: "1",
    product_id: "1",
    source_id: "source-1",
    price: 45.99,
    original_price: 49.99,
    availability_status: "in_stock",
    scraped_at: "2024-01-20T14:30:00Z",
    last_updated: "2024-01-20T14:30:00Z",
    metadata: {},
  },
  {
    id: "2",
    product_id: "1",
    source_id: "source-1",
    price: 47.5,
    availability_status: "in_stock",
    scraped_at: "2024-01-19T14:30:00Z",
    last_updated: "2024-01-19T14:30:00Z",
    metadata: {},
  },
  {
    id: "3",
    product_id: "1",
    source_id: "source-1",
    price: 48.99,
    availability_status: "in_stock",
    scraped_at: "2024-01-18T14:30:00Z",
    last_updated: "2024-01-18T14:30:00Z",
    metadata: {},
  },
  {
    id: "4",
    product_id: "1",
    source_id: "source-1",
    price: 46.25,
    availability_status: "in_stock",
    scraped_at: "2024-01-17T14:30:00Z",
    last_updated: "2024-01-17T14:30:00Z",
    metadata: {},
  },
  {
    id: "5",
    product_id: "1",
    source_id: "source-1",
    price: 49.99,
    availability_status: "in_stock",
    scraped_at: "2024-01-16T14:30:00Z",
    last_updated: "2024-01-16T14:30:00Z",
    metadata: {},
  },
]

const mockCompetitorAnalysis: CompetitorAnalysis[] = [
  {
    id: "1",
    product_id: "1",
    competitor_name: "Cannabis Plus",
    our_price: 45.99,
    competitor_price: 42.5,
    price_difference: -3.49,
    market_position: "Premium Retailer",
    analysis_date: "2024-01-20",
    recommendations: {},
  },
  {
    id: "2",
    product_id: "1",
    competitor_name: "Green Market",
    our_price: 45.99,
    competitor_price: 48.99,
    price_difference: 3.0,
    market_position: "Budget Friendly",
    analysis_date: "2024-01-20",
    recommendations: {},
  },
  {
    id: "3",
    product_id: "1",
    competitor_name: "Elite Cannabis",
    our_price: 45.99,
    competitor_price: 52.0,
    price_difference: 6.01,
    market_position: "Luxury Brand",
    analysis_date: "2024-01-20",
    recommendations: {},
  },
]

const mockAlerts: PriceAlert[] = [
  {
    id: "1",
    user_id: "user-1",
    product_id: "1",
    target_price: 40.0,
    alert_type: "price_drop",
    is_active: true,
    notification_sent: false,
    created_at: "2024-01-15T10:00:00Z",
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const [product] = useState<Product>(mockProduct)
  const [priceHistory] = useState<PriceHistory[]>(mockPriceHistory)
  const [competitorAnalysis] = useState<CompetitorAnalysis[]>(mockCompetitorAnalysis)
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts)

  const handleCreateAlert = (newAlert: Omit<PriceAlert, "id" | "created_at" | "triggered_at">) => {
    const alert: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    setAlerts([...alerts, alert])
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-balance">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Product Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Current Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{product.inventory_count}</div>
                    <div className="text-xs text-muted-foreground">In Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">${product.cost.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Cost</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{product.thc_percentage}%</div>
                    <div className="text-xs text-muted-foreground">THC</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Package className="h-3 w-3 mr-1" />
                    Batch: {product.batch_id}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {product.expiration_date}
                  </Badge>
                  {product.inventory_count < 10 && <Badge variant="destructive">Low Stock</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <PriceChart data={priceHistory} productName={product.name} currentPrice={product.price} />

            {/* Competitor Analysis */}
            <CompetitorComparison analysis={competitorAnalysis} productName={product.name} ourPrice={product.price} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Alerts */}
            <PriceAlerts
              alerts={alerts}
              productId={product.id}
              currentPrice={product.price}
              onCreateAlert={handleCreateAlert}
              onDeleteAlert={handleDeleteAlert}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update Price
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Full History
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
