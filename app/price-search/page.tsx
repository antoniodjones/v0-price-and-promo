"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, AlertCircle, ExternalLink, Filter, RefreshCw } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { useToast } from "@/hooks/use-toast"
import {
  searchProducts,
  getPriceSources,
  getProductCategories,
  refreshPriceData,
  type PriceComparison,
  type PriceSource,
} from "@/lib/supabase/price-search"

export default function PriceSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [sortBy, setSortBy] = useState("price-low")
  const [priceData, setPriceData] = useState<PriceComparison[]>([])
  const [priceSources, setPriceSources] = useState<PriceSource[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Filter and search when parameters change
  useEffect(() => {
    if (!isLoading) {
      handleSearch()
    }
  }, [searchQuery, selectedCategory, selectedSource, sortBy])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)

      // Load all initial data in parallel
      const [initialPriceData, sourcesData, categoriesData] = await Promise.all([
        searchProducts({ sortBy: "price-low" }),
        getPriceSources(),
        getProductCategories(),
      ])

      setPriceData(initialPriceData)
      setPriceSources(sourcesData)
      setCategories(categoriesData)

      console.log("[v0] PriceSearchPage: Loaded initial data", {
        products: initialPriceData.length,
        sources: sourcesData.length,
        categories: categoriesData.length,
      })
    } catch (error) {
      console.error("[v0] PriceSearchPage: Error loading initial data:", error)
      toast({
        title: "Error Loading Data",
        description: "Failed to load price data. Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      const filters = {
        searchQuery: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        source: selectedSource !== "all" ? selectedSource : undefined,
        sortBy,
      }

      console.log("[v0] PriceSearchPage: Searching with filters:", filters)

      const results = await searchProducts(filters)
      setPriceData(results)

      console.log("[v0] PriceSearchPage: Search completed, found", results.length, "results")
    } catch (error) {
      console.error("[v0] PriceSearchPage: Error searching products:", error)
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshPrices = async () => {
    try {
      setIsRefreshing(true)
      console.log("[v0] PriceSearchPage: Starting price refresh")

      await refreshPriceData()

      // Reload the current search results
      await handleSearch()

      toast({
        title: "Prices Refreshed",
        description: "Price data has been updated from all sources.",
      })

      console.log("[v0] PriceSearchPage: Price refresh completed")
    } catch (error) {
      console.error("[v0] PriceSearchPage: Error refreshing prices:", error)
      toast({
        title: "Refresh Error",
        description: "Failed to refresh price data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Group data by product for comparison view
  const groupedData = priceData.reduce(
    (acc, item) => {
      const key = `${item.product_name}-${item.brand}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, PriceComparison[]>,
  )

  const activeSources = priceSources.filter((s) => s.active)
  const sourceOptions = ["all", ...activeSources.map((s) => s.name)]
  const categoryOptions = ["all", ...categories]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Price Search & Comparison</h2>
            <p className="text-muted-foreground">Compare prices across multiple wholesale sources</p>
          </div>
          <Button
            onClick={handleRefreshPrices}
            disabled={isRefreshing}
            className="bg-gti-dark-green hover:bg-gti-medium-green text-white"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Prices"}
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Select value={selectedSource} onValueChange={setSelectedSource}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source === "all" ? "All Sources" : source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="change-desc">Biggest Price Drop</SelectItem>
                    <SelectItem value="change-asc">Biggest Price Increase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="comparison">Comparison View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {priceData.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or refresh price data</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {priceData.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{item.product_name}</h3>
                            <Badge variant="secondary">{item.category}</Badge>
                            {item.promotion_active && (
                              <Badge className="bg-gti-bright-green text-white">Promotion</Badge>
                            )}
                            {!item.in_stock && <Badge variant="destructive">Out of Stock</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Source: {item.source}</span>
                            <span>Updated: {item.last_updated}</span>
                          </div>
                          {item.promotion_details && (
                            <p className="text-sm text-gti-bright-green mt-1">{item.promotion_details}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold">${item.current_price.toFixed(2)}</div>
                          {item.price_change !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                item.price_change > 0 ? "text-red-500" : "text-gti-bright-green"
                              }`}
                            >
                              {item.price_change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {item.price_change > 0 ? "+" : ""}${item.price_change.toFixed(2)} (
                              {item.price_change_percent > 0 ? "+" : ""}
                              {item.price_change_percent.toFixed(1)}%)
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            Was: ${item.previous_price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {Object.entries(groupedData).map(([productKey, items]) => (
              <Card key={productKey}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3>{items[0].product_name}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{items[0].brand}</p>
                    </div>
                    <Badge variant="secondary">{items[0].category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{item.source}</h4>
                          <div className="flex items-center gap-2">
                            {item.promotion_active && (
                              <Badge className="bg-gti-bright-green text-white text-xs">Promo</Badge>
                            )}
                            {!item.in_stock && (
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-xl font-bold">${item.current_price.toFixed(2)}</div>
                          {item.price_change !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                item.price_change > 0 ? "text-red-500" : "text-gti-bright-green"
                              }`}
                            >
                              {item.price_change > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {item.price_change > 0 ? "+" : ""}${item.price_change.toFixed(2)}
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>Updated: {item.last_updated}</div>
                          {item.promotion_details && (
                            <div className="text-gti-bright-green mt-1">{item.promotion_details}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Price Sources Status */}
        <Card>
          <CardHeader>
            <CardTitle>Price Sources</CardTitle>
            <CardDescription>Monitor the status of your price data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {priceSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-xs text-muted-foreground">{source.url}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${source.active ? "bg-gti-bright-green" : "bg-red-500"}`} />
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
