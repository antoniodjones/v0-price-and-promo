-- GTI Pricing Engine - Complete Database Schema Setup
-- This script creates all necessary tables for the pricing and promotions engine

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Products table (extends existing inventory_items if needed)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    inventory_count INTEGER DEFAULT 0,
    thc_percentage DECIMAL(5, 2),
    cbd_percentage DECIMAL(5, 2),
    strain_type VARCHAR(50),
    brand VARCHAR(100),
    weight_grams DECIMAL(10, 2),
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer Discounts (tier-based, loyalty, etc.)
CREATE TABLE IF NOT EXISTS customer_discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    discount_type VARCHAR(50) NOT NULL, -- 'tier', 'loyalty', 'birthday', 'custom'
    discount_value DECIMAL(5, 2) NOT NULL, -- percentage
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory Discounts (clearance, near expiration, overstocked)
CREATE TABLE IF NOT EXISTS inventory_discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    discount_type VARCHAR(50) NOT NULL, -- 'clearance', 'near_expiration', 'overstocked', 'seasonal'
    discount_value DECIMAL(5, 2) NOT NULL, -- percentage
    reason TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- BOGO Promotions
CREATE TABLE IF NOT EXISTS bogo_promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    buy_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    get_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    buy_quantity INTEGER NOT NULL DEFAULT 1,
    get_quantity INTEGER NOT NULL DEFAULT 1,
    get_discount_percentage DECIMAL(5, 2) NOT NULL DEFAULT 100.00, -- 100% = free, 50% = half off
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bundle Deals
CREATE TABLE IF NOT EXISTS bundle_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    product_ids UUID[] NOT NULL, -- Array of product IDs
    bundle_price DECIMAL(10, 2) NOT NULL,
    savings_amount DECIMAL(10, 2),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & TRACKING TABLES
-- ============================================================================

-- Promotion Tracking (historical performance)
CREATE TABLE IF NOT EXISTS promotion_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_type VARCHAR(50) NOT NULL, -- 'bogo', 'bundle', 'inventory_discount', 'customer_discount'
    promotion_id UUID NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    original_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    discount_amount DECIMAL(10, 2),
    quantity INTEGER DEFAULT 1,
    transaction_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(100) NOT NULL, -- 'revenue', 'discount_usage', 'promotion_effectiveness'
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Realtime Events (for dashboard updates)
CREATE TABLE IF NOT EXISTS realtime_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'price_change', 'promotion_activated', 'inventory_alert'
    event_data JSONB NOT NULL,
    severity VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'critical'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Price History (audit trail)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2),
    change_reason VARCHAR(255),
    changed_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Price Alerts (notifications)
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'price_drop', 'back_in_stock', 'low_inventory'
    threshold_value DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_expiration ON products(expiration_date);

-- Customer discounts indexes
CREATE INDEX IF NOT EXISTS idx_customer_discounts_customer ON customer_discounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_status ON customer_discounts(status);
CREATE INDEX IF NOT EXISTS idx_customer_discounts_dates ON customer_discounts(start_date, end_date);

-- Inventory discounts indexes
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_product ON inventory_discounts(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_status ON inventory_discounts(status);
CREATE INDEX IF NOT EXISTS idx_inventory_discounts_dates ON inventory_discounts(start_date, end_date);

-- BOGO promotions indexes
CREATE INDEX IF NOT EXISTS idx_bogo_buy_product ON bogo_promotions(buy_product_id);
CREATE INDEX IF NOT EXISTS idx_bogo_get_product ON bogo_promotions(get_product_id);
CREATE INDEX IF NOT EXISTS idx_bogo_status ON bogo_promotions(status);
CREATE INDEX IF NOT EXISTS idx_bogo_dates ON bogo_promotions(start_date, end_date);

-- Bundle deals indexes
CREATE INDEX IF NOT EXISTS idx_bundle_status ON bundle_deals(status);
CREATE INDEX IF NOT EXISTS idx_bundle_dates ON bundle_deals(start_date, end_date);

-- Promotion tracking indexes
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_type ON promotion_tracking(promotion_type);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_customer ON promotion_tracking(customer_id);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_product ON promotion_tracking(product_id);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_date ON promotion_tracking(transaction_date);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_period ON performance_metrics(period_start, period_end);

-- Realtime events indexes
CREATE INDEX IF NOT EXISTS idx_realtime_events_type ON realtime_events(event_type);
CREATE INDEX IF NOT EXISTS idx_realtime_events_created ON realtime_events(created_at);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_created ON price_history(created_at);

-- Price alerts indexes
CREATE INDEX IF NOT EXISTS idx_price_alerts_product ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
