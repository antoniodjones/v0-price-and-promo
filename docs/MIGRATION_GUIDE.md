# Form Component Migration Guide

## Overview

We've migrated from custom form components to a standardized system using **react-hook-form** + **Zod** validation. This provides better type safety, automatic validation, and consistent error handling.

## Deprecated Components

The following components are deprecated and will be removed:

- ❌ `components/molecules/form-field.tsx`
- ❌ `components/molecules/form-field-wrapper.tsx`
- ❌ `components/atoms/enhanced-input.tsx`

## New Form System

Use these instead:

- ✅ `lib/form-helpers.tsx` - Reusable form field helpers
- ✅ `components/ui/form.tsx` - Core form components (react-hook-form)
- ✅ `lib/schemas/index.ts` - Zod validation schemas

## Migration Examples

### Before (Old Pattern)

\`\`\`tsx
import { FormField } from "@/components/molecules/form-field"

function MyComponent() {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")

  return (
    <FormField
      label="Email"
      value={value}
      onChange={setValue}
      error={error}
      required
    />
  )
}
\`\`\`

### After (New Pattern)

\`\`\`tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { TextField } from "@/lib/form-helpers"

const schema = z.object({
  email: z.string().email("Invalid email address")
})

function MyComponent() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <TextField
        form={form}
        name="email"
        label="Email"
        required
      />
    </form>
  )
}
\`\`\`

## Benefits of New System

1. **Type Safety** - TypeScript infers form data types from Zod schemas
2. **Automatic Validation** - Zod schemas validate on blur/submit
3. **Less Boilerplate** - No manual state management or error handling
4. **Consistent UX** - All forms use the same validation and error display
5. **Better Testing** - Validation logic is separate and testable

## Wizard Step Migration

For wizard steps that use `updateFormData`:

### Before

\`\`\`tsx
function MyStep({ formData, updateFormData }) {
  return (
    <FormField
      label="Discount"
      value={formData.discount}
      onChange={(val) => updateFormData({ discount: val })}
    />
  )
}
\`\`\`

### After

\`\`\`tsx
function MyStep({ formData, updateFormData }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: formData
  })

  // Sync form changes back to wizard
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateFormData(values)
    })
    return () => subscription.unsubscribe()
  }, [form, updateFormData])

  return (
    <NumberField
      form={form}
      name="discount"
      label="Discount"
      min={0}
      max={100}
    />
  )
}
\`\`\`

## Need Help?

See `docs/FORM_PATTERNS.md` for comprehensive examples and patterns.

## Migrated Components

The following components have already been migrated:

✅ discount-value-step.tsx
✅ discount-dates-step.tsx
✅ promo-value-step.tsx
✅ bundle-pricing-step.tsx
✅ auto-discount-value-step.tsx
✅ bogo-trigger-step.tsx
✅ bundle-products-step.tsx
✅ bogo-reward-step.tsx
✅ promo-dates-step.tsx
✅ auto-discount-dates-step.tsx

Use these as reference examples for your migrations.
