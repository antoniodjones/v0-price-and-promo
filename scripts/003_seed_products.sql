-- Adding realistic cannabis product data for testing
INSERT INTO products (sku, name, category, brand, thc_percentage, cbd_percentage, price, cost, inventory_count, expiration_date, batch_id, created_at, updated_at) VALUES
-- Flower Products
('FL001', 'Blue Dream', 'Flower', 'Green Valley', 22.5, 0.8, 45.00, 25.00, 150, '2024-12-15', 'BV2024001', NOW(), NOW()),
('FL002', 'OG Kush', 'Flower', 'Premium Buds', 24.8, 0.5, 50.00, 28.00, 120, '2024-11-30', 'PB2024002', NOW(), NOW()),
('FL003', 'Sour Diesel', 'Flower', 'Green Valley', 21.2, 0.6, 42.00, 23.00, 200, '2025-01-10', 'GV2024003', NOW(), NOW()),
('FL004', 'Girl Scout Cookies', 'Flower', 'Craft Cannabis', 26.1, 0.4, 55.00, 32.00, 80, '2024-12-20', 'CC2024004', NOW(), NOW()),
('FL005', 'White Widow', 'Flower', 'Premium Buds', 23.7, 1.2, 48.00, 27.00, 110, '2025-01-05', 'PB2024005', NOW(), NOW()),

-- Edibles
('ED001', 'Strawberry Gummies 10mg', 'Edibles', 'Sweet Relief', 0.0, 0.0, 25.00, 12.00, 300, '2025-06-15', 'SR2024001', NOW(), NOW()),
('ED002', 'Chocolate Bar 100mg', 'Edibles', 'Canna Treats', 0.0, 0.0, 35.00, 18.00, 150, '2025-05-20', 'CT2024002', NOW(), NOW()),
('ED003', 'Peach Rings 5mg', 'Edibles', 'Sweet Relief', 0.0, 0.0, 20.00, 10.00, 250, '2025-07-01', 'SR2024003', NOW(), NOW()),
('ED004', 'Brownie Bites 25mg', 'Edibles', 'Baked Bliss', 0.0, 0.0, 30.00, 15.00, 100, '2025-04-30', 'BB2024004', NOW(), NOW()),

-- Concentrates
('CO001', 'Live Resin - Blue Dream', 'Concentrates', 'Extract Masters', 78.5, 2.1, 80.00, 45.00, 50, '2025-03-15', 'EM2024001', NOW(), NOW()),
('CO002', 'Shatter - OG Kush', 'Concentrates', 'Pure Extracts', 82.3, 1.8, 75.00, 42.00, 60, '2025-02-28', 'PE2024002', NOW(), NOW()),
('CO003', 'Rosin - Sour Diesel', 'Concentrates', 'Solventless Co', 76.8, 3.2, 90.00, 52.00, 35, '2025-04-10', 'SC2024003', NOW(), NOW()),

-- Vapes
('VP001', 'Sativa Blend Cart 1g', 'Vapes', 'Cloud Nine', 85.2, 1.5, 60.00, 35.00, 200, '2025-08-15', 'CN2024001', NOW(), NOW()),
('VP002', 'Indica Blend Cart 0.5g', 'Vapes', 'Vapor Works', 87.1, 2.0, 40.00, 22.00, 180, '2025-07-20', 'VW2024002', NOW(), NOW()),
('VP003', 'Hybrid Cart 1g', 'Vapes', 'Cloud Nine', 83.7, 1.8, 55.00, 32.00, 150, '2025-09-01', 'CN2024003', NOW(), NOW()),

-- Topicals
('TP001', 'Pain Relief Balm 200mg', 'Topicals', 'Healing Herbs', 0.0, 15.5, 45.00, 25.00, 75, '2026-01-15', 'HH2024001', NOW(), NOW()),
('TP002', 'Muscle Rub 500mg', 'Topicals', 'Therapeutic Touch', 0.0, 25.0, 65.00, 38.00, 50, '2025-12-20', 'TT2024002', NOW(), NOW()),

-- Accessories
('AC001', 'Glass Pipe - Spoon', 'Accessories', 'Glass Works', 0.0, 0.0, 25.00, 12.00, 100, NULL, 'GW2024001', NOW(), NOW()),
('AC002', 'Rolling Papers - King Size', 'Accessories', 'Paper Plus', 0.0, 0.0, 8.00, 4.00, 500, NULL, 'PP2024002', NOW(), NOW()),
('AC003', 'Grinder - 4 Piece', 'Accessories', 'Metal Masters', 0.0, 0.0, 35.00, 18.00, 80, NULL, 'MM2024003', NOW(), NOW());
