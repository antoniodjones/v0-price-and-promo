-- Create customer_discounts table
CREATE TABLE IF NOT EXISTS customer_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('customer', 'tier', 'market')),
  target TEXT NOT NULL,
  customer_tiers TEXT[] DEFAULT '{}',
  markets TEXT[] DEFAULT '{}',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_discount_assignments table for many-to-many relationship
CREATE TABLE IF NOT EXISTS customer_discount_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_id UUID NOT NULL REFERENCES customer_discounts(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_id, customer_id)
);

-- Create inventory_discounts table
CREATE TABLE IF NOT EXISTS inventory_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quantity', 'value')),
  trigger_value NUMERIC NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('all', 'category', 'brand', 'product')),
  scope_value TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bogo_promotions table
CREATE TABLE IF NOT EXISTS bogo_promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy_x_get_y', 'spend_x_get_y')),
  trigger_level TEXT NOT NULL CHECK (trigger_level IN ('quantity', 'value')),
  trigger_value NUMERIC NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('free', 'discount')),
  reward_value NUMERIC NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_deals table
CREATE TABLE IF NOT EXISTS bundle_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed_bundle', 'mix_match')),
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bundle_deal_products table for many-to-many relationship
CREATE TABLE IF NOT EXISTS bundle_deal_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES bundle_deals(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bundle_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customer_discounts_status ON customer_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_dates ON customer_discounts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_customer_discount_assignments_discount ON customer_discount_assignments(discount_id);
CREATE INDEX IF NOT EXISTS idx_customer_discount_assignments_customer ON customer_discount_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_status ON inventory_discounts(status);
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_status ON bogo_promotions(status);
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_dates ON bogo_promotions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_status ON bundle_deals(status);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_dates ON bundle_deals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bundle_deal_products_bundle ON bundle_deal_products(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_deal_products_product ON bundle_deal_products(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_customer_discounts_updated_at BEFORE UPDATE ON customer_discounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_discounts_updated_at BEFORE UPDATE ON inventory_discounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bogo_promotions_updated_at BEFORE UPDATE ON bogo_promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bundle_deals_updated_at BEFORE UPDATE ON bundle_deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
