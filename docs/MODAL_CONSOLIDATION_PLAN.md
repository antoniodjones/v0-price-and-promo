# Modal Consolidation Plan - refactor-003-c

## Current State Analysis

### Modal Types Found

#### 1. Edit Modals (4 duplicates)
- `customer-discount-edit-modal.tsx` - 6-step wizard
- `bundle-deal-edit-modal.tsx` - 6-step wizard  
- `bogo-promotion-edit-modal.tsx` - 5-step wizard
- `inventory-discount-edit-modal.tsx` - 6-step wizard

**Common Pattern:**
- All use Dialog from ui/dialog
- All integrate with UnifiedWizard
- All have loading states for data fetching
- All have similar navigation (ChevronLeft/ChevronRight)
- All have progress indicators

**Consolidation Opportunity:** Create `UnifiedEditModal` that accepts wizard config

#### 2. Product Detail Modals (2 duplicates)
- `product-details-modal.tsx` - Full product view with stats
- `product-detail-modal.tsx` - Similar product view

**Consolidation Opportunity:** Merge into single `ProductDetailModal`

#### 3. Pricing Modals (2 complex forms)
- `volume-pricing-modal.tsx` - Tier management with add/remove
- `tiered-pricing-modal.tsx` - Customer tier selection

**Status:** Keep separate (different business logic)

#### 4. Configuration Modals
- `market-configuration-modal.tsx` - Contains nested wizards
- `discount-rule-modal.tsx` - Complex tier configuration
- `tier-assignment-modal.tsx` - Customer assignment
- `new-rule-modal.tsx` - Conditional form based on rule type

**Status:** Keep separate (unique business logic)

#### 5. Simple Dialogs (scattered throughout)
- Confirmation dialogs (inline in components)
- User story modal
- Product add modal
- Bulk upload modal

**Consolidation Opportunity:** Standardize confirmation pattern

### Base UI Components (Good - Keep)
- `ui/dialog.tsx` - Radix Dialog wrapper ✅
- `ui/alert-dialog.tsx` - Radix AlertDialog wrapper ✅
- `ui/sheet.tsx` - Radix Sheet wrapper ✅

## Consolidation Strategy

### Phase 1: Create Unified Modal System ✅ IN PROGRESS
**Goal:** Create base modal infrastructure

**Deliverables:**
1. `UnifiedModal` component with variants:
   - `dialog` (default center modal)
   - `sheet` (side drawer)
   - `drawer` (bottom drawer)
   - `alert` (confirmation)

2. Features:
   - Consistent keyboard handling (Escape, Tab, Enter)
   - Backdrop click behavior
   - Loading states
   - Error states
   - Focus management
   - ARIA labels

3. Documentation:
   - Modal API reference
   - Usage examples
   - Accessibility guidelines

### Phase 2: Consolidate Edit Modals
**Goal:** Eliminate 4 duplicate edit modals

**Approach:**
1. Create `UnifiedEditModal` component
2. Accept props:
   - `wizardConfig` - UnifiedWizard configuration
   - `loadData` - Function to fetch initial data
   - `onSave` - Function to save data
   - `title` - Modal title
   - `description` - Modal description

3. Migrate in order:
   - customer-discount-edit-modal (simplest)
   - bundle-deal-edit-modal
   - bogo-promotion-edit-modal
   - inventory-discount-edit-modal (most complex)

4. Remove old files after migration

### Phase 3: Consolidate Product Modals
**Goal:** Merge duplicate product detail modals

**Approach:**
1. Compare both implementations
2. Choose best features from each
3. Create single `ProductDetailModal`
4. Migrate all usages
5. Remove duplicate

### Phase 4: Standardize Confirmations
**Goal:** Consistent confirmation dialogs

**Approach:**
1. Create `ConfirmationDialog` wrapper around AlertDialog
2. Add common variants:
   - Delete confirmation
   - Save confirmation
   - Cancel confirmation
   - Destructive action confirmation

3. Migrate high-traffic confirmations:
   - Bulk operations
   - Module toggles
   - User management actions

### Phase 5: Accessibility Improvements
**Goal:** WCAG 2.1 AA compliance

**Tasks:**
- Add proper ARIA labels to all modals
- Implement focus trap
- Test keyboard navigation
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Add skip links where needed
- Document keyboard shortcuts

## Success Metrics

- ✅ 4 edit modals → 1 UnifiedEditModal
- ✅ 2 product modals → 1 ProductDetailModal
- ✅ Consistent confirmation pattern across app
- ✅ All modals WCAG 2.1 AA compliant
- ✅ Reduced modal code by ~60%
- ✅ Consistent UX across all modals

## Files to Create

1. `components/shared/unified-modal.tsx` - Base modal system
2. `components/shared/unified-edit-modal.tsx` - Edit modal wrapper
3. `components/shared/confirmation-dialog.tsx` - Confirmation wrapper
4. `docs/MODAL_PATTERNS.md` - Usage documentation

## Files to Deprecate/Remove

1. `components/customer-discounts/customer-discount-edit-modal.tsx`
2. `components/bundle-deals/bundle-deal-edit-modal.tsx`
3. `components/promotions/bogo-promotion-edit-modal.tsx`
4. `components/inventory-discounts/inventory-discount-edit-modal.tsx`
5. `components/products/product-detail-modal.tsx` (keep product-details-modal.tsx)

## Timeline

- Phase 1: 1-2 hours (Create unified system)
- Phase 2: 2-3 hours (Migrate edit modals)
- Phase 3: 30 minutes (Consolidate product modals)
- Phase 4: 1 hour (Standardize confirmations)
- Phase 5: 1-2 hours (Accessibility improvements)

**Total: 5-8 hours**
