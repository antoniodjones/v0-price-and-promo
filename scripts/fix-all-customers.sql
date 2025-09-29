-- First, let's see what customers currently exist
-- Then insert all the customers that should be there

-- Delete any existing customers to start fresh (optional - comment out if you want to keep existing data)
-- DELETE FROM customers;

-- Insert all required customers with proper conflict handling
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Acme Dispensary', 'contact@acmedispensary.com', 'premium', 'california', 'active', 15000.00, now(), now()),
  (gen_random_uuid(), 'Green Valley Cannabis', 'info@greenvalley.com', 'standard', 'colorado', 'active', 8500.00, now(), now()),
  (gen_random_uuid(), 'High Times Collective', 'orders@hightimes.com', 'premium', 'oregon', 'active', 22000.00, now(), now()),
  (gen_random_uuid(), 'Cannabis Corner', 'sales@cannabiscorner.com', 'basic', 'washington', 'active', 3200.00, now(), now()),
  (gen_random_uuid(), 'The Herb Shop', 'contact@herbshop.com', 'standard', 'nevada', 'active', 12000.00, now(), now()),
  (gen_random_uuid(), 'Emerald City Cannabis', 'info@emeraldcity.com', 'premium', 'california', 'inactive', 18500.00, now(), now()),
  (gen_random_uuid(), 'Mountain High Dispensary', 'orders@mountainhigh.com', 'standard', 'colorado', 'active', 9800.00, now(), now()),
  (gen_random_uuid(), 'Pacific Coast Cannabis', 'sales@pacificcoast.com', 'basic', 'california', 'active', 4500.00, now(), now()),
  -- Additional customers that might be referenced in the UI
  (gen_random_uuid(), 'Green Valley Co-op', 'coop@greenvalley.com', 'standard', 'colorado', 'active', 7500.00, now(), now()),
  (gen_random_uuid(), 'Incredibles', 'contact@incredibles.com', 'premium', 'colorado', 'active', 25000.00, now(), now())
ON CONFLICT (name) DO UPDATE SET
  email = EXCLUDED.email,
  tier = EXCLUDED.tier,
  market = EXCLUDED.market,
  status = EXCLUDED.status,
  total_purchases = EXCLUDED.total_purchases,
  updated_at = now();

-- Add a unique constraint on name if it doesn't exist
ALTER TABLE customers ADD CONSTRAINT customers_name_unique UNIQUE (name);
