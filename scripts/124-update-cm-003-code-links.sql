-- Script 124: Update CM-003 Customer Detail Page with Code Links
-- Links the existing customer detail page story to actual code files

BEGIN;

-- Update CM-003 with actual code file links and implementation details
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  -- Get the ID of CM-003
  SELECT id INTO story_record_id
  FROM user_stories
  WHERE story_id = 'CM-003';

  IF story_record_id IS NULL THEN
    RAISE EXCEPTION 'Story CM-003 not found. Please run script 108 first.';
  END IF;

  -- Update with linked files and technical details
  UPDATE user_stories
  SET 
    related_files = ARRAY[
      'app/customers/[id]/page.tsx',
      'app/api/customers/[id]/promotions/route.ts',
      'app/api/customers/[id]/tiers/route.ts'
    ],
    related_components = ARRAY[
      'UnifiedCard',
      'Tabs',
      'Badge',
      'UnifiedTable',
      'Recharts'
    ],
    technical_notes = '### Technical Implementation
- **Page Route**: /customers/[id]
- **API Endpoints**:
  - GET /api/customers/[id]/promotions - Fetch customer promotions and tier assignments
  - GET /api/customers/[id]/tiers - Fetch customer tier history
- **Data Sources**:
  - customers table for customer info
  - customer_tier_assignments for tier data
  - discount_rules for promotion rules
  - discount_rule_tiers for tier-specific discounts
  - promotion_tracking for purchase history
- **Features**:
  - Customer overview with key metrics
  - Active promotions and tier assignments
  - Purchase history with charts
  - Tier assignment history
- **Bug Fix**: Fixed tier assignments query to properly join through discount_rules table
- **Visualization**: Recharts for purchase trends
- **Performance**: SWR for data fetching and caching

### Files
- app/customers/[id]/page.tsx - Main customer detail page with tabs
- app/api/customers/[id]/promotions/route.ts - API for promotions and tiers
- app/api/customers/[id]/tiers/route.ts - API for tier history',
    metadata = jsonb_build_object(
      'api_endpoints', jsonb_build_array(
        'GET /api/customers/[id]/promotions - Fetch customer promotions and tier assignments',
        'GET /api/customers/[id]/tiers - Fetch customer tier assignment history'
      ),
      'database_tables', jsonb_build_array(
        'customers',
        'customer_tier_assignments',
        'discount_rules',
        'discount_rule_tiers',
        'promotion_tracking'
      ),
      'bug_fixes', jsonb_build_array(
        'Fixed PGRST200 error: Corrected tier assignments query to properly nest discount_rule_tiers within discount_rules relationship'
      )
    ),
    updated_at = NOW()
  WHERE id = story_record_id;

  -- Create code change log entries
  INSERT INTO code_change_log (
    task_id, file_path, change_type, component_name,
    lines_added, lines_removed, changed_at, author, author_email,
    commit_message, branch_name, metadata
  )
  VALUES
  (
    story_record_id::text,
    'app/customers/[id]/page.tsx',
    'modify',
    'CustomerDetailPage',
    50,
    10,
    NOW(),
    'v0',
    'v0@vercel.com',
    'fix: update customer detail page data fetching',
    'main',
    '{"story_id": "CM-003", "epic": "Customer Management", "type": "bug_fix"}'::jsonb
  ),
  (
    story_record_id::text,
    'app/api/customers/[id]/promotions/route.ts',
    'modify',
    'CustomerPromotionsAPI',
    30,
    15,
    NOW(),
    'v0',
    'v0@vercel.com',
    'fix: correct tier assignments query to nest discount_rule_tiers',
    'main',
    '{"story_id": "CM-003", "epic": "Customer Management", "type": "bug_fix"}'::jsonb
  );

  RAISE NOTICE 'Updated story CM-003 (ID: %) with code links', story_record_id;
END $$;

COMMIT;

-- Verification
SELECT 
  'CM-003 Updated with Code Links' as info,
  id,
  story_id,
  title,
  status,
  array_length(related_files, 1) as files_linked
FROM user_stories
WHERE story_id = 'CM-003';
