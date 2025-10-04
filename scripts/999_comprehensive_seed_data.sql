-- Comprehensive Seed Data for GTI Pricing & Promotions Engine
-- This script creates realistic test data for all discount and promotion types

-- ============================================================================
-- 1. SEED PRODUCTS (Cannabis inventory)
-- ============================================================================

INSERT INTO products (id, name, sku, category, brand, price, cost, thc_percentage, inventory_count, batch_id, expiration_date, status, created_at, updated_at)
VALUES
  -- Flower Products
  (gen_random_uuid(), 'Blue Dream 1/8oz', 'FLW-BD-001', 'Flower', 'GTI', 35.00, 15.00, 22.5, 50, 'BATCH-2024-001', CURRENT_DATE + INTERVAL '45 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'OG Kush 1/8oz', 'FLW-OG-001', 'Flower', 'GTI', 40.00, 18.00, 24.8, 30, 'BATCH-2024-002', CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Sour Diesel 1/8oz', 'FLW-SD-001', 'Flower', 'Rythm', 38.00, 16.00, 21.2, 25, 'BATCH-2024-003', CURRENT_DATE + INTERVAL '20 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Girl Scout Cookies 1/8oz', 'FLW-GSC-001', 'Flower', 'Rythm', 42.00, 19.00, 26.3, 40, 'BATCH-2024-004', CURRENT_DATE + INTERVAL '15 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Low THC Flower 1/8oz', 'FLW-LOW-001', 'Flower', 'GTI', 25.00, 10.00, 12.5, 60, 'BATCH-2024-005', CURRENT_DATE + INTERVAL '30 days', 'active', NOW(), NOW()),
  
  -- Vape Products
  (gen_random_uuid(), 'Vape Pen - Indica', 'VAPE-IND-001', 'Vape', 'GTI', 45.00, 20.00, 85.0, 100, 'BATCH-2024-006', CURRENT_DATE + INTERVAL '180 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Vape Pen - Sativa', 'VAPE-SAT-001', 'Vape', 'Rythm', 45.00, 20.00, 87.5, 80, 'BATCH-2024-007', CURRENT_DATE + INTERVAL '180 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Vape Pen - Hybrid', 'VAPE-HYB-001', 'Vape', 'GTI', 45.00, 20.00, 82.0, 90, 'BATCH-2024-008', CURRENT_DATE + INTERVAL '180 days', 'active', NOW(), NOW()),
  
  -- Edibles
  (gen_random_uuid(), 'Gummies 10pk - Mixed', 'EDI-GUM-001', 'Edibles', 'Incredibles', 30.00, 12.00, 10.0, 120, 'BATCH-2024-009', CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Chocolate Bar - Dark', 'EDI-CHO-001', 'Edibles', 'Incredibles', 25.00, 10.00, 10.0, 80, 'BATCH-2024-010', CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Mints 20pk', 'EDI-MIN-001', 'Edibles', 'GTI', 20.00, 8.00, 5.0, 150, 'BATCH-2024-011', CURRENT_DATE + INTERVAL '120 days', 'active', NOW(), NOW()),
  
  -- Concentrates
  (gen_random_uuid(), 'Live Resin - Blue Dream', 'CON-LR-001', 'Concentrates', 'Rythm', 60.00, 25.00, 78.5, 40, 'BATCH-2024-012', CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Shatter - OG Kush', 'CON-SH-001', 'Concentrates', 'GTI', 55.00, 22.00, 82.0, 35, 'BATCH-2024-013', CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  
  -- Pre-Rolls
  (gen_random_uuid(), 'Pre-Roll 1g - Indica', 'PR-IND-001', 'Pre-Rolls', 'GTI', 12.00, 5.00, 20.0, 200, 'BATCH-2024-014', CURRENT_DATE + INTERVAL '30 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Pre-Roll 1g - Sativa', 'PR-SAT-001', 'Pre-Rolls', 'Rythm', 12.00, 5.00, 21.5, 180, 'BATCH-2024-015', CURRENT_DATE + INTERVAL '30 days', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. SEED CUSTOMERS (Dispensaries with different tiers)
-- ============================================================================

INSERT INTO customers (id, business_legal_name, dba_name, tier, market, customer_type, status, cannabis_license_number, license_state, total_purchases, credit_limit, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Premium Dispensary LLC', 'Premium Cannabis', 'A', 'Illinois', 'Dispensary', 'active', 'IL-DISP-001', 'IL', 150000.00, 50000.00, NOW(), NOW()),
  (gen_random_uuid(), 'Mid-Tier Wellness Inc', 'Wellness Center', 'B', 'Illinois', 'Dispensary', 'active', 'IL-DISP-002', 'IL', 75000.00, 25000.00, NOW(), NOW()),
  (gen_random_uuid(), 'Budget Buds Co', 'Budget Cannabis', 'C', 'Illinois', 'Dispensary', 'active', 'IL-DISP-003', 'IL', 30000.00, 10000.00, NOW(), NOW()),
  (gen_random_uuid(), 'Elite Dispensary Group', 'Elite Cannabis', 'A', 'Michigan', 'Dispensary', 'active', 'MI-DISP-001', 'MI', 200000.00, 75000.00, NOW(), NOW()),
  (gen_random_uuid(), 'Standard Wellness MI', 'Standard Wellness', 'B', 'Michigan', 'Dispensary', 'active', 'MI-DISP-002', 'MI', 60000.00, 20000.00, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. SEED CUSTOMER DISCOUNTS (Tier-based pricing)
-- ============================================================================

INSERT INTO customer_discounts (id, name, level, target, type, value, customer_tiers, markets, start_date, end_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'A-Tier Brand Discount - GTI', 'brand', 'GTI', 'percentage', 15.00, ARRAY['A'], ARRAY['Illinois', 'Michigan'], CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'B-Tier Brand Discount - GTI', 'brand', 'GTI', 'percentage', 10.00, ARRAY['B'], ARRAY['Illinois', 'Michigan'], CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'C-Tier Brand Discount - GTI', 'brand', 'GTI', 'percentage', 5.00, ARRAY['C'], ARRAY['Illinois', 'Michigan'], CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  
  (gen_random_uuid(), 'A-Tier Category Discount - Flower', 'category', 'Flower', 'percentage', 12.00, ARRAY['A'], ARRAY['Illinois'], CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'B-Tier Category Discount - Edibles', 'category', 'Edibles', 'percentage', 8.00, ARRAY['B'], ARRAY['Illinois', 'Michigan'], CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  
  (gen_random_uuid(), 'Premium Customer - All Products', 'brand', 'Rythm', 'percentage', 18.00, ARRAY['A'], ARRAY['Michigan'], CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. SEED INVENTORY DISCOUNTS (Expiration & Low THC)
-- ============================================================================

INSERT INTO inventory_discounts (id, name, type, trigger_value, discount_type, discount_value, scope, scope_value, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), '30-Day Expiration Discount', 'expiration', 30, 'percentage', 15.00, 'all', NULL, 'active', NOW(), NOW()),
  (gen_random_uuid(), '15-Day Expiration Discount', 'expiration', 15, 'percentage', 25.00, 'all', NULL, 'active', NOW(), NOW()),
  (gen_random_uuid(), '7-Day Expiration Clearance', 'expiration', 7, 'percentage', 40.00, 'all', NULL, 'active', NOW(), NOW()),
  
  (gen_random_uuid(), 'Low THC Flower Discount', 'thc', 15.0, 'percentage', 20.00, 'category', 'Flower', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Low THC Edibles Discount', 'thc', 8.0, 'percentage', 15.00, 'category', 'Edibles', 'active', NOW(), NOW()),
  
  (gen_random_uuid(), 'GTI Brand Clearance', 'expiration', 20, 'percentage', 30.00, 'brand', 'GTI', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. SEED BOGO PROMOTIONS
-- ============================================================================

INSERT INTO bogo_promotions (id, name, type, trigger_level, trigger_value, reward_type, reward_value, start_date, end_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'BOGO Pre-Rolls', 'traditional', 'category', 'Pre-Rolls', 'free', 100.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Buy 2 Vapes, Get 50% Off 3rd', 'percentage', 'category', 'Vape', 'percentage', 50.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'BOGO Edibles - 50% Off', 'percentage', 'category', 'Edibles', 'percentage', 50.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Buy GTI Flower, Get $10 Off 2nd', 'fixed', 'brand', 'GTI', 'fixed', 10.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. SEED BUNDLE DEALS
-- ============================================================================

-- First, get product IDs for bundle creation (we'll use a subquery approach)
WITH product_ids AS (
  SELECT id, sku FROM products WHERE sku IN ('FLW-BD-001', 'VAPE-IND-001', 'EDI-GUM-001', 'PR-IND-001', 'CON-LR-001')
)
INSERT INTO bundle_deals (id, name, type, discount_type, discount_value, min_quantity, start_date, end_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Flower Power Bundle', 'category', 'percentage', 20.00, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Starter Pack', 'mix_match', 'fixed', 25.00, 4, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Premium Experience Bundle', 'fixed', 'percentage', 25.00, 5, CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. SEED PROMO CODES
-- ============================================================================

INSERT INTO promo_codes (id, code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, usage_count, per_customer_limit, start_date, end_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'WELCOME10', '10% off for new customers', 'percentage', 10.00, 0.00, NULL, 100, 0, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'SAVE20', '$20 off orders over $100', 'fixed', 20.00, 100.00, NULL, 500, 0, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FLASH50', '50% off flash sale', 'percentage', 50.00, 50.00, 100.00, 50, 0, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'BULK15', '15% off bulk orders over $500', 'percentage', 15.00, 500.00, 150.00, 200, 0, 5, CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'FIRSTORDER', '$50 off first order over $200', 'fixed', 50.00, 200.00, NULL, 1000, 0, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '180 days', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. SEED DISCOUNT RULES (Tier Management System)
-- ============================================================================

INSERT INTO discount_rules (id, name, description, rule_type, level, target_id, target_name, start_date, end_date, status, created_by, created_at, updated_at)
VALUES
  ('rule-001', 'GTI Brand Tiered Pricing', 'A/B/C tier pricing for all GTI products', 'customer_discount', 'brand', 'GTI', 'GTI Brand', CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days', 'active', 'system', NOW(), NOW()),
  ('rule-002', 'Flower Category Volume Pricing', 'Volume-based discounts for flower category', 'volume_pricing', 'category', 'Flower', 'Flower Category', CURRENT_DATE, CURRENT_DATE + INTERVAL '180 days', 'active', 'system', NOW(), NOW()),
  ('rule-003', 'Vape Category Tiered Pricing', 'A/B/C tier pricing for vape products', 'tiered_pricing', 'category', 'Vape', 'Vape Category', CURRENT_DATE, CURRENT_DATE + INTERVAL '180 days', 'active', 'system', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. SEED DISCOUNT RULE TIERS (A/B/C tier definitions)
-- ============================================================================

INSERT INTO discount_rule_tiers (id, rule_id, tier, discount_type, discount_value, min_quantity, max_quantity, created_at)
VALUES
  -- GTI Brand Tiered Pricing
  (gen_random_uuid()::text, 'rule-001', 'A', 'percentage', 15.00, 0, NULL, NOW()),
  (gen_random_uuid()::text, 'rule-001', 'B', 'percentage', 10.00, 0, NULL, NOW()),
  (gen_random_uuid()::text, 'rule-001', 'C', 'percentage', 5.00, 0, NULL, NOW()),
  
  -- Flower Volume Pricing
  (gen_random_uuid()::text, 'rule-002', 'A', 'percentage', 20.00, 10, NULL, NOW()),
  (gen_random_uuid()::text, 'rule-002', 'B', 'percentage', 15.00, 5, 9, NOW()),
  (gen_random_uuid()::text, 'rule-002', 'C', 'percentage', 10.00, 1, 4, NOW()),
  
  -- Vape Tiered Pricing
  (gen_random_uuid()::text, 'rule-003', 'A', 'percentage', 18.00, 0, NULL, NOW()),
  (gen_random_uuid()::text, 'rule-003', 'B', 'percentage', 12.00, 0, NULL, NOW()),
  (gen_random_uuid()::text, 'rule-003', 'C', 'percentage', 8.00, 0, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. SEED CUSTOMER TIER ASSIGNMENTS
-- ============================================================================

-- Assign customers to tiers for each rule
WITH customers_list AS (
  SELECT id, tier FROM customers LIMIT 5
)
INSERT INTO customer_tier_assignments (id, rule_id, customer_id, tier, assigned_date, assigned_by, notes, created_at, updated_at)
SELECT 
  gen_random_uuid()::text,
  'rule-001',
  id,
  tier,
  CURRENT_DATE,
  'system',
  'Auto-assigned based on customer tier',
  NOW(),
  NOW()
FROM customers_list
ON CONFLICT (rule_id, customer_id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count records created
DO $$
DECLARE
  product_count INTEGER;
  customer_count INTEGER;
  discount_count INTEGER;
  promo_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  SELECT COUNT(*) INTO customer_count FROM customers;
  SELECT COUNT(*) INTO discount_count FROM customer_discounts;
  SELECT COUNT(*) INTO promo_count FROM bogo_promotions;
  
  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'Products: %', product_count;
  RAISE NOTICE 'Customers: %', customer_count;
  RAISE NOTICE 'Customer Discounts: %', discount_count;
  RAISE NOTICE 'BOGO Promotions: %', promo_count;
END $$;
