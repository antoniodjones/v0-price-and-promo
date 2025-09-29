"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, SlidersHorizontal, Zap } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SearchFilters {
  search?: string
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

interface AdvancedProductSearchProps {
  onSearch: (filters: SearchFilters) => void
  categories: string[]
  brands: string[]
  loading?: boolean
}

export function AdvancedProductSearch({ onSearch, categories, brands, loading }: AdvancedProductSearchProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])

  const handleSearch = () => {
    const searchFilters: SearchFilters = {
      search: query || undefined,
      ...filters,
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 1000 ? priceRange[1] : undefined,
    }
    onSearch(searchFilters)
  }

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)

    if (key === "priceMin" || key === "priceMax") {
      setPriceRange([0, 1000])
    }

    const searchFilters: SearchFilters = {
      search: query || undefined,
      ...newFilters,
      priceMin: key === "priceMin" || key === "priceMax" ? undefined : priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: key === "priceMin" || key === "priceMax" ? undefined : priceRange[1] < 1000 ? priceRange[1] : undefined,
    }
    onSearch(searchFilters)
  }

  const clearAllFilters = () => {
    setQuery("")
    setFilters({})
    setPriceRange([0, 1000])
    onSearch({})
  }

  const activeFiltersCount = Object.keys(filters).length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)

  const quickFilters = [
    { label: "In Stock", key: "inStock", value: true },
    { label: "Under $50", key: "priceMax", value: 50 },
    { label: "Premium ($100+)", key: "priceMin", value: 100 },
  ]

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Main Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Quick filters:
          </span>
          {quickFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              size="sm"
              onClick={() => {
                const newFilters = { ...filters, [filter.key]: filter.value }
                setFilters(newFilters)
                if (filter.key === "priceMax") setPriceRange([0, filter.value])
                if (filter.key === "priceMin") setPriceRange([filter.value, 1000])
                onSearch({ search: query || undefined, ...newFilters })
              }}
              className="h-7 text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Brand</Label>
                <Select
                  value={filters.brand || "all"}
                  onValueChange={(value) => setFilters({ ...filters, brand: value === "all" ? undefined : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select
                  value={filters.sortBy || "name"}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="created_at">Date Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Availability</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="in-stock"
                    checked={filters.inStock || false}
                    onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked || undefined })}
                  />
                  <Label htmlFor="in-stock" className="text-sm">
                    In stock only
                  </Label>
                </div>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={1000} min={0} step={5} className="w-full" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1" disabled={loading}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                Category: {filters.category}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("category")} />
              </Badge>
            )}
            {filters.brand && (
              <Badge variant="secondary" className="gap-1">
                Brand: {filters.brand}
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("brand")} />
              </Badge>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="secondary" className="gap-1">
                Price: ${priceRange[0]} - ${priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setPriceRange([0, 1000])
                    clearFilter("priceMin")
                  }}
                />
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                In Stock Only
                <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("inStock")} />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
