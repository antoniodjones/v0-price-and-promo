-- Debug script to check database connection and table status
-- This will help identify if the 500 error is due to missing tables or data

-- Check if products table exists and has data
SELECT 
  'products' as table_name,
  COUNT(*) as row_count,
  MIN(created_at) as earliest_record,
  MAX(created_at) as latest_record
FROM products;

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Sample a few products to verify data quality
SELECT id, name, sku, category, brand, price, created_at
FROM products 
LIMIT 5;
