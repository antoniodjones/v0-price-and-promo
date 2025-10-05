"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

interface RebateReportsProps {
  selectedMarket: string
  dateRange: DateRange | undefined
}

export function RebateReports({ selectedMarket, dateRange }: RebateReportsProps) {
  const [reportType, setReportType] = useState("strain")
  const [searchTerm, setSearchTerm] = useState("")

  const rebateData = {
    strain: [
      {
        name: "Blue Dream",
        listPrice: "$240.00",
        avgActualPrice: "$220.80",
        avgDiscount: "8.0%",
        totalDiscount: "$19,200",
        orders: 80,
        customers: 15,
      },
      {
        name: "OG Kush",
        listPrice: "$250.00",
        avgActualPrice: "$235.00",
        avgDiscount: "6.0%",
        totalDiscount: "$15,750",
        orders: 63,
        customers: 12,
      },
      {
        name: "Sour Diesel",
        listPrice: "$245.00",
        avgActualPrice: "$228.55",
        avgDiscount: "6.7%",
        totalDiscount: "$14,520",
        orders: 72,
        customers: 18,
      },
    ],
    brand: [
      {
        name: "Incredibles",
        listPrice: "$60.00",
        avgActualPrice: "$55.20",
        avgDiscount: "8.0%",
        totalDiscount: "$24,000",
        orders: 500,
        customers: 45,
      },
      {
        name: "Premium Cannabis Co",
        listPrice: "$240.00",
        avgActualPrice: "$225.60",
        avgDiscount: "6.0%",
        totalDiscount: "$28,800",
        orders: 200,
        customers: 32,
      },
    ],
    category: [
      {
        name: "Flower",
        listPrice: "$242.50",
        avgActualPrice: "$228.15",
        avgDiscount: "5.9%",
        totalDiscount: "$86,400",
        orders: 600,
        customers: 85,
      },
      {
        name: "Edibles",
        listPrice: "$58.75",
        avgActualPrice: "$54.30",
        avgDiscount: "7.6%",
        totalDiscount: "$44,500",
        orders: 1000,
        customers: 120,
      },
    ],
  }

  const currentData = rebateData[reportType as keyof typeof rebateData] || rebateData.strain

  const filteredData = currentData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Rebate Calculation Reports</CardTitle>
          <CardDescription>Generate detailed discount reports for vendor rebate calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Report type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strain">By Strain</SelectItem>
                <SelectItem value="brand">By Brand</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Button className="bg-gti-dark-green hover:bg-gti-medium-green">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                $
                {filteredData
                  .reduce((sum, item) => sum + Number.parseFloat(item.totalDiscount.replace(/[$,]/g, "")), 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Discounts</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredData.reduce((sum, item) => sum + item.customers, 0)}
              </div>
              <div className="text-sm text-gray-600">Unique Customers</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {(
                  filteredData.reduce((sum, item) => sum + Number.parseFloat(item.avgDiscount.replace("%", "")), 0) /
                  filteredData.length
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-gray-600">Avg Discount Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rebate Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rebate Calculation Data</CardTitle>
          <CardDescription>Detailed breakdown for vendor rebate negotiations and calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-600">
                    {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Name
                  </th>
                  <th className="text-left p-3 font-medium text-gray-600">List Price</th>
                  <th className="text-left p-3 font-medium text-gray-600">Avg Actual Price</th>
                  <th className="text-left p-3 font-medium text-gray-600">Avg Discount %</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total Discount $</th>
                  <th className="text-left p-3 font-medium text-gray-600">Orders</th>
                  <th className="text-left p-3 font-medium text-gray-600">Customers</th>
                  <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="p-3 text-gray-600">{item.listPrice}</td>
                    <td className="p-3 font-medium text-gti-dark-green">{item.avgActualPrice}</td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-800">{item.avgDiscount}</Badge>
                    </td>
                    <td className="p-3 font-medium text-red-600">{item.totalDiscount}</td>
                    <td className="p-3 text-gray-600">{item.orders}</td>
                    <td className="p-3 text-gray-600">{item.customers}</td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rebate Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Rebate Summary for Vendor Negotiations</CardTitle>
          <CardDescription>Key metrics for rebate discussions with suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Discount Impact Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Total Revenue Impact</span>
                  <span className="font-medium text-red-600">-$158,720</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Volume Increase</span>
                  <span className="font-medium text-green-600">+23.5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Customer Retention</span>
                  <span className="font-medium text-green-600">+15.2%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recommended Rebate Requests</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900">High-Volume Discounts</div>
                  <div className="text-sm text-gray-600">Request 3-4% rebate on volume tiers</div>
                  <div className="text-sm text-gti-dark-green font-medium">Potential recovery: $47K</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-gray-900">Aged Inventory</div>
                  <div className="text-sm text-gray-600">Request support for expiration discounts</div>
                  <div className="text-sm text-gti-dark-green font-medium">Potential recovery: $28K</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
