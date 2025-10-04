"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Building2, Search, Plus, Edit, Loader2, RefreshCw, FileText } from "lucide-react"

interface Customer {
  id: string
  business_legal_name: string | null
  dba_name: string | null
  cannabis_license_number: string | null
  license_expiration_date: string | null
  customer_type: string | null
  account_number: string | null
  tier: string | null
  status: string | null
  credit_limit: number | null
  payment_terms: string | null
  business_type: string | null
  created_at: string
}

interface CustomerFilters {
  search: string
  customerType: string
  tier: string
}

export function CustomerManagementDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    customerType: "all",
    tier: "all",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [filters, pagination.page])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      if (filters.search) params.append("search", filters.search)
      if (filters.customerType !== "all") params.append("customer_type", filters.customerType)

      const response = await fetch(`/api/customers?${params}`)
      const result = await response.json()

      if (result.success) {
        let customerData = result.data.customers || []

        // Apply tier filter on client side
        if (filters.tier !== "all") {
          customerData = customerData.filter((c: Customer) => c.tier === filters.tier)
        }

        setCustomers(customerData)
        setPagination((prev) => ({
          ...prev,
          total: result.data.pagination.total,
          totalPages: result.data.pagination.totalPages,
        }))
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load customers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCustomerTypeBadge = (type: string | null) => {
    if (!type) return <Badge variant="outline">Unknown</Badge>
    return type === "internal" ? (
      <Badge className="bg-green-500 text-white">Internal</Badge>
    ) : (
      <Badge variant="outline">External</Badge>
    )
  }

  const getTierBadge = (tier: string | null) => {
    if (!tier) return <Badge variant="outline">No Tier</Badge>
    const colors: Record<string, string> = {
      A: "bg-blue-500 text-white",
      B: "bg-purple-500 text-white",
      C: "bg-orange-500 text-white",
    }
    return <Badge className={colors[tier] || "bg-gray-500 text-white"}>Tier {tier}</Badge>
  }

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "$0"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString()
  }

  const isLicenseExpiringSoon = (expirationDate: string | null) => {
    if (!expirationDate) return false
    const expDate = new Date(expirationDate)
    const today = new Date()
    const daysUntilExpiration = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiration <= 30 && daysUntilExpiration >= 0
  }

  const isLicenseExpired = (expirationDate: string | null) => {
    if (!expirationDate) return false
    return new Date(expirationDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Customer Management</h3>
          <p className="text-muted-foreground">Manage B2B wholesale cannabis customers and licensing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCustomers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internal Dispensaries</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {customers.filter((c) => c.customer_type === "internal").length}
            </div>
            <p className="text-xs text-muted-foreground">Green Thumb owned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External Customers</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {customers.filter((c) => c.customer_type === "external").length}
            </div>
            <p className="text-xs text-muted-foreground">Third-party dispensaries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenses Expiring</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {customers.filter((c) => isLicenseExpiringSoon(c.license_expiration_date)).length}
            </div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Business name, license #, account #..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-type-filter">Customer Type</Label>
              <Select
                value={filters.customerType}
                onValueChange={(value) => setFilters({ ...filters, customerType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internal">Internal (Green Thumb)</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier-filter">Tier</Label>
              <Select value={filters.tier} onValueChange={(value) => setFilters({ ...filters, tier: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="A">Tier A</SelectItem>
                  <SelectItem value="B">Tier B</SelectItem>
                  <SelectItem value="C">Tier C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>B2B Customers</CardTitle>
          <CardDescription>Wholesale cannabis business customers and licensing information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading customers...</span>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.customerType !== "all" || filters.tier !== "all"
                  ? "No customers match your current filters"
                  : "Add your first B2B customer to get started"}
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>License Expiration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Account #</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-xs">{customer.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.business_legal_name || "—"}</div>
                          {customer.dba_name && (
                            <div className="text-sm text-muted-foreground">DBA: {customer.dba_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{customer.cannabis_license_number || "—"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatDate(customer.license_expiration_date)}</span>
                          {isLicenseExpired(customer.license_expiration_date) && (
                            <Badge variant="destructive" className="text-xs">
                              Expired
                            </Badge>
                          )}
                          {isLicenseExpiringSoon(customer.license_expiration_date) &&
                            !isLicenseExpired(customer.license_expiration_date) && (
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                                Expiring Soon
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>{getCustomerTypeBadge(customer.customer_type)}</TableCell>
                      <TableCell>{getTierBadge(customer.tier)}</TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{customer.account_number || "—"}</div>
                      </TableCell>
                      <TableCell>{formatCurrency(customer.credit_limit)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.payment_terms || "Net 30"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
