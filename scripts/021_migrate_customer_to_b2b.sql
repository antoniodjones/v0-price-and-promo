-- Migration: Convert customer table from consumer to B2B model
-- This script:
-- 1. Renames 'name' column to 'business_legal_name' (preserving existing data)
-- 2. Drops 'email' and 'phone' columns (consumer-focused fields)
-- 3. Updates indexes accordingly

-- Rename name column to business_legal_name
ALTER TABLE customers 
RENAME COLUMN name TO business_legal_name;

-- Drop consumer-focused columns
ALTER TABLE customers 
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Drop old indexes
DROP INDEX IF EXISTS idx_customers_name;
DROP INDEX IF EXISTS idx_customers_email;

-- Create new index for business_legal_name
CREATE INDEX IF NOT EXISTS idx_customers_business_legal_name ON customers(business_legal_name);

-- Update column comment
COMMENT ON COLUMN customers.business_legal_name IS 'Legal business name (migrated from name column)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully migrated customers table to B2B model';
  RAISE NOTICE '- Renamed name → business_legal_name';
  RAISE NOTICE '- Removed email and phone columns';
  RAISE NOTICE '- Updated indexes';
END $$;
