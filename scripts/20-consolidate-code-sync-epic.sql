-- Consolidate Code Sync Epic - Fix duplicate epic entries
-- This script consolidates "Code Sync" into "CODE-SYNC" to maintain consistency

-- First, let's see what we have
SELECT epic, COUNT(*) as task_count, STRING_AGG(id, ', ') as task_ids
FROM user_stories
WHERE epic ILIKE '%code%sync%' OR epic ILIKE '%code-sync%'
GROUP BY epic;

-- Update any tasks with "Code Sync" to use "CODE-SYNC"
UPDATE user_stories
SET 
  epic = 'CODE-SYNC',
  updated_at = NOW(),
  updated_by = 'system'
WHERE epic = 'Code Sync' OR epic = 'code sync' OR epic = 'code-sync';

-- Verify the consolidation
SELECT epic, COUNT(*) as task_count, STRING_AGG(id, ', ' ORDER BY id) as task_ids
FROM user_stories
WHERE epic = 'CODE-SYNC'
GROUP BY epic;

-- Show all CODE-SYNC tasks to confirm
SELECT 
  id,
  title,
  status,
  epic,
  created_at
FROM user_stories
WHERE epic = 'CODE-SYNC'
ORDER BY id;
