-- CORRECTED: Renumber all story IDs to sequential format starting at 00001
-- Previous script tried to update non-existent 'story_id' column
-- This script correctly updates the 'id' column (primary key)

-- First, create a temporary mapping table
CREATE TEMP TABLE story_id_mapping AS
SELECT 
  id AS old_id,
  LPAD(ROW_NUMBER() OVER (
    ORDER BY 
      CASE 
        WHEN epic LIKE '%Phase 1%' OR epic LIKE '%Critical%' OR epic LIKE '%MVP%' THEN 1
        WHEN epic LIKE '%Phase 2%' OR epic LIKE '%High Priority%' THEN 2
        WHEN epic LIKE '%Phase 3%' OR epic LIKE '%Medium Priority%' THEN 3
        WHEN epic LIKE '%Phase 4%' OR epic LIKE '%Low Priority%' THEN 4
        ELSE 5
      END,
      epic,
      created_at
  )::TEXT, 5, '0') AS new_id
FROM user_stories;

-- Show the mapping for verification
SELECT 
  old_id AS current_id,
  new_id AS will_become,
  (SELECT title FROM user_stories WHERE id = old_id) AS story_title
FROM story_id_mapping
ORDER BY new_id::INTEGER
LIMIT 20;

-- Update all foreign key references first (if any exist)
-- Update code_change_log
UPDATE code_change_log ccl
SET task_id = m.new_id
FROM story_id_mapping m
WHERE ccl.task_id = m.old_id;

-- Update jira_sync_log
UPDATE jira_sync_log jsl
SET task_id = m.new_id
FROM story_id_mapping m
WHERE jsl.task_id = m.old_id;

-- Update task_events
UPDATE task_events te
SET task_id = m.new_id
FROM story_id_mapping m
WHERE te.task_id = m.old_id;

-- Update task_file_mapping
UPDATE task_file_mapping tfm
SET task_id = m.new_id
FROM story_id_mapping m
WHERE tfm.task_id = m.old_id;

-- Update parent_id references within user_stories
UPDATE user_stories us
SET parent_id = m.new_id
FROM story_id_mapping m
WHERE us.parent_id = m.old_id;

-- Finally, update the primary keys in user_stories
-- We need to do this carefully to avoid constraint violations
ALTER TABLE user_stories DROP CONSTRAINT IF EXISTS user_stories_pkey;

UPDATE user_stories us
SET id = m.new_id
FROM story_id_mapping m
WHERE us.id = m.old_id;

ALTER TABLE user_stories ADD PRIMARY KEY (id);

-- Verify the renumbering
SELECT 
  id,
  title,
  epic,
  status,
  story_points
FROM user_stories
ORDER BY id::INTEGER
LIMIT 20;

-- Show summary
SELECT 
  COUNT(*) AS total_stories_renumbered,
  MIN(id::INTEGER) AS first_id,
  MAX(id::INTEGER) AS last_id
FROM user_stories;

DROP TABLE story_id_mapping;
