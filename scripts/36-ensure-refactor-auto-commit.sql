-- Ensure all refactor tasks have auto_commit_enabled = true
-- This eliminates user dependency for tracking

UPDATE user_stories
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{auto_commit_enabled}',
  'true'::jsonb
)
WHERE task_id LIKE 'refactor-%'
  AND (metadata IS NULL OR metadata->>'auto_commit_enabled' IS NULL OR metadata->>'auto_commit_enabled' = 'false');

-- Verify all refactor tasks are configured
SELECT 
  task_id,
  title,
  metadata->>'auto_commit_enabled' as auto_commit_status
FROM user_stories
WHERE task_id LIKE 'refactor-%'
ORDER BY task_id;
