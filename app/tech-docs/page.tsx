"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Zap, GitBranch, Settings, FileCode, AlertCircle, CheckCircle, TrendingUp } from "lucide-react"

export default function TechnicalDocumentationPage() {
  return (
    <div className="container mx-auto py-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileCode className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Technical Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive developer guide for the GTI Pricing & Promotion Engine
        </p>
        <div className="flex gap-2">
          <Badge variant="outline">Version 1.0</Badge>
          <Badge variant="outline">Last Updated: 2025-10-01</Badge>
        </div>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump to specific sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="#architecture" className="text-primary hover:underline">
              Architecture
            </a>
            <a href="#components" className="text-primary hover:underline">
              Core Components
            </a>
            <a href="#data-models" className="text-primary hover:underline">
              Data Models
            </a>
            <a href="#api-reference" className="text-primary hover:underline">
              API Reference
            </a>
            <a href="#pricing-flow" className="text-primary hover:underline">
              Pricing Flow
            </a>
            <a href="#tier-system" className="text-primary hover:underline">
              Tier System
            </a>
            <a href="#performance" className="text-primary hover:underline">
              Performance
            </a>
            <a href="#integration" className="text-primary hover:underline">
              Integration
            </a>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <Card id="architecture">
            <CardHeader>
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                <CardTitle>System Architecture</CardTitle>
              </div>
              <CardDescription>High-level overview of the pricing engine architecture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Architecture Layers</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">1. Presentation Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      React components for discount rule wizard, customer tier dashboard, and bulk assignment tools
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">2. API Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Next.js API routes for CRUD operations on discount rules, tier assignments, and pricing
                      calculations
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">3. Business Logic Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Core pricing engines (PricingEngine, TierPricingEngine) with discount selection algorithms
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold">4. Data Access Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Database abstraction with Supabase PostgreSQL for persistent storage
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">5. Caching Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Redis (Upstash) for high-performance caching of discount rules, tier assignments, and pricing
                      calculations
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Design Principles</h3>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>
                    <strong>No Discount Stacking:</strong> Only one discount can be applied per product at a time
                  </li>
                  <li>
                    <strong>Best Discount Selection:</strong> Automatically selects the discount with highest savings
                    for customer
                  </li>
                  <li>
                    <strong>Hierarchical Rules:</strong> Discount rules can target brand, category, subcategory, or
                    product levels
                  </li>
                  <li>
                    <strong>Three-Tier System:</strong> Customers are assigned to A, B, or C tiers with different
                    discount levels
                  </li>
                  <li>
                    <strong>Performance Target:</strong> All pricing calculations must complete in &lt;200ms
                  </li>
                  <li>
                    <strong>Audit Logging:</strong> All pricing calculations and discount selections are logged for
                    compliance
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Technology Stack</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Next.js 15 (App Router)</li>
                      <li>• React 19</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS v4</li>
                      <li>• shadcn/ui components</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Backend</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Next.js API Routes</li>
                      <li>• Supabase PostgreSQL</li>
                      <li>• Upstash Redis</li>
                      <li>• Server Actions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="data-models">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>Data Models</CardTitle>
              </div>
              <CardDescription>Database schema and TypeScript interfaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Core Tables</h3>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">discount_rules</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Stores discount rule definitions with hierarchical targeting
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`CREATE TABLE discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  target_id VARCHAR(255),
  target_name VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">discount_rule_tiers</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Defines A/B/C tier discount values and quantity thresholds
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`CREATE TABLE discount_rule_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES discount_rules(id),
  tier VARCHAR(1) NOT NULL CHECK (tier IN ('A', 'B', 'C')),
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  max_quantity INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">customer_tier_assignments</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Maps customers to specific tiers for each discount rule
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`CREATE TABLE customer_tier_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES discount_rules(id),
  customer_id VARCHAR(255) NOT NULL,
  tier VARCHAR(1) NOT NULL CHECK (tier IN ('A', 'B', 'C')),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  assigned_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(rule_id, customer_id)
);`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">TypeScript Interfaces</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`// Core pricing interfaces
export interface PriceCalculationInput {
  customerId: string
  productId: string
  quantity: number
  basePrice: number
  currentDate?: Date
}

export interface PriceCalculationResult {
  customerId: string
  productId: string
  quantity: number
  basePrice: number
  baseTotalPrice: number
  finalPrice: number
  finalUnitPrice: number
  totalSavings: number
  savingsPercentage: number
  discountApplied: boolean
  bestDiscount: EvaluatedDiscount | null
  allEvaluatedDiscounts: EvaluatedDiscount[]
  calculatedAt: Date
}

export interface EvaluatedDiscount {
  ruleId: string
  ruleName: string
  ruleType: string
  tier: "A" | "B" | "C"
  discountType: "percentage" | "fixed_amount" | "price_override"
  discountValue: number
  discountAmount: number
  finalPrice: number
  savings: number
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card id="components">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <CardTitle>Core Components</CardTitle>
              </div>
              <CardDescription>Detailed documentation of pricing engine components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">TierPricingEngine</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Main pricing calculation engine that integrates discount rules with customer tier assignments
                </p>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">findApplicableRules()</h4>
                    <Badge className="mb-2">TM-022</Badge>
                    <p className="text-sm mb-3">
                      Finds all discount rules that apply to a given context (customer, product, brand, category)
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`async function findApplicableRules(
  context: ApplicableRuleContext
): Promise<ApplicableRule[]>

// Usage example:
const rules = await findApplicableRules({
  customerId: "cust_123",
  productId: "prod_456",
  brandId: "brand_789",
  categoryId: "cat_012",
  quantity: 10
})`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">getCustomerTierAssignment()</h4>
                    <Badge className="mb-2">TM-023</Badge>
                    <p className="text-sm mb-3">
                      Retrieves the customer's tier assignment (A, B, or C) for a specific discount rule
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`async function getCustomerTierAssignment(
  customerId: string,
  ruleId: string
): Promise<CustomerTierAssignment | null>

// Usage example:
const assignment = await getCustomerTierAssignment(
  "cust_123",
  "rule_456"
)
// Returns: { tier: "A", assigned_date: "2025-01-15", ... }`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">getTierDiscount()</h4>
                    <Badge className="mb-2">TM-024</Badge>
                    <p className="text-sm mb-3">
                      Gets the discount information for a specific tier within a discount rule
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`async function getTierDiscount(
  ruleId: string,
  tier: "A" | "B" | "C",
  quantity?: number
): Promise<DiscountRuleTier | null>

// Usage example:
const discount = await getTierDiscount("rule_456", "A", 10)
// Returns: { discount_type: "percentage", discount_value: 15, ... }`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">calculateCustomerPrice()</h4>
                    <Badge className="mb-2">TM-025</Badge>
                    <p className="text-sm mb-3">
                      Main pricing calculation function that evaluates all applicable discounts and selects the best one
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`async function calculateCustomerPrice(
  input: PriceCalculationInput
): Promise<PriceCalculationResult>

// Usage example:
const result = await calculateCustomerPrice({
  customerId: "cust_123",
  productId: "prod_456",
  quantity: 10,
  basePrice: 50.00
})
// Returns detailed pricing with best discount applied`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-mono text-sm font-semibold mb-2">selectBestDiscount()</h4>
                    <Badge className="mb-2">TM-026</Badge>
                    <p className="text-sm mb-3">
                      Selects the best discount from multiple options using a sophisticated algorithm (no stacking)
                    </p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`function selectBestDiscount(
  evaluatedDiscounts: EvaluatedDiscount[],
  strategy: DiscountSelectionStrategy = "best_for_customer"
): EvaluatedDiscount | null

// Selection criteria (in priority order):
// 1. Highest savings amount
// 2. Highest savings percentage
// 3. Rule hierarchy level (product > subcategory > category > brand)
// 4. Better tier assignment (A > B > C)
// 5. Most recently created rule`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">PricingCache</h3>
                <Badge className="mb-2">TM-028</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Redis-based caching layer for high-performance pricing calculations
                </p>

                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Cache Strategy</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Discount Rules: 5 minutes TTL</li>
                      <li>• Customer Tier Assignments: 10 minutes TTL</li>
                      <li>• Discount Rule Tiers: 5 minutes TTL</li>
                      <li>• Product Details: 15 minutes TTL</li>
                      <li>• Pricing Calculations: 3 minutes TTL</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Cache Invalidation</h4>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`// Invalidate when tier assignments change
await invalidateCustomerTierCache(customerId, ruleId)

// Invalidate when discount rules change
await invalidateDiscountRuleCache()

// Invalidate pricing calculations
await invalidatePricingCalculationCache(customerId, productId)`}
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">PricingAuditLogger</h3>
                <Badge className="mb-2">TM-027</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive audit logging for all pricing calculations and discount selections
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                    {`// Log successful pricing calculation
await logSuccessfulPricing({
  customerId,
  productId,
  quantity,
  basePrice,
  finalPrice,
  discountAmount,
  discountPercentage,
  ruleId,
  ruleName,
  tierName,
  evaluatedDiscounts,
  selectionReason,
  calculationDurationMs
})

// Log pricing error
await logPricingError({
  customerId,
  productId,
  quantity,
  errorMessage,
  errorDetails
})`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="pricing-flow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Pricing Calculation Flow</CardTitle>
              </div>
              <CardDescription>Step-by-step process of how pricing is calculated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Find Applicable Rules</h4>
                    <p className="text-sm text-muted-foreground">
                      Query active discount rules that match the product's brand, category, subcategory, or product ID
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Check Customer Tier Assignments</h4>
                    <p className="text-sm text-muted-foreground">
                      For each applicable rule, check if the customer has a tier assignment (A, B, or C)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Tier Discounts</h4>
                    <p className="text-sm text-muted-foreground">
                      Retrieve the discount configuration for the customer's assigned tier and quantity
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Evaluate All Discounts</h4>
                    <p className="text-sm text-muted-foreground">
                      Calculate the discount amount and final price for each applicable discount
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold">Select Best Discount</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply the discount selection algorithm to choose the single best discount (highest savings)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    6
                  </div>
                  <div>
                    <h4 className="font-semibold">Validate No Stacking</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensure only one discount is applied (no stacking policy enforcement)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    7
                  </div>
                  <div>
                    <h4 className="font-semibold">Calculate Final Price</h4>
                    <p className="text-sm text-muted-foreground">
                      Compute final price, unit price, total savings, and savings percentage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    8
                  </div>
                  <div>
                    <h4 className="font-semibold">Log Audit Trail</h4>
                    <p className="text-sm text-muted-foreground">
                      Record the pricing calculation, evaluated discounts, and selection reason for compliance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    9
                  </div>
                  <div>
                    <h4 className="font-semibold">Cache Result</h4>
                    <p className="text-sm text-muted-foreground">
                      Store the pricing calculation result in Redis cache for 3 minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-6">
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    <CheckCircle className="inline h-4 w-4 text-green-500 mr-1" />
                    Target: &lt;200ms per calculation
                  </li>
                  <li>
                    <CheckCircle className="inline h-4 w-4 text-green-500 mr-1" />
                    Cache hit rate: ~80% for repeat calculations
                  </li>
                  <li>
                    <CheckCircle className="inline h-4 w-4 text-green-500 mr-1" />
                    Batch processing: Parallel calculation for cart items
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card id="api-reference">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>API Reference</CardTitle>
              </div>
              <CardDescription>Complete API endpoint documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Discount Rules API</h3>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/api/discount-rules</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Create a new discount rule</p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`// Request body
{
  "name": "Premium Brand Discount",
  "description": "Tiered discount for premium brands",
  "rule_type": "tiered_pricing",
  "level": "brand",
  "target_id": "brand_123",
  "target_name": "Premium Brand",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "status": "active"
}`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/discount-rules</code>
                    </div>
                    <p className="text-sm text-muted-foreground">List all discount rules with optional filters</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/discount-rules/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get details of a specific discount rule</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">PUT</Badge>
                      <code className="text-sm">/api/discount-rules/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update an existing discount rule</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">DELETE</Badge>
                      <code className="text-sm">/api/discount-rules/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Delete a discount rule</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tier Assignment API</h3>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/api/discount-rules/[id]/assignments</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Assign customers to tiers</p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`// Request body
{
  "assignments": [
    { "customer_id": "cust_123", "tier": "A" },
    { "customer_id": "cust_456", "tier": "B" },
    { "customer_id": "cust_789", "tier": "C" }
  ]
}`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/discount-rules/[id]/assignments</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all tier assignments for a discount rule</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">PUT</Badge>
                      <code className="text-sm">/api/discount-rules/[id]/assignments/[customerId]</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update a customer's tier assignment</p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">DELETE</Badge>
                      <code className="text-sm">/api/discount-rules/[id]/assignments/[customerId]</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Remove a customer's tier assignment</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing Calculation API</h3>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/api/pricing/calculate</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Calculate price for a customer and product</p>
                    <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                      {`// Request body
{
  "customerId": "cust_123",
  "productId": "prod_456",
  "quantity": 10,
  "basePrice": 50.00
}

// Response
{
  "customerId": "cust_123",
  "productId": "prod_456",
  "quantity": 10,
  "basePrice": 50.00,
  "baseTotalPrice": 500.00,
  "finalPrice": 425.00,
  "finalUnitPrice": 42.50,
  "totalSavings": 75.00,
  "savingsPercentage": 15.00,
  "discountApplied": true,
  "bestDiscount": {
    "ruleId": "rule_789",
    "ruleName": "Premium Brand Discount",
    "tier": "A",
    "discountType": "percentage",
    "discountValue": 15,
    "savings": 75.00
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/customers/[id]/tiers</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all tier assignments for a customer</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card id="integration">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <CardTitle>Integration Guide</CardTitle>
              </div>
              <CardDescription>How to integrate the pricing engine into your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`// 1. Import the pricing engine
import { calculateCustomerPrice } from "@/lib/pricing/tier-pricing-engine"

// 2. Calculate price for a customer
const result = await calculateCustomerPrice({
  customerId: "cust_123",
  productId: "prod_456",
  quantity: 10,
  basePrice: 50.00
})

// 3. Use the result
console.log(\`Final price: $\${result.finalPrice}\`)
console.log(\`You saved: $\${result.totalSavings} (\${result.savingsPercentage}%)\`)

if (result.bestDiscount) {
  console.log(\`Applied discount: \${result.bestDiscount.ruleName}\`)
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Cart Integration</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`// Calculate prices for multiple items in a cart
import { calculateCartPrices } from "@/lib/pricing/tier-pricing-engine"

const cartItems = [
  { productId: "prod_1", quantity: 5, basePrice: 30.00 },
  { productId: "prod_2", quantity: 10, basePrice: 50.00 },
  { productId: "prod_3", quantity: 2, basePrice: 100.00 }
]

const results = await calculateCartPrices("cust_123", cartItems)

// Calculate cart totals
const cartTotal = results.reduce((sum, r) => sum + r.finalPrice, 0)
const totalSavings = results.reduce((sum, r) => sum + r.totalSavings, 0)

console.log(\`Cart total: $\${cartTotal}\`)
console.log(\`Total savings: $\${totalSavings}\`)`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">React Component Example</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function ProductPrice({ 
  customerId, 
  productId, 
  quantity, 
  basePrice 
}) {
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPricing() {
      const response = await fetch("/api/pricing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          productId,
          quantity,
          basePrice
        })
      })
      const data = await response.json()
      setPricing(data)
      setLoading(false)
    }
    fetchPricing()
  }, [customerId, productId, quantity, basePrice])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {pricing.discountApplied && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground line-through">
            $\${pricing.baseTotalPrice.toFixed(2)}
          </div>
          <div className="text-2xl font-bold">
            $\${pricing.finalPrice.toFixed(2)}
          </div>
          <Badge variant="secondary">
            Save $\${pricing.totalSavings.toFixed(2)} 
            (\${pricing.savingsPercentage.toFixed(0)}%)
          </Badge>
          <div className="text-sm text-muted-foreground">
            {pricing.bestDiscount.ruleName} applied
          </div>
        </div>
      )}
      {!pricing.discountApplied && (
        <div className="text-2xl font-bold">
          $\${pricing.finalPrice.toFixed(2)}
        </div>
      )}
    </div>
  )
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Performance Best Practices</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">✓ DO: Use batch processing for carts</h4>
                    <p className="text-sm text-muted-foreground">
                      Use <code>calculateCartPrices()</code> instead of calling <code>calculateCustomerPrice()</code>{" "}
                      multiple times
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">✓ DO: Cache results on the client</h4>
                    <p className="text-sm text-muted-foreground">
                      Store pricing results in React state or SWR cache to avoid redundant API calls
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-sm">✓ DO: Invalidate cache when tier assignments change</h4>
                    <p className="text-sm text-muted-foreground">
                      Call <code>invalidateCustomerTierCache()</code> after updating tier assignments
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm">✗ DON'T: Calculate prices in loops</h4>
                    <p className="text-sm text-muted-foreground">
                      Avoid calling the pricing API inside loops - use batch processing instead
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-sm">✗ DON'T: Bypass the pricing engine</h4>
                    <p className="text-sm text-muted-foreground">
                      Always use the pricing engine for calculations to ensure audit logging and consistency
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Troubleshooting</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Slow pricing calculations (&gt;200ms)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Check Redis cache connectivity</li>
                      <li>• Review database query performance</li>
                      <li>• Ensure indexes are created on discount_rules and customer_tier_assignments tables</li>
                      <li>• Monitor cache hit rate - should be ~80%</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      Incorrect discount applied
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Check customer tier assignment for the discount rule</li>
                      <li>• Verify discount rule is active and within date range</li>
                      <li>• Review discount selection algorithm logs</li>
                      <li>• Check if multiple discounts are being evaluated correctly</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      No discount applied when expected
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Verify customer has a tier assignment for the rule</li>
                      <li>• Check if quantity meets min_quantity threshold</li>
                      <li>• Ensure discount rule targets the correct level (brand/category/product)</li>
                      <li>• Review audit logs for pricing calculation details</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="performance">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <CardTitle>Performance Optimization</CardTitle>
              </div>
              <CardDescription>Strategies for achieving &lt;200ms pricing calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Optimization Techniques</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">1. Redis Caching (TM-028)</h4>
                    <p className="text-sm text-muted-foreground">
                      All discount rules, tier assignments, and pricing calculations are cached in Redis with
                      appropriate TTLs
                    </p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">2. Batch Query Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Replaced N+1 queries with batch queries using PostgreSQL's <code>ANY($1)</code> operator
                    </p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">3. Database Indexes</h4>
                    <p className="text-sm text-muted-foreground">
                      Created indexes on frequently queried columns: rule_id, customer_id, tier, status, start_date,
                      end_date
                    </p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">4. Parallel Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Cart pricing calculations are processed in parallel using <code>Promise.all()</code>
                    </p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">5. Early Returns</h4>
                    <p className="text-sm text-muted-foreground">
                      Functions return early when no applicable rules are found to avoid unnecessary processing
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Performance Monitoring</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {`// All pricing calculations log performance metrics
logInfo(\`[TM-028] Performance: \${calculationDurationMs}ms \${
  calculationDurationMs < 200 ? "✓" : "✗ SLOW"
}\`)

// Query audit logs for slow calculations
const slowCalculations = await db.query(\`
  SELECT * FROM audit_logs
  WHERE resource_type = 'pricing'
  AND event_type = 'pricing_calculation'
  AND metadata->>'calculationDurationMs' > '200'
  ORDER BY created_at DESC
  LIMIT 100
\`)`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              For additional support, please contact the development team or refer to the{" "}
              <a href="/api-docs" className="text-primary hover:underline">
                API Documentation
              </a>{" "}
              and{" "}
              <a href="/user-docs" className="text-primary hover:underline">
                User Documentation
              </a>
              .
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: October 1, 2025 | Version 1.0 | GTI Pricing & Promotion Engine
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
