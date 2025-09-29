"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, TrendingDown, AlertCircle, Check, X, Info, Plus, Minus, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ErrorBoundary } from "@/components/error-boundary"

interface PricingItem {
  id: string
  productName: string
  sku: string
  category: string
  brand: string
  basePrice: number
  quantity: number
  batchNumber?: string
  thcPercentage?: number
  expirationDate?: string
  inventoryCount?: number
}

interface DiscountRule {
  id: string
  name: string
  type: "customer" | "expiration" | "thc" | "volume" | "tiered"
  discountType: "percentage" | "dollar"
  discountValue: number
  priority: number
  reason: string
  applicable: boolean
}

interface PricingResult {
  item: PricingItem
  applicableDiscounts: DiscountRule[]
  bestDiscount: DiscountRule | null
  finalPrice: number
  totalSavings: number
  explanation: string
}

const mockCustomer = {
  id: "cust-1",
  name: "Dispensary ABC",
  tier: "A",
}

export function PricingCalculator() {
  const [items, setItems] = useState<PricingItem[]>([])
  const [results, setResults] = useState<PricingResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("[v0] PricingCalculator: Starting to fetch products")
        setLoading(true)
        setError(null)

        const response = await fetch("/api/products-simple")
        console.log("[v0] PricingCalculator: API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] PricingCalculator: API response not ok:", response.status, response.statusText, errorText)
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] PricingCalculator: API response data:", data)

        if (!data || typeof data !== "object") {
          throw new Error("Invalid API response format")
        }

        const productsArray = Array.isArray(data.products) ? data.products : []
        console.log("[v0] PricingCalculator: Products array:", productsArray)
        setProducts(productsArray)

        if (productsArray && productsArray.length > 0) {
          console.log("[v0] PricingCalculator: Creating initial items from products")
          const initialItems = productsArray
            .slice(0, 3)
            .map((product: any, index: number) => {
              // Validate product data
              if (!product || typeof product !== "object") {
                console.warn("[v0] PricingCalculator: Invalid product data:", product)
                return null
              }

              return {
                id: String(product.id || `product-${index}`),
                productName: String(product.name || "Unknown Product"),
                sku: String(product.sku || `SKU-${index}`),
                category: String(product.category || "Unknown"),
                brand: String(product.brand || "Unknown Brand"),
                basePrice: Number(product.basePrice) || 0,
                quantity: index === 0 ? 2 : 1,
                batchNumber: product.batchId ? String(product.batchId) : undefined,
                thcPercentage: product.thcPercentage ? Number(product.thcPercentage) : undefined,
                expirationDate: product.expirationDate ? String(product.expirationDate) : undefined,
                inventoryCount: 100,
              }
            })
            .filter(Boolean) as PricingItem[]

          console.log("[v0] PricingCalculator: Initial items created:", initialItems)
          setItems(initialItems)
        }
      } catch (err) {
        console.error("[v0] PricingCalculator: Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = (product: any) => {
    try {
      console.log("[v0] PricingCalculator: Adding product:", product)

      if (!product || typeof product !== "object") {
        console.error("[v0] PricingCalculator: Invalid product data for adding:", product)
        return
      }

      const newItem: PricingItem = {
        id: `${product.id || Date.now()}-${Date.now()}`,
        productName: String(product.name || "Unknown Product"),
        sku: String(product.sku || "Unknown SKU"),
        category: String(product.category || "Unknown"),
        brand: String(product.brand || "Unknown Brand"),
        basePrice: Number(product.basePrice) || 0,
        quantity: 1,
        batchNumber: product.batchId ? String(product.batchId) : undefined,
        thcPercentage: product.thcPercentage ? Number(product.thcPercentage) : undefined,
        expirationDate: product.expirationDate ? String(product.expirationDate) : undefined,
        inventoryCount: 100,
      }
      setItems((prevItems) => [...prevItems, newItem])
    } catch (err) {
      console.error("[v0] PricingCalculator: Error adding product:", err)
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return
      setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (err) {
      console.error("[v0] PricingCalculator: Error updating quantity:", err)
    }
  }

  const removeItem = (itemId: string) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error("[v0] PricingCalculator: Error removing item:", err)
    }
  }

  const calculateBestDeals = async () => {
    try {
      setIsCalculating(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const calculatedResults: PricingResult[] = items.map((item) => {
        try {
          // Get all applicable discounts for this item
          const applicableDiscounts = getApplicableDiscounts(item)

          // Find the best discount (highest savings)
          const bestDiscount = findBestDiscount(applicableDiscounts, item.basePrice)

          // Calculate final price
          const finalPrice = calculateFinalPrice(item.basePrice, bestDiscount)
          const totalSavings = (item.basePrice - finalPrice) * item.quantity

          return {
            item,
            applicableDiscounts,
            bestDiscount,
            finalPrice,
            totalSavings,
            explanation: generateExplanation(applicableDiscounts, bestDiscount),
          }
        } catch (err) {
          console.error("[v0] PricingCalculator: Error calculating for item:", item.id, err)
          // Return a safe fallback result
          return {
            item,
            applicableDiscounts: [],
            bestDiscount: null,
            finalPrice: item.basePrice,
            totalSavings: 0,
            explanation: "Error calculating discounts for this item",
          }
        }
      })

      setResults(calculatedResults)
    } catch (err) {
      console.error("[v0] PricingCalculator: Error in calculateBestDeals:", err)
      setError("Failed to calculate pricing. Please try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const getApplicableDiscounts = (item: PricingItem): DiscountRule[] => {
    try {
      const discounts: DiscountRule[] = []

      // Customer discount (8% for Premium Buds and Green Valley for Dispensary ABC)
      if (item.brand === "Premium Buds" || item.brand === "Green Valley") {
        discounts.push({
          id: "customer-1",
          name: `${item.brand} - Dispensary ABC 8%`,
          type: "customer",
          discountType: "percentage",
          discountValue: 8,
          priority: 3,
          reason: "Customer-specific brand discount",
          applicable: true,
        })
      }

      // Expiration discount (20% for products within 30 days)
      if (item.expirationDate) {
        try {
          const daysToExpiration = Math.ceil(
            (new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )
          if (daysToExpiration <= 30 && daysToExpiration > 0) {
            discounts.push({
              id: "expiration-1",
              name: "30-Day Expiration Auto Discount",
              type: "expiration",
              discountType: "percentage",
              discountValue: 20,
              priority: 1,
              reason: `${daysToExpiration} days to expiration`,
              applicable: true,
            })
          }
        } catch (dateErr) {
          console.warn("[v0] PricingCalculator: Invalid expiration date:", item.expirationDate)
        }
      }

      // THC discount (10% for flower with THC below 15%)
      if (item.category === "Flower" && item.thcPercentage && item.thcPercentage < 15) {
        discounts.push({
          id: "thc-1",
          name: "Low THC Flower Discount",
          type: "thc",
          discountType: "percentage",
          discountValue: 10,
          priority: 2,
          reason: `${item.thcPercentage}% THC (below 15% threshold)`,
          applicable: true,
        })
      }

      // Volume discount (5% for orders over 3 units)
      const totalQuantity = items.reduce((sum, i) => sum + (i.quantity || 0), 0)
      if (totalQuantity > 3) {
        discounts.push({
          id: "volume-1",
          name: "Volume Discount 5%",
          type: "volume",
          discountType: "percentage",
          discountValue: 5,
          priority: 4,
          reason: `${totalQuantity} total units (over 3 unit threshold)`,
          applicable: true,
        })
      }

      return discounts
    } catch (err) {
      console.error("[v0] PricingCalculator: Error getting applicable discounts:", err)
      return []
    }
  }

  const findBestDiscount = (discounts: DiscountRule[], basePrice: number): DiscountRule | null => {
    try {
      if (!Array.isArray(discounts) || discounts.length === 0) return null
      if (typeof basePrice !== "number" || basePrice <= 0) return null

      // Calculate actual savings for each discount
      const discountsWithSavings = discounts.map((discount) => ({
        ...discount,
        actualSavings:
          discount.discountType === "percentage"
            ? (basePrice * discount.discountValue) / 100
            : Math.min(discount.discountValue, basePrice),
      }))

      // Sort by actual savings (descending), then by priority (ascending - lower number = higher priority)
      discountsWithSavings.sort((a, b) => {
        if (a.actualSavings !== b.actualSavings) {
          return b.actualSavings - a.actualSavings
        }
        return a.priority - b.priority
      })

      return discountsWithSavings[0]
    } catch (err) {
      console.error("[v0] PricingCalculator: Error finding best discount:", err)
      return null
    }
  }

  const calculateFinalPrice = (basePrice: number, bestDiscount: DiscountRule | null): number => {
    try {
      if (!bestDiscount || typeof basePrice !== "number" || basePrice <= 0) return basePrice

      if (bestDiscount.discountType === "percentage") {
        return Math.max(0, basePrice * (1 - bestDiscount.discountValue / 100))
      } else {
        return Math.max(0, basePrice - bestDiscount.discountValue)
      }
    } catch (err) {
      console.error("[v0] PricingCalculator: Error calculating final price:", err)
      return basePrice
    }
  }

  const generateExplanation = (applicableDiscounts: DiscountRule[], bestDiscount: DiscountRule | null): string => {
    try {
      if (!Array.isArray(applicableDiscounts) || applicableDiscounts.length === 0) {
        return "No discounts available for this item"
      }

      if (applicableDiscounts.length === 1) {
        return `Applied: ${bestDiscount?.name || "Unknown discount"} - Only available discount`
      }

      return `Applied: ${bestDiscount?.name || "Unknown discount"} - Best of ${applicableDiscounts.length} available discounts`
    } catch (err) {
      console.error("[v0] PricingCalculator: Error generating explanation:", err)
      return "Error generating discount explanation"
    }
  }

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "expiration":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "thc":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "volume":
        return "bg-green-100 text-green-800 border-green-200"
      case "tiered":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const orderTotal = results.reduce((sum, result) => {
    try {
      return sum + (result.finalPrice || 0) * (result.item.quantity || 0)
    } catch {
      return sum
    }
  }, 0)

  const totalSavings = results.reduce((sum, result) => {
    try {
      return sum + (result.totalSavings || 0)
    } catch {
      return sum
    }
  }, 0)

  const originalTotal = items.reduce((sum, item) => {
    try {
      return sum + (item.basePrice || 0) * (item.quantity || 0)
    } catch {
      return sum
    }
  }, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground">Loading products...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Pricing Calculator
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-gti-bright-green" />
              <span>Best Deal Calculator</span>
            </CardTitle>
            <CardDescription>
              Calculate the best available discount for each item with no-stacking policy enforcement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="flex items-center justify-between p-3 bg-gti-light-green/10 rounded-lg">
                <div>
                  <p className="font-medium">Customer: {mockCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">Tier {mockCustomer.tier} Customer</p>
                </div>
                <Badge className="bg-gti-bright-green text-white">Active Customer</Badge>
              </div>

              {/* Items Table */}
              {items.length > 0 && (
                <ErrorBoundary>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category/Brand</TableHead>
                          <TableHead>Base Price</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Batch Info</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-muted-foreground">{item.sku}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{item.category}</p>
                                <p className="text-sm text-muted-foreground">{item.brand}</p>
                              </div>
                            </TableCell>
                            <TableCell>${(item.basePrice || 0).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.inventoryCount ? item.quantity >= item.inventoryCount : false}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.batchNumber && (
                                <div className="text-sm">
                                  <p>{item.batchNumber}</p>
                                  {item.thcPercentage && (
                                    <p className="text-muted-foreground">{item.thcPercentage}% THC</p>
                                  )}
                                  {item.expirationDate && (
                                    <p className="text-muted-foreground">
                                      Exp: {new Date(item.expirationDate).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ErrorBoundary>
              )}

              {/* Add Product Section */}
              {Array.isArray(products) && products.length > 0 && (
                <ErrorBoundary>
                  <div className="space-y-2">
                    <Label>Add Products from Inventory</Label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {products
                        .filter((product: any) => product && !items.some((item) => item.sku === product.sku))
                        .map((product: any) => (
                          <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{product.name || "Unknown Product"}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.sku || "Unknown SKU"} • ${(product.basePrice || 0).toFixed(2)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => addProduct(product)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </ErrorBoundary>
              )}

              {/* Calculate Button */}
              <Button
                onClick={calculateBestDeals}
                disabled={isCalculating || items.length === 0}
                className="w-full bg-gti-bright-green hover:bg-gti-medium-green text-white"
              >
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating Best Deals..." : "Calculate Best Deals"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <ErrorBoundary>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-gti-bright-green" />
                  <span>Best Deal Results</span>
                </CardTitle>
                <CardDescription>Optimal pricing with no-stacking policy applied</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div key={result.item.id} className="space-y-4">
                    {index > 0 && <Separator />}

                    {/* Item Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{result.item.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.item.quantity} × ${(result.item.basePrice || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gti-dark-green">
                          ${((result.finalPrice || 0) * (result.item.quantity || 0)).toFixed(2)}
                        </p>
                        {(result.totalSavings || 0) > 0 && (
                          <p className="text-sm text-gti-bright-green">Save ${(result.totalSavings || 0).toFixed(2)}</p>
                        )}
                      </div>
                    </div>

                    {/* Available Discounts */}
                    {Array.isArray(result.applicableDiscounts) && result.applicableDiscounts.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Available Discounts:</p>
                        <div className="grid gap-2">
                          {result.applicableDiscounts.map((discount) => (
                            <div
                              key={discount.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                discount.id === result.bestDiscount?.id
                                  ? "bg-gti-light-green/20 border-gti-bright-green"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {discount.id === result.bestDiscount?.id ? (
                                  <Check className="h-4 w-4 text-gti-bright-green" />
                                ) : (
                                  <X className="h-4 w-4 text-gray-400" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">{discount.name}</p>
                                  <p className="text-xs text-muted-foreground">{discount.reason}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className={getDiscountTypeColor(discount.type)}>
                                  {discount.type}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {discount.discountType === "percentage"
                                    ? `${discount.discountValue}%`
                                    : `$${discount.discountValue}`}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Best Deal Logic Applied</p>
                          <p className="text-sm text-blue-700">{result.explanation}</p>
                          {result.bestDiscount && (
                            <p className="text-xs text-blue-600 mt-1">
                              No stacking policy: Only the best discount ({result.bestDiscount.name}) is applied to
                              ensure maximum savings.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Original Total:</span>
                      <span>${originalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gti-bright-green">
                      <span>Total Savings:</span>
                      <span>-${totalSavings.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Final Total:</span>
                      <span className="text-gti-dark-green">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* No Stacking Policy Notice */}
                <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-gti-dark-green mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gti-dark-green">No-Stacking Policy</p>
                      <p className="text-sm text-muted-foreground">
                        Only one discount is applied per item to ensure you always receive the best available deal.
                        Multiple discounts are never combined or stacked.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  )
}
