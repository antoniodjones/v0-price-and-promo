"use client"

import type { ReactNode } from "react"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/**
 * Column definition interface
 * Clear, intention-revealing names
 */
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  className?: string
}

/**
 * UnifiedDataTable props interface
 * Few arguments principle - using object for configuration
 */
interface UnifiedDataTableProps<T extends { id: string }> {
  // Data
  data: T[]
  columns: TableColumn<T>[]

  // Sorting
  sortKey?: keyof T
  sortDirection?: "asc" | "desc"
  onSort?: (key: keyof T) => void

  // Selection
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (id: string) => void
  onSelectAll?: () => void
  isAllSelected?: boolean

  // Filtering
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void

  // Empty state
  emptyMessage?: string

  // Loading state
  isLoading?: boolean

  // Styling
  className?: string
}

/**
 * Unified Data Table Component
 * Single Responsibility: Renders table with consistent UI
 * Small component: Delegates logic to hooks
 */
export function UnifiedDataTable<T extends { id: string }>({
  data,
  columns,
  sortKey,
  sortDirection,
  onSort,
  selectable = false,
  selectedIds,
  onSelectionChange,
  onSelectAll,
  isAllSelected = false,
  searchable = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  emptyMessage = "No data available",
  isLoading = false,
  className,
}: UnifiedDataTableProps<T>) {
  const renderSortIcon = (columnKey: keyof T | string) => {
    if (sortKey !== columnKey) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(item)
    }
    return String(item[column.key as keyof T] ?? "")
  }

  return (
    <div className={cn("space-y-4", className)}>
      {searchable && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={cn(column.className)}>
                  {column.sortable && onSort ? (
                    <Button variant="ghost" onClick={() => onSort(column.key as keyof T)} className="h-8 px-2 lg:px-3">
                      {column.label}
                      {renderSortIcon(column.key)}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds?.has(item.id)}
                        onCheckedChange={() => onSelectionChange?.(item.id)}
                        aria-label={`Select row ${item.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className={cn(column.className)}>
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
