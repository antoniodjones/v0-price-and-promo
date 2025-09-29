import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, Clock } from "lucide-react"
import { QuickActionCard } from "../molecules/quick-action-card"
import { ErrorBoundary } from "@/components/error-boundary"

const quickActions = [
  {
    title: "Create Customer Discount",
    description: "Set up new customer-specific pricing",
    href: "/customer-discounts/new",
    icon: Users,
    color: "bg-gti-dark-green",
  },
  {
    title: "Configure Auto Discount",
    description: "Set up inventory-based discounting",
    href: "/inventory-discounts/new",
    icon: Package,
    color: "bg-gti-dark-green",
  },
  {
    title: "Test Pricing Scenario",
    description: "Validate pricing rules with sample baskets",
    href: "/testing",
    icon: Clock,
    color: "bg-gti-dark-green",
  },
]

export function QuickActions() {
  return (
    <ErrorBoundary>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common pricing and promotion tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
