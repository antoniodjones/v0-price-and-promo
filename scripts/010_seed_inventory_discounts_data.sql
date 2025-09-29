-- Seed inventory discounts data
-- This script populates the inventory_discounts table with sample data

INSERT INTO inventory_discounts (
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
) VALUES 
-- Expiration-based discounts
(
  gen_random_uuid(),
  'Expiring Soon - 7 Days',
  'expiration',
  7,
  'percentage',
  15,
  'all',
  null,
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Expiring Soon - 14 Days',
  'expiration',
  14,
  'percentage',
  10,
  'all',
  null,
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Clearance - 3 Days',
  'expiration',
  3,
  'percentage',
  25,
  'all',
  null,
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Flower Clearance - 5 Days',
  'expiration',
  5,
  'percentage',
  20,
  'category',
  'Flower',
  'active',
  NOW(),
  NOW()
),

-- THC-based discounts
(
  gen_random_uuid(),
  'Low THC Discount',
  'thc',
  15,
  'percentage',
  12,
  'all',
  null,
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Very Low THC - Flower',
  'thc',
  10,
  'percentage',
  18,
  'category',
  'Flower',
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Low Potency Vapes',
  'thc',
  20,
  'fixed',
  5,
  'category',
  'Vapes',
  'active',
  NOW(),
  NOW()
),

-- Brand-specific discounts
(
  gen_random_uuid(),
  'Rythm Expiring Stock',
  'expiration',
  10,
  'percentage',
  15,
  'brand',
  'Rythm',
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Dogwalkers Low THC',
  'thc',
  18,
  'percentage',
  10,
  'brand',
  'Dogwalkers',
  'active',
  NOW(),
  NOW()
),

-- Inactive/test discounts
(
  gen_random_uuid(),
  'Test Discount - Inactive',
  'expiration',
  30,
  'percentage',
  5,
  'all',
  null,
  'inactive',
  NOW(),
  NOW()
)

ON CONFLICT (id) DO NOTHING;

-- Verify the data was inserted
SELECT 
  name,
  type,
  trigger_value,
  discount_type,
  discount_value,
  scope,
  scope_value,
  status
FROM inventory_discounts 
ORDER BY created_at DESC;
