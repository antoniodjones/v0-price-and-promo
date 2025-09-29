"use client"

import { cn } from "@/lib/utils"

interface DataCellProps {
  value: string | number | null | undefined
  format?: "text" | "number" | "currency" | "percentage" | "date"
  className?: string
  fallback?: string
}

export function DataCell({ value, format = "text", className, fallback = "—" }: DataCellProps) {
  const formatValue = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === "") {
      return fallback
    }

    switch (format) {
      case "number":
        return typeof val === "number" ? val.toLocaleString() : String(val)
      case "currency":
        const numVal = typeof val === "number" ? val : Number.parseFloat(String(val))
        return isNaN(numVal) ? fallback : `$${numVal.toFixed(2)}`
      case "percentage":
        const pctVal = typeof val === "number" ? val : Number.parseFloat(String(val))
        return isNaN(pctVal) ? fallback : `${pctVal.toFixed(1)}%`
      case "date":
        try {
          const date = new Date(String(val))
          return isNaN(date.getTime()) ? fallback : date.toLocaleDateString()
        } catch {
          return fallback
        }
      default:
        return String(val)
    }
  }

  const formattedValue = formatValue(value)
  const isEmpty = formattedValue === fallback

  return <span className={cn("text-sm", isEmpty && "text-muted-foreground", className)}>{formattedValue}</span>
}
