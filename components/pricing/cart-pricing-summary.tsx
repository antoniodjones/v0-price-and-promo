"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingDown, ShoppingCart } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface CartItem {
  productId: string
  productName: string
  quantity: number
  basePrice: number
}

interface CartPricingSummaryProps {
  items: CartItem[]
  customerId?: string
}

interface CartPricing {
  items: Array<{
    productId: string
    productName: string
    quantity: number
    basePrice: number
    finalPrice: number
    discount: number
    appliedRules: string[]
  }>
  subtotal: number
  totalDiscount: number
  finalTotal: number
}

export function CartPricingSummary({ items, customerId }: CartPricingSummaryProps) {
  const [pricing, setPricing] = useState<CartPricing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length > 0) {
      fetchCartPricing()
    }
  }, [items, customerId])

  const fetchCartPricing = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pricing/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setPricing(result.data)
      }
    } catch (err) {
      console.error("[v0] Error fetching cart pricing:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!pricing || items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Your cart is empty</div>
        </CardContent>
      </Card>
    )
  }

  const hasSavings = pricing.totalDiscount > 0
  const savingsPercentage = (pricing.totalDiscount / pricing.subtotal) * 100

  return (
    <Card className={hasSavings ? "border-gti-bright-green/30" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart Summary
          </CardTitle>
          {hasSavings && (
            <Badge className="bg-gti-bright-green text-white">
              <TrendingDown className="h-3 w-3 mr-1" />
              Save {savingsPercentage.toFixed(1)}%
            </Badge>
          )}
        </div>
        <CardDescription>{items.length} item(s) in cart</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item List */}
        <div className="space-y-3">
          {pricing.items.map((item) => (
            <div key={item.productId} className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.productName}</div>
                  <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="text-right">
                  {item.discount > 0 ? (
                    <>
                      <div className="text-sm line-through text-muted-foreground">${item.basePrice.toFixed(2)}</div>
                      <div className="text-sm font-semibold text-gti-bright-green">${item.finalPrice.toFixed(2)}</div>
                    </>
                  ) : (
                    <div className="text-sm font-semibold">${item.finalPrice.toFixed(2)}</div>
                  )}
                </div>
              </div>
              {item.appliedRules.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {item.appliedRules.map((rule, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] h-5">
                      {rule}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className={hasSavings ? "line-through text-muted-foreground" : "font-semibold"}>
              ${pricing.subtotal.toFixed(2)}
            </span>
          </div>

          {hasSavings && (
            <div className="flex items-center justify-between text-sm text-gti-bright-green font-medium">
              <span>Total Savings</span>
              <span>-${pricing.totalDiscount.toFixed(2)}</span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className={hasSavings ? "text-gti-bright-green" : ""}>${pricing.finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {hasSavings && (
          <div className="pt-3 border-t bg-green-50/50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
            <div className="text-xs text-center text-green-800">
              You're saving <span className="font-bold">${pricing.totalDiscount.toFixed(2)}</span> with volume and tier
              pricing!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
