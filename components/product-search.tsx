"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface SearchFilters {
  category?: string
  brand?: string
  priceRange?: { min: number; max: number }
  inStock?: boolean
}

interface ProductSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
  categories: string[]
  brands: string[]
}

export function ProductSearch({ onSearch, categories, brands }: ProductSearchProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    onSearch(query, newFilters)
  }

  const activeFiltersCount = Object.keys(filters).length

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
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

          <div>
            <label className="text-sm font-medium mb-2 block">Brand</label>
            <Select value={filters.brand || "all"} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
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

          <div>
            <label className="text-sm font-medium mb-2 block">Price Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.min || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: {
                      ...filters.priceRange,
                      min: Number.parseFloat(e.target.value) || 0,
                      max: filters.priceRange?.max || 1000,
                    },
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: {
                      min: filters.priceRange?.min || 0,
                      max: Number.parseFloat(e.target.value) || 1000,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({})
                onSearch(query, {})
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
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
          {filters.priceRange && (
            <Badge variant="secondary" className="gap-1">
              Price: ${filters.priceRange.min} - ${filters.priceRange.max}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("priceRange")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
