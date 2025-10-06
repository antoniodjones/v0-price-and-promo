-- Add detailed subtasks for refactor-003: Organize Component Structure
-- Breaking down the component consolidation work into manageable phases

-- Get the refactor-003 task ID
DO $$
DECLARE
  refactor_003_id TEXT;
BEGIN
  SELECT id INTO refactor_003_id 
  FROM user_stories 
  WHERE id = 'refactor-003';

  -- Add subtasks for component consolidation
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
    'refactor-003-a',
    'Consolidate Wizard Components',
    'Consolidate 5+ duplicate edit modals and 30+ wizard step components into unified, reusable components. Replace customer-discount-wizard, bundle-deal-wizard, and other wizard implementations with the unified-wizard framework.',
    'high',
    'todo',
    '["Unified edit modal component created and tested","All wizard step components consolidated (dates, values, review)","Old wizard-framework.tsx deprecated","All 5+ wizards migrated to unified system","No duplicate wizard code remains"]',
    '["Audit all wizard components and identify duplicates","Create UnifiedEditModal component","Create consolidated DateStep, ValueStep, ReviewStep components","Migrate customer-discount-wizard to unified system","Migrate bundle-deal-wizard to unified system","Migrate other wizards (BOGO, inventory, tiered, volume)","Deprecate old wizard-framework.tsx","Test all wizard flows","Update documentation"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  ),
  (
    'refactor-003-b',
    'Consolidate Form Components',
    'Consolidate duplicate form field components, input wrappers, and form validation patterns into a shared form component library.',
    'high',
    'todo',
    '["Unified FormField component created","Input components consolidated","Form validation patterns standardized","All forms migrated to new components","Consistent form styling across app"]',
    '["Audit form-field.tsx and similar components","Create unified FormField with label, error, help text","Create Input, Select, Textarea wrappers","Standardize validation patterns","Migrate high-traffic forms first","Update form documentation"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  ),
  (
    'refactor-003-c',
    'Consolidate Modal Components',
    'Consolidate duplicate modal, dialog, and sheet components into a unified modal system with consistent behavior and styling.',
    'medium',
    'todo',
    '["Unified Modal component created","Dialog and Sheet patterns consolidated","Consistent modal behavior (close, escape, backdrop)","All modals migrated to new system","Modal accessibility improved"]',
    '["Audit all modal/dialog/sheet components","Create UnifiedModal with variants (dialog, sheet, drawer)","Standardize modal behavior and keyboard handling","Migrate edit modals to unified system","Test modal accessibility","Update modal documentation"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  ),
  (
    'refactor-003-d',
    'Consolidate Table Components',
    'Consolidate duplicate table, data grid, and list components into a unified table system with sorting, filtering, and pagination.',
    'medium',
    'todo',
    '["Unified DataTable component created","Sorting, filtering, pagination standardized","Table styling consistent across app","All tables migrated to new component","Table performance optimized"]',
    '["Audit all table components","Create UnifiedDataTable with sorting/filtering/pagination","Standardize table styling and responsive behavior","Migrate high-traffic tables first","Add table virtualization for large datasets","Update table documentation"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  ),
  (
    'refactor-003-e',
    'Consolidate Card Components',
    'Consolidate duplicate stat cards, metric cards, and dashboard cards into unified card components with consistent styling.',
    'low',
    'todo',
    '["Unified Card component created","StatCard and MetricCard consolidated","Consistent card styling across dashboards","All cards migrated to new components","Card variants documented"]',
    '["Audit stat-card.tsx, metric-card.tsx, and similar","Create UnifiedCard with variants (stat, metric, info)","Standardize card styling and spacing","Migrate dashboard cards","Update card documentation"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  ),
  (
    'refactor-003-f',
    'Create Shared Component Library Structure',
    'Organize all consolidated components into a well-structured shared component library with clear naming conventions and documentation.',
    'high',
    'todo',
    '["Component library structure defined","Components organized by category (forms, data, feedback, layout)","Naming conventions documented","Component index files created","Storybook or component showcase added"]',
    '["Define component library structure (atoms, molecules, organisms)","Create category folders (forms, data-display, feedback, layout, navigation)","Move consolidated components to appropriate folders","Create index.ts files for easy imports","Add component documentation and examples","Create component showcase page"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    'refactor-003',
    NOW()
  );

END $$;
