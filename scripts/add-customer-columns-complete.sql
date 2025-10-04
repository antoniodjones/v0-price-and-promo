-- Add Missing Columns to Customers Table
-- Adds market, tier, and status columns for complete customer management

-- Add market column (geographic market/state)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS market TEXT;

-- Add tier column (customer tier for pricing)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS tier TEXT;

-- Add status column (account status tracking)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_market ON customers(market);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Add comments for documentation
COMMENT ON COLUMN customers.market IS 'Geographic market/state where customer operates';
COMMENT ON COLUMN customers.tier IS 'Customer tier for pricing and discount strategies (Premium, Standard, etc.)';
COMMENT ON COLUMN customers.status IS 'Account status (active, inactive, suspended, pending)';
