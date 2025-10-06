-- Mark cs-010 as complete
-- Task: Agent Auto-Commit Integration

UPDATE user_stories
SET 
  status = 'DONE',
  updated_at = NOW()
WHERE id = 'cs-010';
