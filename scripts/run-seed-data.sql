-- Run the comprehensive seed script to populate all tables
-- This ensures we have test data for products, customers, and all relationships

-- First, let's check if tables exist and create them if needed
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  thc_percentage DECIMAL(5,2),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  expiration_date DATE,
  batch_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert products if they don't exist
INSERT INTO products (name, sku, category, brand, thc_percentage, price, cost, expiration_date, batch_id) VALUES
('Premium OG Kush', 'FLOWER-OGK-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-31', 'BATCH-001'),
('Blue Dream Cartridge', 'CART-BD-002', 'Cartridge', 'Dogwalkers', 85.2, 35.00, 21.00, '2025-06-30', 'BATCH-002'),
('Blue Dream', 'FLOWER-BD-003', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-30', 'BATCH-003'),
('Gelato Gummies', 'EDIBLE-GEL-004', 'Edible', 'Kiva', 0.0, 25.00, 15.00, '2025-03-31', 'BATCH-004'),
('Wedding Cake', 'FLOWER-WC-005', 'Flower', 'Cookies', 26.1, 48.00, 28.80, '2024-10-31', 'BATCH-005'),
('Pineapple Express Pre-Roll', 'PREROLL-PE-006', 'Pre-Roll', 'Raw Garden', 21.3, 18.00, 10.80, '2024-09-30', 'BATCH-006'),
('Sour Diesel', 'FLOWER-SD-007', 'Flower', 'Rythm', 23.7, 44.00, 26.40, '2024-12-15', 'BATCH-007'),
('OG Kush Cartridge', 'CART-OGK-008', 'Cartridge', 'Dogwalkers', 87.5, 38.00, 22.80, '2025-05-31', 'BATCH-008'),
('Chocolate Chip Cookies', 'EDIBLE-CCC-009', 'Edible', 'Kiva', 0.0, 30.00, 18.00, '2025-02-28', 'BATCH-009'),
('Purple Haze', 'FLOWER-PH-010', 'Flower', 'Cookies', 25.4, 46.00, 27.60, '2024-11-15', 'BATCH-010')
ON CONFLICT (sku) DO NOTHING;

-- Update the updated_at timestamp
UPDATE products SET updated_at = NOW();
