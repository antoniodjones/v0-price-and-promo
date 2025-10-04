-- Script to add 7 deduplication tasks and remove Phase IDs from epic names
-- Run this script to update the task planning database

-- Step 1: Update all existing epic names to remove "Phase X:" prefixes
UPDATE user_stories SET epic = 'Advanced Features' WHERE epic LIKE 'Phase 9:%';
UPDATE user_stories SET epic = 'Testing & Management' WHERE epic LIKE 'Phase 4: Testing%';
UPDATE user_stories SET epic = 'Database & Core APIs' WHERE epic LIKE 'Phase 1: Database%';
UPDATE user_stories SET epic = 'Wizard UI Enhancement' WHERE epic LIKE 'Phase 2: Wizard%';
UPDATE user_stories SET epic = 'Pricing Engine Integration' WHERE epic LIKE 'Phase 3: Pricing Engine Integration%';
UPDATE user_stories SET epic = 'Foundation' WHERE epic LIKE 'Phase 0: Foundation%';
UPDATE user_stories SET epic = 'Atomic Design' WHERE epic LIKE 'Phase 1: Atomic Design%';
UPDATE user_stories SET epic = 'Layout' WHERE epic LIKE 'Phase 2: Layout%';
UPDATE user_stories SET epic = 'Authentication' WHERE epic LIKE 'Phase 3: Authentication%';
UPDATE user_stories SET epic = 'Pricing Engine' WHERE epic LIKE 'Phase 4: Pricing Engine%';
UPDATE user_stories SET epic = 'Discounts' WHERE epic LIKE 'Phase 5: Discounts%';
UPDATE user_stories SET epic = 'Analytics' WHERE epic LIKE 'Phase 6: Analytics%';
UPDATE user_stories SET epic = 'Admin' WHERE epic LIKE 'Phase 7: Admin%';
UPDATE user_stories SET epic = 'System Optimization' WHERE epic LIKE 'Phase 8: Advanced%';

-- Step 2: Insert 7 deduplication tasks
-- Updated to use only columns that exist in user_stories table
INSERT INTO user_stories (
  id, title, description, status, priority, story_points, 
  tasks, dependencies, labels, epic, acceptance_criteria,
  created_by, updated_by
)
VALUES
('dedupe-001', 'Consolidate Wizard Components', 'Merge duplicate wizard implementations (customer-discount-wizard, bundle-deal-wizard, promotion-wizard) into a single reusable wizard framework', 'To Do', 'High', 8, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Single wizard framework created", "All wizards migrated", "Tests passing"]', 'system', 'system'),

('dedupe-002', 'Unify Discount Management Pages', 'Consolidate customer-discounts, inventory-discounts, and discount-rules pages into a single unified discount management interface', 'To Do', 'High', 8, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Unified interface created", "All discount types supported", "Feature parity maintained"]', 'system', 'system'),

('dedupe-003', 'Merge Promotion Systems', 'Consolidate promotions page, promo-codes page, and promotion-detection into a single promotion management system', 'To Do', 'High', 8, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Single promotion system created", "All features consolidated", "No functionality lost"]', 'system', 'system'),

('dedupe-004', 'Consolidate Analytics Dashboards', 'Merge analytics page, advanced-analytics-dashboard, and real-time-analytics-dashboard into a unified analytics platform', 'To Do', 'Medium', 5, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Unified analytics platform created", "All metrics available", "Performance maintained"]', 'system', 'system'),

('dedupe-005', 'Unify Pricing Interfaces', 'Consolidate pricing page, market-pricing page, and pricing-rules page into a single pricing management interface', 'To Do', 'Medium', 5, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Single pricing interface created", "All pricing features accessible", "User experience improved"]', 'system', 'system'),

('dedupe-006', 'Merge Product Management', 'Consolidate products page and product/[id] page into a unified product management system with list and detail views', 'To Do', 'Low', 3, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Unified product system created", "List and detail views integrated", "Navigation improved"]', 'system', 'system'),

('dedupe-007', 'Consolidate Customer Management', 'Merge customers/tiers page and tier-management pages into a single customer and tier management interface', 'To Do', 'Medium', 10, '[]', '[]', '["Build", "Refactoring"]', 'Dedupe Features', '["Single customer management interface", "Tier management integrated", "Bulk operations supported"]', 'system', 'system');

-- Step 3: Verify the changes
SELECT 'Total tasks after update:' as info, COUNT(*) as count FROM user_stories
UNION ALL
SELECT 'Dedupe tasks:' as info, COUNT(*) as count FROM user_stories WHERE epic = 'Dedupe Features'
UNION ALL
SELECT 'Total story points:' as info, SUM(story_points) as count FROM user_stories;
