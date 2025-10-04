-- Migration: Convert customers table from B2C to B2B model (Fixed)
-- This script handles the case where business_legal_name already exists

BEGIN;

-- Drop the existing business_legal_name column (if it exists)
ALTER TABLE customers DROP COLUMN IF EXISTS business_legal_name;

-- Rename name column to business_legal_name (preserves existing data)
ALTER TABLE customers RENAME COLUMN name TO business_legal_name;

-- Drop email and phone columns permanently
ALTER TABLE customers DROP COLUMN IF EXISTS email;
ALTER TABLE customers DROP COLUMN IF EXISTS phone;

-- Add new B2B-specific columns
ALTER TABLE customers ADD COLUMN IF NOT EXISTS business_registration_number TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billing_address JSONB;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'NET30';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(10,2);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS primary_contact_name TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS primary_contact_email TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT;

-- Create index for business_legal_name for faster searches
CREATE INDEX IF NOT EXISTS idx_customers_business_legal_name ON customers(business_legal_name);

-- Update column comment
COMMENT ON COLUMN customers.business_legal_name IS 'Legal business name (migrated from name column)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Successfully migrated customers table to B2B model';
  RAISE NOTICE '- Dropped old business_legal_name column';
  RAISE NOTICE '- Renamed name → business_legal_name';
  RAISE NOTICE '- Removed email and phone columns';
  RAISE NOTICE '- Updated indexes';
END $$;

END;
