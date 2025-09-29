// Bulk operations interface for managing multiple discounts and promotions

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Trash2, Edit, Play, Pause, Copy } from "lucide-react"

interface BulkItem {
  id: string
  name: string
  type: "customer_discount" | "inventory_discount" | "bogo_promotion" | "bundle_deal"
  status: "active" | "inactive" | "scheduled" | "expired"
  market: string
  totalSavings: number
  usage: number
  selected: boolean
}

const mockBulkItems: BulkItem[] = [
  {
    id: "1",
    name: "Tier A Volume Discount",
    type: "customer_discount",
    status: "active",
    market: "Illinois",
    totalSavings: 45600,
    usage: 1245,
    selected: false,
  },
  {
    id: "2",
    name: "Expiring Inventory Auto-Discount",
    type: "inventory_discount",
    status: "active",
    market: "Pennsylvania",
    totalSavings: 28900,
    usage: 892,
    selected: false,
  },
  {
    id: "3",
    name: "Buy 2 Get 1 Free Cartridges",
    type: "bogo_promotion",
    status: "scheduled",
    market: "Massachusetts",
    totalSavings: 15600,
    usage: 456,
    selected: false,
  },
]

export function BulkOperationsPanel() {
  const [items, setItems] = useState<BulkItem[]>(mockBulkItems)
  const [selectedOperation, setSelectedOperation] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const selectedItems = items.filter((item) => item.selected)
  const selectedCount = selectedItems.length

  const handleSelectAll = (checked: boolean) => {
    setItems(items.map((item) => ({ ...item, selected: checked })))
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    setItems(items.map((item) => (item.id === id ? { ...item, selected: checked } : item)))
  }

  const handleBulkOperation = async () => {
    if (!selectedOperation || selectedCount === 0) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate bulk operation progress
    for (let i = 0; i <= selectedCount; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress((i / selectedCount) * 100)
    }

    // Apply the operation
    switch (selectedOperation) {
      case "activate":
        setItems(items.map((item) => (item.selected ? { ...item, status: "active" as const, selected: false } : item)))
        break
      case "deactivate":
        setItems(
          items.map((item) => (item.selected ? { ...item, status: "inactive" as const, selected: false } : item)),
        )
        break
      case "delete":
        setItems(items.filter((item) => !item.selected))
        break
    }

    setIsProcessing(false)
    setProgress(0)
    setSelectedOperation("")
    setShowConfirmDialog(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "customer_discount":
        return "👥"
      case "inventory_discount":
        return "📦"
      case "bogo_promotion":
        return "🎁"
      case "bundle_deal":
        return "📦"
      default:
        return "💰"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Bulk Operations</h3>
          <p className="text-muted-foreground">Manage multiple discounts and promotions efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Manage Items</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          {/* Bulk Actions Bar */}
          {selectedCount > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                    </span>
                    <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activate">
                          <div className="flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Activate
                          </div>
                        </SelectItem>
                        <SelectItem value="deactivate">
                          <div className="flex items-center gap-2">
                            <Pause className="h-4 w-4" />
                            Deactivate
                          </div>
                        </SelectItem>
                        <SelectItem value="duplicate">
                          <div className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </div>
                        </SelectItem>
                        <SelectItem value="delete">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectAll(false)}>
                      Clear Selection
                    </Button>
                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" disabled={!selectedOperation} onClick={() => setShowConfirmDialog(true)}>
                          Apply Action
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Bulk Operation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to {selectedOperation} {selectedCount} item
                            {selectedCount !== 1 ? "s" : ""}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        {isProcessing && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Processing...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>
                            Cancel
                          </Button>
                          <Button onClick={handleBulkOperation} disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Confirm"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Discounts & Promotions</CardTitle>
                  <CardDescription>Select items to perform bulk operations</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCount === items.length && items.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm">Select All</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                      item.selected ? "border-blue-300 bg-blue-50" : "border-border"
                    }`}
                  >
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                    />

                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline">{item.market}</Badge>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Type: {item.type.replace("_", " ")}</span>
                          <span>Usage: {item.usage.toLocaleString()}</span>
                          <span>Savings: {formatCurrency(item.totalSavings)}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Data</CardTitle>
              <CardDescription>Bulk import or export discount and promotion data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Import Data</h4>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drop CSV file here or click to browse</p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">Supported formats: CSV, Excel (.xlsx)</div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Export Data</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="export-type">Export Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data to export" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="selected">Selected Items</SelectItem>
                          <SelectItem value="active">Active Only</SelectItem>
                          <SelectItem value="inactive">Inactive Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="export-format">Format</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operation Templates</CardTitle>
              <CardDescription>Pre-configured templates for common bulk operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">🎯</div>
                      <h4 className="font-medium">Seasonal Activation</h4>
                      <p className="text-sm text-muted-foreground">
                        Activate all seasonal promotions for upcoming holidays
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">📊</div>
                      <h4 className="font-medium">Performance Cleanup</h4>
                      <p className="text-sm text-muted-foreground">Deactivate low-performing discounts automatically</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">🔄</div>
                      <h4 className="font-medium">Market Migration</h4>
                      <p className="text-sm text-muted-foreground">Copy successful promotions to new markets</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
