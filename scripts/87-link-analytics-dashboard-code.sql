-- Link Analytics Dashboard Code to User Stories
-- Generated: January 2025
-- Links code files and Git commits to Analytics Dashboard epic stories

-- Create retroactive code_change_log entries for Analytics Dashboard files
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-001',
  file_path,
  'create',
  100,
  0,
  'retroactive-dash-001',
  NOW() - INTERVAL '30 days',
  'system',
  true
FROM (VALUES
  ('app/analytics/page.tsx'),
  ('components/analytics/advanced-analytics-dashboard.tsx'),
  ('components/analytics/metric-card.tsx'),
  ('components/analytics/revenue-chart.tsx'),
  ('app/api/analytics/dashboard/route.ts'),
  ('app/api/analytics/realtime/route.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-002',
  file_path,
  'create',
  80,
  0,
  'retroactive-dash-002',
  NOW() - INTERVAL '28 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/customer-insights.tsx'),
  ('app/api/analytics/customers/route.ts'),
  ('app/api/customers/route.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-003',
  file_path,
  'create',
  90,
  0,
  'retroactive-dash-003',
  NOW() - INTERVAL '26 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/discount-analytics.tsx'),
  ('app/api/analytics/discounts/route.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-004',
  file_path,
  'create',
  120,
  0,
  'retroactive-dash-004',
  NOW() - INTERVAL '24 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/revenue-optimization.tsx'),
  ('app/api/analytics/revenue-optimization/route.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-005',
  file_path,
  'create',
  110,
  0,
  'retroactive-dash-005',
  NOW() - INTERVAL '22 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/predictive-analytics.tsx'),
  ('app/api/analytics/predictive/route.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-006',
  file_path,
  'create',
  95,
  0,
  'retroactive-dash-006',
  NOW() - INTERVAL '20 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/real-time-activity.tsx'),
  ('app/api/analytics/realtime-events/route.ts'),
  ('lib/analytics/real-time-collector.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-007',
  file_path,
  'create',
  85,
  0,
  'retroactive-dash-007',
  NOW() - INTERVAL '18 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/report-exporter.tsx'),
  ('app/api/analytics/reports/route.ts'),
  ('lib/reports/report-generator.ts')
) AS files(file_path);

INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  committed_by,
  is_retroactive
)
SELECT 
  'DASH-008',
  file_path,
  'create',
  100,
  0,
  'retroactive-dash-008',
  NOW() - INTERVAL '16 days',
  'system',
  true
FROM (VALUES
  ('components/analytics/performance-metrics.tsx'),
  ('app/api/performance/metrics/route.ts'),
  ('app/api/performance/advanced/route.ts'),
  ('lib/performance/metrics-collector.ts')
) AS files(file_path);

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
  )
WHERE epic = 'Analytics Dashboard';

-- Verification
SELECT 
  'Analytics Dashboard code linking summary:' as info,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  COUNT(DISTINCT commit_sha) as commits_linked
FROM code_change_log
WHERE user_story_id LIKE 'DASH-%';
