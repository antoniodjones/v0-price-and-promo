# Modal Patterns Guide

This guide documents the unified modal system and best practices for creating consistent modal experiences.

## Overview

The `UnifiedModal` component consolidates all modal patterns into a single, flexible component that supports:
- Simple dialogs
- Fullscreen modals
- Wizard-based flows
- Loading states
- Custom footers and actions

## Basic Usage

### Simple Dialog

\`\`\`tsx
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useModal } from "@/lib/modal-helpers"

function MyComponent() {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <Button onClick={open}>Open Dialog</Button>
      
      <UnifiedModal
        isOpen={isOpen}
        onClose={close}
        title="Confirm Action"
        description="Are you sure you want to proceed?"
        size="md"
        mode="dialog"
        onSubmit={() => {
          // Handle submit
          close()
        }}
        submitLabel="Confirm"
      >
        <p>This action cannot be undone.</p>
      </UnifiedModal>
    </>
  )
}
\`\`\`

### Wizard Modal

\`\`\`tsx
import { UnifiedModal } from "@/components/shared/unified-modal"
import { useModal, useWizard } from "@/lib/modal-helpers"

const steps = [
  { id: 1, name: "Step 1", description: "First step" },
  { id: 2, name: "Step 2", description: "Second step" },
  { id: 3, name: "Step 3", description: "Final step" },
]

function WizardComponent() {
  const { isOpen, open, close } = useModal()
  const { currentStep, nextStep, prevStep, goToStep } = useWizard(steps.length)

  return (
    <UnifiedModal
      isOpen={isOpen}
      onClose={close}
      title="Create Item"
      mode="wizard"
      size="lg"
      steps={steps}
      currentStep={currentStep}
      onStepChange={goToStep}
      onNext={nextStep}
      onPrevious={prevStep}
      onSubmit={() => {
        // Handle final submit
        close()
      }}
      submitLabel="Create"
    >
      {/* Render step content based on currentStep */}
      {currentStep === 1 && <Step1Content />}
      {currentStep === 2 && <Step2Content />}
      {currentStep === 3 && <Step3Content />}
    </UnifiedModal>
  )
}
\`\`\`

### Fullscreen Modal

\`\`\`tsx
<UnifiedModal
  isOpen={isOpen}
  onClose={close}
  title="Edit Discount"
  mode="fullscreen"
  steps={steps}
  currentStep={currentStep}
  onStepChange={goToStep}
  badge={{
    label: "Edit Mode",
    icon: <Edit className="h-4 w-4" />,
    variant: "default"
  }}
>
  {/* Content */}
</UnifiedModal>
\`\`\`

## Props Reference

### Core Props
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `title: string` - Modal title
- `description?: string` - Optional description

### Mode and Appearance
- `mode?: "dialog" | "fullscreen" | "wizard"` - Modal display mode (default: "dialog")
- `size?: "sm" | "md" | "lg" | "xl" | "full"` - Modal size (default: "lg")
- `showCloseButton?: boolean` - Show X button (default: true)

### Loading State
- `isLoading?: boolean` - Show loading spinner
- `loadingMessage?: string` - Loading message text

### Wizard Props
- `steps?: WizardStep[]` - Array of wizard steps
- `currentStep?: number` - Current step index
- `onStepChange?: (step: number) => void` - Step change handler
- `showProgress?: boolean` - Show progress bar (default: true)

### Footer Actions
- `showFooter?: boolean` - Show footer (default: true)
- `footerContent?: React.ReactNode` - Custom footer content
- `onPrevious?: () => void` - Previous button handler
- `onNext?: () => void` - Next button handler
- `onSubmit?: () => void` - Submit button handler
- `canProceed?: boolean` - Enable/disable next/submit (default: true)
- `isSubmitting?: boolean` - Show submitting state
- `submitLabel?: string` - Submit button text (default: "Submit")

### Styling
- `className?: string` - Additional modal classes
- `contentClassName?: string` - Additional content classes
- `badge?: object` - Badge configuration for header

## Helper Hooks

### useModal()
Manages modal open/close state:
\`\`\`tsx
const { isOpen, open, close, toggle } = useModal()
\`\`\`

### useWizard(totalSteps, initialStep?)
Manages wizard navigation:
\`\`\`tsx
const {
  currentStep,
  nextStep,
  prevStep,
  goToStep,
  reset,
  isFirstStep,
  isLastStep,
  progress
} = useWizard(5)
\`\`\`

### useFormModal(initialData)
Manages form state in modals:
\`\`\`tsx
const {
  formData,
  updateFormData,
  resetFormData,
  isSubmitting,
  setIsSubmitting,
  isLoading,
  setIsLoading
} = useFormModal({ name: "", value: 0 })
\`\`\`

## Migration Examples

### Before (Old Pattern)
\`\`\`tsx
// Multiple modal implementations with duplicated code
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Custom wizard logic */}
    {/* Custom footer */}
  </DialogContent>
</Dialog>
\`\`\`

### After (Unified Pattern)
\`\`\`tsx
<UnifiedModal
  isOpen={isOpen}
  onClose={onClose}
  title="Title"
  mode="wizard"
  steps={steps}
  currentStep={currentStep}
  onStepChange={goToStep}
  onNext={nextStep}
  onPrevious={prevStep}
  onSubmit={handleSubmit}
>
  {children}
</UnifiedModal>
\`\`\`

## Best Practices

1. **Use appropriate mode**: Choose `dialog` for simple modals, `wizard` for multi-step flows, `fullscreen` for complex editing
2. **Leverage helper hooks**: Use `useModal`, `useWizard`, and `useFormModal` for consistent state management
3. **Validate before proceeding**: Set `canProceed` based on form validation
4. **Show loading states**: Use `isLoading` and `isSubmitting` for better UX
5. **Provide clear labels**: Use descriptive `submitLabel` and step descriptions
6. **Handle cleanup**: Reset form data and wizard state on close

## Component Status

✅ **Migrated to UnifiedModal**: (none yet - Phase 2)
⏳ **Pending Migration**: All 16 modal files
❌ **Deprecated**: (none yet - will be marked in Phase 3)
