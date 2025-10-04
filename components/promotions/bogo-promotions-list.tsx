"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  BarChart3,
  Calendar,
  Target,
  Percent,
  Package,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BogoPromotionEditModal } from "./bogo-promotion-edit-modal"

interface BogoPromotion {
  id: string
  name: string
  type: "item" | "brand" | "category"
  triggerProduct: string
  rewardProduct: string
  rewardType: "percentage" | "dollar" | "free"
  rewardValue: number
  startDate: string
  endDate: string
  isActive: boolean
  performance: {
    uses: number
    savings: number
    conversionRate: number
  }
}

const mockPromotions: BogoPromotion[] = [
  {
    id: "1",
    name: "Premium Gummies BOGO November",
    type: "item",
    triggerProduct: "Premium Gummies - 10mg",
    rewardProduct: "Premium Gummies - 5mg",
    rewardType: "percentage",
    rewardValue: 50,
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    isActive: true,
    performance: {
      uses: 156,
      savings: 4680,
      conversionRate: 22.3,
    },
  },
  {
    id: "2",
    name: "Incredibles Brand BOGO",
    type: "brand",
    triggerProduct: "Any Incredibles Product",
    rewardProduct: "Second Incredibles Product",
    rewardType: "percentage",
    rewardValue: 25,
    startDate: "2025-10-15",
    endDate: "2025-12-15",
    isActive: true,
    performance: {
      uses: 89,
      savings: 2670,
      conversionRate: 18.7,
    },
  },
  {
    id: "3",
    name: "Edibles Category BOGO",
    type: "category",
    triggerProduct: "Any Edible",
    rewardProduct: "Second Edible",
    rewardType: "dollar",
    rewardValue: 10,
    startDate: "2025-09-01",
    endDate: "2025-10-31",
    isActive: false,
    performance: {
      uses: 234,
      savings: 7020,
      conversionRate: 15.2,
    },
  },
]

interface BogoPromotionsListProps {
  searchTerm: string
}

export function BogoPromotionsList({ searchTerm }: BogoPromotionsListProps) {
  const [promotions, setPromotions] = useState<BogoPromotion[]>(mockPromotions)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null)
  const [editingStartStep, setEditingStartStep] = useState<number>(1)

  const filteredPromotions = promotions.filter((promo) => {
    if (!promo || !searchTerm) return true

    const searchLower = (searchTerm || "").toLowerCase()
    const name = (promo.name || "").toLowerCase()
    const triggerProduct = (promo.triggerProduct || "").toLowerCase()

    return name.includes(searchLower) || triggerProduct.includes(searchLower)
  })

  const togglePromotion = (id: string) => {
    try {
      setPromotions((prev) => prev.map((promo) => (promo.id === id ? { ...promo, isActive: !promo.isActive } : promo)))
    } catch (error) {
      console.error("Error toggling promotion:", error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "item":
        return <Target className="h-4 w-4" />
      case "brand":
        return <BarChart3 className="h-4 w-4" />
      case "category":
        return <Calendar className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "item":
        return "bg-blue-100 text-blue-800"
      case "brand":
        return "bg-purple-100 text-purple-800"
      case "category":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleEditPromotion = (promotionId: string) => {
    setEditingPromotionId(promotionId)
    setEditingStartStep(1)
    setEditModalOpen(true)
  }

  const handleQuickEdit = (promotionId: string, startStep: number) => {
    setEditingPromotionId(promotionId)
    setEditingStartStep(startStep)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    console.log("BOGO promotion updated successfully")
  }

  return (
    <>
      <div className="space-y-4">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(promotion.type)}
                    <CardTitle className="text-lg">{promotion.name || "Unnamed Promotion"}</CardTitle>
                  </div>
                  <Badge className={getTypeBadgeColor(promotion.type)}>
                    {(promotion.type || "item").charAt(0).toUpperCase() + (promotion.type || "item").slice(1)} Level
                  </Badge>
                  <Badge variant={promotion.isActive ? "default" : "secondary"}>
                    {promotion.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={promotion.isActive} onCheckedChange={() => togglePromotion(promotion.id)} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPromotion(promotion.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(promotion.id, 2)}>
                        <Package className="mr-2 h-4 w-4" />
                        Manage Trigger Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(promotion.id, 3)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Manage Reward Products
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickEdit(promotion.id, 4)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Dates
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardDescription>
                Buy {promotion.triggerProduct || "Unknown Product"} → Get {promotion.rewardValue || 0}
                {promotion.rewardType === "percentage" ? "%" : "$"} off {promotion.rewardProduct || "Unknown Product"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Campaign Period</p>
                  <p className="text-sm">
                    {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : "Unknown"} -{" "}
                    {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                  <p className="text-sm font-bold text-gti-dark-green">{promotion.performance?.uses || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Customer Savings</p>
                  <p className="text-sm font-bold text-gti-dark-green">
                    ${(promotion.performance?.savings || 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <div className="flex items-center space-x-1">
                    <Percent className="h-3 w-3 text-gti-bright-green" />
                    <p className="text-sm font-bold text-gti-dark-green">
                      {promotion.performance?.conversionRate || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPromotions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search terms" : "Create your first BOGO campaign to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {editingPromotionId && (
        <BogoPromotionEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingPromotionId(null)
            setEditingStartStep(1)
          }}
          promotionId={editingPromotionId}
          initialStep={editingStartStep}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
