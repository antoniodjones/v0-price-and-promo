"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  Zap,
  Package,
  AlertTriangle,
  Loader2,
  Target,
  DollarSign,
  Calendar,
} from "lucide-react"
import { InventoryDiscountEditModal } from "./inventory-discount-edit-modal"

interface InventoryDiscount {
  id: string
  name: string
  type: "expiration" | "thc"
  triggerValue: number
  discountType: "percentage" | "fixed"
  discountValue: number
  scope: "all" | "category" | "brand"
  scopeValue?: string
  status: "active" | "scheduled" | "paused" | "expired"
  createdAt: string
  updatedAt: string
  batchesAffected?: number
  totalSavings?: number
  lastTriggered?: string
}

const mockAutoDiscounts: InventoryDiscount[] = [
  {
    id: "auto-1",
    name: "30-Day Expiration Auto Discount",
    type: "expiration",
    triggerValue: 30,
    discountType: "percentage",
    discountValue: 20,
    scope: "all",
    status: "active",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-21T00:00:00Z",
    batchesAffected: 23,
    totalSavings: 8450.0,
    lastTriggered: "2 hours ago",
  },
  {
    id: "auto-2",
    name: "Low THC Flower Discount",
    type: "thc",
    triggerValue: 15,
    discountType: "percentage",
    discountValue: 10,
    scope: "category",
    scopeValue: "Flower",
    status: "active",
    createdAt: "2025-09-15T00:00:00Z",
    updatedAt: "2025-10-20T00:00:00Z",
    batchesAffected: 12,
    totalSavings: 3240.0,
    lastTriggered: "1 day ago",
  },
  {
    id: "auto-3",
    name: "Premium Brand 14-Day Expiration",
    type: "expiration",
    triggerValue: 14,
    discountType: "percentage",
    discountValue: 30,
    scope: "brand",
    scopeValue: "Premium Cannabis Co",
    status: "active",
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-21T00:00:00Z",
    batchesAffected: 8,
    totalSavings: 5670.0,
    lastTriggered: "6 hours ago",
  },
  {
    id: "auto-4",
    name: "Holiday Concentrates THC Boost",
    type: "thc",
    triggerValue: 70,
    discountType: "fixed",
    discountValue: 15,
    scope: "category",
    scopeValue: "Concentrates",
    status: "scheduled",
    createdAt: "2025-11-01T00:00:00Z",
    updatedAt: "2025-11-01T00:00:00Z",
    batchesAffected: 0,
    totalSavings: 0,
    lastTriggered: "Never",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "expiration":
      return <Clock className="h-4 w-4" />
    case "thc":
      return <Zap className="h-4 w-4" />
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
    case "paused":
      return "bg-orange-500 text-white"
    case "expired":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "expiration":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "thc":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function InventoryDiscountsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [discounts, setDiscounts] = useState<InventoryDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null)
  const [editingStartStep, setEditingStartStep] = useState<number>(1)

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/discounts/inventory")

        if (!response.ok) {
          throw new Error(`Failed to fetch inventory discounts: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          const validatedDiscounts = Array.isArray(result.data) ? result.data : []
          setDiscounts(validatedDiscounts)
        } else {
          throw new Error(result.message || "Failed to fetch inventory discounts")
        }
      } catch (err) {
        console.error("Error fetching inventory discounts:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        setDiscounts(mockAutoDiscounts)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscounts()
  }, [])

  const filteredDiscounts = discounts.filter((discount) => {
    if (!discount || !searchTerm) return true

    const searchLower = (searchTerm || "").toLowerCase()
    const name = (discount.name || "").toLowerCase()
    const scopeValue = (discount.scopeValue || "").toLowerCase()
    const type = (discount.type || "").toLowerCase()

    return name.includes(searchLower) || scopeValue.includes(searchLower) || type.includes(searchLower)
  })

  const handleEditDiscount = (discountId: string) => {
    setEditingDiscountId(discountId)
    setEditingStartStep(1)
    setEditModalOpen(true)
  }

  const handleQuickEdit = (discountId: string, startStep: number) => {
    setEditingDiscountId(discountId)
    setEditingStartStep(startStep)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch("/api/discounts/inventory")
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const validatedDiscounts = Array.isArray(result.data) ? result.data : []
            setDiscounts(validatedDiscounts)
          }
        }
      } catch (err) {
        console.error("Failed to refresh discounts:", err)
      }
    }
    fetchDiscounts()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automated Discount Rules</CardTitle>
          <CardDescription>Inventory-based automatic discounting rules and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading inventory discounts...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && discounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Automated Discount Rules</CardTitle>
          <CardDescription>Inventory-based automatic discounting rules and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-red-600">
            <span>Error loading inventory discounts: {error}</span>
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
              <CardTitle>Automated Discount Rules</CardTitle>
              <CardDescription>
                {error
                  ? "Showing cached data due to connection issues"
                  : "Inventory-based automatic discounting rules and their performance"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search auto discounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDiscounts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <span>No inventory discounts found. Create your first automated discount rule.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type & Trigger</TableHead>
                  <TableHead>Scope & Target</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="font-medium">{discount.name || "Unnamed Rule"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(discount.type)}
                        <div>
                          <Badge variant="outline" className={getTypeColor(discount.type)}>
                            {discount.type === "expiration" ? "Expiration" : "THC Level"}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            {discount.type === "expiration"
                              ? `${discount.triggerValue || 0} days before expiry`
                              : `THC ${discount.triggerValue || 0}%+`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium capitalize">{discount.scope || "all"}</div>
                        <div className="text-xs text-muted-foreground">
                          {discount.scope === "all" ? "All Products" : discount.scopeValue || "Not specified"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {discount.discountType === "percentage"
                          ? `${discount.discountValue || 0}%`
                          : `$${discount.discountValue || 0}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {discount.discountType === "percentage" ? "Percentage" : "Dollar amount"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{discount.batchesAffected || 0} batches</div>
                      <div className="text-xs text-muted-foreground">
                        ${(discount.totalSavings || 0).toLocaleString()} saved
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {discount.updatedAt ? new Date(discount.updatedAt).toLocaleDateString() : "Unknown"}
                      </div>
                      {discount.status === "active" && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-gti-bright-green rounded-full animate-pulse"></div>
                          <span className="text-xs text-gti-bright-green">Active</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(discount.status)}>{discount.status || "unknown"}</Badge>
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
                            Edit All
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickEdit(discount.id, 2)}>
                            <Target className="mr-2 h-4 w-4" />
                            Manage Scope
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickEdit(discount.id, 4)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Manage Discount Value
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleQuickEdit(discount.id, 5)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Manage Dates
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            View Affected Batches
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Pause Rule
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
          )}
        </CardContent>
      </Card>

      {editingDiscountId && (
        <InventoryDiscountEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingDiscountId(null)
            setEditingStartStep(1)
          }}
          discountId={editingDiscountId}
          initialStep={editingStartStep}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
