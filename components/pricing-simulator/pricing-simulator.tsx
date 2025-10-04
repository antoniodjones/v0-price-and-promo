"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingDown, Package, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  sku: string
  base_price: number
  brand_id: string
  category_id: string
  brand_name?: string
  category_name?: string
}

interface Customer {
  id: string
  name: string
  license_number: string
}

interface DiscountBreakdown {
  type: string
  name: string
  amount: number
  percentage: number
}

interface PricingResult {
  basePrice: number
  finalPrice: number
  totalDiscount: number
  discountPercentage: number
  discounts: DiscountBreakdown[]
}

export function PricingSimulator() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [result, setResult] = useState<PricingResult | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, customersRes] = await Promise.all([fetch("/api/products"), fetch("/api/customers")])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          if (productsData.success) {
            setProducts(productsData.data)
          }
        }

        if (customersRes.ok) {
          const customersData = await customersRes.json()
          if (customersData.success) {
            setCustomers(customersData.data)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCalculate = async () => {
    if (!selectedProduct || !selectedCustomer) return

    setCalculating(true)
    try {
      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          customerId: selectedCustomer,
          quantity,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setResult(data.data)
        }
      }
    } catch (error) {
      console.error("[v0] Error calculating price:", error)
    } finally {
      setCalculating(false)
    }
  }

  const selectedProductData = products.find((p) => p.id === selectedProduct)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Simulator
          </CardTitle>
          <CardDescription>Test pricing calculations with different products and customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Pricing Simulator
        </CardTitle>
        <CardDescription>Test pricing calculations with different products and customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Select Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ${product.base_price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProductData && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>SKU: {selectedProductData.sku}</p>
                <p>Brand: {selectedProductData.brand_name || "Unknown"}</p>
                <p>Category: {selectedProductData.category_name || "Unknown"}</p>
              </div>
            )}
          </div>

          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Select Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger id="customer">
                <SelectValue placeholder="Choose a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {customers.find((c) => c.id === selectedCustomer) && (
              <div className="text-sm text-muted-foreground">
                <p>License: {customers.find((c) => c.id === selectedCustomer)?.license_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="max-w-xs"
          />
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          disabled={!selectedProduct || !selectedCustomer || calculating}
          className="w-full bg-gti-dark-green hover:bg-gti-medium-green"
        >
          {calculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Price
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pricing Breakdown</h3>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Base Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${result.basePrice.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Per unit × {quantity}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Discount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gti-bright-green">-${result.totalDiscount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">{result.discountPercentage.toFixed(1)}% off</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Final Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${result.finalPrice.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total for {quantity} units</p>
                  </CardContent>
                </Card>
              </div>

              {/* Discount Details */}
              {result.discounts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Applied Discounts
                  </h4>
                  <div className="space-y-2">
                    {result.discounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{discount.type}</Badge>
                          <span className="text-sm">{discount.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gti-bright-green">-${discount.amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{discount.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.discounts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No discounts applied to this combination</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
