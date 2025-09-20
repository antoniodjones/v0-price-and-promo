"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Clock, User, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"

interface AuditEntry {
  id: string
  timestamp: string
  orderId: string
  customerId: string
  customerName: string
  productSku: string
  productName: string
  basePrice: number
  appliedDiscount: {
    id: string
    name: string
    type: string
    value: number
    valueType: "percentage" | "dollar"
  } | null
  alternativeDiscounts: {
    id: string
    name: string
    type: string
    value: number
    valueType: "percentage" | "dollar"
    reason: string
  }[]
  finalPrice: number
  savings: number
  decisionReason: string
  userId: string
  userName: string
}

// Mock audit data
const mockAuditEntries: AuditEntry[] = [
  {
    id: "audit-1",
    timestamp: "2025-01-20T14:30:00Z",
    orderId: "ORD-2025-001",
    customerId: "cust-1",
    customerName: "Dispensary ABC",
    productSku: "BD-1OZ-001",
    productName: "Blue Dream 1oz",
    basePrice: 240.0,
    appliedDiscount: {
      id: "expiration-1",
      name: "30-Day Expiration Auto Discount",
      type: "Expiration",
      value: 20,
      valueType: "percentage",
    },
    alternativeDiscounts: [
      {
        id: "customer-1",
        name: "Premium Cannabis - Dispensary ABC 8%",
        type: "Customer",
        value: 8,
        valueType: "percentage",
        reason: "Customer-specific brand discount",
      },
      {
        id: "thc-1",
        name: "Low THC Flower Discount",
        type: "THC",
        value: 10,
        valueType: "percentage",
        reason: "12.3% THC (below 15% threshold)",
      },
    ],
    finalPrice: 192.0,
    savings: 48.0,
    decisionReason: "Best deal: Expiration discount (20%) provides highest savings ($48.00)",
    userId: "system",
    userName: "Automated System",
  },
  {
    id: "audit-2",
    timestamp: "2025-01-20T14:25:00Z",
    orderId: "ORD-2025-001",
    customerId: "cust-1",
    customerName: "Dispensary ABC",
    productSku: "INC-GUM-500",
    productName: "Incredibles Gummies 500mg",
    basePrice: 60.0,
    appliedDiscount: null,
    alternativeDiscounts: [],
    finalPrice: 60.0,
    savings: 0,
    decisionReason: "No applicable discounts found for this product",
    userId: "system",
    userName: "Automated System",
  },
  {
    id: "audit-3",
    timestamp: "2025-01-20T14:20:00Z",
    orderId: "ORD-2025-002",
    customerId: "cust-2",
    customerName: "Elite Cannabis Co",
    productSku: "WC-1OZ-001",
    productName: "Wedding Cake 1oz",
    basePrice: 250.0,
    appliedDiscount: {
      id: "tiered-1",
      name: "A-Tier Customer 6%",
      type: "Tiered",
      value: 6,
      valueType: "percentage",
    },
    alternativeDiscounts: [
      {
        id: "volume-1",
        name: "Volume Discount 5%",
        type: "Volume",
        value: 5,
        valueType: "percentage",
        reason: "8 total units (over 3 unit threshold)",
      },
    ],
    finalPrice: 235.0,
    savings: 15.0,
    decisionReason: "Best deal: A-Tier customer discount (6%) provides highest savings ($15.00)",
    userId: "user-1",
    userName: "John Smith",
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

export function PricingAuditTrail() {
  const [searchTerm, setSearchTerm] = useState("")
  const [entries] = useState<AuditEntry[]>(mockAuditEntries)

  const filteredEntries = entries.filter(
    (entry) =>
      entry.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productSku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gti-bright-green" />
            <span>Pricing Decision Audit Trail</span>
          </CardTitle>
          <CardDescription>
            Complete audit log of all pricing decisions and discount applications with full transparency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order, customer, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Audit Log
            </Button>
          </div>

          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-gti-bright-green">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{entry.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.productSku} • Order {entry.orderId}
                          </p>
                        </div>
                        <Badge variant="outline">{entry.customerName}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTimestamp(entry.timestamp)}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {entry.userName}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Base Price</p>
                        <p className="font-medium">${entry.basePrice.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Final Price</p>
                        <p className="font-medium text-gti-dark-green">${entry.finalPrice.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Savings</p>
                        <p className="font-medium text-gti-bright-green">
                          {entry.savings > 0 ? `$${entry.savings.toFixed(2)}` : "No savings"}
                        </p>
                      </div>
                    </div>

                    {/* Applied Discount */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Applied Discount:</p>
                      {entry.appliedDiscount ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-gti-bright-green" />
                          <Badge variant="outline" className={getTypeColor(entry.appliedDiscount.type)}>
                            {entry.appliedDiscount.type}
                          </Badge>
                          <span className="text-sm">{entry.appliedDiscount.name}</span>
                          <span className="text-sm font-medium">
                            (
                            {entry.appliedDiscount.valueType === "percentage"
                              ? `${entry.appliedDiscount.value}%`
                              : `$${entry.appliedDiscount.value}`}
                            )
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">No discount applied</span>
                        </div>
                      )}
                    </div>

                    {/* Alternative Discounts */}
                    {entry.alternativeDiscounts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Alternative Discounts Considered:</p>
                        <div className="space-y-1">
                          {entry.alternativeDiscounts.map((discount) => (
                            <div
                              key={discount.id}
                              className="flex items-center space-x-2 text-sm text-muted-foreground"
                            >
                              <TrendingDown className="h-3 w-3" />
                              <Badge variant="outline" className={getTypeColor(discount.type)} size="sm">
                                {discount.type}
                              </Badge>
                              <span>{discount.name}</span>
                              <span>
                                ({discount.valueType === "percentage" ? `${discount.value}%` : `$${discount.value}`})
                              </span>
                              <span>- {discount.reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Decision Reason */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800">Decision Logic:</p>
                      <p className="text-sm text-blue-700">{entry.decisionReason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No audit entries found matching your search" : "No audit entries available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
