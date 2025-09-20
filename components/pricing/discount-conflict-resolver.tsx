"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, Info } from "lucide-react"

interface DiscountConflict {
  id: string
  productName: string
  sku: string
  basePrice: number
  conflictingDiscounts: {
    id: string
    name: string
    type: string
    value: number
    valueType: "percentage" | "dollar"
    priority: number
    savings: number
    reason: string
  }[]
  recommendedDiscount: string
  resolution: "auto" | "manual" | "pending"
}

// Mock data for discount conflicts
const mockConflicts: DiscountConflict[] = [
  {
    id: "conflict-1",
    productName: "Blue Dream 1oz",
    sku: "BD-1OZ-001",
    basePrice: 240.0,
    conflictingDiscounts: [
      {
        id: "customer-1",
        name: "Premium Cannabis - Dispensary ABC 8%",
        type: "Customer",
        value: 8,
        valueType: "percentage",
        priority: 3,
        savings: 19.2,
        reason: "Customer-specific brand discount",
      },
      {
        id: "expiration-1",
        name: "30-Day Expiration Auto Discount",
        type: "Expiration",
        value: 20,
        valueType: "percentage",
        priority: 1,
        savings: 48.0,
        reason: "25 days to expiration",
      },
      {
        id: "thc-1",
        name: "Low THC Flower Discount",
        type: "THC",
        value: 10,
        valueType: "percentage",
        priority: 2,
        savings: 24.0,
        reason: "12.3% THC (below 15% threshold)",
      },
    ],
    recommendedDiscount: "expiration-1",
    resolution: "auto",
  },
  {
    id: "conflict-2",
    productName: "Wedding Cake 1oz",
    sku: "WC-1OZ-001",
    basePrice: 250.0,
    conflictingDiscounts: [
      {
        id: "volume-1",
        name: "Volume Discount 5%",
        type: "Volume",
        value: 5,
        valueType: "percentage",
        priority: 4,
        savings: 12.5,
        reason: "8 total units (over 3 unit threshold)",
      },
      {
        id: "tiered-1",
        name: "A-Tier Customer 6%",
        type: "Tiered",
        value: 6,
        valueType: "percentage",
        priority: 3,
        savings: 15.0,
        reason: "A-tier customer pricing",
      },
    ],
    recommendedDiscount: "tiered-1",
    resolution: "auto",
  },
]

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
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

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return "text-red-600 font-bold"
    case 2:
      return "text-orange-600 font-semibold"
    case 3:
      return "text-yellow-600 font-medium"
    default:
      return "text-gray-600"
  }
}

export function DiscountConflictResolver() {
  const [conflicts] = useState<DiscountConflict[]>(mockConflicts)
  const [resolvedConflicts, setResolvedConflicts] = useState<string[]>([])

  const resolveConflict = (conflictId: string, selectedDiscountId: string) => {
    setResolvedConflicts((prev) => [...prev, conflictId])
    // In real app, this would update the backend
    console.log(`Resolved conflict ${conflictId} with discount ${selectedDiscountId}`)
  }

  const resolveAllConflicts = () => {
    const unresolvedIds = conflicts.filter((c) => !resolvedConflicts.includes(c.id)).map((c) => c.id)
    setResolvedConflicts((prev) => [...prev, ...unresolvedIds])
    // In real app, this would batch update the backend
    console.log("Resolved all conflicts automatically")
  }

  const unresolvedConflicts = conflicts.filter((c) => !resolvedConflicts.includes(c.id))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Discount Conflict Resolution</span>
          </CardTitle>
          <CardDescription>
            Resolve conflicts when multiple discounts apply to the same product using best deal logic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {unresolvedConflicts.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All discount conflicts have been resolved. The system is applying the best available deals.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {unresolvedConflicts.length} conflict{unresolvedConflicts.length !== 1 ? "s" : ""} requiring
                  resolution
                </p>
                <Button
                  onClick={resolveAllConflicts}
                  variant="outline"
                  className="border-gti-bright-green text-gti-bright-green hover:bg-gti-bright-green hover:text-white bg-transparent"
                >
                  Auto-Resolve All
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  The system automatically selects the discount with the highest savings. You can override this
                  selection if needed.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflict Details */}
      {unresolvedConflicts.map((conflict) => (
        <Card key={conflict.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{conflict.productName}</CardTitle>
                <CardDescription>
                  {conflict.sku} • Base Price: ${conflict.basePrice.toFixed(2)}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                {conflict.conflictingDiscounts.length} Conflicts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Conflicting Discounts Table */}
            <div>
              <h4 className="font-medium mb-3">Available Discounts</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Discount Rule</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conflict.conflictingDiscounts.map((discount) => (
                    <TableRow
                      key={discount.id}
                      className={
                        discount.id === conflict.recommendedDiscount
                          ? "bg-gti-light-green/20 border-l-4 border-l-gti-bright-green"
                          : ""
                      }
                    >
                      <TableCell>
                        <div className="font-medium">{discount.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(discount.type)}>
                          {discount.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {discount.valueType === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                      </TableCell>
                      <TableCell>
                        <span className={getPriorityColor(discount.priority)}>Priority {discount.priority}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gti-dark-green">${discount.savings.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{discount.reason}</span>
                      </TableCell>
                      <TableCell>
                        {discount.id === conflict.recommendedDiscount ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-gti-bright-green" />
                            <span className="text-sm text-gti-bright-green font-medium">Best Deal</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <XCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Not Applied</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Resolution Logic */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Best Deal Logic</p>
                  <p className="text-sm text-blue-700">
                    The system recommends{" "}
                    <span className="font-medium">
                      {conflict.conflictingDiscounts.find((d) => d.id === conflict.recommendedDiscount)?.name}
                    </span>{" "}
                    because it provides the highest savings ( $
                    {conflict.conflictingDiscounts
                      .find((d) => d.id === conflict.recommendedDiscount)
                      ?.savings.toFixed(2)}
                    ).
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    No-stacking policy ensures only one discount is applied per item for maximum customer benefit.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Final Price: $
                {(
                  conflict.basePrice -
                  (conflict.conflictingDiscounts.find((d) => d.id === conflict.recommendedDiscount)?.savings || 0)
                ).toFixed(2)}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => resolveConflict(conflict.id, conflict.recommendedDiscount)}>
                  Accept Recommendation
                </Button>
                <Button
                  onClick={() => resolveConflict(conflict.id, conflict.recommendedDiscount)}
                  className="bg-gti-bright-green hover:bg-gti-medium-green text-white"
                >
                  Apply Best Deal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Resolution Summary */}
      {resolvedConflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-gti-bright-green" />
              <span>Resolution Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {resolvedConflicts.length} conflict{resolvedConflicts.length !== 1 ? "s" : ""} resolved using best deal
                logic
              </p>
              <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-3">
                <p className="text-sm font-medium text-gti-dark-green">Policy Enforcement</p>
                <p className="text-sm text-muted-foreground">
                  All conflicts resolved with no-stacking policy. Customers receive the single best discount for each
                  item, ensuring maximum savings and transparent pricing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
