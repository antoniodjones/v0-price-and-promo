-- Master script to set up the entire database schema and seed data
-- Run this script to initialize the database

-- Create products table and seed data
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  thc_percentage DECIMAL(5,2),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  expiration_date DATE,
  batch_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table and seed data
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(50) NOT NULL DEFAULT 'bronze',
  market VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  total_purchases DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create discount and promotion tables
CREATE TABLE IF NOT EXISTS customer_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  level VARCHAR(50) NOT NULL,
  target VARCHAR(255),
  customer_tiers TEXT[],
  markets TEXT[],
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_discount_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discount_id UUID REFERENCES customer_discounts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, customer_id)
);

CREATE TABLE IF NOT EXISTS inventory_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  trigger_value INTEGER NOT NULL,
  discount_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  scope_value VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bogo_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  trigger_level VARCHAR(50) NOT NULL,
  trigger_value DECIMAL(10,2) NOT NULL,
  reward_type VARCHAR(50) NOT NULL,
  reward_value DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  discount_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_deal_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES bundle_deals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Insert sample products
INSERT INTO products (name, sku, category, brand, thc_percentage, price, cost, expiration_date, batch_id) VALUES
('Premium OG Kush', 'FLOWER-OGK-001', 'Flower', 'Rythm', 24.5, 45.00, 27.00, '2024-12-31', 'BATCH-001'),
('Blue Dream Cartridge', 'CART-BD-002', 'Cartridge', 'Dogwalkers', 85.2, 65.00, 39.00, '2025-06-30', 'BATCH-002'),
('Blue Dream', 'FLOWER-BD-003', 'Flower', 'Rythm', 22.8, 42.00, 25.20, '2024-11-30', 'BATCH-003'),
('Gelato Gummies', 'EDIBLE-GEL-004', 'Edible', 'Kiva', 5.0, 25.00, 15.00, '2025-03-31', 'BATCH-004'),
('Wedding Cake', 'FLOWER-WC-005', 'Flower', 'Rythm', 26.1, 48.00, 28.80, '2024-12-15', 'BATCH-005'),
('Sour Diesel Cartridge', 'CART-SD-006', 'Cartridge', 'Dogwalkers', 82.7, 62.00, 37.20, '2025-05-31', 'BATCH-006'),
('Sour Diesel', 'FLOWER-SD-007', 'Flower', 'Rythm', 23.4, 44.00, 26.40, '2024-12-20', 'BATCH-007'),
('OG Kush Cartridge', 'CART-OGK-008', 'Cartridge', 'Dogwalkers', 84.1, 64.00, 38.40, '2025-07-15', 'BATCH-008'),
('Chocolate Chip Cookies', 'EDIBLE-CCC-009', 'Edible', 'Kiva', 10.0, 30.00, 18.00, '2025-02-28', 'BATCH-009'),
('Purple Haze', 'FLOWER-PH-010', 'Flower', 'Rythm', 21.9, 41.00, 24.60, '2024-11-25', 'BATCH-010')
ON CONFLICT (sku) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, email, tier, market, total_purchases) VALUES
('John Smith', 'john.smith@email.com', 'gold', 'California', 2450.00),
('Sarah Johnson', 'sarah.johnson@email.com', 'silver', 'California', 1200.00),
('Mike Davis', 'mike.davis@email.com', 'bronze', 'Nevada', 450.00),
('Emily Wilson', 'emily.wilson@email.com', 'platinum', 'California', 5200.00),
('David Brown', 'david.brown@email.com', 'silver', 'Arizona', 980.00),
('Lisa Garcia', 'lisa.garcia@email.com', 'gold', 'California', 3100.00),
('Tom Anderson', 'tom.anderson@email.com', 'bronze', 'Nevada', 320.00),
('Jennifer Lee', 'jennifer.lee@email.com', 'platinum', 'California', 4800.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample discounts and promotions
INSERT INTO customer_discounts (name, type, value, level, customer_tiers, markets, start_date, end_date) VALUES
('VIP Customer Discount', 'percentage', 15.00, 'tier', ARRAY['platinum', 'gold'], ARRAY['California'], '2024-01-01', '2024-12-31'),
('New Customer Welcome', 'percentage', 10.00, 'tier', ARRAY['bronze'], ARRAY['California', 'Nevada'], '2024-01-01', '2024-12-31'),
('California Market Boost', 'percentage', 5.00, 'market', NULL, ARRAY['California'], '2024-06-01', '2024-08-31')
ON CONFLICT DO NOTHING;

INSERT INTO inventory_discounts (name, type, trigger_value, discount_type, discount_value, scope, scope_value) VALUES
('Aging Flower Discount', 'age', 30, 'percentage', 20.00, 'category', 'Flower'),
('Bulk Purchase Discount', 'quantity', 5, 'percentage', 15.00, 'category', 'Cartridge'),
('Summer Clearance', 'seasonal', 1, 'percentage', 25.00, 'brand', 'Kiva')
ON CONFLICT DO NOTHING;

INSERT INTO bogo_promotions (name, type, trigger_level, trigger_value, reward_type, reward_value, start_date, end_date) VALUES
('Buy 2 Get 1 Free Flower', 'buy_x_get_y', 'quantity', 2, 'free_item', 1, '2024-07-01', '2024-07-31'),
('Spend $100 Get $20 Off', 'spend_x_get_y', 'amount', 100.00, 'discount', 20.00, '2024-08-01', '2024-08-31')
ON CONFLICT DO NOTHING;

INSERT INTO bundle_deals (name, type, discount_type, discount_value, min_quantity, start_date, end_date) VALUES
('Starter Pack Bundle', 'fixed_bundle', 'percentage', 20.00, 3, '2024-06-01', '2024-12-31'),
('Mix & Match Cartridges', 'mix_match', 'fixed', 10.00, 2, '2024-07-01', '2024-09-30')
ON CONFLICT DO NOTHING;
