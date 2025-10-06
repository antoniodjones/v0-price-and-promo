-- Mark cs-009 as complete
-- This task implemented the core GitHub workflow service

UPDATE user_stories
SET 
  status = 'completed',
  completed_at = NOW(),
  updated_at = NOW()
WHERE task_id = 'cs-009';
