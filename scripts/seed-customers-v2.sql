-- Add missing customers that are referenced in the UI
INSERT INTO customers (id, name, email, tier, market, status, total_purchases, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'Green Valley Co-op', 'coop@greenvalley.com', 'premium', 'california', 'active', 16500.00, now(), now()),
  (gen_random_uuid(), 'Sunrise Dispensary', 'info@sunrisedispensary.com', 'standard', 'oregon', 'active', 7200.00, now(), now())
ON CONFLICT (name) DO NOTHING;
