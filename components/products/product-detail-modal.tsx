"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, DollarSign, BarChart3 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

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

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  if (!product) return null

  const margin = product.cost > 0 ? ((product.price - product.cost) / product.price) * 100 : 0
  const daysToExpiration = Math.ceil(
    (new Date(product.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div>
            <DialogTitle className="text-2xl">{product.name}</DialogTitle>
            <p className="text-muted-foreground mt-1">
              {product.brand} • {product.category}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="font-mono">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Batch ID:</span>
                    <span className="font-mono">{product.batch_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">THC %:</span>
                    <span>{product.thc_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span>{product.inventory_count} units</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retail Price:</span>
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span>{formatCurrency(product.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Margin:</span>
                    <span className="font-semibold text-gti-bright-green">{margin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates and Status */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dates & Status
            </h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>{new Date(product.expiration_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days to Expiry:</span>
                  <Badge
                    variant={daysToExpiration <= 7 ? "destructive" : daysToExpiration <= 30 ? "secondary" : "default"}
                  >
                    {daysToExpiration} days
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analytics Preview */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Quick Stats
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-gti-bright-green">
                  {formatCurrency(product.price * product.inventory_count)}
                </div>
                <div className="text-xs text-muted-foreground">Total Value</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Active Discounts</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Sales This Month</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
