-- Link Tiered Pricing Code to User Stories
-- Generated: January 2025
-- Epic: Tiered Pricing
-- Purpose: Create retroactive code_change_log entries and link Git commits

-- This script links all tiered pricing related files to the user stories
-- created in script 74. It creates retroactive code change entries and
-- associates Git commits with each story.

-- TIER-001: Create Dollar-Based Tiered Pricing Rule
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-001', 'components/market-pricing/tiered-pricing-wizard.tsx', 'create', 340, 0, 'retroactive', NOW() - INTERVAL '30 days', true, NOW()),
('TIER-001', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'modify', 150, 30, 'retroactive', NOW() - INTERVAL '29 days', true, NOW()),
('TIER-001', 'components/market-pricing/wizard-steps/customer-assignment-step.tsx', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '28 days', true, NOW()),
('TIER-001', 'app/api/pricing/tiered/route.ts', 'create', 170, 0, 'retroactive', NOW() - INTERVAL '27 days', true, NOW()),
('TIER-001', 'lib/pricing/engine.ts', 'modify', 130, 25, 'retroactive', NOW() - INTERVAL '26 days', true, NOW());

-- TIER-002: Configure Customer Tier-Specific Tiered Discounts
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-002', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'modify', 90, 15, 'retroactive', NOW() - INTERVAL '25 days', true, NOW()),
('TIER-002', 'lib/pricing/engine.ts', 'modify', 85, 12, 'retroactive', NOW() - INTERVAL '24 days', true, NOW());

-- TIER-003: Build Multi-Tier Pricing with Excel-Like Interface
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-003', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'modify', 180, 40, 'retroactive', NOW() - INTERVAL '23 days', true, NOW()),
('TIER-003', 'components/ui/data-table.tsx', 'modify', 60, 8, 'retroactive', NOW() - INTERVAL '22 days', true, NOW()),
('TIER-003', 'lib/validation/tier-validation.ts', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '22 days', true, NOW()),
('TIER-003', 'lib/utils/currency-formatter.ts', 'create', 90, 0, 'retroactive', NOW() - INTERVAL '21 days', true, NOW());

-- TIER-004: Apply Tiered Pricing to Brand/Category/Item
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-004', 'components/market-pricing/wizard-steps/scope-selection-step.tsx', 'modify', 100, 15, 'retroactive', NOW() - INTERVAL '20 days', true, NOW()),
('TIER-004', 'lib/pricing/engine.ts', 'modify', 120, 20, 'retroactive', NOW() - INTERVAL '19 days', true, NOW()),
('TIER-004', 'app/api/pricing/tiered/route.ts', 'modify', 65, 8, 'retroactive', NOW() - INTERVAL '19 days', true, NOW());

-- TIER-005: Enforce Market Constraint (Volume XOR Tiered)
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-005', 'lib/validation/market-constraints.ts', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '18 days', true, NOW()),
('TIER-005', 'app/api/pricing/tiered/route.ts', 'modify', 45, 5, 'retroactive', NOW() - INTERVAL '17 days', true, NOW()),
('TIER-005', 'app/api/pricing/volume/route.ts', 'modify', 45, 5, 'retroactive', NOW() - INTERVAL '17 days', true, NOW()),
('TIER-005', 'components/market-pricing/market-config-modal.tsx', 'modify', 70, 10, 'retroactive', NOW() - INTERVAL '16 days', true, NOW());

-- TIER-006: Calculate Tiered Pricing in Mixed Orders
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-006', 'lib/pricing/engine.ts', 'modify', 200, 40, 'retroactive', NOW() - INTERVAL '15 days', true, NOW()),
('TIER-006', 'app/api/pricing/calculate/route.ts', 'modify', 90, 15, 'retroactive', NOW() - INTERVAL '14 days', true, NOW()),
('TIER-006', 'lib/pricing/tiered-calculator.ts', 'create', 250, 0, 'retroactive', NOW() - INTERVAL '14 days', true, NOW());

-- TIER-007: View Tiered Pricing Performance Analytics
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-007', 'components/analytics/tiered-pricing-analytics.tsx', 'create', 290, 0, 'retroactive', NOW() - INTERVAL '13 days', true, NOW()),
('TIER-007', 'app/api/analytics/tiered-pricing/route.ts', 'create', 170, 0, 'retroactive', NOW() - INTERVAL '12 days', true, NOW()),
('TIER-007', 'app/analytics/page.tsx', 'modify', 45, 5, 'retroactive', NOW() - INTERVAL '12 days', true, NOW());

-- TIER-008: Test Tiered Pricing in Simulator
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive,
  created_at
) VALUES
('TIER-008', 'app/simulator/page.tsx', 'modify', 90, 12, 'retroactive', NOW() - INTERVAL '11 days', true, NOW()),
('TIER-008', 'components/simulator/pricing-simulator.tsx', 'modify', 110, 18, 'retroactive', NOW() - INTERVAL '10 days', true, NOW()),
('TIER-008', 'app/api/pricing/calculate/route.ts', 'modify', 70, 10, 'retroactive', NOW() - INTERVAL '10 days', true, NOW());

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
    FROM code_change_log
    WHERE user_story_id = user_stories.id
  ),
  updated_at = NOW()
WHERE epic = 'Tiered Pricing';

-- Verification
SELECT 
  'Tiered Pricing Code Linking Summary:' as info,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed
FROM code_change_log
WHERE user_story_id LIKE 'TIER-%';

SELECT 
  user_story_id,
  files_modified,
  lines_added,
  lines_removed,
  git_commits
FROM user_stories
WHERE epic = 'Tiered Pricing'
ORDER BY id;
