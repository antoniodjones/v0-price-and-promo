"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Loader2, Package, Tag } from "lucide-react"
import { VolumePricingModal } from "./volume-pricing-modal"

interface VolumePricingRule {
  id: string
  name: string
  description?: string
  scope: "product" | "category" | "brand" | "global"
  scope_id?: string
  scope_value?: string
  status: string
  start_date?: string
  end_date?: string
  tiers: Array<{
    id: string
    min_quantity: number
    max_quantity: number | null
    discount_type: string
    discount_value: number
    tier_label?: string
  }>
}

export function VolumePricingList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rules, setRules] = useState<VolumePricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<VolumePricingRule | null>(null)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pricing-rules/volume")
      if (response.ok) {
        const result = await response.json()
        setRules(result.data || [])
      }
    } catch (err) {
      console.error("[v0] Error fetching volume pricing rules:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (rule: VolumePricingRule) => {
    setSelectedRule(rule)
    setModalOpen(true)
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return

    try {
      const response = await fetch(`/api/pricing-rules/volume/${ruleId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchRules()
      }
    } catch (err) {
      console.error("[v0] Error deleting rule:", err)
    }
  }

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "brand":
        return <Tag className="h-4 w-4" />
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
        return "bg-blue-500 text-white"
      case "inactive":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.scope_value?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading volume pricing rules...</span>
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
              <CardTitle>Volume Pricing Rules</CardTitle>
              <CardDescription>Quantity-based discounts (buy more, save more)</CardDescription>
            </div>
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
        </CardHeader>
        <CardContent>
          {filteredRules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No volume pricing rules found. Create your first rule to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Tiers</TableHead>
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
                      <div className="flex items-center gap-2">
                        {getScopeIcon(rule.scope)}
                        <span className="capitalize">{rule.scope}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{rule.scope_value || "All"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {rule.tiers.map((tier, idx) => (
                          <div key={idx} className="text-xs">
                            {tier.min_quantity}-{tier.max_quantity || "∞"}: {tier.discount_value}
                            {tier.discount_type === "percentage" ? "%" : "$"} off
                          </div>
                        ))}
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

      {modalOpen && (
        <VolumePricingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedRule(null)
          }}
          rule={selectedRule}
          onSuccess={fetchRules}
        />
      )}
    </>
  )
}
