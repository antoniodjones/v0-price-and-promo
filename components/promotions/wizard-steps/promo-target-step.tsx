"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Calendar, Percent, X } from "lucide-react"
import type { PromoFormData } from "../promotional-discount-wizard"

interface PromoTargetStepProps {
  formData: PromoFormData
  updateFormData: (updates: Partial<PromoFormData>) => void
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  subCategory: string
  brand: string
  batchId: string
  thcPercentage: number
  basePrice: number
  expirationDate: string
  status: string
}

interface BatchInfo {
  batchId: string
  products: Product[]
  totalProducts: number
  avgThc: number
  avgPrice: number
  expirationDate: string
  daysUntilExpiration: number
}

export function PromoTargetStep({ formData, updateFormData }: PromoTargetStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [batches, setBatches] = useState<BatchInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBatches, setSelectedBatches] = useState<BatchInfo[]>([])

  useEffect(() => {
    if (formData.level === "batch") {
      fetchBatches()
    } else {
      fetchProducts()
    }
  }, [formData.level])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const result = await response.json()
        setProducts(result.data || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBatches = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const result = await response.json()
        const products = result.data || []

        // Group products by batch
        const batchMap = new Map<string, Product[]>()
        products.forEach((product: Product) => {
          if (!batchMap.has(product.batchId)) {
            batchMap.set(product.batchId, [])
          }
          batchMap.get(product.batchId)!.push(product)
        })

        // Convert to batch info
        const batchInfos: BatchInfo[] = Array.from(batchMap.entries()).map(([batchId, batchProducts]) => {
          const avgThc = batchProducts.reduce((sum, p) => sum + p.thcPercentage, 0) / batchProducts.length
          const avgPrice = batchProducts.reduce((sum, p) => sum + p.basePrice, 0) / batchProducts.length
          const expirationDate = batchProducts[0].expirationDate
          const daysUntilExpiration = Math.ceil(
            (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )

          return {
            batchId,
            products: batchProducts,
            totalProducts: batchProducts.length,
            avgThc: Math.round(avgThc * 10) / 10,
            avgPrice: Math.round(avgPrice * 100) / 100,
            expirationDate,
            daysUntilExpiration,
          }
        })

        setBatches(batchInfos.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration))
      }
    } catch (error) {
      console.error("[v0] Error fetching batches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBatchSelect = (batch: BatchInfo) => {
    const isSelected = selectedBatches.some((b) => b.batchId === batch.batchId)
    let newSelectedBatches: BatchInfo[]

    if (isSelected) {
      newSelectedBatches = selectedBatches.filter((b) => b.batchId !== batch.batchId)
    } else {
      newSelectedBatches = [...selectedBatches, batch]
    }

    setSelectedBatches(newSelectedBatches)

    updateFormData({
      batchIds: newSelectedBatches.map((b) => b.batchId),
      batchNames: newSelectedBatches.map((b) => `${b.batchId} (${b.totalProducts} items)`),
      targetId: newSelectedBatches.map((b) => b.batchId).join(","),
      targetName: newSelectedBatches.map((b) => b.batchId).join(", "),
    })
  }

  const handleTargetSelect = (target: any) => {
    let targetId = ""
    let targetName = ""

    switch (formData.level) {
      case "item":
        targetId = target.id
        targetName = target.name
        break
      case "brand":
        targetId = target.brand
        targetName = target.brand
        break
      case "category":
        targetId = target.category
        targetName = target.category
        break
      case "subcategory":
        targetId = target.subCategory
        targetName = target.subCategory
        break
    }

    updateFormData({ targetId, targetName })
  }

  const getFilteredItems = () => {
    if (formData.level === "batch") {
      return batches.filter(
        (batch) =>
          batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          batch.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    switch (formData.level) {
      case "item":
        return filtered
      case "brand":
        return Array.from(new Set(filtered.map((p) => p.brand))).map((brand) => ({ brand }))
      case "category":
        return Array.from(new Set(filtered.map((p) => p.category))).map((category) => ({ category }))
      case "subcategory":
        return Array.from(new Set(filtered.map((p) => p.subCategory))).map((subCategory) => ({ subCategory }))
      default:
        return []
    }
  }

  const renderBatchCard = (batch: BatchInfo) => {
    const isSelected = selectedBatches.some((b) => b.batchId === batch.batchId)
    const isExpiringSoon = batch.daysUntilExpiration <= 30
    const isExpired = batch.daysUntilExpiration <= 0

    return (
      <Card
        key={batch.batchId}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "ring-2 ring-gti-bright-green border-gti-bright-green" : "hover:border-gti-light-green"
        }`}
        onClick={() => handleBatchSelect(batch)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                {batch.batchId}
                {isSelected && (
                  <Badge variant="secondary" className="bg-gti-bright-green text-white">
                    Selected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{batch.totalProducts} products in batch</CardDescription>
            </div>
            {(isExpiringSoon || isExpired) && (
              <Badge variant="destructive" className="text-xs">
                {isExpired ? "EXPIRED" : `${batch.daysUntilExpiration} days left`}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span>Avg THC: {batch.avgThc}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <span>Avg Price: ${batch.avgPrice}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Expires: {new Date(batch.expirationDate).toLocaleDateString()}</span>
            </div>
          </div>
          {isExpiringSoon && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded-md">
              <p className="text-xs text-yellow-700">🔥 Perfect for liquidation - expires soon!</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gti-dark-green">
          Select {formData.level === "batch" ? "Batches" : "Target"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {formData.level === "batch"
            ? "Choose specific inventory batches for this promotion (great for liquidation)"
            : `Choose the specific ${formData.level} for this promotion`}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={`Search ${formData.level === "batch" ? "batches" : formData.level}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Batches Summary */}
      {formData.level === "batch" && selectedBatches.length > 0 && (
        <Card className="bg-gti-light-green/10 border-gti-light-green">
          <CardHeader>
            <CardTitle className="text-lg">Selected Batches ({selectedBatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedBatches.map((batch) => (
                <Badge key={batch.batchId} variant="secondary" className="bg-gti-bright-green text-white">
                  {batch.batchId} ({batch.totalProducts} items)
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBatchSelect(batch)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {formData.level === "batch"
              ? getFilteredItems().map((batch) => renderBatchCard(batch as BatchInfo))
              : getFilteredItems().map((item: any, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.targetId === (item.id || item.brand || item.category || item.subCategory)
                        ? "ring-2 ring-gti-bright-green border-gti-bright-green"
                        : "hover:border-gti-light-green"
                    }`}
                    onClick={() => handleTargetSelect(item)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {item.name || item.brand || item.category || item.subCategory}
                      </CardTitle>
                      {item.brand && formData.level === "item" && (
                        <CardDescription>
                          {item.brand} • {item.category}
                        </CardDescription>
                      )}
                    </CardHeader>
                    {item.basePrice && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Base Price: ${item.basePrice}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
          </div>
        )}
      </div>

      {/* Current Selection */}
      {(formData.targetName || formData.batchNames.length > 0) && (
        <div className="bg-gti-light-green/10 border border-gti-light-green rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gti-bright-green rounded-full"></div>
            <p className="text-sm font-medium text-gti-dark-green">
              Selected: {formData.level === "batch" ? formData.batchNames.join(", ") : formData.targetName}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
