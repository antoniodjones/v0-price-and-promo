-- Consolidate epic-refactor and refactor-001 into single "Refactor" epic
-- This eliminates confusion from having two similarly named epics

DO $$
BEGIN
  -- Step 1: Update the main epic from "epic-refactor" to "Refactor"
  UPDATE user_stories
  SET 
    epic = 'Refactor',
    title = 'Refactor: Systematic Code Refactoring & Deployment Optimization',
    updated_at = NOW()
  WHERE id = 'epic-refactor';

  RAISE NOTICE 'Updated epic-refactor to use epic name "Refactor"';

  -- Step 2: Update all tasks that reference epic-refactor as their epic
  UPDATE user_stories
  SET 
    epic = 'Refactor',
    updated_at = NOW()
  WHERE epic = 'epic-refactor';

  RAISE NOTICE 'Updated all tasks with epic = epic-refactor to epic = Refactor';

  -- Step 3: Update all tasks that reference refactor-001 as their epic
  UPDATE user_stories
  SET 
    epic = 'Refactor',
    updated_at = NOW()
  WHERE epic = 'refactor-001';

  RAISE NOTICE 'Updated all tasks with epic = refactor-001 to epic = Refactor';

  -- Step 4: Update parent_id references if needed
  UPDATE user_stories
  SET 
    parent_id = 'epic-refactor',
    updated_at = NOW()
  WHERE parent_id = 'refactor-001' 
    AND id != 'refactor-001'; -- Don't update refactor-001 itself

  RAISE NOTICE 'Updated parent_id references from refactor-001 to epic-refactor';

  -- Step 5: Log the consolidation event
  INSERT INTO task_events (
    task_id,
    event_type,
    triggered_by,
    metadata
  ) VALUES (
    'epic-refactor',
    'epic_consolidated',
    'v0-agent',
    jsonb_build_object(
      'consolidation_note', 'Consolidated epic-refactor and refactor-001 into single "Refactor" epic',
      'old_epic_names', jsonb_build_array('epic-refactor', 'refactor-001'),
      'new_epic_name', 'Refactor',
      'tasks_updated', (SELECT COUNT(*) FROM user_stories WHERE epic = 'Refactor'),
      'timestamp', NOW()
    )
  );

  RAISE NOTICE 'Epic consolidation complete!';

END $$;

-- Verify the consolidation
SELECT 
  'Epic Summary' as report_type,
  epic,
  COUNT(*) as task_count,
  COUNT(DISTINCT parent_id) as unique_parents
FROM user_stories
WHERE epic = 'Refactor'
GROUP BY epic

UNION ALL

SELECT 
  'Task List' as report_type,
  id as epic,
  NULL as task_count,
  NULL as unique_parents
FROM user_stories
WHERE epic = 'Refactor'
ORDER BY report_type, epic;

-- Show the epic structure
SELECT 
  id,
  title,
  epic,
  parent_id,
  status,
  priority,
  story_points
FROM user_stories
WHERE epic = 'Refactor' OR id = 'epic-refactor'
ORDER BY 
  CASE WHEN id = 'epic-refactor' THEN 0 ELSE 1 END,
  id;
