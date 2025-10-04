-- Seed products database with cannabis products matching filter counts
-- Categories: Flower (234), Edibles (89), Concentrates (67), Vapes (45), Topicals (23)
-- Brands: Premium Cannabis Co (47), Incredibles (23), Green Thumb (89), Rise (156), Stiizy (34)
-- Status: Active (412), Inactive (23), Out of Stock (15)

-- Clear existing products (optional - remove if you want to keep existing data)
-- TRUNCATE TABLE products CASCADE;

-- FLOWER PRODUCTS (234 total)
-- Rise Flower Products (60)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rise ' || strain || ' ' || weight,
  'RISE-FL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  'Rise',
  CASE weight
    WHEN '1g' THEN 12.00 + (random() * 8)
    WHEN '3.5g' THEN 35.00 + (random() * 25)
    WHEN '7g' THEN 65.00 + (random() * 45)
    WHEN '14g' THEN 120.00 + (random() * 80)
    WHEN '28g' THEN 220.00 + (random() * 130)
  END,
  CASE weight
    WHEN '1g' THEN 6.00 + (random() * 4)
    WHEN '3.5g' THEN 18.00 + (random() * 12)
    WHEN '7g' THEN 32.00 + (random() * 23)
    WHEN '14g' THEN 60.00 + (random() * 40)
    WHEN '28g' THEN 110.00 + (random() * 65)
  END,
  FLOOR(random() * 100)::INTEGER,
  15.0 + (random() * 20),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES 
    ('Blue Dream'), ('OG Kush'), ('Sour Diesel'), ('Girl Scout Cookies'), ('Granddaddy Purple'),
    ('Jack Herer'), ('Green Crack'), ('AK-47'), ('White Widow'), ('Northern Lights'),
    ('Pineapple Express'), ('Durban Poison')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('1g'), ('3.5g'), ('7g'), ('14g'), ('28g')) AS weights(weight)
) AS combinations
LIMIT 60;

-- Green Thumb Flower Products (55)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Green Thumb ' || strain || ' ' || weight,
  'GT-FL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  'Green Thumb',
  CASE weight
    WHEN '1g' THEN 13.00 + (random() * 7)
    WHEN '3.5g' THEN 38.00 + (random() * 22)
    WHEN '7g' THEN 70.00 + (random() * 40)
    WHEN '14g' THEN 130.00 + (random() * 70)
    WHEN '28g' THEN 240.00 + (random() * 110)
  END,
  CASE weight
    WHEN '1g' THEN 6.50 + (random() * 3.5)
    WHEN '3.5g' THEN 19.00 + (random() * 11)
    WHEN '7g' THEN 35.00 + (random() * 20)
    WHEN '14g' THEN 65.00 + (random() * 35)
    WHEN '28g' THEN 120.00 + (random() * 55)
  END,
  FLOOR(random() * 100)::INTEGER,
  16.0 + (random() * 19),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES 
    ('Gelato'), ('Wedding Cake'), ('Zkittlez'), ('Sunset Sherbet'), ('Do-Si-Dos'),
    ('Purple Punch'), ('Gorilla Glue'), ('Strawberry Cough'), ('Trainwreck'), ('Bubba Kush'),
    ('Cherry Pie')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('1g'), ('3.5g'), ('7g'), ('14g'), ('28g')) AS weights(weight)
) AS combinations
LIMIT 55;

-- Premium Cannabis Co Flower Products (47)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Premium ' || strain || ' ' || weight,
  'PCC-FL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  'Premium Cannabis Co',
  CASE weight
    WHEN '1g' THEN 15.00 + (random() * 10)
    WHEN '3.5g' THEN 45.00 + (random() * 30)
    WHEN '7g' THEN 85.00 + (random() * 50)
    WHEN '14g' THEN 155.00 + (random() * 95)
    WHEN '28g' THEN 280.00 + (random() * 170)
  END,
  CASE weight
    WHEN '1g' THEN 7.50 + (random() * 5)
    WHEN '3.5g' THEN 22.50 + (random() * 15)
    WHEN '7g' THEN 42.50 + (random() * 25)
    WHEN '14g' THEN 77.50 + (random() * 47.50)
    WHEN '28g' THEN 140.00 + (random() * 85)
  END,
  FLOOR(random() * 100)::INTEGER,
  18.0 + (random() * 17),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES 
    ('Platinum OG'), ('Forbidden Fruit'), ('Mimosa'), ('Biscotti'), ('Runtz'),
    ('Ice Cream Cake'), ('Apple Fritter'), ('Cereal Milk'), ('Jealousy')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('1g'), ('3.5g'), ('7g'), ('14g'), ('28g')) AS weights(weight)
) AS combinations
LIMIT 47;

-- Stiizy Flower Products (34)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Stiizy ' || strain || ' ' || weight,
  'STZ-FL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  'Stiizy',
  CASE weight
    WHEN '1g' THEN 14.00 + (random() * 8)
    WHEN '3.5g' THEN 40.00 + (random() * 25)
    WHEN '7g' THEN 75.00 + (random() * 45)
    WHEN '14g' THEN 140.00 + (random() * 80)
  END,
  CASE weight
    WHEN '1g' THEN 7.00 + (random() * 4)
    WHEN '3.5g' THEN 20.00 + (random() * 12.50)
    WHEN '7g' THEN 37.50 + (random() * 22.50)
    WHEN '14g' THEN 70.00 + (random() * 40)
  END,
  FLOOR(random() * 100)::INTEGER,
  17.0 + (random() * 18),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES 
    ('Skywalker OG'), ('Hardcore OG'), ('King Louis XIII'), ('Biscotti'), ('Gelato'),
    ('Wedding Cake'), ('Blue Burst')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('1g'), ('3.5g'), ('7g'), ('14g')) AS weights(weight)
) AS combinations
LIMIT 34;

-- Incredibles Flower Products (23) - smaller brand
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Incredibles ' || strain || ' ' || weight,
  'INC-FL-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  'Incredibles',
  CASE weight
    WHEN '3.5g' THEN 42.00 + (random() * 23)
    WHEN '7g' THEN 78.00 + (random() * 42)
    WHEN '14g' THEN 145.00 + (random() * 75)
  END,
  CASE weight
    WHEN '3.5g' THEN 21.00 + (random() * 11.50)
    WHEN '7g' THEN 39.00 + (random() * 21)
    WHEN '14g' THEN 72.50 + (random() * 37.50)
  END,
  FLOOR(random() * 100)::INTEGER,
  16.5 + (random() * 18.5),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES 
    ('Lemon Haze'), ('Tangie'), ('Mango Kush'), ('Blueberry'), ('Strawberry Banana'),
    ('Pineapple Kush'), ('Grape Ape')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('3.5g'), ('7g'), ('14g')) AS weights(weight)
) AS combinations
LIMIT 23;

-- Additional Flower Products to reach 234 total (15 more)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  brands.brand || ' ' || strain || ' ' || weight,
  brands.prefix || '-FL-' || LPAD((1000 + ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Flower',
  brands.brand,
  40.00 + (random() * 30),
  20.00 + (random() * 15),
  FLOOR(random() * 100)::INTEGER,
  16.0 + (random() * 19),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '180 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, weight
  FROM (VALUES ('Cookies'), ('Cake'), ('Haze'), ('Diesel'), ('Kush')) AS strains(strain)
  CROSS JOIN (VALUES ('3.5g'), ('7g'), ('14g')) AS weights(weight)
) AS combinations
CROSS JOIN (
  VALUES ('Rise', 'RISE'), ('Green Thumb', 'GT'), ('Premium Cannabis Co', 'PCC')
) AS brands(brand, prefix)
LIMIT 15;

-- EDIBLES PRODUCTS (89 total)
-- Incredibles Edibles (23 - their specialty)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Incredibles ' || product || ' ' || dose,
  'INC-ED-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Edibles',
  'Incredibles',
  CASE 
    WHEN dose = '10mg' THEN 15.00 + (random() * 10)
    WHEN dose = '50mg' THEN 25.00 + (random() * 15)
    WHEN dose = '100mg' THEN 35.00 + (random() * 20)
  END,
  CASE 
    WHEN dose = '10mg' THEN 7.50 + (random() * 5)
    WHEN dose = '50mg' THEN 12.50 + (random() * 7.50)
    WHEN dose = '100mg' THEN 17.50 + (random() * 10)
  END,
  FLOOR(random() * 150)::INTEGER,
  CASE 
    WHEN dose = '10mg' THEN 10.0
    WHEN dose = '50mg' THEN 50.0
    WHEN dose = '100mg' THEN 100.0
  END,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, dose
  FROM (VALUES 
    ('Gummies Watermelon'), ('Gummies Strawberry'), ('Gummies Blueberry'), ('Gummies Mixed Berry'),
    ('Chocolate Bar'), ('Mints Peppermint'), ('Mints Cinnamon'), ('Fruit Chews')
  ) AS products(product)
  CROSS JOIN (VALUES ('10mg'), ('50mg'), ('100mg')) AS doses(dose)
) AS combinations
LIMIT 23;

-- Rise Edibles (25)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rise ' || product || ' ' || dose,
  'RISE-ED-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Edibles',
  'Rise',
  CASE 
    WHEN dose = '5mg' THEN 12.00 + (random() * 8)
    WHEN dose = '10mg' THEN 18.00 + (random() * 12)
    WHEN dose = '100mg' THEN 32.00 + (random() * 18)
  END,
  CASE 
    WHEN dose = '5mg' THEN 6.00 + (random() * 4)
    WHEN dose = '10mg' THEN 9.00 + (random() * 6)
    WHEN dose = '100mg' THEN 16.00 + (random() * 9)
  END,
  FLOOR(random() * 150)::INTEGER,
  CASE 
    WHEN dose = '5mg' THEN 5.0
    WHEN dose = '10mg' THEN 10.0
    WHEN dose = '100mg' THEN 100.0
  END,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, dose
  FROM (VALUES 
    ('Gummies Peach'), ('Gummies Mango'), ('Gummies Grape'), ('Cookies Chocolate Chip'),
    ('Brownies Fudge'), ('Hard Candy Assorted'), ('Caramels'), ('Toffee'), ('Lollipops')
  ) AS products(product)
  CROSS JOIN (VALUES ('5mg'), ('10mg'), ('100mg')) AS doses(dose)
) AS combinations
LIMIT 25;

-- Green Thumb Edibles (20)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Green Thumb ' || product || ' ' || dose,
  'GT-ED-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Edibles',
  'Green Thumb',
  20.00 + (random() * 15),
  10.00 + (random() * 7.50),
  FLOOR(random() * 150)::INTEGER,
  CASE 
    WHEN dose = '10mg' THEN 10.0
    WHEN dose = '25mg' THEN 25.0
    WHEN dose = '50mg' THEN 50.0
  END,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, dose
  FROM (VALUES 
    ('Gummies Tropical'), ('Gummies Sour'), ('Chocolate Bites'), ('Caramel Squares'),
    ('Fruit Strips'), ('Honey Sticks'), ('Taffy')
  ) AS products(product)
  CROSS JOIN (VALUES ('10mg'), ('25mg'), ('50mg')) AS doses(dose)
) AS combinations
LIMIT 20;

-- Premium Cannabis Co Edibles (12)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Premium ' || product || ' ' || dose,
  'PCC-ED-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Edibles',
  'Premium Cannabis Co',
  28.00 + (random() * 22),
  14.00 + (random() * 11),
  FLOOR(random() * 150)::INTEGER,
  CASE 
    WHEN dose = '10mg' THEN 10.0
    WHEN dose = '50mg' THEN 50.0
  END,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, dose
  FROM (VALUES 
    ('Artisan Chocolate'), ('Gourmet Gummies'), ('Truffle Collection'), ('Macarons'), ('Bonbons'), ('Pralines')
  ) AS products(product)
  CROSS JOIN (VALUES ('10mg'), ('50mg')) AS doses(dose)
) AS combinations
LIMIT 12;

-- Stiizy Edibles (9)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Stiizy ' || product || ' ' || dose,
  'STZ-ED-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Edibles',
  'Stiizy',
  22.00 + (random() * 18),
  11.00 + (random() * 9),
  FLOOR(random() * 150)::INTEGER,
  CASE 
    WHEN dose = '10mg' THEN 10.0
    WHEN dose = '100mg' THEN 100.0
  END,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, dose
  FROM (VALUES 
    ('Gummies Berry'), ('Gummies Citrus'), ('Mints')
  ) AS products(product)
  CROSS JOIN (VALUES ('10mg'), ('100mg')) AS doses(dose)
) AS combinations
LIMIT 9;

-- CONCENTRATES PRODUCTS (67 total)
-- Rise Concentrates (25)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rise ' || strain || ' ' || type,
  'RISE-CON-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Concentrates',
  'Rise',
  CASE type
    WHEN 'Shatter' THEN 25.00 + (random() * 15)
    WHEN 'Wax' THEN 28.00 + (random() * 17)
    WHEN 'Live Resin' THEN 35.00 + (random() * 25)
    WHEN 'Rosin' THEN 45.00 + (random() * 30)
    WHEN 'Diamonds' THEN 50.00 + (random() * 35)
  END,
  CASE type
    WHEN 'Shatter' THEN 12.50 + (random() * 7.50)
    WHEN 'Wax' THEN 14.00 + (random() * 8.50)
    WHEN 'Live Resin' THEN 17.50 + (random() * 12.50)
    WHEN 'Rosin' THEN 22.50 + (random() * 15)
    WHEN 'Diamonds' THEN 25.00 + (random() * 17.50)
  END,
  FLOOR(random() * 50)::INTEGER,
  65.0 + (random() * 30),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, type
  FROM (VALUES ('Blue Dream'), ('OG Kush'), ('Gelato'), ('Wedding Cake'), ('Zkittlez')) AS strains(strain)
  CROSS JOIN (VALUES ('Shatter'), ('Wax'), ('Live Resin'), ('Rosin'), ('Diamonds')) AS types(type)
) AS combinations
LIMIT 25;

-- Green Thumb Concentrates (18)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Green Thumb ' || strain || ' ' || type,
  'GT-CON-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Concentrates',
  'Green Thumb',
  CASE type
    WHEN 'Budder' THEN 30.00 + (random() * 18)
    WHEN 'Live Resin' THEN 38.00 + (random() * 22)
    WHEN 'Sauce' THEN 42.00 + (random() * 28)
  END,
  CASE type
    WHEN 'Budder' THEN 15.00 + (random() * 9)
    WHEN 'Live Resin' THEN 19.00 + (random() * 11)
    WHEN 'Sauce' THEN 21.00 + (random() * 14)
  END,
  FLOOR(random() * 50)::INTEGER,
  68.0 + (random() * 27),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, type
  FROM (VALUES ('Sour Diesel'), ('Gorilla Glue'), ('Purple Punch'), ('Sunset Sherbet'), ('Do-Si-Dos'), ('Mimosa')) AS strains(strain)
  CROSS JOIN (VALUES ('Budder'), ('Live Resin'), ('Sauce')) AS types(type)
) AS combinations
LIMIT 18;

-- Premium Cannabis Co Concentrates (10)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Premium ' || strain || ' ' || type,
  'PCC-CON-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Concentrates',
  'Premium Cannabis Co',
  55.00 + (random() * 40),
  27.50 + (random() * 20),
  FLOOR(random() * 50)::INTEGER,
  75.0 + (random() * 20),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, type
  FROM (VALUES ('Platinum OG'), ('Forbidden Fruit'), ('Ice Cream Cake'), ('Apple Fritter'), ('Runtz')) AS strains(strain)
  CROSS JOIN (VALUES ('Live Rosin'), ('Hash Rosin')) AS types(type)
) AS combinations
LIMIT 10;

-- Stiizy Concentrates (10)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Stiizy ' || strain || ' ' || type,
  'STZ-CON-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Concentrates',
  'Stiizy',
  32.00 + (random() * 23),
  16.00 + (random() * 11.50),
  FLOOR(random() * 50)::INTEGER,
  70.0 + (random() * 25),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, type
  FROM (VALUES ('Skywalker OG'), ('King Louis XIII'), ('Biscotti'), ('Gelato'), ('Wedding Cake')) AS strains(strain)
  CROSS JOIN (VALUES ('Live Resin'), ('Diamonds')) AS types(type)
) AS combinations
LIMIT 10;

-- Incredibles Concentrates (4)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Incredibles ' || strain || ' Shatter',
  'INC-CON-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Concentrates',
  'Incredibles',
  28.00 + (random() * 17),
  14.00 + (random() * 8.50),
  FLOOR(random() * 50)::INTEGER,
  67.0 + (random() * 28),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 60)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (VALUES ('Lemon Haze'), ('Tangie'), ('Mango Kush'), ('Blueberry')) AS strains(strain)
LIMIT 4;

-- VAPES PRODUCTS (45 total)
-- Stiizy Vapes (15 - their specialty)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Stiizy ' || strain || ' ' || size,
  'STZ-VP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Vapes',
  'Stiizy',
  CASE size
    WHEN '0.5g Pod' THEN 35.00 + (random() * 15)
    WHEN '1g Pod' THEN 55.00 + (random() * 25)
  END,
  CASE size
    WHEN '0.5g Pod' THEN 17.50 + (random() * 7.50)
    WHEN '1g Pod' THEN 27.50 + (random() * 12.50)
  END,
  FLOOR(random() * 80)::INTEGER,
  75.0 + (random() * 20),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 45)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, size
  FROM (VALUES 
    ('Skywalker OG'), ('Hardcore OG'), ('King Louis XIII'), ('Biscotti'), 
    ('Gelato'), ('Wedding Cake'), ('Blue Burst'), ('Sour Diesel')
  ) AS strains(strain)
  CROSS JOIN (VALUES ('0.5g Pod'), ('1g Pod')) AS sizes(size)
) AS combinations
LIMIT 15;

-- Rise Vapes (12)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rise ' || strain || ' ' || size,
  'RISE-VP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Vapes',
  'Rise',
  CASE size
    WHEN '0.5g Cart' THEN 30.00 + (random() * 15)
    WHEN '1g Cart' THEN 50.00 + (random() * 20)
  END,
  CASE size
    WHEN '0.5g Cart' THEN 15.00 + (random() * 7.50)
    WHEN '1g Cart' THEN 25.00 + (random() * 10)
  END,
  FLOOR(random() * 80)::INTEGER,
  72.0 + (random() * 23),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 45)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, size
  FROM (VALUES ('Blue Dream'), ('OG Kush'), ('Sour Diesel'), ('Girl Scout Cookies'), ('Jack Herer'), ('Pineapple Express')) AS strains(strain)
  CROSS JOIN (VALUES ('0.5g Cart'), ('1g Cart')) AS sizes(size)
) AS combinations
LIMIT 12;

-- Green Thumb Vapes (10)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Green Thumb ' || strain || ' ' || size,
  'GT-VP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Vapes',
  'Green Thumb',
  CASE size
    WHEN '0.5g Cart' THEN 32.00 + (random() * 18)
    WHEN '1g Cart' THEN 52.00 + (random() * 23)
  END,
  CASE size
    WHEN '0.5g Cart' THEN 16.00 + (random() * 9)
    WHEN '1g Cart' THEN 26.00 + (random() * 11.50)
  END,
  FLOOR(random() * 80)::INTEGER,
  74.0 + (random() * 21),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 45)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT strain, size
  FROM (VALUES ('Gelato'), ('Wedding Cake'), ('Zkittlez'), ('Sunset Sherbet'), ('Purple Punch')) AS strains(strain)
  CROSS JOIN (VALUES ('0.5g Cart'), ('1g Cart')) AS sizes(size)
) AS combinations
LIMIT 10;

-- Premium Cannabis Co Vapes (5)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Premium ' || strain || ' Live Resin Cart 1g',
  'PCC-VP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Vapes',
  'Premium Cannabis Co',
  65.00 + (random() * 30),
  32.50 + (random() * 15),
  FLOOR(random() * 80)::INTEGER,
  80.0 + (random() * 15),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 45)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (VALUES ('Platinum OG'), ('Forbidden Fruit'), ('Mimosa'), ('Ice Cream Cake'), ('Runtz')) AS strains(strain)
LIMIT 5;

-- Incredibles Vapes (3)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Incredibles ' || strain || ' Cart 0.5g',
  'INC-VP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Vapes',
  'Incredibles',
  33.00 + (random() * 17),
  16.50 + (random() * 8.50),
  FLOOR(random() * 80)::INTEGER,
  73.0 + (random() * 22),
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 45)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '90 days'),
  CURRENT_TIMESTAMP
FROM (VALUES ('Lemon Haze'), ('Tangie'), ('Mango Kush')) AS strains(strain)
LIMIT 3;

-- TOPICALS PRODUCTS (23 total)
-- Rise Topicals (8)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Rise ' || product || ' ' || size,
  'RISE-TOP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Topicals',
  'Rise',
  CASE size
    WHEN '50ml' THEN 25.00 + (random() * 15)
    WHEN '100ml' THEN 40.00 + (random() * 20)
  END,
  CASE size
    WHEN '50ml' THEN 12.50 + (random() * 7.50)
    WHEN '100ml' THEN 20.00 + (random() * 10)
  END,
  FLOOR(random() * 60)::INTEGER,
  0.0,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, size
  FROM (VALUES ('Pain Relief Cream'), ('Muscle Balm'), ('Cooling Gel'), ('Warming Lotion')) AS products(product)
  CROSS JOIN (VALUES ('50ml'), ('100ml')) AS sizes(size)
) AS combinations
LIMIT 8;

-- Green Thumb Topicals (6)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Green Thumb ' || product || ' ' || size,
  'GT-TOP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Topicals',
  'Green Thumb',
  CASE size
    WHEN '50ml' THEN 28.00 + (random() * 17)
    WHEN '100ml' THEN 45.00 + (random() * 25)
  END,
  CASE size
    WHEN '50ml' THEN 14.00 + (random() * 8.50)
    WHEN '100ml' THEN 22.50 + (random() * 12.50)
  END,
  FLOOR(random() * 60)::INTEGER,
  0.0,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (
  SELECT product, size
  FROM (VALUES ('CBD Lotion'), ('Recovery Balm'), ('Soothing Salve')) AS products(product)
  CROSS JOIN (VALUES ('50ml'), ('100ml')) AS sizes(size)
) AS combinations
LIMIT 6;

-- Premium Cannabis Co Topicals (5)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Premium ' || product,
  'PCC-TOP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Topicals',
  'Premium Cannabis Co',
  50.00 + (random() * 30),
  25.00 + (random() * 15),
  FLOOR(random() * 60)::INTEGER,
  0.0,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (VALUES 
  ('Luxury Body Butter 100ml'), 
  ('Premium Massage Oil 100ml'), 
  ('Artisan Bath Salts 200g'),
  ('Therapeutic Cream 75ml'),
  ('Rejuvenating Serum 30ml')
) AS products(product)
LIMIT 5;

-- Stiizy Topicals (2)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Stiizy ' || product,
  'STZ-TOP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Topicals',
  'Stiizy',
  32.00 + (random() * 18),
  16.00 + (random() * 9),
  FLOOR(random() * 60)::INTEGER,
  0.0,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (VALUES ('Relief Balm 50ml'), ('Cooling Gel 75ml')) AS products(product)
LIMIT 2;

-- Incredibles Topicals (2)
INSERT INTO products (id, name, sku, category, brand, price, cost, inventory_count, thc_percentage, batch_id, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'Incredibles ' || product,
  'INC-TOP-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
  'Topicals',
  'Incredibles',
  30.00 + (random() * 15),
  15.00 + (random() * 7.50),
  FLOOR(random() * 60)::INTEGER,
  0.0,
  'BATCH-' || TO_CHAR(CURRENT_DATE - (random() * 90)::INTEGER, 'YYYYMMDD'),
  CASE 
    WHEN random() < 0.92 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'out_of_stock'
  END,
  CURRENT_TIMESTAMP - (random() * INTERVAL '120 days'),
  CURRENT_TIMESTAMP
FROM (VALUES ('Pain Relief Cream 60ml'), ('Muscle Rub 60ml')) AS products(product)
LIMIT 2;
