import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityItem } from "../molecules/activity-item"
import { ErrorBoundary } from "@/components/error-boundary"

const recentActivity = [
  {
    type: "discount" as const,
    title: "New customer discount created",
    description: "Premium Cannabis Co - 8% off for Dispensary ABC",
    time: "2 hours ago",
    status: "active",
  },
  {
    type: "auto" as const,
    title: "Auto discount applied",
    description: "30-day expiration discount on Batch BH-2025-0892",
    time: "4 hours ago",
    status: "applied",
  },
  {
    type: "alert" as const,
    title: "Low inventory alert",
    description: "Blue Dream 1oz approaching expiration",
    time: "6 hours ago",
    status: "warning",
  },
]

export function RecentActivity() {
  return (
    <ErrorBoundary>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest pricing and promotion updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
