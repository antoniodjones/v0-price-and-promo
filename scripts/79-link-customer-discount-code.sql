-- Link Customer Discounts Code to User Stories
-- Generated: January 2025
-- Links existing customer discount code to the newly created user stories

-- Insert code change records for customer discount files
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
-- CUST-001: Create Customer-Specific Discount Rule
('CUST-001', 'app/customer-discounts/new/page.tsx', 'create', 120, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'app/customer-discounts/page.tsx', 'create', 180, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'components/customer-discounts/customer-discount-wizard.tsx', 'create', 520, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'components/customer-discounts/wizard-steps/discount-scope-step.tsx', 'create', 220, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'components/customer-discounts/wizard-steps/discount-value-step.tsx', 'create', 180, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'components/customer-discounts/wizard-steps/customer-assignment-step.tsx', 'create', 280, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'components/customer-discounts/wizard-steps/discount-dates-step.tsx', 'create', 150, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'app/api/discounts/customer/route.ts', 'create', 320, 0, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),
('CUST-001', 'lib/pricing/engine.ts', 'modify', 200, 25, 'retroactive-cust-001', NOW() - INTERVAL '90 days', true),

-- CUST-002: Bulk Customer Assignment
('CUST-002', 'components/customer-discounts/bulk-assignment-modal.tsx', 'create', 350, 0, 'retroactive-cust-002', NOW() - INTERVAL '85 days', true),
('CUST-002', 'components/customer-discounts/csv-upload.tsx', 'create', 280, 0, 'retroactive-cust-002', NOW() - INTERVAL '85 days', true),
('CUST-002', 'app/api/discounts/customer/[id]/assignments/bulk/route.ts', 'create', 220, 0, 'retroactive-cust-002', NOW() - INTERVAL '85 days', true),

-- CUST-003: View Customer Discount Assignments
('CUST-003', 'components/customer-discounts/customer-discounts-list.tsx', 'create', 420, 0, 'retroactive-cust-003', NOW() - INTERVAL '80 days', true),
('CUST-003', 'components/customer-discounts/assignment-list.tsx', 'create', 280, 0, 'retroactive-cust-003', NOW() - INTERVAL '80 days', true),
('CUST-003', 'app/customers/[id]/page.tsx', 'modify', 150, 20, 'retroactive-cust-003', NOW() - INTERVAL '80 days', true),
('CUST-003', 'app/api/discounts/customer/[id]/assignments/route.ts', 'create', 180, 0, 'retroactive-cust-003', NOW() - INTERVAL '80 days', true),

-- CUST-004: Customer Discount Analytics
('CUST-004', 'components/analytics/discount-analytics.tsx', 'create', 480, 0, 'retroactive-cust-004', NOW() - INTERVAL '75 days', true),
('CUST-004', 'components/analytics/customer-engagement.tsx', 'create', 320, 0, 'retroactive-cust-004', NOW() - INTERVAL '75 days', true),
('CUST-004', 'app/api/analytics/discounts/customer/route.ts', 'create', 280, 0, 'retroactive-cust-004', NOW() - INTERVAL '75 days', true),

-- CUST-005: Customer Tier Management
('CUST-005', 'app/customers/tiers/page.tsx', 'create', 380, 0, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),
('CUST-005', 'components/customers/tier-assignment.tsx', 'create', 250, 0, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),
('CUST-005', 'components/customers/bulk-tier-assignment.tsx', 'create', 320, 0, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),
('CUST-005', 'app/api/customers/[id]/tier/route.ts', 'create', 150, 0, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),
('CUST-005', 'app/api/customers/tiers/bulk/route.ts', 'create', 180, 0, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),
('CUST-005', 'lib/pricing/engine.ts', 'modify', 140, 15, 'retroactive-cust-005', NOW() - INTERVAL '70 days', true),

-- CUST-006: Customer Discount Conflict Resolution
('CUST-006', 'app/settings/page.tsx', 'modify', 120, 15, 'retroactive-cust-006', NOW() - INTERVAL '65 days', true),
('CUST-006', 'components/settings/discount-strategy.tsx', 'create', 280, 0, 'retroactive-cust-006', NOW() - INTERVAL '65 days', true),
('CUST-006', 'lib/pricing/engine.ts', 'modify', 180, 20, 'retroactive-cust-006', NOW() - INTERVAL '65 days', true);

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
('CUST-001', 'retroactive-cust-001', 'feat: implement customer discount wizard and API', 'Development Team', NOW() - INTERVAL '90 days', 9, true),
('CUST-002', 'retroactive-cust-002', 'feat: add bulk customer assignment functionality', 'Development Team', NOW() - INTERVAL '85 days', 3, true),
('CUST-003', 'retroactive-cust-003', 'feat: add customer discount assignment views', 'Development Team', NOW() - INTERVAL '80 days', 4, true),
('CUST-004', 'retroactive-cust-004', 'feat: add customer discount analytics dashboard', 'Development Team', NOW() - INTERVAL '75 days', 3, true),
('CUST-005', 'retroactive-cust-005', 'feat: implement customer tier management system', 'Development Team', NOW() - INTERVAL '70 days', 6, true),
('CUST-006', 'retroactive-cust-006', 'feat: add discount conflict resolution strategies', 'Development Team', NOW() - INTERVAL '65 days', 3, true);

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
WHERE us.epic = 'Customer Discounts';

-- Verification
SELECT 
  'Customer Discounts Code Linking Summary:' as info,
  COUNT(DISTINCT user_story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_added) as total_lines_added,
  SUM(lines_removed) as total_lines_removed
FROM code_change_log
WHERE user_story_id LIKE 'CUST-%';

SELECT 
  us.id,
  us.title,
  us.files_modified,
  us.lines_added,
  us.lines_removed,
  us.git_commits
FROM user_stories us
WHERE us.epic = 'Customer Discounts'
ORDER BY us.id;
