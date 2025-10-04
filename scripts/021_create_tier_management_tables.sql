-- Create tier management system tables
-- Supports per-rule customer tier assignments (A/B/C tiers per discount rule)

-- 1. Discount Rules table
CREATE TABLE IF NOT EXISTS discount_rules (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('customer_discount', 'volume_pricing', 'tiered_pricing', 'bogo', 'bundle')),
    level TEXT NOT NULL CHECK (level IN ('brand', 'category', 'subcategory', 'product')),
    target_id TEXT, -- brand_id, category_id, subcategory_id, or product_id
    target_name TEXT, -- Human-readable name of target
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled', 'expired')),
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Discount Rule Tiers table (A/B/C tier definitions per rule)
CREATE TABLE IF NOT EXISTS discount_rule_tiers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rule_id TEXT NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('A', 'B', 'C')),
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'price_override')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_quantity INTEGER DEFAULT 0, -- For volume-based tiers
    max_quantity INTEGER, -- NULL means unlimited
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rule_id, tier),
    CONSTRAINT valid_discount_value CHECK (
        (discount_type = 'percentage' AND discount_value >= 0 AND discount_value <= 100) OR
        (discount_type IN ('fixed_amount', 'price_override') AND discount_value >= 0)
    )
);

-- 3. Customer Tier Assignments table (assigns customers to tiers per rule)
CREATE TABLE IF NOT EXISTS customer_tier_assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rule_id TEXT NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('A', 'B', 'C')),
    assigned_date DATE DEFAULT CURRENT_DATE,
    assigned_by TEXT, -- User who made the assignment
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rule_id, customer_id) -- Customer can only be in one tier per rule
);

-- 4. Tier Assignment Audit Log (track all tier assignment changes)
CREATE TABLE IF NOT EXISTS tier_assignment_audit (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    assignment_id TEXT REFERENCES customer_tier_assignments(id) ON DELETE SET NULL,
    rule_id TEXT NOT NULL,
    customer_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('assigned', 'updated', 'removed')),
    old_tier TEXT CHECK (old_tier IN ('A', 'B', 'C')),
    new_tier TEXT CHECK (new_tier IN ('A', 'B', 'C')),
    changed_by TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_discount_rules_status ON discount_rules(status);
CREATE INDEX IF NOT EXISTS idx_discount_rules_type ON discount_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_discount_rules_level ON discount_rules(level);
CREATE INDEX IF NOT EXISTS idx_discount_rules_target ON discount_rules(target_id);
CREATE INDEX IF NOT EXISTS idx_discount_rules_dates ON discount_rules(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_rule_tiers_rule_id ON discount_rule_tiers(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_tiers_tier ON discount_rule_tiers(tier);

CREATE INDEX IF NOT EXISTS idx_tier_assignments_rule ON customer_tier_assignments(rule_id);
CREATE INDEX IF NOT EXISTS idx_tier_assignments_customer ON customer_tier_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_tier_assignments_tier ON customer_tier_assignments(tier);

CREATE INDEX IF NOT EXISTS idx_tier_audit_customer ON tier_assignment_audit(customer_id);
CREATE INDEX IF NOT EXISTS idx_tier_audit_rule ON tier_assignment_audit(rule_id);
CREATE INDEX IF NOT EXISTS idx_tier_audit_date ON tier_assignment_audit(changed_at);

-- Add table comments for documentation
COMMENT ON TABLE discount_rules IS 'Master table for all discount rules with tier support';
COMMENT ON TABLE discount_rule_tiers IS 'Defines A/B/C tier discount values for each rule';
COMMENT ON TABLE customer_tier_assignments IS 'Assigns customers to specific tiers within each rule';
COMMENT ON TABLE tier_assignment_audit IS 'Audit trail for all tier assignment changes';

-- Add column comments
COMMENT ON COLUMN discount_rules.level IS 'Hierarchy level: brand, category, subcategory, or product';
COMMENT ON COLUMN discount_rules.target_id IS 'ID of the brand/category/subcategory/product this rule applies to';
COMMENT ON COLUMN discount_rule_tiers.tier IS 'Tier level: A (highest), B (medium), C (lowest)';
COMMENT ON COLUMN customer_tier_assignments.tier IS 'Which tier (A/B/C) the customer is assigned to for this rule';
