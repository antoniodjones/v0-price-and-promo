"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Target,
  Percent,
  Package,
  Gift,
  Tag,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/protected-route"

interface Promotion {
  id: string
  name: string
  type: "bogo" | "customer_discount" | "inventory_discount" | "bundle_deal" | "promo_code"
  status: "active" | "inactive" | "scheduled" | "expired"
  startDate: string
  endDate: string
  discountType?: string
  discountValue?: number
  usageCount?: number
  revenueImpact?: number
  createdAt: string
}

export default function ManagePromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    try {
      setLoading(true)

      // Fetch all promotion types in parallel
      const [bogoRes, customerRes, inventoryRes, bundleRes, promoCodeRes] = await Promise.all([
        fetch("/api/promotions/bogo"),
        fetch("/api/discounts/customer"),
        fetch("/api/discounts/inventory"),
        fetch("/api/bundle-deals"),
        fetch("/api/promo-codes"),
      ])

      const [bogoData, customerData, inventoryData, bundleData, promoCodeData] = await Promise.all([
        bogoRes.json(),
        customerRes.json(),
        inventoryRes.json(),
        bundleRes.json(),
        promoCodeRes.json(),
      ])

      // Transform and combine all promotions
      const allPromotions: Promotion[] = []

      // BOGO promotions
      if (bogoData.success && bogoData.data) {
        bogoData.data.forEach((promo: any) => {
          allPromotions.push({
            id: promo.id,
            name: promo.name,
            type: "bogo",
            status: promo.status,
            startDate: promo.start_date || promo.startDate,
            endDate: promo.end_date || promo.endDate,
            discountType: promo.reward_type || promo.rewardType,
            discountValue: promo.reward_value || promo.rewardValue,
            usageCount: 0,
            revenueImpact: 0,
            createdAt: promo.created_at || promo.createdAt,
          })
        })
      }

      // Customer discounts
      if (customerData.success && customerData.data) {
        customerData.data.forEach((discount: any) => {
          allPromotions.push({
            id: discount.id,
            name: discount.name,
            type: "customer_discount",
            status: discount.status,
            startDate: discount.start_date || discount.startDate,
            endDate: discount.end_date || discount.endDate,
            discountType: discount.type,
            discountValue: discount.value,
            usageCount: 0,
            revenueImpact: 0,
            createdAt: discount.created_at || discount.createdAt,
          })
        })
      }

      // Inventory discounts
      if (inventoryData.success && inventoryData.data) {
        inventoryData.data.forEach((discount: any) => {
          allPromotions.push({
            id: discount.id,
            name: discount.name,
            type: "inventory_discount",
            status: discount.status,
            startDate: discount.created_at || discount.createdAt,
            endDate: "Ongoing",
            discountType: discount.discount_type || discount.discountType,
            discountValue: discount.discount_value || discount.discountValue,
            usageCount: 0,
            revenueImpact: 0,
            createdAt: discount.created_at || discount.createdAt,
          })
        })
      }

      // Bundle deals
      if (bundleData.success && bundleData.data) {
        bundleData.data.forEach((bundle: any) => {
          allPromotions.push({
            id: bundle.id,
            name: bundle.name,
            type: "bundle_deal",
            status: bundle.status,
            startDate: bundle.start_date || bundle.startDate,
            endDate: bundle.end_date || bundle.endDate,
            discountType: bundle.discount_type || bundle.discountType,
            discountValue: bundle.discount_value || bundle.discountValue,
            usageCount: 0,
            revenueImpact: 0,
            createdAt: bundle.created_at || bundle.createdAt,
          })
        })
      }

      // Promo codes
      if (promoCodeData.success && promoCodeData.data) {
        promoCodeData.data.forEach((code: any) => {
          allPromotions.push({
            id: code.id,
            name: code.code,
            type: "promo_code",
            status: code.status,
            startDate: code.start_date || code.startDate,
            endDate: code.end_date || code.endDate,
            discountType: code.discount_type || code.discountType,
            discountValue: code.discount_value || code.discountValue,
            usageCount: code.usage_count || code.usageCount || 0,
            revenueImpact: 0,
            createdAt: code.created_at || code.createdAt,
          })
        })
      }

      // Sort by created date (newest first)
      allPromotions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setPromotions(allPromotions)
    } catch (error) {
      console.error("[v0] Error loading promotions:", error)
      toast({
        title: "Error Loading Promotions",
        description: error instanceof Error ? error.message : "Failed to load promotions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return

    try {
      let endpoint = ""
      switch (type) {
        case "bogo":
          endpoint = `/api/promotions/bogo/${id}`
          break
        case "customer_discount":
          endpoint = `/api/discounts/customer/${id}`
          break
        case "inventory_discount":
          endpoint = `/api/discounts/inventory/${id}`
          break
        case "bundle_deal":
          endpoint = `/api/bundle-deals/${id}`
          break
        case "promo_code":
          endpoint = `/api/promo-codes/${id}`
          break
      }

      const response = await fetch(endpoint, { method: "DELETE" })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete promotion")
      }

      toast({
        title: "Promotion Deleted",
        description: "The promotion has been successfully deleted",
      })

      loadPromotions()
    } catch (error) {
      console.error("[v0] Error deleting promotion:", error)
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete promotion",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string, type: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      let endpoint = ""
      switch (type) {
        case "bogo":
          endpoint = `/api/promotions/bogo/${id}`
          break
        case "customer_discount":
          endpoint = `/api/discounts/customer/${id}`
          break
        case "inventory_discount":
          endpoint = `/api/discounts/inventory/${id}`
          break
        case "bundle_deal":
          endpoint = `/api/bundle-deals/${id}`
          break
        case "promo_code":
          endpoint = `/api/promo-codes/${id}`
          break
      }

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update status")
      }

      toast({
        title: "Status Updated",
        description: `Promotion is now ${newStatus}`,
      })

      loadPromotions()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bogo":
        return <Gift className="h-4 w-4" />
      case "customer_discount":
        return <Percent className="h-4 w-4" />
      case "inventory_discount":
        return <Package className="h-4 w-4" />
      case "bundle_deal":
        return <Target className="h-4 w-4" />
      case "promo_code":
        return <Tag className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      bogo: "bg-blue-100 text-blue-800",
      customer_discount: "bg-green-100 text-green-800",
      inventory_discount: "bg-orange-100 text-orange-800",
      bundle_deal: "bg-purple-100 text-purple-800",
      promo_code: "bg-pink-100 text-pink-800",
    }

    const labels: Record<string, string> = {
      bogo: "BOGO",
      customer_discount: "Customer Discount",
      inventory_discount: "Inventory Discount",
      bundle_deal: "Bundle Deal",
      promo_code: "Promo Code",
    }

    return <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>{labels[type] || type}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { icon: any; color: string }> = {
      active: { icon: CheckCircle, color: "bg-green-100 text-green-800" },
      inactive: { icon: AlertCircle, color: "bg-gray-100 text-gray-800" },
      scheduled: { icon: Clock, color: "bg-blue-100 text-blue-800" },
      expired: { icon: AlertCircle, color: "bg-red-100 text-red-800" },
    }

    const variant = variants[status] || variants.inactive
    const Icon = variant.icon

    return (
      <Badge className={variant.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Ongoing") return "Ongoing"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "N/A"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || promo.status === statusFilter
    const matchesType = typeFilter === "all" || promo.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === "active").length,
    totalUsage: promotions.reduce((sum, p) => sum + (p.usageCount || 0), 0),
    totalRevenue: promotions.reduce((sum, p) => sum + (p.revenueImpact || 0), 0),
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg">Loading promotions...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manage Promotions</h1>
              <p className="text-muted-foreground mt-1">
                View, edit, and manage all promotional campaigns in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Promotion
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/promotions/new">
                      <Gift className="mr-2 h-4 w-4" />
                      BOGO Promotion
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/customer-discounts/new">
                      <Percent className="mr-2 h-4 w-4" />
                      Customer Discount
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/inventory-discounts/new">
                      <Package className="mr-2 h-4 w-4" />
                      Inventory Discount
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bundle-deals/new">
                      <Target className="mr-2 h-4 w-4" />
                      Bundle Deal
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/promo-codes">
                      <Tag className="mr-2 h-4 w-4" />
                      Promo Code
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Promotions</CardTitle>
                <Target className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats.active} currently active</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Promotions</CardTitle>
                <CheckCircle className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.active / stats.total) * 100).toFixed(0)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Times promotions were used</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Impact</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total revenue from promotions</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Filter Promotions</CardTitle>
              <CardDescription>Search and filter promotions by type and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search promotions by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bogo">BOGO</SelectItem>
                    <SelectItem value="customer_discount">Customer Discount</SelectItem>
                    <SelectItem value="inventory_discount">Inventory Discount</SelectItem>
                    <SelectItem value="bundle_deal">Bundle Deal</SelectItem>
                    <SelectItem value="promo_code">Promo Code</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Promotions Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>All Promotions</CardTitle>
              <CardDescription>
                {filteredPromotions.length} promotion{filteredPromotions.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPromotions.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No promotions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first promotion to get started"}
                  </p>
                  {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
                    <Button asChild>
                      <Link href="/promotions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Promotion
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPromotions.map((promo) => (
                        <TableRow key={`${promo.type}-${promo.id}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(promo.type)}
                              {promo.name}
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(promo.type)}</TableCell>
                          <TableCell>{getStatusBadge(promo.status)}</TableCell>
                          <TableCell>
                            {promo.discountValue
                              ? `${promo.discountType === "percentage" ? `${promo.discountValue}%` : formatCurrency(promo.discountValue)}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{formatDate(promo.startDate)}</TableCell>
                          <TableCell>{formatDate(promo.endDate)}</TableCell>
                          <TableCell>{promo.usageCount || 0}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(promo.id, promo.type, promo.status)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {promo.status === "active" ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(promo.id, promo.type)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
