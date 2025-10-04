"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Users,
  Filter,
  CheckCircle2,
  Building2,
  Award,
  Star,
  TrendingUp,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface Customer {
  id: string
  business_legal_name: string
  dba_name?: string
  account_number?: string
  customer_type?: string
  email?: string
  status?: string
  total_purchases?: number
}

interface CustomerAssignmentStepProps {
  data: {
    assignments: Array<{
      customer_id: string
      tier: "A" | "B" | "C"
    }>
  }
  onUpdate: (data: any) => void
}

type SortField = "name" | "account" | "type" | "tier" | "status"
type SortDirection = "asc" | "desc"

export function CustomerAssignmentStep({ data, onUpdate }: CustomerAssignmentStepProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all")
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<string>("all")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set())
  const [assignments, setAssignments] = useState<Map<string, "A" | "B" | "C">>(new Map())

  useEffect(() => {
    const assignmentMap = new Map<string, "A" | "B" | "C">()
    data.assignments.forEach((assignment) => {
      assignmentMap.set(assignment.customer_id, assignment.tier)
    })
    setAssignments(assignmentMap)
  }, [data.assignments])

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true)
        const response = await fetch("/api/customers?limit=100")
        const result = await response.json()
        if (result.success) {
          setCustomers(result.data.customers)
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        searchQuery === "" ||
        customer.business_legal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.dba_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.account_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = customerTypeFilter === "all" || customer.customer_type === customerTypeFilter

      const assignedTier = assignments.get(customer.id)
      const matchesAssignmentStatus =
        assignmentStatusFilter === "all" ||
        (assignmentStatusFilter === "assigned" && assignedTier) ||
        (assignmentStatusFilter === "unassigned" && !assignedTier)

      const matchesTier = tierFilter === "all" || assignedTier === tierFilter

      const matchesStatus = customerStatusFilter === "all" || customer.status === customerStatusFilter

      return matchesSearch && matchesType && matchesAssignmentStatus && matchesTier && matchesStatus
    })

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = (a.business_legal_name || "").localeCompare(b.business_legal_name || "")
          break
        case "account":
          comparison = (a.account_number || "").localeCompare(b.account_number || "")
          break
        case "type":
          comparison = (a.customer_type || "").localeCompare(b.customer_type || "")
          break
        case "tier":
          const tierA = assignments.get(a.id) || "Z"
          const tierB = assignments.get(b.id) || "Z"
          comparison = tierA.localeCompare(tierB)
          break
        case "status":
          comparison = (a.status || "").localeCompare(b.status || "")
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [
    customers,
    searchQuery,
    customerTypeFilter,
    assignmentStatusFilter,
    tierFilter,
    customerStatusFilter,
    sortField,
    sortDirection,
    assignments,
  ])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCustomerTypeFilter("all")
    setAssignmentStatusFilter("all")
    setTierFilter("all")
    setCustomerStatusFilter("all")
  }

  const activeFilterCount = [
    searchQuery !== "",
    customerTypeFilter !== "all",
    assignmentStatusFilter !== "all",
    tierFilter !== "all",
    customerStatusFilter !== "all",
  ].filter(Boolean).length

  const handleTierAssignment = (customerId: string, tier: "A" | "B" | "C") => {
    const newAssignments = new Map(assignments)
    newAssignments.set(customerId, tier)
    setAssignments(newAssignments)

    const assignmentsArray = Array.from(newAssignments.entries()).map(([customer_id, tier]) => ({
      customer_id,
      tier,
    }))
    onUpdate({ assignments: assignmentsArray })
  }

  const handleBulkAssignment = (tier: "A" | "B" | "C") => {
    const newAssignments = new Map(assignments)
    selectedCustomers.forEach((customerId) => {
      newAssignments.set(customerId, tier)
    })
    setAssignments(newAssignments)

    const assignmentsArray = Array.from(newAssignments.entries()).map(([customer_id, tier]) => ({
      customer_id,
      tier,
    }))
    onUpdate({ assignments: assignmentsArray })

    setSelectedCustomers(new Set())
  }

  const toggleCustomerSelection = (customerId: string) => {
    const newSelection = new Set(selectedCustomers)
    if (newSelection.has(customerId)) {
      newSelection.delete(customerId)
    } else {
      newSelection.add(customerId)
    }
    setSelectedCustomers(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedCustomers.size === filteredAndSortedCustomers.length) {
      setSelectedCustomers(new Set())
    } else {
      setSelectedCustomers(new Set(filteredAndSortedCustomers.map((c) => c.id)))
    }
  }

  const getTierBadge = (tier: "A" | "B" | "C") => {
    const styles = {
      A: { icon: Award, color: "bg-purple-100 text-purple-700 border-purple-300" },
      B: { icon: Star, color: "bg-blue-100 text-blue-700 border-blue-300" },
      C: { icon: TrendingUp, color: "bg-green-100 text-green-700 border-green-300" },
    }
    const { icon: Icon, color } = styles[tier]
    return (
      <Badge variant="outline" className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        Tier {tier}
      </Badge>
    )
  }

  const stats = {
    total: assignments.size,
    tierA: Array.from(assignments.values()).filter((t) => t === "A").length,
    tierB: Array.from(assignments.values()).filter((t) => t === "B").length,
    tierC: Array.from(assignments.values()).filter((t) => t === "C").length,
  }

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-gti-bright-green" />
    ) : (
      <ArrowDown className="h-3 w-3 text-gti-bright-green" />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gti-bright-green mx-auto mb-4" />
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assigned</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tier A</p>
                <p className="text-2xl font-bold text-purple-600">{stats.tierA}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tier B</p>
                <p className="text-2xl font-bold text-blue-600">{stats.tierB}</p>
              </div>
              <Star className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tier C</p>
                <p className="text-2xl font-bold text-green-600">{stats.tierC}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount} active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Find customers to assign to tiers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
              {selectedCustomers.size > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">{selectedCustomers.size} selected</span>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAssignment("A")}>
                    Assign to A
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAssignment("B")}>
                    Assign to B
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAssignment("C")}>
                    Assign to C
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-3">
              <Label>Search Customers</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, DBA, account number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Assignment Status</Label>
              <Select value={assignmentStatusFilter} onValueChange={setAssignmentStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="assigned">Assigned Only</SelectItem>
                  <SelectItem value="unassigned">Unassigned Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tier Filter</Label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="A">Tier A - Premium</SelectItem>
                  <SelectItem value="B">Tier B - Standard</SelectItem>
                  <SelectItem value="C">Tier C - Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Customer Type</Label>
              <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Customer Status</Label>
              <Select value={customerStatusFilter} onValueChange={setCustomerStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Customer Name</SelectItem>
                  <SelectItem value="account">Account Number</SelectItem>
                  <SelectItem value="type">Customer Type</SelectItem>
                  <SelectItem value="tier">Tier Assignment</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Assignment</CardTitle>
              <CardDescription>
                {filteredAndSortedCustomers.length} customer{filteredAndSortedCustomers.length !== 1 ? "s" : ""} found
                {activeFilterCount > 0 && ` (filtered from ${customers.length} total)`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedCustomers.size === filteredAndSortedCustomers.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredAndSortedCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No customers found matching your filters</p>
                {activeFilterCount > 0 && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              filteredAndSortedCustomers.map((customer) => {
                const isSelected = selectedCustomers.has(customer.id)
                const assignedTier = assignments.get(customer.id)

                return (
                  <div
                    key={customer.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      isSelected ? "bg-accent border-gti-bright-green" : "hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleCustomerSelection(customer.id)} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="font-medium truncate">{customer.business_legal_name}</div>
                        {customer.dba_name && (
                          <span className="text-sm text-muted-foreground truncate">({customer.dba_name})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        {customer.account_number && <span>#{customer.account_number}</span>}
                        {customer.customer_type && (
                          <Badge variant="secondary" className="text-xs">
                            {customer.customer_type}
                          </Badge>
                        )}
                        {customer.status && (
                          <Badge variant={customer.status === "active" ? "default" : "secondary"} className="text-xs">
                            {customer.status}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {assignedTier && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          {getTierBadge(assignedTier)}
                        </div>
                      )}
                      <Select
                        value={assignedTier || ""}
                        onValueChange={(value) => handleTierAssignment(customer.id, value as "A" | "B" | "C")}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Assign tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Tier A - Premium</SelectItem>
                          <SelectItem value="B">Tier B - Standard</SelectItem>
                          <SelectItem value="C">Tier C - Basic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Summary */}
      {assignments.size > 0 && (
        <Card className="border-gti-bright-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Assignment Summary
            </CardTitle>
            <CardDescription>Review your customer tier assignments before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Tier A - Premium</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{stats.tierA} customers</p>
                <p className="text-sm text-purple-700 mt-1">Highest discount tier</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Tier B - Standard</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.tierB} customers</p>
                <p className="text-sm text-blue-700 mt-1">Mid-level discount tier</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Tier C - Basic</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.tierC} customers</p>
                <p className="text-sm text-green-700 mt-1">Entry-level discount tier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
