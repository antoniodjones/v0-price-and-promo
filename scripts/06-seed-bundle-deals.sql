-- Seed bundle deals
INSERT INTO bundle_deals (id, name, type, discount_type, discount_value, min_quantity, status, start_date, end_date, created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Starter Pack Bundle', 'mixed', 'percentage', 15.0, 3, 'active', '2025-01-01', NULL, NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', 'Premium Flower Collection', 'category', 'fixed', 50.0, 5, 'active', '2025-01-01', '2025-12-31', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', 'Concentrate Connoisseur Pack', 'category', 'percentage', 20.0, 3, 'scheduled', '2025-11-01', '2025-12-31', NOW(), NOW());

-- Link products to bundle deals
INSERT INTO bundle_deal_products (id, bundle_id, product_id, created_at) VALUES
-- Starter Pack Bundle
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440012', NOW()),

-- Premium Flower Collection
('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('bb0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW()),
('bb0e8400-e29b-41d4-a716-446655440007', 'aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', NOW()),

-- Concentrate Connoisseur Pack
('bb0e8400-e29b-41d4-a716-446655440008', 'aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', NOW()),
('bb0e8400-e29b-41d4-a716-446655440009', 'aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', NOW()),
('bb0e8400-e29b-41d4-a716-446655440010', 'aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', NOW());
