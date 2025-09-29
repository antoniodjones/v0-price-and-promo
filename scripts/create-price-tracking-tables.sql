-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_id UUID REFERENCES price_sources(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('price_increase', 'price_decrease', 'threshold', 'competitor')),
  threshold_value DECIMAL(10,2),
  threshold_type VARCHAR(20) CHECK (threshold_type IN ('percentage', 'amount')),
  current_price DECIMAL(10,2) NOT NULL,
  previous_price DECIMAL(10,2) NOT NULL,
  change_amount DECIMAL(10,2) NOT NULL,
  change_percentage DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  source_id UUID REFERENCES price_sources(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  change_from_previous DECIMAL(10,2),
  change_percentage DECIMAL(5,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_tracking_settings table
CREATE TABLE IF NOT EXISTS product_tracking_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  alert_enabled BOOLEAN DEFAULT false,
  alert_threshold DECIMAL(5,2) DEFAULT 10.0,
  alert_type VARCHAR(20) DEFAULT 'percentage' CHECK (alert_type IN ('percentage', 'amount')),
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
CREATE INDEX IF NOT EXISTS idx_price_alerts_triggered_at ON price_alerts(triggered_at);

CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_source_id ON price_history(source_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON price_history(recorded_at);

CREATE INDEX IF NOT EXISTS idx_product_tracking_product_id ON product_tracking_settings(product_id);

-- Enable Row Level Security
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tracking_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for price_alerts
CREATE POLICY "Users can view all price alerts" ON price_alerts
  FOR SELECT USING (true);

CREATE POLICY "Users can create price alerts" ON price_alerts
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update price alerts" ON price_alerts
  FOR UPDATE USING (true);

-- Create RLS policies for price_history
CREATE POLICY "Users can view all price history" ON price_history
  FOR SELECT USING (true);

CREATE POLICY "System can insert price history" ON price_history
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for product_tracking_settings
CREATE POLICY "Users can view all tracking settings" ON product_tracking_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage tracking settings" ON product_tracking_settings
  FOR ALL USING (true);

-- Create function to automatically create tracking settings for new products
CREATE OR REPLACE FUNCTION create_default_tracking_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO product_tracking_settings (product_id)
  VALUES (NEW.id)
  ON CONFLICT (product_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create tracking settings
CREATE TRIGGER trigger_create_tracking_settings
  AFTER INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION create_default_tracking_settings();

-- Create function to calculate price changes and trigger alerts
CREATE OR REPLACE FUNCTION process_price_update()
RETURNS TRIGGER AS $$
DECLARE
  prev_price DECIMAL(10,2);
  price_change DECIMAL(10,2);
  change_percentage DECIMAL(5,2);
  tracking_settings RECORD;
BEGIN
  -- Get previous price
  SELECT price INTO prev_price
  FROM price_history
  WHERE product_id = NEW.product_id AND source_id = NEW.source_id
  ORDER BY recorded_at DESC
  LIMIT 1;

  -- Calculate changes if previous price exists
  IF prev_price IS NOT NULL THEN
    price_change := NEW.price - prev_price;
    change_percentage := (price_change / prev_price) * 100;
    
    -- Update the new record with change information
    NEW.change_from_previous := price_change;
    NEW.change_percentage := change_percentage;
    
    -- Get tracking settings for this product
    SELECT * INTO tracking_settings
    FROM product_tracking_settings
    WHERE product_id = NEW.product_id AND alert_enabled = true;
    
    -- Check if alert should be triggered
    IF tracking_settings IS NOT NULL THEN
      IF (tracking_settings.alert_type = 'percentage' AND ABS(change_percentage) >= tracking_settings.alert_threshold) OR
         (tracking_settings.alert_type = 'amount' AND ABS(price_change) >= tracking_settings.alert_threshold) THEN
        
        -- Create alert
        INSERT INTO price_alerts (
          product_id,
          source_id,
          alert_type,
          threshold_value,
          threshold_type,
          current_price,
          previous_price,
          change_amount,
          change_percentage
        ) VALUES (
          NEW.product_id,
          NEW.source_id,
          CASE WHEN price_change > 0 THEN 'price_increase' ELSE 'price_decrease' END,
          tracking_settings.alert_threshold,
          tracking_settings.alert_type,
          NEW.price,
          prev_price,
          price_change,
          change_percentage
        );
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for price change processing
CREATE TRIGGER trigger_process_price_update
  BEFORE INSERT ON price_history
  FOR EACH ROW
  EXECUTE FUNCTION process_price_update();
