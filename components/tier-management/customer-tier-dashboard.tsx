"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  Award,
  TrendingUp,
  Building2,
  Loader2,
  RefreshCw,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Customer {
  id: string
  business_legal_name: string
  dba_name: string | null
  account_number: string
  customer_type: "internal" | "external"
}

interface DiscountRule {
  id: string
  rule_name: string
  rule_type: string
  status: string
}

interface TierAssignment {
  id: string
  rule_id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_at: string
  assigned_by: string | null
  notes: string | null
  discount_rule: DiscountRule
}

interface CustomerWithTiers extends Customer {
  tier_assignments: TierAssignment[]
}

interface CustomerFilters {
  search: string
  customerType: string
  tier: string
  ruleId: string
}

export function CustomerTierDashboard() {
  const [customers, setCustomers] = useState<CustomerWithTiers[]>([])
  const [discountRules, setDiscountRules] = useState<DiscountRule[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    customerType: "all",
    tier: "all",
    ruleId: "all",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load customers and their tier assignments
      const customersResponse = await fetch("/api/customers?include_tiers=true")
      const customersData = await customersResponse.json()

      // Load all discount rules for filtering
      const rulesResponse = await fetch("/api/discount-rules")
      const rulesData = await rulesResponse.json()

      if (customersData.success) {
        setCustomers(customersData.data.customers || [])
      }

      if (rulesData.success) {
        setDiscountRules(rulesData.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load customer tier data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter customers based on search and filters
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const matchesSearch =
        filters.search === "" ||
        customer.business_legal_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.account_number.toLowerCase().includes(filters.search.toLowerCase()) ||
        (customer.dba_name && customer.dba_name.toLowerCase().includes(filters.search.toLowerCase()))

      // Customer type filter
      const matchesCustomerType = filters.customerType === "all" || customer.customer_type === filters.customerType

      // Tier filter - check if customer has any assignment with this tier
      const matchesTier =
        filters.tier === "all" || customer.tier_assignments.some((assignment) => assignment.tier === filters.tier)

      // Rule filter - check if customer has assignment for this rule
      const matchesRule =
        filters.ruleId === "all" ||
        customer.tier_assignments.some((assignment) => assignment.rule_id === filters.ruleId)

      return matchesSearch && matchesCustomerType && matchesTier && matchesRule
    })
  }, [customers, filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCustomers = customers.length
    const customersWithTiers = customers.filter((c) => c.tier_assignments.length > 0).length
    const customersWithoutTiers = totalCustomers - customersWithTiers

    // Count unique tier assignments
    const allAssignments = customers.flatMap((c) => c.tier_assignments)
    const tierA = allAssignments.filter((a) => a.tier === "A").length
    const tierB = allAssignments.filter((a) => a.tier === "B").length
    const tierC = allAssignments.filter((a) => a.tier === "C").length

    // Average tiers per customer
    const avgTiersPerCustomer = customersWithTiers > 0 ? (allAssignments.length / customersWithTiers).toFixed(1) : "0"

    return {
      totalCustomers,
      customersWithTiers,
      customersWithoutTiers,
      tierA,
      tierB,
      tierC,
      totalAssignments: allAssignments.length,
      avgTiersPerCustomer,
    }
  }, [customers])

  const toggleCustomerExpanded = (customerId: string) => {
    setExpandedCustomers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(customerId)) {
        newSet.delete(customerId)
      } else {
        newSet.add(customerId)
      }
      return newSet
    })
  }

  const getTierBadge = (tier: "A" | "B" | "C") => {
    const colors = {
      A: "bg-blue-500 text-white",
      B: "bg-purple-500 text-white",
      C: "bg-orange-500 text-white",
    }
    return <Badge className={colors[tier]}>Tier {tier}</Badge>
  }

  const getCustomerTypeBadge = (type: "internal" | "external") => {
    return type === "internal" ? (
      <Badge className="bg-green-500 text-white">Internal</Badge>
    ) : (
      <Badge variant="outline">External</Badge>
    )
  }

  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Customer ID", "Business Name", "Account Number", "Type", "Discount Rule", "Tier", "Assigned Date"]
    const rows = filteredCustomers.flatMap((customer) =>
      customer.tier_assignments.length > 0
        ? customer.tier_assignments.map((assignment) => [
            customer.id,
            customer.business_legal_name,
            customer.account_number,
            customer.customer_type,
            assignment.discount_rule.rule_name,
            assignment.tier,
            new Date(assignment.assigned_at).toLocaleDateString(),
          ])
        : [
            [
              customer.id,
              customer.business_legal_name,
              customer.account_number,
              customer.customer_type,
              "No assignments",
              "-",
              "-",
            ],
          ],
    )

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `customer-tiers-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Customer tier data has been exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.customersWithTiers} with tiers, {stats.customersWithoutTiers} without
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier A Assignments</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.tierA}</div>
            <p className="text-xs text-muted-foreground">Premium tier customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier B Assignments</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.tierB}</div>
            <p className="text-xs text-muted-foreground">Standard tier customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tier C Assignments</CardTitle>
            <Building2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.tierC}</div>
            <p className="text-xs text-muted-foreground">Basic tier customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Business name, account #..."
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
                  <SelectItem value="internal">Internal</SelectItem>
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
                  <SelectItem value="A">Tier A (Premium)</SelectItem>
                  <SelectItem value="B">Tier B (Standard)</SelectItem>
                  <SelectItem value="C">Tier C (Basic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-filter">Discount Rule</Label>
              <Select value={filters.ruleId} onValueChange={(value) => setFilters({ ...filters, ruleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rules</SelectItem>
                  {discountRules.map((rule) => (
                    <SelectItem key={rule.id} value={rule.id}>
                      {rule.rule_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Tier Assignments</CardTitle>
              <CardDescription>View all customers and their tier assignments across discount rules</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading customer tier data...</span>
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.customerType !== "all" || filters.tier !== "all" || filters.ruleId !== "all"
                  ? "No customers match your current filters"
                  : "No customers with tier assignments found"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCustomers.map((customer) => (
                <Collapsible
                  key={customer.id}
                  open={expandedCustomers.has(customer.id)}
                  onOpenChange={() => toggleCustomerExpanded(customer.id)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center gap-4 p-4 hover:bg-accent/50 cursor-pointer transition-colors">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCustomers.has(customer.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{customer.business_legal_name}</div>
                          {customer.dba_name && (
                            <div className="text-sm text-muted-foreground">DBA: {customer.dba_name}</div>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Account: </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">{customer.account_number}</code>
                          </div>

                          {getCustomerTypeBadge(customer.customer_type)}

                          <Badge variant="outline">
                            {customer.tier_assignments.length}{" "}
                            {customer.tier_assignments.length === 1 ? "assignment" : "assignments"}
                          </Badge>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="border-t p-4 bg-muted/30">
                        {customer.tier_assignments.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            <p>No tier assignments for this customer</p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Discount Rule</TableHead>
                                <TableHead>Rule Type</TableHead>
                                <TableHead>Tier</TableHead>
                                <TableHead>Assigned Date</TableHead>
                                <TableHead>Assigned By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {customer.tier_assignments.map((assignment) => (
                                <TableRow key={assignment.id}>
                                  <TableCell className="font-medium">{assignment.discount_rule.rule_name}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{assignment.discount_rule.rule_type}</Badge>
                                  </TableCell>
                                  <TableCell>{getTierBadge(assignment.tier)}</TableCell>
                                  <TableCell className="text-sm">
                                    {new Date(assignment.assigned_at).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell className="text-sm">{assignment.assigned_by || "System"}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={assignment.discount_rule.status === "active" ? "default" : "secondary"}
                                    >
                                      {assignment.discount_rule.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                    {assignment.notes || "-"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Total Tier Assignments</div>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customers with Tiers</div>
              <div className="text-2xl font-bold">{stats.customersWithTiers}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Tiers per Customer</div>
              <div className="text-2xl font-bold">{stats.avgTiersPerCustomer}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
