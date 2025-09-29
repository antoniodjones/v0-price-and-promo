"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2, Users, DollarSign } from "lucide-react"

interface Territory {
  id: string
  state: string
  region: string
  dispensaries: number
  activeCustomers: number
  monthlyRevenue: number
  complianceStatus: "compliant" | "warning" | "non-compliant"
  licenseStatus: "active" | "pending" | "expired"
}

export function TerritoryManagement() {
  const [selectedState, setSelectedState] = useState("all")

  const territories: Territory[] = [
    {
      id: "ca-north",
      state: "California",
      region: "Northern California",
      dispensaries: 47,
      activeCustomers: 23,
      monthlyRevenue: 2400000,
      complianceStatus: "compliant",
      licenseStatus: "active",
    },
    {
      id: "ca-south",
      state: "California",
      region: "Southern California",
      dispensaries: 89,
      activeCustomers: 45,
      monthlyRevenue: 4200000,
      complianceStatus: "compliant",
      licenseStatus: "active",
    },
    {
      id: "il-chicago",
      state: "Illinois",
      region: "Chicago Metro",
      dispensaries: 34,
      activeCustomers: 18,
      monthlyRevenue: 1800000,
      complianceStatus: "warning",
      licenseStatus: "active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "active":
        return "bg-green-100 text-green-800"
      case "warning":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "non-compliant":
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredTerritories =
    selectedState === "all" ? territories : territories.filter((t) => t.state.toLowerCase() === selectedState)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Territory Management</h3>
          <p className="text-muted-foreground">Manage distributor relationships and regional compliance</p>
        </div>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            <SelectItem value="california">California</SelectItem>
            <SelectItem value="illinois">Illinois</SelectItem>
            <SelectItem value="massachusetts">Massachusetts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerritories.map((territory) => (
          <Card key={territory.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {territory.region}
                </CardTitle>
                <Badge className={getStatusColor(territory.complianceStatus)}>{territory.complianceStatus}</Badge>
              </div>
              <CardDescription>{territory.state}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{territory.dispensaries}</div>
                    <div className="text-xs text-muted-foreground">Dispensaries</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{territory.activeCustomers}</div>
                    <div className="text-xs text-muted-foreground">Active Customers</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{formatCurrency(territory.monthlyRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Monthly Revenue</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Badge variant="outline" className={getStatusColor(territory.licenseStatus)}>
                  License: {territory.licenseStatus}
                </Badge>
                <Button size="sm" variant="outline">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
