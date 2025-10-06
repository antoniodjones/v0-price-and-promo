# Form Patterns Guide

This guide documents the standardized form patterns for the GTI Pricing Engine.

## Overview

All forms use:
- **react-hook-form** for form state management
- **Zod** for validation schemas
- **shadcn/ui Form components** for consistent UI
- **Form helpers** (`lib/form-helpers.tsx`) for common field types

## Basic Form Structure

\`\`\`tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField
} from "@/components/ui/form"
import { TextField, NumberField, SelectField } from "@/lib/form-helpers"
import { Button } from "@/components/ui/button"

// 1. Define your schema
const myFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().positive("Age must be positive"),
  role: z.enum(["admin", "user"]),
})

type MyFormData = z.infer<typeof myFormSchema>

// 2. Create your form component
export function MyForm() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(myFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      role: "user",
    },
  })

  const onSubmit = (data: MyFormData) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TextField
          form={form}
          name="name"
          label="Name"
          required
        />
        
        <NumberField
          form={form}
          name="age"
          label="Age"
          required
        />
        
        <SelectField
          form={form}
          name="role"
          label="Role"
          options={[
            { label: "Administrator", value: "admin" },
            { label: "User", value: "user" },
          ]}
          required
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
\`\`\`

## Available Form Helpers

### TextField
For text, email, password inputs.

\`\`\`tsx
<TextField
  form={form}
  name="email"
  label="Email Address"
  placeholder="you@example.com"
  description="We'll never share your email"
  required
/>
\`\`\`

### NumberField
For numeric inputs with automatic parsing.

\`\`\`tsx
<NumberField
  form={form}
  name="price"
  label="Price"
  placeholder="0.00"
  required
/>
\`\`\`

### SelectField
For dropdown selections.

\`\`\`tsx
<SelectField
  form={form}
  name="category"
  label="Category"
  options={[
    { label: "Flower", value: "flower" },
    { label: "Edibles", value: "edibles" },
  ]}
  required
/>
\`\`\`

### CheckboxField
For boolean values.

\`\`\`tsx
<CheckboxField
  form={form}
  name="acceptTerms"
  label="Accept Terms"
  checkboxLabel="I agree to the terms and conditions"
/>
\`\`\`

### RadioField
For single selection from multiple options.

\`\`\`tsx
<RadioField
  form={form}
  name="shippingMethod"
  label="Shipping Method"
  options={[
    { label: "Standard", value: "standard", description: "5-7 business days" },
    { label: "Express", value: "express", description: "2-3 business days" },
  ]}
  required
/>
\`\`\`

### DateField
For date/datetime inputs.

\`\`\`tsx
<DateField
  form={form}
  name="startDate"
  label="Start Date"
  required
/>
\`\`\`

## Validation Schemas

Reuse existing schemas from `lib/schemas/index.ts`:

\`\`\`tsx
import { CreateCustomerDiscountSchema } from "@/lib/schemas"

const form = useForm({
  resolver: zodResolver(CreateCustomerDiscountSchema),
})
\`\`\`

## Migration Checklist

When migrating old forms:

1. ✅ Replace `components/molecules/form-field.tsx` with form helpers
2. ✅ Add Zod schema for validation
3. ✅ Use `useForm` with `zodResolver`
4. ✅ Wrap in `<Form>` component
5. ✅ Replace manual error handling with `<FormMessage>`
6. ✅ Remove manual state management (useState)
7. ✅ Test validation and submission

## Benefits

- **Type Safety**: Full TypeScript support with inferred types
- **Validation**: Automatic validation with Zod schemas
- **Consistency**: All forms look and behave the same
- **Less Code**: Reusable helpers reduce boilerplate
- **Better UX**: Consistent error messages and accessibility
