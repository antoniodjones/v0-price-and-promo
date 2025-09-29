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
    (SELECT price FROM latest_prices WHERE rn = 1) as current_price,
    (SELECT price FROM latest_prices WHERE rn = 2) as previous_price,
    (SELECT price FROM latest_prices WHERE rn = 1) - COALESCE((SELECT price FROM latest_prices WHERE rn = 2), 0) as price_change,
    CASE 
      WHEN (SELECT price FROM latest_prices WHERE rn = 2) > 0 THEN
        ((SELECT price FROM latest_prices WHERE rn = 1) - (SELECT price FROM latest_prices WHERE rn = 2)) / (SELECT price FROM latest_prices WHERE rn = 2) * 100
      ELSE 0
    END as price_change_percentage,
    (SELECT last_updated FROM latest_prices WHERE rn = 1) as last_updated;
END;
$$ LANGUAGE plpgsql;

-- Create function to check for price alerts
CREATE OR REPLACE FUNCTION check_price_alerts()
RETURNS void AS $$
DECLARE
  alert_record RECORD;
  current_price_data RECORD;
BEGIN
  FOR alert_record IN 
    SELECT * FROM price_alerts 
    WHERE is_active = true AND notification_sent = false
  LOOP
    SELECT * INTO current_price_data 
    FROM get_latest_price(alert_record.product_id);
    
    IF current_price_data.current_price IS NOT NULL AND 
       current_price_data.current_price <= alert_record.target_price THEN
      
      UPDATE price_alerts 
      SET 
        notification_sent = true,
        triggered_at = NOW()
      WHERE id = alert_record.id;
      
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
