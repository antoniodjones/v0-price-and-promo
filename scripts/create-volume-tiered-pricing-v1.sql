-- Volume Pricing Tables
-- Stores volume-based pricing rules (e.g., buy 10-50 units get 10% off)

CREATE TABLE IF NOT EXISTS volume_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
  
  -- Scope: what does this rule apply to?
  scope TEXT NOT NULL CHECK (scope IN ('product', 'category', 'brand', 'global')),
  scope_id UUID, -- product_id, or null for category/brand/global
  scope_value TEXT, -- category name, brand name, or null for product/global
  
  -- Date range
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

CREATE TABLE IF NOT EXISTS volume_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES volume_pricing_rules(id) ON DELETE CASCADE,
  
  -- Quantity thresholds
  min_quantity INTEGER NOT NULL CHECK (min_quantity >= 0),
  max_quantity INTEGER, -- NULL means infinity
  
  -- Discount
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value >= 0),
  
  -- Display
  tier_label TEXT, -- e.g., "Bulk Discount", "Wholesale Price"
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_quantity_range CHECK (max_quantity IS NULL OR max_quantity > min_quantity)
);

-- Tiered Pricing Tables
-- Stores customer tier-based pricing (e.g., A-tier customers get 20% off)

CREATE TABLE IF NOT EXISTS tiered_pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
  
  -- Which customer tiers does this apply to?
  customer_tiers TEXT[] NOT NULL, -- e.g., ['A', 'B', 'VIP']
  
  -- Scope: what products/categories does this apply to?
  scope TEXT NOT NULL CHECK (scope IN ('product', 'category', 'brand', 'global')),
  scope_id UUID,
  scope_value TEXT,
  
  -- Pricing adjustment
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value >= 0),
  
  -- Date range
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Priority (higher number = higher priority when multiple rules apply)
  priority INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES app_users(id)
);

-- Pricing Application Log
-- Track which pricing rules were applied to which orders for audit/analytics

CREATE TABLE IF NOT EXISTS pricing_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- What was priced?
  product_id UUID REFERENCES products(id),
  customer_id UUID REFERENCES customers(id),
  
  -- Original vs final price
  original_price NUMERIC(10, 2) NOT NULL,
  final_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_discount NUMERIC(10, 2) NOT NULL,
  
  -- Which rules were applied?
  volume_rule_id UUID REFERENCES volume_pricing_rules(id),
  tiered_rule_id UUID REFERENCES tiered_pricing_rules(id),
  
  -- Context
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID, -- Reference to order if exists
  
  -- Metadata for debugging
  calculation_details JSONB
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
