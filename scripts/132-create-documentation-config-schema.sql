-- ============================================================================
-- Script 132: Create Documentation Configuration Schema
-- ============================================================================
-- Purpose: Set up database schema for contextual help documentation links
-- Author: v0
-- Date: 2025-01-09
-- ============================================================================

BEGIN;

-- Insert default documentation configuration into system_config
INSERT INTO system_config (
  config_key,
  config_value,
  category,
  description,
  is_sensitive,
  created_at,
  updated_at
)
VALUES (
  'documentation_links',
  jsonb_build_object(
    'globalEnabled', true,
    'links', jsonb_build_array(
      jsonb_build_object(
        'pageId', 'dashboard',
        'pageName', 'Dashboard',
        'documentationUrl', '/docs/dashboard-guide.md',
        'enabled', true,
        'category', 'Core',
        'description', 'Overview of your pricing engine metrics and performance'
      ),
      jsonb_build_object(
        'pageId', 'products',
        'pageName', 'Products',
        'documentationUrl', '/docs/products-user-guide.md',
        'enabled', true,
        'category', 'Catalog',
        'description', 'Managing your product catalog and inventory'
      ),
      jsonb_build_object(
        'pageId', 'customers',
        'pageName', 'Customers',
        'documentationUrl', '/docs/customers-user-guide.md',
        'enabled', true,
        'category', 'Catalog',
        'description', 'Customer management and tier assignments'
      ),
      jsonb_build_object(
        'pageId', 'pricing-engine',
        'pageName', 'Pricing Engine',
        'documentationUrl', '/docs/pricing-engine-guide.md',
        'enabled', true,
        'category', 'Pricing',
        'description', 'Understanding pricing calculations and rules'
      ),
      jsonb_build_object(
        'pageId', 'discounts',
        'pageName', 'Discounts',
        'documentationUrl', '/docs/discounts-user-guide.md',
        'enabled', true,
        'category', 'Promotions',
        'description', 'Creating and managing discount rules'
      ),
      jsonb_build_object(
        'pageId', 'bundle-deals',
        'pageName', 'Bundle Deals',
        'documentationUrl', '/docs/bundle-deals-guide.md',
        'enabled', true,
        'category', 'Promotions',
        'description', 'Setting up product bundles and combo deals'
      ),
      jsonb_build_object(
        'pageId', 'best-deal-logic',
        'pageName', 'Best Deal Logic',
        'documentationUrl', '/docs/best-deal-logic-training-guide.md',
        'enabled', true,
        'category', 'Promotions',
        'description', 'How the system selects the best deal for customers'
      ),
      jsonb_build_object(
        'pageId', 'promotions',
        'pageName', 'Promotions',
        'documentationUrl', '/docs/promotions-user-guide.md',
        'enabled', true,
        'category', 'Promotions',
        'description', 'Managing promotional campaigns and promo codes'
      ),
      jsonb_build_object(
        'pageId', 'promo-simulator',
        'pageName', 'Promo Simulator',
        'documentationUrl', '/docs/promo-simulator-guide.md',
        'enabled', true,
        'category', 'Testing',
        'description', 'Testing promotions before going live'
      ),
      jsonb_build_object(
        'pageId', 'analytics',
        'pageName', 'Analytics',
        'documentationUrl', '/docs/analytics-guide.md',
        'enabled', true,
        'category', 'Reporting',
        'description', 'Understanding your analytics and reports'
      ),
      jsonb_build_object(
        'pageId', 'settings',
        'pageName', 'Settings',
        'documentationUrl', '/docs/settings-guide.md',
        'enabled', true,
        'category', 'System',
        'description', 'Configuring system settings and preferences'
      )
    )
  ),
  'documentation',
  'Configuration for contextual help documentation links',
  false,
  NOW(),
  NOW()
)
ON CONFLICT (config_key) DO UPDATE
SET
  config_value = EXCLUDED.config_value,
  updated_at = NOW();

COMMIT;

-- Verification
SELECT 
  config_key,
  category,
  description,
  jsonb_pretty(config_value) as configuration
FROM system_config
WHERE config_key = 'documentation_links';
