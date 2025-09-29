"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, Trash2, Package, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
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

interface ProductsListProps {
  refreshTrigger?: number
}

export function ProductsList({ refreshTrigger }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.data || [])
      } else {
        setError(data.message || "Failed to fetch products")
      }
    } catch (err) {
      setError("Failed to fetch products")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (product: Product) => {
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

  const getMargin = (price: number, cost: number) => {
    if (cost === 0) return 0
    return ((price - cost) / price) * 100
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchProducts}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first product to the catalog.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.brand} • {product.category}
                </p>
                <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Margin</span>
                <span className="font-medium">{getMargin(product.price, product.cost).toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stock</span>
                <span className="font-medium">{product.inventory_count} units</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">THC</span>
                <span className="font-medium">{product.thc_percentage}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Batch</span>
                <span className="font-mono text-xs">{product.batch_id}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="text-xs">{new Date(product.expiration_date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                {getStatusBadge(product)}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
