-- Seed products table with realistic cannabis products
INSERT INTO products (id, name, sku, brand, category, price, cost, thc_percentage, inventory_count, batch_id, expiration_date, created_at, updated_at) VALUES
-- Flower Products
('550e8400-e29b-41d4-a716-446655440001', 'Premium Blue Dream - 1oz', 'FLOWER-001', 'Premium Cannabis Co', 'Flower', 240.00, 120.00, 22.5, 45, 'BATCH-2024-001', '2025-02-15', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'OG Kush - 1oz', 'FLOWER-002', 'Premium Cannabis Co', 'Flower', 260.00, 130.00, 24.8, 32, 'BATCH-2024-002', '2025-03-01', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Sour Diesel - 1oz', 'FLOWER-003', 'Green Valley Farms', 'Flower', 220.00, 110.00, 21.2, 28, 'BATCH-2024-003', '2025-01-30', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'White Widow - 1oz', 'FLOWER-004', 'Mountain High', 'Flower', 250.00, 125.00, 23.1, 38, 'BATCH-2024-004', '2025-02-28', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Girl Scout Cookies - 1oz', 'FLOWER-005', 'Craft Cannabis', 'Flower', 280.00, 140.00, 26.3, 22, 'BATCH-2024-005', '2025-03-15', NOW(), NOW()),

-- Edibles
('550e8400-e29b-41d4-a716-446655440006', 'Incredibles Gummies - 500mg', 'EDIBLE-001', 'Incredibles', 'Edibles', 60.00, 30.00, 0.0, 120, 'BATCH-2024-006', '2025-06-01', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Chocolate Bar - 100mg', 'EDIBLE-002', 'Sweet Leaf', 'Edibles', 25.00, 12.50, 0.0, 85, 'BATCH-2024-007', '2025-05-15', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Fruit Chews - 200mg', 'EDIBLE-003', 'Wyld', 'Edibles', 35.00, 17.50, 0.0, 95, 'BATCH-2024-008', '2025-04-30', NOW(), NOW()),

-- Concentrates
('550e8400-e29b-41d4-a716-446655440009', 'Live Resin - Blue Dream', 'CONC-001', 'Extract Labs', 'Concentrates', 80.00, 40.00, 78.5, 25, 'BATCH-2024-009', '2025-12-31', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'Shatter - OG Kush', 'CONC-002', 'Premium Extracts', 'Concentrates', 70.00, 35.00, 82.1, 18, 'BATCH-2024-010', '2025-11-30', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'Rosin - Sour Diesel', 'CONC-003', 'Solventless Co', 'Concentrates', 90.00, 45.00, 75.8, 15, 'BATCH-2024-011', '2025-10-15', NOW(), NOW()),

-- Vapes
('550e8400-e29b-41d4-a716-446655440012', 'Blue Dream Cartridge', 'VAPE-001', 'Dogwalkers', 'Vapes', 45.00, 22.50, 85.2, 65, 'BATCH-2024-012', '2025-08-31', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'OG Kush Cartridge', 'VAPE-002', 'Dogwalkers', 'Vapes', 45.00, 22.50, 87.4, 48, 'BATCH-2024-013', '2025-09-15', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'Sativa Blend Cartridge', 'VAPE-003', 'Pure Vape', 'Vapes', 50.00, 25.00, 83.6, 72, 'BATCH-2024-014', '2025-07-30', NOW(), NOW());
