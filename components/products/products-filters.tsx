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

const priceRanges = [
  { id: "0-25", name: "Under $25", min: 0, max: 25 },
  { id: "25-50", name: "$25 - $50", min: 25, max: 50 },
  { id: "50-100", name: "$50 - $100", min: 50, max: 100 },
  { id: "100+", name: "$100+", min: 100, max: 999999 },
]

const thcRanges = [
  { id: "0-10", name: "0-10%", min: 0, max: 10 },
  { id: "10-20", name: "10-20%", min: 10, max: 20 },
  { id: "20-30", name: "20-30%", min: 20, max: 30 },
  { id: "30+", name: "30%+", min: 30, max: 100 },
]

export function ProductsFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["active"])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedThcRanges, setSelectedThcRanges] = useState<string[]>([])

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedStatuses(["active"])
    setSelectedPriceRanges([])
    setSelectedThcRanges([])
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedPriceRanges.length +
    selectedThcRanges.length +
    (selectedStatuses.length > 1 ? selectedStatuses.length - 1 : 0)

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

        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="mt-2 space-y-2">
            {priceRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.id}`}
                  checked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPriceRanges([...selectedPriceRanges, range.id])
                    } else {
                      setSelectedPriceRanges(selectedPriceRanges.filter((id) => id !== range.id))
                    }
                  }}
                />
                <Label htmlFor={`price-${range.id}`} className="flex-1 text-sm font-normal cursor-pointer">
                  {range.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium">THC Percentage</Label>
          <div className="mt-2 space-y-2">
            {thcRanges.map((range) => (
              <div key={range.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`thc-${range.id}`}
                  checked={selectedThcRanges.includes(range.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedThcRanges([...selectedThcRanges, range.id])
                    } else {
                      setSelectedThcRanges(selectedThcRanges.filter((id) => id !== range.id))
                    }
                  }}
                />
                <Label htmlFor={`thc-${range.id}`} className="flex-1 text-sm font-normal cursor-pointer">
                  {range.name}
                </Label>
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
