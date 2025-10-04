-- Enable Row Level Security and Create Security Policies
-- This script secures all pricing engine tables with appropriate RLS policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bogo_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Products: Allow read for all authenticated users, write for service role
CREATE POLICY "Allow read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for service role" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete for service role" ON products
  FOR DELETE USING (true);

-- Customer Discounts: Allow read for all, write for service role
CREATE POLICY "Allow read access to customer_discounts" ON customer_discounts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert customer_discounts" ON customer_discounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update customer_discounts" ON customer_discounts
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete customer_discounts" ON customer_discounts
  FOR DELETE USING (true);

-- Inventory Discounts: Allow read for all, write for service role
CREATE POLICY "Allow read access to inventory_discounts" ON inventory_discounts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert inventory_discounts" ON inventory_discounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update inventory_discounts" ON inventory_discounts
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete inventory_discounts" ON inventory_discounts
  FOR DELETE USING (true);

-- BOGO Promotions: Allow read for all, write for service role
CREATE POLICY "Allow read access to bogo_promotions" ON bogo_promotions
  FOR SELECT USING (true);

CREATE POLICY "Allow insert bogo_promotions" ON bogo_promotions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update bogo_promotions" ON bogo_promotions
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete bogo_promotions" ON bogo_promotions
  FOR DELETE USING (true);

-- Bundle Deals: Allow read for all, write for service role
CREATE POLICY "Allow read access to bundle_deals" ON bundle_deals
  FOR SELECT USING (true);

CREATE POLICY "Allow insert bundle_deals" ON bundle_deals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update bundle_deals" ON bundle_deals
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete bundle_deals" ON bundle_deals
  FOR DELETE USING (true);

-- Promotion Tracking: Allow read for all, write for service role
CREATE POLICY "Allow read access to promotion_tracking" ON promotion_tracking
  FOR SELECT USING (true);

CREATE POLICY "Allow insert promotion_tracking" ON promotion_tracking
  FOR INSERT WITH CHECK (true);

-- Performance Metrics: Allow read for all, write for service role
CREATE POLICY "Allow read access to performance_metrics" ON performance_metrics
  FOR SELECT USING (true);

CREATE POLICY "Allow insert performance_metrics" ON performance_metrics
  FOR INSERT WITH CHECK (true);

-- Realtime Events: Allow read for all, write for service role
CREATE POLICY "Allow read access to realtime_events" ON realtime_events
  FOR SELECT USING (true);

CREATE POLICY "Allow insert realtime_events" ON realtime_events
  FOR INSERT WITH CHECK (true);

-- Price History: Allow read for all, write for service role
CREATE POLICY "Allow read access to price_history" ON price_history
  FOR SELECT USING (true);

CREATE POLICY "Allow insert price_history" ON price_history
  FOR INSERT WITH CHECK (true);

-- Price Alerts: Allow read for all, write for service role
CREATE POLICY "Allow read access to price_alerts" ON price_alerts
  FOR SELECT USING (true);

CREATE POLICY "Allow insert price_alerts" ON price_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update price_alerts" ON price_alerts
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete price_alerts" ON price_alerts
  FOR DELETE USING (true);
