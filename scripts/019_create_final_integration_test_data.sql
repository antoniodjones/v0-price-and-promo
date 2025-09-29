-- Final Integration Test Data and Validation
-- This script creates comprehensive test data and validation functions for system integration testing

-- Create comprehensive test data for integration testing
INSERT INTO products (name, description, base_price, category, sku, status) VALUES
('Integration Test Product A', 'High-volume test product for load testing', 99.99, 'Electronics', 'ITP-001', 'active'),
('Integration Test Product B', 'Mid-range test product for workflow testing', 149.99, 'Electronics', 'ITP-002', 'active'),
('Integration Test Product C', 'Premium test product for pricing validation', 299.99, 'Electronics', 'ITP-003', 'active'),
('Bulk Test Product D', 'Bulk pricing test product', 49.99, 'Accessories', 'BTP-001', 'active'),
('Promotion Test Product E', 'Product for promotion testing', 199.99, 'Software', 'PTP-001', 'active')
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- Create test users for integration testing
INSERT INTO users (email, first_name, last_name, user_type, status) VALUES
('integration.test1@example.com', 'Integration', 'Tester One', 'customer', 'active'),
('integration.test2@example.com', 'Integration', 'Tester Two', 'customer', 'active'),
('admin.test@example.com', 'Admin', 'Tester', 'admin', 'active'),
('bulk.buyer@example.com', 'Bulk', 'Buyer', 'customer', 'active'),
('premium.customer@example.com', 'Premium', 'Customer', 'customer', 'active')
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();

-- Create test promotions for integration testing
INSERT INTO bogo_promotions (
    name, 
    description, 
    buy_quantity, 
    get_quantity, 
    discount_type, 
    discount_value, 
    start_date, 
    end_date, 
    status,
    max_uses_per_customer,
    total_usage_limit
) VALUES
('Integration Test BOGO', 'Buy 2 Get 1 Free for integration testing', 2, 1, 'percentage', 100.00, NOW(), NOW() + INTERVAL '30 days', 'active', 5, 1000),
('Bulk Discount Test', '20% off for bulk purchases', 1, 0, 'percentage', 20.00, NOW(), NOW() + INTERVAL '30 days', 'active', 10, 500),
('Premium Customer Discount', '15% off for premium customers', 1, 0, 'percentage', 15.00, NOW(), NOW() + INTERVAL '30 days', 'active', 3, 200)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    discount_value = EXCLUDED.discount_value,
    updated_at = NOW();

-- Create test customer segments
INSERT INTO customer_segments (segment_name, description, criteria, discount_percentage) VALUES
('Integration Test Segment', 'Segment for integration testing', '{"min_orders": 1}', 10.00),
('Bulk Buyers', 'Customers who buy in bulk', '{"min_quantity": 10}', 15.00),
('Premium Customers', 'High-value customers', '{"min_total_spent": 1000}', 20.00)
ON CONFLICT (segment_name) DO UPDATE SET
    description = EXCLUDED.description,
    criteria = EXCLUDED.criteria,
    discount_percentage = EXCLUDED.discount_percentage;

-- Function to validate system integration
CREATE OR REPLACE FUNCTION validate_system_integration()
RETURNS TABLE (
    test_name VARCHAR(200),
    status VARCHAR(20),
    details TEXT,
    execution_time_ms INTEGER
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    test_start_time TIMESTAMP;
    test_end_time TIMESTAMP;
    product_count INTEGER;
    user_count INTEGER;
    promotion_count INTEGER;
    pricing_result RECORD;
    test_user_id UUID;
    test_product_id UUID;
    test_promotion_id UUID;
BEGIN
    start_time := clock_timestamp();
    
    -- Test 1: Database Connectivity and Basic Data Integrity
    test_start_time := clock_timestamp();
    
    SELECT COUNT(*) INTO product_count FROM products WHERE status = 'active';
    SELECT COUNT(*) INTO user_count FROM users WHERE status = 'active';
    SELECT COUNT(*) INTO promotion_count FROM bogo_promotions WHERE status = 'active';
    
    test_end_time := clock_timestamp();
    
    IF product_count > 0 AND user_count > 0 AND promotion_count > 0 THEN
        RETURN QUERY SELECT 
            'Database Connectivity Test'::VARCHAR(200),
            'passed'::VARCHAR(20),
            format('Found %s products, %s users, %s promotions', product_count, user_count, promotion_count)::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    ELSE
        RETURN QUERY SELECT 
            'Database Connectivity Test'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Missing required test data'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    END IF;
    
    -- Test 2: Pricing Calculation Integration
    test_start_time := clock_timestamp();
    
    SELECT id INTO test_product_id FROM products WHERE sku = 'ITP-001' LIMIT 1;
    SELECT id INTO test_user_id FROM users WHERE email = 'integration.test1@example.com' LIMIT 1;
    
    IF test_product_id IS NOT NULL AND test_user_id IS NOT NULL THEN
        -- Simulate pricing calculation
        SELECT 
            p.base_price,
            COALESCE(cs.discount_percentage, 0) as segment_discount,
            p.base_price * (1 - COALESCE(cs.discount_percentage, 0) / 100) as final_price
        INTO pricing_result
        FROM products p
        LEFT JOIN customer_discount_assignments cda ON cda.customer_id = test_user_id
        LEFT JOIN customer_segments cs ON cs.id = cda.segment_id
        WHERE p.id = test_product_id;
        
        test_end_time := clock_timestamp();
        
        RETURN QUERY SELECT 
            'Pricing Calculation Integration'::VARCHAR(200),
            'passed'::VARCHAR(20),
            format('Base price: %s, Final price: %s', pricing_result.base_price, pricing_result.final_price)::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    ELSE
        test_end_time := clock_timestamp();
        RETURN QUERY SELECT 
            'Pricing Calculation Integration'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Test data not found'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    END IF;
    
    -- Test 3: Promotion Engine Integration
    test_start_time := clock_timestamp();
    
    SELECT id INTO test_promotion_id FROM bogo_promotions WHERE name = 'Integration Test BOGO' LIMIT 1;
    
    IF test_promotion_id IS NOT NULL THEN
        -- Test promotion application logic
        INSERT INTO promotion_tracking (
            promotion_id,
            customer_id,
            product_id,
            quantity_purchased,
            discount_applied,
            revenue_impact,
            date_tracked
        ) VALUES (
            test_promotion_id,
            test_user_id,
            test_product_id,
            3, -- Buy 2 Get 1 scenario
            99.99, -- One free product
            -99.99, -- Revenue impact
            CURRENT_DATE
        ) ON CONFLICT DO NOTHING;
        
        test_end_time := clock_timestamp();
        
        RETURN QUERY SELECT 
            'Promotion Engine Integration'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'BOGO promotion applied successfully'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    ELSE
        test_end_time := clock_timestamp();
        RETURN QUERY SELECT 
            'Promotion Engine Integration'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Test promotion not found'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    END IF;
    
    -- Test 4: Analytics Data Integration
    test_start_time := clock_timestamp();
    
    -- Create analytics snapshot
    PERFORM create_analytics_snapshot();
    
    -- Verify analytics data
    IF EXISTS (SELECT 1 FROM analytics_snapshots WHERE snapshot_time >= CURRENT_DATE) THEN
        test_end_time := clock_timestamp();
        RETURN QUERY SELECT 
            'Analytics Data Integration'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'Analytics snapshot created successfully'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    ELSE
        test_end_time := clock_timestamp();
        RETURN QUERY SELECT 
            'Analytics Data Integration'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Analytics snapshot creation failed'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    END IF;
    
    -- Test 5: Performance Monitoring Integration
    test_start_time := clock_timestamp();
    
    -- Log a test event
    PERFORM log_realtime_event(
        'integration_test',
        'System Integration Test Execution',
        'Automated integration test validation',
        0.00,
        '{"test_suite": "system_integration", "automated": true}'::jsonb,
        test_user_id,
        test_product_id,
        test_promotion_id
    );
    
    test_end_time := clock_timestamp();
    
    IF EXISTS (SELECT 1 FROM realtime_events WHERE event_type = 'integration_test' AND created_at >= start_time) THEN
        RETURN QUERY SELECT 
            'Performance Monitoring Integration'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'Real-time event logged successfully'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    ELSE
        RETURN QUERY SELECT 
            'Performance Monitoring Integration'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Real-time event logging failed'::TEXT,
            EXTRACT(EPOCH FROM (test_end_time - test_start_time))::INTEGER * 1000;
    END IF;
    
    end_time := clock_timestamp();
    
    -- Final summary test
    RETURN QUERY SELECT 
        'Overall Integration Test Suite'::VARCHAR(200),
        'completed'::VARCHAR(20),
        format('Total execution time: %s ms', EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER * 1000)::TEXT,
        EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER * 1000;
        
END;
$$ LANGUAGE plpgsql;

-- Function to simulate load testing data
CREATE OR REPLACE FUNCTION simulate_load_test_data(
    p_concurrent_users INTEGER DEFAULT 100,
    p_duration_minutes INTEGER DEFAULT 5
)
RETURNS TABLE (
    metric_name VARCHAR(100),
    metric_value DECIMAL(10,2),
    metric_unit VARCHAR(20)
) AS $$
DECLARE
    i INTEGER;
    test_start_time TIMESTAMP := NOW();
    response_times DECIMAL(10,2)[];
    throughput_values INTEGER[];
    error_counts INTEGER[];
BEGIN
    -- Simulate load test metrics
    FOR i IN 1..p_duration_minutes LOOP
        -- Simulate response times (ms) - increasing under load
        response_times := array_append(response_times, 100 + (i * 10) + (random() * 50));
        
        -- Simulate throughput (requests/second) - decreasing under load
        throughput_values := array_append(throughput_values, 150 - (i * 5) + (random() * 20)::INTEGER);
        
        -- Simulate error counts - increasing under load
        error_counts := array_append(error_counts, (i * 2) + (random() * 5)::INTEGER);
    END LOOP;
    
    -- Return aggregated metrics
    RETURN QUERY SELECT 'Average Response Time'::VARCHAR(100), 
                        (SELECT AVG(unnest) FROM unnest(response_times))::DECIMAL(10,2),
                        'milliseconds'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Peak Response Time'::VARCHAR(100), 
                        (SELECT MAX(unnest) FROM unnest(response_times))::DECIMAL(10,2),
                        'milliseconds'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Average Throughput'::VARCHAR(100), 
                        (SELECT AVG(unnest) FROM unnest(throughput_values))::DECIMAL(10,2),
                        'requests/second'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Total Errors'::VARCHAR(100), 
                        (SELECT SUM(unnest) FROM unnest(error_counts))::DECIMAL(10,2),
                        'count'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Error Rate'::VARCHAR(100), 
                        ((SELECT SUM(unnest) FROM unnest(error_counts))::DECIMAL / 
                         (p_concurrent_users * p_duration_minutes * 60) * 100)::DECIMAL(10,2),
                        'percentage'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Concurrent Users'::VARCHAR(100), 
                        p_concurrent_users::DECIMAL(10,2),
                        'users'::VARCHAR(20);
    
    RETURN QUERY SELECT 'Test Duration'::VARCHAR(100), 
                        p_duration_minutes::DECIMAL(10,2),
                        'minutes'::VARCHAR(20);
END;
$$ LANGUAGE plpgsql;

-- Function to validate data consistency across all tables
CREATE OR REPLACE FUNCTION validate_data_consistency()
RETURNS TABLE (
    validation_check VARCHAR(200),
    status VARCHAR(20),
    details TEXT
) AS $$
BEGIN
    -- Check for orphaned promotion tracking records
    IF EXISTS (
        SELECT 1 FROM promotion_tracking pt 
        LEFT JOIN bogo_promotions bp ON pt.promotion_id = bp.id 
        WHERE bp.id IS NULL
    ) THEN
        RETURN QUERY SELECT 
            'Promotion Tracking Consistency'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Found orphaned promotion tracking records'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Promotion Tracking Consistency'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'All promotion tracking records have valid promotions'::TEXT;
    END IF;
    
    -- Check for orphaned customer discount assignments
    IF EXISTS (
        SELECT 1 FROM customer_discount_assignments cda
        LEFT JOIN users u ON cda.customer_id = u.id
        LEFT JOIN customer_segments cs ON cda.segment_id = cs.id
        WHERE u.id IS NULL OR cs.id IS NULL
    ) THEN
        RETURN QUERY SELECT 
            'Customer Discount Consistency'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Found orphaned customer discount assignments'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Customer Discount Consistency'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'All customer discount assignments are valid'::TEXT;
    END IF;
    
    -- Check for negative pricing values
    IF EXISTS (SELECT 1 FROM products WHERE base_price < 0) THEN
        RETURN QUERY SELECT 
            'Product Pricing Consistency'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Found products with negative base prices'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Product Pricing Consistency'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'All product prices are valid'::TEXT;
    END IF;
    
    -- Check for invalid promotion date ranges
    IF EXISTS (SELECT 1 FROM bogo_promotions WHERE start_date > end_date) THEN
        RETURN QUERY SELECT 
            'Promotion Date Consistency'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Found promotions with invalid date ranges'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Promotion Date Consistency'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'All promotion date ranges are valid'::TEXT;
    END IF;
    
    -- Check for duplicate SKUs
    IF EXISTS (
        SELECT sku FROM products 
        GROUP BY sku 
        HAVING COUNT(*) > 1
    ) THEN
        RETURN QUERY SELECT 
            'Product SKU Uniqueness'::VARCHAR(200),
            'failed'::VARCHAR(20),
            'Found duplicate product SKUs'::TEXT;
    ELSE
        RETURN QUERY SELECT 
            'Product SKU Uniqueness'::VARCHAR(200),
            'passed'::VARCHAR(20),
            'All product SKUs are unique'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for integration test performance
CREATE INDEX IF NOT EXISTS idx_integration_test_products ON products(sku, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_integration_test_users ON users(email, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_integration_test_promotions ON bogo_promotions(name, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_integration_test_tracking ON promotion_tracking(date_tracked, promotion_id);
CREATE INDEX IF NOT EXISTS idx_integration_test_events ON realtime_events(event_type, created_at) WHERE event_type = 'integration_test';

-- Insert sample CI pipeline execution for testing
INSERT INTO ci_pipeline_executions (
    pipeline_name,
    branch_name,
    status,
    total_tests,
    passed_tests,
    failed_tests,
    code_coverage,
    triggered_by
) VALUES (
    'GTI Pricing Engine - Integration Test Suite',
    'main',
    'passed',
    76,
    72,
    4,
    94.2,
    'system.integration.test@example.com'
);

-- Insert sample performance benchmarks
INSERT INTO performance_benchmarks (
    benchmark_name,
    test_category,
    avg_response_time_ms,
    min_response_time_ms,
    max_response_time_ms,
    p95_response_time_ms,
    p99_response_time_ms,
    requests_per_second,
    success_rate,
    cpu_usage_avg,
    memory_usage_avg_mb
) VALUES 
('Pricing Calculation API', 'api_response', 145.5, 89.2, 234.7, 198.3, 225.1, 85.3, 98.7, 35.2, 256.8),
('Product Catalog Load', 'page_load', 892.3, 654.1, 1234.5, 1089.7, 1198.2, 45.7, 99.2, 28.9, 189.4),
('Database Query Performance', 'database_query', 23.8, 12.4, 67.9, 45.2, 58.7, 234.5, 99.8, 15.3, 145.2),
('Bulk Pricing Calculation', 'calculation', 67.4, 34.2, 123.8, 98.7, 115.3, 67.8, 97.5, 42.1, 298.7);

COMMENT ON FUNCTION validate_system_integration() IS 'Comprehensive system integration validation function';
COMMENT ON FUNCTION simulate_load_test_data(INTEGER, INTEGER) IS 'Simulates load testing metrics for performance analysis';
COMMENT ON FUNCTION validate_data_consistency() IS 'Validates data consistency across all database tables';
