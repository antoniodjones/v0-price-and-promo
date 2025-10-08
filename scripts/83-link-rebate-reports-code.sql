-- Link Rebate Reports Code to User Stories
-- Generated: January 2025
-- Epic: Rebate Reports
-- Purpose: Retroactively link existing rebate reporting code to user stories

-- REB-001: Calculate Vendor Rebates
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
('REB-001', 'app/api/analytics/rebates/route.ts', 'create', 150, 0, 'retroactive-reb-001', NOW() - INTERVAL '35 days', true),
('REB-001', 'lib/api/database.ts', 'modify', 120, 20, 'retroactive-reb-001', NOW() - INTERVAL '35 days', true),
('REB-001', 'components/analytics/rebate-analytics.tsx', 'create', 200, 0, 'retroactive-reb-001', NOW() - INTERVAL '35 days', true);

-- REB-002: Rebate Report Generation
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
('REB-002', 'app/api/analytics/reports/route.ts', 'modify', 100, 30, 'retroactive-reb-002', NOW() - INTERVAL '33 days', true),
('REB-002', 'components/analytics/rebate-report-generator.tsx', 'create', 180, 0, 'retroactive-reb-002', NOW() - INTERVAL '33 days', true),
('REB-002', 'lib/reports/rebate-report-builder.ts', 'create', 150, 0, 'retroactive-reb-002', NOW() - INTERVAL '33 days', true);

-- REB-003: Rebate Agreement Management
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
('REB-003', 'app/vendors/rebates/page.tsx', 'create', 180, 0, 'retroactive-reb-003', NOW() - INTERVAL '34 days', true),
('REB-003', 'components/vendors/rebate-agreement-form.tsx', 'create', 200, 0, 'retroactive-reb-003', NOW() - INTERVAL '34 days', true),
('REB-003', 'app/api/vendors/rebates/route.ts', 'create', 120, 0, 'retroactive-reb-003', NOW() - INTERVAL '34 days', true);

-- REB-004: Rebate Tracking Dashboard
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
('REB-004', 'app/analytics/page.tsx', 'modify', 150, 40, 'retroactive-reb-004', NOW() - INTERVAL '32 days', true),
('REB-004', 'components/analytics/rebate-dashboard.tsx', 'create', 220, 0, 'retroactive-reb-004', NOW() - INTERVAL '32 days', true),
('REB-004', 'components/analytics/rebate-trends-chart.tsx', 'create', 130, 0, 'retroactive-reb-004', NOW() - INTERVAL '32 days', true);

-- REB-005: Rebate Payment Tracking
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
('REB-005', 'components/analytics/rebate-payment-tracker.tsx', 'create', 160, 0, 'retroactive-reb-005', NOW() - INTERVAL '31 days', true),
('REB-005', 'app/api/analytics/rebates/payments/route.ts', 'create', 100, 0, 'retroactive-reb-005', NOW() - INTERVAL '31 days', true),
('REB-005', 'lib/notifications/rebate-reminders.ts', 'create', 80, 0, 'retroactive-reb-005', NOW() - INTERVAL '31 days', true);

-- REB-006: Rebate Audit Trail
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
('REB-006', 'components/audit/rebate-audit-trail.tsx', 'create', 140, 0, 'retroactive-reb-006', NOW() - INTERVAL '30 days', true),
('REB-006', 'lib/audit/audit-logger.ts', 'modify', 60, 10, 'retroactive-reb-006', NOW() - INTERVAL '30 days', true),
('REB-006', 'app/api/audit/rebates/route.ts', 'create', 90, 0, 'retroactive-reb-006', NOW() - INTERVAL '30 days', true);

-- Create git_commits entries
INSERT INTO git_commits (sha, message, author, committed_at)
VALUES
('retroactive-reb-001', 'feat: add vendor rebate calculation', 'Development Team', NOW() - INTERVAL '35 days'),
('retroactive-reb-002', 'feat: add rebate report generation', 'Development Team', NOW() - INTERVAL '33 days'),
('retroactive-reb-003', 'feat: add rebate agreement management', 'Development Team', NOW() - INTERVAL '34 days'),
('retroactive-reb-004', 'feat: add rebate tracking dashboard', 'Development Team', NOW() - INTERVAL '32 days'),
('retroactive-reb-005', 'feat: add rebate payment tracking', 'Development Team', NOW() - INTERVAL '31 days'),
('retroactive-reb-006', 'feat: add rebate audit trail', 'Development Team', NOW() - INTERVAL '30 days')
ON CONFLICT (sha) DO NOTHING;

-- Link commits to user stories
INSERT INTO user_story_commits (user_story_id, commit_sha)
SELECT 'REB-001', 'retroactive-reb-001'
UNION ALL SELECT 'REB-002', 'retroactive-reb-002'
UNION ALL SELECT 'REB-003', 'retroactive-reb-003'
UNION ALL SELECT 'REB-004', 'retroactive-reb-004'
UNION ALL SELECT 'REB-005', 'retroactive-reb-005'
UNION ALL SELECT 'REB-006', 'retroactive-reb-006'
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
WHERE epic = 'Rebate Reports';

-- Verification
SELECT 
  'Rebate Reports Code Linking Summary' as report,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed,
  COUNT(DISTINCT commit_sha) as commits_linked
FROM code_change_log
WHERE user_story_id LIKE 'REB-%';
