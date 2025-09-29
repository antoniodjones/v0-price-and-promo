-- Advanced Performance Monitoring Tables
-- This script creates tables for storing performance metrics, alerts, and monitoring data

-- Performance metrics storage with time-series data
CREATE TABLE IF NOT EXISTS performance_metrics_detailed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL, -- system, application, database, business
    value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    threshold_warning DECIMAL(15,4),
    threshold_critical DECIMAL(15,4),
    status VARCHAR(20) DEFAULT 'healthy', -- healthy, warning, critical, unknown
    trend VARCHAR(10) DEFAULT 'stable', -- up, down, stable
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance alert rules configuration
CREATE TABLE IF NOT EXISTS performance_alert_rules (
    id VARCHAR(100) PRIMARY KEY,
    metric VARCHAR(100) NOT NULL,
    operator VARCHAR(5) NOT NULL, -- >, <, =, >=, <=
    threshold DECIMAL(15,4) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    enabled BOOLEAN DEFAULT true,
    cooldown_ms INTEGER DEFAULT 300000, -- 5 minutes default
    last_triggered TIMESTAMP WITH TIME ZONE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance alerts log
CREATE TABLE IF NOT EXISTS performance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id VARCHAR(100) REFERENCES performance_alert_rules(id),
    metric VARCHAR(100) NOT NULL,
    value DECIMAL(15,4) NOT NULL,
    threshold DECIMAL(15,4) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health snapshots
CREATE TABLE IF NOT EXISTS system_health_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    overall_status VARCHAR(20) NOT NULL, -- healthy, degraded, critical
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    active_issues INTEGER DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    warning_issues INTEGER DEFAULT 0,
    issues_detail JSONB DEFAULT '[]',
    metrics_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance test results (enhanced)
CREATE TABLE IF NOT EXISTS performance_test_results_detailed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- load, stress, endurance, spike
    status VARCHAR(20) NOT NULL, -- running, passed, failed, pending
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms BIGINT,
    created_by UUID,
    
    -- Detailed metrics
    response_time_avg DECIMAL(10,2),
    response_time_p95 DECIMAL(10,2),
    response_time_p99 DECIMAL(10,2),
    throughput_avg DECIMAL(10,2),
    throughput_peak DECIMAL(10,2),
    error_rate DECIMAL(5,2),
    error_count INTEGER DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    
    -- System metrics during test
    cpu_usage_avg DECIMAL(5,2),
    cpu_usage_peak DECIMAL(5,2),
    memory_usage_avg DECIMAL(5,2),
    memory_usage_peak DECIMAL(5,2),
    disk_io_avg DECIMAL(10,2),
    network_io_avg DECIMAL(10,2),
    
    -- Test configuration and results
    test_config JSONB DEFAULT '{}',
    detailed_results JSONB DEFAULT '{}',
    error_details JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_performance_metrics_detailed_timestamp ON performance_metrics_detailed(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_detailed_metric_name ON performance_metrics_detailed(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_detailed_category ON performance_metrics_detailed(metric_category);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_detailed_status ON performance_metrics_detailed(status);

CREATE INDEX IF NOT EXISTS idx_performance_alerts_created_at ON performance_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_resolved ON performance_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_severity ON performance_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_performance_alerts_rule_id ON performance_alerts(rule_id);

CREATE INDEX IF NOT EXISTS idx_system_health_snapshots_created_at ON system_health_snapshots(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_snapshots_status ON system_health_snapshots(overall_status);

CREATE INDEX IF NOT EXISTS idx_performance_test_results_detailed_created_at ON performance_test_results_detailed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_test_results_detailed_status ON performance_test_results_detailed(status);
CREATE INDEX IF NOT EXISTS idx_performance_test_results_detailed_type ON performance_test_results_detailed(test_type);

-- Insert default alert rules
INSERT INTO performance_alert_rules (id, metric, operator, threshold, severity, description) VALUES
('cpu_high', 'cpu_usage', '>', 80, 'high', 'CPU usage is critically high'),
('memory_high', 'memory_usage', '>', 85, 'critical', 'Memory usage is critically high'),
('response_time_high', 'response_time', '>', 1000, 'high', 'Response time is too high'),
('error_rate_high', 'error_rate', '>', 3, 'critical', 'Error rate is above acceptable threshold'),
('disk_usage_high', 'disk_usage', '>', 85, 'medium', 'Disk usage is getting high'),
('db_connections_high', 'db_connections', '>', 70, 'high', 'Database connections are running high'),
('cache_hit_rate_low', 'cache_hit_rate', '<', 80, 'medium', 'Cache hit rate is below optimal'),
('throughput_low', 'throughput', '<', 500, 'medium', 'System throughput is below expected levels')
ON CONFLICT (id) DO NOTHING;

-- Function to clean up old performance data (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_performance_data()
RETURNS void AS $$
BEGIN
    -- Clean up old metrics (keep last 30 days)
    DELETE FROM performance_metrics_detailed 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old resolved alerts (keep last 7 days)
    DELETE FROM performance_alerts 
    WHERE resolved = true AND resolved_at < NOW() - INTERVAL '7 days';
    
    -- Clean up old health snapshots (keep last 30 days)
    DELETE FROM system_health_snapshots 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old test results (keep last 90 days)
    DELETE FROM performance_test_results_detailed 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup (if pg_cron is available)
-- SELECT cron.schedule('cleanup-performance-data', '0 2 * * *', 'SELECT cleanup_old_performance_data();');

COMMENT ON TABLE performance_metrics_detailed IS 'Stores detailed time-series performance metrics';
COMMENT ON TABLE performance_alert_rules IS 'Configuration for performance alert rules and thresholds';
COMMENT ON TABLE performance_alerts IS 'Log of triggered performance alerts';
COMMENT ON TABLE system_health_snapshots IS 'Periodic snapshots of overall system health';
COMMENT ON TABLE performance_test_results_detailed IS 'Detailed results from performance testing';
