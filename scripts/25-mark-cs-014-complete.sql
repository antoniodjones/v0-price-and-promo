-- Mark cs-014 as complete
-- Code Changes Detection & View API

UPDATE user_stories
SET 
  status = 'done',
  completed_at = NOW()
WHERE id = 'cs-014'; -- Fixed: using 'id' instead of 'task_id'

-- Log completion event
INSERT INTO task_events (
  task_id,
  event_type,
  triggered_by,
  metadata
) VALUES (
  'cs-014',
  'task_completed',
  'v0-agent',
  jsonb_build_object(
    'completion_note', 'Created /api/code-changes/detect and /api/code-changes/trigger endpoints',
    'features', jsonb_build_array(
      'Detect pending code changes for tasks',
      'Show commit history with GitHub URLs',
      'Trigger manual GitHub sync',
      'Group changes by commit',
      'Calculate summary statistics',
      'Return clickable GitHub links'
    )
  )
);
