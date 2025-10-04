"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Package, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { ProductDetailsModal } from "./product-details-modal"

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
  viewMode?: "grid" | "list"
}

export function ProductsList({ refreshTrigger, viewMode = "grid" }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [refreshTrigger])

  const fetchProducts = async () => {
    try {
      console.log("[v0] ProductsList: Starting fetch from /api/products")
      setLoading(true)
      const response = await fetch("/api/products")

      console.log("[v0] ProductsList: Response status:", response.status, response.statusText)

      if (!response.ok) {
        // Try to parse error message from JSON, fallback to status text
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.json()
          console.log("[v0] ProductsList: Error data:", errorData)
          errorMessage = errorData.message || errorMessage
        } catch {
          // If JSON parsing fails, use the status text
          errorMessage = `Server error: ${response.statusText}`
        }
        console.error("[v0] ProductsList: Setting error:", errorMessage)
        setError(errorMessage)
        return
      }

      const data = await response.json()
      console.log("[v0] ProductsList: Response data:", {
        success: data.success,
        dataLength: data.data?.length,
        message: data.message,
      })

      if (data.success) {
        setProducts(data.data || [])
        setError(null)
      } else {
        setError(data.message || "Failed to fetch products")
      }
    } catch (err) {
      console.error("[v0] ProductsList: Catch block error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch products")
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

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
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

  if (viewMode === "list") {
    return (
      <>
        <div className="space-y-2">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onDoubleClick={() => handleViewDetails(product)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-base truncate">{product.name}</h3>
                      {getStatusBadge(product)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.brand} • {product.category} • SKU: {product.sku}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.inventory_count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">THC</p>
                      <p className="font-medium">{product.thc_percentage}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Margin</p>
                      <p className="font-medium">{getMargin(product.price, product.cost).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)}>
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ProductDetailsModal product={selectedProduct} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onDoubleClick={() => handleViewDetails(product)}
          >
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
                    <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
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
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)}>
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProductDetailsModal product={selectedProduct} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
