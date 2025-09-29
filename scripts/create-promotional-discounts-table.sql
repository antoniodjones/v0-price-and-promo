-- Create promotional_discounts table for Ref#1 requirements
CREATE TABLE IF NOT EXISTS promotional_discounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  level VARCHAR(20) NOT NULL CHECK (level IN ('item', 'brand', 'category', 'subcategory', 'size', 'batch')),
  target VARCHAR(255) NOT NULL,
  target_name VARCHAR(255) NOT NULL,
  batch_ids TEXT[], -- Array of batch IDs for batch-level targeting
  specific_price DECIMAL(10,2) CHECK (specific_price >= 0), -- For specific price override
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
  is_liquidation BOOLEAN DEFAULT FALSE, -- Flag for liquidation promotions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date > start_date),
  CONSTRAINT valid_percentage CHECK (type != 'percentage' OR value <= 100),
  CONSTRAINT batch_ids_required CHECK (level != 'batch' OR batch_ids IS NOT NULL)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_promotional_discounts_status ON promotional_discounts(status);
CREATE INDEX IF NOT EXISTS idx_promotional_discounts_level ON promotional_discounts(level);
CREATE INDEX IF NOT EXISTS idx_promotional_discounts_dates ON promotional_discounts(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_promotional_discounts_batch_ids ON promotional_discounts USING GIN(batch_ids);
CREATE INDEX IF NOT EXISTS idx_promotional_discounts_is_liquidation ON promotional_discounts(is_liquidation);

-- Add RLS (Row Level Security) policies
ALTER TABLE promotional_discounts ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON promotional_discounts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample promotional discounts for testing
INSERT INTO promotional_discounts (
  name, type, value, level, target, target_name, start_date, end_date, is_liquidation
) VALUES 
  ('Spring Flower Sale', 'percentage', 20, 'category', 'Flower', 'Flower', NOW(), NOW() + INTERVAL '7 days', FALSE),
  ('Stiiizy Brand Promotion', 'percentage', 15, 'brand', 'Stiiizy', 'Stiiizy', NOW(), NOW() + INTERVAL '14 days', FALSE),
  ('Gummies Flash Sale', 'fixed', 5, 'subcategory', 'Gummies', 'Gummies', NOW(), NOW() + INTERVAL '3 days', FALSE);

-- Insert sample batch-level liquidation promotions
INSERT INTO promotional_discounts (
  name, type, value, level, target, target_name, batch_ids, start_date, end_date, is_liquidation
) VALUES 
  ('Batch BH-2025-0892 Liquidation', 'percentage', 50, 'batch', 'batch', 'BH-2025-0892', ARRAY['BH-2025-0892'], NOW(), NOW() + INTERVAL '5 days', TRUE),
  ('Multi-Batch Clearance', 'percentage', 40, 'batch', 'batch', 'BH-2025-0891, BH-2025-0893', ARRAY['BH-2025-0891', 'BH-2025-0893'], NOW(), NOW() + INTERVAL '10 days', TRUE);

COMMENT ON TABLE promotional_discounts IS 'Promotional discounts table implementing Ref#1 requirements with batch-level targeting for liquidation sales';
