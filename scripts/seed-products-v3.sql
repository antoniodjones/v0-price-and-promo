-- Seed Products for GTI Cannabis Dispensary (Version 3 - Schema Corrected)
-- 45 realistic cannabis products across categories
-- Matches actual products table schema (no subcategory column)

-- Flower Products (15 products)
INSERT INTO products (id, sku, name, brand, category, price, cost, thc_percentage, inventory_count, batch_id, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'FLW-001', 'Blue Dream 3.5g', 'Rhythm', 'Flower', 45.00, 22.50, 22.5, 150, 'BTH-2025-001', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-002', 'Sour Diesel 3.5g', 'Dogwalkers', 'Flower', 48.00, 24.00, 24.2, 120, 'BTH-2025-002', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-003', 'OG Kush 3.5g', 'Rhythm', 'Flower', 50.00, 25.00, 26.8, 100, 'BTH-2025-003', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-004', 'Gelato 3.5g', 'Cookies', 'Flower', 55.00, 27.50, 28.5, 90, 'BTH-2025-004', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-005', 'Wedding Cake 7g', 'Rhythm', 'Flower', 85.00, 42.50, 25.3, 75, 'BTH-2025-005', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-006', 'Purple Punch 7g', 'Dogwalkers', 'Flower', 80.00, 40.00, 23.8, 80, 'BTH-2025-006', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-007', 'Jack Herer 3.5g', 'Rhythm', 'Flower', 46.00, 23.00, 21.5, 110, 'BTH-2025-007', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-008', 'Granddaddy Purple 3.5g', 'Cookies', 'Flower', 52.00, 26.00, 27.2, 95, 'BTH-2025-008', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-009', 'Strawberry Cough 3.5g', 'Rhythm', 'Flower', 47.00, 23.50, 22.8, 105, 'BTH-2025-009', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-010', 'Northern Lights 7g', 'Dogwalkers', 'Flower', 82.00, 41.00, 24.5, 70, 'BTH-2025-010', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-011', 'Pineapple Express 3.5g', 'Rhythm', 'Flower', 49.00, 24.50, 23.9, 115, 'BTH-2025-011', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-012', 'Zkittlez 3.5g', 'Cookies', 'Flower', 54.00, 27.00, 26.5, 88, 'BTH-2025-012', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-013', 'Gorilla Glue #4 7g', 'Rhythm', 'Flower', 88.00, 44.00, 28.2, 65, 'BTH-2025-013', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-014', 'White Widow 3.5g', 'Dogwalkers', 'Flower', 45.00, 22.50, 21.8, 125, 'BTH-2025-014', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLW-015', 'Sunset Sherbet 3.5g', 'Cookies', 'Flower', 53.00, 26.50, 25.7, 92, 'BTH-2025-015', 'active', NOW(), NOW());

-- Vape Products (12 products)
INSERT INTO products (id, sku, name, brand, category, price, cost, thc_percentage, inventory_count, batch_id, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'VPE-001', 'Blue Dream Vape Cart 0.5g', 'Rhythm', 'Vapes', 35.00, 17.50, 85.5, 200, 'BTH-2025-016', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-002', 'Sour Diesel Vape Cart 0.5g', 'Dogwalkers', 'Vapes', 38.00, 19.00, 87.2, 180, 'BTH-2025-017', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-003', 'OG Kush Vape Cart 1g', 'Rhythm', 'Vapes', 65.00, 32.50, 86.8, 150, 'BTH-2025-018', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-004', 'Gelato Vape Cart 0.5g', 'Cookies', 'Vapes', 40.00, 20.00, 88.5, 175, 'BTH-2025-019', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-005', 'Wedding Cake Vape Cart 1g', 'Rhythm', 'Vapes', 68.00, 34.00, 87.3, 140, 'BTH-2025-020', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-006', 'Purple Punch Disposable Vape', 'Dogwalkers', 'Vapes', 30.00, 15.00, 82.8, 220, 'BTH-2025-021', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-007', 'Jack Herer Vape Cart 0.5g', 'Rhythm', 'Vapes', 36.00, 18.00, 84.5, 190, 'BTH-2025-022', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-008', 'Granddaddy Purple Disposable Vape', 'Cookies', 'Vapes', 32.00, 16.00, 83.2, 210, 'BTH-2025-023', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-009', 'Strawberry Cough Vape Cart 0.5g', 'Rhythm', 'Vapes', 37.00, 18.50, 85.8, 185, 'BTH-2025-024', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-010', 'Northern Lights Vape Cart 1g', 'Dogwalkers', 'Vapes', 66.00, 33.00, 86.5, 145, 'BTH-2025-025', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-011', 'Pineapple Express Disposable Vape', 'Rhythm', 'Vapes', 31.00, 15.50, 83.9, 215, 'BTH-2025-026', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'VPE-012', 'Zkittlez Vape Cart 0.5g', 'Cookies', 'Vapes', 39.00, 19.50, 87.5, 170, 'BTH-2025-027', 'active', NOW(), NOW());

-- Edibles (10 products)
INSERT INTO products (id, sku, name, brand, category, price, cost, thc_percentage, inventory_count, batch_id, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'EDI-001', 'Blueberry Gummies 10pk', 'Incredibles', 'Edibles', 25.00, 12.50, 10.0, 300, 'BTH-2025-028', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-002', 'Watermelon Gummies 10pk', 'Incredibles', 'Edibles', 25.00, 12.50, 10.0, 280, 'BTH-2025-029', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-003', 'Chocolate Bar 100mg', 'Mindys', 'Edibles', 20.00, 10.00, 10.0, 250, 'BTH-2025-030', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-004', 'Mango Gummies 20pk', 'Incredibles', 'Edibles', 45.00, 22.50, 20.0, 200, 'BTH-2025-031', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-005', 'Peanut Butter Chocolate Bar 100mg', 'Mindys', 'Edibles', 22.00, 11.00, 10.0, 240, 'BTH-2025-032', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-006', 'Strawberry Lemonade Gummies 10pk', 'Incredibles', 'Edibles', 26.00, 13.00, 10.0, 290, 'BTH-2025-033', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-007', 'Dark Chocolate Bar 100mg', 'Mindys', 'Edibles', 21.00, 10.50, 10.0, 260, 'BTH-2025-034', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-008', 'Mixed Berry Gummies 10pk', 'Incredibles', 'Edibles', 25.00, 12.50, 10.0, 285, 'BTH-2025-035', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-009', 'Caramel Chocolate Bar 100mg', 'Mindys', 'Edibles', 23.00, 11.50, 10.0, 235, 'BTH-2025-036', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'EDI-010', 'Peach Gummies 20pk', 'Incredibles', 'Edibles', 46.00, 23.00, 20.0, 195, 'BTH-2025-037', 'active', NOW(), NOW());

-- Concentrates (8 products)
INSERT INTO products (id, sku, name, brand, category, price, cost, thc_percentage, inventory_count, batch_id, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'CON-001', 'Blue Dream Live Resin 1g', 'Rhythm', 'Concentrates', 60.00, 30.00, 82.5, 80, 'BTH-2025-038', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-002', 'Sour Diesel Shatter 1g', 'Dogwalkers', 'Concentrates', 55.00, 27.50, 85.2, 75, 'BTH-2025-039', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-003', 'OG Kush Wax 1g', 'Rhythm', 'Concentrates', 58.00, 29.00, 83.8, 70, 'BTH-2025-040', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-004', 'Gelato Live Rosin 1g', 'Cookies', 'Concentrates', 75.00, 37.50, 88.5, 50, 'BTH-2025-041', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-005', 'Wedding Cake Diamonds 1g', 'Rhythm', 'Concentrates', 70.00, 35.00, 90.3, 55, 'BTH-2025-042', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-006', 'Purple Punch Budder 1g', 'Dogwalkers', 'Concentrates', 57.00, 28.50, 84.8, 68, 'BTH-2025-043', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-007', 'Jack Herer Live Resin 1g', 'Rhythm', 'Concentrates', 62.00, 31.00, 83.5, 72, 'BTH-2025-044', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'CON-008', 'Zkittlez Sauce 1g', 'Cookies', 'Concentrates', 68.00, 34.00, 87.2, 60, 'BTH-2025-045', 'active', NOW(), NOW());
