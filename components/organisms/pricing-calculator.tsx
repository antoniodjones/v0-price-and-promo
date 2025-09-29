"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PricingCard } from "@/components/molecules"
import { Calculator } from "lucide-react"

interface PricingCalculatorProps {
  onCalculate?: (result: any) => void
}

export function PricingCalculator({ onCalculate }: PricingCalculatorProps) {
  const [productPrice, setProductPrice] = useState("")
  const [customerTier, setCustomerTier] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleCalculate = () => {
    // Mock calculation - in real app this would use the pricing engine
    const originalPrice = Number.parseFloat(productPrice)
    const discountPercentage = customerTier === "platinum" ? 15 : customerTier === "gold" ? 10 : 5
    const finalPrice = originalPrice * (1 - discountPercentage / 100)

    const calculationResult = {
      originalPrice,
      finalPrice,
      discountPercentage,
      appliedRules: [`${customerTier} tier discount`],
      savings: originalPrice - finalPrice,
    }

    setResult(calculationResult)
    onCalculate?.(calculationResult)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Product Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Customer Tier</Label>
            <Select value={customerTier} onValueChange={setCustomerTier}>
              <SelectTrigger>
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCalculate} disabled={!productPrice || !customerTier} className="w-full">
            Calculate Price
          </Button>
        </CardContent>
      </Card>

      {result && (
        <PricingCard
          originalPrice={result.originalPrice}
          finalPrice={result.finalPrice}
          discountPercentage={result.discountPercentage}
          appliedRules={result.appliedRules}
        />
      )}
    </div>
  )
}
