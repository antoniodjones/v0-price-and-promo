-- Seed customers table with realistic dispensary customers
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Elite Cannabis Co', 'orders@elitecannabis.com', 'A', 'Illinois', 'active', 125600.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Premium Dispensary LLC', 'purchasing@premiumdispensary.com', 'A', 'Illinois', 'active', 98750.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'High Volume Buyer', 'orders@highvolume.com', 'B', 'Pennsylvania', 'active', 67890.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Dispensary ABC', 'buyer@dispensaryabc.com', 'B', 'Illinois', 'active', 45230.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Green Leaf Collective', 'orders@greenleaf.com', 'B', 'Pennsylvania', 'active', 52100.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'New Customer', 'contact@newcustomer.com', 'C', 'Illinois', 'active', 8500.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440007', 'Wellness Dispensary', 'orders@wellnessdispensary.com', 'C', 'Pennsylvania', 'active', 12750.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440008', 'VIP Dispensary', 'vip@vipdispensary.com', 'A', 'Illinois', 'active', 156780.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440009', 'Premium Partners', 'orders@premiumpartners.com', 'A', 'Pennsylvania', 'active', 134560.00, NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440010', 'Budget Buds', 'orders@budgetbuds.com', 'C', 'Illinois', 'active', 15600.00, NOW(), NOW());
