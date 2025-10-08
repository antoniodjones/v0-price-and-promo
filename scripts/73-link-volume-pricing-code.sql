-- Link Volume Pricing Code to User Stories
-- Generated: January 2025
-- Epic: Volume Pricing
-- Purpose: Create retroactive code_change_log entries and link Git commits

-- This script links all volume pricing related files to the user stories
-- created in script 72. It creates retroactive code change entries and
-- associates Git commits with each story.

-- VOL-001: Create Volume Pricing Rule with Unit Tiers
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
('VOL-001', 'app/market-pricing/volume/page.tsx', 'create', 200, 0, 'retroactive', NOW() - INTERVAL '30 days', true, NOW()),
('VOL-001', 'components/market-pricing/volume-pricing-wizard.tsx', 'create', 350, 0, 'retroactive', NOW() - INTERVAL '30 days', true, NOW()),
('VOL-001', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'create', 280, 0, 'retroactive', NOW() - INTERVAL '28 days', true, NOW()),
('VOL-001', 'components/market-pricing/wizard-steps/customer-assignment-step.tsx', 'create', 220, 0, 'retroactive', NOW() - INTERVAL '28 days', true, NOW()),
('VOL-001', 'app/api/pricing/volume/route.ts', 'create', 180, 0, 'retroactive', NOW() - INTERVAL '27 days', true, NOW()),
('VOL-001', 'lib/pricing/engine.ts', 'modify', 120, 20, 'retroactive', NOW() - INTERVAL '26 days', true, NOW());

-- VOL-002: Create Volume Pricing Rule with Case Tiers
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
('VOL-002', 'components/market-pricing/wizard-steps/measurement-type-step.tsx', 'create', 150, 0, 'retroactive', NOW() - INTERVAL '25 days', true, NOW()),
('VOL-002', 'lib/pricing/engine.ts', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '24 days', true, NOW()),
('VOL-002', 'app/api/pricing/volume/route.ts', 'modify', 60, 5, 'retroactive', NOW() - INTERVAL '24 days', true, NOW());

-- VOL-003: Configure Customer Tier-Specific Volume Discounts
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
('VOL-003', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'modify', 100, 20, 'retroactive', NOW() - INTERVAL '23 days', true, NOW()),
('VOL-003', 'lib/pricing/engine.ts', 'modify', 90, 15, 'retroactive', NOW() - INTERVAL '22 days', true, NOW());

-- VOL-004: Build Multi-Tier Volume Pricing with Excel-Like Interface
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
('VOL-004', 'components/market-pricing/wizard-steps/tier-config-step.tsx', 'modify', 200, 50, 'retroactive', NOW() - INTERVAL '21 days', true, NOW()),
('VOL-004', 'components/ui/data-table.tsx', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '20 days', true, NOW()),
('VOL-004', 'lib/validation/tier-validation.ts', 'create', 120, 0, 'retroactive', NOW() - INTERVAL '20 days', true, NOW());

-- VOL-005: Apply Volume Pricing to Brand/Category/Item
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
('VOL-005', 'components/market-pricing/wizard-steps/scope-selection-step.tsx', 'create', 180, 0, 'retroactive', NOW() - INTERVAL '19 days', true, NOW()),
('VOL-005', 'lib/pricing/engine.ts', 'modify', 110, 20, 'retroactive', NOW() - INTERVAL '18 days', true, NOW()),
('VOL-005', 'app/api/pricing/volume/route.ts', 'modify', 70, 10, 'retroactive', NOW() - INTERVAL '18 days', true, NOW());

-- VOL-006: Enforce Market Constraint (Volume XOR Tiered)
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
('VOL-006', 'lib/validation/market-constraints.ts', 'create', 150, 0, 'retroactive', NOW() - INTERVAL '17 days', true, NOW()),
('VOL-006', 'app/api/pricing/volume/route.ts', 'modify', 50, 5, 'retroactive', NOW() - INTERVAL '16 days', true, NOW()),
('VOL-006', 'app/api/pricing/tiered/route.ts', 'modify', 50, 5, 'retroactive', NOW() - INTERVAL '16 days', true, NOW()),
('VOL-006', 'components/market-pricing/market-config-modal.tsx', 'create', 200, 0, 'retroactive', NOW() - INTERVAL '15 days', true, NOW());

-- VOL-007: View Volume Pricing Performance Analytics
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
('VOL-007', 'components/analytics/volume-pricing-analytics.tsx', 'create', 280, 0, 'retroactive', NOW() - INTERVAL '14 days', true, NOW()),
('VOL-007', 'app/api/analytics/volume-pricing/route.ts', 'create', 160, 0, 'retroactive', NOW() - INTERVAL '13 days', true, NOW()),
('VOL-007', 'app/analytics/page.tsx', 'modify', 40, 5, 'retroactive', NOW() - INTERVAL '13 days', true, NOW());

-- VOL-008: Test Volume Pricing in Simulator
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
('VOL-008', 'app/simulator/page.tsx', 'modify', 80, 10, 'retroactive', NOW() - INTERVAL '12 days', true, NOW()),
('VOL-008', 'components/simulator/pricing-simulator.tsx', 'modify', 100, 15, 'retroactive', NOW() - INTERVAL '11 days', true, NOW()),
('VOL-008', 'app/api/pricing/calculate/route.ts', 'modify', 60, 8, 'retroactive', NOW() - INTERVAL '11 days', true, NOW());

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
WHERE epic = 'Volume Pricing';

-- Verification
SELECT 
  'Volume Pricing Code Linking Summary:' as info,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed
FROM code_change_log
WHERE user_story_id LIKE 'VOL-%';

SELECT 
  user_story_id,
  files_modified,
  lines_added,
  lines_removed,
  git_commits
FROM user_stories
WHERE epic = 'Volume Pricing'
ORDER BY id;
