"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, Calendar, Percent, Plus, Settings, MoreVertical, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface InventoryDiscountRule {
  id?: string
  name: string
  description: string
  ruleType: "expiration" | "inventory" | "thc" | "category" | "brand"
  conditions: {
    daysUntilExpiration?: number
    inventoryThreshold?: number
    thcPercentage?: number
    categories?: string[]
    brands?: string[]
  }
  discountType: "percentage" | "fixed"
  discountValue: number
  isActive: boolean
  priority: number
  isBuiltIn?: boolean
}

export default function InventoryDiscountsPage() {
  const [autoDiscountEnabled, setAutoDiscountEnabled] = useState(true)
  const [expirationThreshold, setExpirationThreshold] = useState(30)
  const [discountPercentage, setDiscountPercentage] = useState(15)
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<InventoryDiscountRule | null>(null)
  const [customRules, setCustomRules] = useState<InventoryDiscountRule[]>([])
  const [builtInRules, setBuiltInRules] = useState<InventoryDiscountRule[]>([
    {
      id: "builtin-expiration",
      name: "30-Day Expiration Rule",
      description: "15% off products expiring in 30 days",
      ruleType: "expiration",
      conditions: { daysUntilExpiration: 30 },
      discountType: "percentage",
      discountValue: 15,
      isActive: true,
      priority: 1,
      isBuiltIn: true,
    },
    {
      id: "builtin-thc",
      name: "High THC Discount",
      description: "10% off products with THC > 25%",
      ruleType: "thc",
      conditions: { thcPercentage: 25 },
      discountType: "percentage",
      discountValue: 10,
      isActive: false,
      priority: 2,
      isBuiltIn: true,
    },
  ])

  const allRules = [...builtInRules, ...customRules]

  const handleNewRule = () => {
    setEditingRule(null)
    setIsNewRuleModalOpen(true)
  }

  const handleEditRule = (rule: InventoryDiscountRule) => {
    setEditingRule(rule)
    setIsNewRuleModalOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    const rule = allRules.find((r) => r.id === ruleId)
    if (rule?.isBuiltIn) {
      setBuiltInRules(builtInRules.map((r) => (r.id === ruleId ? { ...r, isActive: false } : r)))
    } else {
      setCustomRules(customRules.filter((rule) => rule.id !== ruleId))
    }
  }

  const handleSaveRule = (rule: InventoryDiscountRule) => {
    if (editingRule) {
      if (editingRule.isBuiltIn) {
        setBuiltInRules(builtInRules.map((r) => (r.id === editingRule.id ? rule : r)))
      } else {
        setCustomRules(customRules.map((r) => (r.id === editingRule.id ? rule : r)))
      }
    } else {
      setCustomRules([...customRules, rule])
    }
  }

  const handleRuleCardDoubleClick = (rule: InventoryDiscountRule) => {
    handleEditRule(rule)
  }

  const RuleCard = ({ rule }: { rule: InventoryDiscountRule }) => {
    const getIcon = () => {
      switch (rule.ruleType) {
        case "expiration":
          return <Calendar className="h-4 w-4 text-primary" />
        case "thc":
          return <Percent className="h-4 w-4 text-yellow-500" />
        default:
          return <Package className="h-4 w-4 text-primary" />
      }
    }

    return (
      <div
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md bg-card"
        onDoubleClick={() => handleRuleCardDoubleClick(rule)}
        title="Double-click to edit"
      >
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <p className="font-medium">{rule.name}</p>
            <p className="text-sm text-muted-foreground">
              {rule.discountValue}
              {rule.discountType === "percentage" ? "%" : "$"} off - {rule.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={rule.isActive ? "secondary" : "outline"}>
            {rule.isActive ? "Active" : rule.isBuiltIn ? "Pending" : "Inactive"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Rule
              </DropdownMenuItem>
              {!rule.isBuiltIn && (
                <DropdownMenuItem onClick={() => handleDeleteRule(rule.id!)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Rule
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automated Inventory Discounts</h1>
          <p className="text-muted-foreground">
            Automatically apply discounts based on expiration dates and inventory levels
          </p>
        </div>
        <Link href="/inventory-discounts/new">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            New Rule
          </Button>
        </Link>
      </div>

      {/* Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Auto Discount Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Auto Discount Configuration
            </CardTitle>
            <CardDescription>Configure automatic discount rules for expiring inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-discount">Enable Auto Discounts</Label>
              <Switch id="auto-discount" checked={autoDiscountEnabled} onCheckedChange={setAutoDiscountEnabled} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="expiration-threshold">Days Until Expiration</Label>
              <Input
                id="expiration-threshold"
                type="number"
                value={expirationThreshold}
                onChange={(e) => setExpirationThreshold(Number(e.target.value))}
                min="1"
                max="365"
              />
              <p className="text-sm text-muted-foreground">
                Apply discounts when products are within this many days of expiration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-percentage">Discount Percentage</Label>
              <Input
                id="discount-percentage"
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                min="1"
                max="50"
              />
              <p className="text-sm text-muted-foreground">Percentage discount to apply to qualifying products</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Active Discount Rules
            </CardTitle>
            <CardDescription>Currently configured automatic discount rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allRules.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}

              {allRules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No discount rules configured</p>
                  <p className="text-sm">Click "New Rule" to create your first discount rule</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Auto Discounts Applied</CardTitle>
          <CardDescription>Latest automatic discounts applied to inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                product: "Blue Dream 1oz",
                batch: "BH-2025-0892",
                discount: "15%",
                reason: "30 days to expiration",
                time: "2 hours ago",
                status: "applied",
              },
              {
                product: "OG Kush 0.5oz",
                batch: "BH-2025-0891",
                discount: "15%",
                reason: "25 days to expiration",
                time: "4 hours ago",
                status: "applied",
              },
              {
                product: "Sour Diesel 1oz",
                batch: "BH-2025-0890",
                discount: "10%",
                reason: "High THC content (28%)",
                time: "6 hours ago",
                status: "pending",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium">{item.product}</p>
                    <p className="text-sm text-muted-foreground">
                      Batch {item.batch} • {item.discount} discount • {item.reason}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <Badge variant={item.status === "applied" ? "secondary" : "outline"}>{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
