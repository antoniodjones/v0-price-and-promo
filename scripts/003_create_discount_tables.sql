-- Create customer discounts table
CREATE TABLE IF NOT EXISTS customer_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
  value DECIMAL(10,2) NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'customer', 'tier', 'market'
  target VARCHAR(255), -- specific target value
  customer_tiers TEXT[], -- array of customer tiers
  markets TEXT[], -- array of markets
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer discount assignments table (junction table)
CREATE TABLE IF NOT EXISTS customer_discount_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  discount_id UUID REFERENCES customer_discounts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, customer_id)
);

-- Create inventory discounts table
CREATE TABLE IF NOT EXISTS inventory_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'age', 'quantity', 'seasonal'
  trigger_value INTEGER NOT NULL,
  discount_type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  scope VARCHAR(50) NOT NULL, -- 'category', 'brand', 'product'
  scope_value VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BOGO promotions table
CREATE TABLE IF NOT EXISTS bogo_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'buy_x_get_y', 'spend_x_get_y'
  trigger_level VARCHAR(50) NOT NULL, -- 'quantity', 'amount'
  trigger_value DECIMAL(10,2) NOT NULL,
  reward_type VARCHAR(50) NOT NULL, -- 'free_item', 'discount'
  reward_value DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle deals table
CREATE TABLE IF NOT EXISTS bundle_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'fixed_bundle', 'mix_match'
  discount_type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle deal products table (junction table)
CREATE TABLE IF NOT EXISTS bundle_deal_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID REFERENCES bundle_deals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Insert sample data
INSERT INTO customer_discounts (name, type, value, level, customer_tiers, markets, start_date, end_date) VALUES
('VIP Customer Discount', 'percentage', 15.00, 'tier', ARRAY['platinum', 'gold'], ARRAY['California'], '2024-01-01', '2024-12-31'),
('New Customer Welcome', 'percentage', 10.00, 'tier', ARRAY['bronze'], ARRAY['California', 'Nevada'], '2024-01-01', '2024-12-31'),
('California Market Boost', 'percentage', 5.00, 'market', NULL, ARRAY['California'], '2024-06-01', '2024-08-31');

INSERT INTO inventory_discounts (name, type, trigger_value, discount_type, discount_value, scope, scope_value) VALUES
('Aging Flower Discount', 'age', 30, 'percentage', 20.00, 'category', 'Flower'),
('Bulk Purchase Discount', 'quantity', 5, 'percentage', 15.00, 'category', 'Cartridge'),
('Summer Clearance', 'seasonal', 1, 'percentage', 25.00, 'brand', 'Kiva');

INSERT INTO bogo_promotions (name, type, trigger_level, trigger_value, reward_type, reward_value, start_date, end_date) VALUES
('Buy 2 Get 1 Free Flower', 'buy_x_get_y', 'quantity', 2, 'free_item', 1, '2024-07-01', '2024-07-31'),
('Spend $100 Get $20 Off', 'spend_x_get_y', 'amount', 100.00, 'discount', 20.00, '2024-08-01', '2024-08-31');

INSERT INTO bundle_deals (name, type, discount_type, discount_value, min_quantity, start_date, end_date) VALUES
('Starter Pack Bundle', 'fixed_bundle', 'percentage', 20.00, 3, '2024-06-01', '2024-12-31'),
('Mix & Match Cartridges', 'mix_match', 'fixed', 10.00, 2, '2024-07-01', '2024-09-30');
