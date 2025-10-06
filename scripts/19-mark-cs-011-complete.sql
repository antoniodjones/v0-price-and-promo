-- Mark cs-011 as complete
-- Task: Task Actions UI Component

UPDATE user_stories
SET 
  status = 'Completed',
  updated_at = NOW(),
  updated_by = 'system'
WHERE id = 'cs-011';
