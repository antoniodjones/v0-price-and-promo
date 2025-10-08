-- ============================================================================
-- Link Inventory Discounts Code Changes to User Stories
-- ============================================================================

-- Insert code change records for inventory discount features
INSERT INTO code_change_log (
  task_id,
  file_path,
  component_name,
  change_type,
  commit_sha,
  commit_message,
  branch_name,
  author,
  author_email,
  changed_at,
  lines_added,
  lines_removed,
  metadata
) VALUES

-- INV-001: Create Expiration-Based Automatic Discount Rule
('INV-001', 'app/inventory-discounts/new/page.tsx', 'inventory-discounts-new-page', 'created', 'retroactive-inv-001', 'INV-001: Create inventory discount creation page', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 150, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'components/inventory-discounts/inventory-discount-wizard.tsx', 'inventory-discount-wizard', 'created', 'retroactive-inv-001', 'INV-001: Create inventory discount wizard', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 300, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx', 'discount-trigger-step', 'created', 'retroactive-inv-001', 'INV-001: Create discount trigger step', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 200, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'components/inventory-discounts/wizard-steps/discount-scope-step.tsx', 'discount-scope-step', 'created', 'retroactive-inv-001', 'INV-001: Create discount scope step', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 180, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'components/inventory-discounts/wizard-steps/discount-value-step.tsx', 'discount-value-step', 'created', 'retroactive-inv-001', 'INV-001: Create discount value step', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 150, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'app/api/discounts/inventory/route.ts', 'inventory-discounts-api', 'created', 'retroactive-inv-001', 'INV-001: Create inventory discounts API', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 250, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-001', 'lib/pricing/engine.ts', 'pricing-engine', 'modified', 'retroactive-inv-001', 'INV-001: Add expiration discount logic to pricing engine', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '60 days', 120, 20, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-002: Create THC Percentage-Based Automatic Discount Rule
('INV-002', 'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx', 'discount-trigger-step', 'modified', 'retroactive-inv-002', 'INV-002: Add THC percentage trigger option', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '58 days', 80, 10, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-002', 'lib/pricing/engine.ts', 'pricing-engine', 'modified', 'retroactive-inv-002', 'INV-002: Add THC percentage discount logic', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '58 days', 100, 15, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-003: Configure Multi-Level Inventory Discount Scope
('INV-003', 'components/inventory-discounts/wizard-steps/discount-scope-step.tsx', 'discount-scope-step', 'modified', 'retroactive-inv-003', 'INV-003: Add multi-level scope selection', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '56 days', 120, 30, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-003', 'lib/pricing/engine.ts', 'pricing-engine', 'modified', 'retroactive-inv-003', 'INV-003: Add scope filtering logic', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '56 days', 80, 10, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-004: Monitor Real-Time Inventory Discount Application
('INV-004', 'app/inventory-discounts/page.tsx', 'inventory-discounts-page', 'created', 'retroactive-inv-004', 'INV-004: Create inventory discounts list page', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '54 days', 200, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-004', 'components/inventory-discounts/inventory-monitoring.tsx', 'inventory-monitoring', 'created', 'retroactive-inv-004', 'INV-004: Create real-time monitoring component', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '54 days', 300, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-005: View Automated Discount History
('INV-005', 'components/inventory-discounts/discount-history.tsx', 'discount-history', 'created', 'retroactive-inv-005', 'INV-005: Create discount history component', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '52 days', 180, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-005', 'app/api/discounts/inventory/history/route.ts', 'inventory-history-api', 'created', 'retroactive-inv-005', 'INV-005: Create history API endpoint', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '52 days', 120, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-006: Set Up Expiration Date Monitoring Thresholds
('INV-006', 'components/inventory-discounts/wizard-steps/discount-value-step.tsx', 'discount-value-step', 'modified', 'retroactive-inv-006', 'INV-006: Add multi-tier threshold configuration', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '50 days', 100, 20, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-006', 'lib/pricing/engine.ts', 'pricing-engine', 'modified', 'retroactive-inv-006', 'INV-006: Add multi-tier evaluation logic', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '50 days', 90, 15, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-007: Manage THC Percentage Discount Triggers
('INV-007', 'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx', 'discount-trigger-step', 'modified', 'retroactive-inv-007', 'INV-007: Add above/below threshold conditions', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '48 days', 60, 10, '{"retroactive": true, "feature": "inventory_discounts"}'),

-- INV-008: Manage Inventory Discount Lifecycle
('INV-008', 'components/inventory-discounts/inventory-discounts-list.tsx', 'inventory-discounts-list', 'created', 'retroactive-inv-008', 'INV-008: Create discounts list component', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '46 days', 250, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-008', 'components/inventory-discounts/edit-discount-modal.tsx', 'edit-discount-modal', 'created', 'retroactive-inv-008', 'INV-008: Create edit modal', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '46 days', 200, 0, '{"retroactive": true, "feature": "inventory_discounts"}'),
('INV-008', 'app/api/discounts/inventory/[id]/route.ts', 'inventory-discount-detail-api', 'created', 'retroactive-inv-008', 'INV-008: Create update/delete API endpoints', 'main', 'Antonio Jones', 'antonio@example.com', NOW() - INTERVAL '46 days', 180, 0, '{"retroactive": true, "feature": "inventory_discounts"}')

ON CONFLICT DO NOTHING;

-- Update user_stories with aggregated metrics
UPDATE user_stories
SET 
  related_files = COALESCE((
    SELECT ARRAY_AGG(DISTINCT file_path)
    FROM code_change_log
    WHERE task_id = user_stories.id
  ), '{}'),
  git_commits = COALESCE((
    SELECT ARRAY_AGG(DISTINCT commit_sha)
    FROM code_change_log
    WHERE task_id = user_stories.id
  ), '{}'),
  lines_added = COALESCE((
    SELECT SUM(lines_added)
    FROM code_change_log
    WHERE task_id = user_stories.id
  ), 0),
  lines_removed = COALESCE((
    SELECT SUM(lines_removed)
    FROM code_change_log
    WHERE task_id = user_stories.id
  ), 0),
  files_modified = COALESCE((
    SELECT COUNT(DISTINCT file_path)
    FROM code_change_log
    WHERE task_id = user_stories.id
  ), 0),
  retroactive = true,
  git_branch = 'main'
WHERE epic = 'Inventory Discounts';

-- Verify the linkages
SELECT 
  'Inventory Discounts Code Linkage Summary:' as info;

SELECT 
  us.id as task_id,
  us.title,
  COUNT(ccl.id) as code_changes,
  SUM(ccl.lines_added) as total_added,
  SUM(ccl.lines_removed) as total_removed,
  COUNT(DISTINCT ccl.file_path) as files_modified
FROM user_stories us
LEFT JOIN code_change_log ccl ON us.id = ccl.task_id
WHERE us.epic = 'Inventory Discounts'
GROUP BY us.id, us.title
ORDER BY us.id;
