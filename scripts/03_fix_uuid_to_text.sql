-- Migration: Change UUID columns to TEXT for human-readable IDs
-- This allows us to use custom IDs like 'prod_001', 'cust_001', etc.

-- Drop foreign key constraints first
ALTER TABLE customer_discounts DROP CONSTRAINT IF EXISTS customer_discounts_customer_id_fkey;
-- Removed product_id constraint from customer_discounts as it doesn't have that column
ALTER TABLE inventory_discounts DROP CONSTRAINT IF EXISTS inventory_discounts_product_id_fkey;
ALTER TABLE bogo_promotions DROP CONSTRAINT IF EXISTS bogo_promotions_buy_product_id_fkey;
ALTER TABLE bogo_promotions DROP CONSTRAINT IF EXISTS bogo_promotions_get_product_id_fkey;
ALTER TABLE promotion_tracking DROP CONSTRAINT IF EXISTS promotion_tracking_customer_id_fkey;
ALTER TABLE promotion_tracking DROP CONSTRAINT IF EXISTS promotion_tracking_product_id_fkey;
ALTER TABLE performance_metrics DROP CONSTRAINT IF EXISTS performance_metrics_product_id_fkey;
ALTER TABLE realtime_events DROP CONSTRAINT IF EXISTS realtime_events_product_id_fkey;
ALTER TABLE realtime_events DROP CONSTRAINT IF EXISTS realtime_events_customer_id_fkey;
ALTER TABLE price_history DROP CONSTRAINT IF EXISTS price_history_product_id_fkey;
ALTER TABLE price_alerts DROP CONSTRAINT IF EXISTS price_alerts_product_id_fkey;

-- Change products.id from UUID to TEXT
ALTER TABLE products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE products ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;

-- Change customers.id from UUID to TEXT
ALTER TABLE customers ALTER COLUMN id DROP DEFAULT;
ALTER TABLE customers ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE customers ALTER COLUMN id SET DEFAULT gen_random_uuid()::TEXT;

-- Change foreign key columns to TEXT
ALTER TABLE customer_discounts ALTER COLUMN customer_id TYPE TEXT USING customer_id::TEXT;
-- Removed product_id line as customer_discounts doesn't have that column
ALTER TABLE inventory_discounts ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE bogo_promotions ALTER COLUMN buy_product_id TYPE TEXT USING buy_product_id::TEXT;
ALTER TABLE bogo_promotions ALTER COLUMN get_product_id TYPE TEXT USING get_product_id::TEXT;
ALTER TABLE promotion_tracking ALTER COLUMN customer_id TYPE TEXT USING customer_id::TEXT;
ALTER TABLE promotion_tracking ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE performance_metrics ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE realtime_events ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE realtime_events ALTER COLUMN customer_id TYPE TEXT USING customer_id::TEXT;
ALTER TABLE price_history ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;
ALTER TABLE price_alerts ALTER COLUMN product_id TYPE TEXT USING product_id::TEXT;

-- Recreate foreign key constraints
ALTER TABLE customer_discounts ADD CONSTRAINT customer_discounts_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
-- Removed product_id constraint recreation as customer_discounts doesn't have that column
ALTER TABLE inventory_discounts ADD CONSTRAINT inventory_discounts_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE bogo_promotions ADD CONSTRAINT bogo_promotions_buy_product_id_fkey 
  FOREIGN KEY (buy_product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE bogo_promotions ADD CONSTRAINT bogo_promotions_get_product_id_fkey 
  FOREIGN KEY (get_product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE promotion_tracking ADD CONSTRAINT promotion_tracking_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE promotion_tracking ADD CONSTRAINT promotion_tracking_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE performance_metrics ADD CONSTRAINT performance_metrics_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE realtime_events ADD CONSTRAINT realtime_events_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE realtime_events ADD CONSTRAINT realtime_events_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
ALTER TABLE price_history ADD CONSTRAINT price_history_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE price_alerts ADD CONSTRAINT price_alerts_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
