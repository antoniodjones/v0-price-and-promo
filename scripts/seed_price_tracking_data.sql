-- Seed some sample price tracking data for testing

-- First, ensure we have some products and price sources
INSERT INTO products (name, sku, category, description, unit_type, created_at, updated_at) VALUES
('Premium Flower - Blue Dream', 'BD-001', 'Flower', 'High-quality Blue Dream strain', 'gram', NOW(), NOW()),
('Vape Cartridge - Sour Diesel', 'SD-CART-001', 'Vapes', 'Sour Diesel vape cartridge 1g', 'piece', NOW(), NOW()),
('Edibles - Gummy Bears 100mg', 'GB-100', 'Edibles', 'Mixed fruit gummy bears 100mg THC', 'package', NOW(), NOW())
ON CONFLICT (sku) DO NOTHING;

-- Add some price history data
INSERT INTO price_history (product_id, source_id, price, recorded_at) 
SELECT 
  p.id,
  ps.id,
  CASE 
    WHEN p.sku = 'BD-001' THEN 28.00 + (random() * 10 - 5)
    WHEN p.sku = 'SD-CART-001' THEN 45.00 + (random() * 15 - 7.5)
    WHEN p.sku = 'GB-100' THEN 12.00 + (random() * 4 - 2)
  END,
  NOW() - INTERVAL '1 day' * generate_series(0, 7)
FROM products p
CROSS JOIN price_sources ps
WHERE p.sku IN ('BD-001', 'SD-CART-001', 'GB-100')
AND ps.name IN ('Wholesale Direct', 'Green Supply Co')
ON CONFLICT DO NOTHING;

-- Enable tracking for these products
INSERT INTO product_tracking_settings (product_id, alert_enabled, alert_threshold, alert_type, email_notifications)
SELECT 
  p.id,
  true,
  CASE 
    WHEN p.sku = 'BD-001' THEN 10.0
    WHEN p.sku = 'SD-CART-001' THEN 15.0
    WHEN p.sku = 'GB-100' THEN 20.0
  END,
  'percentage',
  true
FROM products p
WHERE p.sku IN ('BD-001', 'SD-CART-001', 'GB-100')
ON CONFLICT (product_id) DO UPDATE SET
  alert_enabled = EXCLUDED.alert_enabled,
  alert_threshold = EXCLUDED.alert_threshold,
  alert_type = EXCLUDED.alert_type,
  email_notifications = EXCLUDED.email_notifications;

-- Create some sample alerts
INSERT INTO price_alerts (
  product_id, 
  source_id, 
  alert_type, 
  threshold_value, 
  threshold_type, 
  current_price, 
  previous_price, 
  change_amount, 
  change_percentage, 
  status, 
  triggered_at
)
SELECT 
  p.id,
  ps.id,
  CASE WHEN random() > 0.5 THEN 'price_decrease' ELSE 'price_increase' END,
  10.0,
  'percentage',
  CASE 
    WHEN p.sku = 'BD-001' THEN 28.00
    WHEN p.sku = 'SD-CART-001' THEN 45.00
    WHEN p.sku = 'GB-100' THEN 12.00
  END,
  CASE 
    WHEN p.sku = 'BD-001' THEN 32.00
    WHEN p.sku = 'SD-CART-001' THEN 40.00
    WHEN p.sku = 'GB-100' THEN 14.00
  END,
  CASE 
    WHEN p.sku = 'BD-001' THEN -4.00
    WHEN p.sku = 'SD-CART-001' THEN 5.00
    WHEN p.sku = 'GB-100' THEN -2.00
  END,
  CASE 
    WHEN p.sku = 'BD-001' THEN -12.5
    WHEN p.sku = 'SD-CART-001' THEN 12.5
    WHEN p.sku = 'GB-100' THEN -14.3
  END,
  CASE WHEN random() > 0.7 THEN 'resolved' WHEN random() > 0.4 THEN 'acknowledged' ELSE 'active' END,
  NOW() - INTERVAL '1 hour' * (random() * 24)
FROM products p
CROSS JOIN price_sources ps
WHERE p.sku IN ('BD-001', 'SD-CART-001', 'GB-100')
AND ps.name IN ('Wholesale Direct', 'Green Supply Co')
LIMIT 5
ON CONFLICT DO NOTHING;
