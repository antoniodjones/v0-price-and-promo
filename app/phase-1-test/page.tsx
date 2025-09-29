"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Test basic atoms first
import { PriceDisplay, DiscountBadge } from "@/components/atoms"

export default function Phase1TestPage() {
  console.log("[v0] Phase 1 test page loading...")

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Phase 1 Basic Test</h1>
        <p className="text-muted-foreground">Testing core atoms only</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Atoms Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Price Display:</p>
            <PriceDisplay price={29.99} size="lg" />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Discount Badge:</p>
            <DiscountBadge percentage={20} />
          </div>

          <div className="text-green-600 font-medium">✓ Basic atoms are working</div>
        </CardContent>
      </Card>
    </div>
  )
}
