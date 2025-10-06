-- Mark refactor-002 as complete
UPDATE user_stories
SET 
  status = 'done',
  updated_at = NOW()
WHERE task_number = 'refactor-002';
