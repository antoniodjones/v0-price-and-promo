-- Basic product seeding script for GTI Pricing Engine
-- This script creates essential products for testing the pricing calculator

-- Insert basic cannabis products for testing
INSERT INTO products (
  name, 
  sku, 
  category, 
  brand, 
  thc_percentage, 
  price, 
  cost, 
  expiration_date, 
  batch_id,
  created_at,
  updated_at
) VALUES 
-- Flower products
('Premium OG Kush', 'PREM-OG-001', 'Flower', 'Premium Buds', 22.5, 45.00, 27.00, '2024-12-15', 'BATCH-001', NOW(), NOW()),
('Blue Dream', 'BLUE-DR-002', 'Flower', 'Green Valley', 18.2, 40.00, 24.00, '2024-11-30', 'BATCH-002', NOW(), NOW()),
('Sour Diesel', 'SOUR-DS-003', 'Flower', 'Premium Buds', 20.8, 42.00, 25.20, '2025-01-20', 'BATCH-003', NOW(), NOW()),

-- Vape products
('Blue Dream Cartridge', 'BLUE-CART-004', 'Vape', 'Dogwalkers', 85.0, 65.00, 39.00, '2025-03-15', 'BATCH-004', NOW(), NOW()),
('OG Kush Cartridge', 'OG-CART-005', 'Vape', 'Dogwalkers', 88.5, 70.00, 42.00, '2025-02-28', 'BATCH-005', NOW(), NOW()),

-- Edibles
('Gummy Bears 10mg', 'GUMMY-10-006', 'Edibles', 'Sweet Relief', 0.0, 25.00, 15.00, '2025-06-30', 'BATCH-006', NOW(), NOW()),
('Chocolate Bar 100mg', 'CHOC-100-007', 'Edibles', 'Sweet Relief', 0.0, 35.00, 21.00, '2025-05-15', 'BATCH-007', NOW(), NOW()),

-- Pre-rolls
('Pre-Roll OG Kush', 'PR-OG-008', 'Pre-rolls', 'Premium Buds', 21.0, 15.00, 9.00, '2024-10-30', 'BATCH-008', NOW(), NOW()),
('Pre-Roll Blue Dream', 'PR-BLUE-009', 'Pre-rolls', 'Green Valley', 17.5, 12.00, 7.20, '2024-11-15', 'BATCH-009', NOW(), NOW()),

-- Concentrates
('Live Resin - Sour D', 'LR-SOUR-010', 'Concentrates', 'Premium Buds', 78.5, 80.00, 48.00, '2025-04-10', 'BATCH-010', NOW(), NOW())

ON CONFLICT (sku) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  brand = EXCLUDED.brand,
  thc_percentage = EXCLUDED.thc_percentage,
  price = EXCLUDED.price,
  cost = EXCLUDED.cost,
  expiration_date = EXCLUDED.expiration_date,
  batch_id = EXCLUDED.batch_id,
  updated_at = NOW();
