-- Final Verification: All Phases Complete
-- Verify all 129 user stories across 21 epics are in the database

-- 1. Count stories by phase
SELECT 
  CASE 
    WHEN epic_id BETWEEN 1 AND 4 THEN 'Phase 1: Critical MVP'
    WHEN epic_id BETWEEN 5 AND 9 THEN 'Phase 2: High Priority'
    WHEN epic_id BETWEEN 10 AND 15 THEN 'Phase 3: Medium Priority'
    WHEN epic_id BETWEEN 16 AND 21 THEN 'Phase 4: Low Priority'
    ELSE 'Unknown'
  END as phase,
  COUNT(*) as story_count,
  SUM(story_points) as total_points
FROM user_stories
GROUP BY phase
ORDER BY phase;

-- 2. Count stories by epic
SELECT 
  epic_id,
  epic_name,
  COUNT(*) as story_count,
  SUM(story_points) as total_points
FROM user_stories
GROUP BY epic_id, epic_name
ORDER BY epic_id;

-- 3. Overall totals
SELECT 
  COUNT(*) as total_stories,
  SUM(story_points) as total_points,
  COUNT(DISTINCT epic_id) as total_epics
FROM user_stories;

-- 4. Phase 4 specific verification
SELECT 
  epic_id,
  epic_name,
  story_id,
  title,
  story_points,
  priority
FROM user_stories
WHERE epic_id BETWEEN 18 AND 21
ORDER BY epic_id, story_id;

-- 5. Check for any missing story IDs in expected ranges
SELECT 
  'Phase 1' as phase,
  COUNT(*) as expected_count,
  25 as target_count,
  CASE WHEN COUNT(*) = 25 THEN '✓ Complete' ELSE '✗ Incomplete' END as status
FROM user_stories WHERE epic_id BETWEEN 1 AND 4
UNION ALL
SELECT 
  'Phase 2',
  COUNT(*),
  33,
  CASE WHEN COUNT(*) = 33 THEN '✓ Complete' ELSE '✗ Incomplete' END
FROM user_stories WHERE epic_id BETWEEN 5 AND 9
UNION ALL
SELECT 
  'Phase 3',
  COUNT(*),
  36,
  CASE WHEN COUNT(*) = 36 THEN '✓ Complete' ELSE '✗ Incomplete' END
FROM user_stories WHERE epic_id BETWEEN 10 AND 15
UNION ALL
SELECT 
  'Phase 4',
  COUNT(*),
  35,
  CASE WHEN COUNT(*) = 35 THEN '✓ Complete' ELSE '✗ Incomplete' END
FROM user_stories WHERE epic_id BETWEEN 18 AND 21;
