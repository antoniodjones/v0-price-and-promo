-- Verify Phase 5 completion and show final statistics

SELECT 
  'Phase 5 Verification' AS check_type,
  COUNT(*) AS total_stories,
  SUM(story_points) AS total_story_points,
  COUNT(*) FILTER (WHERE phase = 5) AS phase5_stories,
  SUM(story_points) FILTER (WHERE phase = 5) AS phase5_points
FROM user_stories;

SELECT 
  phase,
  COUNT(*) AS story_count,
  SUM(story_points) AS total_points,
  ROUND(AVG(story_points), 1) AS avg_points
FROM user_stories
GROUP BY phase
ORDER BY phase;

SELECT 
  e.name AS epic_name,
  COUNT(us.id) AS story_count,
  SUM(us.story_points) AS total_points
FROM epics e
LEFT JOIN user_stories us ON us.epic_id = e.id
GROUP BY e.name
ORDER BY story_count DESC;

SELECT 
  'Total Stories' AS metric,
  COUNT(*) AS value
FROM user_stories
UNION ALL
SELECT 
  'Stories with Code Links',
  COUNT(*) 
FROM user_stories 
WHERE related_files IS NOT NULL AND array_length(related_files, 1) > 0
UNION ALL
SELECT
  'Average Story Points',
  ROUND(AVG(story_points), 1)
FROM user_stories;
