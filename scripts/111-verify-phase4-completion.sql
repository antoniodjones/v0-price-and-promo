-- Verification Script: Check Phase 4 Epic Completion
-- This script verifies all Phase 4 stories have been added to the database

-- Check total stories by epic
SELECT 
  'Phase 4 Stories by Epic' as report_section,
  epic,
  COUNT(*) as story_count,
  SUM(story_points) as total_points,
  STRING_AGG(story_id, ', ' ORDER BY story_id) as story_ids
FROM user_stories
WHERE epic IN (
  'Customer Management',
  'Product Management', 
  'Price Tracking',
  'Market Intelligence',
  'Performance Monitoring',
  'Predictive Analytics'
)
GROUP BY epic
ORDER BY epic;

-- Check Phase 4 totals
SELECT 
  'Phase 4 Totals' as report_section,
  COUNT(*) as total_stories,
  SUM(story_points) as total_points,
  COUNT(DISTINCT epic) as epic_count
FROM user_stories
WHERE epic IN (
  'Customer Management',
  'Product Management',
  'Price Tracking', 
  'Market Intelligence',
  'Performance Monitoring',
  'Predictive Analytics'
);

-- Check for any missing stories (expected vs actual)
WITH expected_counts AS (
  SELECT 'Customer Management' as epic, 7 as expected_stories UNION ALL
  SELECT 'Product Management', 8 UNION ALL
  SELECT 'Price Tracking', 5 UNION ALL
  SELECT 'Market Intelligence', 5 UNION ALL
  SELECT 'Performance Monitoring', 5 UNION ALL
  SELECT 'Predictive Analytics', 5
),
actual_counts AS (
  SELECT 
    epic,
    COUNT(*) as actual_stories
  FROM user_stories
  WHERE epic IN (
    'Customer Management',
    'Product Management',
    'Price Tracking',
    'Market Intelligence', 
    'Performance Monitoring',
    'Predictive Analytics'
  )
  GROUP BY epic
)
SELECT 
  'Missing Stories Check' as report_section,
  e.epic,
  e.expected_stories,
  COALESCE(a.actual_stories, 0) as actual_stories,
  e.expected_stories - COALESCE(a.actual_stories, 0) as missing_count,
  CASE 
    WHEN COALESCE(a.actual_stories, 0) = e.expected_stories THEN '✓ Complete'
    ELSE '✗ Incomplete'
  END as status
FROM expected_counts e
LEFT JOIN actual_counts a ON e.epic = a.epic
ORDER BY e.epic;

-- Overall completion status
SELECT 
  'Overall Phase 4 Status' as report_section,
  CASE 
    WHEN COUNT(*) = 35 THEN '✓ All 35 stories loaded successfully'
    ELSE '✗ Only ' || COUNT(*) || ' of 35 stories loaded'
  END as completion_status
FROM user_stories
WHERE epic IN (
  'Customer Management',
  'Product Management',
  'Price Tracking',
  'Market Intelligence',
  'Performance Monitoring', 
  'Predictive Analytics'
);

-- List all Phase 4 story IDs for verification
SELECT 
  'All Phase 4 Story IDs' as report_section,
  story_id,
  title,
  epic,
  status,
  story_points
FROM user_stories
WHERE epic IN (
  'Customer Management',
  'Product Management',
  'Price Tracking',
  'Market Intelligence',
  'Performance Monitoring',
  'Predictive Analytics'
)
ORDER BY epic, story_id;
