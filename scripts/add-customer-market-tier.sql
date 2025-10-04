-- Add Market and Tier Columns to Customers Table
-- These columns are essential for GTI's multi-market pricing and tiered customer management

-- Add market column (geographic market/state)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS market TEXT;

-- Add tier column (customer tier for pricing)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS tier TEXT;

-- Add comments for documentation
COMMENT ON COLUMN customers.market IS 'Geographic market/state where customer operates (Illinois, Florida, Nevada, etc.)';
COMMENT ON COLUMN customers.tier IS 'Customer tier for pricing and discounts (Premium, Standard, Basic)';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_market ON customers(market);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);

-- Update existing customers to have default values if any exist
UPDATE customers 
SET market = license_state 
WHERE market IS NULL AND license_state IS NOT NULL;

UPDATE customers 
SET tier = 'Standard' 
WHERE tier IS NULL;
