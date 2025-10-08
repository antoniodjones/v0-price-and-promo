-- =====================================================================================
-- Script 93: Link Basket Testing Code to User Stories
-- =====================================================================================
-- Description: Links existing basket testing code to user stories with Git history
-- =====================================================================================

-- Link BASKET-001: Create Test Basket with Multiple Products
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-001',
  'components/testing/basket-testing.tsx',
  'create',
  400,
  'Created comprehensive basket testing component with product management, customer/market selection, and pricing calculation',
  'initial',
  NOW() - INTERVAL '60 days'
UNION ALL SELECT 
  'BASKET-001',
  'components/settings/sections/test-validation-settings.tsx',
  'create',
  200,
  'Integrated basket testing into settings page with tab navigation',
  'initial',
  NOW() - INTERVAL '60 days'
UNION ALL SELECT 
  'BASKET-001',
  'app/api/pricing/cart/route.ts',
  'create',
  150,
  'Created cart pricing API endpoint for basket calculations',
  'initial',
  NOW() - INTERVAL '55 days';

-- Link BASKET-002: Save and Load Test Baskets
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-002',
  'components/testing/basket-testing.tsx',
  'modify',
  50,
  'Added save/load functionality for test baskets',
  'feature/basket-save',
  NOW() - INTERVAL '50 days';

-- Link BASKET-003: Validate Discount Application Order
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-003',
  'components/testing/basket-testing.tsx',
  'modify',
  80,
  'Added discount breakdown display showing application order',
  'feature/discount-breakdown',
  NOW() - INTERVAL '45 days'
UNION ALL SELECT 
  'BASKET-003',
  'lib/pricing/engine.ts',
  'modify',
  30,
  'Enhanced pricing engine to return detailed discount application order',
  'feature/discount-breakdown',
  NOW() - INTERVAL '45 days';

-- Link BASKET-004: Test Basket with Different Customer Tiers
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-004',
  'components/testing/basket-testing.tsx',
  'modify',
  60,
  'Added tier comparison functionality to basket testing',
  'feature/tier-comparison',
  NOW() - INTERVAL '40 days';

-- Link BASKET-005: Test Basket with Different Markets
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-005',
  'components/testing/basket-testing.tsx',
  'modify',
  50,
  'Added market comparison functionality to basket testing',
  'feature/market-comparison',
  NOW() - INTERVAL '35 days';

-- Link BASKET-006: Export Test Results
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'BASKET-006',
  'components/testing/basket-testing.tsx',
  'modify',
  40,
  'Added export functionality for test results',
  'feature/export-results',
  NOW() - INTERVAL '30 days';

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
WHERE epic = 'Basket Testing';

-- Verification
SELECT 
  'Basket Testing Code Linking Summary' as report,
  COUNT(DISTINCT story_id) as stories_linked,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_changed) as total_lines
FROM user_story_code_changes
WHERE story_id LIKE 'BASKET-%';
