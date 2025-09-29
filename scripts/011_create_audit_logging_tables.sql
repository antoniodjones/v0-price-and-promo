-- Create comprehensive audit logging tables
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL, -- 'user', 'system', 'business', 'security', 'data'
    event_action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', 'sync', etc.
    resource_type VARCHAR(100), -- 'user', 'price_source', 'module', 'tenant', etc.
    resource_id VARCHAR(255), -- ID of the affected resource
    user_id UUID REFERENCES auth.users(id),
    user_email VARCHAR(255),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    event_data JSONB, -- Flexible data storage for event details
    old_values JSONB, -- Previous state for update operations
    new_values JSONB, -- New state for update operations
    severity VARCHAR(20) DEFAULT 'info', -- 'critical', 'high', 'medium', 'low', 'info'
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'failure', 'warning'
    error_message TEXT,
    metadata JSONB, -- Additional context data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE -- For automatic cleanup
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_category ON audit_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_expires_at ON audit_logs(expires_at) WHERE expires_at IS NOT NULL;

-- Create audit log statistics table for dashboard metrics
CREATE TABLE IF NOT EXISTS audit_log_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, event_category)
);

-- Create index for stats queries
CREATE INDEX IF NOT EXISTS idx_audit_log_stats_date ON audit_log_stats(date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_stats_category ON audit_log_stats(event_category);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for audit logs (admin only)
CREATE POLICY "Admin can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Create policies for audit log stats (admin only)
CREATE POLICY "Admin can view audit log stats" ON audit_log_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "System can manage audit log stats" ON audit_log_stats
    FOR ALL USING (true);

-- Create function to automatically update audit log stats
CREATE OR REPLACE FUNCTION update_audit_log_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log_stats (date, event_category, event_count, error_count, warning_count, unique_users)
    VALUES (
        CURRENT_DATE,
        NEW.event_category,
        1,
        CASE WHEN NEW.status = 'failure' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status = 'warning' THEN 1 ELSE 0 END,
        CASE WHEN NEW.user_id IS NOT NULL THEN 1 ELSE 0 END
    )
    ON CONFLICT (date, event_category) 
    DO UPDATE SET
        event_count = audit_log_stats.event_count + 1,
        error_count = audit_log_stats.error_count + CASE WHEN NEW.status = 'failure' THEN 1 ELSE 0 END,
        warning_count = audit_log_stats.warning_count + CASE WHEN NEW.status = 'warning' THEN 1 ELSE 0 END,
        unique_users = audit_log_stats.unique_users + CASE WHEN NEW.user_id IS NOT NULL THEN 1 ELSE 0 END,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stats automatically
CREATE TRIGGER trigger_update_audit_log_stats
    AFTER INSERT ON audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_log_stats();

-- Create function to clean up expired audit logs
CREATE OR REPLACE FUNCTION cleanup_expired_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert initial audit log for system setup
INSERT INTO audit_logs (
    event_type,
    event_category,
    event_action,
    resource_type,
    event_data,
    severity,
    status,
    metadata
) VALUES (
    'system_setup',
    'system',
    'create',
    'audit_system',
    '{"message": "Audit logging infrastructure initialized"}',
    'info',
    'success',
    '{"version": "1.0", "setup_date": "' || NOW()::text || '"}'
);
