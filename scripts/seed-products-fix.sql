-- Seed products table with test data
-- First, clear existing data to avoid conflicts
DELETE FROM products;

-- Insert sample cannabis products
INSERT INTO products (
  id,
  name,
  sku,
  category,
  brand,
  thc_percentage,
  price,
  cost,
  expiration_date,
  batch_id,
  inventory_count,
  created_at,
  updated_at
) VALUES
-- Flower Products
(gen_random_uuid(), 'Premium OG Kush', 'FL-OGK-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-31', 'BATCH-001', 150, NOW(), NOW()),
(gen_random_uuid(), 'Blue Dream', 'FL-BD-002', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-12-31', 'BATCH-002', 200, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel', 'FL-SD-003', 'Flower', 'Dogwalkers', 26.2, 48.00, 28.80, '2024-12-31', 'BATCH-003', 120, NOW(), NOW()),
(gen_random_uuid(), 'Wedding Cake', 'FL-WC-004', 'Flower', 'Rythm', 25.1, 46.00, 27.60, '2024-12-31', 'BATCH-004', 180, NOW(), NOW()),
(gen_random_uuid(), 'Gelato', 'FL-GEL-005', 'Flower', 'Dogwalkers', 23.7, 44.00, 26.40, '2024-12-31', 'BATCH-005', 160, NOW(), NOW()),

-- Vape Cartridges
(gen_random_uuid(), 'Blue Dream Cartridge', 'VP-BD-001', 'Vapes', 'Dogwalkers', 85.2, 65.00, 39.00, '2025-06-30', 'CART-001', 80, NOW(), NOW()),
(gen_random_uuid(), 'OG Kush Cartridge', 'VP-OGK-002', 'Vapes', 'Rythm', 87.5, 68.00, 40.80, '2025-06-30', 'CART-002', 95, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel Cartridge', 'VP-SD-003', 'Vapes', 'Dogwalkers', 84.8, 66.00, 39.60, '2025-06-30', 'CART-003', 70, NOW(), NOW()),
(gen_random_uuid(), 'Wedding Cake Cartridge', 'VP-WC-004', 'Vapes', 'Rythm', 86.3, 67.00, 40.20, '2025-06-30', 'CART-004', 85, NOW(), NOW()),

-- Edibles
(gen_random_uuid(), 'Mixed Berry Gummies', 'ED-MBG-001', 'Edibles', 'Sweet Relief', 10.0, 25.00, 15.00, '2025-03-31', 'GUMMY-001', 300, NOW(), NOW()),
(gen_random_uuid(), 'Chocolate Bar', 'ED-CB-002', 'Edibles', 'Sweet Relief', 10.0, 30.00, 18.00, '2025-03-31', 'CHOC-001', 250, NOW(), NOW()),
(gen_random_uuid(), 'Peach Rings', 'ED-PR-003', 'Edibles', 'Sweet Relief', 5.0, 20.00, 12.00, '2025-03-31', 'RING-001', 400, NOW(), NOW()),

-- Concentrates
(gen_random_uuid(), 'Live Resin - OG Kush', 'CN-LR-OGK-001', 'Concentrates', 'Rythm', 78.5, 80.00, 48.00, '2025-01-31', 'RESIN-001', 50, NOW(), NOW()),
(gen_random_uuid(), 'Shatter - Blue Dream', 'CN-SH-BD-002', 'Concentrates', 'Dogwalkers', 82.3, 75.00, 45.00, '2025-01-31', 'SHATTER-001', 60, NOW(), NOW()),
(gen_random_uuid(), 'Rosin - Wedding Cake', 'CN-RS-WC-003', 'Concentrates', 'Rythm', 76.8, 85.00, 51.00, '2025-01-31', 'ROSIN-001', 40, NOW(), NOW());

-- Verify the insert
SELECT COUNT(*) as total_products FROM products;
SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category;
