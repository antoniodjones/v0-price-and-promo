-- Mark cs-012 as complete
UPDATE user_stories
SET 
  status = 'Done',
  updated_at = NOW()
WHERE id = 'cs-012';
