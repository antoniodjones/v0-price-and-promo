-- Add detailed subtasks for refactor-003-e: Consolidate Card Components
-- Breaking down card consolidation into manageable phases

DO $$
DECLARE
  refactor_003_e_id TEXT := 'refactor-003-e';
BEGIN
  -- Verify parent task exists
  IF NOT EXISTS (SELECT 1 FROM user_stories WHERE id = refactor_003_e_id) THEN
    RAISE EXCEPTION 'Parent task % not found', refactor_003_e_id;
  END IF;

  -- Add phase subtasks for card consolidation
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
    created_at,
    metadata
  ) VALUES
  (
    'refactor-003-e-phase-1',
    'Phase 1: Create Unified Card System',
    'Create a unified card component system with variants for stats, metrics, info, and action cards. Consolidate stat-card.tsx, metric-card.tsx, and dashboard/metric-card.tsx into a single flexible component.',
    'high',
    'todo',
    '["UnifiedCard component created with variants","Card hooks created (useCardAnimation, useCardState)","Card utilities created (formatters, helpers)","Documentation created with usage examples","All variants tested and working"]',
    '["Create components/shared/unified-card.tsx with variants","Create lib/card-helpers.ts with utilities","Create lib/card-formatters.ts for value formatting","Create docs/CARD_PATTERNS.md documentation","Test all card variants"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    refactor_003_e_id,
    NOW(),
    jsonb_build_object(
      'phase', 1,
      'estimated_lines_reduced', 200,
      'components_to_create', 3
    )
  ),
  (
    'refactor-003-e-phase-2',
    'Phase 2: Migrate Dashboard Cards',
    'Migrate all dashboard stat and metric cards to use UnifiedCard. Update bundle-deals-stats.tsx, promotion-performance.tsx, and dashboard-stats.tsx.',
    'high',
    'todo',
    '["All dashboard stat cards migrated","All metric cards migrated","Consistent styling across dashboards","No duplicate card code in dashboards","Dashboard performance maintained"]',
    '["Migrate bundle-deals-stats.tsx","Migrate promotion-performance.tsx","Migrate dashboard-stats.tsx","Migrate app/page.tsx dashboard cards","Migrate app/analytics/page.tsx cards","Test all dashboard pages"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    refactor_003_e_id,
    NOW(),
    jsonb_build_object(
      'phase', 2,
      'estimated_lines_reduced', 300,
      'files_to_migrate', 6
    )
  ),
  (
    'refactor-003-e-phase-3',
    'Phase 3: Migrate Info and Action Cards',
    'Migrate info cards used in wizards and settings, plus action cards used for navigation.',
    'medium',
    'todo',
    '["All wizard info cards migrated","All settings cards migrated","Quick action cards migrated","Consistent card styling in wizards","All card interactions working"]',
    '["Migrate wizard step info cards","Migrate settings section cards","Migrate quick-action-card.tsx usage","Update pricing-card.tsx to use UnifiedCard","Test wizard and settings flows"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    refactor_003_e_id,
    NOW(),
    jsonb_build_object(
      'phase', 3,
      'estimated_lines_reduced', 250,
      'files_to_migrate', 15
    )
  ),
  (
    'refactor-003-e-phase-4',
    'Phase 4: Migrate Product Cards',
    'Consolidate product-card.tsx and enhanced-product-card.tsx into a single unified product card component.',
    'medium',
    'todo',
    '["Product cards consolidated","Enhanced features preserved","Watchlist and alert functionality working","Product card styling consistent","All product pages updated"]',
    '["Create UnifiedProductCard with enhanced prop","Migrate product-card.tsx usage","Migrate enhanced-product-card.tsx usage","Test product listing pages","Test product detail pages"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    refactor_003_e_id,
    NOW(),
    jsonb_build_object(
      'phase', 4,
      'estimated_lines_reduced', 150,
      'files_to_migrate', 2
    )
  ),
  (
    'refactor-003-e-phase-5',
    'Phase 5: Deprecate Old Card Patterns',
    'Add deprecation warnings to old card components and create migration guide for any remaining custom cards.',
    'low',
    'todo',
    '["Deprecation warnings added","Migration guide created","Old components marked deprecated","Documentation updated","Refactor-003-e marked complete"]',
    '["Add deprecation comments to old card files","Create CARD_MIGRATION_GUIDE.md","Document remaining custom cards","Update CARD_PATTERNS.md with best practices","Mark refactor-003-e as complete"]',
    'Antonio Jones',
    'Antonio Jones',
    'task',
    refactor_003_e_id,
    NOW(),
    jsonb_build_object(
      'phase', 5,
      'estimated_lines_reduced', 100,
      'documentation_files', 2
    )
  );

END $$;

-- Verify the tasks were created
SELECT 
  id,
  title,
  status,
  priority,
  metadata->>'phase' as phase,
  metadata->>'estimated_lines_reduced' as lines_reduced
FROM user_stories
WHERE parent_id = 'refactor-003-e'
ORDER BY id;
