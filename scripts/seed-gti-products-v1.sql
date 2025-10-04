-- GTI Product Catalog Seed Data
-- Based on Green Thumb Industries brands and product lines
-- Version 1.0

-- Insert GTI Brands
INSERT INTO brands (id, name, description, logo_url, website_url, is_active, created_at, updated_at)
VALUES
  ('brand-rythm', 'RYTHM', 'Premium cannabis flower, vape, pre-rolls and concentrates inspired by music and culture', 'https://rythm.com/logo.png', 'https://rythm.com', true, NOW(), NOW()),
  ('brand-dogwalkers', 'Dogwalkers', 'Premium pre-rolls for simple moments of enjoyment. Supporting animal shelters with every purchase.', 'https://dogwalkersprerolls.com/logo.png', 'https://dogwalkersprerolls.com', true, NOW(), NOW()),
  ('brand-incredibles', 'incredibles', 'The Credible Edible - Chocolates, gummies, mints, and tarts with accurate dosing', 'https://iloveincredibles.com/logo.png', 'https://iloveincredibles.com', true, NOW(), NOW()),
  ('brand-beboe', 'Beboe', 'Luxury cannabis experience with 100% natural ingredients and socially-dosed THC', 'https://beboe.com/logo.png', 'https://beboe.com', true, NOW(), NOW()),
  ('brand-goodgreen', 'Good Green', 'Cannabis as a catalyst to wellness, supporting education, employment, and expungement', 'https://good.green/logo.png', 'https://good.green', true, NOW(), NOW()),
  ('brand-drsolomon', 'Doctor Solomon''s', 'Scientifically advanced cannabinoid formulations for wellness and relief', 'https://www.doctorsolomons.com/logo.png', 'https://www.doctorsolomons.com', true, NOW(), NOW()),
  ('brand-shine', '&Shine', 'Good cannabis for good times - versatile products for any mood or situation', 'https://risecannabis.com/shine', 'https://risecannabis.com', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- RYTHM Products (Flower, Vape, Pre-rolls, Concentrates)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, weight_grams, thc_percentage, cbd_percentage, strain_type, is_active, created_at, updated_at)
VALUES
  -- RYTHM Flower
  ('prod-rythm-001', 'RYTHM-FL-001', 'RYTHM Black Afghan', 'Premium indica flower with earthy, spicy notes', 'brand-rythm', 'Flower', 'Premium Flower', 45.00, 22.50, 'eighth', 3.5, 24.5, 0.2, 'Indica', true, NOW(), NOW()),
  ('prod-rythm-002', 'RYTHM-FL-002', 'RYTHM Sour Diesel', 'Classic sativa with diesel and citrus aroma', 'brand-rythm', 'Flower', 'Premium Flower', 45.00, 22.50, 'eighth', 3.5, 22.8, 0.1, 'Sativa', true, NOW(), NOW()),
  ('prod-rythm-003', 'RYTHM-FL-003', 'RYTHM Brownie Scout', 'Hybrid strain with sweet, chocolatey flavor', 'brand-rythm', 'Flower', 'Premium Flower', 50.00, 25.00, 'eighth', 3.5, 26.3, 0.3, 'Hybrid', true, NOW(), NOW()),
  ('prod-rythm-004', 'RYTHM-FL-004', 'RYTHM Sunset Sherbet', 'Indica-dominant hybrid with fruity, sweet profile', 'brand-rythm', 'Flower', 'Premium Flower', 48.00, 24.00, 'eighth', 3.5, 25.1, 0.2, 'Indica', true, NOW(), NOW()),
  
  -- RYTHM Vapes
  ('prod-rythm-101', 'RYTHM-VP-101', 'RYTHM Vape - Blue Dream', '500mg vape cartridge, uplifting hybrid', 'brand-rythm', 'Vape', 'Cartridge', 40.00, 18.00, 'cartridge', 0.5, 85.0, 0.5, 'Hybrid', true, NOW(), NOW()),
  ('prod-rythm-102', 'RYTHM-VP-102', 'RYTHM Vape - Kosher Kush', '500mg vape cartridge, relaxing indica', 'brand-rythm', 'Vape', 'Cartridge', 40.00, 18.00, 'cartridge', 0.5, 87.2, 0.3, 'Indica', true, NOW(), NOW()),
  ('prod-rythm-103', 'RYTHM-VP-103', 'RYTHM Vape - Jack Herer', '500mg vape cartridge, energizing sativa', 'brand-rythm', 'Vape', 'Cartridge', 40.00, 18.00, 'cartridge', 0.5, 84.5, 0.4, 'Sativa', true, NOW(), NOW()),
  
  -- RYTHM Pre-rolls
  ('prod-rythm-201', 'RYTHM-PR-201', 'RYTHM Pre-roll 3-Pack', 'Three 0.5g premium pre-rolls, mixed strains', 'brand-rythm', 'Pre-rolls', 'Multi-pack', 25.00, 12.00, 'pack', 1.5, 23.0, 0.2, 'Hybrid', true, NOW(), NOW()),
  
  -- RYTHM Concentrates
  ('prod-rythm-301', 'RYTHM-CN-301', 'RYTHM Live Resin - Gelato', '1g live resin concentrate, sweet and creamy', 'brand-rythm', 'Concentrates', 'Live Resin', 60.00, 28.00, 'gram', 1.0, 78.5, 0.1, 'Hybrid', true, NOW(), NOW()),
  ('prod-rythm-302', 'RYTHM-CN-302', 'RYTHM Shatter - OG Kush', '1g shatter concentrate, classic OG', 'brand-rythm', 'Concentrates', 'Shatter', 55.00, 26.00, 'gram', 1.0, 82.3, 0.2, 'Hybrid', true, NOW(), NOW());

-- Dogwalkers Products (Pre-rolls)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, weight_grams, thc_percentage, cbd_percentage, strain_type, is_active, created_at, updated_at)
VALUES
  ('prod-dog-001', 'DOG-PR-001', 'Dogwalkers Mini Pre-rolls 7-Pack', 'Seven 0.35g mini pre-rolls, perfect for a quick walk', 'brand-dogwalkers', 'Pre-rolls', 'Mini Pre-rolls', 28.00, 13.00, 'pack', 2.45, 20.5, 0.3, 'Hybrid', true, NOW(), NOW()),
  ('prod-dog-002', 'DOG-PR-002', 'Dogwalkers Indica 5-Pack', 'Five 0.5g indica pre-rolls for relaxation', 'brand-dogwalkers', 'Pre-rolls', 'Standard Pre-rolls', 30.00, 14.00, 'pack', 2.5, 22.0, 0.2, 'Indica', true, NOW(), NOW()),
  ('prod-dog-003', 'DOG-PR-003', 'Dogwalkers Sativa 5-Pack', 'Five 0.5g sativa pre-rolls for energy', 'brand-dogwalkers', 'Pre-rolls', 'Standard Pre-rolls', 30.00, 14.00, 'pack', 2.5, 21.5, 0.3, 'Sativa', true, NOW(), NOW()),
  ('prod-dog-004', 'DOG-PR-004', 'Dogwalkers Summer 6-Pack', 'Six refreshing pre-rolls for summer vibes', 'brand-dogwalkers', 'Pre-rolls', 'Seasonal', 32.00, 15.00, 'pack', 3.0, 20.0, 0.4, 'Hybrid', true, NOW(), NOW());

-- incredibles Products (Edibles)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, thc_mg, cbd_mg, is_active, created_at, updated_at)
VALUES
  -- Chocolates
  ('prod-incr-001', 'INCR-CH-001', 'incredibles Chocolate Bar - Milk Chocolate', '100mg THC chocolate bar, 10 pieces x 10mg', 'brand-incredibles', 'Edibles', 'Chocolate', 20.00, 8.00, 'bar', 100, 0, true, NOW(), NOW()),
  ('prod-incr-002', 'INCR-CH-002', 'incredibles Chocolate Bar - Peanut Butter', '100mg THC peanut butter chocolate, 10 pieces', 'brand-incredibles', 'Edibles', 'Chocolate', 20.00, 8.00, 'bar', 100, 0, true, NOW(), NOW()),
  ('prod-incr-003', 'INCR-CH-003', 'incredibles Chocolate Bar - Mint', '100mg THC mint chocolate, refreshing flavor', 'brand-incredibles', 'Edibles', 'Chocolate', 20.00, 8.00, 'bar', 100, 0, true, NOW(), NOW()),
  
  -- Gummies
  ('prod-incr-101', 'INCR-GM-101', 'incredibles Gummies - Watermelon', '100mg THC gummies, 10 pieces x 10mg', 'brand-incredibles', 'Edibles', 'Gummies', 18.00, 7.50, 'pack', 100, 0, true, NOW(), NOW()),
  ('prod-incr-102', 'INCR-GM-102', 'incredibles Gummies - Strawberry', '100mg THC strawberry gummies, 10 pieces', 'brand-incredibles', 'Edibles', 'Gummies', 18.00, 7.50, 'pack', 100, 0, true, NOW(), NOW()),
  ('prod-incr-103', 'INCR-GM-103', 'incredibles Gummies - Mixed Berry', '100mg THC mixed berry gummies, 10 pieces', 'brand-incredibles', 'Edibles', 'Gummies', 18.00, 7.50, 'pack', 100, 0, true, NOW(), NOW()),
  
  -- Mints
  ('prod-incr-201', 'INCR-MN-201', 'incredibles Mints - Peppermint', '100mg THC mints, 20 pieces x 5mg', 'brand-incredibles', 'Edibles', 'Mints', 16.00, 6.50, 'tin', 100, 0, true, NOW(), NOW()),
  ('prod-incr-202', 'INCR-MN-202', 'incredibles Mints - Cinnamon', '100mg THC cinnamon mints, 20 pieces', 'brand-incredibles', 'Edibles', 'Mints', 16.00, 6.50, 'tin', 100, 0, true, NOW(), NOW()),
  
  -- Tarts
  ('prod-incr-301', 'INCR-TR-301', 'incredibles Tarts - Blueberry', '100mg THC blueberry tarts, tangy and sweet', 'brand-incredibles', 'Edibles', 'Tarts', 18.00, 7.50, 'pack', 100, 0, true, NOW(), NOW());

-- Beboe Products (Luxury Cannabis)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, thc_mg, cbd_mg, is_active, created_at, updated_at)
VALUES
  ('prod-beb-001', 'BEB-ED-001', 'Beboe Pastilles - Rose Gold', 'Luxury low-dose pastilles, 2.5mg THC each, 20 pieces', 'brand-beboe', 'Edibles', 'Pastilles', 30.00, 12.00, 'tin', 50, 0, true, NOW(), NOW()),
  ('prod-beb-002', 'BEB-ED-002', 'Beboe Pastilles - Inspired', 'Energizing pastilles with natural ingredients', 'brand-beboe', 'Edibles', 'Pastilles', 30.00, 12.00, 'tin', 50, 0, true, NOW(), NOW()),
  ('prod-beb-003', 'BEB-VP-003', 'Beboe Vape Pen - Inspired Blend', 'Luxury vape pen, 250mg THC, uplifting blend', 'brand-beboe', 'Vape', 'Disposable', 45.00, 20.00, 'pen', 250, 0, true, NOW(), NOW());

-- Good Green Products (Wellness Cannabis)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, weight_grams, thc_percentage, cbd_percentage, strain_type, is_active, created_at, updated_at)
VALUES
  ('prod-gg-001', 'GG-FL-001', 'Good Green Flower - Wellness Blend', 'Balanced hybrid flower for daily wellness', 'brand-goodgreen', 'Flower', 'Wellness Flower', 40.00, 19.00, 'eighth', 3.5, 18.5, 2.5, 'Hybrid', true, NOW(), NOW()),
  ('prod-gg-002', 'GG-PR-002', 'Good Green Pre-rolls 5-Pack', 'Five 0.5g pre-rolls, community-focused cannabis', 'brand-goodgreen', 'Pre-rolls', 'Standard Pre-rolls', 28.00, 13.00, 'pack', 2.5, 19.0, 2.0, 'Hybrid', true, NOW(), NOW()),
  ('prod-gg-003', 'GG-VP-003', 'Good Green Vape - Balance', '500mg vape cartridge, balanced THC:CBD', 'brand-goodgreen', 'Vape', 'Cartridge', 38.00, 17.00, 'cartridge', 0.5, 70.0, 15.0, 'Hybrid', true, NOW(), NOW());

-- Doctor Solomon's Products (Topicals & Wellness)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, thc_mg, cbd_mg, is_active, created_at, updated_at)
VALUES
  ('prod-ds-001', 'DS-TP-001', 'Doctor Solomon''s Rescue Balm', 'Topical balm, 200mg CBD + 200mg THC for relief', 'brand-drsolomon', 'Topicals', 'Balm', 45.00, 20.00, 'jar', 200, 200, true, NOW(), NOW()),
  ('prod-ds-002', 'DS-TP-002', 'Doctor Solomon''s Body Oil', 'Therapeutic body oil, 100mg CBD + 100mg THC', 'brand-drsolomon', 'Topicals', 'Oil', 50.00, 22.00, 'bottle', 100, 100, true, NOW(), NOW()),
  ('prod-ds-003', 'DS-TP-003', 'Doctor Solomon''s Doze Drops', 'Sleep aid tincture, 500mg CBD + 100mg THC', 'brand-drsolomon', 'Tinctures', 'Sleep Aid', 55.00, 24.00, 'bottle', 100, 500, true, NOW(), NOW());

-- &Shine Products (Versatile Cannabis)
INSERT INTO products (id, sku, name, description, brand_id, category, subcategory, base_price, cost, unit, weight_grams, thc_percentage, cbd_percentage, strain_type, is_active, created_at, updated_at)
VALUES
  ('prod-sh-001', 'SH-FL-001', '&Shine Flower - Let''s Goooo', 'Energizing sativa flower for active days', 'brand-shine', 'Flower', 'Standard Flower', 35.00, 16.00, 'eighth', 3.5, 21.0, 0.3, 'Sativa', true, NOW(), NOW()),
  ('prod-sh-002', 'SH-FL-002', '&Shine Flower - All Gooood', 'Relaxing indica flower for chill times', 'brand-shine', 'Flower', 'Standard Flower', 35.00, 16.00, 'eighth', 3.5, 20.5, 0.4, 'Indica', true, NOW(), NOW()),
  ('prod-sh-003', 'SH-PR-003', '&Shine Pre-rolls 3-Pack', 'Three 0.75g pre-rolls, good times guaranteed', 'brand-shine', 'Pre-rolls', 'Standard Pre-rolls', 22.00, 10.00, 'pack', 2.25, 19.5, 0.5, 'Hybrid', true, NOW(), NOW()),
  ('prod-sh-004', 'SH-GM-004', '&Shine Gummies - Down for Whatever', '100mg THC gummies, versatile hybrid blend', 'brand-shine', 'Edibles', 'Gummies', 16.00, 6.50, 'pack', NULL, NULL, NULL, NULL, true, NOW(), NOW());

-- Update inventory for all products
INSERT INTO inventory (product_id, location_id, quantity_on_hand, quantity_reserved, reorder_point, reorder_quantity, last_restock_date, created_at, updated_at)
SELECT 
  p.id,
  'loc-warehouse-01',
  FLOOR(RANDOM() * 500 + 100)::int,
  FLOOR(RANDOM() * 50)::int,
  50,
  200,
  NOW() - INTERVAL '7 days',
  NOW(),
  NOW()
FROM products p
WHERE p.brand_id IN ('brand-rythm', 'brand-dogwalkers', 'brand-incredibles', 'brand-beboe', 'brand-goodgreen', 'brand-drsolomon', 'brand-shine')
ON CONFLICT (product_id, location_id) DO NOTHING;

-- Add some market pricing data
INSERT INTO market_pricing (product_id, market_id, competitor_price, our_price, price_difference, last_updated, created_at, updated_at)
SELECT 
  p.id,
  'market-il-chicago',
  p.base_price * (1 + (RANDOM() * 0.3 - 0.15)),
  p.base_price,
  0,
  NOW(),
  NOW(),
  NOW()
FROM products p
WHERE p.brand_id IN ('brand-rythm', 'brand-dogwalkers', 'brand-incredibles', 'brand-beboe', 'brand-goodgreen', 'brand-drsolomon', 'brand-shine')
ON CONFLICT (product_id, market_id) DO NOTHING;

COMMIT;
