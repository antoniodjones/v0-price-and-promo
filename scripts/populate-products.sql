-- Simple script to populate products table with test data
-- This will resolve the 500 error by adding products to the empty table

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
  (gen_random_uuid(), 'Premium OG Kush', 'OGK-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-31', 'BATCH-001', 150, NOW(), NOW()),
  (gen_random_uuid(), 'Blue Dream Cartridge', 'BDC-002', 'Vape', 'Dogwalkers', 78.2, 65.00, 39.00, '2025-06-30', 'BATCH-002', 85, NOW(), NOW()),
  (gen_random_uuid(), 'Sour Diesel', 'SD-003', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-15', 'BATCH-003', 120, NOW(), NOW()),
  (gen_random_uuid(), 'Strawberry Gummies', 'SG-004', 'Edibles', 'Sweet Relief', 10.0, 25.00, 15.00, '2025-03-01', 'BATCH-004', 200, NOW(), NOW()),
  (gen_random_uuid(), 'Wedding Cake', 'WC-005', 'Flower', 'Rythm', 26.1, 48.00, 28.80, '2024-10-30', 'BATCH-005', 95, NOW(), NOW()),
  (gen_random_uuid(), 'Gelato Cartridge', 'GC-006', 'Vape', 'Dogwalkers', 82.5, 68.00, 40.80, '2025-05-15', 'BATCH-006', 75, NOW(), NOW()),
  (gen_random_uuid(), 'Purple Punch', 'PP-007', 'Flower', 'Rythm', 23.7, 44.00, 26.40, '2024-12-15', 'BATCH-007', 110, NOW(), NOW()),
  (gen_random_uuid(), 'Chocolate Brownies', 'CB-008', 'Edibles', 'Sweet Relief', 15.0, 30.00, 18.00, '2025-02-28', 'BATCH-008', 180, NOW(), NOW()),
  (gen_random_uuid(), 'GSC Pre-Roll', 'GSC-009', 'Pre-rolls', 'Rythm', 21.3, 12.00, 7.20, '2024-11-30', 'BATCH-009', 300, NOW(), NOW()),
  (gen_random_uuid(), 'Live Resin Concentrate', 'LRC-010', 'Concentrates', 'Premium Extract Co', 89.2, 85.00, 51.00, '2025-04-30', 'BATCH-010', 45, NOW(), NOW());
