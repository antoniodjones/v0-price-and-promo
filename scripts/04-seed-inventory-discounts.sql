-- Seed inventory discounts with automated rules
INSERT INTO inventory_discounts (id, name, type, trigger_value, discount_type, discount_value, scope, scope_value, status, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '30-Day Expiration Auto Discount', 'expiration', 30, 'percentage', 20.0, 'all', NULL, 'active', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440002', 'Low THC Flower Discount', 'thc', 15, 'percentage', 10.0, 'category', 'Flower', 'active', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440003', 'Premium Brand 14-Day Expiration', 'expiration', 14, 'percentage', 30.0, 'brand', 'Premium Cannabis Co', 'active', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440004', 'Holiday Concentrates THC Boost', 'thc', 70, 'fixed', 15.0, 'category', 'Concentrates', 'scheduled', NOW(), NOW()),
('880e8400-e29b-41d4-a716-446655440005', '7-Day Emergency Clearance', 'expiration', 7, 'percentage', 50.0, 'all', NULL, 'active', NOW(), NOW());
