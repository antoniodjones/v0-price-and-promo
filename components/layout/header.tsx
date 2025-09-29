"use client"

import { Bell, Search, User, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface SearchResult {
  products: Array<{
    id: string
    name: string
    brand: string
    category: string
    sku: string
    price: number
  }>
  customers: Array<{
    id: string
    name: string
    email: string
    company?: string
  }>
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const performSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults(null)
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data)
        setShowResults(true)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleResultClick = (type: "product" | "customer", id: string) => {
    setShowResults(false)
    setSearchQuery("")
    if (type === "product") {
      router.push(`/products/${id}`)
    } else {
      router.push(`/customers/${id}`)
    }
  }

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-emerald-400">Pricing & Promotions</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products, customers..."
            className="pl-10 w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults && setShowResults(true)}
          />

          {showResults && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.products.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Products
                  </div>
                  {searchResults.products.map((product) => (
                    <button
                      key={product.id}
                      className="w-full text-left px-2 py-2 hover:bg-muted rounded-sm"
                      onClick={() => handleResultClick("product", product.id)}
                    >
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.brand} • {product.category} • ${product.price}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.customers.length > 0 && (
                <div className="p-2 border-t border-border">
                  <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Customers
                  </div>
                  {searchResults.customers.map((customer) => (
                    <button
                      key={customer.id}
                      className="w-full text-left px-2 py-2 hover:bg-muted rounded-sm"
                      onClick={() => handleResultClick("customer", customer.id)}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email} {customer.company && `• ${customer.company}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.products.length === 0 && searchResults.customers.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">No results found for "{searchQuery}"</div>
              )}
            </div>
          )}

          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
