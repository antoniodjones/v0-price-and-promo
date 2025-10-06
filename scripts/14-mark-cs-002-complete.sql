-- Mark cs-002 (GitHub Webhook Integration) as complete
-- This task has been fully implemented with:
-- - Webhook endpoint at /api/webhooks/github
-- - Signature verification for security
-- - Push event processing
-- - Commit message parsing for task IDs
-- - File change extraction and logging
-- - Automatic code_change_log population
-- - user_stories git field updates
-- - Comprehensive error handling and logging

UPDATE user_stories
SET 
  status = 'Done',
  updated_at = NOW(),
  updated_by = 'system'
WHERE id = 'cs-002';

-- Verify the update
SELECT 
  id,
  title,
  status,
  story_points,
  epic,
  updated_at
FROM user_stories
WHERE id = 'cs-002';

-- Show Code Sync epic progress
SELECT 
  status,
  COUNT(*) as task_count,
  SUM(story_points) as total_points
FROM user_stories
WHERE epic = 'Code Sync'
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'Done' THEN 1
    WHEN 'In Progress' THEN 2
    WHEN 'To Do' THEN 3
    ELSE 4
  END;
