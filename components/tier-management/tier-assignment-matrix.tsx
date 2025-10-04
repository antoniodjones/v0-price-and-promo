"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users, TrendingUp, Award, Building2, User, Calendar, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Customer {
  id: string
  business_legal_name: string
  dba_name: string | null
  account_number: string
  customer_type: "internal" | "external"
}

interface TierAssignment {
  id: string
  rule_id: string
  customer_id: string
  tier: "A" | "B" | "C"
  assigned_at: string
  assigned_by: string | null
  notes: string | null
  customer: Customer
}

interface TierAssignmentMatrixProps {
  ruleId?: string // Optional: if provided, shows assignments for specific rule
  ruleName?: string // Optional: display name of the rule
}

export function TierAssignmentMatrix({ ruleId, ruleName }: TierAssignmentMatrixProps) {
  const [assignments, setAssignments] = useState<TierAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tierFilter, setTierFilter] = useState<string>("all")
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all")

  useEffect(() => {
    fetchAssignments()
  }, [ruleId])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const url = ruleId ? `/api/discount-rules/${ruleId}/assignments` : `/api/tier-assignments`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setAssignments(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter assignments based on search and filters
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        searchTerm === "" ||
        assignment.customer.business_legal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.customer.account_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.customer.dba_name && assignment.customer.dba_name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTier = tierFilter === "all" || assignment.tier === tierFilter
      const matchesCustomerType =
        customerTypeFilter === "all" || assignment.customer.customer_type === customerTypeFilter

      return matchesSearch && matchesTier && matchesCustomerType
    })
  }, [assignments, searchTerm, tierFilter, customerTypeFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const tierA = assignments.filter((a) => a.tier === "A").length
    const tierB = assignments.filter((a) => a.tier === "B").length
    const tierC = assignments.filter((a) => a.tier === "C").length
    const internal = assignments.filter((a) => a.customer.customer_type === "internal").length
    const external = assignments.filter((a) => a.customer.customer_type === "external").length

    return {
      total: assignments.length,
      tierA,
      tierB,
      tierC,
      internal,
      external,
    }
  }, [assignments])

  const getTierBadgeVariant = (tier: "A" | "B" | "C") => {
    switch (tier) {
      case "A":
        return "default" // Blue
      case "B":
        return "secondary" // Gray
      case "C":
        return "outline" // Outline
    }
  }

  const getTierColor = (tier: "A" | "B" | "C") => {
    switch (tier) {
      case "A":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "B":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "C":
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getTierIcon = (tier: "A" | "B" | "C") => {
    switch (tier) {
      case "A":
        return "💎"
      case "B":
        return "⭐"
      case "C":
        return "✓"
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.internal} internal, {stats.external} external
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Tier A (Premium)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.tierA}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.tierA / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Tier B (Standard)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.tierB}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.tierB / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-green-600" />
              Tier C (Basic)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.tierC}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ? Math.round((stats.tierC / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtered Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAssignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredAssignments.length === stats.total ? "All assignments" : "Filtered view"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Matrix Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Tier Assignment Matrix
                {ruleName && <Badge variant="outline">{ruleName}</Badge>}
              </CardTitle>
              <CardDescription>
                {ruleId
                  ? "View and manage customer tier assignments for this discount rule"
                  : "View all customer tier assignments across all discount rules"}
              </CardDescription>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="A">Tier A (Premium)</SelectItem>
                <SelectItem value="B">Tier B (Standard)</SelectItem>
                <SelectItem value="C">Tier C (Basic)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={customerTypeFilter} onValueChange={setCustomerTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by customer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customer Types</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
              <p className="text-muted-foreground">
                {searchTerm || tierFilter !== "all" || customerTypeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : ruleId
                    ? "No customers have been assigned to tiers for this discount rule yet."
                    : "No tier assignments exist yet. Create a discount rule and assign customers to get started."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Tier</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <Badge className={`${getTierColor(assignment.tier)} font-semibold`}>
                          {getTierIcon(assignment.tier)} {assignment.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assignment.customer.business_legal_name}</div>
                          {assignment.customer.dba_name && (
                            <div className="text-sm text-muted-foreground">DBA: {assignment.customer.dba_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{assignment.customer.account_number}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.customer.customer_type === "internal" ? "default" : "secondary"}>
                          {assignment.customer.customer_type === "internal" ? (
                            <Building2 className="h-3 w-3 mr-1" />
                          ) : (
                            <User className="h-3 w-3 mr-1" />
                          )}
                          {assignment.customer.customer_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(assignment.assigned_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{assignment.assigned_by || "System"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {assignment.notes || "-"}
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
    </div>
  )
}
