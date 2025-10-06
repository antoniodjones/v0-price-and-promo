"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Package, Tag } from "lucide-react"
import { TieredPricingModal } from "./tiered-pricing-modal"
import { UnifiedDataTable } from "@/components/shared/unified-data-table"
import { useTableFilter, useTableSort } from "@/lib/table-helpers"
import type { ColumnDef } from "@/lib/table-helpers"

interface TieredPricingRule {
  id: string
  name: string
  description?: string
  customer_tiers: string[]
  scope: "product" | "category" | "brand" | "global"
  scope_id?: string
  scope_value?: string
  discount_type: string
  discount_value: number
  priority: number
  status: string
  start_date?: string
  end_date?: string
}

export function TieredPricingList() {
  const [rules, setRules] = useState<TieredPricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<TieredPricingRule | null>(null)

  const { filteredData, searchTerm, setSearchTerm } = useTableFilter(rules, ["name", "scope_value"])
  const { sortedData, sortConfig, requestSort } = useTableSort(filteredData)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/pricing-rules/tiered")
      if (response.ok) {
        const result = await response.json()
        setRules(result.data || [])
      }
    } catch (err) {
      console.error("[v0] Error fetching tiered pricing rules:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (rule: TieredPricingRule) => {
    setSelectedRule(rule)
    setModalOpen(true)
  }

  const handleDelete = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return

    try {
      const response = await fetch(`/api/pricing-rules/tiered/${ruleId}`, {
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

  const columns: ColumnDef<TieredPricingRule>[] = [
    {
      key: "name",
      header: "Rule Name",
      sortable: true,
      render: (rule) => (
        <div>
          <div className="font-medium">{rule.name}</div>
          {rule.description && <div className="text-xs text-muted-foreground">{rule.description}</div>}
        </div>
      ),
    },
    {
      key: "customer_tiers",
      header: "Customer Tiers",
      render: (rule) => (
        <div className="flex gap-1">
          {rule.customer_tiers.map((tier) => (
            <Badge key={tier} variant="outline">
              {tier}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "scope",
      header: "Scope",
      sortable: true,
      render: (rule) => (
        <div className="flex items-center gap-2">
          {getScopeIcon(rule.scope)}
          <span className="capitalize">{rule.scope}</span>
        </div>
      ),
    },
    {
      key: "scope_value",
      header: "Target",
      sortable: true,
      render: (rule) => <div className="text-sm">{rule.scope_value || "All"}</div>,
    },
    {
      key: "discount_value",
      header: "Discount",
      sortable: true,
      render: (rule) => (
        <div className="text-sm font-medium">
          {rule.discount_value}
          {rule.discount_type === "percentage" ? "%" : "$"}
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (rule) => <Badge variant="outline">{rule.priority}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (rule) => <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (rule) => (
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
      ),
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tiered Pricing Rules</CardTitle>
              <CardDescription>Customer tier-based pricing (A/B/C tiers)</CardDescription>
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
          <UnifiedDataTable
            data={sortedData}
            columns={columns}
            loading={loading}
            emptyMessage="No tiered pricing rules found. Create your first rule to get started."
            sortConfig={sortConfig}
            onSort={requestSort}
          />
        </CardContent>
      </Card>

      {modalOpen && (
        <TieredPricingModal
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
