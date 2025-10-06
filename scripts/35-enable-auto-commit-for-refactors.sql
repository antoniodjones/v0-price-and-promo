-- Enable auto-commit for all refactor tasks
-- This ensures code changes are automatically pushed to GitHub

UPDATE user_stories
SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
  'auto_commit_enabled', true,
  'mode', 'agent',
  'branch_naming_pattern', 'feature',
  'commit_message_template', 'default'
)
WHERE task_id LIKE 'refactor-%';

-- Verify the update
SELECT 
  task_id,
  title,
  metadata->>'auto_commit_enabled' as auto_commit,
  metadata->>'mode' as mode
FROM user_stories
WHERE task_id LIKE 'refactor-%'
ORDER BY task_id;
