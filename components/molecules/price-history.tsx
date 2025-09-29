"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataCell } from "./data-cell"
import { cn } from "@/lib/utils"

interface PriceHistoryEntry {
  id: string
  date: string
  price: number
  reason?: string
  user?: string
}

interface PriceHistoryProps {
  entries: PriceHistoryEntry[]
  className?: string
  maxEntries?: number
}

export function PriceHistory({ entries, className, maxEntries = 10 }: PriceHistoryProps) {
  const safeEntries = (entries || []).slice(0, maxEntries)

  if (safeEntries.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle className="text-base">Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No price history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base">Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {safeEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="space-y-1">
                <DataCell value={entry.date} format="date" className="font-medium" />
                {entry.reason && <p className="text-xs text-muted-foreground">{entry.reason}</p>}
                {entry.user && <p className="text-xs text-muted-foreground">by {entry.user}</p>}
              </div>
              <DataCell value={entry.price} format="currency" className="font-semibold" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
