"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Package, Leaf, Cookie, Droplets } from "lucide-react"

const bundleProductsSchema = z.object({
  products: z.array(z.any()).optional(),
  categories: z.array(z.string()).optional(),
})

type BundleProductsFormData = z.infer<typeof bundleProductsSchema>

interface BundleProductsStepProps {
  data: any
  onChange: (data: any) => void
}

const categories = [
  { id: "Flower", name: "Flower", icon: Leaf, count: 0 },
  { id: "Edibles", name: "Edibles", icon: Cookie, count: 0 },
  { id: "Concentrates", name: "Concentrates", icon: Droplets, count: 0 },
  { id: "Vapes", name: "Vapes", icon: Package, count: 0 },
]

export function BundleProductsStep({ data, onChange }: BundleProductsStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const form = useForm<BundleProductsFormData>({
    resolver: zodResolver(bundleProductsSchema),
    defaultValues: {
      products: data.products || [],
      categories: data.categories || [],
    },
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      onChange(values)
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  const selectedProducts = form.watch("products") || []
  const selectedCategories = form.watch("categories") || []

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch("/api/products")

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        const contentType = response.headers.get("content-type")

        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await response.text()
          throw new Error(`Expected JSON response, got ${contentType}. Response: ${responseText.substring(0, 200)}`)
        }

        const data = await response.json()

        let productsArray = []
        if (data.data && Array.isArray(data.data)) {
          productsArray = data.data
        } else if (data.products && Array.isArray(data.products)) {
          productsArray = data.products
        } else if (Array.isArray(data)) {
          productsArray = data
        } else {
          throw new Error("API returned unexpected data structure")
        }

        setProducts(productsArray)

        const categoryCounts = productsArray.reduce((acc: any, product: any) => {
          const category = product.category
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {})

        categories.forEach((cat) => {
          cat.count = categoryCounts[cat.id] || 0
        })
      } catch (err) {
        console.error("[v0] BundleProductsStep: Error fetching products:", err)
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(`Failed to load products: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleProductToggle = (product: any) => {
    const isSelected = selectedProducts.some((p: any) => p.id === product.id)
    const newProducts = isSelected
      ? selectedProducts.filter((p: any) => p.id !== product.id)
      : [...selectedProducts, product]

    form.setValue("products", newProducts)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId)
    const newCategories = isSelected
      ? selectedCategories.filter((c: string) => c !== categoryId)
      : [...selectedCategories, categoryId]

    form.setValue("categories", newCategories)
  }

  const removeProduct = (productId: number) => {
    const newProducts = selectedProducts.filter((p: any) => p.id !== productId)
    form.setValue("products", newProducts)
  }

  const removeCategory = (categoryId: string) => {
    const newCategories = selectedCategories.filter((c: string) => c !== categoryId)
    form.setValue("categories", newCategories)
  }

  return (
    <Form {...form}>
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
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading categories...</div>
            ) : (
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
            )}
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

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading products...</div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">⚠️ Error Loading Products</div>
                <div className="text-sm text-muted-foreground mb-4">{error}</div>
                <Button variant="outline" onClick={() => window.location.reload()} className="text-sm">
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? `No products found matching "${searchTerm}"` : "No products available"}
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredProducts.map((product: any) => (
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
                              ${product.price} • {product.thc_percentage}% THC • {product.sku}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
    </Form>
  )
}
