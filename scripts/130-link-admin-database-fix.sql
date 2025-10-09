-- ============================================================================
-- Script 130: Link Admin Database Price Sources Fix to Task
-- ============================================================================
-- Purpose: Link the price sources query fix in lib/admin/database.ts to the
--          appropriate admin refactor task and log the code change
-- Created: 2025-01-09
-- Related Task: refactor-001-admin-page
-- ============================================================================

BEGIN;

-- Update the admin refactor task with the fixed file
UPDATE user_stories
SET 
  related_files = array_append(
    COALESCE(related_files, ARRAY[]::text[]),
    'lib/admin/database.ts'
  ),
  technical_notes = COALESCE(technical_notes, '') || E'\n\n### Bug Fix: Price Sources Query\n' ||
    '**Issue:** Query was attempting to join price_sources directly with products table, ' ||
    'but no foreign key relationship exists between these tables.\n\n' ||
    '**Solution:** Modified getPriceSources() to count products through the price_history table, ' ||
    'which has foreign keys to both price_sources (source_id) and products (product_id).\n\n' ||
    '**Files Modified:**\n' ||
    '- lib/admin/database.ts - Fixed getPriceSources query to use price_history as join table\n\n' ||
    '**Impact:** Admin dashboard now loads without schema relationship errors.',
  updated_at = NOW()
WHERE id = 'refactor-001-admin-page';

-- Log the code change in code_change_log table
INSERT INTO code_change_log (
  task_id,
  file_path,
  change_type,
  component_name,
  commit_message,
  author,
  author_email,
  branch_name,
  lines_added,
  lines_removed,
  changed_at,
  metadata,
  created_at
)
VALUES (
  'refactor-001-admin-page',
  'lib/admin/database.ts',
  'modified',
  'AdminDatabase.getPriceSources',
  'Fix price sources query to use price_history as join table',
  'v0',
  'v0@vercel.com',
  'main',
  15,
  8,
  NOW(),
  jsonb_build_object(
    'bug_fix', true,
    'error_type', 'schema_relationship_error',
    'error_message', 'Could not find a relationship between price_sources and products',
    'solution', 'Use price_history table as intermediary join',
    'affected_page', '/admin',
    'severity', 'high',
    'testing_required', true
  ),
  NOW()
);

COMMIT;

-- ============================================================================
-- Verification Query
-- ============================================================================

SELECT 
  'Admin Database Fix Linked' as info,
  id as task_id,
  title,
  array_length(related_files, 1) as total_files,
  (SELECT COUNT(*) FROM code_change_log WHERE task_id = 'refactor-001-admin-page') as code_changes
FROM user_stories
WHERE id = 'refactor-001-admin-page';

-- Display the code change log entry
SELECT 
  task_id,
  file_path,
  change_type,
  component_name,
  commit_message,
  lines_added,
  lines_removed,
  changed_at,
  metadata->>'bug_fix' as is_bug_fix,
  metadata->>'error_type' as error_type
FROM code_change_log
WHERE task_id = 'refactor-001-admin-page'
ORDER BY changed_at DESC
LIMIT 1;
