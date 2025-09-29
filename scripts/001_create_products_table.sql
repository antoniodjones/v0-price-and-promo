-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  thc_percentage DECIMAL(5,2),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  expiration_date DATE,
  batch_id TEXT,
  inventory_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- Insert sample products
INSERT INTO products (sku, name, category, brand, thc_percentage, price, cost, expiration_date, batch_id, inventory_count) VALUES
('GTI-001', 'Blue Dream Flower', 'Flower', 'Green Thumb Industries', 22.5, 45.00, 25.00, '2025-06-15', 'BD-2024-001', 150),
('GTI-002', 'OG Kush Pre-Roll', 'Pre-Rolls', 'Green Thumb Industries', 24.8, 12.00, 6.00, '2025-05-20', 'OG-2024-002', 200),
('GTI-003', 'Sour Diesel Vape Cart', 'Vapes', 'Green Thumb Industries', 85.2, 65.00, 35.00, '2025-08-10', 'SD-2024-003', 75),
('GTI-004', 'Indica Gummies 10mg', 'Edibles', 'Green Thumb Industries', 0.0, 25.00, 12.00, '2025-12-01', 'IG-2024-004', 300),
('GTI-005', 'Hybrid Chocolate Bar', 'Edibles', 'Green Thumb Industries', 0.0, 35.00, 18.00, '2025-11-15', 'HC-2024-005', 120),
('GTI-006', 'Purple Haze Flower', 'Flower', 'Green Thumb Industries', 26.3, 50.00, 28.00, '2025-07-01', 'PH-2024-006', 90),
('GTI-007', 'White Widow Pre-Roll', 'Pre-Rolls', 'Green Thumb Industries', 23.1, 14.00, 7.00, '2025-06-05', 'WW-2024-007', 180),
('GTI-008', 'Gelato Vape Cart', 'Vapes', 'Green Thumb Industries', 88.7, 70.00, 38.00, '2025-09-20', 'GL-2024-008', 60),
('GTI-009', 'Sativa Gummies 5mg', 'Edibles', 'Green Thumb Industries', 0.0, 20.00, 10.00, '2025-10-30', 'SG-2024-009', 250),
('GTI-010', 'CBD Tincture', 'Tinctures', 'Green Thumb Industries', 0.5, 40.00, 20.00, '2026-01-15', 'CBD-2024-010', 100);
