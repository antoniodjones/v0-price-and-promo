-- Enhanced Master script to set up the entire database schema and seed data
-- Version 2: Includes all missing tables for analytics and tracking
-- Run this script to initialize the database

-- ============================================
-- CORE TABLES
-- ============================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  brand VARCHAR(100) NOT NULL,
  thc_percentage DECIMAL(5,2),
  cbd_percentage DECIMAL(5,2),
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  inventory_count INTEGER DEFAULT 0,
  expiration_date DATE,
  batch_id VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(50) NOT NULL DEFAULT 'bronze',
  market VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  total_purchases DECIMAL(12,2) DEFAULT 0.00,
  lifetime_value DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DISCOUNT & PROMOTION TABLES
-- ============================================

-- Customer discounts table
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

-- Customer discount assignments
CREATE TABLE IF NOT EXISTS customer_discount_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discount_id UUID REFERENCES customer_discounts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, customer_id)
);

-- Inventory discounts table
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

-- BOGO promotions table
CREATE TABLE IF NOT EXISTS bogo_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  trigger_level VARCHAR(50) NOT NULL,
  trigger_value VARCHAR(255) NOT NULL,
  reward_type VARCHAR(50) NOT NULL,
  reward_value DECIMAL(10,2) NOT NULL,
  min_purchase_quantity INTEGER DEFAULT 1,
  max_uses_per_customer INTEGER,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundle deals table
CREATE TABLE IF NOT EXISTS bundle_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  discount_type VARCHAR(50) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  bundle_price DECIMAL(10,2),
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundle deal products junction table
CREATE TABLE IF NOT EXISTS bundle_deal_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES bundle_deals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- ============================================
-- ANALYTICS & TRACKING TABLES
-- ============================================

-- Promotion tracking table (for history)
CREATE TABLE IF NOT EXISTS promotion_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  promotion_id UUID NOT NULL,
  promotion_type VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  date_tracked DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  revenue_impact DECIMAL(12,2) DEFAULT 0.00,
  cost_impact DECIMAL(12,2) DEFAULT 0.00,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(255) NOT NULL,
  metric_value DECIMAL(12,2) NOT NULL,
  period VARCHAR(50) NOT NULL,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time events table
CREATE TABLE IF NOT EXISTS realtime_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  event_data JSONB,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  old_price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2) NOT NULL,
  change_reason VARCHAR(255),
  changed_by VARCHAR(255),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type VARCHAR(50) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  threshold_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_expiration ON products(expiration_date);

CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_market ON customers(market);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE INDEX IF NOT EXISTS idx_customer_discounts_status ON customer_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_dates ON customer_discounts(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_inventory_discounts_status ON inventory_discounts(status);
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_status ON bogo_promotions(status);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_status ON bundle_deals(status);

CREATE INDEX IF NOT EXISTS idx_promotion_tracking_date ON promotion_tracking(date_tracked);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_type ON promotion_tracking(promotion_type);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_promotion ON promotion_tracking(promotion_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON performance_metrics(date_recorded);
CREATE INDEX IF NOT EXISTS idx_realtime_events_timestamp ON realtime_events(timestamp);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert sample products
INSERT INTO products (name, sku, category, subcategory, brand, thc_percentage, cbd_percentage, price, cost, inventory_count, expiration_date, batch_id) VALUES
('Premium OG Kush', 'FLOWER-OGK-001', 'Flower', 'Indica', 'Rythm', 24.5, 0.5, 45.00, 27.00, 50, '2024-12-31', 'BATCH-001'),
('Blue Dream Cartridge', 'CART-BD-002', 'Cartridge', 'Hybrid', 'Dogwalkers', 85.2, 0.1, 65.00, 39.00, 30, '2025-06-30', 'BATCH-002'),
('Blue Dream', 'FLOWER-BD-003', 'Flower', 'Hybrid', 'Rythm', 22.8, 0.8, 42.00, 25.20, 45, '2024-11-30', 'BATCH-003'),
('Gelato Gummies', 'EDIBLE-GEL-004', 'Edible', 'Gummies', 'Kiva', 5.0, 0.0, 25.00, 15.00, 100, '2025-03-31', 'BATCH-004'),
('Wedding Cake', 'FLOWER-WC-005', 'Flower', 'Indica', 'Rythm', 26.1, 0.3, 48.00, 28.80, 40, '2024-12-15', 'BATCH-005'),
('Sour Diesel Cartridge', 'CART-SD-006', 'Cartridge', 'Sativa', 'Dogwalkers', 82.7, 0.2, 62.00, 37.20, 25, '2025-05-31', 'BATCH-006'),
('Sour Diesel', 'FLOWER-SD-007', 'Flower', 'Sativa', 'Rythm', 23.4, 0.6, 44.00, 26.40, 55, '2024-12-20', 'BATCH-007'),
('OG Kush Cartridge', 'CART-OGK-008', 'Cartridge', 'Indica', 'Dogwalkers', 84.1, 0.1, 64.00, 38.40, 20, '2025-07-15', 'BATCH-008'),
('Chocolate Chip Cookies', 'EDIBLE-CCC-009', 'Edible', 'Cookies', 'Kiva', 10.0, 0.0, 30.00, 18.00, 80, '2025-02-28', 'BATCH-009'),
('Purple Haze', 'FLOWER-PH-010', 'Flower', 'Sativa', 'Rythm', 21.9, 0.7, 41.00, 24.60, 60, '2024-11-25', 'BATCH-010'),
('Mango Tango Gummies', 'EDIBLE-MT-011', 'Edible', 'Gummies', 'Kiva', 5.0, 2.0, 28.00, 16.80, 90, '2025-04-15', 'BATCH-011'),
('Green Crack', 'FLOWER-GC-012', 'Flower', 'Sativa', 'Rythm', 25.3, 0.4, 46.00, 27.60, 35, '2024-12-10', 'BATCH-012'),
('Pineapple Express Cartridge', 'CART-PE-013', 'Cartridge', 'Hybrid', 'Dogwalkers', 83.5, 0.3, 63.00, 37.80, 28, '2025-06-15', 'BATCH-013'),
('Granddaddy Purple', 'FLOWER-GDP-014', 'Flower', 'Indica', 'Rythm', 27.2, 0.2, 49.00, 29.40, 42, '2024-12-05', 'BATCH-014'),
('Strawberry Cough', 'FLOWER-SC-015', 'Flower', 'Sativa', 'Rythm', 20.8, 0.9, 40.00, 24.00, 50, '2024-11-20', 'BATCH-015')
ON CONFLICT (sku) DO NOTHING;

-- Insert sample customers
INSERT INTO customers (name, email, tier, market, total_purchases, lifetime_value) VALUES
('John Smith', 'john.smith@email.com', 'gold', 'California', 2450.00, 3200.00),
('Sarah Johnson', 'sarah.johnson@email.com', 'silver', 'California', 1200.00, 1800.00),
('Mike Davis', 'mike.davis@email.com', 'bronze', 'Nevada', 450.00, 650.00),
('Emily Wilson', 'emily.wilson@email.com', 'platinum', 'California', 5200.00, 7500.00),
('David Brown', 'david.brown@email.com', 'silver', 'Arizona', 980.00, 1400.00),
('Lisa Garcia', 'lisa.garcia@email.com', 'gold', 'California', 3100.00, 4200.00),
('Tom Anderson', 'tom.anderson@email.com', 'bronze', 'Nevada', 320.00, 500.00),
('Jennifer Lee', 'jennifer.lee@email.com', 'platinum', 'California', 4800.00, 6800.00),
('Robert Martinez', 'robert.martinez@email.com', 'gold', 'Arizona', 2800.00, 3600.00),
('Amanda Taylor', 'amanda.taylor@email.com', 'silver', 'Nevada', 1500.00, 2100.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample customer discounts
INSERT INTO customer_discounts (name, type, value, level, target, customer_tiers, markets, start_date, end_date) VALUES
('VIP Customer Discount', 'percentage', 15.00, 'tier', NULL, ARRAY['platinum', 'gold'], ARRAY['California'], '2024-01-01', '2024-12-31'),
('New Customer Welcome', 'percentage', 10.00, 'tier', NULL, ARRAY['bronze'], ARRAY['California', 'Nevada', 'Arizona'], '2024-01-01', '2024-12-31'),
('California Market Boost', 'percentage', 5.00, 'market', NULL, NULL, ARRAY['California'], '2024-06-01', '2024-08-31'),
('Rythm Brand Discount', 'percentage', 12.00, 'brand', 'Rythm', ARRAY['gold', 'platinum'], ARRAY['California'], '2024-07-01', '2024-09-30'),
('Flower Category Deal', 'percentage', 8.00, 'category', 'Flower', ARRAY['silver', 'gold', 'platinum'], ARRAY['California', 'Nevada'], '2024-08-01', '2024-10-31')
ON CONFLICT DO NOTHING;

-- Insert sample inventory discounts
INSERT INTO inventory_discounts (name, type, trigger_value, discount_type, discount_value, scope, scope_value) VALUES
('30-Day Expiration Discount', 'expiration', 30, 'percentage', 20.00, 'category', 'Flower'),
('60-Day Expiration Discount', 'expiration', 60, 'percentage', 15.00, 'category', 'Flower'),
('90-Day Expiration Discount', 'expiration', 90, 'percentage', 10.00, 'all', NULL),
('High THC Discount', 'thc_percentage', 25, 'percentage', 5.00, 'category', 'Flower'),
('Cartridge Bulk Discount', 'quantity', 5, 'percentage', 15.00, 'category', 'Cartridge'),
('Kiva Brand Clearance', 'seasonal', 1, 'percentage', 25.00, 'brand', 'Kiva')
ON CONFLICT DO NOTHING;

-- Insert sample BOGO promotions
INSERT INTO bogo_promotions (name, type, trigger_level, trigger_value, reward_type, reward_value, min_purchase_quantity, start_date, end_date) VALUES
('Buy 2 Get 1 Free Flower', 'traditional', 'quantity', '2', 'free_item', 1, 2, '2024-07-01', '2024-07-31'),
('Spend $100 Get $20 Off', 'spend_get', 'amount', '100', 'discount', 20.00, 1, '2024-08-01', '2024-08-31'),
('Buy Rythm Get 50% Off', 'brand', 'brand', 'Rythm', 'percentage', 50.00, 2, '2024-09-01', '2024-09-30'),
('Cartridge BOGO 30% Off', 'category', 'category', 'Cartridge', 'percentage', 30.00, 2, '2024-10-01', '2024-10-31')
ON CONFLICT DO NOTHING;

-- Insert sample bundle deals
INSERT INTO bundle_deals (name, description, type, discount_type, discount_value, min_quantity, bundle_price, start_date, end_date) VALUES
('Starter Pack Bundle', 'Perfect starter pack with flower, cartridge, and edibles', 'fixed_bundle', 'percentage', 20.00, 3, 120.00, '2024-06-01', '2024-12-31'),
('Mix & Match Cartridges', 'Choose any 3 cartridges and save', 'mix_match', 'fixed', 15.00, 3, NULL, '2024-07-01', '2024-09-30'),
('Flower Lovers Bundle', 'Best flower strains at a great price', 'fixed_bundle', 'percentage', 25.00, 4, 150.00, '2024-08-01', '2024-10-31'),
('Edibles Variety Pack', 'Try all our edible options', 'mix_match', 'percentage', 18.00, 4, NULL, '2024-09-01', '2024-11-30')
ON CONFLICT DO NOTHING;

-- Insert sample promotion tracking data
INSERT INTO promotion_tracking (promotion_id, promotion_type, date_tracked, usage_count, revenue_impact, cost_impact, metadata) 
SELECT 
  id,
  'customer_discount',
  CURRENT_DATE - (random() * 30)::integer,
  (random() * 50 + 10)::integer,
  (random() * 1000 + 500)::numeric(12,2),
  (random() * 600 + 300)::numeric(12,2),
  jsonb_build_object('promotion_name', name, 'discount_percentage', value)
FROM customer_discounts
LIMIT 5;

-- Insert sample performance metrics
INSERT INTO performance_metrics (metric_type, metric_name, metric_value, period, date_recorded, metadata) VALUES
('revenue', 'Total Revenue', 125000.00, 'monthly', CURRENT_DATE, '{"currency": "USD"}'),
('discount', 'Total Discounts Given', 18500.00, 'monthly', CURRENT_DATE, '{"currency": "USD"}'),
('promotion', 'Active Promotions', 12, 'daily', CURRENT_DATE, '{}'),
('customer', 'Active Customers', 450, 'daily', CURRENT_DATE, '{}'),
('conversion', 'Conversion Rate', 3.5, 'weekly', CURRENT_DATE, '{"unit": "percentage"}');

-- Insert sample real-time events
INSERT INTO realtime_events (event_type, event_name, event_data, timestamp) VALUES
('purchase', 'Customer Purchase', '{"amount": 125.50, "items": 3}', NOW() - INTERVAL '5 minutes'),
('discount_applied', 'VIP Discount Applied', '{"discount_amount": 18.75, "discount_type": "percentage"}', NOW() - INTERVAL '10 minutes'),
('promotion_activated', 'BOGO Promotion Started', '{"promotion_name": "Buy 2 Get 1 Free"}', NOW() - INTERVAL '2 hours'),
('price_change', 'Product Price Updated', '{"old_price": 45.00, "new_price": 42.00}', NOW() - INTERVAL '1 day');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: products, customers, discounts, promotions, bundles, analytics';
  RAISE NOTICE 'Sample data inserted for testing';
END $$;
