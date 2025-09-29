-- Creating database tables for performance monitoring
-- Performance metrics storage
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    response_time NUMERIC NOT NULL,
    throughput NUMERIC NOT NULL,
    error_rate NUMERIC NOT NULL,
    cpu_usage NUMERIC NOT NULL,
    memory_usage NUMERIC NOT NULL,
    database_connections INTEGER NOT NULL,
    cache_hit_rate NUMERIC NOT NULL,
    queue_length INTEGER NOT NULL,
    active_users INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance alerts storage
CREATE TABLE IF NOT EXISTS performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id TEXT NOT NULL,
    metric TEXT NOT NULL,
    value NUMERIC NOT NULL,
    threshold NUMERIC NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alert rules configuration
CREATE TABLE IF NOT EXISTS performance_alert_rules (
    id TEXT PRIMARY KEY,
    metric TEXT NOT NULL,
    threshold NUMERIC NOT NULL,
    operator TEXT NOT NULL CHECK (operator IN ('gt', 'lt', 'eq')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cooldown_ms INTEGER NOT NULL DEFAULT 300000,
    last_triggered TIMESTAMPTZ,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance test results
CREATE TABLE IF NOT EXISTS performance_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name TEXT NOT NULL,
    test_type TEXT NOT NULL CHECK (test_type IN ('load', 'stress', 'endurance', 'spike')),
    status TEXT NOT NULL CHECK (status IN ('running', 'passed', 'failed', 'cancelled')),
    duration_ms INTEGER,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    results JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_by UUID REFERENCES app_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_created_at ON performance_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_resolved ON performance_alerts(resolved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_test_results_status ON performance_test_results(status, started_at DESC);

-- Insert default alert rules
INSERT INTO performance_alert_rules (id, metric, threshold, operator, severity, description) VALUES
('response-time-high', 'response_time', 1000, 'gt', 'high', 'Response time exceeds 1 second'),
('error-rate-critical', 'error_rate', 5, 'gt', 'critical', 'Error rate exceeds 5%'),
('cpu-usage-high', 'cpu_usage', 80, 'gt', 'high', 'CPU usage exceeds 80%'),
('memory-usage-critical', 'memory_usage', 90, 'gt', 'critical', 'Memory usage exceeds 90%'),
('throughput-low', 'throughput', 500, 'lt', 'medium', 'Throughput drops below 500 req/s')
ON CONFLICT (id) DO NOTHING;

-- Function to clean old metrics (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_performance_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM performance_metrics 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    DELETE FROM performance_alerts 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    DELETE FROM performance_test_results 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (if using pg_cron extension)
-- SELECT cron.schedule('cleanup-performance-metrics', '0 2 * * *', 'SELECT cleanup_old_performance_metrics();');
