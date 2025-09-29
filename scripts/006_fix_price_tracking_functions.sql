-- Drop and recreate the get_latest_price function to fix any ambiguity issues
DROP FUNCTION IF EXISTS get_latest_price(UUID);

-- Create function to get latest price for a product
CREATE OR REPLACE FUNCTION get_latest_price(product_uuid UUID)
RETURNS TABLE (
  current_price NUMERIC,
  previous_price NUMERIC,
  price_change NUMERIC,
  price_change_percentage NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_prices AS (
    SELECT 
      ph.price,
      ph.last_updated,
      ROW_NUMBER() OVER (ORDER BY ph.last_updated DESC) as rn
    FROM price_history ph
    WHERE ph.product_id = product_uuid
    ORDER BY ph.last_updated DESC
    LIMIT 2
  )
  SELECT 
    COALESCE((SELECT lp.price FROM latest_prices lp WHERE lp.rn = 1), 0::NUMERIC) as current_price,
    (SELECT lp.price FROM latest_prices lp WHERE lp.rn = 2) as previous_price,
    COALESCE((SELECT lp.price FROM latest_prices lp WHERE lp.rn = 1), 0::NUMERIC) - COALESCE((SELECT lp.price FROM latest_prices lp WHERE lp.rn = 2), 0::NUMERIC) as price_change,
    CASE 
      WHEN (SELECT lp.price FROM latest_prices lp WHERE lp.rn = 2) > 0 THEN
        ((SELECT lp.price FROM latest_prices lp WHERE lp.rn = 1) - (SELECT lp.price FROM latest_prices lp WHERE lp.rn = 2)) / (SELECT lp.price FROM latest_prices lp WHERE lp.rn = 2) * 100
      ELSE 0
    END as price_change_percentage,
    COALESCE((SELECT lp.last_updated FROM latest_prices lp WHERE lp.rn = 1), NOW()) as last_updated;
END;
$$ LANGUAGE plpgsql;

-- If no price history exists, fall back to product price
CREATE OR REPLACE FUNCTION get_latest_price_with_fallback(product_uuid UUID)
RETURNS TABLE (
  current_price NUMERIC,
  previous_price NUMERIC,
  price_change NUMERIC,
  price_change_percentage NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  price_history_count INTEGER;
  product_price NUMERIC;
  product_updated TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if price history exists
  SELECT COUNT(*) INTO price_history_count
  FROM price_history ph
  WHERE ph.product_id = product_uuid;
  
  IF price_history_count > 0 THEN
    -- Use price history
    RETURN QUERY SELECT * FROM get_latest_price(product_uuid);
  ELSE
    -- Fall back to product price
    SELECT p.price, p.updated_at INTO product_price, product_updated
    FROM products p
    WHERE p.id = product_uuid;
    
    RETURN QUERY SELECT 
      COALESCE(product_price, 0::NUMERIC) as current_price,
      NULL::NUMERIC as previous_price,
      0::NUMERIC as price_change,
      0::NUMERIC as price_change_percentage,
      COALESCE(product_updated, NOW()) as last_updated;
  END IF;
END;
$$ LANGUAGE plpgsql;
