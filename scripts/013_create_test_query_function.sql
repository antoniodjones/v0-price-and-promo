-- Create a safe test query function for performance testing
CREATE OR REPLACE FUNCTION execute_test_query(query_text TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow specific test queries for security
  IF query_text = 'SELECT * FROM products LIMIT 100' THEN
    RETURN QUERY
    SELECT to_jsonb(p.*) as result
    FROM products p
    LIMIT 100;
    
  ELSIF query_text = 'SELECT * FROM pricing_rules WHERE active = true' THEN
    RETURN QUERY
    SELECT to_jsonb(pr.*) as result
    FROM pricing_rules pr
    WHERE pr.active = true;
    
  ELSIF query_text = 'SELECT COUNT(*) FROM audit_logs WHERE created_at > NOW() - INTERVAL ''1 day''' THEN
    RETURN QUERY
    SELECT to_jsonb(json_build_object('count', COUNT(*))) as result
    FROM audit_logs
    WHERE created_at > NOW() - INTERVAL '1 day';
    
  ELSE
    RAISE EXCEPTION 'Query not allowed for testing: %', query_text;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_test_query(TEXT) TO authenticated;
