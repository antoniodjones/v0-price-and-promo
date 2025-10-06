-- Add subtasks for refactor-003-d: Consolidate Table Components
-- Breaking down table consolidation into manageable phases

DO $$
DECLARE
  refactor_003_id TEXT;
BEGIN
  -- Verify parent task exists
  SELECT id INTO refactor_003_id 
  FROM user_stories 
  WHERE id = 'refactor-003';

  IF refactor_003_id IS NULL THEN
    RAISE EXCEPTION 'Parent task refactor-003 not found. Run script 29 first.';
  END IF;

  -- Add Phase subtasks for table consolidation
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
    'refactor-003-d-phase-1',
    'Create Unified Table System',
    'Build a comprehensive UnifiedDataTable component with built-in sorting, filtering, pagination, and column definitions. Create reusable table hooks for common patterns.',
    'high',
    'in_progress',
    '["UnifiedDataTable component created with TypeScript generics","Column definition system implemented","Built-in sorting (client & server-side)","Built-in filtering (multiple filter types)","Built-in pagination (client & server-side)","Loading and empty states","Row selection support","Action column support","Table hooks created (useTableSort, useTableFilter, useTablePagination)","Comprehensive documentation"]',
    '["Create UnifiedDataTable component with generic column definitions","Implement useTableSort hook for client-side sorting","Implement useTableFilter hook for multi-field filtering","Implement useTablePagination hook for client-side pagination","Implement useServerTable hook for server-side operations","Add loading skeleton and empty state components","Add row selection and bulk actions support","Create TABLE_PATTERNS.md documentation","Add TypeScript examples and usage patterns"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-d',
    NOW()
  ),
  (
    'refactor-003-d-phase-2',
    'Migrate Admin/Management Tables',
    'Migrate complex admin tables with server-side pagination, filtering, and sorting to UnifiedDataTable.',
    'high',
    'todo',
    '["customer-management-dashboard.tsx migrated","user-management-dashboard.tsx migrated","audit-logging-dashboard.tsx migrated","customer-assignment-step.tsx migrated","All admin tables use consistent patterns","Server-side operations working correctly"]',
    '["Migrate customer-management-dashboard table","Migrate user-management-dashboard table","Migrate audit-logging-dashboard table","Migrate customer-assignment-step table","Test server-side pagination and filtering","Verify performance improvements"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-d',
    NOW()
  ),
  (
    'refactor-003-d-phase-3',
    'Migrate List Component Tables',
    'Migrate medium-complexity list tables (discounts, bundles, pricing rules) to UnifiedDataTable.',
    'medium',
    'todo',
    '["discount-rules-list.tsx migrated","customer-discounts-list.tsx migrated","inventory-discounts-list.tsx migrated","bundle-deals-list.tsx migrated","bogo-promotions-list.tsx migrated","volume-pricing-list.tsx migrated","tiered-pricing-list.tsx migrated","All list tables use consistent patterns"]',
    '["Migrate discount-rules-list table","Migrate customer-discounts-list table","Migrate inventory-discounts-list table","Migrate bundle-deals-list table","Migrate bogo-promotions-list table","Migrate volume-pricing-list table","Migrate tiered-pricing-list table","Test client-side filtering and sorting"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-d',
    NOW()
  ),
  (
    'refactor-003-d-phase-4',
    'Migrate Testing/Results Tables',
    'Migrate display-only testing tables to UnifiedDataTable for consistent styling.',
    'low',
    'todo',
    '["basket-testing.tsx tables migrated","historical-testing.tsx table migrated","scenario-testing.tsx tables migrated","test-results.tsx table migrated","Consistent styling across all testing tables"]',
    '["Migrate basket-testing tables","Migrate historical-testing table","Migrate scenario-testing tables","Migrate test-results table","Verify conditional styling works correctly"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-d',
    NOW()
  ),
  (
    'refactor-003-d-phase-5',
    'Deprecate Old Table Patterns',
    'Add deprecation warnings, create migration guide, and document remaining complex tables.',
    'medium',
    'todo',
    '["Deprecation warnings added to old patterns","TABLE_MIGRATION_GUIDE.md created","TABLE_DEPRECATION_STATUS.md created","Remaining complex tables documented","refactor-003-d marked complete"]',
    '["Add deprecation warnings to manual table implementations","Create comprehensive migration guide","Document deprecation status of all tables","Identify complex tables for future work","Mark refactor-003-d as complete"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003-d',
    NOW()
  );

  RAISE NOTICE 'Successfully created refactor-003-d subtasks';

END $$;
