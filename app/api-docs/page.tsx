"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Code examples stored as constants to avoid linter parsing issues
const CODE_EXAMPLES = {
  typescript: `import { GTIPricingAPI } from '@gti/pricing-sdk'

const api = new GTIPricingAPI({
  baseUrl: 'https://your-domain.com/api',
  apiKey: 'your-api-key'
})

// Calculate pricing with discounts
const pricingResponse = await api.pricing.calculate({
  items: [
    { productId: 'prod_123', quantity: 2 }
  ],
  customerId: 'cust_456',
  market: 'california'
})

// Create a BOGO promotion
const bogoResponse = await api.promotions.createBOGO({
  name: 'Buy 2 Get 1 Free Edibles',
  triggerValue: 2,
  rewardValue: 1,
  category: 'edibles',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-02-14')
})

// Set up price alerts
const alertResponse = await api.tracking.createAlert({
  productId: 'prod_789',
  alertType: 'price_drop',
  targetPrice: 45.00
})

// Get real-time analytics
const analyticsResponse = await api.analytics.getRealtime({
  metrics: ['activeUsers', 'currentRevenue', 'promotionUsage'],
  interval: 30
})

// Generate custom reports
const reportResponse = await api.analytics.generateReport({
  reportType: 'promotion_performance',
  dateRange: {
    start: '2024-01-01',
    end: '2024-01-31'
  },
  filters: {
    promotionTypes: ['bogo', 'percentage_discount']
  }
})`,

  python: `import requests
from datetime import datetime
import json

class GTIPricingClient:
    def __init__(self, base_url, api_key=None):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}
        if api_key:
            self.headers['Authorization'] = f'Bearer {api_key}'
    
    def calculate_pricing(self, items, customer_id=None, market=None):
        response = requests.post(
            f"{self.base_url}/pricing/calculate",
            json={
                "items": items,
                "customerId": customer_id,
                "market": market
            },
            headers=self.headers
        )
        return response.json()
    
    def create_bogo_promotion(self, name, trigger_value, reward_value, **kwargs):
        promotion_data = {
            "name": name,
            "type": "buy_x_get_y",
            "triggerValue": trigger_value,
            "rewardValue": reward_value,
            **kwargs
        }
        response = requests.post(
            f"{self.base_url}/promotions/bogo",
            json=promotion_data,
            headers=self.headers
        )
        return response.json()
    
    def get_analytics(self, timeframe='30d', metrics=None):
        params = {"timeframe": timeframe}
        if metrics:
            params["metrics"] = ",".join(metrics)
        
        response = requests.get(
            f"{self.base_url}/analytics/dashboard",
            params=params,
            headers=self.headers
        )
        return response.json()
    
    def get_realtime_analytics(self, metrics=None, interval=30):
        params = {"interval": interval}
        if metrics:
            params["metrics"] = ",".join(metrics)
        
        response = requests.get(
            f"{self.base_url}/analytics/realtime",
            params=params,
            headers=self.headers
        )
        return response.json()

# Usage Examples
client = GTIPricingClient("https://your-domain.com/api", "your-api-key")

# Calculate pricing
response = client.calculate_pricing([
    {"productId": "prod_123", "quantity": 1}
], customer_id="cust_456", market="california")
print(f"Total: $" + str(response["calculation"]["total"]))

# Create BOGO promotion
bogo = client.create_bogo_promotion(
    name="Weekend BOGO Special",
    trigger_value=2,
    reward_value=1,
    startDate="2024-02-01T00:00:00Z",
    endDate="2024-02-03T23:59:59Z"
)
print(f"Created promotion: {bogo['id']}")

# Get real-time analytics
realtime = client.get_realtime_analytics(
    metrics=["activeUsers", "currentRevenue"],
    interval=60
)
print(f"Active users: {realtime['metrics']['activeUsers']}")`,

  react: `import { useState, useEffect } from 'react'
import { useGTIPricing } from '@gti/pricing-react'

function PricingCalculator() {
  const { calculatePricing, loading, error } = useGTIPricing()
  const [cart, setCart] = useState([])
  const [pricing, setPricing] = useState(null)

  const handleCalculate = async () => {
    try {
      const result = await calculatePricing({
        items: cart,
        customerId: 'current-user-id',
        market: 'california'
      })
      setPricing(result.calculation)
    } catch (err) {
      console.error('Pricing calculation failed:', err)
    }
  }

  return (
    <div>
      {/* Cart items */}
      <div className="space-y-2">
        {cart.map((item) => (
          <div key={item.productId} className="flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span>$\{item.price}</span>
          </div>
        ))}
      </div>
      
      {/* Pricing summary */}
      {pricing && (
        <div className="mt-4 p-4 border rounded">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>$\{pricing.subtotal}</span>
          </div>
          {pricing.discounts.map((discount) => (
            <div key={discount.type} className="flex justify-between text-green-600">
              <span>{discount.name}:</span>
              <span>-$\{discount.amount}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>$\{pricing.total}</span>
          </div>
        </div>
      )}
      
      <button 
        onClick={handleCalculate}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Calculating...' : 'Calculate Price'}
      </button>
    </div>
  )
}`,

  websocket: `// JavaScript WebSocket client for real-time updates
class GTIRealtimeClient {
  constructor(wsUrl, apiKey) {
    this.wsUrl = wsUrl
    this.apiKey = apiKey
    this.ws = null
    this.listeners = new Map()
  }

  connect() {
    this.ws = new WebSocket(\`\${this.wsUrl}?auth=\${this.apiKey}\`)
    
    this.ws.onopen = () => {
      console.log('Connected to GTI real-time updates')
      this.subscribe(['pricing', 'promotions', 'analytics'])
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }
  }

  subscribe(channels) {
    this.ws.send(JSON.stringify({
      type: 'subscribe',
      channels: channels
    }))
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  handleMessage(data) {
    const listeners = this.listeners.get(data.type) || []
    listeners.forEach(callback => callback(data))
  }
}

// Usage
const client = new GTIRealtimeClient('wss://your-domain.com/ws', 'your-api-key')

client.on('price_change', (data) => {
  console.log(\`Price changed for \${data.productId}: \${data.newPrice}\`)
})

client.on('promotion_activated', (data) => {
  console.log(\`Promotion activated: \${data.promotionName}\`)
})

client.on('analytics_update', (data) => {
  updateDashboard(data.metrics)
})

client.connect()`,

  curl: `# Calculate pricing with market and customer context
curl -X POST https://your-domain.com/api/pricing/calculate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{
    "items": [{"productId": "prod_123", "quantity": 2}],
    "customerId": "cust_456",
    "market": "california"
  }'

# Create bundle deal promotion
curl -X POST https://your-domain.com/api/promotions/bundles \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Starter Bundle Deal",
    "products": [
      {"productId": "prod_123", "quantity": 1},
      {"productId": "prod_124", "quantity": 2}
    ],
    "bundlePrice": 89.99,
    "discountType": "fixed_amount",
    "discountValue": 25.00
  }'

# Get real-time analytics
curl -X GET "https://your-domain.com/api/analytics/realtime?metrics=activeUsers,currentRevenue&interval=30"

# Generate custom report
curl -X POST https://your-domain.com/api/analytics/reports \\
  -H "Content-Type: application/json" \\
  -d '{
    "reportType": "promotion_performance",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "filters": {
      "promotionTypes": ["bogo", "percentage_discount"]
    }
  }'

# Validate promotion before creation
curl -X POST https://your-domain.com/api/promotions/validate \\
  -H "Content-Type: application/json" \\
  -d '{
    "promotion": {
      "name": "Flash Sale",
      "type": "percentage_discount",
      "value": 25,
      "startDate": "2024-02-15T00:00:00Z",
      "endDate": "2024-02-17T23:59:59Z"
    },
    "checkConflicts": true
  }'

# Get predictive analytics
curl -X GET "https://your-domain.com/api/analytics/predictive?model=revenue&horizon=30d&confidence=0.85"

# Bulk pricing calculation
curl -X POST https://your-domain.com/api/pricing/bulk \\
  -H "Content-Type: application/json" \\
  -d '{
    "calculations": [
      {
        "id": "calc_1",
        "items": [{"productId": "prod_123", "quantity": 1}],
        "customerId": "cust_456"
      },
      {
        "id": "calc_2",
        "items": [{"productId": "prod_124", "quantity": 3}],
        "customerId": "cust_789"
      }
    ]
  }'`,
}

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">GTI Pricing Engine API Documentation</h1>
        <p className="text-lg">
          Complete API reference for integrating with the GTI Pricing Engine. Includes pricing calculations, promotion
          management, product tracking, and analytics endpoints.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>
                The GTI Pricing Engine API provides comprehensive pricing intelligence, promotion management, and
                analytics capabilities for cannabis retail operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Base URL</h3>
                  <code className="bg-muted p-2 rounded text-sm block">https://your-domain.com/api</code>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Content Type</h3>
                  <code className="bg-muted p-2 rounded text-sm block">application/json</code>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Rate Limits</h3>
                  <code className="bg-muted p-2 rounded text-sm block">1000 requests/hour</code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-accent-blue">Pricing & Calculations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/pricing/calculate</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/pricing/bulk</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/pricing/optimize</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-accent-green">Promotions & Discounts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/promotions</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/promotions/bogo</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/promotions/performance</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-accent-purple">Product Management</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/products</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/products</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/search</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-accent-yellow">Analytics & Reporting</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/analytics/dashboard</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/analytics/revenue-optimization</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/analytics/reports</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Calculation APIs</CardTitle>
              <CardDescription>Calculate prices, apply discounts, and optimize pricing strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">POST</Badge>
                  <code>/api/pricing/calculate</code>
                </div>
                <p className="text-sm mb-3">Calculate final price with all applicable discounts and promotions.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "customerId": "cust_456"
    }
  ],
  "market": "california",
  "customerTier": "premium"
}`}
                </pre>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "success": true,
  "calculation": {
    "subtotal": 120.00,
    "discounts": [
      {
        "type": "customer_tier",
        "name": "Premium 15% Off",
        "amount": 18.00
      }
    ],
    "total": 102.00,
    "savings": 18.00
  },
  "appliedPromotions": ["promo_789"]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">POST</Badge>
                  <code>/api/pricing/bulk</code>
                </div>
                <p className="text-sm mb-3">Calculate pricing for multiple products or scenarios simultaneously.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "calculations": [
    {
      "id": "calc_1",
      "items": [{"productId": "prod_123", "quantity": 1}],
      "customerId": "cust_456"
    },
    {
      "id": "calc_2", 
      "items": [{"productId": "prod_124", "quantity": 3}],
      "customerId": "cust_789"
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-purple pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-purple text-white">GET</Badge>
                  <code>/api/pricing/optimize</code>
                </div>
                <p className="text-sm mb-3">Get AI-powered pricing optimization recommendations.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>category</code> - Product category
                  </div>
                  <div>
                    <code>market</code> - Target market
                  </div>
                  <div>
                    <code>timeframe</code> - Analysis period
                  </div>
                  <div>
                    <code>strategy</code> - revenue|margin|volume
                  </div>
                </div>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "recommendations": [
    {
      "productId": "prod_123",
      "currentPrice": 60.00,
      "recommendedPrice": 65.00,
      "expectedImpact": {
        "revenueIncrease": 8.3,
        "marginImprovement": 12.1
      },
      "confidence": 0.87
    }
  ],
  "summary": {
    "totalPotentialRevenue": 47320,
    "averageConfidence": 0.84
  }
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-yellow pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-yellow text-black">GET</Badge>
                  <code>/api/pricing/market</code>
                </div>
                <p className="text-sm mb-3">Get market-specific pricing configurations and rules.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>market</code> - Market identifier
                  </div>
                  <div>
                    <code>category</code> - Product category filter
                  </div>
                  <div>
                    <code>includeRules</code> - Include pricing rules
                  </div>
                </div>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "market": {
    "id": "california",
    "name": "California",
    "currency": "USD",
    "taxRate": 0.0875,
    "regulations": {
      "maxThcLimit": 35.0,
      "requiresLabTesting": true
    }
  },
  "pricingRules": [
    {
      "id": "rule_123",
      "type": "volume_discount",
      "conditions": {"minQuantity": 10},
      "discount": 0.15
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">POST</Badge>
                  <code>/api/pricing/compare</code>
                </div>
                <p className="text-sm mb-3">Compare pricing across different scenarios or configurations.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "scenarios": [
    {
      "name": "Current Pricing",
      "items": [{"productId": "prod_123", "quantity": 2}],
      "customerId": "cust_456"
    },
    {
      "name": "With New Promotion",
      "items": [{"productId": "prod_123", "quantity": 2}],
      "customerId": "cust_456",
      "promotions": ["promo_new"]
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">GET</Badge>
                  <code>/api/pricing/history</code>
                </div>
                <p className="text-sm mb-3">Get historical pricing data and trends.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>productId</code> - Specific product
                  </div>
                  <div>
                    <code>timeframe</code> - 7d|30d|90d|1y
                  </div>
                  <div>
                    <code>granularity</code> - hourly|daily|weekly
                  </div>
                  <div>
                    <code>includePromotions</code> - Include promotion impact
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Management APIs</CardTitle>
              <CardDescription>Manage product catalog, inventory, and pricing data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">GET</Badge>
                  <code>/api/products</code>
                </div>
                <p className="text-sm mb-3">Retrieve products with filtering and pagination.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>category</code> - Filter by category
                  </div>
                  <div>
                    <code>brand</code> - Filter by brand
                  </div>
                  <div>
                    <code>search</code> - Search in name/description
                  </div>
                  <div>
                    <code>minPrice</code> - Minimum price filter
                  </div>
                  <div>
                    <code>maxPrice</code> - Maximum price filter
                  </div>
                  <div>
                    <code>inStock</code> - Only in-stock items
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">POST</Badge>
                  <code>/api/products</code>
                </div>
                <p className="text-sm mb-3">Create a new product in the catalog.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "name": "Blue Dream 1oz",
  "sku": "BD-1OZ-001",
  "category": "flower",
  "brand": "Premium Cannabis Co",
  "price": 280.00,
  "cost": 140.00,
  "thcPercentage": 22.5,
  "inventoryCount": 50,
  "expirationDate": "2024-12-31"
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-purple pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-purple text-white">GET</Badge>
                  <code>/api/search</code>
                </div>
                <p className="text-sm mb-3">Advanced product search with intelligent matching.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>q</code> - Search query
                  </div>
                  <div>
                    <code>filters</code> - JSON filter object
                  </div>
                  <div>
                    <code>sort</code> - Sort field
                  </div>
                  <div>
                    <code>order</code> - asc|desc
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Promotions & Discounts APIs</CardTitle>
              <CardDescription>Manage promotional campaigns, BOGO deals, and discount programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">GET</Badge>
                  <code>/api/promotions</code>
                </div>
                <p className="text-sm mb-3">List all active promotions and campaigns.</p>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "promotions": [
    {
      "id": "promo_123",
      "name": "Weekend Flash Sale",
      "type": "percentage_discount",
      "value": 20,
      "status": "active",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-17T23:59:59Z",
      "applicableProducts": ["category:edibles"],
      "usageCount": 89,
      "performance": 94.2
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">POST</Badge>
                  <code>/api/promotions/bogo</code>
                </div>
                <p className="text-sm mb-3">Create a new Buy-One-Get-One promotion.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "name": "BOGO Edibles Special",
  "type": "buy_x_get_y",
  "triggerLevel": "product",
  "triggerValue": 2,
  "rewardType": "free_item",
  "rewardValue": 1,
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-14T23:59:59Z",
  "applicableProducts": ["category:edibles"]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-purple pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-purple text-white">POST</Badge>
                  <code>/api/promotions/bundles</code>
                </div>
                <p className="text-sm mb-3">Create bundle deal promotions with multiple products.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "name": "Starter Bundle Deal",
  "type": "fixed_bundle",
  "products": [
    {"productId": "prod_123", "quantity": 1},
    {"productId": "prod_124", "quantity": 2}
  ],
  "bundlePrice": 89.99,
  "discountType": "fixed_amount",
  "discountValue": 25.00,
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-28T23:59:59Z"
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-yellow pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-yellow text-black">GET</Badge>
                  <code>/api/promotions/performance</code>
                </div>
                <p className="text-sm mb-3">Get detailed performance analytics for promotions.</p>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "performance": [
    {
      "promotionId": "promo_123",
      "metrics": {
        "totalUsage": 156,
        "revenueImpact": 12450.00,
        "customerSavings": 8920.00,
        "conversionRate": 23.4,
        "averageOrderValue": 89.50
      },
      "trends": {
        "dailyUsage": [12, 18, 25, 31, 28],
        "peakHours": [14, 15, 16, 19, 20]
      }
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">POST</Badge>
                  <code>/api/promotions/validate</code>
                </div>
                <p className="text-sm mb-3">Validate promotion rules and conflicts before activation.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "promotion": {
    "name": "New Flash Sale",
    "type": "percentage_discount",
    "value": 25,
    "startDate": "2024-02-15T00:00:00Z",
    "endDate": "2024-02-17T23:59:59Z",
    "applicableProducts": ["category:flower"]
  },
  "checkConflicts": true,
  "validateRules": true
}`}
                </pre>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "valid": true,
  "conflicts": [],
  "warnings": [
    {
      "type": "overlap",
      "message": "Overlaps with existing promotion 'Weekend Sale'",
      "severity": "medium"
    }
  ],
  "recommendations": [
    "Consider adjusting end date to avoid overlap",
    "Target different product categories for better performance"
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">PUT</Badge>
                  <code>/api/promotions/:id/status</code>
                </div>
                <p className="text-sm mb-3">Update promotion status (activate, pause, or deactivate).</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "status": "paused",
  "reason": "Inventory shortage",
  "scheduledReactivation": "2024-02-20T00:00:00Z"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting APIs</CardTitle>
              <CardDescription>Access comprehensive business intelligence and performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">GET</Badge>
                  <code>/api/analytics/dashboard</code>
                </div>
                <p className="text-sm mb-3">Get key metrics for the main dashboard.</p>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "metrics": {
    "totalRevenue": 2847320,
    "revenueChange": 12.5,
    "activePromotions": 47,
    "trackedProducts": 1247,
    "priceAlerts": 23,
    "avgMargin": 34.8,
    "customerSavings": 485920
  },
  "trends": {
    "revenue": [/* 30-day revenue data */],
    "margins": [/* 30-day margin data */]
  }
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">GET</Badge>
                  <code>/api/analytics/revenue-optimization</code>
                </div>
                <p className="text-sm mb-3">Get AI-powered revenue optimization insights.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>timeframe</code> - 7d|30d|90d|1y
                  </div>
                  <div>
                    <code>category</code> - Product category
                  </div>
                  <div>
                    <code>market</code> - Target market
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-purple pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-purple text-white">GET</Badge>
                  <code>/api/analytics/realtime</code>
                </div>
                <p className="text-sm mb-3">Get real-time analytics data and live metrics.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>metrics</code> - Comma-separated metric names
                  </div>
                  <div>
                    <code>interval</code> - Update interval in seconds
                  </div>
                </div>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "timestamp": "2024-01-15T14:30:00Z",
  "metrics": {
    "activeUsers": 127,
    "currentRevenue": 15420.50,
    "promotionUsage": 23,
    "inventoryAlerts": 5,
    "priceChanges": 12
  },
  "events": [
    {
      "type": "promotion_used",
      "promotionId": "promo_123",
      "timestamp": "2024-01-15T14:29:45Z"
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-yellow pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-yellow text-black">GET</Badge>
                  <code>/api/analytics/customers</code>
                </div>
                <p className="text-sm mb-3">Get customer analytics and segmentation insights.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>segment</code> - Customer segment filter
                  </div>
                  <div>
                    <code>timeframe</code> - Analysis period
                  </div>
                  <div>
                    <code>includeChurn</code> - Include churn analysis
                  </div>
                </div>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "segments": [
    {
      "name": "Premium Customers",
      "count": 234,
      "avgOrderValue": 127.50,
      "lifetimeValue": 2340.00,
      "churnRate": 0.05
    }
  ],
  "insights": {
    "topSpenders": [/* customer data */],
    "growthOpportunities": [/* segment recommendations */]
  }
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">GET</Badge>
                  <code>/api/analytics/discounts</code>
                </div>
                <p className="text-sm mb-3">Analyze discount effectiveness and ROI.</p>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "discountAnalysis": {
    "totalDiscountsGiven": 125430.00,
    "revenueGenerated": 456780.00,
    "roi": 3.64,
    "averageDiscountRate": 18.5
  },
  "topPerformingDiscounts": [
    {
      "type": "customer_tier",
      "usage": 1247,
      "revenue": 89450.00,
      "roi": 4.2
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">POST</Badge>
                  <code>/api/analytics/reports</code>
                </div>
                <p className="text-sm mb-3">Generate custom analytical reports.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "reportType": "promotion_performance",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "filters": {
    "promotionTypes": ["bogo", "percentage_discount"],
    "categories": ["flower", "edibles"]
  },
  "format": "json"
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-purple pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-purple text-white">GET</Badge>
                  <code>/api/analytics/predictive</code>
                </div>
                <p className="text-sm mb-3">Get predictive analytics and forecasting data.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>model</code> - revenue|demand|churn
                  </div>
                  <div>
                    <code>horizon</code> - Forecast period
                  </div>
                  <div>
                    <code>confidence</code> - Confidence interval
                  </div>
                </div>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "forecast": {
    "model": "revenue",
    "horizon": "30d",
    "predictions": [
      {
        "date": "2024-02-01",
        "value": 95420.00,
        "confidence": 0.87
      }
    ]
  },
  "insights": [
    "Revenue expected to grow 12% next month",
    "Flower category showing strongest growth"
  ]
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Tracking & Alerts APIs</CardTitle>
              <CardDescription>Monitor price changes, set alerts, and track market trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-yellow pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-yellow text-black">GET</Badge>
                  <code>/api/price-tracking/alerts</code>
                </div>
                <p className="text-sm mb-3">Get all active price alerts for a user.</p>

                <h5 className="font-semibold mb-2">Response:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "alerts": [
    {
      "id": "alert_123",
      "productId": "prod_456",
      "alertType": "price_drop",
      "targetPrice": 45.00,
      "currentPrice": 50.00,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">POST</Badge>
                  <code>/api/price-tracking/alerts</code>
                </div>
                <p className="text-sm mb-3">Create a new price alert.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "productId": "prod_456",
  "alertType": "price_drop",
  "targetPrice": 45.00,
  "notificationMethod": "email"
}`}
                </pre>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">GET</Badge>
                  <code>/api/price-tracking/history</code>
                </div>
                <p className="text-sm mb-3">Get price history for products.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>productId</code> - Specific product ID
                  </div>
                  <div>
                    <code>timeframe</code> - 7d|30d|90d|1y
                  </div>
                  <div>
                    <code>source</code> - Price source filter
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management APIs</CardTitle>
              <CardDescription>Manage users, roles, and permissions in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-accent-blue pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-blue text-white">GET</Badge>
                  <code>/api/users</code>
                </div>
                <p className="text-sm mb-3">List users with filtering and pagination.</p>

                <h5 className="font-semibold mb-2">Query Parameters:</h5>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <code>page</code> - Page number
                  </div>
                  <div>
                    <code>limit</code> - Items per page
                  </div>
                  <div>
                    <code>role</code> - Filter by role
                  </div>
                  <div>
                    <code>status</code> - Filter by status
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-accent-green pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-accent-green text-white">POST</Badge>
                  <code>/api/users</code>
                </div>
                <p className="text-sm mb-3">Create a new user account.</p>

                <h5 className="font-semibold mb-2">Request Body:</h5>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {`{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "manager",
  "department": "Sales",
  "status": "active"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>Complete code examples for common integration scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">JavaScript/TypeScript SDK</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{CODE_EXAMPLES.typescript}</pre>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Python Integration</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{CODE_EXAMPLES.python}</pre>
              </div>

              <div>
                <h4 className="font-semibold mb-3">cURL Examples</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{CODE_EXAMPLES.curl}</pre>
              </div>

              <div>
                <h4 className="font-semibold mb-3">React/Next.js Integration</h4>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">{CODE_EXAMPLES.react}</pre>
              </div>

              <div>
                <h4 className="font-semibold mb-3">WebSocket Real-time Updates</h4>
                <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">{CODE_EXAMPLES.websocket}</pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">🚀 Getting Started</h5>
                <p className="text-blue-700 text-sm mb-3">
                  Start with the pricing calculation endpoint to understand the core functionality, then explore
                  promotions and analytics. Check the health endpoint at
                  <code>/api/health</code> to verify your connection.
                </p>

                <h5 className="font-semibold text-blue-800 mb-2">📊 Best Practices</h5>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Use bulk endpoints for multiple calculations to reduce API calls</li>
                  <li>• Implement caching for frequently accessed data like product catalogs</li>
                  <li>• Subscribe to WebSocket updates for real-time pricing changes</li>
                  <li>• Validate promotions before activation to avoid conflicts</li>
                  <li>• Use predictive analytics to optimize inventory and pricing strategies</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
