-- Seed customers table with test data
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Acme Dispensary', 'contact@acmedispensary.com', 'premium', 'california', 'active', 15000.00, now(), now()),
  (gen_random_uuid(), 'Green Valley Cannabis', 'info@greenvalley.com', 'standard', 'colorado', 'active', 8500.00, now(), now()),
  (gen_random_uuid(), 'High Times Collective', 'orders@hightimes.com', 'premium', 'oregon', 'active', 22000.00, now(), now()),
  (gen_random_uuid(), 'Cannabis Corner', 'sales@cannabiscorner.com', 'basic', 'washington', 'active', 3200.00, now(), now()),
  (gen_random_uuid(), 'The Herb Shop', 'contact@herbshop.com', 'standard', 'nevada', 'active', 12000.00, now(), now()),
  (gen_random_uuid(), 'Emerald City Cannabis', 'info@emeraldcity.com', 'premium', 'california', 'inactive', 18500.00, now(), now()),
  (gen_random_uuid(), 'Mountain High Dispensary', 'orders@mountainhigh.com', 'standard', 'colorado', 'active', 9800.00, now(), now()),
  (gen_random_uuid(), 'Pacific Coast Cannabis', 'sales@pacificcoast.com', 'basic', 'california', 'active', 4500.00, now(), now())
ON CONFLICT (id) DO NOTHING;
