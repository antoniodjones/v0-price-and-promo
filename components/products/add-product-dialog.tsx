"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/lib/hooks/use-products"
import type { ProductEntity } from "@/lib/domain/entities/product"

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductAdded: () => void
}

export function AddProductDialog({ open, onOpenChange, onProductAdded }: AddProductDialogProps) {
  const { createProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    price: "",
    cost: "",
    inventoryCount: "",
    batchId: "",
    thcPercentage: "",
    expirationDate: "",
  })

  const categories = ["Flower", "Edibles", "Concentrates", "Vapes", "Topicals", "Accessories"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData: Omit<ProductEntity, "id"> = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brand,
        price: Number.parseFloat(formData.price),
        cost: formData.cost ? Number.parseFloat(formData.cost) : undefined,
        inventoryCount: formData.inventoryCount ? Number.parseInt(formData.inventoryCount) : undefined,
        batchId: formData.batchId || undefined,
        thcPercentage: formData.thcPercentage ? Number.parseFloat(formData.thcPercentage) : undefined,
        expirationDate: formData.expirationDate || undefined,
      }

      await createProduct(productData)
      onProductAdded()
      onOpenChange(false)

      // Reset form
      setFormData({
        name: "",
        sku: "",
        category: "",
        brand: "",
        price: "",
        cost: "",
        inventoryCount: "",
        batchId: "",
        thcPercentage: "",
        expirationDate: "",
      })
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Add a new product to your cannabis inventory catalog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Blue Dream"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="e.g., BD-001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="e.g., Premium Cannabis Co."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inventoryCount">Inventory Count</Label>
              <Input
                id="inventoryCount"
                type="number"
                value={formData.inventoryCount}
                onChange={(e) => handleInputChange("inventoryCount", e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                placeholder="e.g., BATCH-2024-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thcPercentage">THC Content (%)</Label>
              <Input
                id="thcPercentage"
                type="number"
                step="0.1"
                max="35"
                value={formData.thcPercentage}
                onChange={(e) => handleInputChange("thcPercentage", e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
