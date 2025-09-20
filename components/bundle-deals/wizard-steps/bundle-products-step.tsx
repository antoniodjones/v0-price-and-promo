"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Package, Leaf, Cookie, Droplets } from "lucide-react"

interface BundleProductsStepProps {
  data: any
  onChange: (data: any) => void
}

const categories = [
  { id: "flower", name: "Flower", icon: Leaf, count: 45 },
  { id: "edibles", name: "Edibles", icon: Cookie, count: 32 },
  { id: "concentrates", name: "Concentrates", icon: Droplets, count: 28 },
  { id: "vapes", name: "Vapes", icon: Package, count: 19 },
]

const sampleProducts = [
  { id: 1, name: "Blue Dream 1/8", category: "flower", price: 35.0, thc: 22.5 },
  { id: 2, name: "OG Kush 1/4", category: "flower", price: 65.0, thc: 24.1 },
  { id: 3, name: "Sour Diesel Pre-Roll", category: "flower", price: 12.0, thc: 19.8 },
  { id: 4, name: "Gummy Bears 10mg", category: "edibles", price: 25.0, thc: 10 },
  { id: 5, name: "Chocolate Bar 100mg", category: "edibles", price: 45.0, thc: 100 },
  { id: 6, name: "Live Resin Cart", category: "vapes", price: 55.0, thc: 85.2 },
  { id: 7, name: "Shatter 1g", category: "concentrates", price: 40.0, thc: 78.5 },
]

export function BundleProductsStep({ data, onChange }: BundleProductsStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState(data.products || [])
  const [selectedCategories, setSelectedCategories] = useState(data.categories || [])

  const filteredProducts = sampleProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleProductToggle = (product: any) => {
    const isSelected = selectedProducts.some((p: any) => p.id === product.id)
    let newProducts

    if (isSelected) {
      newProducts = selectedProducts.filter((p: any) => p.id !== product.id)
    } else {
      newProducts = [...selectedProducts, product]
    }

    setSelectedProducts(newProducts)
    onChange({ products: newProducts })
  }

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId)
    let newCategories

    if (isSelected) {
      newCategories = selectedCategories.filter((c: string) => c !== categoryId)
    } else {
      newCategories = [...selectedCategories, categoryId]
    }

    setSelectedCategories(newCategories)
    onChange({ categories: newCategories })
  }

  const removeProduct = (productId: number) => {
    const newProducts = selectedProducts.filter((p: any) => p.id !== productId)
    setSelectedProducts(newProducts)
    onChange({ products: newProducts })
  }

  const removeCategory = (categoryId: string) => {
    const newCategories = selectedCategories.filter((c: string) => c !== categoryId)
    setSelectedCategories(newCategories)
    onChange({ categories: newCategories })
  }

  return (
    <div className="space-y-6">
      {/* Bundle Type Context */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">
          {data.bundleType === "fixed" && "Select Specific Products"}
          {data.bundleType === "category" && "Select Product Categories"}
          {data.bundleType === "mix-match" && "Select Categories for Mix & Match"}
          {data.bundleType === "tiered" && "Select Products or Categories"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {data.bundleType === "fixed" && "Choose the exact products that will be bundled together"}
          {data.bundleType === "category" && "Choose categories where customers can select products"}
          {data.bundleType === "mix-match" && "Choose categories customers can mix and match from"}
          {data.bundleType === "tiered" && "Choose products or categories for tiered pricing"}
        </p>
      </div>

      {/* Category Selection */}
      {(data.bundleType === "category" || data.bundleType === "mix-match" || data.bundleType === "tiered") && (
        <div className="space-y-4">
          <Label>Product Categories</Label>
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategories.includes(category.id) ? "ring-2 ring-gti-bright-green" : ""
                }`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gti-light-green rounded-lg">
                        <category.icon className="w-5 h-5 text-gti-dark-green" />
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.count} products</div>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Product Selection */}
      {(data.bundleType === "fixed" || data.bundleType === "tiered") && (
        <div className="space-y-4">
          <Label>Specific Products</Label>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all hover:shadow-sm ${
                  selectedProducts.some((p: any) => p.id === product.id) ? "ring-2 ring-gti-bright-green" : ""
                }`}
                onClick={() => handleProductToggle(product)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedProducts.some((p: any) => p.id === product.id)}
                        onChange={() => handleProductToggle(product)}
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${product.price} • {product.thc}% THC
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{categories.find((c) => c.id === product.category)?.name}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Items Summary */}
      {(selectedProducts.length > 0 || selectedCategories.length > 0) && (
        <div className="space-y-4">
          <Label>Selected Items</Label>

          {selectedCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Categories:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId)
                  return (
                    <Badge key={categoryId} variant="secondary" className="gap-1">
                      {category?.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => removeCategory(categoryId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Products:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((product: any) => (
                  <Badge key={product.id} variant="secondary" className="gap-1">
                    {product.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
