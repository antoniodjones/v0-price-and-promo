"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Users, Loader2, Tag, Package } from "lucide-react"
import { DiscountRuleModal } from "./discount-rule-modal"
import { TierAssignmentModal } from "./tier-assignment-modal"

interface DiscountRule {
  id: string
  name: string
  description?: string
  rule_type: "customer_discount" | "volume_pricing" | "tiered_pricing" | "bogo" | "bundle"
  level: "brand" | "category" | "subcategory" | "product"
  target_id?: string
  target_name?: string
  start_date: string
  end_date?: string
  status: "active" | "inactive" | "scheduled" | "expired"
  created_by?: string
  created_at: string
  updated_at: string
  tiers?: Array<{
    tier: "A" | "B" | "C"
    discount_type: "percentage" | "fixed_amount" | "price_override"
    discount_value: number
    min_quantity?: number
    max_quantity?: number
  }>
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case "brand":
      return <Tag className="h-4 w-4" />
    case "category":
    case "subcategory":
      return <Package className="h-4 w-4" />
    case "product":
      return <Package className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gti-bright-green text-white"
    case "scheduled":
      return "bg-gti-yellow text-black"
    case "expired":
      return "bg-gray-500 text-white"
    case "inactive":
      return "bg-orange-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export function DiscountRulesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rules, setRules] = useState<DiscountRule[]>([])
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<DiscountRule | null>(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/discount-rules")

      if (!response.ok) {
        throw new Error("Failed to fetch discount rules")
      }

      const result = await response.json()

      if (result?.success && Array.isArray(result.data)) {
        setRules(result.data)
      }
    } catch (err) {
      console.error("[v0] Error fetching discount rules:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (rule: DiscountRule) => {
    setSelectedRule(rule)
    setEditModalOpen(true)
  }

  const handleManageAssignments = (rule: DiscountRule) => {
    setSelectedRule(rule)
    setAssignmentModalOpen(true)
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this discount rule?")) {
      return
    }

    try {
      const response = await fetch(`/api/discount-rules/${ruleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchRules()
      }
    } catch (err) {
      console.error("[v0] Error deleting rule:", err)
    }
  }

  const filteredRules = rules.filter((rule) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      rule.name.toLowerCase().includes(searchLower) ||
      (rule.target_name && rule.target_name.toLowerCase().includes(searchLower)) ||
      rule.level.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discount Rules</CardTitle>
          <CardDescription>Manage tiered pricing rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading rules...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Discount Rules</CardTitle>
              <CardDescription>Manage tiered pricing rules with A/B/C tier structure</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No discount rules found. Create your first rule to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Type & Level</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Tiers</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div className="font-medium">{rule.name}</div>
                      {rule.description && <div className="text-xs text-muted-foreground">{rule.description}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(rule.level)}
                        <div>
                          <div className="text-sm font-medium capitalize">{rule.rule_type.replace("_", " ")}</div>
                          <div className="text-xs text-muted-foreground capitalize">{rule.level}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{rule.target_name || "All"}</div>
                      {rule.target_id && <div className="text-xs text-muted-foreground">{rule.target_id}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {rule.tiers?.map((tier) => (
                          <Badge key={tier.tier} variant="outline" className="text-xs">
                            {tier.tier}:{" "}
                            {tier.discount_type === "percentage"
                              ? `${tier.discount_value}%`
                              : tier.discount_type === "fixed_amount"
                                ? `$${tier.discount_value}`
                                : `$${tier.discount_value}`}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(rule.start_date).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {rule.end_date ? `to ${new Date(rule.end_date).toLocaleDateString()}` : "No end date"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(rule)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageAssignments(rule)}>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Customers
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(rule.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedRule && (
        <>
          <DiscountRuleModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false)
              setSelectedRule(null)
            }}
            rule={selectedRule}
            onSuccess={fetchRules}
          />
          <TierAssignmentModal
            isOpen={assignmentModalOpen}
            onClose={() => {
              setAssignmentModalOpen(false)
              setSelectedRule(null)
            }}
            rule={selectedRule}
            onSuccess={fetchRules}
          />
        </>
      )}
    </>
  )
}
