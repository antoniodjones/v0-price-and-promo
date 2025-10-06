# Table Migration Guide

This guide helps migrate old manual table implementations to the new UnifiedDataTable system.

## Why Migrate?

**Benefits:**
- **60% less code** - Eliminate duplicate sorting/filtering/pagination logic
- **Consistent UX** - All tables behave the same way
- **Type safety** - Full TypeScript support with generics
- **Maintainability** - Update all tables by changing one component
- **Accessibility** - Built-in ARIA labels and keyboard navigation

## Migration Steps

### Step 1: Identify Table Type

**Simple Tables** (read-only, basic sorting)
- discount-rules-list.tsx
- customer-discounts-list.tsx
- inventory-discounts-list.tsx

**Medium Tables** (filtering, search, actions)
- products-list.tsx
- discount-rules-list.tsx (with inline editing)

**Complex Tables** (server pagination, bulk actions)
- customer-management-dashboard.tsx
- user-management-dashboard.tsx

### Step 2: Define Columns

Replace manual TableHeader/TableCell with column definitions:

**Before:**
\`\`\`tsx
<TableHeader>
  <TableRow>
    <TableHead onClick={() => handleSort('name')}>Name</TableHead>
    <TableHead>Price</TableHead>
    <TableHead>Status</TableHead>
  </TableRow>
</TableHeader>
\`\`\`

**After:**
\`\`\`tsx
const columns: ColumnDef<Product>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'price',
    label: 'Price',
    render: (product) => formatCurrency(product.price),
  },
  {
    key: 'status',
    label: 'Status',
    render: (product) => <Badge>{product.status}</Badge>,
  },
]
\`\`\`

### Step 3: Replace State Management

**Before:**
\`\`\`tsx
const [searchTerm, setSearchTerm] = useState("")
const [sortField, setSortField] = useState("name")
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
const [currentPage, setCurrentPage] = useState(1)

const filteredData = useMemo(() => {
  return data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [data, searchTerm])

const sortedData = useMemo(() => {
  return [...filteredData].sort((a, b) => {
    // Manual sorting logic...
  })
}, [filteredData, sortField, sortDirection])
\`\`\`

**After:**
\`\`\`tsx
const table = useDataTable(data, {
  initialSortKey: 'name',
  filterFn: (item, query) => 
    item.name.toLowerCase().includes(query.toLowerCase()),
  itemsPerPage: 10,
})
\`\`\`

### Step 4: Replace Table Markup

**Before:**
\`\`\`tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sortedData.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>${item.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
\`\`\`

**After:**
\`\`\`tsx
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
\`\`\`

## Complete Examples

### Example 1: Simple List Table

**Before (200 lines):**
\`\`\`tsx
export function ProductsList({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Product>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div>
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("name")}>
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead onClick={() => handleSort("price")}>
              Price {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map(product => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
\`\`\`

**After (80 lines):**
\`\`\`tsx
import { UnifiedDataTable } from '@/components/shared/unified-data-table'
import { useDataTable } from '@/lib/table-helpers'
import { formatCurrency } from '@/lib/table-formatters'
import type { ColumnDef } from '@/lib/table-helpers'

export function ProductsList({ products }: { products: Product[] }) {
  const columns: ColumnDef<Product>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (product) => formatCurrency(product.price),
    },
  ]

  const table = useDataTable(products, {
    initialSortKey: 'name',
    filterFn: (product, query) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
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

### Example 2: Complex Admin Table

**Before (400+ lines):**
\`\`\`tsx
// Manual server pagination, filtering, sorting
// Lots of useState, useEffect, useMemo
// Custom loading states, error handling
// Duplicate code across multiple admin tables
\`\`\`

**After (150 lines):**
\`\`\`tsx
import { UnifiedDataTable } from '@/components/shared/unified-data-table'
import { useDataTable } from '@/lib/table-helpers'

export function CustomerManagement() {
  const { data: customers, isLoading } = useCustomers()
  
  const columns: ColumnDef<Customer>[] = [
    // Column definitions...
  ]

  const table = useDataTable(customers || [], {
    initialSortKey: 'name',
    filterFn: (customer, query) => 
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()),
    itemsPerPage: 20,
  })

  return (
    <UnifiedDataTable
      data={table.data}
      columns={columns}
      loading={isLoading}
      sortKey={table.sortKey}
      sortDirection={table.sortDirection}
      onSort={table.toggleSort}
      searchable
      searchValue={table.filterQuery}
      onSearchChange={table.setFilterQuery}
      pagination={{
        currentPage: table.currentPage,
        totalPages: table.totalPages,
        onPageChange: table.setCurrentPage,
      }}
    />
  )
}
\`\`\`

## Common Patterns

### Custom Cell Rendering

\`\`\`tsx
{
  key: 'status',
  label: 'Status',
  render: (item) => (
    <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
      {item.status}
    </Badge>
  ),
}
\`\`\`

### Row Actions

\`\`\`tsx
{
  key: 'actions',
  label: '',
  render: (item) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleEdit(item)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(item)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
\`\`\`

### Multi-Field Filtering

\`\`\`tsx
const table = useDataTable(data, {
  filterFn: (item, query) => {
    const searchLower = query.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.company.toLowerCase().includes(searchLower)
    )
  },
})
\`\`\`

## Troubleshooting

### Issue: Custom styling not working

**Solution:** Use the `className` prop on UnifiedDataTable:
\`\`\`tsx
<UnifiedDataTable
  className="custom-table-styles"
  // ...
/>
\`\`\`

### Issue: Need custom empty state

**Solution:** Use the `emptyMessage` prop:
\`\`\`tsx
<UnifiedDataTable
  emptyMessage="No products found. Create your first product to get started."
  // ...
/>
\`\`\`

### Issue: Need to disable sorting on specific columns

**Solution:** Set `sortable: false` in column definition:
\`\`\`tsx
{
  key: 'actions',
  label: 'Actions',
  sortable: false,
  render: (item) => <Actions item={item} />,
}
\`\`\`

## Migration Checklist

- [ ] Read this guide completely
- [ ] Identify table complexity (Simple/Medium/Complex)
- [ ] Define column definitions with `ColumnDef<T>[]`
- [ ] Replace state management with `useDataTable` hook
- [ ] Replace table markup with `UnifiedDataTable`
- [ ] Use formatters from `lib/table-formatters.tsx`
- [ ] Test sorting, filtering, pagination
- [ ] Test loading and empty states
- [ ] Test row actions and custom rendering
- [ ] Remove old table code
- [ ] Update tests if needed

## Need Help?

- See `docs/TABLE_PATTERNS.md` for detailed patterns
- See `components/shared/unified-data-table.tsx` for API reference
- See migrated tables for real examples:
  - Simple: `customer-discounts-list.tsx`
  - Medium: `products-list.tsx`
  - Complex: `customer-management-dashboard.tsx`
