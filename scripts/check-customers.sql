-- Check if there are any customers in the database
SELECT COUNT(*) as customer_count FROM customers;

-- Show first 5 customers if any exist
SELECT id, name, email, tier, market, status, total_purchases 
FROM customers 
LIMIT 5;
