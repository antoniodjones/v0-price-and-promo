"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedCard } from "@/components/shared/unified-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Award,
  BarChart3,
  Tag,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CustomerOverview } from "./customer-overview"
import { PurchaseHistory } from "./purchase-history"
import { DiscountsApplied } from "./discounts-applied"
import { LoyaltyMetrics } from "./loyalty-metrics"
import { PricingComparison } from "./pricing-comparison"

interface Customer {
  id: string
  business_legal_name: string
  dba_name?: string
  tier: string
  market: string
  customer_type: string
  status: string
  cannabis_license_number?: string
  license_state?: string
  total_purchases: number
  credit_limit?: number
  primary_contact_name?: string
  primary_contact_email?: string
  primary_contact_phone?: string
  billing_address?: string
  billing_city?: string
  billing_state?: string
  billing_zip_code?: string
  created_at: string
}

export function CustomerDetailView({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCustomer()
  }, [customerId])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/${customerId}`)

      if (!response.ok) {
        throw new Error("Failed to load customer")
      }

      const result = await response.json()

      if (result.success && result.data) {
        setCustomer(result.data)
      } else {
        throw new Error(result.error || "Failed to load customer")
      }
    } catch (err) {
      console.error("[v0] Error loading customer:", err)
      setError(err instanceof Error ? err.message : "Failed to load customer")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading customer...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <UnifiedCard variant="error">
        <div className="text-center space-y-2">
          <p className="font-medium">Failed to load customer</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={loadCustomer} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </UnifiedCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <UnifiedCard>
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{customer.business_legal_name}</h2>
                <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                <Badge variant="outline">{customer.tier}</Badge>
                <Badge variant="outline">{customer.customer_type}</Badge>
              </div>
              {customer.dba_name && <p className="text-sm text-muted-foreground">DBA: {customer.dba_name}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Total Purchases</p>
                  <p className="font-medium">{formatCurrency(customer.total_purchases || 0)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Credit Limit</p>
                  <p className="font-medium">{customer.credit_limit ? formatCurrency(customer.credit_limit) : "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Market</p>
                  <p className="font-medium">{customer.market}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Customer Since</p>
                  <p className="font-medium">{formatDate(customer.created_at)}</p>
                </div>
              </div>
            </div>

            {customer.primary_contact_name && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Primary Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.primary_contact_name}</span>
                  </div>
                  {customer.primary_contact_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.primary_contact_email}</span>
                    </div>
                  )}
                  {customer.primary_contact_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.primary_contact_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </UnifiedCard>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="purchases" className="gap-2">
            <Package className="h-4 w-4" />
            Purchase History
          </TabsTrigger>
          <TabsTrigger value="discounts" className="gap-2">
            <Tag className="h-4 w-4" />
            Discounts & Promotions
          </TabsTrigger>
          <TabsTrigger value="loyalty" className="gap-2">
            <Award className="h-4 w-4" />
            Loyalty Metrics
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Pricing Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CustomerOverview customerId={customerId} customer={customer} />
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <PurchaseHistory customerId={customerId} />
        </TabsContent>

        <TabsContent value="discounts" className="space-y-4">
          <DiscountsApplied customerId={customerId} />
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <LoyaltyMetrics customerId={customerId} customer={customer} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <PricingComparison customerId={customerId} customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
