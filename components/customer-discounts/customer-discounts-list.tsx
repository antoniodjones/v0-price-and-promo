"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Users, Package, Tag } from "lucide-react"

// Mock data - in real app this would come from API
const mockDiscounts = [
  {
    id: "1",
    name: "Premium Cannabis - Dispensary ABC 8%",
    level: "Brand",
    target: "Premium Cannabis Co",
    discountType: "percentage",
    discountValue: 8,
    customers: ["Dispensary ABC"],
    startDate: "2025-10-01",
    endDate: null,
    status: "active",
    appliedOrders: 47,
    totalSavings: 12450.0,
  },
  {
    id: "2",
    name: "Gummies $5 Off - Elite & Premium",
    level: "Sub-category",
    target: "Edibles > Gummies",
    discountType: "dollar",
    discountValue: 5,
    customers: ["Elite Cannabis Co", "Premium Dispensary LLC"],
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    status: "active",
    appliedOrders: 23,
    totalSavings: 2875.0,
  },
  {
    id: "3",
    name: "1oz Flower Bulk Discount",
    level: "Size",
    target: "Flower > 1oz",
    discountType: "percentage",
    discountValue: 12,
    customers: ["High Volume Buyer"],
    startDate: "2025-09-15",
    endDate: null,
    status: "active",
    appliedOrders: 156,
    totalSavings: 18720.0,
  },
  {
    id: "4",
    name: "Holiday Concentrates Promo",
    level: "Category",
    target: "Concentrates",
    discountType: "percentage",
    discountValue: 15,
    customers: ["VIP Dispensary", "Premium Partners"],
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    status: "scheduled",
    appliedOrders: 0,
    totalSavings: 0,
  },
]

const getLevelIcon = (level: string) => {
  switch (level) {
    case "Brand":
      return <Tag className="h-4 w-4" />
    case "Category":
    case "Sub-category":
      return <Package className="h-4 w-4" />
    case "Size":
      return <Package className="h-4 w-4" />
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
    case "expired":
      return "bg-gray-500 text-white"
    case "paused":
      return "bg-orange-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function CustomerDiscountsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [discounts] = useState(mockDiscounts)

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.customers.some((customer) => customer.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Discount Rules</CardTitle>
            <CardDescription>Manage customer-specific pricing rules and assignments</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search discounts..."
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
              <TableHead>Discount Rule</TableHead>
              <TableHead>Level & Target</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Performance</TableHead>
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
                    {getLevelIcon(discount.level)}
                    <div>
                      <div className="text-sm font-medium">{discount.level}</div>
                      <div className="text-xs text-muted-foreground">{discount.target}</div>
                    </div>
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
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{discount.customers.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {discount.customers.slice(0, 2).join(", ")}
                    {discount.customers.length > 2 && ` +${discount.customers.length - 2} more`}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(discount.startDate).toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {discount.endDate ? `to ${new Date(discount.endDate).toLocaleDateString()}` : "No end date"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{discount.appliedOrders} orders</div>
                  <div className="text-xs text-muted-foreground">${discount.totalSavings.toLocaleString()} saved</div>
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Manage Customers
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
