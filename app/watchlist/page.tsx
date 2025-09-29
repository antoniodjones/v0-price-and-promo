"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ErrorBoundary } from "@/components/error-boundary"
import {
  Heart,
  HeartOff,
  Bell,
  BellOff,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Star,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface WatchlistItem {
  id: string
  product_id: string
  user_id: string
  target_price: number | null
  is_active: boolean
  created_at: string
  products: {
    id: string
    name: string
    sku: string
    brand: string
    category: string
    price: number
    inventory_count: number
    thc_percentage: number
  }
  price_change_24h?: number
  price_change_percentage?: number
}

interface Product {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  price: number
  inventory_count: number
  thc_percentage: number
}

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [targetPrice, setTargetPrice] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<WatchlistItem | null>(null)
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadWatchlistData()
    loadAvailableProducts()
  }, [])

  const loadWatchlistData = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your watchlist.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("price_alerts")
        .select(`
          *,
          products (
            id,
            name,
            sku,
            brand,
            category,
            price,
            inventory_count,
            thc_percentage
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading watchlist:", error)
        toast({
          title: "Error",
          description: "Failed to load your watchlist. Please try again.",
          variant: "destructive",
        })
        return
      }

      setWatchlistItems(data || [])
    } catch (error) {
      console.error("Error loading watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to load your watchlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, brand, category, price, inventory_count, thc_percentage")
        .gt("inventory_count", 0)
        .order("name")

      if (error) {
        console.error("Error loading products:", error)
        return
      }

      setAvailableProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const addToWatchlist = async () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product to add to your watchlist.",
        variant: "destructive",
      })
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to add items to your watchlist.",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        product_id: selectedProduct,
        target_price: targetPrice ? Number.parseFloat(targetPrice) : null,
        is_active: true,
        alert_type: "watchlist",
      })

      if (error) {
        console.error("Error adding to watchlist:", error)
        toast({
          title: "Error",
          description: "Failed to add product to watchlist. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Product added to your watchlist successfully!",
      })

      setIsAddDialogOpen(false)
      setSelectedProduct("")
      setTargetPrice("")
      loadWatchlistData()
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to add product to watchlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromWatchlist = async (itemId: string) => {
    try {
      const { error } = await supabase.from("price_alerts").delete().eq("id", itemId)

      if (error) {
        console.error("Error removing from watchlist:", error)
        toast({
          title: "Error",
          description: "Failed to remove item from watchlist. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Item removed from your watchlist.",
      })

      loadWatchlistData()
    } catch (error) {
      console.error("Error removing from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from watchlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleAlert = async (itemId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("price_alerts").update({ is_active: isActive }).eq("id", itemId)

      if (error) {
        console.error("Error updating alert:", error)
        toast({
          title: "Error",
          description: "Failed to update alert settings. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `Alert ${isActive ? "enabled" : "disabled"} successfully.`,
      })

      loadWatchlistData()
    } catch (error) {
      console.error("Error updating alert:", error)
      toast({
        title: "Error",
        description: "Failed to update alert settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTargetPrice = async (itemId: string, newTargetPrice: number | null) => {
    try {
      const { error } = await supabase.from("price_alerts").update({ target_price: newTargetPrice }).eq("id", itemId)

      if (error) {
        console.error("Error updating target price:", error)
        toast({
          title: "Error",
          description: "Failed to update target price. Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Target price updated successfully.",
      })

      setEditingAlert(null)
      loadWatchlistData()
    } catch (error) {
      console.error("Error updating target price:", error)
      toast({
        title: "Error",
        description: "Failed to update target price. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getPriceChangeDisplay = (item: WatchlistItem) => {
    if (!item.price_change_24h || item.price_change_24h === 0) return null

    const isPositive = item.price_change_24h > 0
    const color = isPositive ? "text-red-500" : "text-green-500"
    const icon = isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-xs">
          ${Math.abs(item.price_change_24h).toFixed(2)} ({Math.abs(item.price_change_percentage || 0).toFixed(1)}%)
        </span>
      </div>
    )
  }

  const getAlertStatus = (item: WatchlistItem) => {
    if (!item.target_price) return null

    const currentPrice = item.products.price
    const targetPrice = item.target_price

    if (currentPrice <= targetPrice) {
      return (
        <Badge variant="default" className="bg-green-500">
          Target Reached
        </Badge>
      )
    }

    const percentageAway = ((currentPrice - targetPrice) / targetPrice) * 100
    if (percentageAway <= 10) {
      return <Badge variant="secondary">Close to Target</Badge>
    }

    return <Badge variant="outline">Monitoring</Badge>
  }

  const filteredItems = watchlistItems.filter(
    (item) =>
      item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.products?.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your watchlist...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">My Watchlist</h2>
              <p className="text-muted-foreground">Track your favorite products and get price alerts</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Product to Watchlist</DialogTitle>
                  <DialogDescription>
                    Select a product to track and optionally set a target price for alerts.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-select">Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {product.brand} • ${product.price.toFixed(2)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target-price">Target Price (Optional)</Label>
                    <Input
                      id="target-price"
                      type="number"
                      step="0.01"
                      placeholder="Enter target price"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addToWatchlist}>Add to Watchlist</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Watched Products</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{watchlistItems.length}</div>
                <p className="text-xs text-muted-foreground">In your watchlist</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <Bell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {watchlistItems.filter((item) => item.is_active && item.target_price).length}
                </div>
                <p className="text-xs text-muted-foreground">Price alerts enabled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Targets Reached</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    watchlistItems.filter((item) => item.target_price && item.products.price <= item.target_price)
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Ready to buy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24.50</div>
                <p className="text-xs text-muted-foreground">Per target reached</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search your watchlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Watchlist Content */}
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your Watchlist is Empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking products to get notified when prices drop or reach your target.
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg leading-tight mb-1">
                              {item.products?.name || "Unknown Product"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.products?.brand} • {item.products?.category}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">SKU: {item.products?.sku}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromWatchlist(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <HeartOff className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Current Price</span>
                            <div className="text-right">
                              <span className="font-semibold text-lg">${item.products?.price.toFixed(2)}</span>
                              {getPriceChangeDisplay(item)}
                            </div>
                          </div>

                          {item.target_price && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Target Price</span>
                              <span className="font-medium">${item.target_price.toFixed(2)}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Stock</span>
                            <span className="font-medium">{item.products?.inventory_count} units</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">THC</span>
                            <span className="font-medium">{item.products?.thc_percentage}%</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.is_active}
                                onCheckedChange={(checked) => toggleAlert(item.id, checked)}
                              />
                              {item.is_active ? (
                                <Bell className="h-4 w-4 text-primary" />
                              ) : (
                                <BellOff className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {item.is_active ? "Alerts On" : "Alerts Off"}
                              </span>
                            </div>
                            {getAlertStatus(item)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="table" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Watchlist Items</CardTitle>
                  <CardDescription>Manage your tracked products and price alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your Watchlist is Empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Start tracking products to get notified when prices drop.
                      </p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Target Price</TableHead>
                          <TableHead>24h Change</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Alerts</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.products?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.products?.brand} • {item.products?.sku}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">${item.products?.price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                              {item.target_price ? (
                                <div className="font-medium">${item.target_price.toFixed(2)}</div>
                              ) : (
                                <span className="text-muted-foreground">Not set</span>
                              )}
                            </TableCell>
                            <TableCell>{getPriceChangeDisplay(item)}</TableCell>
                            <TableCell>{item.products?.inventory_count} units</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={item.is_active}
                                  onCheckedChange={(checked) => toggleAlert(item.id, checked)}
                                />
                                {item.is_active ? (
                                  <Bell className="h-4 w-4 text-primary" />
                                ) : (
                                  <BellOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getAlertStatus(item)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingAlert(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromWatchlist(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Alert Dialog */}
          {editingAlert && (
            <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Price Alert</DialogTitle>
                  <DialogDescription>Update the target price for {editingAlert.products?.name}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-target-price">Target Price</Label>
                    <Input
                      id="edit-target-price"
                      type="number"
                      step="0.01"
                      defaultValue={editingAlert.target_price?.toString() || ""}
                      onChange={(e) => setTargetPrice(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingAlert(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      updateTargetPrice(editingAlert.id, targetPrice ? Number.parseFloat(targetPrice) : null)
                    }
                  >
                    Update Target Price
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
