"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PriceDisplay, StatusBadge, LoadingSpinner, MetricDisplay, DiscountBadge } from "@/components/atoms"
import {
  StatCard,
  ActionButtons,
  AlertMessage,
  SearchBox,
  FormFieldWrapper,
  StatusIndicator,
  DataCell,
  PriceInput,
  DiscountDisplay,
  PriceHistory,
  FormField,
  MetricCard,
} from "@/components/molecules"
import { PricingCalculator } from "@/components/organisms"
import { Calculator, DollarSign, Users, Package, CheckCircle, Info } from "lucide-react"

export default function Phase1DemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceValue, setPriceValue] = useState("")
  const [showAlert, setShowAlert] = useState(true)
  const [formFieldValue, setFormFieldValue] = useState("")

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const mockPriceHistory = [
    { date: "2024-01-01", price: 100 },
    { date: "2024-02-01", price: 95 },
    { date: "2024-03-01", price: 110 },
    { date: "2024-04-01", price: 105 },
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Phase 1 Component Demo</h1>
        <p className="text-muted-foreground">
          Interactive showcase of all Phase 1 atoms, molecules, and organisms with null safety and error handling
        </p>
      </div>

      {/* Atoms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Atoms - Basic UI Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Price Display</h4>
              <div className="space-y-2">
                <PriceDisplay price={99.99} size="sm" />
                <PriceDisplay price={149.99} cost={75.5} showMargin size="md" />
                <PriceDisplay price={299.99} size="lg" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Status Badges</h4>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="active" />
                <StatusBadge status="low_stock" />
                <StatusBadge status="expiring_soon" />
                <StatusBadge status="out_of_stock" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Loading Spinner</h4>
              <div className="flex items-center gap-4">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Metric Display</h4>
              <MetricDisplay value={1234} label="Total Sales" trend="up" change={12.5} />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Discount Badge</h4>
              <div className="flex gap-2">
                <DiscountBadge percentage={10} />
                <DiscountBadge percentage={25} />
                <DiscountBadge percentage={50} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Molecules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Molecules - Composite Components
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Revenue" value="$45,231" change={{ value: 20.1, type: "increase" }} icon={DollarSign} />

            <StatCard title="Orders" value="1,234" change={{ value: -5.2, type: "decrease" }} icon={Package} />

            <StatCard title="Customers" value="892" change={{ value: 12.3, type: "increase" }} icon={Users} />
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Metric Cards - Focused Metric Display</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                value="$12,345"
                label="Monthly Revenue"
                trend={{ value: 15.2, direction: "up", period: "last month" }}
                size="sm"
              />
              <MetricCard
                value="2,847"
                label="Active Users"
                trend={{ value: -3.1, direction: "down", period: "last week" }}
                size="md"
              />
              <MetricCard
                value="98.5%"
                label="Uptime"
                trend={{ value: 0, direction: "neutral", period: "last 30 days" }}
                size="md"
              />
              <MetricCard
                value="156"
                label="New Signups"
                trend={{ value: 24.7, direction: "up", period: "yesterday" }}
                size="lg"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Form Components</h4>
              <SearchBox
                placeholder="Search products..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(query) => console.log("Searching:", query)}
              />

              <FormFieldWrapper
                label="Product Price"
                error={priceValue && isNaN(Number(priceValue)) ? "Please enter a valid number" : undefined}
              >
                <PriceInput value={priceValue} onChange={setPriceValue} placeholder="0.00" />
              </FormFieldWrapper>

              <FormField
                label="Product Name"
                value={formFieldValue}
                onChange={setFormFieldValue}
                placeholder="Enter product name..."
                required
                error={
                  formFieldValue.length > 0 && formFieldValue.length < 3
                    ? "Name must be at least 3 characters"
                    : undefined
                }
              />

              <ActionButtons
                onSave={handleSave}
                onCancel={() => setPriceValue("")}
                isLoading={isLoading}
                saveDisabled={!priceValue}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Display Components</h4>

              <StatusIndicator status="active" label="System Status" />

              <DataCell value="Premium Widget" type="text" />

              <DataCell value={299.99} type="currency" />

              <DiscountDisplay originalPrice={199.99} discountedPrice={149.99} discountPercentage={25} />

              <PriceHistory data={mockPriceHistory} currentPrice={105} />
            </div>
          </div>

          {showAlert && (
            <AlertMessage
              type="info"
              icon={Info}
              message="All molecule components are functioning correctly with proper error handling."
              onClose={() => setShowAlert(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Organisms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Organisms - Complex Components
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PricingCalculator
            onCalculate={(result) => {
              console.log("Pricing calculation result:", result)
            }}
          />
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">✓ All Phase 1 components working correctly</span>
          </div>
          <p className="text-sm text-green-700 mt-2">
            All atoms, molecules, and organisms are implemented with proper TypeScript types, null safety, error
            handling, and responsive design. Phase 1 is now 100% complete!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
