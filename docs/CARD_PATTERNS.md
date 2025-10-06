# Card Patterns Guide

## Overview

The UnifiedCard component provides a flexible, consistent way to display card-based content across the application. It supports 5 variants optimized for different use cases.

## Card Variants

### 1. Stat Card
Display key metrics with optional trend indicators.

**Use for:** Dashboard statistics, KPIs, summary metrics

\`\`\`tsx
<UnifiedCard
  variant="stat"
  title="Total Revenue"
  value={125000}
  icon={DollarSign}
  trend={{ value: 12.5, direction: "up", period: "last month" }}
/>
\`\`\`

### 2. Metric Card
Larger format for prominent metrics with trend visualization.

**Use for:** Hero metrics, primary dashboard numbers

\`\`\`tsx
<UnifiedCard
  variant="metric"
  label="Active Customers"
  value={1234}
  trend={{ value: 8.2, direction: "up", period: "last week" }}
  size="lg"
/>
\`\`\`

### 3. Action Card
Interactive cards that trigger navigation or actions.

**Use for:** Quick actions, navigation shortcuts, feature discovery

\`\`\`tsx
<UnifiedCard
  variant="action"
  title="Create Promotion"
  description="Set up a new promotional campaign"
  icon={Plus}
  iconColor="bg-gti-dark-green"
  onClick={() => router.push('/promotions/new')}
/>
\`\`\`

### 4. Info Card
General-purpose cards for displaying information with custom content.

**Use for:** Detailed information, settings panels, content blocks

\`\`\`tsx
<UnifiedCard
  variant="info"
  title="Discount Settings"
  description="Configure discount rules and limits"
  badge={{ label: "Active", variant: "default" }}
  content={<DiscountSettingsForm />}
  footer={<Button>Save Changes</Button>}
/>
\`\`\`

### 5. Product Card
Specialized cards for product display with pricing and actions.

**Use for:** Product listings, catalog views, comparison displays

\`\`\`tsx
<UnifiedCard
  variant="product"
  title="Premium Widget"
  subtitle="Electronics • Brand Name"
  price={99.99}
  badge={{ label: "Low Stock", variant: "destructive" }}
  actions={[
    { label: "View Details", onClick: handleView },
    { label: "Add to Cart", onClick: handleAdd, variant: "outline" }
  ]}
/>
\`\`\`

## Loading and Error States

All card variants support loading and error states:

\`\`\`tsx
// Loading state
<UnifiedCard
  variant="stat"
  title="Revenue"
  value={0}
  isLoading={true}
/>

// Error state
<UnifiedCard
  variant="stat"
  title="Revenue"
  value={0}
  error="Failed to load revenue data"
/>
\`\`\`

## Hooks

### useCardState
Manage card loading and error states:

\`\`\`tsx
const { isLoading, error, setLoading, setError, reset } = useCardState()

// Fetch data
setLoading(true)
try {
  const data = await fetchData()
  reset()
} catch (err) {
  setError(err.message)
}
\`\`\`

### useCardActions
Create card actions with navigation:

\`\`\`tsx
const { createAction, createNavigationAction } = useCardActions()

const actions = [
  createNavigationAction("View Details", "/products/123"),
  createAction("Add to Cart", handleAddToCart, "outline")
]
\`\`\`

## Helper Functions

### Trend Calculations
\`\`\`tsx
import { calculateTrendDirection, calculateTrendPercentage } from '@/lib/card-helpers'

const direction = calculateTrendDirection(current, previous)
const percentage = calculateTrendPercentage(current, previous)
\`\`\`

### Value Formatting
\`\`\`tsx
import { formatCardValue, formatCurrency, formatPercentage } from '@/lib/card-helpers'

const displayValue = formatCardValue(1234) // "1,234"
const price = formatCurrency(99.99) // "$99.99"
const percent = formatPercentage(12.5) // "12.5%"
\`\`\`

## Design Principles

1. **Consistent Sizing**: Use size prop (sm, md, lg) for consistent spacing
2. **Meaningful Icons**: Icons should clarify purpose, not decorate
3. **Clear Hierarchy**: Title → Value → Supporting info
4. **Accessible Colors**: Trend colors meet WCAG contrast requirements
5. **Loading States**: Always show loading skeleton during data fetch
6. **Error Handling**: Display clear, actionable error messages

## Migration Guide

### From StatCard
\`\`\`tsx
// Before
<StatCard title="Revenue" value={1000} icon={DollarSign} />

// After
<UnifiedCard variant="stat" title="Revenue" value={1000} icon={DollarSign} />
\`\`\`

### From MetricCard
\`\`\`tsx
// Before
<MetricCard label="Users" value={500} trend={{ value: 10, direction: "up" }} />

// After
<UnifiedCard variant="metric" label="Users" value={500} trend={{ value: 10, direction: "up" }} />
\`\`\`

### From QuickActionCard
\`\`\`tsx
// Before
<QuickActionCard title="Create" description="New item" href="/new" icon={Plus} />

// After
<UnifiedCard 
  variant="action" 
  title="Create" 
  description="New item" 
  icon={Plus}
  onClick={() => router.push('/new')}
/>
\`\`\`

## Best Practices

1. **Choose the Right Variant**: Match variant to content type
2. **Provide Trends When Available**: Help users understand changes
3. **Use Loading States**: Prevent layout shift during data fetch
4. **Handle Errors Gracefully**: Show clear error messages
5. **Keep Actions Focused**: 1-2 primary actions per card
6. **Maintain Consistency**: Use same variant for similar content types

## Common Patterns

### Dashboard Grid
\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <UnifiedCard variant="stat" title="Revenue" value={125000} icon={DollarSign} />
  <UnifiedCard variant="stat" title="Orders" value={342} icon={ShoppingCart} />
  <UnifiedCard variant="stat" title="Customers" value={1234} icon={Users} />
  <UnifiedCard variant="stat" title="Products" value={89} icon={Package} />
</div>
\`\`\`

### Action Grid
\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <UnifiedCard variant="action" title="Create Promotion" description="..." icon={Plus} onClick={...} />
  <UnifiedCard variant="action" title="View Reports" description="..." icon={BarChart} onClick={...} />
</div>
\`\`\`

### Product Catalog
\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map(product => (
    <UnifiedCard
      key={product.id}
      variant="product"
      title={product.name}
      subtitle={product.category}
      price={product.price}
      actions={[...]}
    />
  ))}
</div>
