-- Add detailed subtasks for refactor-003-c: Consolidate Modal Components
-- Breaking down modal consolidation into phases

DO $$
BEGIN
  -- Add subtasks for modal consolidation
  INSERT INTO user_stories (
    id,
    title,
    description,
    priority,
    status,
    acceptance_criteria,
    tasks,
    assignee,
    reporter,
    story_type,
    parent_id,
    created_at
  ) VALUES
  (
    'refactor-003-c-1',
    'Create Unified Modal System',
    'Create a unified modal component system with variants (dialog, sheet, drawer, alert) and consistent behavior patterns.',
    'high',
    'in_progress',
    '["UnifiedModal component created with variants","Consistent keyboard handling (Escape, Tab)","Backdrop click behavior standardized","Loading and error states built-in","Accessibility features (ARIA labels, focus management)"]',
    '["Create UnifiedModal base component","Add variant support (dialog, sheet, drawer, alert)","Implement keyboard navigation","Add focus trap and focus management","Create loading and error state patterns","Add ARIA labels and screen reader support","Document modal API and usage patterns"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-c',
    NOW()
  ),
  (
    'refactor-003-c-2',
    'Consolidate Edit Modals',
    'Consolidate 4 duplicate edit modals (customer-discount, bundle-deal, bogo, inventory) into a unified edit modal pattern.',
    'high',
    'todo',
    '["UnifiedEditModal component created","All 4 edit modals migrated","Wizard integration working","Loading states consistent","No duplicate edit modal code"]',
    '["Analyze common patterns in edit modals","Create UnifiedEditModal component","Migrate customer-discount-edit-modal","Migrate bundle-deal-edit-modal","Migrate bogo-promotion-edit-modal","Migrate inventory-discount-edit-modal","Test all edit flows","Remove old edit modal files"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-c',
    NOW()
  ),
  (
    'refactor-003-c-3',
    'Consolidate Product Detail Modals',
    'Consolidate duplicate product detail modals (product-details-modal.tsx and product-detail-modal.tsx) into one component.',
    'medium',
    'todo',
    '["Single ProductDetailModal component","All usages migrated","Duplicate file removed","Consistent product display"]',
    '["Compare product-details-modal and product-detail-modal","Choose best implementation","Migrate all usages","Remove duplicate file","Update imports"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-c',
    NOW()
  ),
  (
    'refactor-003-c-4',
    'Standardize Confirmation Dialogs',
    'Create consistent confirmation dialog pattern using AlertDialog for all confirmation actions.',
    'medium',
    'todo',
    '["ConfirmationDialog component created","Common confirmation patterns documented","High-traffic confirmations migrated","Consistent UX across app"]',
    '["Create ConfirmationDialog wrapper","Add common confirmation variants (delete, save, cancel)","Migrate bulk operations confirmations","Migrate module toggle confirmations","Document confirmation patterns"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-c',
    NOW()
  ),
  (
    'refactor-003-c-5',
    'Improve Modal Accessibility',
    'Enhance modal accessibility with proper ARIA labels, keyboard navigation, and screen reader support.',
    'high',
    'todo',
    '["All modals have proper ARIA labels","Keyboard navigation works (Tab, Escape, Enter)","Focus management implemented","Screen reader tested","WCAG 2.1 AA compliant"]',
    '["Audit current modal accessibility","Add missing ARIA labels","Implement focus trap","Test with screen readers","Add keyboard shortcuts documentation","Fix any accessibility violations"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-c',
    NOW()
  );

END $$;
