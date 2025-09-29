-- Run all existing database setup scripts in order
-- This ensures all tables are created and populated

-- Products table (already exists)
\i scripts/001_create_products_table.sql

-- Customers table (already exists) 
\i scripts/002_create_customers_table.sql

-- Create discount tables if they don't exist
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
