-- Create product_tracking_settings table for price tracking configuration
CREATE TABLE IF NOT EXISTS product_tracking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_enabled BOOLEAN DEFAULT true,
  alert_threshold NUMERIC DEFAULT 10,
  alert_type VARCHAR(20) DEFAULT 'percentage' CHECK (alert_type IN ('percentage', 'amount')),
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_tracking_settings_product_id ON product_tracking_settings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tracking_settings_alert_enabled ON product_tracking_settings(alert_enabled);

-- Add some sample tracking settings for existing products
INSERT INTO product_tracking_settings (product_id, alert_enabled, alert_threshold, alert_type, email_notifications)
SELECT 
  id,
  true,
  10,
  'percentage',
  true
FROM products
LIMIT 5
ON CONFLICT (product_id) DO NOTHING;
