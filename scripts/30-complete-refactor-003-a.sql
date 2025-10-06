-- Mark refactor-003-a as complete since wizard consolidation is already done
UPDATE user_stories
SET status = 'done',
    updated_at = NOW()
WHERE id = 'refactor-003-a';
