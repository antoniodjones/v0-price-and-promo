-- Create system_modules table for Phase 7 Module Management
CREATE TABLE IF NOT EXISTS system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  domain VARCHAR(50) DEFAULT 'core' CHECK (domain IN ('core', 'pricing', 'analytics', 'admin')),
  dependencies TEXT[] DEFAULT '{}',
  components TEXT[] DEFAULT '{}',
  routes TEXT[] DEFAULT '{}',
  version VARCHAR(20) DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert core modules as defined in Master Restoration Plan
INSERT INTO system_modules (module_id, name, description, enabled, risk_level, domain, dependencies, components, routes) VALUES
-- Core Modules (Always Enabled)
('error-handling', 'Error Handling', 'Comprehensive error boundary system and global error handling', true, 'low', 'core', '{}', '{"ErrorBoundary", "GlobalErrorHandler"}', '{}'),
('ui-atoms', 'UI Atoms', 'Basic UI elements (Button, Input, Card)', true, 'low', 'core', '{"error-handling"}', '{"Button", "Input", "Card", "Badge", "Loading"}', '{}'),
('layout-system', 'Layout System', 'Main container layouts and navigation', true, 'low', 'core', '{"ui-atoms"}', '{"AppLayout", "Header", "Sidebar"}', '{"/"}'),
('settings-system', 'Settings System', 'Global configuration and preferences', true, 'medium', 'core', '{"layout-system"}', '{"SettingsPage", "SettingsSidebar"}', '{"/settings"}'),

-- Business Modules (Configurable)
('authentication', 'Authentication', 'User authentication and authorization system', true, 'medium', 'core', '{"settings-system"}', '{"LoginForm", "ProtectedRoute", "UserMenu"}', '{"/auth/login", "/auth/signup"}'),
('pricing-engine', 'Pricing Engine', 'Core product pricing and calculation logic', true, 'high', 'pricing', '{"authentication"}', '{"ProductList", "PricingCalculator", "PriceHistory"}', '{"/pricing", "/products"}'),
('customer-discounts', 'Customer Discounts', 'Customer-specific discount management', true, 'high', 'pricing', '{"pricing-engine"}', '{"DiscountList", "DiscountWizard", "CustomerAssignment"}', '{"/discounts/customer"}'),
('inventory-discounts', 'Inventory Discounts', 'Automated inventory-based discount rules', true, 'high', 'pricing', '{"pricing-engine"}', '{"InventoryRules", "InventoryMonitor", "InventoryDashboard"}', '{"/discounts/inventory"}'),
('promotions', 'Promotions System', 'BOGO promotions and bundle deals', true, 'high', 'pricing', '{"customer-discounts"}', '{"BOGOPromotions", "BundleDeals", "PromotionWizard", "PromotionCalendar"}', '{"/promotions"}'),
('analytics', 'Analytics Domain', 'Business intelligence and reporting system', true, 'high', 'analytics', '{"pricing-engine"}', '{"AnalyticsDashboard", "SalesAnalytics", "CustomerAnalytics", "ReportBuilder"}', '{"/analytics"}'),
('admin-tools', 'Admin Tools', 'System administration and management tools', true, 'high', 'admin', '{"analytics"}', '{"AdminDashboard", "UserManagement", "SystemSettings", "ModuleManager"}', '{"/admin"}'),
('real-time-features', 'Real-time Features', 'WebSocket integration and live updates', false, 'high', 'admin', '{"admin-tools"}', '{"WebSocketProvider", "LiveNotifications", "RealtimeAnalytics"}', '{}');

-- Create audit log for module changes
CREATE TABLE IF NOT EXISTS system_module_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id VARCHAR(50) NOT NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('enabled', 'disabled', 'updated')),
  changed_by UUID,
  previous_state JSONB,
  new_state JSONB,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_modules_enabled ON system_modules(enabled);
CREATE INDEX IF NOT EXISTS idx_system_modules_domain ON system_modules(domain);
CREATE INDEX IF NOT EXISTS idx_system_modules_risk_level ON system_modules(risk_level);
CREATE INDEX IF NOT EXISTS idx_system_module_audit_module_id ON system_module_audit(module_id);
CREATE INDEX IF NOT EXISTS idx_system_module_audit_created_at ON system_module_audit(created_at);

-- Add RLS policies
ALTER TABLE system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_module_audit ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read modules
CREATE POLICY "Allow authenticated users to read modules" ON system_modules
  FOR SELECT TO authenticated USING (true);

-- Only allow admin users to modify modules
CREATE POLICY "Allow admin users to modify modules" ON system_modules
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow authenticated users to read audit logs
CREATE POLICY "Allow authenticated users to read audit logs" ON system_module_audit
  FOR SELECT TO authenticated USING (true);

-- Only allow admin users to insert audit logs
CREATE POLICY "Allow admin users to insert audit logs" ON system_module_audit
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
