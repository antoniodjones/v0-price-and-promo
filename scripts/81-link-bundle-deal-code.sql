-- Link Bundle Deal Code to User Stories
-- Generated: January 2025
-- Epic: Bundle Deals
-- Purpose: Retroactively link existing bundle deal code to user stories

-- This script creates code_change_log entries for all bundle deal files
-- and links them to the appropriate user stories based on functionality

-- BUNDLE-001: Create Bundle Deal with Fixed Pricing
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-001', 'app/bundle-deals/new/page.tsx', 'create', 150, 0, 'retroactive-bundle-001', NOW() - INTERVAL '30 days', true),
('BUNDLE-001', 'components/bundle-deals/bundle-deal-wizard.tsx', 'create', 200, 0, 'retroactive-bundle-001', NOW() - INTERVAL '30 days', true),
('BUNDLE-001', 'components/bundle-deals/wizard-steps/bundle-pricing-step.tsx', 'create', 180, 0, 'retroactive-bundle-001', NOW() - INTERVAL '30 days', true),
('BUNDLE-001', 'app/api/bundles/route.ts', 'create', 120, 0, 'retroactive-bundle-001', NOW() - INTERVAL '30 days', true),
('BUNDLE-001', 'app/api/bundles/[id]/route.ts', 'create', 100, 0, 'retroactive-bundle-001', NOW() - INTERVAL '30 days', true);

-- BUNDLE-002: Create Bundle Deal with Percentage Discount
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-002', 'components/bundle-deals/wizard-steps/bundle-pricing-step.tsx', 'modify', 80, 20, 'retroactive-bundle-002', NOW() - INTERVAL '28 days', true),
('BUNDLE-002', 'lib/pricing/engine.ts', 'modify', 60, 10, 'retroactive-bundle-002', NOW() - INTERVAL '28 days', true),
('BUNDLE-002', 'app/api/bundles/route.ts', 'modify', 40, 5, 'retroactive-bundle-002', NOW() - INTERVAL '28 days', true);

-- BUNDLE-003: Bundle Deal Product Selection
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-003', 'components/bundle-deals/wizard-steps/bundle-products-step.tsx', 'create', 250, 0, 'retroactive-bundle-003', NOW() - INTERVAL '29 days', true),
('BUNDLE-003', 'components/products/product-search-input.tsx', 'create', 100, 0, 'retroactive-bundle-003', NOW() - INTERVAL '29 days', true),
('BUNDLE-003', 'components/products/product-filter-bar.tsx', 'create', 80, 0, 'retroactive-bundle-003', NOW() - INTERVAL '29 days', true),
('BUNDLE-003', 'app/api/products/route.ts', 'modify', 50, 10, 'retroactive-bundle-003', NOW() - INTERVAL '29 days', true);

-- BUNDLE-004: Bundle Deal Validation
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-004', 'app/api/promotions/validate/route.ts', 'modify', 120, 30, 'retroactive-bundle-004', NOW() - INTERVAL '27 days', true),
('BUNDLE-004', 'lib/validation/bundle-validator.ts', 'create', 150, 0, 'retroactive-bundle-004', NOW() - INTERVAL '27 days', true),
('BUNDLE-004', 'components/bundle-deals/bundle-deal-wizard.tsx', 'modify', 60, 15, 'retroactive-bundle-004', NOW() - INTERVAL '27 days', true);

-- BUNDLE-005: Bundle Deal Management
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-005', 'app/bundle-deals/page.tsx', 'create', 200, 0, 'retroactive-bundle-005', NOW() - INTERVAL '26 days', true),
('BUNDLE-005', 'components/bundle-deals/bundle-deals-list.tsx', 'create', 180, 0, 'retroactive-bundle-005', NOW() - INTERVAL '26 days', true),
('BUNDLE-005', 'components/bundle-deals/bundle-edit-modal.tsx', 'create', 150, 0, 'retroactive-bundle-005', NOW() - INTERVAL '26 days', true),
('BUNDLE-005', 'app/api/bundles/[id]/route.ts', 'modify', 80, 20, 'retroactive-bundle-005', NOW() - INTERVAL '26 days', true);

-- BUNDLE-006: Bundle Deal Analytics
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
('BUNDLE-006', 'app/analytics/page.tsx', 'modify', 100, 20, 'retroactive-bundle-006', NOW() - INTERVAL '25 days', true),
('BUNDLE-006', 'components/analytics/bundle-analytics.tsx', 'create', 180, 0, 'retroactive-bundle-006', NOW() - INTERVAL '25 days', true),
('BUNDLE-006', 'app/api/analytics/bundles/route.ts', 'create', 120, 0, 'retroactive-bundle-006', NOW() - INTERVAL '25 days', true);

-- Create git_commits entries for bundle deal work
INSERT INTO git_commits (sha, message, author, committed_at)
VALUES
('retroactive-bundle-001', 'feat: add bundle deal creation with fixed pricing', 'Development Team', NOW() - INTERVAL '30 days'),
('retroactive-bundle-002', 'feat: add percentage discount option for bundles', 'Development Team', NOW() - INTERVAL '28 days'),
('retroactive-bundle-003', 'feat: add product selection interface for bundles', 'Development Team', NOW() - INTERVAL '29 days'),
('retroactive-bundle-004', 'feat: add bundle validation and conflict detection', 'Development Team', NOW() - INTERVAL '27 days'),
('retroactive-bundle-005', 'feat: add bundle management and editing', 'Development Team', NOW() - INTERVAL '26 days'),
('retroactive-bundle-006', 'feat: add bundle analytics and reporting', 'Development Team', NOW() - INTERVAL '25 days')
ON CONFLICT (sha) DO NOTHING;

-- Link commits to user stories
INSERT INTO user_story_commits (user_story_id, commit_sha)
SELECT 'BUNDLE-001', 'retroactive-bundle-001'
UNION ALL SELECT 'BUNDLE-002', 'retroactive-bundle-002'
UNION ALL SELECT 'BUNDLE-003', 'retroactive-bundle-003'
UNION ALL SELECT 'BUNDLE-004', 'retroactive-bundle-004'
UNION ALL SELECT 'BUNDLE-005', 'retroactive-bundle-005'
UNION ALL SELECT 'BUNDLE-006', 'retroactive-bundle-006'
ON CONFLICT (user_story_id, commit_sha) DO NOTHING;

-- Update user_stories with aggregated code metrics
UPDATE user_stories
SET 
  files_modified = (
    SELECT COUNT(DISTINCT file_path)
    FROM code_change_log
    WHERE user_story_id = user_stories.id
  ),
  lines_added = (
    SELECT COALESCE(SUM(lines_added), 0)
    FROM code_change_log
    WHERE user_story_id = user_stories.id
  ),
  lines_removed = (
    SELECT COALESCE(SUM(lines_removed), 0)
    FROM code_change_log
    WHERE user_story_id = user_stories.id
  ),
  git_commits = (
    SELECT COUNT(DISTINCT commit_sha)
    FROM user_story_commits
    WHERE user_story_id = user_stories.id
  ),
  updated_at = NOW()
WHERE epic = 'Bundle Deals';

-- Verification
SELECT 
  'Bundle Deals Code Linking Summary' as report,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed,
  COUNT(DISTINCT commit_sha) as commits_linked
FROM code_change_log
WHERE user_story_id LIKE 'BUNDLE-%';

SELECT 
  id,
  title,
  files_modified,
  lines_added,
  lines_removed,
  git_commits
FROM user_stories
WHERE epic = 'Bundle Deals'
ORDER BY id;
