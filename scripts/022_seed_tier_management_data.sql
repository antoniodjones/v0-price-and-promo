-- Seed data for tier management system
-- Creates sample discount rules with A/B/C tiers and assigns customers

-- Sample Discount Rule 1: Flower Volume Pricing
INSERT INTO discount_rules (id, name, description, rule_type, level, target_name, start_date, status, created_by)
VALUES 
('rule_flower_001', 'Flower Volume Pricing', 'Tiered discounts for flower products based on customer relationship', 'customer_discount', 'category', 'Flower', '2025-01-01', 'active', 'system');

-- Flower rule tiers
INSERT INTO discount_rule_tiers (rule_id, tier, discount_type, discount_value)
VALUES 
('rule_flower_001', 'A', 'percentage', 8.00),
('rule_flower_001', 'B', 'percentage', 5.00),
('rule_flower_001', 'C', 'percentage', 3.00);

-- Sample Discount Rule 2: Edibles Volume Pricing
INSERT INTO discount_rules (id, name, description, rule_type, level, target_name, start_date, status, created_by)
VALUES 
('rule_edibles_001', 'Edibles Volume Pricing', 'Tiered discounts for edibles based on customer relationship', 'customer_discount', 'category', 'Edibles', '2025-01-01', 'active', 'system');

-- Edibles rule tiers
INSERT INTO discount_rule_tiers (rule_id, tier, discount_type, discount_value)
VALUES 
('rule_edibles_001', 'A', 'percentage', 6.00),
('rule_edibles_001', 'B', 'percentage', 4.00),
('rule_edibles_001', 'C', 'percentage', 2.00);

-- Sample Discount Rule 3: Incredibles Brand Pricing
INSERT INTO discount_rules (id, name, description, rule_type, level, target_name, start_date, status, created_by)
VALUES 
('rule_incredibles_001', 'Incredibles Brand Discount', 'Special pricing for Incredibles brand products', 'customer_discount', 'brand', 'Incredibles', '2025-01-01', 'active', 'system');

-- Incredibles rule tiers
INSERT INTO discount_rule_tiers (rule_id, tier, discount_type, discount_value)
VALUES 
('rule_incredibles_001', 'A', 'percentage', 9.00),
('rule_incredibles_001', 'B', 'percentage', 7.00),
('rule_incredibles_001', 'C', 'percentage', 5.00);

-- Assign customers to tiers for Flower rule
-- Get customer IDs and assign them (using subqueries to handle dynamic IDs)
INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_flower_001',
    id,
    'A',
    'system',
    'Initial tier assignment - Premium flower customers'
FROM customers 
WHERE name IN ('Green Leaf Dispensary', 'Premium Cannabis Co', 'Elite Wellness Center', 'Top Shelf Collective', 'High Quality Herbs')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_flower_001' AND customer_id = customers.id
);

INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_flower_001',
    id,
    'B',
    'system',
    'Initial tier assignment - Standard flower customers'
FROM customers 
WHERE name IN ('City Cannabis', 'Valley Verde', 'Desert Bloom Dispensary', 'Mountain High Cannabis', 'Pacific Coast Collective')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_flower_001' AND customer_id = customers.id
);

INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_flower_001',
    id,
    'C',
    'system',
    'Initial tier assignment - Basic flower customers'
FROM customers 
WHERE name IN ('Neighborhood Dispensary', 'Local Leaf', 'Community Cannabis', 'Budget Buds')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_flower_001' AND customer_id = customers.id
);

-- Assign customers to tiers for Edibles rule (different tiers for same customers)
INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_edibles_001',
    id,
    'A',
    'system',
    'Initial tier assignment - Premium edibles customers'
FROM customers 
WHERE name IN ('Elite Wellness Center', 'Top Shelf Collective', 'Premium Cannabis Co')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_edibles_001' AND customer_id = customers.id
);

INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_edibles_001',
    id,
    'B',
    'system',
    'Initial tier assignment - Standard edibles customers'
FROM customers 
WHERE name IN ('Green Leaf Dispensary', 'High Quality Herbs', 'City Cannabis', 'Valley Verde')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_edibles_001' AND customer_id = customers.id
);

INSERT INTO customer_tier_assignments (rule_id, customer_id, tier, assigned_by, notes)
SELECT 
    'rule_edibles_001',
    id,
    'C',
    'system',
    'Initial tier assignment - Basic edibles customers'
FROM customers 
WHERE name IN ('Desert Bloom Dispensary', 'Mountain High Cannabis', 'Neighborhood Dispensary', 'Local Leaf')
AND NOT EXISTS (
    SELECT 1 FROM customer_tier_assignments 
    WHERE rule_id = 'rule_edibles_001' AND customer_id = customers.id
);

-- Create audit log entries for initial assignments
INSERT INTO tier_assignment_audit (assignment_id, rule_id, customer_id, action, new_tier, changed_by, reason)
SELECT 
    cta.id,
    cta.rule_id,
    cta.customer_id,
    'assigned',
    cta.tier,
    'system',
    'Initial tier assignment during system setup'
FROM customer_tier_assignments cta
WHERE cta.assigned_by = 'system';
