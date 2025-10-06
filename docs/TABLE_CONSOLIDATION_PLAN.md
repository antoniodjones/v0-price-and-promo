# Table Consolidation Plan - refactor-003-d

## Overview

Consolidate 20+ duplicate table implementations into a unified, reusable table system with consistent sorting, filtering, pagination, and styling.

## Current State Analysis

### Table Patterns Identified

#### 1. **Admin/Management Tables** (4 files)
**Complexity:** High  
**Features:** Server-side pagination, multi-field filtering, column sorting, search, row actions

Files:
- `components/admin/customer-management-dashboard.tsx`
- `components/admin/user-management-dashboard.tsx`
- `components/admin/audit-logging-dashboard.tsx`
- `components/tier-management/wizard/customer-assignment-step.tsx`

**Common Pattern:**
\`\`\`tsx
const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
const [filters, setFilters] = useState({ status: "all", type: "all" })
const [sortField, setSortField] = useState("name")
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
\`\`\`

**Code Duplication:** ~400 lines per table × 4 = **1,600 lines**

#### 2. **List Component Tables** (7 files)
**Complexity:** Medium  
**Features:** Client-side search, status badges, action dropdowns

Files:
- `components/tier-management/discount-rules-list.tsx`
- `components/customer-discounts/customer-discounts-list.tsx`
- `components/inventory-discounts/inventory-discounts-list.tsx`
- `components/bundle-deals/bundle-deals-list.tsx`
- `components/promotions/bogo-promotions-list.tsx`
- `components/pricing-rules/volume-pricing-list.tsx`
- `components/pricing-rules/tiered-pricing-list.tsx`

**Common Pattern:**
\`\`\`tsx
const [searchTerm, setSearchTerm] = useState("")
const filteredItems = items.filter(item => 
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
)
\`\`\`

**Code Duplication:** ~200 lines per table × 7 = **1,400 lines**

#### 3. **Testing/Results Tables** (4 files)
**Complexity:** Low  
**Features:** Read-only display, conditional styling, badges

Files:
- `components/testing/basket-testing.tsx` (2 tables)
- `components/testing/historical-testing.tsx`
- `components/testing/scenario-testing.tsx` (2 tables)
- `components/testing/test-results.tsx`

**Code Duplication:** ~100 lines per table × 6 = **600 lines**

### Total Code Duplication: ~3,600 lines

## Consolidation Strategy

### Phase 1: Create Unified Table System

**Goal:** Build reusable table infrastructure

**Deliverables:**
1. `UnifiedDataTable` component with TypeScript generics
2. Column definition system
3. Table hooks:
   - `useTableSort` - Client-side sorting
   - `useTableFilter` - Multi-field filtering
   - `useTablePagination` - Client-side pagination
   - `useServerTable` - Server-side operations
4. Loading/empty state components
5. Documentation

**Files to Create:**
- `components/shared/unified-data-table.tsx`
- `lib/hooks/use-table-sort.ts`
- `lib/hooks/use-table-filter.ts`
- `lib/hooks/use-table-pagination.ts`
- `lib/hooks/use-server-table.ts`
- `components/shared/table-loading-skeleton.tsx`
- `components/shared/table-empty-state.tsx`
- `docs/TABLE_PATTERNS.md`

**Estimated Effort:** 4-6 hours

### Phase 2: Migrate Admin/Management Tables

**Goal:** Migrate most complex tables first

**Priority:** High (most duplication, most features)

**Files to Migrate:**
1. `customer-management-dashboard.tsx` - Server pagination, filters, sorting
2. `user-management-dashboard.tsx` - Server pagination, role filters
3. `audit-logging-dashboard.tsx` - Server pagination, date filters
4. `customer-assignment-step.tsx` - Client pagination, multi-filter

**Expected Code Reduction:** ~60% (1,600 → 640 lines)

**Estimated Effort:** 3-4 hours

### Phase 3: Migrate List Component Tables

**Goal:** Standardize all list tables

**Priority:** Medium (moderate duplication)

**Files to Migrate:**
1. `discount-rules-list.tsx`
2. `customer-discounts-list.tsx`
3. `inventory-discounts-list.tsx`
4. `bundle-deals-list.tsx`
5. `bogo-promotions-list.tsx`
6. `volume-pricing-list.tsx`
7. `tiered-pricing-list.tsx`

**Expected Code Reduction:** ~50% (1,400 → 700 lines)

**Estimated Effort:** 4-5 hours

### Phase 4: Migrate Testing/Results Tables

**Goal:** Consistent styling for testing tables

**Priority:** Low (display-only, less duplication)

**Files to Migrate:**
1. `basket-testing.tsx` (2 tables)
2. `historical-testing.tsx`
3. `scenario-testing.tsx` (2 tables)
4. `test-results.tsx`

**Expected Code Reduction:** ~40% (600 → 360 lines)

**Estimated Effort:** 2-3 hours

### Phase 5: Deprecate Old Patterns

**Goal:** Document and guide future development

**Deliverables:**
1. Deprecation warnings for manual table implementations
2. `TABLE_MIGRATION_GUIDE.md` with before/after examples
3. `TABLE_DEPRECATION_STATUS.md` tracking migration status
4. Mark refactor-003-d as complete

**Estimated Effort:** 1-2 hours

## Expected Outcomes

### Code Quality Metrics
- **Lines of Code Reduced:** ~2,160 lines (60% reduction)
- **Code Duplication:** Reduced by 70%
- **Consistency Score:** 95% (18/19 tables use same pattern)

### Developer Experience
- **Table Creation Time:** Reduced from 3 hours to 45 minutes
- **Bug Rate:** Reduced by 50% (standardized logic)
- **Maintenance Effort:** Reduced by 60% (centralized updates)

### User Experience
- **Consistent Behavior:** All tables have same interactions
- **Performance:** Optimized rendering with virtualization
- **Accessibility:** ARIA labels and keyboard navigation
- **Mobile Support:** Responsive table layouts

## Technical Approach

### Column Definition System

\`\`\`typescript
interface ColumnDef<T> {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (info: { row: T; value: any }) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: "left" | "center" | "right"
}
\`\`\`

### UnifiedDataTable API

\`\`\`typescript
interface UnifiedDataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  loading?: boolean
  emptyMessage?: string
  
  // Sorting
  sortable?: boolean
  defaultSort?: { field: string; direction: "asc" | "desc" }
  onSortChange?: (field: string, direction: "asc" | "desc") => void
  
  // Filtering
  filterable?: boolean
  filters?: FilterConfig[]
  onFilterChange?: (filters: Record<string, any>) => void
  
  // Pagination
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  
  // Row actions
  rowActions?: (row: T) => React.ReactNode
  onRowClick?: (row: T) => void
  
  // Selection
  selectable?: boolean
  selectedRows?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
}
\`\`\`

### Migration Example

**Before:**
\`\`\`tsx
// 200+ lines of manual table implementation
const [searchTerm, setSearchTerm] = useState("")
const [sortField, setSortField] = useState("name")
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

const filteredAndSorted = useMemo(() => {
  let result = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  result.sort((a, b) => {
    // Manual sorting logic...
  })
  return result
}, [data, searchTerm, sortField, sortDirection])

return (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead onClick={() => handleSort("name")}>
          Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
        </TableHead>
        {/* More headers... */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredAndSorted.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          {/* More cells... */}
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
\`\`\`

**After:**
\`\`\`tsx
// 50 lines with UnifiedDataTable
const columns: ColumnDef<Item>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
    sortable: true,
    filterable: true,
  },
  // More columns...
]

return (
  <UnifiedDataTable
    data={data}
    columns={columns}
    sortable
    filterable
    pagination={{
      page: 1,
      pageSize: 20,
      total: data.length,
      onPageChange: setPage,
    }}
  />
)
\`\`\`

## Risk Mitigation

### Potential Risks
1. **Breaking Changes:** Parent components may need updates
2. **Performance:** Large datasets may need virtualization
3. **Custom Styling:** Some tables have unique styling needs
4. **Testing Effort:** Each migrated table needs manual testing

### Mitigation Strategies
1. **Gradual Migration:** One table per day to reduce risk
2. **Virtualization:** Add react-window for large datasets
3. **Style Props:** Support custom className and style overrides
4. **Automated Tests:** Add unit tests for table hooks

## Success Criteria

- [ ] All 18 tables migrated to UnifiedDataTable
- [ ] Code duplication reduced by 60%+
- [ ] No regressions in functionality
- [ ] Comprehensive documentation complete
- [ ] Team trained on new patterns

## Timeline

- **Phase 1:** 1 day (Create unified system)
- **Phase 2:** 1 day (Migrate admin tables)
- **Phase 3:** 2 days (Migrate list tables)
- **Phase 4:** 1 day (Migrate testing tables)
- **Phase 5:** 0.5 days (Deprecation and docs)

**Total:** 5.5 days

## Next Steps

1. Review and approve this plan
2. Begin Phase 1: Create Unified Table System
3. Migrate tables incrementally
4. Document patterns and best practices
5. Train team on new system

---

**Status:** Planning Complete  
**Ready to Start:** Phase 1
