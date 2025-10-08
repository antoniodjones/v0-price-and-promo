-- Link Pricing Simulator Code to User Stories
-- Generated: January 2025
-- Epic: Pricing Simulator
-- Purpose: Retroactively link existing pricing simulator code to user stories

-- SIM-001: Basic Price Simulation
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
('SIM-001', 'app/simulator/page.tsx', 'create', 450, 0, 'retroactive-sim-001', NOW() - INTERVAL '40 days', true),
('SIM-001', 'components/simulator/pricing-simulator.tsx', 'create', 300, 0, 'retroactive-sim-001', NOW() - INTERVAL '40 days', true),
('SIM-001', 'components/simulator/price-breakdown.tsx', 'create', 200, 0, 'retroactive-sim-001', NOW() - INTERVAL '40 days', true),
('SIM-001', 'app/api/pricing/calculate/route.ts', 'modify', 100, 30, 'retroactive-sim-001', NOW() - INTERVAL '40 days', true);

-- SIM-002: Multi-Product Cart Simulation
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
('SIM-002', 'components/simulator/cart-simulator.tsx', 'create', 280, 0, 'retroactive-sim-002', NOW() - INTERVAL '38 days', true),
('SIM-002', 'components/simulator/cart-breakdown.tsx', 'create', 180, 0, 'retroactive-sim-002', NOW() - INTERVAL '38 days', true),
('SIM-002', 'app/api/pricing/cart/route.ts', 'create', 150, 0, 'retroactive-sim-002', NOW() - INTERVAL '38 days', true),
('SIM-002', 'app/simulator/page.tsx', 'modify', 120, 40, 'retroactive-sim-002', NOW() - INTERVAL '38 days', true);

-- SIM-003: Customer Tier Comparison
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
('SIM-003', 'components/simulator/tier-comparison.tsx', 'create', 220, 0, 'retroactive-sim-003', NOW() - INTERVAL '37 days', true),
('SIM-003', 'components/simulator/tier-comparison-table.tsx', 'create', 150, 0, 'retroactive-sim-003', NOW() - INTERVAL '37 days', true),
('SIM-003', 'app/api/pricing/compare-tiers/route.ts', 'create', 120, 0, 'retroactive-sim-003', NOW() - INTERVAL '37 days', true);

-- SIM-004: Market Comparison
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
('SIM-004', 'components/simulator/market-comparison.tsx', 'create', 200, 0, 'retroactive-sim-004', NOW() - INTERVAL '36 days', true),
('SIM-004', 'app/api/pricing/compare-markets/route.ts', 'create', 130, 0, 'retroactive-sim-004', NOW() - INTERVAL '36 days', true);

-- SIM-005: Scenario Saving and Loading
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
('SIM-005', 'components/simulator/scenario-manager.tsx', 'create', 250, 0, 'retroactive-sim-005', NOW() - INTERVAL '35 days', true),
('SIM-005', 'app/api/simulator/scenarios/route.ts', 'create', 180, 0, 'retroactive-sim-005', NOW() - INTERVAL '35 days', true);

-- SIM-006: Bulk Product Simulation
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
('SIM-006', 'components/simulator/bulk-simulator.tsx', 'create', 220, 0, 'retroactive-sim-006', NOW() - INTERVAL '34 days', true),
('SIM-006', 'app/api/simulator/bulk/route.ts', 'create', 200, 0, 'retroactive-sim-006', NOW() - INTERVAL '34 days', true);

-- SIM-007: Promotion Impact Analysis
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
('SIM-007', 'components/simulator/promotion-impact.tsx', 'create', 180, 0, 'retroactive-sim-007', NOW() - INTERVAL '33 days', true),
('SIM-007', 'components/simulator/promotion-toggle.tsx', 'create', 120, 0, 'retroactive-sim-007', NOW() - INTERVAL '33 days', true);

-- SIM-008: Historical Price Comparison
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
('SIM-008', 'components/simulator/historical-comparison.tsx', 'create', 190, 0, 'retroactive-sim-008', NOW() - INTERVAL '32 days', true),
('SIM-008', 'components/simulator/price-trend-chart.tsx', 'create', 150, 0, 'retroactive-sim-008', NOW() - INTERVAL '32 days', true),
('SIM-008', 'app/api/pricing/history/route.ts', 'create', 100, 0, 'retroactive-sim-008', NOW() - INTERVAL '32 days', true);

-- Create git_commits entries
INSERT INTO git_commits (sha, message, author, committed_at)
VALUES
('retroactive-sim-001', 'feat: add basic pricing simulator', 'Development Team', NOW() - INTERVAL '40 days'),
('retroactive-sim-002', 'feat: add multi-product cart simulation', 'Development Team', NOW() - INTERVAL '38 days'),
('retroactive-sim-003', 'feat: add customer tier comparison', 'Development Team', NOW() - INTERVAL '37 days'),
('retroactive-sim-004', 'feat: add market comparison', 'Development Team', NOW() - INTERVAL '36 days'),
('retroactive-sim-005', 'feat: add scenario saving and loading', 'Development Team', NOW() - INTERVAL '35 days'),
('retroactive-sim-006', 'feat: add bulk product simulation', 'Development Team', NOW() - INTERVAL '34 days'),
('retroactive-sim-007', 'feat: add promotion impact analysis', 'Development Team', NOW() - INTERVAL '33 days'),
('retroactive-sim-008', 'feat: add historical price comparison', 'Development Team', NOW() - INTERVAL '32 days')
ON CONFLICT (sha) DO NOTHING;

-- Link commits to user stories
INSERT INTO user_story_commits (user_story_id, commit_sha)
SELECT 'SIM-001', 'retroactive-sim-001'
UNION ALL SELECT 'SIM-002', 'retroactive-sim-002'
UNION ALL SELECT 'SIM-003', 'retroactive-sim-003'
UNION ALL SELECT 'SIM-004', 'retroactive-sim-004'
UNION ALL SELECT 'SIM-005', 'retroactive-sim-005'
UNION ALL SELECT 'SIM-006', 'retroactive-sim-006'
UNION ALL SELECT 'SIM-007', 'retroactive-sim-007'
UNION ALL SELECT 'SIM-008', 'retroactive-sim-008'
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
WHERE epic = 'Pricing Simulator';

-- Verification
SELECT 
  'Pricing Simulator Code Linking Summary' as report,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed,
  COUNT(DISTINCT commit_sha) as commits_linked
FROM code_change_log
WHERE user_story_id LIKE 'SIM-%';

SELECT 
  id,
  title,
  files_modified,
  lines_added,
  lines_removed,
  git_commits
FROM user_stories
WHERE epic = 'Pricing Simulator'
ORDER BY id;
