-- Migration: Convert user_stories.id from TEXT to BIGSERIAL (auto-incrementing integer)
-- This is a complex migration that affects multiple tables with foreign key relationships

BEGIN;

-- Step 1: Add new integer ID column with auto-increment
ALTER TABLE user_stories ADD COLUMN IF NOT EXISTS id_new BIGSERIAL;

-- Step 2: Create mapping table to preserve old ID references during migration
CREATE TEMP TABLE id_mapping AS
SELECT 
    id as old_id,
    ROW_NUMBER() OVER (ORDER BY created_at, id) as new_id
FROM user_stories;

-- Step 3: Update the new ID column with sequential numbers
UPDATE user_stories us
SET id_new = im.new_id
FROM id_mapping im
WHERE us.id = im.old_id;

-- Step 4: Add new integer foreign key columns to related tables
ALTER TABLE code_change_log ADD COLUMN IF NOT EXISTS task_id_new BIGINT;
ALTER TABLE jira_sync_log ADD COLUMN IF NOT EXISTS task_id_new BIGINT;
ALTER TABLE task_events ADD COLUMN IF NOT EXISTS task_id_new BIGINT;
ALTER TABLE task_file_mapping ADD COLUMN IF NOT EXISTS task_id_new BIGINT;
ALTER TABLE user_stories ADD COLUMN IF NOT EXISTS parent_id_new BIGINT;

-- Step 5: Populate new foreign key columns
UPDATE code_change_log ccl
SET task_id_new = im.new_id
FROM id_mapping im
WHERE ccl.task_id = im.old_id;

UPDATE jira_sync_log jsl
SET task_id_new = im.new_id
FROM id_mapping im
WHERE jsl.task_id = im.old_id;

UPDATE task_events te
SET task_id_new = im.new_id
FROM id_mapping im
WHERE te.task_id = im.old_id;

UPDATE task_file_mapping tfm
SET task_id_new = im.new_id
FROM id_mapping im
WHERE tfm.task_id = im.old_id;

UPDATE user_stories us
SET parent_id_new = im.new_id
FROM id_mapping im
WHERE us.parent_id = im.old_id;

-- Step 6: Drop old foreign key constraints
ALTER TABLE code_change_log DROP CONSTRAINT IF EXISTS code_change_log_task_id_fkey;
ALTER TABLE jira_sync_log DROP CONSTRAINT IF EXISTS jira_sync_log_task_id_fkey;
ALTER TABLE task_events DROP CONSTRAINT IF EXISTS task_events_task_id_fkey;

-- Step 7: Drop old primary key and columns
ALTER TABLE user_stories DROP CONSTRAINT IF EXISTS user_stories_pkey;
ALTER TABLE code_change_log DROP COLUMN IF EXISTS task_id;
ALTER TABLE jira_sync_log DROP COLUMN IF EXISTS task_id;
ALTER TABLE task_events DROP COLUMN IF EXISTS task_id;
ALTER TABLE task_file_mapping DROP COLUMN IF EXISTS task_id;
ALTER TABLE user_stories DROP COLUMN IF EXISTS parent_id;
ALTER TABLE user_stories DROP COLUMN IF EXISTS id;

-- Step 8: Rename new columns to original names
ALTER TABLE user_stories RENAME COLUMN id_new TO id;
ALTER TABLE user_stories RENAME COLUMN parent_id_new TO parent_id;
ALTER TABLE code_change_log RENAME COLUMN task_id_new TO task_id;
ALTER TABLE jira_sync_log RENAME COLUMN task_id_new TO task_id;
ALTER TABLE task_events RENAME COLUMN task_id_new TO task_id;
ALTER TABLE task_file_mapping RENAME COLUMN task_id_new TO task_id;

-- Step 9: Add new primary key constraint
ALTER TABLE user_stories ADD PRIMARY KEY (id);

-- Step 10: Add new foreign key constraints
ALTER TABLE code_change_log 
    ADD CONSTRAINT code_change_log_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES user_stories(id) ON DELETE CASCADE;

ALTER TABLE jira_sync_log 
    ADD CONSTRAINT jira_sync_log_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES user_stories(id) ON DELETE CASCADE;

ALTER TABLE task_events 
    ADD CONSTRAINT task_events_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES user_stories(id) ON DELETE CASCADE;

ALTER TABLE user_stories
    ADD CONSTRAINT user_stories_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES user_stories(id) ON DELETE SET NULL;

-- Step 11: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_code_change_task_id ON code_change_log(task_id);
CREATE INDEX IF NOT EXISTS idx_jira_sync_task_id ON jira_sync_log(task_id);
CREATE INDEX IF NOT EXISTS idx_task_events_task_id ON task_events(task_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_parent_id ON user_stories(parent_id);

-- Step 12: Update sequence to continue from current max
SELECT setval('user_stories_id_seq', (SELECT MAX(id) FROM user_stories));

COMMIT;

-- Verification queries
SELECT 
    'Migration Complete' as status,
    COUNT(*) as total_stories,
    MIN(id) as min_id,
    MAX(id) as max_id,
    pg_typeof(id) as id_type
FROM user_stories;

SELECT 
    'Foreign Key Integrity' as check_type,
    COUNT(*) as code_changes_linked
FROM code_change_log
WHERE task_id IS NOT NULL;

SELECT 
    'Auto-increment Test' as test,
    'Next ID will be: ' || nextval('user_stories_id_seq') as next_id;

-- Roll back the test
SELECT setval('user_stories_id_seq', (SELECT MAX(id) FROM user_stories));
