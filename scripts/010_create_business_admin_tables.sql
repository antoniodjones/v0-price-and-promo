-- Create business administration tables for Phase 7

-- Tenant Management
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  domain VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  subscription_tier VARCHAR(20) DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'professional', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Rules Configuration
CREATE TABLE IF NOT EXISTS business_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  rule_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External Integrations Management
CREATE TABLE IF NOT EXISTS external_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  integration_type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  credentials JSONB DEFAULT '{}', -- Encrypted
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'testing')),
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_frequency VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data Import/Export Jobs
CREATE TABLE IF NOT EXISTS data_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('import', 'export')),
  data_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  file_path TEXT,
  file_size BIGINT,
  records_processed INTEGER DEFAULT 0,
  records_total INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- System Configuration
CREATE TABLE IF NOT EXISTS system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_sensitive BOOLEAN DEFAULT false,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tenant and system configurations
INSERT INTO tenants (name, slug, domain, status, subscription_tier) VALUES
('GTI Pricing Engine', 'gti-main', 'localhost:3000', 'active', 'enterprise')
ON CONFLICT (slug) DO NOTHING;

-- Insert default system configurations
INSERT INTO system_config (config_key, config_value, description, category) VALUES
('pricing.default_markup', '{"value": 0.15, "type": "percentage"}', 'Default markup percentage for pricing calculations', 'pricing'),
('discounts.max_percentage', '{"value": 0.50, "type": "percentage"}', 'Maximum discount percentage allowed', 'discounts'),
('inventory.low_stock_threshold', '{"value": 10, "type": "integer"}', 'Threshold for low stock alerts', 'inventory'),
('notifications.email_enabled', '{"value": true, "type": "boolean"}', 'Enable email notifications', 'notifications'),
('analytics.retention_days', '{"value": 90, "type": "integer"}', 'Data retention period in days', 'analytics'),
('security.session_timeout', '{"value": 3600, "type": "integer"}', 'Session timeout in seconds', 'security')
ON CONFLICT (config_key) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_business_rules_tenant_id ON business_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_business_rules_enabled ON business_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_external_integrations_tenant_id ON external_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_external_integrations_status ON external_integrations(status);
CREATE INDEX IF NOT EXISTS idx_data_jobs_tenant_id ON data_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_data_jobs_status ON data_jobs(status);
CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_config(category);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access only for now)
CREATE POLICY "Admin access to tenants" ON tenants FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin access to business_rules" ON business_rules FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin access to external_integrations" ON external_integrations FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin access to data_jobs" ON data_jobs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin access to system_config" ON system_config FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid() AND role = 'admin')
);
