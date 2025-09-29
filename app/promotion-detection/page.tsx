"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  TrendingUp,
  AlertTriangle,
  Download,
  RefreshCw,
  Activity,
  Loader2,
  Target,
  Zap,
  Brain,
  BarChart3,
  Calendar,
  Users,
  Package,
  Lightbulb,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface PromotionOpportunity {
  id: string
  type: "competitor_match" | "inventory_clearance" | "market_trend" | "customer_behavior" | "seasonal"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  confidence: number
  potential_impact: {
    revenue_increase: number
    margin_impact: number
    customer_acquisition: number
  }
  suggested_action: {
    promotion_type: string
    discount_percentage: number
    duration_days: number
    target_products: string[]
    target_customers?: string[]
  }
  data_sources: string[]
  created_at: string
  status: "pending" | "approved" | "rejected" | "implemented"
}

interface DetectionSettings {
  auto_detection_enabled: boolean
  confidence_threshold: number
  priority_filter: string[]
  notification_enabled: boolean
  detection_frequency: "real_time" | "hourly" | "daily" | "weekly"
}

export default function PromotionDetectionPage() {
  const [opportunities, setOpportunities] = useState<PromotionOpportunity[]>([])
  const [settings, setSettings] = useState<DetectionSettings>({
    auto_detection_enabled: true,
    confidence_threshold: 75,
    priority_filter: ["high", "medium", "low"],
    notification_enabled: true,
    detection_frequency: "hourly",
  })
  const [loading, setLoading] = useState(true)
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadPromotionOpportunities()
  }, [])

  const loadPromotionOpportunities = async () => {
    try {
      setLoading(true)
      // Mock data - in real implementation, this would fetch from API
      const mockOpportunities: PromotionOpportunity[] = [
        {
          id: "1",
          type: "competitor_match",
          title: "Competitor Price Match Opportunity",
          description: "Competitor offering 20% off on Premium OG Kush. Our price is 15% higher.",
          priority: "high",
          confidence: 92,
          potential_impact: {
            revenue_increase: 15000,
            margin_impact: -8,
            customer_acquisition: 45,
          },
          suggested_action: {
            promotion_type: "percentage_discount",
            discount_percentage: 18,
            duration_days: 7,
            target_products: ["Premium OG Kush", "OG Kush variants"],
          },
          data_sources: ["Competitor API", "Price Tracking", "Market Analysis"],
          created_at: new Date().toISOString(),
          status: "pending",
        },
        {
          id: "2",
          type: "inventory_clearance",
          title: "Expiring Inventory Alert",
          description: "142 units of Blue Dream expiring in 5 days. Current sell-through rate: 12 units/day.",
          priority: "high",
          confidence: 88,
          potential_impact: {
            revenue_increase: 8500,
            margin_impact: -25,
            customer_acquisition: 28,
          },
          suggested_action: {
            promotion_type: "tiered_discount",
            discount_percentage: 30,
            duration_days: 5,
            target_products: ["Blue Dream", "Blue Dream Cartridge"],
          },
          data_sources: ["Inventory System", "Sales Analytics", "Expiration Tracking"],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "pending",
        },
        {
          id: "3",
          type: "market_trend",
          title: "Rising Demand for Edibles",
          description: "Market data shows 35% increase in edibles demand. Our edibles sales up 28%.",
          priority: "medium",
          confidence: 76,
          potential_impact: {
            revenue_increase: 22000,
            margin_impact: 12,
            customer_acquisition: 67,
          },
          suggested_action: {
            promotion_type: "bundle_deal",
            discount_percentage: 15,
            duration_days: 14,
            target_products: ["All Edibles"],
            target_customers: ["New Customers", "Infrequent Buyers"],
          },
          data_sources: ["Market Research", "Sales Trends", "Customer Analytics"],
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "approved",
        },
        {
          id: "4",
          type: "customer_behavior",
          title: "Customer Retention Opportunity",
          description: "Tier B customers showing 23% decrease in purchase frequency over last 30 days.",
          priority: "medium",
          confidence: 82,
          potential_impact: {
            revenue_increase: 18500,
            margin_impact: -5,
            customer_acquisition: 0,
          },
          suggested_action: {
            promotion_type: "loyalty_discount",
            discount_percentage: 12,
            duration_days: 21,
            target_products: ["All Products"],
            target_customers: ["Tier B Customers"],
          },
          data_sources: ["Customer Analytics", "Purchase History", "Loyalty Program"],
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: "pending",
        },
        {
          id: "5",
          type: "seasonal",
          title: "Holiday Season Preparation",
          description: "Historical data shows 45% sales increase during holiday season. Inventory levels optimal.",
          priority: "low",
          confidence: 71,
          potential_impact: {
            revenue_increase: 35000,
            margin_impact: 8,
            customer_acquisition: 120,
          },
          suggested_action: {
            promotion_type: "seasonal_campaign",
            discount_percentage: 20,
            duration_days: 30,
            target_products: ["Gift Sets", "Premium Products"],
          },
          data_sources: ["Historical Sales", "Seasonal Trends", "Inventory Levels"],
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: "implemented",
        },
      ]

      setOpportunities(mockOpportunities)
    } catch (error) {
      console.error("Error loading promotion opportunities:", error)
      toast({
        title: "Error",
        description: "Failed to load promotion opportunities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveOpportunity = async (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId)
    if (!opportunity) return

    setOpportunities(opportunities.map((o) => (o.id === opportunityId ? { ...o, status: "approved" as const } : o)))

    toast({
      title: "Opportunity Approved",
      description: `${opportunity.title} has been approved for implementation.`,
    })
  }

  const handleRejectOpportunity = async (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId)
    if (!opportunity) return

    setOpportunities(opportunities.map((o) => (o.id === opportunityId ? { ...o, status: "rejected" as const } : o)))

    toast({
      title: "Opportunity Rejected",
      description: `${opportunity.title} has been rejected.`,
    })
  }

  const handleImplementOpportunity = async (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId)
    if (!opportunity) return

    setOpportunities(opportunities.map((o) => (o.id === opportunityId ? { ...o, status: "implemented" as const } : o)))

    toast({
      title: "Promotion Implemented",
      description: `${opportunity.title} has been implemented successfully.`,
    })
  }

  const handleRefreshDetection = async () => {
    await loadPromotionOpportunities()
    toast({
      title: "Detection Refreshed",
      description: "Promotion detection has been refreshed with latest data.",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "competitor_match":
        return <Target className="h-4 w-4 text-red-500" />
      case "inventory_clearance":
        return <Package className="h-4 w-4 text-orange-500" />
      case "market_trend":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "customer_behavior":
        return <Users className="h-4 w-4 text-purple-500" />
      case "seasonal":
        return <Calendar className="h-4 w-4 text-green-500" />
      default:
        return <Lightbulb className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      case "low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
      case "approved":
        return <Badge className="bg-blue-500 text-white">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "implemented":
        return <Badge className="bg-green-500 text-white">Implemented</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-500"
    if (confidence >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const filteredOpportunities = opportunities.filter((opportunity) => {
    if (filterType !== "all" && opportunity.type !== filterType) return false
    if (filterStatus !== "all" && opportunity.status !== filterStatus) return false
    return true
  })

  const stats = {
    total_opportunities: opportunities.length,
    pending_review: opportunities.filter((o) => o.status === "pending").length,
    high_priority: opportunities.filter((o) => o.priority === "high").length,
    avg_confidence:
      opportunities.length > 0
        ? Math.round(opportunities.reduce((sum, o) => sum + o.confidence, 0) / opportunities.length)
        : 0,
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading promotion detection data...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2">Pricing & Promotions</h1>
              <h2 className="text-3xl font-bold text-foreground">Promotion Detection Engine</h2>
              <p className="text-muted-foreground">AI-powered promotion opportunity detection and recommendations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" onClick={handleRefreshDetection}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Detection
              </Button>
              <Button>
                <Brain className="mr-2 h-4 w-4" />
                Run Analysis
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
                <Lightbulb className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.total_opportunities}</div>
                <p className="text-xs text-muted-foreground">Detected this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{stats.pending_review}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.high_priority}</div>
                <p className="text-xs text-muted-foreground">Urgent opportunities</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getConfidenceColor(stats.avg_confidence)}`}>
                  {stats.avg_confidence}%
                </div>
                <p className="text-xs text-muted-foreground">Detection accuracy</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="opportunities" className="space-y-4">
            <TabsList>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Detection Settings</TabsTrigger>
            </TabsList>

            {/* Opportunities Tab */}
            <TabsContent value="opportunities" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Promotion Opportunities</h3>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="competitor_match">Competitor Match</SelectItem>
                      <SelectItem value="inventory_clearance">Inventory Clearance</SelectItem>
                      <SelectItem value="market_trend">Market Trend</SelectItem>
                      <SelectItem value="customer_behavior">Customer Behavior</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredOpportunities.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
                      <p className="text-muted-foreground">No promotion opportunities match your current filters.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="border-l-4 border-l-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getTypeIcon(opportunity.type)}
                            <div>
                              <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                              <CardDescription className="mt-1">{opportunity.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(opportunity.priority)}
                            {getStatusBadge(opportunity.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3 mb-4">
                          <div>
                            <Label className="text-sm font-medium">Confidence Score</Label>
                            <div className={`text-2xl font-bold ${getConfidenceColor(opportunity.confidence)}`}>
                              {opportunity.confidence}%
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Revenue Impact</Label>
                            <div className="text-2xl font-bold text-green-500">
                              +${opportunity.potential_impact.revenue_increase.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Customer Acquisition</Label>
                            <div className="text-2xl font-bold text-blue-500">
                              +{opportunity.potential_impact.customer_acquisition}
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">Suggested Action</h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Promotion Type:</span>
                              <div className="font-medium capitalize">
                                {opportunity.suggested_action.promotion_type.replace("_", " ")}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Discount:</span>
                              <div className="font-medium">{opportunity.suggested_action.discount_percentage}%</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Duration:</span>
                              <div className="font-medium">{opportunity.suggested_action.duration_days} days</div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Target Products:</span>
                              <div className="font-medium">
                                {opportunity.suggested_action.target_products.length} products
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>Data sources: {opportunity.data_sources.join(", ")}</span>
                          </div>
                          <div className="flex gap-2">
                            {opportunity.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRejectOpportunity(opportunity.id)}
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                                <Button size="sm" onClick={() => handleApproveOpportunity(opportunity.id)}>
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                              </>
                            )}
                            {opportunity.status === "approved" && (
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => handleImplementOpportunity(opportunity.id)}
                              >
                                <Zap className="mr-1 h-3 w-3" />
                                Implement
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Performance Analytics</CardTitle>
                  <CardDescription>Track the effectiveness of promotion detection and implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">87%</div>
                      <div className="text-sm text-muted-foreground">Implementation Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">$156K</div>
                      <div className="text-sm text-muted-foreground">Revenue Generated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">342</div>
                      <div className="text-sm text-muted-foreground">New Customers Acquired</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">23%</div>
                      <div className="text-sm text-muted-foreground">Avg ROI Improvement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Configuration</CardTitle>
                  <CardDescription>Configure how the promotion detection engine operates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Auto-detection enabled</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically detect promotion opportunities
                        </div>
                      </div>
                      <Switch
                        checked={settings.auto_detection_enabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, auto_detection_enabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Real-time notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Get notified immediately when opportunities are detected
                        </div>
                      </div>
                      <Switch
                        checked={settings.notification_enabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, notification_enabled: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                      <Input
                        id="confidence-threshold"
                        type="number"
                        value={settings.confidence_threshold}
                        onChange={(e) =>
                          setSettings({ ...settings, confidence_threshold: Number.parseInt(e.target.value) || 75 })
                        }
                        className="w-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detection-frequency">Detection Frequency</Label>
                      <Select
                        value={settings.detection_frequency}
                        onValueChange={(value: any) => setSettings({ ...settings, detection_frequency: value })}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real_time">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
