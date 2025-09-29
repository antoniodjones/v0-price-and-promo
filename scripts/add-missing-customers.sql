-- Add missing customers that are referenced in the UI but not in the database
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Green Valley Co-op', 'info@greenvalleycoop.com', 'standard', 'colorado', 'active', 7500.00, now(), now()),
  (gen_random_uuid(), 'Sunrise Dispensary', 'contact@sunrisedispensary.com', 'premium', 'california', 'active', 16800.00, now(), now()),
  (gen_random_uuid(), 'Northern Lights Cannabis', 'orders@northernlights.com', 'standard', 'oregon', 'active', 11200.00, now(), now()),
  (gen_random_uuid(), 'Desert Bloom Collective', 'sales@desertbloom.com', 'basic', 'nevada', 'active', 4200.00, now(), now()),
  (gen_random_uuid(), 'Rocky Mountain Cannabis', 'info@rockymountain.com', 'premium', 'colorado', 'active', 19500.00, now(), now())
ON CONFLICT (name) DO NOTHING;
