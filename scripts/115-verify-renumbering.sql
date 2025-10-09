-- Comprehensive verification of the renumbering

-- 1. Check total count and ID range
SELECT 
  COUNT(*) as total_stories,
  MIN(story_id::INTEGER) as min_id,
  MAX(story_id::INTEGER) as max_id,
  MAX(story_id::INTEGER) - MIN(story_id::INTEGER) + 1 as expected_count
FROM user_stories;

-- 2. Check for any gaps in the sequence
SELECT 
  story_id::INTEGER as current_id,
  LEAD(story_id::INTEGER) OVER (ORDER BY story_id::INTEGER) as next_id,
  LEAD(story_id::INTEGER) OVER (ORDER BY story_id::INTEGER) - story_id::INTEGER as gap
FROM user_stories
WHERE LEAD(story_id::INTEGER) OVER (ORDER BY story_id::INTEGER) - story_id::INTEGER > 1;

-- 3. Show story distribution by phase with new IDs
SELECT 
  phase,
  COUNT(*) as story_count,
  MIN(story_id) as first_id,
  MAX(story_id) as last_id
FROM user_stories
GROUP BY phase
ORDER BY MIN(story_id::INTEGER);

-- 4. Show first 5 and last 5 stories
(SELECT story_id, title, epic_name, phase, 'First 5' as position
 FROM user_stories
 ORDER BY story_id::INTEGER
 LIMIT 5)
UNION ALL
(SELECT story_id, title, epic_name, phase, 'Last 5' as position
 FROM user_stories
 ORDER BY story_id::INTEGER DESC
 LIMIT 5)
ORDER BY 
  CASE position WHEN 'First 5' THEN 1 ELSE 2 END,
  story_id::INTEGER;
