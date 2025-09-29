-- Seed BOGO promotions
INSERT INTO bogo_promotions (id, name, type, status, trigger_level, trigger_value, reward_type, reward_value, start_date, end_date, created_at, updated_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Summer BOGO - Flower', 'buy_x_get_y', 'active', 'quantity', 2, 'percentage', 50.0, '2025-06-01', '2025-08-31', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440002', 'Edibles Mix & Match', 'buy_x_get_y', 'active', 'quantity', 3, 'free_item', 1, '2025-01-01', '2025-12-31', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440003', 'Vape Cartridge BOGO', 'buy_x_get_y', 'scheduled', 'quantity', 2, 'percentage', 100.0, '2025-11-15', '2025-12-15', NOW(), NOW()),
('990e8400-e29b-41d4-a716-446655440004', 'Concentrate Weekend Special', 'buy_x_get_y', 'active', 'amount', 100.0, 'percentage', 25.0, '2025-01-01', '2025-12-31', NOW(), NOW());
