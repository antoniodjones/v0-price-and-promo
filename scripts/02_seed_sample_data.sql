-- Seed Sample Data for Pricing Engine
-- This script populates all tables with realistic test data

-- Insert Products (15 products across all categories)
INSERT INTO products (id, name, category, price, cost, inventory_count, thc_percentage, cbd_percentage, strain_type, status) VALUES
('prod_001', 'Blue Dream Flower', 'Flower', 45.00, 22.50, 150, 22.5, 0.5, 'Hybrid', 'active'),
('prod_002', 'OG Kush Flower', 'Flower', 50.00, 25.00, 120, 24.0, 0.3, 'Indica', 'active'),
('prod_003', 'Sour Diesel Flower', 'Flower', 48.00, 24.00, 100, 23.0, 0.4, 'Sativa', 'active'),
('prod_004', 'Gummy Bears 100mg', 'Edibles', 25.00, 10.00, 200, 10.0, 0.0, NULL, 'active'),
('prod_005', 'Chocolate Bar 200mg', 'Edibles', 35.00, 14.00, 150, 20.0, 0.0, NULL, 'active'),
('prod_006', 'Live Resin Cart', 'Concentrates', 60.00, 30.00, 80, 85.0, 0.2, 'Hybrid', 'active'),
('prod_007', 'Shatter 1g', 'Concentrates', 40.00, 20.00, 90, 80.0, 0.1, 'Indica', 'active'),
('prod_008', 'Pre-Roll 3-Pack', 'Pre-Rolls', 30.00, 12.00, 180, 20.0, 0.5, 'Hybrid', 'active'),
('prod_009', 'Infused Pre-Roll', 'Pre-Rolls', 18.00, 7.00, 160, 35.0, 0.3, 'Sativa', 'active'),
('prod_010', 'Pain Relief Cream', 'Topicals', 45.00, 18.00, 70, 0.0, 15.0, NULL, 'active'),
('prod_011', 'CBD Tincture 1000mg', 'Tinctures', 55.00, 22.00, 60, 0.5, 100.0, NULL, 'active'),
('prod_012', 'THC Tincture 500mg', 'Tinctures', 50.00, 20.00, 65, 50.0, 2.0, NULL, 'active'),
('prod_013', 'Wedding Cake Flower', 'Flower', 52.00, 26.00, 40, 25.0, 0.4, 'Indica', 'active'),
('prod_014', 'Mints 50mg', 'Edibles', 20.00, 8.00, 220, 5.0, 0.0, NULL, 'active'),
('prod_015', 'Wax 2g', 'Concentrates', 70.00, 35.00, 50, 82.0, 0.2, 'Sativa', 'active');

-- Insert Customers (10 customers with different tiers)
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, last_purchase_date) VALUES
('cust_001', 'John Smith', 'john.smith@email.com', 'Gold', 'Recreational', 'active', 2500.00, '2025-09-25'),
('cust_002', 'Sarah Johnson', 'sarah.j@email.com', 'Platinum', 'Medical', 'active', 5200.00, '2025-09-28'),
('cust_003', 'Mike Davis', 'mike.d@email.com', 'Silver', 'Recreational', 'active', 800.00, '2025-09-20'),
('cust_004', 'Emily Brown', 'emily.b@email.com', 'Bronze', 'Recreational', 'active', 250.00, '2025-09-15'),
('cust_005', 'David Wilson', 'david.w@email.com', 'Gold', 'Medical', 'active', 3100.00, '2025-09-27'),
('cust_006', 'Lisa Anderson', 'lisa.a@email.com', 'Platinum', 'Recreational', 'active', 6800.00, '2025-09-29'),
('cust_007', 'Tom Martinez', 'tom.m@email.com', 'Silver', 'Medical', 'active', 950.00, '2025-09-22'),
('cust_008', 'Jennifer Taylor', 'jen.t@email.com', 'Bronze', 'Recreational', 'active', 180.00, '2025-09-10'),
('cust_009', 'Robert Lee', 'rob.l@email.com', 'Gold', 'Recreational', 'active', 2800.00, '2025-09-26'),
('cust_010', 'Amanda White', 'amanda.w@email.com', 'Silver', 'Medical', 'active', 1200.00, '2025-09-24');

-- Insert Customer Discounts (tier-based discounts)
INSERT INTO customer_discounts (customer_id, discount_type, discount_value, start_date, end_date, status) VALUES
('cust_001', 'tier', 10.0, '2025-01-01', '2025-12-31', 'active'),
('cust_002', 'tier', 15.0, '2025-01-01', '2025-12-31', 'active'),
('cust_003', 'tier', 5.0, '2025-01-01', '2025-12-31', 'active'),
('cust_005', 'tier', 10.0, '2025-01-01', '2025-12-31', 'active'),
('cust_006', 'tier', 15.0, '2025-01-01', '2025-12-31', 'active'),
('cust_007', 'tier', 5.0, '2025-01-01', '2025-12-31', 'active'),
('cust_009', 'tier', 10.0, '2025-01-01', '2025-12-31', 'active'),
('cust_010', 'tier', 5.0, '2025-01-01', '2025-12-31', 'active');

-- Insert Inventory Discounts (clearance and seasonal)
INSERT INTO inventory_discounts (product_id, discount_type, discount_value, reason, start_date, end_date, status) VALUES
('prod_013', 'clearance', 20.0, 'Low Stock Clearance', '2025-09-25', '2025-10-15', 'active'),
('prod_015', 'near_expiration', 15.0, 'Near Expiration', '2025-09-28', '2025-10-10', 'active'),
('prod_010', 'seasonal', 10.0, 'Seasonal Sale', '2025-09-01', '2025-10-31', 'active'),
('prod_011', 'seasonal', 10.0, 'Seasonal Sale', '2025-09-01', '2025-10-31', 'active'),
('prod_007', 'overstocked', 25.0, 'Overstocked', '2025-09-20', '2025-10-20', 'active'),
('prod_003', 'clearance', 12.0, 'Flash Sale', '2025-09-30', '2025-10-05', 'active');

-- Fixed column name from discount_percentage to get_discount_percentage
-- Insert BOGO Promotions
INSERT INTO bogo_promotions (name, buy_product_id, get_product_id, buy_quantity, get_quantity, get_discount_percentage, start_date, end_date, status) VALUES
('BOGO Pre-Rolls', 'prod_008', 'prod_008', 1, 1, 100.0, '2025-09-01', '2025-10-31', 'active'),
('Buy 2 Get 1 Edibles', 'prod_004', 'prod_004', 2, 1, 100.0, '2025-09-15', '2025-10-15', 'active'),
('Flower + Free Pre-Roll', 'prod_001', 'prod_009', 1, 1, 100.0, '2025-09-20', '2025-10-20', 'active'),
('BOGO Gummies 50% Off', 'prod_004', 'prod_004', 1, 1, 50.0, '2025-09-25', '2025-10-25', 'active');

-- Fixed column names to match table schema
-- Insert Bundle Deals
INSERT INTO bundle_deals (name, description, product_ids, bundle_price, savings_amount, start_date, end_date, status) VALUES
('Starter Pack', 'Perfect for new customers', ARRAY['prod_001'::UUID, 'prod_008'::UUID, 'prod_004'::UUID], 85.00, 15.00, '2025-09-01', '2025-12-31', 'active'),
('Premium Experience', 'Top shelf selection', ARRAY['prod_002'::UUID, 'prod_006'::UUID, 'prod_005'::UUID], 125.00, 20.00, '2025-09-01', '2025-12-31', 'active'),
('Wellness Bundle', 'CBD focused products', ARRAY['prod_010'::UUID, 'prod_011'::UUID], 85.00, 15.00, '2025-09-01', '2025-12-31', 'active'),
('Party Pack', 'Great for sharing', ARRAY['prod_008'::UUID, 'prod_004'::UUID, 'prod_005'::UUID, 'prod_014'::UUID], 95.00, 15.00, '2025-09-15', '2025-11-15', 'active');

-- Insert Promotion Tracking (historical data)
INSERT INTO promotion_tracking (promotion_type, promotion_id, customer_id, product_id, original_price, discount_amount, final_price, transaction_date) VALUES
('customer_discount', gen_random_uuid(), 'cust_001', 'prod_001', 45.00, 4.50, 40.50, '2025-09-25 14:30:00'),
('inventory_discount', gen_random_uuid(), 'cust_003', 'prod_013', 52.00, 10.40, 41.60, '2025-09-26 10:15:00'),
('bogo', gen_random_uuid(), 'cust_004', 'prod_008', 60.00, 30.00, 30.00, '2025-09-27 16:45:00'),
('bundle', gen_random_uuid(), 'cust_005', NULL, 100.00, 15.00, 85.00, '2025-09-28 11:20:00'),
('customer_discount', gen_random_uuid(), 'cust_002', 'prod_006', 60.00, 9.00, 51.00, '2025-09-28 13:00:00');

-- Insert Performance Metrics
INSERT INTO performance_metrics (metric_type, metric_name, metric_value, period_start, period_end) VALUES
('revenue', 'Daily Sales', 3500.00, '2025-09-25', '2025-09-25'),
('revenue', 'Daily Sales', 4200.00, '2025-09-26', '2025-09-26'),
('revenue', 'Daily Sales', 3800.00, '2025-09-27', '2025-09-27'),
('revenue', 'Daily Sales', 5100.00, '2025-09-28', '2025-09-28'),
('revenue', 'Daily Sales', 4600.00, '2025-09-29', '2025-09-29');

-- Insert Realtime Events
INSERT INTO realtime_events (event_type, event_data, severity) VALUES
('price_change', '{"product_id": "prod_001", "old_price": 42.00, "new_price": 45.00}'::jsonb, 'info'),
('promotion_activated', '{"promotion_name": "BOGO Pre-Rolls", "type": "bogo"}'::jsonb, 'info'),
('inventory_alert', '{"product_id": "prod_013", "inventory_count": 40, "threshold": 50}'::jsonb, 'warning'),
('customer_tier_upgrade', '{"customer_id": "cust_009", "old_tier": "Silver", "new_tier": "Gold"}'::jsonb, 'info');

-- Insert Price History
INSERT INTO price_history (product_id, old_price, new_price, change_reason) VALUES
('prod_001', 42.00, 45.00, 'Market adjustment'),
('prod_006', 55.00, 60.00, 'Supply cost increase'),
('prod_013', 52.00, 41.60, 'Clearance discount applied'),
('prod_004', 28.00, 25.00, 'Competitive pricing');

-- Insert Price Alerts
INSERT INTO price_alerts (product_id, alert_type, threshold_value, current_value, status) VALUES
('prod_002', 'price_drop', 45.00, 50.00, 'active'),
('prod_006', 'price_drop', 55.00, 60.00, 'active'),
('prod_001', 'price_drop', 40.00, 45.00, 'active'),
('prod_013', 'price_drop', 45.00, 41.60, 'active');
