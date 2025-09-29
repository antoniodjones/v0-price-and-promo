-- Insert test products into the products table
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
(gen_random_uuid(), 'Premium OG Kush', 'FLW-OGK-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-15', 'BATCH-001', 150, NOW(), NOW()),
(gen_random_uuid(), 'Blue Dream', 'FLW-BLD-002', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-30', 'BATCH-002', 200, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel', 'FLW-SRD-003', 'Flower', 'Rythm', 26.2, 48.00, 28.80, '2025-01-20', 'BATCH-003', 120, NOW(), NOW()),
(gen_random_uuid(), 'Wedding Cake', 'FLW-WDC-004', 'Flower', 'Dogwalkers', 28.1, 52.00, 31.20, '2024-12-10', 'BATCH-004', 80, NOW(), NOW()),
(gen_random_uuid(), 'Gelato', 'FLW-GEL-005', 'Flower', 'Dogwalkers', 25.7, 46.00, 27.60, '2025-02-05', 'BATCH-005', 175, NOW(), NOW()),

-- Vape Cartridges
(gen_random_uuid(), 'Blue Dream Cartridge', 'VPE-BLD-001', 'Vape', 'Dogwalkers', 85.2, 35.00, 21.00, '2025-03-15', 'BATCH-006', 300, NOW(), NOW()),
(gen_random_uuid(), 'OG Kush Cartridge', 'VPE-OGK-002', 'Vape', 'Rythm', 87.5, 38.00, 22.80, '2025-04-01', 'BATCH-007', 250, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel Cartridge', 'VPE-SRD-003', 'Vape', 'Rythm', 82.8, 36.00, 21.60, '2025-02-28', 'BATCH-008', 180, NOW(), NOW()),

-- Edibles
(gen_random_uuid(), 'Mixed Berry Gummies', 'EDI-MBG-001', 'Edibles', 'Sweet Relief', 10.0, 25.00, 15.00, '2025-06-30', 'BATCH-009', 400, NOW(), NOW()),
(gen_random_uuid(), 'Chocolate Brownies', 'EDI-CHB-002', 'Edibles', 'Sweet Relief', 10.0, 28.00, 16.80, '2025-05-15', 'BATCH-010', 200, NOW(), NOW()),

-- Concentrates
(gen_random_uuid(), 'Live Resin - OG Kush', 'CON-LRO-001', 'Concentrates', 'Rythm', 78.5, 65.00, 39.00, '2025-01-10', 'BATCH-011', 50, NOW(), NOW()),
(gen_random_uuid(), 'Shatter - Blue Dream', 'CON-SBD-002', 'Concentrates', 'Dogwalkers', 82.1, 60.00, 36.00, '2024-12-20', 'BATCH-012', 75, NOW(), NOW()),

-- Pre-rolls
(gen_random_uuid(), 'Pre-roll - Wedding Cake', 'PRE-WDC-001', 'Pre-rolls', 'Rythm', 24.8, 12.00, 7.20, '2024-11-25', 'BATCH-013', 500, NOW(), NOW()),
(gen_random_uuid(), 'Pre-roll - Gelato', 'PRE-GEL-002', 'Pre-rolls', 'Dogwalkers', 26.3, 14.00, 8.40, '2024-12-05', 'BATCH-014', 350, NOW(), NOW()),

-- Tinctures
(gen_random_uuid(), 'CBD Tincture 1:1', 'TIN-CBD-001', 'Tinctures', 'Sweet Relief', 15.0, 45.00, 27.00, '2025-08-30', 'BATCH-015', 100, NOW(), NOW()),
(gen_random_uuid(), 'THC Tincture', 'TIN-THC-002', 'Tinctures', 'Sweet Relief', 20.0, 50.00, 30.00, '2025-07-15', 'BATCH-016', 80, NOW(), NOW());

-- Insert test customers
INSERT INTO customers (
  id,
  name,
  email,
  tier,
  market,
  status,
  total_purchases,
  created_at,
  updated_at
) VALUES 
(gen_random_uuid(), 'Green Valley Dispensary', 'orders@greenvalley.com', 'A', 'California', 'active', 125600.00, NOW(), NOW()),
(gen_random_uuid(), 'Mountain High Cannabis', 'purchasing@mountainhigh.com', 'B', 'Colorado', 'active', 89400.00, NOW(), NOW()),
(gen_random_uuid(), 'Urban Leaf', 'buyer@urbanleaf.com', 'A', 'California', 'active', 156800.00, NOW(), NOW()),
(gen_random_uuid(), 'Desert Bloom', 'orders@desertbloom.com', 'C', 'Nevada', 'active', 45200.00, NOW(), NOW()),
(gen_random_uuid(), 'Pacific Coast Cannabis', 'purchasing@pacificcoast.com', 'B', 'California', 'active', 78900.00, NOW(), NOW());
