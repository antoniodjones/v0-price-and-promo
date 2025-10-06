# Modal Migration Guide

## Overview

This guide helps you migrate from old Dialog/Sheet patterns to the new **UnifiedModal** system.

## Why Migrate?

The UnifiedModal system provides:
- ✅ Consistent behavior across all modals
- ✅ Built-in loading states and error handling
- ✅ Standardized form submission patterns
- ✅ Automatic keyboard shortcuts (Escape to close, Enter to submit)
- ✅ Responsive design (Dialog on desktop, Sheet on mobile)
- ✅ Reduced code duplication

## Migration Status

### ✅ Migrated Components (Phases 1-4)

**Edit Modals:**
- `customer-discount-edit-modal.tsx`
- `bundle-deal-edit-modal.tsx`
- `bogo-promotion-edit-modal.tsx`
- `inventory-discount-edit-modal.tsx`

**Form Modals:**
- `new-rule-modal.tsx`
- `product-add-modal.tsx`
- `tier-assignment-modal.tsx`
- `discount-rule-modal.tsx`
- `market-configuration-modal.tsx`

**Detail/View Modals:**
- `product-detail-modal.tsx`
- `product-details-modal.tsx`

### ⚠️ Pending Migration (Phase 5)

**Complex Modals (Require Custom Migration):**
- `market-pricing-edit-modal.tsx` - Uses wizard components
- `volume-pricing-modal.tsx` - Complex tier management
- `tiered-pricing-modal.tsx` - Customer tier selection
- `bulk-upload-modal.tsx` - File upload with progress
- `user-story-modal.tsx` - Complex form with dynamic arrays

**Non-Modal Components (Keep as-is):**
- `product-management.tsx` - Inline dialogs
- `add-product-dialog.tsx` - Simple dialog
- `bulk-operations-panel.tsx` - Panel component
- `admin/module-management-dashboard.tsx` - Admin dialogs
- `admin/user-management-dashboard.tsx` - Admin dialogs
- `auth/development-user-switcher.tsx` - Dev tool
- `task-actions-menu.tsx` - Menu dialogs
- `task-detail-sheet.tsx` - Side sheet (not modal)

## Migration Steps

### Step 1: Identify Modal Type

Determine which modal type best fits your use case:

1. **Edit Modal** - Editing existing records
2. **Form Modal** - Creating new records
3. **Detail Modal** - Viewing record details
4. **Custom Modal** - Complex interactions (wizards, multi-step, file uploads)

### Step 2: Choose Migration Path

#### For Simple Edit/Form/Detail Modals

Use the helper functions from `modal-helpers.ts`:

\`\`\`typescript
import { createEditModal, createFormModal, createDetailModal } from "@/components/shared/modal-helpers"

// Edit Modal
export const MyEditModal = createEditModal({
  title: "Edit Item",
  description: "Update item details",
  fetchUrl: (id) => `/api/items/${id}`,
  submitUrl: (id) => `/api/items/${id}`,
  FormComponent: MyEditForm,
})

// Form Modal
export const MyFormModal = createFormModal({
  title: "Create Item",
  description: "Add a new item",
  submitUrl: "/api/items",
  FormComponent: MyCreateForm,
})

// Detail Modal
export const MyDetailModal = createDetailModal({
  title: "Item Details",
  fetchUrl: (id) => `/api/items/${id}`,
  ContentComponent: MyDetailContent,
})
\`\`\`

#### For Complex Modals

Use UnifiedModal directly with custom content:

\`\`\`typescript
import { UnifiedModal } from "@/components/shared/unified-modal"

export function MyComplexModal({ isOpen, onClose, itemId }: Props) {
  const [step, setStep] = useState(1)
  
  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Step Process"
      description={`Step ${step} of 3`}
      size="xl"
    >
      {step === 1 && <StepOne onNext={() => setStep(2)} />}
      {step === 2 && <StepTwo onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepThree onComplete={onClose} onBack={() => setStep(2)} />}
    </UnifiedModal>
  )
}
\`\`\`

### Step 3: Update Form Components

Ensure your form components accept the required props:

\`\`\`typescript
interface FormProps {
  data?: any // For edit modals
  onSubmit: (formData: any) => Promise<void>
  isSubmitting: boolean
}

export function MyForm({ data, onSubmit, isSubmitting }: FormProps) {
  const [formData, setFormData] = useState(data || {})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}
\`\`\`

### Step 4: Update Parent Components

Replace old modal usage with new modal:

**Before:**
\`\`\`typescript
import { Dialog, DialogContent } from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    {/* Custom modal content */}
  </DialogContent>
</Dialog>
\`\`\`

**After:**
\`\`\`typescript
import { MyEditModal } from "@/components/items/my-edit-modal"

<MyEditModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  itemId={selectedId}
  onSuccess={handleSuccess}
/>
\`\`\`

### Step 5: Test Migration

Verify the following:
- ✅ Modal opens and closes correctly
- ✅ Data loads properly (for edit/detail modals)
- ✅ Form submission works
- ✅ Success/error messages display
- ✅ Keyboard shortcuts work (Escape, Enter)
- ✅ Mobile responsiveness (Sheet on mobile)
- ✅ Loading states display correctly

## Common Patterns

### Pattern 1: Edit Modal with Validation

\`\`\`typescript
export const ProductEditModal = createEditModal({
  title: "Edit Product",
  description: "Update product information",
  fetchUrl: (id) => `/api/products/${id}`,
  submitUrl: (id) => `/api/products/${id}`,
  FormComponent: ProductEditForm,
  validate: (data) => {
    if (!data.name) return "Name is required"
    if (data.price < 0) return "Price must be positive"
    return null
  },
})
\`\`\`

### Pattern 2: Form Modal with Default Values

\`\`\`typescript
export function NewProductModal({ isOpen, onClose, category }: Props) {
  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Product"
      description="Create a new product"
      submitUrl="/api/products"
      defaultData={{ category, status: "active" }}
      FormComponent={ProductForm}
      onSuccess={onClose}
    />
  )
}
\`\`\`

### Pattern 3: Detail Modal with Actions

\`\`\`typescript
export const ProductDetailModal = createDetailModal({
  title: "Product Details",
  fetchUrl: (id) => `/api/products/${id}`,
  ContentComponent: ({ data, onClose }) => (
    <div>
      <ProductDetails product={data} />
      <div className="flex gap-2 mt-4">
        <Button onClick={() => handleEdit(data.id)}>Edit</Button>
        <Button variant="destructive" onClick={() => handleDelete(data.id)}>
          Delete
        </Button>
      </div>
    </div>
  ),
})
\`\`\`

## Troubleshooting

### Issue: Modal doesn't close after submission

**Solution:** Ensure `onSuccess` callback is called:

\`\`\`typescript
const handleSuccess = () => {
  refreshData()
  onClose() // Don't forget this!
}
\`\`\`

### Issue: Form data not loading

**Solution:** Check fetchUrl returns correct data structure:

\`\`\`typescript
// API should return: { success: true, data: {...} }
fetchUrl: (id) => `/api/items/${id}`,
\`\`\`

### Issue: Validation not working

**Solution:** Add validate function to modal config:

\`\`\`typescript
validate: (data) => {
  if (!data.required_field) return "Field is required"
  return null // Return null if valid
}
\`\`\`

## Best Practices

1. **Keep forms simple** - Extract complex logic to separate hooks
2. **Use TypeScript** - Define proper types for form data
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Test edge cases** - Empty data, network errors, validation failures
5. **Follow naming conventions** - `*EditModal`, `*FormModal`, `*DetailModal`

## Need Help?

- Check existing migrated modals for examples
- Review `MODAL_PATTERNS.md` for pattern documentation
- See `unified-modal.tsx` for API reference
- Ask the team for guidance on complex migrations

## Deprecation Timeline

- **Phase 1-4 (Completed):** Core modals migrated
- **Phase 5 (Current):** Complex modals migration
- **Phase 6 (Future):** Remove old Dialog/Sheet patterns
- **Phase 7 (Future):** Update documentation and training

---

**Last Updated:** refactor-003-c-phase-5
**Maintained By:** Development Team
