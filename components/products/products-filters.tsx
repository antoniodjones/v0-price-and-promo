"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"

const categories = [
  { id: "flower", name: "Flower", count: 234 },
  { id: "edibles", name: "Edibles", count: 89 },
  { id: "concentrates", name: "Concentrates", count: 67 },
  { id: "vapes", name: "Vapes", count: 45 },
  { id: "topicals", name: "Topicals", count: 23 },
]

const brands = [
  { id: "premium-cannabis", name: "Premium Cannabis Co", count: 47 },
  { id: "incredibles", name: "Incredibles", count: 23 },
  { id: "green-thumb", name: "Green Thumb", count: 89 },
  { id: "rise", name: "Rise", count: 156 },
  { id: "stiiizy", name: "Stiiizy", count: 34 },
]

const statuses = [
  { id: "active", name: "Active", count: 412 },
  { id: "inactive", name: "Inactive", count: 23 },
  { id: "out-of-stock", name: "Out of Stock", count: 15 },
]

export function ProductsFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["active"])

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedStatuses(["active"])
  }

  const activeFiltersCount =
    selectedCategories.length + selectedBrands.length + (selectedStatuses.length > 1 ? selectedStatuses.length - 1 : 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category.id])
                    } else {
                      setSelectedCategories(selectedCategories.filter((id) => id !== category.id))
                    }
                  }}
                />
                <Label htmlFor={category.id} className="flex-1 text-sm font-normal cursor-pointer">
                  {category.name}
                </Label>
                <span className="text-xs text-muted-foreground">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <Label className="text-sm font-medium">Brand</Label>
          <div className="mt-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBrands([...selectedBrands, brand.id])
                    } else {
                      setSelectedBrands(selectedBrands.filter((id) => id !== brand.id))
                    }
                  }}
                />
                <Label htmlFor={brand.id} className="flex-1 text-sm font-normal cursor-pointer">
                  {brand.name}
                </Label>
                <span className="text-xs text-muted-foreground">{brand.count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <div className="mt-2 space-y-2">
            {statuses.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={status.id}
                  checked={selectedStatuses.includes(status.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatuses([...selectedStatuses, status.id])
                    } else {
                      setSelectedStatuses(selectedStatuses.filter((id) => id !== status.id))
                    }
                  }}
                />
                <Label htmlFor={status.id} className="flex-1 text-sm font-normal cursor-pointer">
                  {status.name}
                </Label>
                <span className="text-xs text-muted-foreground">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
