-- Mark cs-013 as complete
UPDATE user_stories
SET 
  status = 'Completed',
  updated_at = NOW()
WHERE task_id = 'cs-013';

-- Log completion event
INSERT INTO code_change_log (
  task_id,
  change_type,
  file_path,
  description,
  changed_by
) VALUES (
  'cs-013',
  'feature_complete',
  'components/user-stories/task-detail-sheet.tsx',
  'Implemented auto-commit toggle with persistence, auto-enable on completion, and full integration with auto-commit agent',
  'system'
);

-- Verify the implementation
SELECT 
  task_id,
  title,
  status,
  epic,
  updated_at
FROM user_stories
WHERE task_id = 'cs-013';
