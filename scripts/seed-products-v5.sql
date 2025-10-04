-- Seed Products for GTI Cannabis Dispensary (Version 5 - Schema Corrected)
-- 45 realistic cannabis products across categories
-- Exact schema match: id, name, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, brand, weight_grams, expiration_date, status, created_at, updated_at

-- Flower Products (15 products)
INSERT INTO products (id, name, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, brand, weight_grams, expiration_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Blue Dream 3.5g', 'Flower', 'Hybrid', 45.00, 22.50, 150, 22.5, 0.5, 'Hybrid', 'Rhythm', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Sour Diesel 3.5g', 'Flower', 'Sativa', 48.00, 24.00, 120, 24.2, 0.3, 'Sativa', 'Dogwalkers', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'OG Kush 3.5g', 'Flower', 'Hybrid', 50.00, 25.00, 100, 26.8, 0.4, 'Hybrid', 'Rhythm', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Gelato 3.5g', 'Flower', 'Hybrid', 55.00, 27.50, 90, 28.5, 0.2, 'Hybrid', 'Cookies', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Wedding Cake 7g', 'Flower', 'Indica', 85.00, 42.50, 75, 25.3, 0.6, 'Indica', 'Rhythm', 7.0, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Purple Punch 7g', 'Flower', 'Indica', 80.00, 40.00, 80, 23.8, 0.5, 'Indica', 'Dogwalkers', 7.0, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Jack Herer 3.5g', 'Flower', 'Sativa', 46.00, 23.00, 110, 21.5, 0.3, 'Sativa', 'Rhythm', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Granddaddy Purple 3.5g', 'Flower', 'Indica', 52.00, 26.00, 95, 27.2, 0.4, 'Indica', 'Cookies', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Strawberry Cough 3.5g', 'Flower', 'Sativa', 47.00, 23.50, 105, 22.8, 0.3, 'Sativa', 'Rhythm', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Northern Lights 7g', 'Flower', 'Indica', 82.00, 41.00, 70, 24.5, 0.5, 'Indica', 'Dogwalkers', 7.0, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Pineapple Express 3.5g', 'Flower', 'Hybrid', 49.00, 24.50, 115, 23.9, 0.4, 'Hybrid', 'Rhythm', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Zkittlez 3.5g', 'Flower', 'Indica', 54.00, 27.00, 88, 26.5, 0.3, 'Indica', 'Cookies', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Gorilla Glue #4 7g', 'Flower', 'Hybrid', 88.00, 44.00, 65, 28.2, 0.2, 'Hybrid', 'Rhythm', 7.0, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'White Widow 3.5g', 'Flower', 'Hybrid', 45.00, 22.50, 125, 21.8, 0.5, 'Hybrid', 'Dogwalkers', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Sunset Sherbet 3.5g', 'Flower', 'Indica', 53.00, 26.50, 92, 25.7, 0.4, 'Indica', 'Cookies', 3.5, CURRENT_DATE + INTERVAL '6 months', 'active', NOW(), NOW());

-- Vape Products (12 products)
INSERT INTO products (id, name, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, brand, weight_grams, expiration_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Blue Dream Vape Cart 0.5g', 'Vapes', 'Cartridge', 35.00, 17.50, 200, 85.5, 0.1, 'Hybrid', 'Rhythm', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Sour Diesel Vape Cart 0.5g', 'Vapes', 'Cartridge', 38.00, 19.00, 180, 87.2, 0.1, 'Sativa', 'Dogwalkers', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'OG Kush Vape Cart 1g', 'Vapes', 'Cartridge', 65.00, 32.50, 150, 86.8, 0.1, 'Hybrid', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Gelato Vape Cart 0.5g', 'Vapes', 'Cartridge', 40.00, 20.00, 175, 88.5, 0.1, 'Hybrid', 'Cookies', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Wedding Cake Vape Cart 1g', 'Vapes', 'Cartridge', 68.00, 34.00, 140, 87.3, 0.1, 'Indica', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Purple Punch Disposable Vape', 'Vapes', 'Disposable', 30.00, 15.00, 220, 82.8, 0.1, 'Indica', 'Dogwalkers', 0.3, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Jack Herer Vape Cart 0.5g', 'Vapes', 'Cartridge', 36.00, 18.00, 190, 84.5, 0.1, 'Sativa', 'Rhythm', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Granddaddy Purple Disposable Vape', 'Vapes', 'Disposable', 32.00, 16.00, 210, 83.2, 0.1, 'Indica', 'Cookies', 0.3, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Strawberry Cough Vape Cart 0.5g', 'Vapes', 'Cartridge', 37.00, 18.50, 185, 85.8, 0.1, 'Sativa', 'Rhythm', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Northern Lights Vape Cart 1g', 'Vapes', 'Cartridge', 66.00, 33.00, 145, 86.5, 0.1, 'Indica', 'Dogwalkers', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Pineapple Express Disposable Vape', 'Vapes', 'Disposable', 31.00, 15.50, 215, 83.9, 0.1, 'Hybrid', 'Rhythm', 0.3, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Zkittlez Vape Cart 0.5g', 'Vapes', 'Cartridge', 39.00, 19.50, 170, 87.5, 0.1, 'Indica', 'Cookies', 0.5, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW());

-- Edibles (10 products)
INSERT INTO products (id, name, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, brand, weight_grams, expiration_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Blueberry Gummies 10pk', 'Edibles', 'Gummies', 25.00, 12.50, 300, 10.0, 0.0, NULL, 'Incredibles', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Watermelon Gummies 10pk', 'Edibles', 'Gummies', 25.00, 12.50, 280, 10.0, 0.0, NULL, 'Incredibles', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Chocolate Bar 100mg', 'Edibles', 'Chocolate', 20.00, 10.00, 250, 10.0, 0.0, NULL, 'Mindys', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Mango Gummies 20pk', 'Edibles', 'Gummies', 45.00, 22.50, 200, 20.0, 0.0, NULL, 'Incredibles', 200, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Peanut Butter Chocolate Bar 100mg', 'Edibles', 'Chocolate', 22.00, 11.00, 240, 10.0, 0.0, NULL, 'Mindys', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Strawberry Lemonade Gummies 10pk', 'Edibles', 'Gummies', 26.00, 13.00, 290, 10.0, 0.0, NULL, 'Incredibles', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Dark Chocolate Bar 100mg', 'Edibles', 'Chocolate', 21.00, 10.50, 260, 10.0, 0.0, NULL, 'Mindys', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Mixed Berry Gummies 10pk', 'Edibles', 'Gummies', 25.00, 12.50, 285, 10.0, 0.0, NULL, 'Incredibles', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Caramel Chocolate Bar 100mg', 'Edibles', 'Chocolate', 23.00, 11.50, 235, 10.0, 0.0, NULL, 'Mindys', 100, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Peach Gummies 20pk', 'Edibles', 'Gummies', 46.00, 23.00, 195, 20.0, 0.0, NULL, 'Incredibles', 200, CURRENT_DATE + INTERVAL '9 months', 'active', NOW(), NOW());

-- Concentrates (8 products)
INSERT INTO products (id, name, category, subcategory, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, brand, weight_grams, expiration_date, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Blue Dream Live Resin 1g', 'Concentrates', 'Live Resin', 60.00, 30.00, 80, 82.5, 0.2, 'Hybrid', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Sour Diesel Shatter 1g', 'Concentrates', 'Shatter', 55.00, 27.50, 75, 85.2, 0.1, 'Sativa', 'Dogwalkers', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'OG Kush Wax 1g', 'Concentrates', 'Wax', 58.00, 29.00, 70, 83.8, 0.2, 'Hybrid', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Gelato Live Rosin 1g', 'Concentrates', 'Live Rosin', 75.00, 37.50, 50, 88.5, 0.1, 'Hybrid', 'Cookies', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Wedding Cake Diamonds 1g', 'Concentrates', 'Diamonds', 70.00, 35.00, 55, 90.3, 0.1, 'Indica', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Purple Punch Budder 1g', 'Concentrates', 'Budder', 57.00, 28.50, 68, 84.8, 0.2, 'Indica', 'Dogwalkers', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Jack Herer Live Resin 1g', 'Concentrates', 'Live Resin', 62.00, 31.00, 72, 83.5, 0.2, 'Sativa', 'Rhythm', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW()),
  (gen_random_uuid(), 'Zkittlez Sauce 1g', 'Concentrates', 'Sauce', 68.00, 34.00, 60, 87.2, 0.1, 'Indica', 'Cookies', 1.0, CURRENT_DATE + INTERVAL '12 months', 'active', NOW(), NOW());
