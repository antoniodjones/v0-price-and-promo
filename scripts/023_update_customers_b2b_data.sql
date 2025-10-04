-- Update existing customer records with B2B business information
-- Adds realistic business data to existing dispensary customers

-- Update Tier 1 (Premium) customers with B2B details
UPDATE customers 
SET 
    business_legal_name = name || ' LLC',
    dba_name = name,
    business_type = 'LLC',
    tax_id = '12-' || LPAD((random() * 9999999)::int::text, 7, '0'),
    cannabis_license_number = 'CL-' || UPPER(SUBSTRING(state FROM 1 FOR 2)) || '-' || LPAD((random() * 999999)::int::text, 6, '0'),
    license_expiration_date = CURRENT_DATE + INTERVAL '2 years',
    license_state = state,
    account_number = 'ACC-' || LPAD(CAST(id AS TEXT), 8, '0'),
    credit_limit = 50000.00,
    payment_terms = 'Net 30',
    customer_type = 'external',
    billing_address = address,
    billing_city = city,
    billing_state = state,
    billing_zip_code = zip_code,
    shipping_address = address,
    shipping_city = city,
    shipping_state = state,
    shipping_zip_code = zip_code,
    primary_contact_name = 'Purchasing Manager',
    primary_contact_phone = phone,
    primary_contact_email = email
WHERE tier = 'Tier 1' AND business_legal_name IS NULL;

-- Update Tier 2 (Standard) customers with B2B details
UPDATE customers 
SET 
    business_legal_name = name || ' Inc',
    dba_name = name,
    business_type = 'Corporation',
    tax_id = '12-' || LPAD((random() * 9999999)::int::text, 7, '0'),
    cannabis_license_number = 'CL-' || UPPER(SUBSTRING(state FROM 1 FOR 2)) || '-' || LPAD((random() * 999999)::int::text, 6, '0'),
    license_expiration_date = CURRENT_DATE + INTERVAL '1 year',
    license_state = state,
    account_number = 'ACC-' || LPAD(CAST(id AS TEXT), 8, '0'),
    credit_limit = 25000.00,
    payment_terms = 'Net 30',
    customer_type = 'external',
    billing_address = address,
    billing_city = city,
    billing_state = state,
    billing_zip_code = zip_code,
    shipping_address = address,
    shipping_city = city,
    shipping_state = state,
    shipping_zip_code = zip_code,
    primary_contact_name = 'Store Manager',
    primary_contact_phone = phone,
    primary_contact_email = email
WHERE tier = 'Tier 2' AND business_legal_name IS NULL;

-- Update Tier 3 (Basic) customers with B2B details
UPDATE customers 
SET 
    business_legal_name = name,
    dba_name = name,
    business_type = 'Sole Proprietorship',
    tax_id = '12-' || LPAD((random() * 9999999)::int::text, 7, '0'),
    cannabis_license_number = 'CL-' || UPPER(SUBSTRING(state FROM 1 FOR 2)) || '-' || LPAD((random() * 999999)::int::text, 6, '0'),
    license_expiration_date = CURRENT_DATE + INTERVAL '1 year',
    license_state = state,
    account_number = 'ACC-' || LPAD(CAST(id AS TEXT), 8, '0'),
    credit_limit = 10000.00,
    payment_terms = 'Net 15',
    customer_type = 'external',
    billing_address = address,
    billing_city = city,
    billing_state = state,
    billing_zip_code = zip_code,
    shipping_address = address,
    shipping_city = city,
    shipping_state = state,
    shipping_zip_code = zip_code,
    primary_contact_name = 'Owner',
    primary_contact_phone = phone,
    primary_contact_email = email
WHERE tier = 'Tier 3' AND business_legal_name IS NULL;

-- Add a couple of internal dispensaries (Green Thumb owned)
UPDATE customers 
SET customer_type = 'internal',
    payment_terms = 'Internal Transfer',
    notes = 'Green Thumb Industries owned dispensary'
WHERE name IN ('Green Leaf Dispensary', 'Premium Cannabis Co')
AND customer_type = 'external';
