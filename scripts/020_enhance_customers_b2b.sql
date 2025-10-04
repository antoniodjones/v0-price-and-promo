-- Enhance customers table with B2B business fields
-- This migration adds critical business-to-business fields for wholesale cannabis operations

-- Add B2B business fields to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS business_legal_name TEXT,
ADD COLUMN IF NOT EXISTS dba_name TEXT, -- "Doing Business As" name
ADD COLUMN IF NOT EXISTS business_type TEXT CHECK (business_type IN ('LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Non-Profit')),
ADD COLUMN IF NOT EXISTS tax_id TEXT, -- EIN/Tax ID
ADD COLUMN IF NOT EXISTS cannabis_license_number TEXT, -- State cannabis license
ADD COLUMN IF NOT EXISTS license_expiration_date DATE,
ADD COLUMN IF NOT EXISTS license_state TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT UNIQUE, -- Internal account number
ADD COLUMN IF NOT EXISTS credit_limit DECIMAL(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'Net 30', -- Net 30, Net 60, COD, etc.
ADD COLUMN IF NOT EXISTS customer_type TEXT DEFAULT 'external' CHECK (customer_type IN ('internal', 'external')), -- Internal vs external dispensaries
ADD COLUMN IF NOT EXISTS billing_address TEXT,
ADD COLUMN IF NOT EXISTS billing_city TEXT,
ADD COLUMN IF NOT EXISTS billing_state TEXT,
ADD COLUMN IF NOT EXISTS billing_zip_code TEXT,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_zip_code TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_name TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS primary_contact_email TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes for B2B fields
CREATE INDEX IF NOT EXISTS idx_customers_account_number ON customers(account_number);
CREATE INDEX IF NOT EXISTS idx_customers_tax_id ON customers(tax_id);
CREATE INDEX IF NOT EXISTS idx_customers_license_number ON customers(cannabis_license_number);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_business_type ON customers(business_type);

-- Add comments for documentation
COMMENT ON COLUMN customers.business_legal_name IS 'Legal business name as registered with state';
COMMENT ON COLUMN customers.dba_name IS 'Doing Business As name (trade name)';
COMMENT ON COLUMN customers.cannabis_license_number IS 'State-issued cannabis business license number';
COMMENT ON COLUMN customers.customer_type IS 'Internal (Green Thumb owned) or External dispensary';
COMMENT ON COLUMN customers.account_number IS 'Internal account number for billing and tracking';
COMMENT ON COLUMN customers.payment_terms IS 'Payment terms (Net 30, Net 60, COD, etc.)';
