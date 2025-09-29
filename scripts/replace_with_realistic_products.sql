-- Replace mock data with realistic cannabis product catalog
-- First, clear existing products to avoid duplicates
DELETE FROM products;

-- Reset the sequence if needed
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Insert comprehensive realistic product catalog
INSERT INTO products (
  id,
  name,
  sku,
  category,
  brand,
  thc_percentage,
  cbd_percentage,
  price,
  cost,
  expiration_date,
  batch_id,
  inventory_count,
  created_at,
  updated_at
) VALUES 
-- Premium Flower Products
(gen_random_uuid(), 'Premium OG Kush', 'FLW-OGK-001', 'Flower', 'Rythm', 24.5, 0.8, 45.00, 27.00, '2024-12-15', 'BATCH-001', 150, NOW(), NOW()),
(gen_random_uuid(), 'Blue Dream', 'FLW-BLD-002', 'Flower', 'Rythm', 22.8, 1.2, 42.00, 25.20, '2024-11-30', 'BATCH-002', 200, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel', 'FLW-SRD-003', 'Flower', 'Rythm', 26.2, 0.5, 48.00, 28.80, '2025-01-20', 'BATCH-003', 120, NOW(), NOW()),
(gen_random_uuid(), 'Wedding Cake', 'FLW-WDC-004', 'Flower', 'Dogwalkers', 28.1, 0.9, 52.00, 31.20, '2024-12-10', 'BATCH-004', 80, NOW(), NOW()),
(gen_random_uuid(), 'Gelato', 'FLW-GEL-005', 'Flower', 'Dogwalkers', 25.7, 1.1, 46.00, 27.60, '2025-02-05', 'BATCH-005', 175, NOW(), NOW()),
(gen_random_uuid(), 'Purple Haze', 'FLW-PRP-006', 'Flower', 'Rythm', 23.4, 0.7, 44.00, 26.40, '2025-01-15', 'BATCH-006', 90, NOW(), NOW()),
(gen_random_uuid(), 'Girl Scout Cookies', 'FLW-GSC-007', 'Flower', 'Dogwalkers', 27.8, 0.6, 50.00, 30.00, '2024-12-25', 'BATCH-007', 110, NOW(), NOW()),

-- Vape Cartridges
(gen_random_uuid(), 'Blue Dream Cartridge 0.5g', 'VPE-BLD-001', 'Vape', 'Dogwalkers', 85.2, 2.1, 35.00, 21.00, '2025-03-15', 'BATCH-008', 300, NOW(), NOW()),
(gen_random_uuid(), 'OG Kush Cartridge 0.5g', 'VPE-OGK-002', 'Vape', 'Rythm', 87.5, 1.8, 38.00, 22.80, '2025-04-01', 'BATCH-009', 250, NOW(), NOW()),
(gen_random_uuid(), 'Sour Diesel Cartridge 0.5g', 'VPE-SRD-003', 'Vape', 'Rythm', 82.8, 2.3, 36.00, 21.60, '2025-02-28', 'BATCH-010', 180, NOW(), NOW()),
(gen_random_uuid(), 'Wedding Cake Cartridge 1g', 'VPE-WDC-004', 'Vape', 'Dogwalkers', 89.1, 1.5, 65.00, 39.00, '2025-03-20', 'BATCH-011', 150, NOW(), NOW()),
(gen_random_uuid(), 'Gelato Cartridge 0.5g', 'VPE-GEL-005', 'Vape', 'Rythm', 84.7, 2.0, 37.00, 22.20, '2025-04-10', 'BATCH-012', 220, NOW(), NOW()),

-- Edibles
(gen_random_uuid(), 'Mixed Berry Gummies 10mg', 'EDI-MBG-001', 'Edibles', 'Sweet Relief', 10.0, 0.0, 25.00, 15.00, '2025-06-30', 'BATCH-013', 400, NOW(), NOW()),
(gen_random_uuid(), 'Chocolate Brownies 5mg', 'EDI-CHB-002', 'Edibles', 'Sweet Relief', 5.0, 0.0, 28.00, 16.80, '2025-05-15', 'BATCH-014', 200, NOW(), NOW()),
(gen_random_uuid(), 'Watermelon Gummies 2.5mg', 'EDI-WMG-003', 'Edibles', 'Sweet Relief', 2.5, 2.5, 22.00, 13.20, '2025-07-01', 'BATCH-015', 350, NOW(), NOW()),
(gen_random_uuid(), 'Dark Chocolate Bar 100mg', 'EDI-DCB-004', 'Edibles', 'Sweet Relief', 100.0, 0.0, 45.00, 27.00, '2025-04-30', 'BATCH-016', 100, NOW(), NOW()),
(gen_random_uuid(), 'Peach Rings 5mg', 'EDI-PCR-005', 'Edibles', 'Sweet Relief', 5.0, 0.0, 24.00, 14.40, '2025-06-15', 'BATCH-017', 275, NOW(), NOW()),

-- Concentrates
(gen_random_uuid(), 'Live Resin - OG Kush 1g', 'CON-LRO-001', 'Concentrates', 'Rythm', 78.5, 1.2, 65.00, 39.00, '2025-01-10', 'BATCH-018', 50, NOW(), NOW()),
(gen_random_uuid(), 'Shatter - Blue Dream 1g', 'CON-SBD-002', 'Concentrates', 'Dogwalkers', 82.1, 0.8, 60.00, 36.00, '2024-12-20', 'BATCH-019', 75, NOW(), NOW()),
(gen_random_uuid(), 'Rosin - Wedding Cake 0.5g', 'CON-RWC-003', 'Concentrates', 'Rythm', 75.8, 1.5, 55.00, 33.00, '2025-02-01', 'BATCH-020', 40, NOW(), NOW()),
(gen_random_uuid(), 'Wax - Gelato 1g', 'CON-WGL-004', 'Concentrates', 'Dogwalkers', 79.3, 1.1, 58.00, 34.80, '2025-01-25', 'BATCH-021', 60, NOW(), NOW()),

-- Pre-rolls
(gen_random_uuid(), 'Pre-roll - Wedding Cake 1g', 'PRE-WDC-001', 'Pre-rolls', 'Rythm', 24.8, 0.9, 12.00, 7.20, '2024-11-25', 'BATCH-022', 500, NOW(), NOW()),
(gen_random_uuid(), 'Pre-roll - Gelato 1g', 'PRE-GEL-002', 'Pre-rolls', 'Dogwalkers', 26.3, 1.0, 14.00, 8.40, '2024-12-05', 'BATCH-023', 350, NOW(), NOW()),
(gen_random_uuid(), 'Pre-roll - Blue Dream 0.5g', 'PRE-BLD-003', 'Pre-rolls', 'Rythm', 22.8, 1.2, 8.00, 4.80, '2024-12-01', 'BATCH-024', 600, NOW(), NOW()),
(gen_random_uuid(), 'Pre-roll - Sour Diesel 1g', 'PRE-SRD-004', 'Pre-rolls', 'Dogwalkers', 26.2, 0.5, 13.00, 7.80, '2024-11-30', 'BATCH-025', 400, NOW(), NOW()),

-- Tinctures
(gen_random_uuid(), 'CBD Tincture 1:1 30ml', 'TIN-CBD-001', 'Tinctures', 'Sweet Relief', 15.0, 15.0, 45.00, 27.00, '2025-08-30', 'BATCH-026', 100, NOW(), NOW()),
(gen_random_uuid(), 'THC Tincture 30ml', 'TIN-THC-002', 'Tinctures', 'Sweet Relief', 20.0, 1.0, 50.00, 30.00, '2025-07-15', 'BATCH-027', 80, NOW(), NOW()),
(gen_random_uuid(), 'Sleep Tincture CBN 30ml', 'TIN-SLP-003', 'Tinctures', 'Sweet Relief', 5.0, 10.0, 55.00, 33.00, '2025-09-01', 'BATCH-028', 60, NOW(), NOW()),

-- Topicals
(gen_random_uuid(), 'Pain Relief Balm 2oz', 'TOP-PRB-001', 'Topicals', 'Sweet Relief', 0.0, 25.0, 35.00, 21.00, '2025-12-31', 'BATCH-029', 150, NOW(), NOW()),
(gen_random_uuid(), 'Muscle Rub 4oz', 'TOP-MSR-002', 'Topicals', 'Sweet Relief', 10.0, 15.0, 42.00, 25.20, '2025-11-30', 'BATCH-030', 120, NOW(), NOW()),

-- Accessories
(gen_random_uuid(), 'Glass Pipe - Spoon', 'ACC-GPS-001', 'Accessories', 'Glass Works', 0.0, 0.0, 25.00, 15.00, '2030-01-01', 'BATCH-031', 200, NOW(), NOW()),
(gen_random_uuid(), 'Rolling Papers - King Size', 'ACC-RPK-002', 'Accessories', 'RAW', 0.0, 0.0, 3.50, 2.10, '2030-01-01', 'BATCH-032', 1000, NOW(), NOW()),
(gen_random_uuid(), 'Grinder - 4 Piece', 'ACC-GR4-003', 'Accessories', 'Santa Cruz', 0.0, 0.0, 45.00, 27.00, '2030-01-01', 'BATCH-033', 75, NOW(), NOW());

-- Display current product count and sample
SELECT 
    COUNT(*) as total_products,
    COUNT(DISTINCT category) as categories,
    COUNT(DISTINCT brand) as brands
FROM products;

-- Show sample of products by category
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products 
GROUP BY category 
ORDER BY category;

-- Show first few products for verification
SELECT 
    name,
    sku,
    category,
    brand,
    price,
    inventory_count
FROM products 
ORDER BY category, name
LIMIT 15;
