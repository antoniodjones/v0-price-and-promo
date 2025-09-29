-- Ensure inventory discounts table exists and has sample data
-- This script combines table creation and seeding for inventory discounts

-- Create inventory discounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'expiration' or 'thc'
  trigger_value INTEGER NOT NULL,
  discount_type VARCHAR(50) NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  scope VARCHAR(50) NOT NULL, -- 'all', 'category', 'brand'
  scope_value VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing data to avoid duplicates
DELETE FROM inventory_discounts;

-- Insert comprehensive sample inventory discount data
INSERT INTO inventory_discounts (name, type, trigger_value, discount_type, discount_value, scope, scope_value, status) VALUES
-- Expiration-based discounts
('30-Day Expiration Auto Discount', 'expiration', 30, 'percentage', 20.00, 'all', NULL, 'active'),
('Premium Brand 14-Day Expiration', 'expiration', 14, 'percentage', 30.00, 'brand', 'Premium Cannabis Co', 'active'),
('Flower 21-Day Expiration Discount', 'expiration', 21, 'percentage', 15.00, 'category', 'Flower', 'active'),
('Cartridge 7-Day Expiration Clearance', 'expiration', 7, 'percentage', 40.00, 'category', 'Cartridge', 'active'),

-- THC-based discounts
('Low THC Flower Discount', 'thc', 15, 'percentage', 10.00, 'category', 'Flower', 'active'),
('Holiday Concentrates THC Boost', 'thc', 70, 'fixed', 15.00, 'category', 'Concentrates', 'scheduled'),
('Mid-Range THC Edibles', 'thc', 25, 'percentage', 8.00, 'category', 'Edibles', 'active'),
('Premium THC Threshold', 'thc', 20, 'percentage', 12.00, 'brand', 'Rythm', 'active'),

-- Additional inventory-based discounts
('Bulk Inventory Clearance', 'expiration', 45, 'percentage', 25.00, 'all', NULL, 'paused'),
('Seasonal THC Adjustment', 'thc', 18, 'percentage', 5.00, 'category', 'Pre-rolls', 'active');

-- Update timestamps to show recent activity
UPDATE inventory_discounts SET 
  updated_at = NOW() - INTERVAL '2 hours' 
WHERE name = '30-Day Expiration Auto Discount';

UPDATE inventory_discounts SET 
  updated_at = NOW() - INTERVAL '6 hours' 
WHERE name = 'Premium Brand 14-Day Expiration';

UPDATE inventory_discounts SET 
  updated_at = NOW() - INTERVAL '1 day' 
WHERE name = 'Low THC Flower Discount';

-- Verify the data was inserted
SELECT 
  id,
  name,
  type,
  trigger_value,
  discount_type,
  discount_value,
  scope,
  scope_value,
  status,
  created_at,
  updated_at
FROM inventory_discounts 
ORDER BY created_at DESC;
