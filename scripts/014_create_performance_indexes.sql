-- Adding optimized database indexes for performance
-- Performance optimization indexes for GTI Pricing Engine

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_category_brand ON products(category, brand);
CREATE INDEX IF NOT EXISTS idx_products_expiration_date ON products(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_thc_percentage ON products(thc_percentage) WHERE thc_percentage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_inventory_count ON products(inventory_count);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at);

-- Customer discounts indexes
CREATE INDEX IF NOT EXISTS idx_customer_discounts_status ON customer_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_customer_tiers ON customer_discounts USING GIN(customer_tiers);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_markets ON customer_discounts USING GIN(markets);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_dates ON customer_discounts(start_date, end_date);

-- Inventory discounts indexes
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_status ON inventory_discounts(status);
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_type ON inventory_discounts(type);
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_scope ON inventory_discounts(scope, scope_value);

-- BOGO promotions indexes
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_status ON bogo_promotions(status);
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_trigger ON bogo_promotions(trigger_level, trigger_target);
CREATE INDEX IF NOT EXISTS idx_bogo_promotions_dates ON bogo_promotions(start_date, end_date);

-- Bundle deals indexes
CREATE INDEX IF NOT EXISTS idx_bundle_deals_status ON bundle_deals(status);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_products ON bundle_deals USING GIN(products);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Analytics tables indexes (if they exist)
CREATE INDEX IF NOT EXISTS idx_sales_analytics_date ON sales_analytics(date);
CREATE INDEX IF NOT EXISTS idx_sales_analytics_market ON sales_analytics(market);
CREATE INDEX IF NOT EXISTS idx_customer_analytics_date ON customer_analytics(date);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_category_brand_price ON products(category, brand, base_price);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_active_tiers ON customer_discounts(status, customer_tiers) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_active_type ON inventory_discounts(status, type) WHERE status = 'active';

-- Partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_products_active_inventory ON products(id, inventory_count) WHERE inventory_count > 0;
CREATE INDEX IF NOT EXISTS idx_products_expiring_soon ON products(id, expiration_date) WHERE expiration_date <= CURRENT_DATE + INTERVAL '30 days';

-- Function-based indexes for common calculations
CREATE INDEX IF NOT EXISTS idx_products_days_to_expiration ON products((EXTRACT(DAY FROM (expiration_date - CURRENT_DATE)))) WHERE expiration_date IS NOT NULL;

-- Add table statistics update
ANALYZE products;
ANALYZE customer_discounts;
ANALYZE inventory_discounts;
ANALYZE bogo_promotions;
ANALYZE bundle_deals;
ANALYZE customers;
