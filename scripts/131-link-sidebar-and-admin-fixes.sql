-- ============================================================================
-- Script 131: Link Sidebar Navigation and Admin Database Fixes to Tasks
-- ============================================================================
-- Purpose: Link recent bug fixes to appropriate user stories:
--          1. Customers sidebar navigation restoration -> CM-001
--          2. Admin price sources query fix -> refactor-001-admin-page
-- Created: 2025-01-09
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1: Link Customers Sidebar Navigation to CM-001
-- ============================================================================

-- Update CM-001 with the sidebar navigation fix
UPDATE user_stories
SET 
  related_files = array_append(
    COALESCE(related_files, ARRAY[]::text[]),
    'components/organisms/sidebar.tsx'
  ),
  technical_notes = COALESCE(technical_notes, '') || E'\n\n### Bug Fix: Customers Navigation Menu Item\n' ||
    '**Issue:** The "Customers" menu item was missing from the left sidebar navigation, ' ||
    'preventing users from accessing the customer management features.\n\n' ||
    '**Root Cause:** The app uses components/organisms/sidebar.tsx (not components/layout/sidebar.tsx), ' ||
    'and the Customers navigation item was not present in the navigation structure.\n\n' ||
    '**Solution:** Added Customers navigation item to components/organisms/sidebar.tsx between ' ||
    'Products and Pricing Engine sections with proper icon (Users) and route (/customers).\n\n' ||
    '**Files Modified:**\n' ||
    '- components/organisms/sidebar.tsx - Added Customers navigation item\n\n' ||
    '**Impact:** Users can now access customer management features from the main navigation.',
  updated_at = NOW()
WHERE story_id = 'CM-001';

-- Log the code change for sidebar navigation
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
SELECT
  id::text,
  'components/organisms/sidebar.tsx',
  'modified',
  'Sidebar',
  'Fix: Restore Customers navigation menu item',
  'v0',
  'v0@vercel.com',
  'main',
  12,
  0,
  NOW(),
  jsonb_build_object(
    'bug_fix', true,
    'error_type', 'missing_navigation',
    'issue', 'Customers menu item was missing from sidebar',
    'solution', 'Added Customers navigation item to organisms/sidebar.tsx',
    'affected_feature', 'Customer Management',
    'severity', 'medium',
    'user_impact', 'Users could not access customer management from navigation'
  ),
  NOW()
FROM user_stories
WHERE story_id = 'CM-001';

-- ============================================================================
-- PART 2: Link Admin Price Sources Fix to refactor-001-admin-page
-- ============================================================================

-- Update the admin refactor task with the fixed file
UPDATE user_stories
SET 
  related_files = array_append(
    COALESCE(related_files, ARRAY[]::text[]),
    'lib/admin/database.ts'
  ),
  technical_notes = COALESCE(technical_notes, '') || E'\n\n### Bug Fix: Price Sources Query\n' ||
    '**Issue:** Admin dashboard failed to load with error: "Could not find a relationship ' ||
    'between price_sources and products in the schema cache".\n\n' ||
    '**Root Cause:** The getPriceSources() method was attempting to join price_sources directly ' ||
    'with products table, but no foreign key relationship exists between these tables.\n\n' ||
    '**Solution:** Modified getPriceSources() to count products through the price_history table, ' ||
    'which has foreign keys to both price_sources (source_id) and products (product_id). ' ||
    'The query now fetches price_history records for each source and counts unique product_ids.\n\n' ||
    '**Files Modified:**\n' ||
    '- lib/admin/database.ts - Fixed getPriceSources query to use price_history as join table\n\n' ||
    '**Impact:** Admin dashboard now loads successfully without schema relationship errors.',
  updated_at = NOW()
WHERE id = 'refactor-001-admin-page';

-- Log the code change for admin database fix
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
  'Fix: Use price_history as join table for price sources query',
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
    'user_impact', 'Admin dashboard was completely broken',
    'testing_required', true
  ),
  NOW()
);

COMMIT;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Verify CM-001 update
SELECT 
  'CM-001: Customers Navigation Fix' as info,
  story_id,
  title,
  array_length(related_files, 1) as total_files,
  (SELECT COUNT(*) FROM code_change_log WHERE task_id = id::text AND file_path = 'components/organisms/sidebar.tsx') as sidebar_changes
FROM user_stories
WHERE story_id = 'CM-001';

-- Verify admin page update
SELECT 
  'Admin Page: Price Sources Fix' as info,
  id as task_id,
  title,
  array_length(related_files, 1) as total_files,
  (SELECT COUNT(*) FROM code_change_log WHERE task_id = 'refactor-001-admin-page' AND file_path = 'lib/admin/database.ts') as database_changes
FROM user_stories
WHERE id = 'refactor-001-admin-page';

-- Display all code changes from this script
SELECT 
  task_id,
  file_path,
  change_type,
  component_name,
  commit_message,
  lines_added,
  lines_removed,
  metadata->>'bug_fix' as is_bug_fix,
  metadata->>'severity' as severity,
  metadata->>'user_impact' as user_impact
FROM code_change_log
WHERE 
  (task_id IN (SELECT id::text FROM user_stories WHERE story_id = 'CM-001') 
   AND file_path = 'components/organisms/sidebar.tsx')
  OR (task_id = 'refactor-001-admin-page' AND file_path = 'lib/admin/database.ts')
ORDER BY changed_at DESC;

-- Summary report
SELECT 
  'Code Changes Linked Summary' as report,
  COUNT(*) as total_changes,
  COUNT(*) FILTER (WHERE metadata->>'bug_fix' = 'true') as bug_fixes,
  COUNT(DISTINCT task_id) as tasks_updated,
  COUNT(DISTINCT file_path) as files_modified
FROM code_change_log
WHERE 
  (task_id IN (SELECT id::text FROM user_stories WHERE story_id = 'CM-001') 
   AND file_path = 'components/organisms/sidebar.tsx')
  OR (task_id = 'refactor-001-admin-page' AND file_path = 'lib/admin/database.ts');
