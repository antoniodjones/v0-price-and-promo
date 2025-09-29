-- Comprehensive seed script for GTI Pricing Engine test data
-- This script populates all tables with realistic test data

-- Clear existing data (in correct order to handle foreign keys)
DELETE FROM customer_discount_assignments;
DELETE FROM bundle_deal_products;
DELETE FROM customer_discounts;
DELETE FROM inventory_discounts;
DELETE FROM bogo_promotions;
DELETE FROM bundle_deals;
DELETE FROM customers;
DELETE FROM products;

-- Seed Products (Cannabis dispensary products)
INSERT INTO products (id, name, sku, category, brand, thc_percentage, price, cost, expiration_date, batch_id, inventory_count, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Premium OG Kush', 'FLOWER-OG-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-31', 'BATCH-001', 150, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Blue Dream Cartridge', 'VAPE-BD-002', 'Vape', 'Dogwalkers', 89.2, 65.00, 39.00, '2025-06-30', 'BATCH-002', 75, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Blue Dream', 'FLOWER-BD-003', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-30', 'BATCH-003', 200, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Sour Diesel Gummies', 'EDIBLE-SD-004', 'Edibles', 'Kiva', 5.0, 25.00, 15.00, '2025-03-15', 'BATCH-004', 300, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Wedding Cake', 'FLOWER-WC-005', 'Flower', 'Cookies', 26.1, 50.00, 30.00, '2024-10-31', 'BATCH-005', 120, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Live Resin Concentrate', 'CONC-LR-006', 'Concentrates', 'Raw Garden', 78.5, 80.00, 48.00, '2025-01-31', 'BATCH-006', 50, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Sour Diesel', 'FLOWER-SD-007', 'Flower', 'Rythm', 23.7, 44.00, 26.40, '2024-12-15', 'BATCH-007', 180, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'OG Kush Cartridge', 'VAPE-OG-008', 'Vape', 'Dogwalkers', 87.3, 62.00, 37.20, '2025-05-31', 'BATCH-008', 90, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'Chocolate Edibles', 'EDIBLE-CH-009', 'Edibles', 'Kiva', 10.0, 30.00, 18.00, '2025-02-28', 'BATCH-009', 250, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Purple Haze', 'FLOWER-PH-010', 'Flower', 'Cookies', 25.3, 48.00, 28.80, '2024-11-15', 'BATCH-010', 140, NOW(), NOW());

-- Seed Customers (Dispensary customers with different tiers)
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@email.com', 'A', 'california', 'active', 2500.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@email.com', 'A', 'california', 'active', 3200.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Mike Davis', 'mike.davis@email.com', 'B', 'california', 'active', 1800.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Emily Wilson', 'emily.wilson@email.com', 'B', 'california', 'active', 1500.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'David Brown', 'david.brown@email.com', 'C', 'california', 'active', 800.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'Lisa Garcia', 'lisa.garcia@email.com', 'C', 'california', 'active', 650.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440007', 'Robert Miller', 'robert.miller@email.com', 'A', 'nevada', 'active', 2800.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440008', 'Jennifer Taylor', 'jennifer.taylor@email.com', 'B', 'nevada', 'active', 1200.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440009', 'Christopher Anderson', 'chris.anderson@email.com', 'C', 'nevada', 'active', 450.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440010', 'Amanda Martinez', 'amanda.martinez@email.com', 'A', 'california', 'active', 3500.00, NOW(), NOW());

-- Seed Customer Discounts
INSERT INTO customer_discounts (id, name, type, value, level, target, customer_tiers, markets, start_date, end_date, status, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'VIP Customer 15% Off', 'percentage', 15.0, 'customer', 'John Smith', ARRAY['A'], ARRAY['california'], '2024-01-01', '2024-12-31', 'active', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440002', 'Gold Tier 10% Discount', 'percentage', 10.0, 'tier', 'A', ARRAY['A'], ARRAY['california', 'nevada'], '2024-01-01', '2024-12-31', 'active', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440003', 'California Market 5% Off', 'percentage', 5.0, 'market', 'california', ARRAY['A', 'B', 'C'], ARRAY['california'], '2024-06-01', '2024-12-31', 'active', NOW(), NOW()),
('770e8400-e29b-41d4-a716-446655440004', 'Silver Tier Fixed $5 Off', 'fixed', 5.0, 'tier', 'B', ARRAY['B'], ARRAY['california', 'nevada'], '2024-01-01', '2024-12-31', 'active', NOW(), NOW());

-- Seed Customer Discount Assignments (link specific customers to discounts)
INSERT INTO customer_discount_assignments (id, discount_id, customer_id, created_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', NOW()),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', NOW()),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440010', NOW());

-- Seed Inventory Discounts
INSERT INTO inventory_discounts (id, name, type, trigger_value, discount_type, discount_value, scope, scope_value, status, created_at, updated_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Expiring Soon 20% Off', 'expiration', 30, 'percentage', 20.0, 'all', '', 'active', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', 'Low THC 15% Discount', 'thc', 15, 'percentage', 15.0, 'category', 'Flower', 'active', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', 'Rythm Brand Clearance', 'expiration', 45, 'fixed', 10.0, 'brand', 'Rythm', 'active', NOW(), NOW());

-- Seed BOGO Promotions
INSERT INTO bogo_promotions (id, name, type, trigger_level, trigger_value, reward_type, reward_value, start_date, end_date, status, created_at, updated_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Buy 2 Get 1 Free Flower', 'traditional', 'category', 'Flower', 'free', 1, '2024-07-01', '2024-12-31', 'active', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440002', 'Vape BOGO 50% Off', 'percentage', 'category', 'Vape', 'percentage', 50, '2024-08-01', '2024-11-30', 'active', NOW(), NOW()),
('aa0e8400-e29b-41d4-a716-446655440003', 'Edibles Buy 1 Get $10 Off', 'fixed', 'category', 'Edibles', 'fixed', 10, '2024-09-01', '2024-10-31', 'active', NOW(), NOW());

-- Seed Bundle Deals
INSERT INTO bundle_deals (id, name, type, discount_type, discount_value, min_quantity, start_date, end_date, status, created_at, updated_at) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Flower & Vape Combo', 'mix_match', 'percentage', 15.0, 2, '2024-06-01', '2024-12-31', 'active', NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440002', 'Starter Pack Bundle', 'fixed', 'fixed', 25.0, 3, '2024-07-01', '2024-12-31', 'active', NOW(), NOW()),
('bb0e8400-e29b-41d4-a716-446655440003', 'Premium Experience', 'tiered', 'percentage', 20.0, 4, '2024-08-01', '2024-11-30', 'active', NOW(), NOW());

-- Seed Bundle Deal Products (link products to bundles)
INSERT INTO bundle_deal_products (id, bundle_id, product_id, created_at) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW()),
('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW()),
('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', NOW()),
('cc0e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', NOW()),
('cc0e8400-e29b-41d4-a716-446655440005', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', NOW()),
('cc0e8400-e29b-41d4-a716-446655440006', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', NOW()),
('cc0e8400-e29b-41d4-a716-446655440007', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', NOW()),
('cc0e8400-e29b-41d4-a716-446655440008', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440009', NOW()),
('cc0e8400-e29b-41d4-a716-446655440009', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440010', NOW());

-- Verify data was inserted
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Customer Discounts', COUNT(*) FROM customer_discounts
UNION ALL
SELECT 'Customer Discount Assignments', COUNT(*) FROM customer_discount_assignments
UNION ALL
SELECT 'Inventory Discounts', COUNT(*) FROM inventory_discounts
UNION ALL
SELECT 'BOGO Promotions', COUNT(*) FROM bogo_promotions
UNION ALL
SELECT 'Bundle Deals', COUNT(*) FROM bundle_deals
UNION ALL
SELECT 'Bundle Deal Products', COUNT(*) FROM bundle_deal_products;
