-- Mark refactor-003-b as complete
UPDATE user_stories
SET status = 'done',
    updated_at = NOW()
WHERE id = 'refactor-003-b';
