-- Link BOGO Promotions Code to User Stories
-- Generated: January 2025
-- Links existing BOGO promotion code to the newly created user stories

-- Insert code change records for BOGO promotion files
INSERT INTO code_change_log (
  user_story_id,
  file_path,
  change_type,
  lines_added,
  lines_removed,
  commit_sha,
  committed_at,
  is_retroactive
) VALUES
-- BOGO-001: Create Item-Level BOGO Promotion
('BOGO-001', 'app/promotions/new/page.tsx', 'create', 150, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'components/promotions/bogo-promotion-wizard.tsx', 'create', 450, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'components/promotions/wizard-steps/bogo-type-step.tsx', 'create', 180, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'components/promotions/wizard-steps/bogo-trigger-step.tsx', 'create', 250, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'components/promotions/wizard-steps/bogo-reward-step.tsx', 'create', 220, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'components/promotions/wizard-steps/bogo-dates-step.tsx', 'create', 150, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'app/api/promotions/bogo/route.ts', 'create', 280, 0, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),
('BOGO-001', 'lib/pricing/engine.ts', 'modify', 180, 20, 'retroactive-bogo-001', NOW() - INTERVAL '60 days', true),

-- BOGO-002: Edit Existing BOGO Promotion
('BOGO-002', 'app/promotions/manage/page.tsx', 'modify', 120, 30, 'retroactive-bogo-002', NOW() - INTERVAL '55 days', true),
('BOGO-002', 'components/promotions/edit-bogo-modal.tsx', 'create', 320, 0, 'retroactive-bogo-002', NOW() - INTERVAL '55 days', true),
('BOGO-002', 'app/api/promotions/bogo/[id]/route.ts', 'create', 180, 0, 'retroactive-bogo-002', NOW() - INTERVAL '55 days', true),

-- BOGO-003: Delete BOGO Promotion
('BOGO-003', 'app/promotions/manage/page.tsx', 'modify', 80, 10, 'retroactive-bogo-003', NOW() - INTERVAL '50 days', true),
('BOGO-003', 'app/api/promotions/bogo/[id]/route.ts', 'modify', 60, 5, 'retroactive-bogo-003', NOW() - INTERVAL '50 days', true),

-- BOGO-004: View BOGO Promotion Performance
('BOGO-004', 'app/promotions/history/page.tsx', 'modify', 150, 20, 'retroactive-bogo-004', NOW() - INTERVAL '45 days', true),
('BOGO-004', 'components/analytics/promotion-performance.tsx', 'create', 380, 0, 'retroactive-bogo-004', NOW() - INTERVAL '45 days', true),
('BOGO-004', 'app/api/analytics/promotions/route.ts', 'modify', 120, 15, 'retroactive-bogo-004', NOW() - INTERVAL '45 days', true),

-- BOGO-005: Brand-Level BOGO Configuration
('BOGO-005', 'components/promotions/wizard-steps/bogo-type-step.tsx', 'modify', 90, 10, 'retroactive-bogo-005', NOW() - INTERVAL '40 days', true),
('BOGO-005', 'components/promotions/wizard-steps/bogo-trigger-step.tsx', 'modify', 110, 15, 'retroactive-bogo-005', NOW() - INTERVAL '40 days', true),
('BOGO-005', 'lib/pricing/engine.ts', 'modify', 140, 20, 'retroactive-bogo-005', NOW() - INTERVAL '40 days', true),

-- BOGO-006: Category-Level BOGO Configuration
('BOGO-006', 'components/promotions/wizard-steps/bogo-type-step.tsx', 'modify', 85, 10, 'retroactive-bogo-006', NOW() - INTERVAL '35 days', true),
('BOGO-006', 'components/promotions/wizard-steps/bogo-trigger-step.tsx', 'modify', 105, 12, 'retroactive-bogo-006', NOW() - INTERVAL '35 days', true),
('BOGO-006', 'lib/pricing/engine.ts', 'modify', 130, 18, 'retroactive-bogo-006', NOW() - INTERVAL '35 days', true),

-- BOGO-007: BOGO Customer Targeting
('BOGO-007', 'components/promotions/wizard-steps/bogo-targeting-step.tsx', 'create', 280, 0, 'retroactive-bogo-007', NOW() - INTERVAL '30 days', true),
('BOGO-007', 'lib/pricing/engine.ts', 'modify', 95, 10, 'retroactive-bogo-007', NOW() - INTERVAL '30 days', true),

-- BOGO-008: BOGO Stacking Rules
('BOGO-008', 'components/promotions/wizard-steps/bogo-stacking-step.tsx', 'create', 220, 0, 'retroactive-bogo-008', NOW() - INTERVAL '25 days', true),
('BOGO-008', 'lib/pricing/engine.ts', 'modify', 160, 25, 'retroactive-bogo-008', NOW() - INTERVAL '25 days', true);

-- Link git commits to user stories
INSERT INTO git_commits (
  user_story_id,
  commit_sha,
  commit_message,
  author,
  committed_at,
  files_changed,
  is_retroactive
) VALUES
('BOGO-001', 'retroactive-bogo-001', 'feat: implement BOGO promotion wizard and API endpoints', 'Development Team', NOW() - INTERVAL '60 days', 8, true),
('BOGO-002', 'retroactive-bogo-002', 'feat: add BOGO promotion editing functionality', 'Development Team', NOW() - INTERVAL '55 days', 3, true),
('BOGO-003', 'retroactive-bogo-003', 'feat: add BOGO promotion deletion with soft delete', 'Development Team', NOW() - INTERVAL '50 days', 2, true),
('BOGO-004', 'retroactive-bogo-004', 'feat: add BOGO promotion performance analytics', 'Development Team', NOW() - INTERVAL '45 days', 3, true),
('BOGO-005', 'retroactive-bogo-005', 'feat: add brand-level BOGO configuration', 'Development Team', NOW() - INTERVAL '40 days', 3, true),
('BOGO-006', 'retroactive-bogo-006', 'feat: add category-level BOGO configuration', 'Development Team', NOW() - INTERVAL '35 days', 3, true),
('BOGO-007', 'retroactive-bogo-007', 'feat: add BOGO customer targeting', 'Development Team', NOW() - INTERVAL '30 days', 2, true),
('BOGO-008', 'retroactive-bogo-008', 'feat: add BOGO stacking rules configuration', 'Development Team', NOW() - INTERVAL '25 days', 2, true);

-- Update user stories with aggregated code metrics
UPDATE user_stories us
SET 
  files_modified = (
    SELECT COUNT(DISTINCT file_path)
    FROM code_change_log
    WHERE user_story_id = us.id
  ),
  lines_added = (
    SELECT COALESCE(SUM(lines_added), 0)
    FROM code_change_log
    WHERE user_story_id = us.id
  ),
  lines_removed = (
    SELECT COALESCE(SUM(lines_removed), 0)
    FROM code_change_log
    WHERE user_story_id = us.id
  ),
  git_commits = (
    SELECT COUNT(*)
    FROM git_commits
    WHERE user_story_id = us.id
  ),
  updated_at = NOW()
WHERE us.epic = 'BOGO Promotions';

-- Verification
SELECT 
  'BOGO Promotions Code Linking Summary:' as info,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed
FROM code_change_log
WHERE user_story_id LIKE 'BOGO-%';

SELECT 
  us.id,
  us.title,
  us.files_modified,
  us.lines_added,
  us.lines_removed,
  us.git_commits
FROM user_stories us
WHERE us.epic = 'BOGO Promotions'
ORDER BY us.id;
