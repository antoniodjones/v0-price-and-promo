import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package, Users } from "lucide-react"

interface ActivityItemProps {
  type: "discount" | "auto" | "alert"
  title: string
  description: string
  time: string
  status: string
}

export function ActivityItem({ type, title, description, time, status }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "auto":
        return <Package className="h-5 w-5 text-gti-bright-green" />
      default:
        return <Users className="h-5 w-5 text-gti-medium-green" />
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <Badge variant={status === "warning" ? "destructive" : "secondary"} className="ml-2">
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
}
