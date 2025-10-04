-- Quick check to see what data exists in the database
SELECT 'products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
SELECT 'customer_discounts', COUNT(*) FROM customer_discounts
UNION ALL
SELECT 'inventory_discounts', COUNT(*) FROM inventory_discounts
UNION ALL
SELECT 'bogo_promotions', COUNT(*) FROM bogo_promotions
UNION ALL
SELECT 'bundle_deals', COUNT(*) FROM bundle_deals
UNION ALL
SELECT 'promotion_tracking', COUNT(*) FROM promotion_tracking
ORDER BY table_name;
