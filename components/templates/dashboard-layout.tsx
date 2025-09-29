import type { ReactNode } from "react"
import { DashboardStats } from "@/components/organisms"

interface DashboardLayoutProps {
  children: ReactNode
  stats?: any[]
}

export function DashboardLayout({ children, stats }: DashboardLayoutProps) {
  return (
    <div className="space-y-6">
      {stats && <DashboardStats stats={stats} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{children}</div>
    </div>
  )
}
