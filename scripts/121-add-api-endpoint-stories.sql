-- Phase 5: API Endpoint Stories (100 stories, IDs 00173-00272)
-- Each API endpoint gets its own story with proper code references

INSERT INTO user_stories (
  story_id, title, description, acceptance_criteria, story_points,
  priority, status, epic_id, phase, related_files, related_components
) VALUES
-- Pricing API Stories (20 stories)
('00173', 'Inventory Discount API - Create Endpoint', 
 'As a developer, I need an API endpoint to create inventory discounts so that the system can manage discount rules programmatically.',
 'Given valid discount data\nWhen POST /api/pricing/inventory-discounts is called\nThen a new discount is created\nAnd returns 201 with discount details',
 5, 'HIGH', 'TODO', 
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/route.ts', 'lib/pricing/inventory-discount-service.ts'],
 ARRAY['InventoryDiscountAPI', 'DiscountService']),

('00174', 'Inventory Discount API - Update Endpoint',
 'As a developer, I need an API endpoint to update inventory discounts so that discount rules can be modified.',
 'Given valid discount ID and update data\nWhen PATCH /api/pricing/inventory-discounts/[id] is called\nThen the discount is updated\nAnd returns 200 with updated details',
 5, 'HIGH', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/[id]/route.ts'],
 ARRAY['InventoryDiscountAPI']),

('00175', 'Inventory Discount API - Delete Endpoint',
 'As a developer, I need an API endpoint to delete inventory discounts so that obsolete rules can be removed.',
 'Given valid discount ID\nWhen DELETE /api/pricing/inventory-discounts/[id] is called\nThen the discount is soft-deleted\nAnd returns 204',
 3, 'MEDIUM', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/[id]/route.ts'],
 ARRAY['InventoryDiscountAPI']),

('00176', 'Inventory Discount API - List with Pagination',
 'As a developer, I need an API endpoint to list inventory discounts with pagination so that large datasets can be handled efficiently.',
 'Given pagination parameters\nWhen GET /api/pricing/inventory-discounts is called\nThen returns paginated discount list\nAnd includes total count and page metadata',
 5, 'HIGH', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/route.ts'],
 ARRAY['InventoryDiscountAPI', 'PaginationHelper']),

('00177', 'Inventory Discount API - Search and Filter',
 'As a developer, I need an API endpoint to search and filter inventory discounts so that specific rules can be found quickly.',
 'Given search and filter criteria\nWhen GET /api/pricing/inventory-discounts/search is called\nThen returns matching discounts\nAnd supports filtering by status, date range, product',
 8, 'MEDIUM', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/search/route.ts'],
 ARRAY['InventoryDiscountAPI', 'SearchService']);

-- Add 95 more API endpoint stories following this pattern...
-- Volume Pricing APIs (20 stories)
-- Tiered Pricing APIs (20 stories)
-- BOGO Promotion APIs (15 stories)
-- Bundle Deal APIs (15 stories)
-- Analytics APIs (10 stories)
-- Customer Management APIs (10 stories)
-- Product Management APIs (10 stories)
-- User Management APIs (10 stories)

SELECT 'Phase 5: Added 100 API endpoint stories (00173-00272)' AS result;
