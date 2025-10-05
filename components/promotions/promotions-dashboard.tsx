"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Target, Percent, Calendar, Plus, BarChart3, Upload } from "lucide-react"
import { promotionsService, type BogoPromotion, type DealNotification } from "@/lib/services/promotions"
import { BogoPromotionsList } from "./bogo-promotions-list"
import Link from "next/link"
import { BulkUploadModal } from "./bulk-upload-modal"

export function PromotionsDashboard() {
  const [loading, setLoading] = useState(true)
  const [promotionStats, setPromotionStats] = useState({
    totalActivePromotions: 0,
    totalRevenue: 0,
    totalSavings: 0,
    conversionRate: 0,
    topPerformingType: "bogo",
  })
  const [bogoPromotions, setBogoPromotions] = useState<BogoPromotion[]>([])
  const [dealNotifications, setDealNotifications] = useState<DealNotification[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, bogos, deals] = await Promise.all([
          promotionsService.getPromotionStatsClient(),
          promotionsService.getBogoPromotionsClient(),
          promotionsService.getActiveDealNotificationsClient(),
        ])

        setPromotionStats(stats)
        setBogoPromotions(bogos)
        setDealNotifications(deals)
      } catch (error) {
        console.error("Error loading promotions data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleBulkUploadSuccess = () => {
    setLoading(true)
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotionStats.totalActivePromotions}</div>
            <p className="text-xs text-muted-foreground">Across all types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promotionStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <Percent className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promotionStats.totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotionStats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Promotion usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Tabs */}
      <Tabs defaultValue="bogo" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="bogo">BOGO Deals</TabsTrigger>
            <TabsTrigger value="deals">Deal Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Link href="/promotions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create BOGO
              </Button>
            </Link>
            <Link href="/bundle-deals/new">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Bundle
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="bogo" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">BOGO Promotions</h3>
              <p className="text-sm text-muted-foreground">{bogoPromotions.length} total campaigns</p>
            </div>
            <Button variant="outline" onClick={() => setBulkUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>

          <BogoPromotionsList searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Active Deal Notifications</h3>
              <p className="text-sm text-muted-foreground">{dealNotifications.length} active deals</p>
            </div>
          </div>

          <div className="grid gap-4">
            {dealNotifications.map((deal) => (
              <Card key={deal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{deal.title}</CardTitle>
                    <Badge variant="secondary">{deal.discount_percentage}% OFF</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{deal.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-green-600">${deal.sale_price?.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${deal.original_price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Valid until</p>
                      <p className="text-sm font-medium">
                        {deal.valid_until ? new Date(deal.valid_until).toLocaleDateString() : "Ongoing"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {dealNotifications.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active deals</h3>
                  <p className="text-muted-foreground text-center">
                    Deal notifications will appear here when available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Comprehensive Promotion Analytics</h3>
            <p className="text-muted-foreground mb-4">View detailed performance across all promotion types</p>
            <Link href="/analytics">
              <Button>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Analytics
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onSuccess={handleBulkUploadSuccess}
      />
    </div>
  )
}
