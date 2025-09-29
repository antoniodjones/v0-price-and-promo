-- Seed initial price sources for comparison
INSERT INTO public.price_sources (name, website_url, is_active) VALUES
('Amazon', 'https://amazon.com', true),
('eBay', 'https://ebay.com', true),
('Walmart', 'https://walmart.com', true),
('Target', 'https://target.com', true),
('Best Buy', 'https://bestbuy.com', true),
('Costco', 'https://costco.com', true),
('Local Competitor A', 'https://competitor-a.com', true),
('Local Competitor B', 'https://competitor-b.com', true)
ON CONFLICT DO NOTHING;

-- Seed some sample price history data
INSERT INTO public.price_history (product_id, source_id, price, original_price, availability_status, metadata)
SELECT 
  p.id as product_id,
  ps.id as source_id,
  (p.price * (0.8 + random() * 0.4))::NUMERIC(10,2) as price, -- Random price variation
  (p.price * (0.9 + random() * 0.2))::NUMERIC(10,2) as original_price,
  CASE 
    WHEN random() > 0.1 THEN 'in_stock'
    ELSE 'out_of_stock'
  END as availability_status,
  jsonb_build_object(
    'shipping_cost', (5 + random() * 15)::NUMERIC(10,2),
    'rating', (3.5 + random() * 1.5)::NUMERIC(2,1),
    'review_count', (floor(random() * 1000) + 10)::INTEGER
  ) as metadata
FROM products p
CROSS JOIN price_sources ps
WHERE p.price IS NOT NULL
LIMIT 100; -- Limit to avoid too much test data
