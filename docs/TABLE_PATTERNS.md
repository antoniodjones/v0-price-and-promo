# Table Patterns Guide

This guide documents the standardized table patterns for the GTI Pricing Engine, following Clean Code principles from DESIGN_DECISIONS.md.

## Overview

All tables use:
- **UnifiedDataTable** component for consistent UI
- **Table hooks** (`lib/table-helpers.tsx`) for state management
- **Table formatters** (`lib/table-formatters.tsx`) for data display
- **Clean Code principles** - small functions, single responsibility, DRY

## Basic Table Structure

\`\`\`tsx
import { UnifiedDataTable, TableColumn } from '@/components/shared/unified-data-table'
import { useDataTable } from '@/lib/table-helpers'
import { formatCurrency, formatDate } from '@/lib/table-formatters'

interface Product {
  id: string
  name: string
  price: number
  createdAt: string
}

export function ProductsTable({ products }: { products: Product[] }) {
  // Define columns with clear, intention-revealing names
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => formatCurrency(product.price),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (product) => formatDate(product.createdAt),
    },
  ]

  // Use hook for complete table management
  const table = useDataTable(products, {
    initialSortKey: 'name',
    filterFn: (product, query) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    itemsPerPage: 10,
  })

  return (
    <UnifiedDataTable
      data={table.data}
      columns={columns}
      sortKey={table.sortKey}
      sortDirection={table.sortDirection}
      onSort={table.toggleSort}
      searchable
      searchValue={table.filterQuery}
      onSearchChange={table.setFilterQuery}
    />
  )
}
\`\`\`

## Available Hooks

### useDataTable (Complete Solution)
Combines all table functionality in one hook.

\`\`\`tsx
const table = useDataTable(data, {
  initialSortKey: 'name',
  filterFn: (item, query) => item.name.includes(query),
  itemsPerPage: 10,
})
\`\`\`

### Individual Hooks (For Custom Needs)

**useTableSort** - Sorting only
\`\`\`tsx
const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(data, 'name')
\`\`\`

**useTableFilter** - Filtering only
\`\`\`tsx
const { filteredData, filterQuery, setFilterQuery } = useTableFilter(
  data,
  (item, query) => item.name.includes(query)
)
\`\`\`

**useTablePagination** - Pagination only
\`\`\`tsx
const { paginatedData, currentPage, totalPages, nextPage, previousPage } = 
  useTablePagination(data, 10)
\`\`\`

**useTableSelection** - Row selection only
\`\`\`tsx
const { selectedIds, selectedItems, toggleSelection, toggleAll } = 
  useTableSelection(data)
\`\`\`

## Available Formatters

All formatters are pure functions with no side effects:

- `formatCurrency(value)` - $1,234.56
- `formatPercentage(value)` - 12.50%
- `formatDate(date)` - Jan 6, 2025
- `formatDateTime(date)` - Jan 6, 2025, 2:30 PM
- `truncateText(text, maxLength)` - Long text...
- `getStatusBadgeClass(status)` - Returns className for badges

## Clean Code Principles

### Single Responsibility
Each hook does ONE thing:
- `useTableSort` - Only sorting
- `useTableFilter` - Only filtering
- `useTablePagination` - Only pagination

### Small Functions
All functions < 20 lines, easy to understand and test.

### Meaningful Names
- ✅ `toggleSort` not `ts`
- ✅ `formatCurrency` not `fmt`
- ✅ `selectedItems` not `sel`

### DRY Principle
Reuse formatters and hooks across all tables.

## Migration Checklist

When migrating old tables:

1. ✅ Replace custom table markup with `UnifiedDataTable`
2. ✅ Define columns with `TableColumn<T>[]`
3. ✅ Use `useDataTable` hook for state management
4. ✅ Use formatters from `lib/table-formatters.tsx`
5. ✅ Remove manual sorting/filtering/pagination logic
6. ✅ Test all table functionality

## Benefits

- **Consistency**: All tables look and behave the same
- **Less Code**: Reusable hooks eliminate duplication
- **Type Safety**: Full TypeScript support
- **Maintainability**: Small, focused functions
- **Testability**: Pure functions easy to test
