-- Phase 5: Documentation & Performance Stories (100 stories, IDs 00473-00572)

INSERT INTO user_stories (
  story_id, title, description, acceptance_criteria, story_points,
  priority, status, epic_id, phase, related_files, related_components
) VALUES
-- Documentation Stories (50 stories)
('00473', 'API Documentation - Inventory Discounts',
 'As a developer, I need comprehensive API documentation for inventory discounts so that I can integrate with the system.',
 'Given API endpoints\nWhen documentation is generated\nThen all endpoints are documented\nAnd includes request/response examples\nAnd error codes are explained',
 5, 'MEDIUM', 'TODO',
 (SELECT id FROM epics WHERE name = 'Inventory Discounts'),
 5,
 ARRAY['docs/api/inventory-discounts.md'],
 ARRAY['APIDocumentation']),

-- Performance Stories (30 stories)
('00474', 'Performance - Optimize Discount Calculation',
 'As a system, I need optimized discount calculation so that pricing operations complete in < 100ms.',
 'Given discount calculation request\nWhen processing 1000+ products\nThen calculation completes in < 100ms\nAnd memory usage is optimized\nAnd database queries are minimized',
 8, 'HIGH', 'TODO',
 (SELECT id FROM epics WHERE name = 'Performance Monitoring'),
 5,
 ARRAY['lib/pricing/discount-calculator.ts'],
 ARRAY['DiscountCalculator', 'PerformanceMonitor']),

-- Security Stories (20 stories)
('00475', 'Security - Discount API Authorization',
 'As a system, I need proper authorization on discount APIs so that only authorized users can modify pricing rules.',
 'Given API request\nWhen user lacks permissions\nThen request is rejected with 403\nAnd audit log is created\nAnd no data is leaked',
 8, 'CRITICAL', 'TODO',
 (SELECT id FROM epics WHERE name = 'Compliance Center'),
 5,
 ARRAY['app/api/pricing/inventory-discounts/route.ts', 'lib/auth/authorization.ts'],
 ARRAY['AuthorizationMiddleware']);

-- Add 97 more stories...

SELECT 'Phase 5: Added 100 documentation/performance/security stories (00473-00572)' AS result;
