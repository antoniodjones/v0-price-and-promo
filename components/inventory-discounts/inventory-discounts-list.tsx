"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Clock, Zap, Package, AlertTriangle } from "lucide-react"

// Mock data for automated discount rules
const mockAutoDiscounts = [
  {
    id: "auto-1",
    name: "30-Day Expiration Auto Discount",
    type: "expiration",
    trigger: "30 days prior to expiration",
    level: "Global",
    target: "All Products",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2025-10-01",
    status: "active",
    batchesAffected: 23,
    totalSavings: 8450.0,
    lastTriggered: "2 hours ago",
  },
  {
    id: "auto-2",
    name: "Low THC Flower Discount",
    type: "thc",
    trigger: "THC below 15%",
    level: "Category",
    target: "Flower",
    discountType: "percentage",
    discountValue: 10,
    startDate: "2025-09-15",
    status: "active",
    batchesAffected: 12,
    totalSavings: 3240.0,
    lastTriggered: "1 day ago",
  },
  {
    id: "auto-3",
    name: "Premium Brand 14-Day Expiration",
    type: "expiration",
    trigger: "14 days prior to expiration",
    level: "Brand",
    target: "Premium Cannabis Co",
    discountType: "percentage",
    discountValue: 30,
    startDate: "2025-10-01",
    status: "active",
    batchesAffected: 8,
    totalSavings: 5670.0,
    lastTriggered: "6 hours ago",
  },
  {
    id: "auto-4",
    name: "Holiday Concentrates THC Boost",
    type: "thc",
    trigger: "THC below 70%",
    level: "Category",
    target: "Concentrates",
    discountType: "dollar",
    discountValue: 15,
    startDate: "2025-11-01",
    status: "scheduled",
    batchesAffected: 0,
    totalSavings: 0,
    lastTriggered: "Never",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "expiration":
      return <Clock className="h-4 w-4" />
    case "thc":
      return <Zap className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gti-bright-green text-white"
    case "scheduled":
      return "bg-gti-yellow text-black"
    case "paused":
      return "bg-orange-500 text-white"
    case "expired":
      return "bg-gray-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "expiration":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "thc":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function InventoryDiscountsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [discounts] = useState(mockAutoDiscounts)

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.trigger.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Automated Discount Rules</CardTitle>
            <CardDescription>Inventory-based automatic discounting rules and their performance</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search auto discounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead>Type & Trigger</TableHead>
              <TableHead>Level & Target</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Last Triggered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell>
                  <div className="font-medium">{discount.name}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(discount.type)}
                    <div>
                      <Badge variant="outline" className={getTypeColor(discount.type)}>
                        {discount.type === "expiration" ? "Expiration" : "THC Level"}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{discount.trigger}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm font-medium">{discount.level}</div>
                    <div className="text-xs text-muted-foreground">{discount.target}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {discount.discountType === "percentage" ? "Percentage" : "Dollar amount"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{discount.batchesAffected} batches</div>
                  <div className="text-xs text-muted-foreground">${discount.totalSavings.toLocaleString()} saved</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{discount.lastTriggered}</div>
                  {discount.lastTriggered !== "Never" && discount.lastTriggered.includes("hours") && (
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-gti-bright-green rounded-full animate-pulse"></div>
                      <span className="text-xs text-gti-bright-green">Recently active</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(discount.status)}>{discount.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Rule
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        View Affected Batches
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Pause Rule
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
