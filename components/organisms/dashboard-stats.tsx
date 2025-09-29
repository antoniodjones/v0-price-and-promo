import { TrendingUp, Users, Package, DollarSign } from "lucide-react"
import { StatCard } from "../molecules/stat-card"
import { ErrorBoundary } from "@/components/error-boundary"

const stats = [
  {
    title: "Active Discounts",
    value: "127",
    change: "+12%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Customer Tiers",
    value: "24",
    change: "+3",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Auto Discounts Applied",
    value: "1,847",
    change: "+23%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Total Savings",
    value: "$47,892",
    change: "+18%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
]

export function DashboardStats() {
  return (
    <ErrorBoundary>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </ErrorBoundary>
  )
}
