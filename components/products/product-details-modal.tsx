"use client"

import { UnifiedModal } from "@/components/shared/unified-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { Package, Calendar, DollarSign, Beaker } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage: number
  expiration_date: string
  batch_id: string
  created_at: string
  updated_at: string
}

interface ProductDetailsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  if (!product) return null

  const getMargin = (price: number, cost: number) => {
    if (cost === 0) return 0
    return ((price - cost) / price) * 100
  }

  const getStatusBadge = () => {
    const daysToExpiration = Math.ceil(
      (new Date(product.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )

    if (product.inventory_count === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }

    if (daysToExpiration <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>
    }

    if (daysToExpiration <= 30) {
      return <Badge variant="secondary">Expires Soon</Badge>
    }

    if (product.inventory_count < 10) {
      return <Badge variant="secondary">Low Stock</Badge>
    }

    return <Badge variant="default">Active</Badge>
  }

  const daysToExpiration = Math.ceil(
    (new Date(product.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <UnifiedModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={product.name}
      description={`${product.brand} • ${product.category}`}
      mode="dialog"
      size="lg"
      badge={{
        label: getStatusBadge().props.children as string,
        variant: getStatusBadge().props.variant,
      }}
      footerContent={
        <div className="flex gap-2 justify-end w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Product</Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Pricing Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing & Margin
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Retail Price</p>
              <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="text-2xl font-semibold">{formatCurrency(product.cost)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Margin</p>
              <p className="text-2xl font-semibold text-green-600">
                {getMargin(product.price, product.cost).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Inventory Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-xl font-semibold">{product.inventory_count} units</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">SKU</p>
              <p className="text-xl font-mono">{product.sku}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Product Details Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Product Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">THC Percentage</p>
              <p className="text-xl font-semibold">{product.thc_percentage}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Batch ID</p>
              <p className="text-xl font-mono">{product.batch_id}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dates Section */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Important Dates
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expiration Date</p>
              <p className="text-lg font-semibold">{new Date(product.expiration_date).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">{daysToExpiration} days remaining</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Added to System</p>
              <p className="text-lg font-semibold">{new Date(product.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </UnifiedModal>
  )
}
