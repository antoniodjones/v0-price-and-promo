-- Seed Products for GTI Cannabis Dispensary (Version 6 - Complete Schema)
-- 45 realistic cannabis products across categories
-- Includes SKU, batch_id, and all compliance fields

-- Clear existing products (if any)
TRUNCATE TABLE products CASCADE;

-- Flower Products (15 products)
INSERT INTO products (id, sku, name, brand, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, weight_grams, batch_id, status, expiration_date, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'FLW-001', 'Blue Dream 3.5g', 'Rhythm', 'Flower', 'Hybrid', 45.00, 22.50, 150, 22.5, 0.5, 'Hybrid', 3.5, 'BTH-2025-001', 'active', '2025-09-01', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-002', 'Sour Diesel 3.5g', 'Dogwalkers', 'Flower', 'Sativa', 48.00, 24.00, 120, 24.0, 0.3, 'Sativa', 3.5, 'BTH-2025-002', 'active', '2025-09-15', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-003', 'OG Kush 3.5g', 'Rhythm', 'Flower', 'Indica', 50.00, 25.00, 100, 26.8, 0.4, 'Indica', 3.5, 'BTH-2025-003', 'active', '2025-08-20', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-004', 'Gelato 3.5g', 'Cookies', 'Flower', 'Hybrid', 55.00, 27.50, 90, 28.5, 0.2, 'Hybrid', 3.5, 'BTH-2025-004', 'active', '2025-09-10', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-005', 'Wedding Cake 7g', 'Rhythm', 'Flower', 'Indica', 90.00, 45.00, 75, 25.0, 0.6, 'Indica', 7.0, 'BTH-2025-005', 'active', '2025-08-25', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-006', 'Purple Punch 7g', 'Dogwalkers', 'Flower', 'Indica', 80.00, 40.00, 80, 23.8, 0.5, 'Indica', 7.0, 'BTH-2025-006', 'active', '2025-09-05', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-007', 'Jack Herer 3.5g', 'Rhythm', 'Flower', 'Sativa', 46.00, 23.00, 110, 21.5, 0.4, 'Sativa', 3.5, 'BTH-2025-007', 'active', '2025-09-12', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-008', 'Granddaddy Purple 3.5g', 'Cookies', 'Flower', 'Indica', 52.00, 26.00, 95, 27.2, 0.3, 'Indica', 3.5, 'BTH-2025-008', 'active', '2025-08-30', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-009', 'Strawberry Cough 3.5g', 'Rhythm', 'Flower', 'Sativa', 47.00, 23.50, 105, 22.8, 0.6, 'Sativa', 3.5, 'BTH-2025-009', 'active', '2025-09-08', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-010', 'Northern Lights 7g', 'Dogwalkers', 'Flower', 'Indica', 82.00, 41.00, 70, 24.5, 0.5, 'Indica', 7.0, 'BTH-2025-010', 'active', '2025-08-28', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-011', 'Green Crack 3.5g', 'Rhythm', 'Flower', 'Sativa', 44.00, 22.00, 130, 21.0, 0.4, 'Sativa', 3.5, 'BTH-2025-011', 'active', '2025-09-18', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-012', 'Zkittlez 3.5g', 'Cookies', 'Flower', 'Indica', 53.00, 26.50, 85, 26.5, 0.3, 'Indica', 3.5, 'BTH-2025-012', 'active', '2025-09-02', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-013', 'Durban Poison 3.5g', 'Rhythm', 'Flower', 'Sativa', 45.00, 22.50, 115, 22.0, 0.5, 'Sativa', 3.5, 'BTH-2025-013', 'active', '2025-09-14', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-014', 'Bubba Kush 7g', 'Dogwalkers', 'Flower', 'Indica', 85.00, 42.50, 65, 25.5, 0.4, 'Indica', 7.0, 'BTH-2025-014', 'active', '2025-08-22', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-015', 'Pineapple Express 3.5g', 'Rhythm', 'Flower', 'Hybrid', 49.00, 24.50, 100, 23.5, 0.6, 'Hybrid', 3.5, 'BTH-2025-015', 'active', '2025-09-06', NOW(), NOW());

-- Vape Products (12 products)
INSERT INTO products (id, sku, name, brand, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, weight_grams, batch_id, status, expiration_date, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'VAP-001', 'Blue Dream Cartridge 0.5g', 'Rhythm', 'Vape', 'Cartridge', 35.00, 17.50, 200, 85.0, 1.0, 'Hybrid', 0.5, 'BTH-2025-101', 'active', '2026-03-01', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-002', 'Sour Diesel Cartridge 0.5g', 'Dogwalkers', 'Vape', 'Cartridge', 38.00, 19.00, 180, 87.5, 0.8, 'Sativa', 0.5, 'BTH-2025-102', 'active', '2026-03-15', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-003', 'OG Kush Cartridge 1g', 'Rhythm', 'Vape', 'Cartridge', 60.00, 30.00, 150, 86.0, 1.2, 'Indica', 1.0, 'BTH-2025-103', 'active', '2026-02-20', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-004', 'Gelato Cartridge 0.5g', 'Cookies', 'Vape', 'Cartridge', 40.00, 20.00, 160, 88.0, 0.9, 'Hybrid', 0.5, 'BTH-2025-104', 'active', '2026-03-10', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-005', 'Wedding Cake Disposable 0.3g', 'Rhythm', 'Vape', 'Disposable', 25.00, 12.50, 220, 82.0, 1.5, 'Indica', 0.3, 'BTH-2025-105', 'active', '2026-02-25', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-006', 'Purple Punch Disposable 0.3g', 'Dogwalkers', 'Vape', 'Disposable', 28.00, 14.00, 200, 83.5, 1.3, 'Indica', 0.3, 'BTH-2025-106', 'active', '2026-03-05', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-007', 'Jack Herer Cartridge 0.5g', 'Rhythm', 'Vape', 'Cartridge', 36.00, 18.00, 190, 84.5, 1.0, 'Sativa', 0.5, 'BTH-2025-107', 'active', '2026-03-12', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-008', 'Granddaddy Purple Cartridge 1g', 'Cookies', 'Vape', 'Cartridge', 65.00, 32.50, 140, 87.0, 1.1, 'Indica', 1.0, 'BTH-2025-108', 'active', '2026-02-28', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-009', 'Strawberry Cough Disposable 0.3g', 'Rhythm', 'Vape', 'Disposable', 26.00, 13.00, 210, 81.5, 1.4, 'Sativa', 0.3, 'BTH-2025-109', 'active', '2026-03-08', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-010', 'Northern Lights Cartridge 0.5g', 'Dogwalkers', 'Vape', 'Cartridge', 37.00, 18.50, 175, 85.5, 1.0, 'Indica', 0.5, 'BTH-2025-110', 'active', '2026-02-22', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-011', 'Green Crack Disposable 0.3g', 'Rhythm', 'Vape', 'Disposable', 27.00, 13.50, 205, 82.5, 1.2, 'Sativa', 0.3, 'BTH-2025-111', 'active', '2026-03-18', NOW(), NOW()),
  (gen_random_uuid(), 'VAP-012', 'Zkittlez Cartridge 0.5g', 'Cookies', 'Vape', 'Cartridge', 39.00, 19.50, 165, 86.5, 0.9, 'Indica', 0.5, 'BTH-2025-112', 'active', '2026-03-02', NOW(), NOW());

-- Edible Products (10 products)
INSERT INTO products (id, sku, name, brand, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, weight_grams, batch_id, status, expiration_date, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'EDI-001', 'Watermelon Gummies 10pk', 'Incredibles', 'Edible', 'Gummies', 25.00, 12.50, 180, 10.0, 0.0, NULL, 100.0, 'BTH-2025-201', 'active', '2025-12-01', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-002', 'Blueberry Gummies 10pk', 'Mindys', 'Edible', 'Gummies', 28.00, 14.00, 160, 10.0, 0.0, NULL, 100.0, 'BTH-2025-202', 'active', '2025-12-15', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-003', 'Chocolate Bar 100mg', 'Incredibles', 'Edible', 'Chocolate', 20.00, 10.00, 200, 10.0, 0.0, NULL, 50.0, 'BTH-2025-203', 'active', '2026-01-20', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-004', 'Peanut Butter Chocolate 100mg', 'Mindys', 'Edible', 'Chocolate', 22.00, 11.00, 175, 10.0, 0.0, NULL, 50.0, 'BTH-2025-204', 'active', '2026-01-10', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-005', 'Mango Gummies 20pk', 'Incredibles', 'Edible', 'Gummies', 45.00, 22.50, 140, 10.0, 0.0, NULL, 200.0, 'BTH-2025-205', 'active', '2025-11-25', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-006', 'Strawberry Gummies 10pk', 'Mindys', 'Edible', 'Gummies', 26.00, 13.00, 170, 10.0, 0.0, NULL, 100.0, 'BTH-2025-206', 'active', '2025-12-05', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-007', 'Dark Chocolate Bar 100mg', 'Incredibles', 'Edible', 'Chocolate', 21.00, 10.50, 190, 10.0, 0.0, NULL, 50.0, 'BTH-2025-207', 'active', '2026-01-12', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-008', 'Caramel Chocolate 100mg', 'Mindys', 'Edible', 'Chocolate', 23.00, 11.50, 165, 10.0, 0.0, NULL, 50.0, 'BTH-2025-208', 'active', '2026-01-08', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-009', 'Mixed Berry Gummies 10pk', 'Incredibles', 'Edible', 'Gummies', 27.00, 13.50, 155, 10.0, 0.0, NULL, 100.0, 'BTH-2025-209', 'active', '2025-12-18', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-010', 'Mint Chocolate Bar 100mg', 'Mindys', 'Edible', 'Chocolate', 24.00, 12.00, 180, 10.0, 0.0, NULL, 50.0, 'BTH-2025-210', 'active', '2026-01-15', NOW(), NOW());

-- Concentrate Products (8 products)
INSERT INTO products (id, sku, name, brand, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, weight_grams, batch_id, status, expiration_date, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'CON-001', 'Blue Dream Live Resin 1g', 'Rhythm', 'Concentrate', 'Live Resin', 60.00, 30.00, 80, 82.0, 0.5, 'Hybrid', 1.0, 'BTH-2025-301', 'active', '2026-06-01', NOW(), NOW()),
  (gen_random_uuid(), 'CON-002', 'OG Kush Shatter 1g', 'Dogwalkers', 'Concentrate', 'Shatter', 55.00, 27.50, 90, 85.0, 0.3, 'Indica', 1.0, 'BTH-2025-302', 'active', '2026-06-15', NOW(), NOW()),
  (gen_random_uuid(), 'CON-003', 'Gelato Wax 1g', 'Cookies', 'Concentrate', 'Wax', 58.00, 29.00, 75, 83.5, 0.4, 'Hybrid', 1.0, 'BTH-2025-303', 'active', '2026-05-20', NOW(), NOW()),
  (gen_random_uuid(), 'CON-004', 'Wedding Cake Budder 1g', 'Rhythm', 'Concentrate', 'Budder', 62.00, 31.00, 70, 84.0, 0.6, 'Indica', 1.0, 'BTH-2025-304', 'active', '2026-06-10', NOW(), NOW()),
  (gen_random_uuid(), 'CON-005', 'Sour Diesel Crumble 1g', 'Dogwalkers', 'Concentrate', 'Crumble', 56.00, 28.00, 85, 81.5, 0.5, 'Sativa', 1.0, 'BTH-2025-305', 'active', '2026-05-25', NOW(), NOW()),
  (gen_random_uuid(), 'CON-006', 'Purple Punch Live Resin 1g', 'Rhythm', 'Concentrate', 'Live Resin', 65.00, 32.50, 65, 86.0, 0.4, 'Indica', 1.0, 'BTH-2025-306', 'active', '2026-06-05', NOW(), NOW()),
  (gen_random_uuid(), 'CON-007', 'Jack Herer Shatter 1g', 'Cookies', 'Concentrate', 'Shatter', 57.00, 28.50, 80, 84.5, 0.3, 'Sativa', 1.0, 'BTH-2025-307', 'active', '2026-06-12', NOW(), NOW()),
  (gen_random_uuid(), 'CON-008', 'Zkittlez Wax 1g', 'Rhythm', 'Concentrate', 'Wax', 59.00, 29.50, 75, 83.0, 0.5, 'Indica', 1.0, 'BTH-2025-308', 'active', '2026-05-28', NOW(), NOW());
