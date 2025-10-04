-- Demo Data Seeding Script for Volume & Tiered Pricing
-- Version 2: Updated to work with corrected sche```sql file="scripts/seed-volume-tiered-pricing-demo-v2.sql"
-- Demo Data Seeding Script for Volume & Tiered Pricing
-- Version 2: Updated to work with corrected schema
-- This script populates the database with realistic sample data for demonstration

-- ============================================================================
-- VOLUME PRICING RULES
-- ============================================================================

-- Volume Pricing Rule 1: Edibles Bulk Discount
INSERT INTO volume_pricing_rules (name, description, status, scope, scope_value, start_date, end_date)
VALUES (
  'Edibles Bulk Discount',
  'Volume-based pricing for all edible products - buy more, save more',
  'active',
  'category',
  'Edibles',
  NOW(),
  NOW() + INTERVAL '6 months'
);

-- Get the ID of the rule we just created
DO $$
DECLARE
  edibles_rule_id UUID;
  wana_rule_id UUID;
  vape_rule_id UUID;
  flower_rule_id UUID;
BEGIN
  -- Get Edibles rule ID
  SELECT id INTO edibles_rule_id FROM volume_pricing_rules WHERE name = 'Edibles Bulk Discount';
  
  -- Tiers for Edibles Bulk Discount
  INSERT INTO volume_pricing_tiers (rule_id, min_quantity, max_quantity, discount_type, discount_value, tier_label)
  VALUES
    (edibles_rule_id, 1, 9, 'percentage', 0, 'Standard Price'),
    (edibles_rule_id, 10, 49, 'percentage', 10, 'Bulk Tier 1'),
    (edibles_rule_id, 50, 99, 'percentage', 15, 'Bulk Tier 2'),
    (edibles_rule_id, 100, NULL, 'percentage', 20, 'Wholesale Tier');
END $$;

-- Volume Pricing Rule 2: Wana Brand Volume Discount
INSERT INTO volume_pricing_rules (name, description, status, scope, scope_value, start_date)
VALUES (
  'Wana Brand Volume Discount',
  'Special volume pricing for Wana brand products',
  'active',
  'brand',
  'Wana',
  NOW()
);

DO $$
DECLARE
  wana_rule_id UUID;
BEGIN
  SELECT id INTO wana_rule_id FROM volume_pricing_rules WHERE name = 'Wana Brand Volume Discount';
  
  INSERT INTO volume_pricing_tiers (rule_id, min_quantity, max_quantity, discount_type, discount_value, tier_label)
  VALUES
    (wana_rule_id, 1, 19, 'percentage', 0, 'Standard'),
    (wana_rule_id, 20, 49, 'percentage', 12, 'Volume 20+'),
    (wana_rule_id, 50, NULL, 'percentage', 18, 'Volume 50+');
END $$;

-- Volume Pricing Rule 3: Vape Cartridge Bulk Pricing
INSERT INTO volume_pricing_rules (name, description, status, scope, scope_value, start_date)
VALUES (
  'Vape Cartridge Bulk Pricing',
  'Volume discounts for vape cartridge purchases',
  'active',
  'category',
  'Vapes',
  NOW()
);

DO $$
DECLARE
  vape_rule_id UUID;
BEGIN
  SELECT id INTO vape_rule_id FROM volume_pricing_rules WHERE name = 'Vape Cartridge Bulk Pricing';
  
  INSERT INTO volume_pricing_tiers (rule_id, min_quantity, max_quantity, discount_type, discount_value, tier_label)
  VALUES
    (vape_rule_id, 1, 11, 'percentage', 0, 'Retail'),
    (vape_rule_id, 12, 23, 'percentage', 8, 'Dozen Discount'),
    (vape_rule_id, 24, 47, 'percentage', 12, 'Case Discount'),
    (vape_rule_id, 48, NULL, 'percentage', 16, 'Bulk Wholesale');
END $$;

-- Volume Pricing Rule 4: Flower Ounce Pricing
INSERT INTO volume_pricing_rules (name, description, status, scope, scope_value, start_date)
VALUES (
  'Flower Ounce Pricing',
  'Quantity-based pricing for flower products',
  'active',
  'category',
  'Flower',
  NOW()
);

DO $$
DECLARE
  flower_rule_id UUID;
BEGIN
  SELECT id INTO flower_rule_id FROM volume_pricing_rules WHERE name = 'Flower Ounce Pricing';
  
  INSERT INTO volume_pricing_tiers (rule_id, min_quantity, max_quantity, discount_type, discount_value, tier_label)
  VALUES
    (flower_rule_id, 1, 3, 'percentage', 0, 'Single'),
    (flower_rule_id, 4, 7, 'percentage', 10, 'Quarter Pound'),
    (flower_rule_id, 8, 15, 'percentage', 15, 'Half Pound'),
    (flower_rule_id, 16, NULL, 'percentage', 22, 'Pound+');
END $$;

-- ============================================================================
-- TIERED PRICING RULES (Customer Tier-Based)
-- ============================================================================

-- Tiered Pricing Rule 1: VIP Tier A - Premium Brands
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier A VIP - Premium Brands',
  'Exclusive pricing for Tier A customers on premium brands',
  ARRAY['A'],
  'brand',
  'Kiva',
  'percentage',
  20,
  10,
  'active',
  NOW()
);

-- Tiered Pricing Rule 2: Tier A - All Edibles
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier A - Edibles Category',
  'Tier A customers receive 18% off all edibles',
  ARRAY['A'],
  'category',
  'Edibles',
  'percentage',
  18,
  8,
  'active',
  NOW()
);

-- Tiered Pricing Rule 3: Tier B - Edibles
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier B - Edibles Category',
  'Tier B customers receive 12% off all edibles',
  ARRAY['B'],
  'category',
  'Edibles',
  'percentage',
  12,
  7,
  'active',
  NOW()
);

-- Tiered Pricing Rule 4: Tier C - Edibles
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier C - Edibles Category',
  'Tier C customers receive 8% off all edibles',
  ARRAY['C'],
  'category',
  'Edibles',
  'percentage',
  8,
  6,
  'active',
  NOW()
);

-- Tiered Pricing Rule 5: Multi-Tier Vapes Discount
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier A/B - Vape Cartridges',
  'Premium tier pricing for vape cartridges',
  ARRAY['A', 'B'],
  'category',
  'Vapes',
  'percentage',
  15,
  9,
  'active',
  NOW()
);

-- Tiered Pricing Rule 6: Global Tier A Discount
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'Tier A - Global Discount',
  'Base discount for all Tier A customers across all products',
  ARRAY['A'],
  'global',
  NULL,
  'percentage',
  10,
  5,
  'active',
  NOW()
);

-- Tiered Pricing Rule 7: Incredibles Brand - All Tiers
INSERT INTO tiered_pricing_rules (
  name, description, customer_tiers, scope, scope_value,
  discount_type, discount_value, priority, status, start_date
)
VALUES (
  'All Tiers - Incredibles Brand',
  'Special pricing for Incredibles brand across all customer tiers',
  ARRAY['A', 'B', 'C'],
  'brand',
  'Incredibles',
  'percentage',
  14,
  7,
  'active',
  NOW()
);

-- ============================================================================
-- SAMPLE PRICING APPLICATIONS (Historical Data for Analytics)
-- ============================================================================

-- Generate sample pricing applications for the last 30 days
DO $$
DECLARE
  sample_product_id UUID;
  sample_customer_id UUID;
  sample_volume_rule_id UUID;
  sample_tiered_rule_id UUID;
  day_offset INTEGER;
  base_price NUMERIC;
  final_price NUMERIC;
  quantity INTEGER;
BEGIN
  -- Get sample IDs (assuming products and customers exist)
  SELECT id INTO sample_product_id FROM products WHERE category = 'Edibles' LIMIT 1;
  SELECT id INTO sample_customer_id FROM customers WHERE tier = 'A' LIMIT 1;
  SELECT id INTO sample_volume_rule_id FROM volume_pricing_rules WHERE status = 'active' LIMIT 1;
  SELECT id INTO sample_tiered_rule_id FROM tiered_pricing_rules WHERE status = 'active' LIMIT 1;

  -- Only proceed if we have sample data
  IF sample_product_id IS NOT NULL AND sample_customer_id IS NOT NULL THEN
    -- Create 50 sample pricing applications over the last 30 days
    FOR i IN 1..50 LOOP
      day_offset := floor(random() * 30)::INTEGER;
      base_price := 50.00 + (random() * 50);
      quantity := floor(1 + random() * 20)::INTEGER;
      final_price := base_price * (1 - (random() * 0.25)); -- 0-25% discount
      
      INSERT INTO pricing_applications (
        product_id,
        customer_id,
        original_price,
        final_price,
        quantity,
        total_discount,
        volume_rule_id,
        tiered_rule_id,
        applied_at,
        calculation_details
      )
      VALUES (
        sample_product_id,
        sample_customer_id,
        base_price,
        final_price,
        quantity,
        (base_price - final_price) * quantity,
        CASE WHEN random() > 0.5 THEN sample_volume_rule_id ELSE NULL END,
        CASE WHEN random() > 0.5 THEN sample_tiered_rule_id ELSE NULL END,
        NOW() - (day_offset || ' days')::INTERVAL - (floor(random() * 24) || ' hours')::INTERVAL,
        jsonb_build_object(
          'breakdown', jsonb_build_object(
            'basePrice', base_price,
            'volumeDiscount', CASE WHEN random() > 0.5 THEN random() * 10 ELSE 0 END,
            'tierDiscount', CASE WHEN random() > 0.5 THEN random() * 8 ELSE 0 END,
            'finalPrice', final_price,
            'quantity', quantity
          )
        )
      );
    END LOOP;
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show summary of created rules
SELECT 
  'Volume Pricing Rules' AS rule_type,
  COUNT(*) AS total_rules,
  COUNT(*) FILTER (WHERE status = 'active') AS active_rules
FROM volume_pricing_rules

UNION ALL

SELECT 
  'Tiered Pricing Rules' AS rule_type,
  COUNT(*) AS total_rules,
  COUNT(*) FILTER (WHERE status = 'active') AS active_rules
FROM tiered_pricing_rules;

-- Show volume pricing tiers summary
SELECT 
  vpr.name AS rule_name,
  COUNT(vpt.id) AS tier_count,
  MIN(vpt.min_quantity) AS min_qty,
  MAX(COALESCE(vpt.max_quantity, 999)) AS max_qty,
  MAX(vpt.discount_value) AS max_discount
FROM volume_pricing_rules vpr
JOIN volume_pricing_tiers vpt ON vpr.id = vpt.rule_id
GROUP BY vpr.name
ORDER BY vpr.name;

-- Show tiered pricing rules summary
SELECT 
  name,
  customer_tiers,
  scope,
  scope_value,
  discount_value || '%' AS discount,
  priority,
  status
FROM tiered_pricing_rules
ORDER BY priority DESC, name;

-- Show pricing applications summary
SELECT 
  COUNT(*) AS total_applications,
  COUNT(DISTINCT product_id) AS unique_products,
  COUNT(DISTINCT customer_id) AS unique_customers,
  ROUND(AVG(total_discount), 2) AS avg_discount,
  ROUND(SUM(total_discount), 2) AS total_savings
FROM pricing_applications;

-- Success message
SELECT '✓ Demo data seeding completed successfully!' AS status,
       'Volume and tiered pricing rules have been created with sample data' AS message;
