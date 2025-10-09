-- ============================================================================
-- Mark Integration Tasks as Complete
-- Script 129: Update user stories status for completed Jira & GitLab integration
-- ============================================================================

BEGIN;

-- Mark all Phase 1 Jira integration tasks as complete
UPDATE user_stories
SET 
  status = 'done',
  updated_at = NOW(),
  related_files = ARRAY[
    'lib/services/jira-api.ts',
    'lib/services/jira-sync-engine.ts',
    'lib/types/jira.ts',
    'app/api/webhooks/jira/route.ts',
    'app/api/jira/sync/route.ts',
    'app/api/jira/test-connection/route.ts',
    'components/settings/sections/integration-settings.tsx',
    'docs/WEBHOOK_CONFIGURATION_GUIDE.md'
  ]
WHERE story_id IN ('CS-004-A', 'CS-004-B', 'CS-004-C', 'CS-004-D')
AND status != 'done';

-- Mark all Phase 2 GitLab integration tasks as complete
UPDATE user_stories
SET 
  status = 'done',
  updated_at = NOW(),
  related_files = ARRAY[
    'lib/services/gitlab-api.ts',
    'lib/services/gitlab-webhook-processor.ts',
    'lib/types/gitlab.ts',
    'app/api/webhooks/gitlab/route.ts',
    'lib/services/git-provider-interface.ts',
    'lib/services/git-provider-factory.ts',
    'lib/services/github-provider.ts',
    'lib/services/gitlab-provider.ts',
    'lib/services/dual-sync-manager.ts',
    'app/api/git-provider/test/route.ts',
    'components/settings/sections/integration-settings.tsx',
    'docs/WEBHOOK_CONFIGURATION_GUIDE.md'
  ]
WHERE story_id IN ('GL-001', 'GL-006', 'GL-011', 'GL-012')
AND status != 'done';

-- Mark Phase 3 UI & Analytics tasks as complete
UPDATE user_stories
SET 
  status = 'done',
  updated_at = NOW(),
  related_files = ARRAY[
    'components/user-stories/task-code-linker.tsx',
    'app/api/user-stories/[taskId]/code-changes/route.ts',
    'app/analytics/code-sync/page.tsx',
    'app/api/analytics/code-sync/route.ts'
  ]
WHERE story_id IN ('CS-005', 'CS-007')
AND status != 'done';

-- Mark Phase 4 Retroactive Audit task as complete
UPDATE user_stories
SET 
  status = 'done',
  updated_at = NOW(),
  related_files = ARRAY[
    'scripts/cs-003-retroactive-audit-enhanced.ts',
    'lib/services/git-history-analyzer.ts',
    'app/api/admin/retroactive-audit/route.ts'
  ]
WHERE story_id = 'CS-003'
AND status != 'done';

COMMIT;

-- ============================================================================
-- Verification Query
-- ============================================================================

SELECT 
  '✅ Integration Tasks Completion Summary' as info,
  COUNT(*) as total_tasks,
  SUM(story_points) as total_story_points,
  COUNT(*) FILTER (WHERE status = 'done') as completed_tasks,
  SUM(story_points) FILTER (WHERE status = 'done') as completed_story_points
FROM user_stories
WHERE story_id IN (
  'CS-004-A', 'CS-004-B', 'CS-004-C', 'CS-004-D',
  'GL-001', 'GL-006', 'GL-011', 'GL-012',
  'CS-005', 'CS-007', 'CS-003'
);

-- Display all integration stories with their status
SELECT 
  story_id,
  title,
  status,
  priority,
  story_points,
  epic,
  array_length(related_files, 1) as file_count,
  updated_at
FROM user_stories
WHERE story_id IN (
  'CS-004-A', 'CS-004-B', 'CS-004-C', 'CS-004-D',
  'GL-001', 'GL-006', 'GL-011', 'GL-012',
  'CS-005', 'CS-007', 'CS-003'
)
ORDER BY 
  CASE 
    WHEN story_id LIKE 'CS-004-%' THEN 1
    WHEN story_id LIKE 'GL-%' THEN 2
    WHEN story_id = 'CS-005' THEN 3
    WHEN story_id = 'CS-007' THEN 4
    WHEN story_id = 'CS-003' THEN 5
  END,
  story_id;
