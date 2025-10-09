"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Building2, Plus, Edit, FileText, Search } from "lucide-react"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { useTableSort, useTableFilter, useTablePagination } from "@/lib/table-helpers"
import { formatCurrency, formatDate } from "@/lib/table-formatters"
import { apiGet, FetchError } from "@/lib/utils/fetch"

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
  const [searchInput, setSearchInput] = useState("")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<Customer[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()

  const { sortedData, sortConfig, handleSort } = useTableSort(customers, {
    key: "business_legal_name",
    direction: "asc",
  })
  const { filteredData } = useTableFilter(sortedData, filters.search, [
    "business_legal_name",
    "dba_name",
    "cannabis_license_number",
    "account_number",
  ])
  const pagination = useTablePagination(filteredData, 20)

  useEffect(() => {
    loadCustomers()
  }, [filters])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.search) params.append("search", filters.search)
      if (filters.customerType !== "all") params.append("customer_type", filters.customerType)

      const result = await apiGet<{ customers: Customer[] }>(`/api/customers?${params}`)

      let customerData = result.customers || []

      if (filters.tier !== "all") {
        customerData = customerData.filter((c: Customer) => c.tier === filters.tier)
      }

      setCustomers(customerData)
    } catch (error) {
      const message = error instanceof FetchError ? error.message : "Failed to load customers. Please try again."
      console.error("Error loading customers:", error)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim().length >= 2) {
        fetchSearchSuggestions(searchInput)
      } else {
        setSearchSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchSearchSuggestions = async (search: string) => {
    try {
      setSearchLoading(true)
      const result = await apiGet<{ customers: Customer[] }>(`/api/customers?search=${encodeURIComponent(search)}`)
      setSearchSuggestions(result.customers?.slice(0, 10) || [])
    } catch (error) {
      console.error("Error fetching search suggestions:", error)
      setSearchSuggestions([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchSelect = (customer: Customer) => {
    setSearchInput(customer.business_legal_name || customer.dba_name || "")
    setFilters({ ...filters, search: customer.business_legal_name || customer.dba_name || "" })
    setShowSearchSuggestions(false)
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

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (customer: Customer) => <span className="font-mono text-xs">{customer.id.slice(0, 8)}</span>,
    },
    {
      key: "business_legal_name",
      label: "Business Name",
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <div className="font-medium">{customer.business_legal_name || "—"}</div>
          {customer.dba_name && <div className="text-sm text-muted-foreground">DBA: {customer.dba_name}</div>}
        </div>
      ),
    },
    {
      key: "cannabis_license_number",
      label: "License Number",
      sortable: true,
      render: (customer: Customer) => (
        <div className="font-mono text-sm">{customer.cannabis_license_number || "—"}</div>
      ),
    },
    {
      key: "license_expiration_date",
      label: "License Expiration",
      sortable: true,
      render: (customer: Customer) => (
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
      ),
    },
    {
      key: "customer_type",
      label: "Type",
      sortable: true,
      render: (customer: Customer) => getCustomerTypeBadge(customer.customer_type),
    },
    {
      key: "tier",
      label: "Tier",
      sortable: true,
      render: (customer: Customer) => getTierBadge(customer.tier),
    },
    {
      key: "account_number",
      label: "Account #",
      sortable: true,
      render: (customer: Customer) => <div className="font-mono text-sm">{customer.account_number || "—"}</div>,
    },
    {
      key: "credit_limit",
      label: "Credit Limit",
      sortable: true,
      render: (customer: Customer) => formatCurrency(customer.credit_limit),
    },
    {
      key: "payment_terms",
      label: "Payment Terms",
      render: (customer: Customer) => <Badge variant="outline">{customer.payment_terms || "Net 30"}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (customer: Customer) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Popover
                open={showSearchSuggestions && searchSuggestions.length > 0}
                onOpenChange={setShowSearchSuggestions}
              >
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search customers..."
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value)
                        setShowSearchSuggestions(true)
                      }}
                      onFocus={() => {
                        if (searchSuggestions.length > 0) {
                          setShowSearchSuggestions(true)
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSearchSuggestions(false), 200)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setFilters({ ...filters, search: searchInput })
                          setShowSearchSuggestions(false)
                        }
                      }}
                      className="pl-8"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandList>
                      {searchLoading ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">Searching...</div>
                      ) : (
                        <>
                          <CommandEmpty>No customers found.</CommandEmpty>
                          <CommandGroup heading="Matching Customers">
                            {searchSuggestions.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.id}
                                onSelect={() => handleSearchSelect(customer)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {customer.business_legal_name || customer.dba_name || "—"}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {customer.cannabis_license_number || customer.account_number || "No license"}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {customer.customer_type === "internal" ? (
                                      <Badge className="bg-green-500 text-white text-xs">Internal</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-xs">
                                        External
                                      </Badge>
                                    )}
                                    {customer.tier && (
                                      <Badge variant="secondary" className="text-xs">
                                        Tier {customer.tier}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

      {/*
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
      */}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
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
              {filteredData.filter((c) => c.customer_type === "internal").length}
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
              {filteredData.filter((c) => c.customer_type === "external").length}
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
              {filteredData.filter((c) => isLicenseExpiringSoon(c.license_expiration_date)).length}
            </div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>B2B Customers</CardTitle>
          <CardDescription>Wholesale cannabis business customers and licensing information</CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedDataTable
            data={pagination.paginatedData}
            columns={columns}
            loading={loading}
            sortConfig={sortConfig}
            onSort={handleSort}
            pagination={pagination}
            onPageChange={pagination.goToPage}
            onPageSizeChange={(size) => {
              // Note: The current hook doesn't support dynamic page size changes
              // This would need to be implemented if required
            }}
            emptyState={{
              icon: Building2,
              title: "No Customers Found",
              description:
                filters.search || filters.customerType !== "all" || filters.tier !== "all"
                  ? "No customers match your current filters"
                  : "Add your first B2B customer to get started",
              action: (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              ),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
