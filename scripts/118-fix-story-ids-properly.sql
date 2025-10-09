-- Fix ALL story IDs to sequential 5-digit format (00001, 00002, etc.)
-- This will renumber ALL 172 stories in proper order

WITH numbered_stories AS (
    SELECT 
        story_id as old_id,
        LPAD(ROW_NUMBER() OVER (
            ORDER BY 
                CASE phase
                    WHEN 'Phase 1: Critical MVP Features' THEN 1
                    WHEN 'Phase 2: High Priority Business Features' THEN 2
                    WHEN 'Phase 3: Medium Priority Features' THEN 3
                    WHEN 'Phase 4: Low Priority & Specialized Features' THEN 4
                    ELSE 5
                END,
                epic_name,
                created_at
        )::text, 5, '0') as new_id
    FROM user_stories
)
UPDATE user_stories
SET story_id = numbered_stories.new_id
FROM numbered_stories
WHERE user_stories.story_id = numbered_stories.old_id;

-- Verify the update
SELECT 
    story_id,
    title,
    epic_name,
    phase
FROM user_stories
ORDER BY story_id
LIMIT 20;
