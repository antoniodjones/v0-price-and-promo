import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "low_stock" | "expiring_soon" | "out_of_stock"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    active: {
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    low_stock: {
      variant: "secondary" as const,
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    expiring_soon: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    out_of_stock: {
      variant: "destructive" as const,
      className: "",
    },
  }

  const config = variants[status]
  const labels = {
    active: "Active",
    low_stock: "Low Stock",
    expiring_soon: "Expiring Soon",
    out_of_stock: "Out of Stock",
  }

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {labels[status]}
    </Badge>
  )
}
