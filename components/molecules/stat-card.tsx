import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricDisplay } from "@/components/atoms"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, change, icon: Icon, className }: StatCardProps) {
  const safeTitle = title || "Untitled"
  const safeValue = value ?? 0

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{safeTitle}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <MetricDisplay label="" value={safeValue} change={change} size="md" />
      </CardContent>
    </Card>
  )
}
