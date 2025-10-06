# Card Component Consolidation Plan (refactor-003-e)

## Overview
Consolidate duplicate card components across the application into a unified, flexible card system. Currently, there are 7+ specialized card components with overlapping functionality and ~1,000 lines of duplicate code.

## Current State Analysis

### Existing Card Components

#### **Base Card (Shadcn/ui)**
- `components/ui/card.tsx` - Base card with composable parts
- Components: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Status: ✅ Keep as foundation

#### **Stat/Metric Cards (3 variants - CONSOLIDATE)**
1. `components/molecules/stat-card.tsx` - StatCard with icon, title, value, change
2. `components/molecules/metric-card.tsx` - MetricCard with trend indicators
3. `components/dashboard/metric-card.tsx` - Dashboard-specific variant (duplicate)

**Duplication:** ~200 lines of similar code across 3 files

#### **Action/Navigation Cards**
4. `components/molecules/quick-action-card.tsx` - Navigation cards with icons
5. `components/molecules/pricing-card.tsx` - Price breakdown cards

**Status:** Specialized but could benefit from unified styling

#### **Product Cards (2 variants - CONSOLIDATE)**
6. `components/product-card.tsx` - Basic product display
7. `components/enhanced-product-card.tsx` - Enhanced with watchlist/alerts

**Duplication:** ~150 lines of similar code

### Usage Patterns

#### **Dashboard/Stats Pattern (Most Common)**
- **Files:** `bundle-deals-stats.tsx`, `promotion-performance.tsx`, `dashboard-stats.tsx`
- **Pattern:** Grid layout (2-4 columns) with stat cards
- **Structure:** CardHeader with icon + CardContent with value + change indicator
- **Usage:** 20+ instances across analytics, market pricing, promotions

#### **Info/Configuration Pattern**
- **Files:** Wizard steps, settings pages, monitoring dashboards
- **Pattern:** Cards with detailed information or forms
- **Custom Styling:** Border colors for status (success, warning, error)
- **Usage:** 50+ instances across wizards and configuration

#### **Action Card Pattern**
- **Files:** Quick actions, navigation sections
- **Pattern:** Clickable cards with icon, title, description
- **Usage:** 10+ instances for navigation

### Card Styling Variations

**Status Colors:**
- Success: `border-gti-bright-green`, `bg-gti-light-green/10`
- Warning: `border-yellow-200`, `bg-yellow-50`
- Error: `border-red-200`, `bg-red-50`
- Info: `border-blue-200`, `bg-blue-50`
- Neutral: `bg-gray-50`, `border-gray-200`

**Layout Patterns:**
- 2-column: `md:grid-cols-2`
- 3-column: `lg:grid-cols-3`
- 4-column: `lg:grid-cols-4` (most common for stats)

## Consolidation Strategy

### Phase 1: Create Unified Card System
**Goal:** Build flexible card components that handle all use cases

**Components to Create:**
1. **UnifiedCard** - Main card component with variants
   - `variant: "stat" | "metric" | "info" | "action" | "product"`
   - `status: "default" | "success" | "warning" | "error" | "info"`
   - `size: "sm" | "md" | "lg"`
   - Props: title, value, icon, trend, change, description, actions

2. **Card Utilities** (`lib/card-helpers.ts`)
   - `formatCardValue()` - Format numbers, currency, percentages
   - `getCardStatusStyles()` - Get border/background for status
   - `calculateTrend()` - Calculate trend from values

3. **Card Formatters** (`lib/card-formatters.ts`)
   - `formatCurrency()` - Format currency values
   - `formatPercentage()` - Format percentage changes
   - `formatNumber()` - Format large numbers with K/M suffixes

**Expected Results:**
- Single flexible card component
- ~200 lines of reusable code
- Consistent styling system

### Phase 2: Migrate Dashboard Cards
**Goal:** Migrate all dashboard stat and metric cards

**Files to Migrate:**
1. `components/bundle-deals/bundle-deals-stats.tsx` (4 stat cards)
2. `components/promotions/promotion-performance.tsx` (8 stat cards)
3. `components/organisms/dashboard-stats.tsx` (4 stat cards)
4. `app/page.tsx` (dashboard cards)
5. `app/analytics/page.tsx` (analytics cards)
6. `app/market-pricing/page.tsx` (market cards)

**Migration Pattern:**
\`\`\`tsx
// Before
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-muted-foreground">Active Bundles</CardTitle>
    <Package className="h-4 w-4 text-gti-bright-green" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-gti-dark-green">12</div>
    <div className="text-xs text-muted-foreground">+2 this month</div>
  </CardContent>
</Card>

// After
<UnifiedCard
  variant="stat"
  title="Active Bundles"
  value={12}
  icon={Package}
  change={{ value: 2, label: "this month", type: "increase" }}
/>
\`\`\`

**Expected Results:**
- ~300 lines of duplicate code eliminated
- Consistent dashboard styling
- Easier to maintain stats

### Phase 3: Migrate Info and Action Cards
**Goal:** Standardize info cards in wizards and action cards for navigation

**Files to Migrate:**
1. Wizard step info cards (15+ files)
2. Settings section cards (8+ files)
3. Quick action cards (5+ files)
4. Pricing cards (2 files)

**Migration Pattern:**
\`\`\`tsx
// Before (Info Card)
<Card className="bg-gti-light-green/10 border-gti-bright-green">
  <CardHeader>
    <CardTitle className="text-base">Configuration Summary</CardTitle>
    <CardDescription>Review settings</CardDescription>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// After
<UnifiedCard
  variant="info"
  status="success"
  title="Configuration Summary"
  description="Review settings"
>
  {/* content */}
</UnifiedCard>
\`\`\`

**Expected Results:**
- ~250 lines of duplicate code eliminated
- Consistent wizard styling
- Standardized status colors

### Phase 4: Migrate Product Cards
**Goal:** Consolidate basic and enhanced product cards

**Files to Migrate:**
1. `components/product-card.tsx`
2. `components/enhanced-product-card.tsx`

**Migration Strategy:**
- Create `UnifiedProductCard` with `enhanced` prop
- Preserve watchlist and alert functionality
- Maintain product-specific features (THC %, stock levels)

**Expected Results:**
- ~150 lines of duplicate code eliminated
- Single product card component
- Enhanced features available via prop

### Phase 5: Deprecate Old Card Patterns
**Goal:** Mark old components as deprecated and guide future development

**Tasks:**
1. Add deprecation comments to old card files
2. Create `CARD_MIGRATION_GUIDE.md`
3. Document best practices in `CARD_PATTERNS.md`
4. Update component showcase

**Expected Results:**
- Clear migration path for remaining cards
- Documented best practices
- Refactor-003-e complete

## Success Metrics

### Code Reduction
- **Before:** ~1,000 lines of duplicate card code
- **After:** ~200 lines of unified card code
- **Reduction:** ~800 lines (80%)

### Component Consolidation
- **Before:** 7 specialized card components
- **After:** 2 unified card components (UnifiedCard, UnifiedProductCard)
- **Reduction:** 5 components eliminated

### Consistency Improvements
- Standardized card styling across all pages
- Consistent status colors and variants
- Unified card behavior and interactions

## Timeline

- **Phase 1:** 2-3 hours (Create unified system)
- **Phase 2:** 3-4 hours (Migrate dashboards)
- **Phase 3:** 4-5 hours (Migrate info/action cards)
- **Phase 4:** 2-3 hours (Migrate product cards)
- **Phase 5:** 1-2 hours (Deprecation and docs)

**Total:** 12-17 hours

## Dependencies

- Requires: DESIGN_DECISIONS.md principles
- Requires: Existing shadcn/ui card component
- Blocks: None (can proceed independently)

## Notes

- Maintain backward compatibility during migration
- Test all card interactions (hover, click, keyboard)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Follow Clean Code principles (small functions, single responsibility)
- Use existing design tokens for colors and spacing
