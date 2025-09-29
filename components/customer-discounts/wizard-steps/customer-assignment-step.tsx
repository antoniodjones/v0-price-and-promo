"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, Building, MapPin, X, Loader2 } from "lucide-react"
import type { DiscountFormData } from "../customer-discount-wizard"

interface CustomerAssignmentStepProps {
  formData: DiscountFormData
  updateFormData: (updates: Partial<DiscountFormData>) => void
}

interface Customer {
  id: string
  name: string
  email: string
  tier: string
  market: string
  status: string
  createdAt: string
  updatedAt: string
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Elite Cannabis Co",
    email: "orders@elitecannabis.com",
    tier: "premium",
    market: "Illinois",
    status: "active",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Premium Dispensary LLC",
    email: "purchasing@premiumdisp.com",
    tier: "standard",
    market: "California",
    status: "active",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-10",
  },
]

export function CustomerAssignmentStep({ formData, updateFormData }: CustomerAssignmentStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTier, setSelectedTier] = useState<string>("")
  const [customers, setCustomers] = useState<Customer[]>([]) // Ensure customers is always initialized as an array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("[v0] Fetching customers...")
        setLoading(true)
        setError(null)

        const response = await fetch("/api/customers?limit=50")

        if (!response.ok) {
          console.log("[v0] API failed, using mock data")
          setCustomers(mockCustomers)
          return
        }

        const text = await response.text()
        let data

        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.log("[v0] JSON parse failed, using mock data")
          setCustomers(mockCustomers)
          return
        }

        if (data?.success && Array.isArray(data.data)) {
          const customerData = data.data.map((customer: any) => ({
            id: customer?.id || "",
            name: customer?.name || "Unknown Customer",
            email: customer?.email || "",
            tier: customer?.tier || "standard",
            market: customer?.market || "Unknown",
            status: customer?.status || "active",
            createdAt: customer?.created_at || customer?.createdAt || "",
            updatedAt: customer?.updated_at || customer?.updatedAt || "",
          }))
          setCustomers(customerData)
        } else {
          console.log("[v0] Invalid API response, using mock data")
          setCustomers(mockCustomers)
        }
      } catch (err) {
        console.error("[v0] Error fetching customers:", err)
        console.log("[v0] Using mock data as fallback")
        setCustomers(mockCustomers)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) => {
        const searchLower = (searchTerm || "").toLowerCase()
        const nameMatch = (customer?.name || "").toLowerCase().includes(searchLower)
        const marketMatch = (customer?.market || "").toLowerCase().includes(searchLower)
        const matchesSearch = nameMatch || marketMatch
        const matchesTier = !selectedTier || customer?.tier === selectedTier
        return matchesSearch && matchesTier
      })
    : []

  const handleCustomerToggle = useCallback(
    (customerId: string, customerName: string) => {
      const currentCustomers = Array.isArray(formData?.customers) ? formData.customers : []
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
    },
    [formData?.customers, updateFormData],
  )

  const handleRemoveCustomer = useCallback(
    (customerName: string) => {
      const currentCustomers = Array.isArray(formData?.customers) ? formData.customers : []
      updateFormData({
        customers: currentCustomers.filter((name) => name !== customerName),
      })
    },
    [formData?.customers, updateFormData],
  )

  const isCustomerSelected = (customerName: string) => {
    const currentCustomers = Array.isArray(formData?.customers) ? formData.customers : []
    return currentCustomers.includes(customerName)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-gti-bright-green text-white"
      case "standard":
        return "bg-gti-medium-green text-white"
      case "basic":
        return "bg-gti-light-green text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const selectedCustomersCount = Array.isArray(formData?.customers) ? formData.customers.length : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gti-dark-green">Assign Customers</h2>
          <p className="text-muted-foreground mt-2">Select which customers will receive this discount</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gti-bright-green" />
          <span className="ml-2 text-muted-foreground">Loading customers...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gti-dark-green">Assign Customers</h2>
          <p className="text-muted-foreground mt-2">Select which customers will receive this discount</p>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gti-bright-green hover:bg-gti-medium-green">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">Assign Customers</h2>
        <p className="text-muted-foreground mt-2">Select which customers will receive this discount</p>
      </div>

      {/* Selected Customers Summary */}
      {selectedCustomersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="h-4 w-4 text-gti-bright-green" />
              <span>Selected Customers ({selectedCustomersCount})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(formData?.customers || []).map((customerName) => (
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
                variant={selectedTier === "premium" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("premium")}
                className={selectedTier === "premium" ? "bg-gti-bright-green hover:bg-gti-medium-green" : ""}
              >
                Premium
              </Button>
              <Button
                variant={selectedTier === "standard" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier("standard")}
                className={selectedTier === "standard" ? "bg-gti-bright-green hover:bg-gti-medium-green" : ""}
              >
                Standard
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
            onMouseDown={(e) => {
              e.preventDefault()
              handleCustomerToggle(customer.id, customer.name)
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox checked={isCustomerSelected(customer.name)} readOnly />
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{customer.market}</span>
                        <span>•</span>
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{customer.status}</p>
                    <p className="text-xs text-muted-foreground">Status</p>
                  </div>
                  <Badge className={getTierColor(customer.tier)}>
                    {(customer?.tier || "").charAt(0).toUpperCase() + (customer?.tier || "").slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm || selectedTier ? "No customers found matching your criteria" : "No customers available"}
          </p>
        </div>
      )}

      {/* Summary */}
      {selectedCustomersCount > 0 && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              {selectedCustomersCount} customer{selectedCustomersCount !== 1 ? "s" : ""} selected
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            These customers will receive the discount when ordering from {formData?.targetName || "the selected target"}
          </p>
        </div>
      )}
    </div>
  )
}
