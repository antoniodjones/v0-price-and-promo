"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Copy, Trash2, Play, Pause, Package, Calendar, DollarSign, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BundleDealEditModal } from "./bundle-deal-edit-modal"

interface BundleDeal {
  id: number
  name: string
  description: string
  status: string
  bundleType: string
  products: string[]
  discountType: string
  discountValue: number | null
  minQuantity: number
  maxQuantity: number | null
  startDate: string
  endDate: string
  totalSales: number
  bundlesSold: number
  avgOrderValue: number
}

const bundleDeals: BundleDeal[] = [
  {
    id: 1,
    name: "Flower Power Bundle",
    description: "Buy 2 flower products, get 3rd at 50% off",
    status: "active",
    bundleType: "category",
    products: ["Flower Category"],
    discountType: "percentage",
    discountValue: 50,
    minQuantity: 2,
    maxQuantity: 3,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    totalSales: 15420,
    bundlesSold: 89,
    avgOrderValue: 173.26,
  },
  {
    id: 2,
    name: "Starter Pack",
    description: "3 specific products bundled with 20% total discount",
    status: "active",
    bundleType: "fixed",
    products: ["Blue Dream 1/8", "Vape Pen", "Gummies 10mg"],
    discountType: "percentage",
    discountValue: 20,
    minQuantity: 3,
    maxQuantity: 3,
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    totalSales: 8950,
    bundlesSold: 45,
    avgOrderValue: 198.89,
  },
  {
    id: 3,
    name: "Mix & Match Edibles",
    description: "Buy any 3 edibles, save $15",
    status: "scheduled",
    bundleType: "category",
    products: ["Edibles Category"],
    discountType: "fixed",
    discountValue: 15,
    minQuantity: 3,
    maxQuantity: null,
    startDate: "2024-03-01",
    endDate: "2024-05-01",
    totalSales: 0,
    bundlesSold: 0,
    avgOrderValue: 0,
  },
  {
    id: 4,
    name: "Premium Experience",
    description: "High-end products bundle with tiered pricing",
    status: "paused",
    bundleType: "tiered",
    products: ["Premium Flower", "Live Resin", "Accessories"],
    discountType: "tiered",
    discountValue: null,
    minQuantity: 2,
    maxQuantity: null,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    totalSales: 12300,
    bundlesSold: 23,
    avgOrderValue: 534.78,
  },
]

export function BundleDealsList() {
  const [deals, setDeals] = useState<BundleDeal[]>(bundleDeals)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null)
  const [editingStartStep, setEditingStartStep] = useState<number>(1)

  const handleEditBundle = (bundleId: string) => {
    try {
      setEditingBundleId(bundleId)
      setEditingStartStep(1)
      setEditModalOpen(true)
    } catch (error) {
      console.error("Error opening edit modal:", error)
    }
  }

  const handleQuickEdit = (bundleId: string, startStep: number) => {
    try {
      setEditingBundleId(bundleId)
      setEditingStartStep(startStep)
      setEditModalOpen(true)
    } catch (error) {
      console.error("Error opening quick edit:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "expired":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getBundleTypeLabel = (type: string) => {
    switch (type) {
      case "fixed":
        return "Fixed Products"
      case "category":
        return "Category Based"
      case "tiered":
        return "Tiered Pricing"
      default:
        return type || "Unknown"
    }
  }

  const formatDiscount = (type: string, value: number | null) => {
    if (type === "tiered") return "Tiered"
    if (type === "percentage") return `${value || 0}% off`
    if (type === "fixed") return `$${value || 0} off`
    return "N/A"
  }

  const handleEditSuccess = () => {
    // Placeholder for handleEditSuccess logic
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gti-dark-green">Bundle Campaigns</h2>
          <Badge variant="outline" className="text-ada-secondary">
            {deals.length} total bundles
          </Badge>
        </div>

        <div className="grid gap-4">
          {deals.map((deal) => (
            <Card key={deal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg text-gti-dark-green">{deal.name || "Unnamed Bundle"}</CardTitle>
                      <Badge className={getStatusColor(deal.status)}>{deal.status || "unknown"}</Badge>
                      <Badge variant="outline">{getBundleTypeLabel(deal.bundleType)}</Badge>
                    </div>
                    <p className="text-sm text-ada-secondary">{deal.description || "No description available"}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditBundle(deal.id.toString())}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(deal.id.toString(), 2)}>
                        <Package className="w-4 h-4 mr-2" />
                        Manage Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(deal.id.toString(), 3)}>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Manage Pricing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(deal.id.toString(), 4)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Rules
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(deal.id.toString(), 5)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Manage Dates
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {deal.status === "active" ? (
                        <DropdownMenuItem>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause Bundle
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="w-4 h-4 mr-2" />
                          Activate Bundle
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Bundle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-ada-secondary">
                      <Package className="w-4 h-4" />
                      Products
                    </div>
                    <div className="text-sm font-medium">
                      {Array.isArray(deal.products) && deal.products.length > 0
                        ? deal.products.slice(0, 2).join(", ") +
                          (deal.products.length > 2 ? ` +${deal.products.length - 2} more` : "")
                        : "No products specified"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-ada-secondary">
                      <DollarSign className="w-4 h-4" />
                      Discount
                    </div>
                    <div className="text-sm font-medium">{formatDiscount(deal.discountType, deal.discountValue)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-ada-secondary">
                      <Calendar className="w-4 h-4" />
                      Duration
                    </div>
                    <div className="text-sm font-medium">
                      {deal.startDate ? new Date(deal.startDate).toLocaleDateString() : "Unknown"} -{" "}
                      {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : "Unknown"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-ada-secondary">Performance</div>
                    <div className="text-sm font-medium">{deal.bundlesSold || 0} bundles sold</div>
                    <div className="text-xs text-ada-secondary">${(deal.totalSales || 0).toLocaleString()} revenue</div>
                  </div>
                </div>

                {deal.bundleType === "tiered" && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Tiered Pricing Structure</div>
                    <div className="grid gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>2-3 items:</span>
                        <span className="font-medium">10% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>4-5 items:</span>
                        <span className="font-medium">15% off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>6+ items:</span>
                        <span className="font-medium">20% off</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {editingBundleId && (
        <BundleDealEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingBundleId(null)
            setEditingStartStep(1)
          }}
          bundleId={editingBundleId}
          initialStep={editingStartStep}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
