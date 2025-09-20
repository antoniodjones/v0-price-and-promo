"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, TrendingDown, AlertCircle, Check, X, Info } from "lucide-react"

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

// Mock data for demonstration
const mockItems: PricingItem[] = [
  {
    id: "1",
    productName: "Blue Dream 1oz",
    sku: "BD-1OZ-001",
    category: "Flower",
    brand: "Premium Cannabis Co",
    basePrice: 240.0,
    quantity: 2,
    batchNumber: "BH-2025-0894",
    thcPercentage: 12.3,
    expirationDate: "2025-11-25",
  },
  {
    id: "2",
    productName: "Incredibles Gummies 500mg",
    sku: "INC-GUM-500",
    category: "Edibles",
    brand: "Incredibles",
    basePrice: 60.0,
    quantity: 5,
  },
  {
    id: "3",
    productName: "Wedding Cake 1oz",
    sku: "WC-1OZ-001",
    category: "Flower",
    brand: "Rise",
    basePrice: 250.0,
    quantity: 1,
    batchNumber: "BH-2025-0895",
    thcPercentage: 19.2,
    expirationDate: "2025-12-15",
  },
]

const mockCustomer = {
  id: "cust-1",
  name: "Dispensary ABC",
  tier: "A",
}

export function PricingCalculator() {
  const [items] = useState<PricingItem[]>(mockItems)
  const [results, setResults] = useState<PricingResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateBestDeals = async () => {
    setIsCalculating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const calculatedResults: PricingResult[] = items.map((item) => {
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
    })

    setResults(calculatedResults)
    setIsCalculating(false)
  }

  const getApplicableDiscounts = (item: PricingItem): DiscountRule[] => {
    const discounts: DiscountRule[] = []

    // Customer discount (8% for Premium Cannabis Co for Dispensary ABC)
    if (item.brand === "Premium Cannabis Co") {
      discounts.push({
        id: "customer-1",
        name: "Premium Cannabis - Dispensary ABC 8%",
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
      const daysToExpiration = Math.ceil(
        (new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )
      if (daysToExpiration <= 30) {
        discounts.push({
          id: "expiration-1",
          name: "30-Day Expiration Auto Discount",
          type: "expiration",
          discountType: "percentage",
          discountValue: 20,
          priority: 1, // Higher priority
          reason: `${daysToExpiration} days to expiration`,
          applicable: true,
        })
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
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
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
  }

  const findBestDiscount = (discounts: DiscountRule[], basePrice: number): DiscountRule | null => {
    if (discounts.length === 0) return null

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
  }

  const calculateFinalPrice = (basePrice: number, bestDiscount: DiscountRule | null): number => {
    if (!bestDiscount) return basePrice

    if (bestDiscount.discountType === "percentage") {
      return basePrice * (1 - bestDiscount.discountValue / 100)
    } else {
      return Math.max(0, basePrice - bestDiscount.discountValue)
    }
  }

  const generateExplanation = (applicableDiscounts: DiscountRule[], bestDiscount: DiscountRule | null): string => {
    if (applicableDiscounts.length === 0) {
      return "No discounts available for this item"
    }

    if (applicableDiscounts.length === 1) {
      return `Applied: ${bestDiscount?.name} - Only available discount`
    }

    const otherDiscounts = applicableDiscounts.filter((d) => d.id !== bestDiscount?.id)
    return `Applied: ${bestDiscount?.name} - Best of ${applicableDiscounts.length} available discounts`
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

  const orderTotal = results.reduce((sum, result) => sum + result.finalPrice * result.item.quantity, 0)
  const totalSavings = results.reduce((sum, result) => sum + result.totalSavings, 0)
  const originalTotal = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0)

  return (
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
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category/Brand</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Batch Info</TableHead>
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
                      <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {item.batchNumber && (
                          <div className="text-sm">
                            <p>{item.batchNumber}</p>
                            {item.thcPercentage && <p className="text-muted-foreground">{item.thcPercentage}% THC</p>}
                            {item.expirationDate && (
                              <p className="text-muted-foreground">
                                Exp: {new Date(item.expirationDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateBestDeals}
              disabled={isCalculating}
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
                      {result.item.quantity} × ${result.item.basePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gti-dark-green">
                      ${(result.finalPrice * result.item.quantity).toFixed(2)}
                    </p>
                    {result.totalSavings > 0 && (
                      <p className="text-sm text-gti-bright-green">Save ${result.totalSavings.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {/* Available Discounts */}
                {result.applicableDiscounts.length > 0 && (
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
                          No stacking policy: Only the best discount ({result.bestDiscount.name}) is applied to ensure
                          maximum savings.
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
                    Only one discount is applied per item to ensure you always receive the best available deal. Multiple
                    discounts are never combined or stacked.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
