"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Loader2, Download, Upload, Eye, TrendingUp } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage: number | null
  expiration_date: string | null
  batch_id: string | null
  created_at: string
  updated_at: string
  status?: "active" | "discontinued" | "out_of_stock"
}

interface ProductFormData {
  sku: string
  name: string
  brand: string
  category: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage: number | null
  expiration_date: string | null
  batch_id: string | null
}

const initialFormData: ProductFormData = {
  sku: "",
  name: "",
  brand: "",
  category: "",
  price: 0,
  cost: 0,
  inventory_count: 0,
  thc_percentage: null,
  expiration_date: null,
  batch_id: null,
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/products")

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        setProducts(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch products")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Get unique values for filters
  const categories = [...new Set(products.map((p) => p.category))].sort()
  const brands = [...new Set(products.map((p) => p.brand))].sort()

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesBrand = brandFilter === "all" || product.brand === brandFilter

    let matchesStatus = true
    if (statusFilter === "low_stock") {
      matchesStatus = product.inventory_count < 10
    } else if (statusFilter === "expiring_soon") {
      const expirationDate = product.expiration_date ? new Date(product.expiration_date) : null
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      matchesStatus = expirationDate ? expirationDate <= thirtyDaysFromNow : false
    } else if (statusFilter === "high_thc") {
      matchesStatus = (product.thc_percentage || 0) >= 20
    } else if (statusFilter === "low_thc") {
      matchesStatus = (product.thc_percentage || 0) < 15
    }

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingProduct ? "update" : "create"} product`)
      }

      await fetchProducts()
      setIsCreateDialogOpen(false)
      setIsEditDialogOpen(false)
      setFormData(initialFormData)
      setEditingProduct(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      cost: product.cost,
      inventory_count: product.inventory_count,
      thc_percentage: product.thc_percentage,
      expiration_date: product.expiration_date,
      batch_id: product.batch_id,
    })
    setIsEditDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  // Get status badge
  const getStatusBadge = (product: Product) => {
    if (product.inventory_count === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.inventory_count < 10) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Low Stock
        </Badge>
      )
    }

    const expirationDate = product.expiration_date ? new Date(product.expiration_date) : null
    if (expirationDate) {
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiration <= 7) {
        return <Badge variant="destructive">Expires Soon</Badge>
      }
      if (daysUntilExpiration <= 30) {
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Expiring
          </Badge>
        )
      }
    }

    return (
      <Badge variant="default" className="bg-gti-bright-green text-white">
        Active
      </Badge>
    )
  }

  const ProductForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="e.g., BD-1OZ-001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch_id">Batch ID</Label>
          <Input
            id="batch_id"
            value={formData.batch_id || ""}
            onChange={(e) => setFormData({ ...formData, batch_id: e.target.value || null })}
            placeholder="e.g., BATCH-2025-001"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Blue Dream 1oz"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="e.g., Premium Cannabis Co"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flower">Flower</SelectItem>
              <SelectItem value="Edibles">Edibles</SelectItem>
              <SelectItem value="Concentrates">Concentrates</SelectItem>
              <SelectItem value="Vapes">Vapes</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($) *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inventory_count">Inventory Count *</Label>
          <Input
            id="inventory_count"
            type="number"
            min="0"
            value={formData.inventory_count}
            onChange={(e) => setFormData({ ...formData, inventory_count: Number.parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="thc_percentage">THC Percentage (%)</Label>
          <Input
            id="thc_percentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.thc_percentage || ""}
            onChange={(e) => setFormData({ ...formData, thc_percentage: Number.parseFloat(e.target.value) || null })}
            placeholder="e.g., 22.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiration_date">Expiration Date</Label>
          <Input
            id="expiration_date"
            type="date"
            value={formData.expiration_date || ""}
            onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value || null })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateDialogOpen(false)
            setIsEditDialogOpen(false)
            setFormData(initialFormData)
            setEditingProduct(null)
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingProduct ? "Updating..." : "Creating..."}
            </>
          ) : editingProduct ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog and inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog and inventory</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>Add a new product to your catalog</DialogDescription>
                  </DialogHeader>
                  <ProductForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="high_thc">High THC (20%+)</SelectItem>
                <SelectItem value="low_thc">Low THC (&lt;15%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <span>No products found matching your criteria.</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand & Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>THC %</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.sku}</div>
                        {product.batch_id && (
                          <div className="text-xs text-muted-foreground">Batch: {product.batch_id}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.brand}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">${product.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Cost: ${product.cost.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          Margin: {(((product.price - product.cost) / product.price) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.inventory_count} units</div>
                      {product.inventory_count < 10 && <div className="text-xs text-orange-600">Low stock</div>}
                    </TableCell>
                    <TableCell>
                      {product.thc_percentage ? (
                        <div className="font-medium">{product.thc_percentage}%</div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.expiration_date ? (
                        <div>
                          <div className="text-sm">{new Date(product.expiration_date).toLocaleDateString()}</div>
                          {(() => {
                            const daysUntilExpiration = Math.ceil(
                              (new Date(product.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                            )
                            if (daysUntilExpiration <= 7) {
                              return <div className="text-xs text-red-600">{daysUntilExpiration} days left</div>
                            }
                            if (daysUntilExpiration <= 30) {
                              return <div className="text-xs text-orange-600">{daysUntilExpiration} days left</div>
                            }
                            return <div className="text-xs text-muted-foreground">{daysUntilExpiration} days left</div>
                          })()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No expiration</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Price History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id)}>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          <ProductForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}
