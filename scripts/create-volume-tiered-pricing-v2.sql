-- Volume and Tiered Pricing Schema
-- Version 2: Updated to handle existing tables

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS pricing_applications CASCADE;
DROP TABLE IF EXISTS volume_pricing_tiers CASCADE;
DROP TABLE IF EXISTS tiered_pricing_rules CASCADE;
DROP TABLE IF EXISTS volume_pricing_rules CASCADE;

-- Volume Pricing Rules Table
CREATE TABLE volume_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  scope TEXT NOT NULL CHECK (scope IN ('product', 'category', 'brand', 'global')),
  scope_id UUID, -- References products.id when scope='product'
  scope_value TEXT, -- Category name or brand name when scope='category' or 'brand'
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volume Pricing Tiers Table (quantity breakpoints)
CREATE TABLE volume_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES volume_pricing_rules(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER, -- NULL means unlimited
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price')),
  discount_value NUMERIC(10, 2) NOT NULL,
  tier_label TEXT, -- e.g., "Bulk", "Wholesale", "Case"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_quantity_range CHECK (max_quantity IS NULL OR max_quantity > min_quantity)
);

-- Tiered Pricing Rules Table (customer tier-based)
CREATE TABLE tiered_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  customer_tiers TEXT[] NOT NULL, -- e.g., ['A', 'B', 'VIP']
  scope TEXT NOT NULL CHECK (scope IN ('product', 'category', 'brand', 'global')),
  scope_id UUID, -- References products.id when scope='product'
  scope_value TEXT, -- Category name or brand name
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value NUMERIC(10, 2) NOT NULL,
  priority INTEGER DEFAULT 0, -- Higher priority rules apply first
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES app_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing Applications Audit Table
CREATE TABLE pricing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  product_id UUID REFERENCES products(id),
  order_id UUID, -- For future order tracking
  quantity INTEGER NOT NULL,
  original_price NUMERIC(10, 2) NOT NULL,
  final_price NUMERIC(10, 2) NOT NULL,
  total_discount NUMERIC(10, 2) NOT NULL,
  volume_rule_id UUID REFERENCES volume_pricing_rules(id),
  tiered_rule_id UUID REFERENCES tiered_pricing_rules(id),
  calculation_details JSONB, -- Store breakdown of how price was calculated
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_volume_rules_scope ON volume_pricing_rules(scope, scope_id, scope_value);
CREATE INDEX IF NOT EXISTS idx_volume_rules_status ON volume_pricing_rules(status);
CREATE INDEX IF NOT EXISTS idx_volume_tiers_rule ON volume_pricing_tiers(rule_id);
CREATE INDEX IF NOT EXISTS idx_tiered_rules_tiers ON tiered_pricing_rules USING GIN(customer_tiers);
CREATE INDEX IF NOT EXISTS idx_tiered_rules_scope ON tiered_pricing_rules(scope, scope_id, scope_value);
CREATE INDEX IF NOT EXISTS idx_tiered_rules_status ON tiered_pricing_rules(status);
CREATE INDEX IF NOT EXISTS idx_pricing_apps_product ON pricing_applications(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_apps_customer ON pricing_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_pricing_apps_date ON pricing_applications(applied_at);

-- Comments for documentation
COMMENT ON TABLE volume_pricing_rules IS 'Defines volume-based pricing rules (e.g., buy more, save more)';
COMMENT ON TABLE volume_pricing_tiers IS 'Quantity breakpoints for volume pricing rules';
COMMENT ON TABLE tiered_pricing_rules IS 'Customer tier-based pricing rules (e.g., VIP customers get better prices)';
COMMENT ON TABLE pricing_applications IS 'Audit log of pricing rule applications';
