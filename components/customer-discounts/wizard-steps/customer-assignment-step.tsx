"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, Building, MapPin, X } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface CustomerAssignmentStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

// Mock customer data - in real app this would come from API
const mockCustomers = [
  {
    id: "cust-1",
    name: "Dispensary ABC",
    type: "Retail",
    location: "Chicago, IL",
    tier: "A",
    monthlyVolume: "$45,000",
  },
  {
    id: "cust-2",
    name: "Elite Cannabis Co",
    type: "Retail",
    location: "Springfield, IL",
    tier: "B",
    monthlyVolume: "$28,000",
  },
  {
    id: "cust-3",
    name: "Premium Dispensary LLC",
    type: "Retail",
    location: "Rockford, IL",
    tier: "A",
    monthlyVolume: "$52,000",
  },
  {
    id: "cust-4",
    name: "High Volume Buyer",
    type: "Wholesale",
    location: "Peoria, IL",
    tier: "A",
    monthlyVolume: "$125,000",
  },
  {
    id: "cust-5",
    name: "VIP Dispensary",
    type: "Retail",
    location: "Aurora, IL",
    tier: "B",
    monthlyVolume: "$35,000",
  },
  {
    id: "cust-6",
    name: "Premium Partners",
    type: "Wholesale",
    location: "Joliet, IL",
    tier: "A",
    monthlyVolume: "$89,000",
  },
]

export function CustomerAssignmentStep({ formData, updateFormData }: CustomerAssignmentStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTier, setSelectedTier] = useState<string>("")

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = !selectedTier || customer.tier === selectedTier
    return matchesSearch && matchesTier
  })

  const handleCustomerToggle = (customerId: string, customerName: string) => {
    const currentCustomers = formData.customers || []
    const isSelected = currentCustomers.includes(customerName)

    if (isSelected) {
      updateFormData({
        customers: currentCustomers.filter((name) => name !== customerName),
      })
    } else {
      updateFormData({
        customers: [...currentCustomers, customerName],
      })
    }
  }

  const handleRemoveCustomer = (customerName: string) => {
    updateFormData({
      customers: formData.customers.filter((name) => name !== customerName),
    })
  }

  const isCustomerSelected = (customerName: string) => {
    return formData.customers.includes(customerName)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "A":
        return "bg-gti-bright-green text-white"
      case "B":
        return "bg-gti-medium-green text-white"
      case "C":
        return "bg-gti-light-green text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Assign Customers</h2>
        <p className="text-muted-foreground mt-2">Select which customers will receive this discount</p>
      </div>

      {/* Selected Customers Summary */}
      {formData.customers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-4 w-4 text-gti-bright-green" />
              <span>Selected Customers ({formData.customers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.customers.map((customerName) => (
                <Badge
                  key={customerName}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-gti-light-green/20 text-gti-dark-green"
                >
                  <span>{customerName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveCustomer(customerName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTier === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("")}
                className={selectedTier === "" ? "bg-gti-bright-green hover:bg-gti-medium-green" : ""}
              >
                All Tiers
              </Button>
              <Button
                variant={selectedTier === "A" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("A")}
                className={selectedTier === "A" ? "bg-gti-bright-green hover:bg-gti-medium-green" : ""}
              >
                Tier A
              </Button>
              <Button
                variant={selectedTier === "B" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("B")}
                className={selectedTier === "B" ? "bg-gti-bright-green hover:bg-gti-medium-green" : ""}
              >
                Tier B
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-3">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isCustomerSelected(customer.name)
                ? "ring-2 ring-gti-bright-green border-gti-bright-green bg-gti-light-green/5"
                : "hover:border-gti-light-green"
            }`}
            onClick={() => handleCustomerToggle(customer.id, customer.name)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isCustomerSelected(customer.name)}
                    onChange={() => {}} // Handled by card click
                  />
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{customer.location}</span>
                        <span>•</span>
                        <span>{customer.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{customer.monthlyVolume}</p>
                    <p className="text-xs text-muted-foreground">Monthly volume</p>
                  </div>
                  <Badge className={getTierColor(customer.tier)}>Tier {customer.tier}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm || selectedTier ? "No customers found matching your criteria" : "No customers available"}
          </p>
        </div>
      )}

      {/* Summary */}
      {formData.customers.length > 0 && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              {formData.customers.length} customer{formData.customers.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            These customers will receive the discount when ordering from {formData.targetName}
          </p>
        </div>
      )}
    </div>
  )
}
