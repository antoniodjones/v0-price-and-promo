-- Real-time Analytics Tables
-- This script creates tables for storing real-time analytics data and events

-- Real-time events log
CREATE TABLE IF NOT EXISTS realtime_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL, -- sale, promotion_used, price_change, user_action, alert
    title VARCHAR(200) NOT NULL,
    description TEXT,
    value DECIMAL(15,2), -- monetary value if applicable
    severity VARCHAR(20), -- low, medium, high, critical (for alerts)
    metadata JSONB DEFAULT '{}',
    user_id UUID, -- if event is user-related
    product_id UUID, -- if event is product-related
    promotion_id UUID, -- if event is promotion-related
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics snapshots for time-series data
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Revenue metrics
    total_revenue DECIMAL(15,2) DEFAULT 0,
    revenue_change DECIMAL(15,2) DEFAULT 0,
    revenue_change_percent DECIMAL(5,2) DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Customer metrics
    active_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Product metrics
    products_sold INTEGER DEFAULT 0,
    inventory_alerts INTEGER DEFAULT 0,
    price_changes INTEGER DEFAULT 0,
    top_category VARCHAR(100),
    
    -- Promotion metrics
    active_promotions INTEGER DEFAULT 0,
    promotion_usage INTEGER DEFAULT 0,
    promotion_revenue DECIMAL(15,2) DEFAULT 0,
    promotion_roi DECIMAL(5,2) DEFAULT 0,
    
    -- Performance metrics
    response_time_avg DECIMAL(8,2) DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0,
    system_health_score INTEGER DEFAULT 100,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'
);

-- Customer segments for analytics
CREATE TABLE IF NOT EXISTS customer_segments_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_name VARCHAR(100) NOT NULL,
    customer_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    avg_order_value DECIMAL(10,2) DEFAULT 0,
    segment_color VARCHAR(7), -- hex color code
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(segment_name)
);

-- Product performance analytics
CREATE TABLE IF NOT EXISTS product_performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    sales_count INTEGER DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    margin_percent DECIMAL(5,2) DEFAULT 0,
    trend VARCHAR(10) DEFAULT 'stable', -- up, down, stable
    rank_position INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id)
);

-- Promotion insights analytics
CREATE TABLE IF NOT EXISTS promotion_insights_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL,
    promotion_name VARCHAR(200) NOT NULL,
    promotion_type VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(15,2) DEFAULT 0,
    roi DECIMAL(5,2) DEFAULT 0,
    performance_score INTEGER DEFAULT 0, -- 0-100
    status VARCHAR(20) DEFAULT 'active', -- active, paused, ended
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(promotion_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_realtime_events_created_at ON realtime_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_realtime_events_type ON realtime_events(event_type);
CREATE INDEX IF NOT EXISTS idx_realtime_events_user_id ON realtime_events(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_events_product_id ON realtime_events(product_id);

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_time ON analytics_snapshots(snapshot_time DESC);

CREATE INDEX IF NOT EXISTS idx_customer_segments_updated ON customer_segments_analytics(last_updated DESC);

CREATE INDEX IF NOT EXISTS idx_product_performance_updated ON product_performance_analytics(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_product_performance_rank ON product_performance_analytics(rank_position);

CREATE INDEX IF NOT EXISTS idx_promotion_insights_updated ON promotion_insights_analytics(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_promotion_insights_status ON promotion_insights_analytics(status);

-- Insert sample customer segments
INSERT INTO customer_segments_analytics (segment_name, customer_count, total_revenue, avg_order_value, segment_color) VALUES
('Premium', 234, 18500.00, 195.00, '#3b82f6'),
('Regular', 567, 19800.00, 125.00, '#10b981'),
('New', 289, 6200.00, 85.00, '#f59e0b'),
('VIP', 157, 12800.00, 285.00, '#8b5cf6')
ON CONFLICT (segment_name) DO UPDATE SET
    customer_count = EXCLUDED.customer_count,
    total_revenue = EXCLUDED.total_revenue,
    avg_order_value = EXCLUDED.avg_order_value,
    last_updated = NOW();

-- Function to create analytics snapshot
CREATE OR REPLACE FUNCTION create_analytics_snapshot()
RETURNS void AS $$
DECLARE
    current_revenue DECIMAL(15,2);
    current_orders INTEGER;
    current_customers INTEGER;
    current_promotions INTEGER;
BEGIN
    -- Calculate current metrics (simplified - you'd use real data)
    SELECT COALESCE(SUM(revenue_impact), 0) INTO current_revenue
    FROM promotion_tracking 
    WHERE date_tracked >= CURRENT_DATE;
    
    SELECT COUNT(*) INTO current_orders
    FROM promotion_tracking 
    WHERE date_tracked >= CURRENT_DATE;
    
    SELECT COUNT(DISTINCT customer_id) INTO current_customers
    FROM customer_discount_assignments;
    
    SELECT COUNT(*) INTO current_promotions
    FROM bogo_promotions 
    WHERE status = 'active';
    
    -- Insert snapshot
    INSERT INTO analytics_snapshots (
        total_revenue,
        orders_count,
        active_customers,
        active_promotions,
        avg_order_value,
        conversion_rate
    ) VALUES (
        current_revenue,
        current_orders,
        current_customers,
        current_promotions,
        CASE WHEN current_orders > 0 THEN current_revenue / current_orders ELSE 0 END,
        CASE WHEN current_customers > 0 THEN (current_orders::DECIMAL / current_customers) * 100 ELSE 0 END
    );
END;
$$ LANGUAGE plpgsql;

-- Function to log realtime events
CREATE OR REPLACE FUNCTION log_realtime_event(
    p_event_type VARCHAR(50),
    p_title VARCHAR(200),
    p_description TEXT DEFAULT NULL,
    p_value DECIMAL(15,2) DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}',
    p_user_id UUID DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_promotion_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO realtime_events (
        event_type,
        title,
        description,
        value,
        metadata,
        user_id,
        product_id,
        promotion_id
    ) VALUES (
        p_event_type,
        p_title,
        p_description,
        p_value,
        p_metadata,
        p_user_id,
        p_product_id,
        p_promotion_id
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
    -- Keep last 90 days of events
    DELETE FROM realtime_events 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Keep last 30 days of snapshots
    DELETE FROM analytics_snapshots 
    WHERE snapshot_time < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE realtime_events IS 'Stores real-time business events for analytics dashboard';
COMMENT ON TABLE analytics_snapshots IS 'Time-series snapshots of key business metrics';
COMMENT ON TABLE customer_segments_analytics IS 'Customer segmentation data for analytics';
COMMENT ON TABLE product_performance_analytics IS 'Product performance metrics and rankings';
COMMENT ON TABLE promotion_insights_analytics IS 'Promotion effectiveness and ROI analytics';
