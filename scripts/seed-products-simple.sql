-- Simple seed script to populate products table with test data
-- This will resolve the 500 error by providing products for the API

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
(gen_random_uuid(), 'Blue Dream', 'FL-BD-002', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-30', 'BATCH-002', 200, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel', 'FL-SD-003', 'Flower', 'Dogwalkers', 26.2, 48.00, 28.80, '2025-01-15', 'BATCH-003', 120, NOW(), NOW()),

-- Vape Products  
(gen_random_uuid(), 'Blue Dream Cartridge', 'VP-BD-001', 'Vape', 'Dogwalkers', 85.4, 65.00, 39.00, '2025-03-01', 'BATCH-004', 80, NOW(), NOW()),
(gen_random_uuid(), 'OG Kush Cartridge', 'VP-OGK-002', 'Vape', 'Rythm', 88.2, 68.00, 40.80, '2025-02-28', 'BATCH-005', 95, NOW(), NOW()),

-- Edibles
(gen_random_uuid(), 'Mixed Berry Gummies', 'ED-MBG-001', 'Edibles', 'Sweet Relief', 10.0, 25.00, 15.00, '2025-06-01', 'BATCH-006', 300, NOW(), NOW()),
(gen_random_uuid(), 'Chocolate Bar', 'ED-CB-002', 'Edibles', 'Sweet Relief', 100.0, 35.00, 21.00, '2025-05-15', 'BATCH-007', 180, NOW(), NOW()),

-- Pre-rolls
(gen_random_uuid(), 'Sativa Blend Pre-roll', 'PR-SB-001', 'Pre-rolls', 'Dogwalkers', 21.5, 15.00, 9.00, '2024-10-31', 'BATCH-008', 250, NOW(), NOW()),
(gen_random_uuid(), 'Indica Blend Pre-roll', 'PR-IB-002', 'Pre-rolls', 'Rythm', 23.8, 16.00, 9.60, '2024-11-15', 'BATCH-009', 220, NOW(), NOW()),

-- Concentrates
(gen_random_uuid(), 'Live Resin Wax', 'CN-LRW-001', 'Concentrates', 'Premium Extract Co', 92.5, 85.00, 51.00, '2025-04-01', 'BATCH-010', 45, NOW(), NOW());
