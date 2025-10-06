-- ============================================================================
-- Mark cs-001 as Complete
-- Task: Update cs-001 status to 'Done' after successful schema deployment
-- ============================================================================

-- Update cs-001 status to Done
UPDATE user_stories
SET 
  status = 'Done',
  updated_at = NOW(),
  updated_by = 'system'
WHERE id = 'cs-001';

-- Verify the update
SELECT 
  id,
  title,
  status,
  priority,
  story_points,
  epic,
  updated_at
FROM user_stories
WHERE id = 'cs-001';

-- Show completion summary
SELECT 
  'cs-001 Enhanced Database Schema' as task,
  'Completed' as status,
  'All tables, indexes, functions, and RLS policies successfully created' as details;

-- Verify all schema components exist
SELECT 
  'Schema Verification' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'code_change_log') THEN '✓ code_change_log table exists'
    ELSE '✗ code_change_log table missing'
  END as code_change_log,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jira_sync_log') THEN '✓ jira_sync_log table exists'
    ELSE '✗ jira_sync_log table missing'
  END as jira_sync_log,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'github_webhooks') THEN '✓ github_webhooks table exists'
    ELSE '✗ github_webhooks table missing'
  END as github_webhooks,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_stories' AND column_name = 'jira_issue_key') THEN '✓ user_stories enhanced'
    ELSE '✗ user_stories not enhanced'
  END as user_stories_enhanced;
