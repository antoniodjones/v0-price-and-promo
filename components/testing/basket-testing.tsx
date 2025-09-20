"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Play, Save, ShoppingCart } from "lucide-react"

interface BasketItem {
  id: string
  productName: string
  sku: string
  quantity: number
  basePrice: number
  category: string
  brand: string
}

interface TestResult {
  item: BasketItem
  appliedDiscount: string
  discountAmount: number
  finalPrice: number
  reasoning: string
}

export function BasketTesting() {
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [testDate, setTestDate] = useState("")
  const [basketItems, setBasketItems] = useState<BasketItem[]>([
    {
      id: "1",
      productName: "Premium Blue Dream - 1oz",
      sku: "FLOWER-001",
      quantity: 10,
      basePrice: 240.0,
      category: "Flower",
      brand: "Premium Cannabis Co",
    },
    {
      id: "2",
      productName: "Incredibles Gummies - 500mg",
      sku: "EDIBLE-045",
      quantity: 5,
      basePrice: 60.0,
      category: "Edibles",
      brand: "Incredibles",
    },
  ])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const customers = [
    { id: "cust-001", name: "Elite Cannabis Co", tier: "A-Tier" },
    { id: "cust-002", name: "Premium Dispensary LLC", tier: "A-Tier" },
    { id: "cust-003", name: "High Volume Buyer", tier: "B-Tier" },
    { id: "cust-004", name: "Dispensary ABC", tier: "B-Tier" },
    { id: "cust-005", name: "New Customer", tier: "C-Tier" },
  ]

  const addBasketItem = () => {
    const newItem: BasketItem = {
      id: Date.now().toString(),
      productName: "",
      sku: "",
      quantity: 1,
      basePrice: 0,
      category: "",
      brand: "",
    }
    setBasketItems([...basketItems, newItem])
  }

  const removeBasketItem = (id: string) => {
    setBasketItems(basketItems.filter((item) => item.id !== id))
  }

  const updateBasketItem = (id: string, field: keyof BasketItem, value: string | number) => {
    setBasketItems(basketItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const runPricingTest = async () => {
    setIsRunning(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock test results
    const mockResults: TestResult[] = basketItems.map((item) => {
      let appliedDiscount = "No discount"
      let discountAmount = 0
      let reasoning = "Base pricing applied"

      // Mock discount logic
      if (selectedCustomer === "cust-001" && item.brand === "Premium Cannabis Co") {
        appliedDiscount = "Customer Discount (8%)"
        discountAmount = item.basePrice * 0.08
        reasoning = "Elite Cannabis Co has 8% discount on Premium Cannabis Co products"
      } else if (item.brand === "Incredibles" && item.quantity >= 5) {
        appliedDiscount = "Volume Discount (6%)"
        discountAmount = item.basePrice * 0.06
        reasoning = "Volume discount for 5+ Incredibles products"
      } else if (selectedCustomer === "cust-003" && basketItems.reduce((sum, i) => sum + i.quantity, 0) >= 15) {
        appliedDiscount = "Total Order Volume (5%)"
        discountAmount = item.basePrice * 0.05
        reasoning = "High Volume Buyer tier B discount for 15+ total units"
      }

      return {
        item,
        appliedDiscount,
        discountAmount,
        finalPrice: item.basePrice - discountAmount,
        reasoning,
      }
    })

    setTestResults(mockResults)
    setIsRunning(false)
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "A-Tier":
        return <Badge className="bg-green-100 text-green-800">A-Tier</Badge>
      case "B-Tier":
        return <Badge className="bg-blue-100 text-blue-800">B-Tier</Badge>
      case "C-Tier":
        return <Badge className="bg-purple-100 text-purple-800">C-Tier</Badge>
      default:
        return <Badge variant="outline">{tier}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gti-green" />
            Basket Testing Configuration
          </CardTitle>
          <CardDescription>Create a test basket and validate pricing calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Select Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center gap-2">
                        {customer.name}
                        {getTierBadge(customer.tier)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="testDate">Test Date (Optional)</Label>
              <Input
                id="testDate"
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                placeholder="Leave blank for current date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basket Items */}
      <Card>
        <CardHeader>
          <CardTitle>Test Basket Items</CardTitle>
          <CardDescription>Add products to test pricing scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {basketItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.productName}
                        onChange={(e) => updateBasketItem(item.id, "productName", e.target.value)}
                        placeholder="Product name..."
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.sku}
                        onChange={(e) => updateBasketItem(item.id, "sku", e.target.value)}
                        placeholder="SKU..."
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateBasketItem(item.id, "quantity", Number.parseInt(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.basePrice}
                        onChange={(e) => updateBasketItem(item.id, "basePrice", Number.parseFloat(e.target.value))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.category}
                        onValueChange={(value) => updateBasketItem(item.id, "category", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flower">Flower</SelectItem>
                          <SelectItem value="Edibles">Edibles</SelectItem>
                          <SelectItem value="Concentrates">Concentrates</SelectItem>
                          <SelectItem value="Vapes">Vapes</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.brand}
                        onChange={(e) => updateBasketItem(item.id, "brand", e.target.value)}
                        placeholder="Brand..."
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeBasketItem(item.id)}
                        disabled={basketItems.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex gap-2">
              <Button onClick={addBasketItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button
                onClick={runPricingTest}
                disabled={!selectedCustomer || isRunning}
                className="bg-gti-green hover:bg-gti-green/90"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running Test..." : "Run Pricing Test"}
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Pricing calculations and applied discounts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Applied Discount</TableHead>
                  <TableHead>Discount Amount</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Reasoning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{result.item.productName}</div>
                      <div className="text-sm text-gray-600">Qty: {result.item.quantity}</div>
                    </TableCell>
                    <TableCell>${result.item.basePrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={result.appliedDiscount === "No discount" ? "outline" : "default"}>
                        {result.appliedDiscount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">
                      {result.discountAmount > 0 ? `-$${result.discountAmount.toFixed(2)}` : "$0.00"}
                    </TableCell>
                    <TableCell className="font-medium text-gti-green">${result.finalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs">{result.reasoning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Total Items</div>
                  <div className="font-medium text-lg">{basketItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Subtotal</div>
                  <div className="font-medium text-lg">
                    $
                    {testResults
                      .reduce((sum, result) => sum + result.item.basePrice * result.item.quantity, 0)
                      .toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Total Discounts</div>
                  <div className="font-medium text-lg text-red-600">
                    -$
                    {testResults
                      .reduce((sum, result) => sum + result.discountAmount * result.item.quantity, 0)
                      .toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Final Total</div>
                  <div className="font-medium text-lg text-gti-green">
                    ${testResults.reduce((sum, result) => sum + result.finalPrice * result.item.quantity, 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
