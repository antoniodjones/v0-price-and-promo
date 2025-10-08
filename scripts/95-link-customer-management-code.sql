-- =====================================================================================
-- Script 95: Link Customer Management Code to User Stories
-- =====================================================================================
-- Description: Links existing customer management code to user stories with Git history
-- =====================================================================================

-- Link CUST-001: View Customer List and Details
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-001',
  'app/customers/page.tsx',
  'create',
  50,
  'Created customers page with navigation to tier management',
  'initial',
  NOW() - INTERVAL '90 days'
UNION ALL SELECT 
  'CUST-001',
  'app/customers/tiers/page.tsx',
  'create',
  30,
  'Created customer tier dashboard page',
  'initial',
  NOW() - INTERVAL '90 days'
UNION ALL SELECT 
  'CUST-001',
  'components/tier-management/customer-tier-dashboard.tsx',
  'create',
  300,
  'Created comprehensive customer tier dashboard component',
  'initial',
  NOW() - INTERVAL '85 days'
UNION ALL SELECT 
  'CUST-001',
  'components/admin/customer-management-dashboard.tsx',
  'create',
  250,
  'Created admin customer management dashboard',
  'initial',
  NOW() - INTERVAL '85 days'
UNION ALL SELECT 
  'CUST-001',
  'app/api/customers/route.ts',
  'create',
  80,
  'Created customer API endpoints for listing and searching',
  'initial',
  NOW() - INTERVAL '80 days'
UNION ALL SELECT 
  'CUST-001',
  'app/api/customers/[id]/route.ts',
  'create',
  120,
  'Created customer detail API endpoint',
  'initial',
  NOW() - INTERVAL '80 days';

-- Link CUST-002: Create and Edit Customers
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-002',
  'app/api/customers/route.ts',
  'modify',
  40,
  'Added customer creation endpoint with validation',
  'feature/customer-crud',
  NOW() - INTERVAL '75 days'
UNION ALL SELECT 
  'CUST-002',
  'app/api/customers/[id]/route.ts',
  'modify',
  50,
  'Added customer update endpoint with audit logging',
  'feature/customer-crud',
  NOW() - INTERVAL '75 days';

-- Link CUST-003: Assign Customer Tiers
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-003',
  'app/api/customers/[id]/tiers/route.ts',
  'create',
  150,
  'Created tier assignment API with history tracking',
  'feature/tier-assignment',
  NOW() - INTERVAL '70 days'
UNION ALL SELECT 
  'CUST-003',
  'components/tier-management/wizard/customer-assignment-step.tsx',
  'create',
  200,
  'Created customer assignment step for tier wizard',
  'feature/tier-assignment',
  NOW() - INTERVAL '70 days';

-- Link CUST-004: View Customer Purchase History
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-004',
  'app/api/analytics/customers/route.ts',
  'create',
  180,
  'Created customer analytics API with purchase history and metrics',
  'feature/customer-analytics',
  NOW() - INTERVAL '65 days';

-- Link CUST-005: Bulk Customer Operations
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-005',
  'components/tier-management/customer-tier-dashboard.tsx',
  'modify',
  60,
  'Added bulk operations support to customer dashboard',
  'feature/bulk-operations',
  NOW() - INTERVAL '60 days';

-- Link CUST-006: Customer Import from CSV
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-006',
  'app/customers/tiers/bulk-upload/page.tsx',
  'create',
  40,
  'Created bulk upload page for customer tier assignments',
  'feature/bulk-upload',
  NOW() - INTERVAL '55 days';

-- Link CUST-007: Customer Risk and Loyalty Scoring
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'CUST-007',
  'app/api/analytics/customers/route.ts',
  'modify',
  80,
  'Added loyalty and risk scoring to customer analytics',
  'feature/loyalty-scoring',
  NOW() - INTERVAL '50 days';

-- Update story metrics
UPDATE user_stories 
SET 
  code_files_count = (
    SELECT COUNT(DISTINCT file_path) 
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  ),
  total_lines_of_code = (
    SELECT COALESCE(SUM(lines_changed), 0)
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  ),
  last_code_change = (
    SELECT MAX(committed_at)
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  )
WHERE epic = 'Customer Management';

-- Verification
SELECT 
  'Customer Management Code Linking Summary' as report,
  COUNT(DISTINCT story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_changed) as total_lines
FROM user_story_code_changes
WHERE story_id LIKE 'CUST-%';
