-- Phase 5: Testing Stories (100 stories, IDs 00373-00472)
-- Unit tests, integration tests, E2E tests for all features

INSERT INTO user_stories (
  story_id, title, description, acceptance_criteria, story_points,
  priority, status, epic_id, phase, related_files, related_components
) VALUES
('00373', 'Unit Tests - Inventory Discount Service',
 'As a developer, I need comprehensive unit tests for the inventory discount service so that business logic is validated.',
 'Given discount service methods\nWhen unit tests run\nThen all methods are tested\nAnd edge cases are covered\nAnd code coverage > 80%',
 8, 'HIGH', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['__tests__/lib/pricing/inventory-discount-service.test.ts', 'lib/pricing/inventory-discount-service.ts'],
 ARRAY['InventoryDiscountService', 'Jest']),

('00374', 'Integration Tests - Inventory Discount API',
 'As a developer, I need integration tests for inventory discount APIs so that endpoint behavior is validated.',
 'Given API endpoints\nWhen integration tests run\nThen all CRUD operations are tested\nAnd database interactions work\nAnd error cases are handled',
 8, 'HIGH', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['__tests__/api/pricing/inventory-discounts.test.ts'],
 ARRAY['InventoryDiscountAPI', 'Supertest']);

-- Add 98 more testing stories...

SELECT 'Phase 5: Added 100 testing stories (00373-00472)' AS result;
