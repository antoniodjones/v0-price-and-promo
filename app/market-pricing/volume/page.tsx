"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { VolumePricingWizard } from "@/components/market-pricing/volume-pricing-wizard"

export default function VolumePricingPage() {
  const [showWizard, setShowWizard] = useState(false)

  if (showWizard) {
    return <VolumePricingWizard onClose={() => setShowWizard(false)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/market-pricing">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-black">Volume-Based Pricing</h2>
          <p className="text-muted-foreground">Configure quantity-based discount tiers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Options */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Types</CardTitle>
              <CardDescription>Choose the type of volume pricing to configure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="p-4 border rounded-lg cursor-pointer hover:border-gti-green transition-colors"
                onClick={() => setShowWizard(true)}
              >
                <h3 className="font-medium text-gray-900 mb-2">Total Order Volume</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Discounts based on total units in the order across all products
                </p>
                <Badge className="bg-blue-100 text-blue-800">Most Common</Badge>
              </div>

              <div
                className="p-4 border rounded-lg cursor-pointer hover:border-gti-green transition-colors"
                onClick={() => setShowWizard(true)}
              >
                <h3 className="font-medium text-gray-900 mb-2">Brand-Specific Volume</h3>
                <p className="text-sm text-gray-600 mb-3">Discounts based on quantity of specific brand products</p>
                <Badge className="bg-purple-100 text-purple-800">Brand Focus</Badge>
              </div>

              <div
                className="p-4 border rounded-lg cursor-pointer hover:border-gti-green transition-colors"
                onClick={() => setShowWizard(true)}
              >
                <h3 className="font-medium text-gray-900 mb-2">Category Volume</h3>
                <p className="text-sm text-gray-600 mb-3">Discounts based on quantity within product categories</p>
                <Badge className="bg-green-100 text-green-800">Category Focus</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Example: Total Order Volume Pricing</CardTitle>
              <CardDescription>Based on business requirements from Massachusetts market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Tier Structure Example */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Tier Structure</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left">Tier</th>
                          <th className="border border-gray-300 p-3 text-left">Quantity Range</th>
                          <th className="border border-gray-300 p-3 text-left">A Tier</th>
                          <th className="border border-gray-300 p-3 text-left">B Tier</th>
                          <th className="border border-gray-300 p-3 text-left">C Tier</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3">1</td>
                          <td className="border border-gray-300 p-3">50-75 units</td>
                          <td className="border border-gray-300 p-3 text-green-600 font-medium">4.00%</td>
                          <td className="border border-gray-300 p-3 text-blue-600 font-medium">3.00%</td>
                          <td className="border border-gray-300 p-3 text-purple-600 font-medium">2.00%</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3">2</td>
                          <td className="border border-gray-300 p-3">76-99 units</td>
                          <td className="border border-gray-300 p-3 text-green-600 font-medium">5.00%</td>
                          <td className="border border-gray-300 p-3 text-blue-600 font-medium">4.00%</td>
                          <td className="border border-gray-300 p-3 text-purple-600 font-medium">3.00%</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">3</td>
                          <td className="border border-gray-300 p-3">100+ units</td>
                          <td className="border border-gray-300 p-3 text-green-600 font-medium">6.00%</td>
                          <td className="border border-gray-300 p-3 text-blue-600 font-medium">5.00%</td>
                          <td className="border border-gray-300 p-3 text-purple-600 font-medium">4.00%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Groups */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Group Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">A Tier (Premium)</span>
                      </div>
                      <p className="text-sm text-gray-600">High-volume customers</p>
                      <p className="text-sm text-green-600 font-medium">15 customers</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">B Tier (Standard)</span>
                      </div>
                      <p className="text-sm text-gray-600">Regular customers</p>
                      <p className="text-sm text-blue-600 font-medium">28 customers</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">C Tier (Basic)</span>
                      </div>
                      <p className="text-sm text-gray-600">New/small customers</p>
                      <p className="text-sm text-purple-600 font-medium">12 customers</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-gti-green hover:bg-gti-green/90" onClick={() => setShowWizard(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Volume Pricing Rule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
