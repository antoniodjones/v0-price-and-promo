"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Users, Package, Tag, Loader2 } from "lucide-react"
import { CustomerDiscountEditModal } from "./customer-discount-edit-modal"

interface CustomerDiscount {
  id: string
  name: string
  level: string
  target: string
  type: "percentage" | "fixed"
  value: number
  customerTiers: string[]
  markets: string[]
  startDate: string
  endDate: string | null
  status: "active" | "scheduled" | "expired" | "paused"
  appliedOrders?: number
  totalSavings?: number
}

const mockDiscounts: CustomerDiscount[] = [
  {
    id: "1",
    name: "Premium Cannabis - Dispensary ABC 8%",
    level: "Brand",
    target: "Premium Cannabis Co",
    type: "percentage",
    value: 8,
    customerTiers: ["Dispensary ABC"],
    markets: [],
    startDate: "2025-10-01",
    endDate: null,
    status: "active",
    appliedOrders: 47,
    totalSavings: 12450.0,
  },
  {
    id: "2",
    name: "Gummies $5 Off - Elite & Premium",
    level: "Sub-category",
    target: "Edibles > Gummies",
    type: "fixed",
    value: 5,
    customerTiers: ["Elite Cannabis Co", "Premium Dispensary LLC"],
    markets: [],
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    status: "active",
    appliedOrders: 23,
    totalSavings: 2875.0,
  },
]

const getLevelIcon = (level: string) => {
  switch (level) {
    case "Brand":
      return <Tag className="h-4 w-4" />
    case "Category":
    case "Sub-category":
      return <Package className="h-4 w-4" />
    case "Size":
      return <Package className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gti-bright-green text-white"
    case "scheduled":
      return "bg-gti-yellow text-black"
    case "expired":
      return "bg-gray-500 text-white"
    case "paused":
      return "bg-orange-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function CustomerDiscountsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [discounts, setDiscounts] = useState<CustomerDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        console.log("[v0] Fetching customer discounts...")
        setLoading(true)
        setError(null)

        const response = await fetch("/api/discounts/customer")

        if (!response.ok) {
          console.log("[v0] API failed, using mock data")
          setDiscounts(mockDiscounts)
          return
        }

        const result = await response.json()

        if (result?.success && Array.isArray(result.data)) {
          const transformedData = result.data.map((discount: any) => ({
            id: discount?.id || "",
            name: discount?.name || "Unnamed Discount",
            level: discount?.level || "Unknown",
            target: discount?.target || "Unknown Target",
            type: discount?.type || "percentage",
            value: discount?.value || 0,
            customerTiers: Array.isArray(discount?.customer_tiers) ? discount.customer_tiers : [],
            markets: Array.isArray(discount?.markets) ? discount.markets : [],
            startDate: discount?.start_date || new Date().toISOString(),
            endDate: discount?.end_date || null,
            status: discount?.status || "active",
            appliedOrders: discount?.applied_orders || 0,
            totalSavings: discount?.total_savings || 0,
          }))
          setDiscounts(transformedData)
        } else {
          console.log("[v0] Invalid API response, using mock data")
          setDiscounts(mockDiscounts)
        }
      } catch (err) {
        console.error("[v0] Error fetching discounts:", err)
        console.log("[v0] Using mock data as fallback")
        setDiscounts(mockDiscounts)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [])

  const handleEditDiscount = (discountId: string) => {
    setEditingDiscountId(discountId)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("/api/discounts/customer")
        if (!response.ok) {
          console.log("[v0] Refresh failed, keeping current data")
          return
        }
        const result = await response.json()
        if (result?.success && Array.isArray(result.data)) {
          const transformedData = result.data.map((discount: any) => ({
            id: discount?.id || "",
            name: discount?.name || "Unnamed Discount",
            level: discount?.level || "Unknown",
            target: discount?.target || "Unknown Target",
            type: discount?.type || "percentage",
            value: discount?.value || 0,
            customerTiers: Array.isArray(discount?.customer_tiers) ? discount.customer_tiers : [],
            markets: Array.isArray(discount?.markets) ? discount.markets : [],
            startDate: discount?.start_date || new Date().toISOString(),
            endDate: discount?.end_date || null,
            status: discount?.status || "active",
            appliedOrders: discount?.applied_orders || 0,
            totalSavings: discount?.total_savings || 0,
          }))
          setDiscounts(transformedData)
        }
      } catch (err) {
        console.error("[v0] Failed to refresh discounts:", err)
      }
    }
    fetchDiscounts()
  }

  const filteredDiscounts = discounts.filter((discount) => {
    const searchLower = (searchTerm || "").toLowerCase()
    const nameMatch = (discount?.name || "").toLowerCase().includes(searchLower)
    const targetMatch = (discount?.target || "").toLowerCase().includes(searchLower)
    const tierMatch =
      Array.isArray(discount?.customerTiers) &&
      discount.customerTiers.some(
        (tier) => tier && typeof tier === "string" && (tier || "").toLowerCase().includes(searchLower),
      )

    return nameMatch || targetMatch || tierMatch
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Discount Rules</CardTitle>
          <CardDescription>Manage customer-specific pricing rules and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading discounts...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Discount Rules</CardTitle>
          <CardDescription>Manage customer-specific pricing rules and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <span>Error loading discounts: {error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Discount Rules</CardTitle>
              <CardDescription>Manage customer-specific pricing rules and assignments</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search discounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Discount Rule</TableHead>
                <TableHead>Level & Target</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Customer Tiers</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div className="font-medium">{discount.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(discount.level)}
                      <div>
                        <div className="text-sm font-medium">{discount.level}</div>
                        <div className="text-xs text-muted-foreground">{discount.target}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {discount.type === "percentage" ? "Percentage" : "Dollar amount"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{discount.customerTiers?.length || 0}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {discount.customerTiers && discount.customerTiers.length > 0 ? (
                        <>
                          {discount.customerTiers.slice(0, 2).join(", ")}
                          {discount.customerTiers.length > 2 && ` +${discount.customerTiers.length - 2} more`}
                        </>
                      ) : (
                        "No tiers assigned"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(discount.startDate).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {discount.endDate ? `to ${new Date(discount.endDate).toLocaleDateString()}` : "No end date"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{discount.appliedOrders || 0} orders</div>
                    <div className="text-xs text-muted-foreground">
                      ${(discount.totalSavings || 0).toLocaleString()} saved
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(discount.status)}>{discount.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditDiscount(discount.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Customers
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>

      {editingDiscountId && (
        <CustomerDiscountEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingDiscountId(null)
          }}
          discountId={editingDiscountId}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
