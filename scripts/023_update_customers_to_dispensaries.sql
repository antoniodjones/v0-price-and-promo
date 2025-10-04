-- Update existing customers to cannabis dispensaries with B2B data
DO $$
DECLARE
  customer_ids uuid[];
  current_id uuid;
  dispensary_names text[] := ARRAY[
    'Green Leaf Wellness',
    'High Times Dispensary',
    'Cannabis Care Collective',
    'The Healing Herb',
    'Elevated Remedies'
  ];
  registration_numbers text[] := ARRAY[
    'CA-DISP-2024-001',
    'CA-DISP-2024-002',
    'CA-DISP-2024-003',
    'CA-DISP-2024-004',
    'CA-DISP-2024-005'
  ];
  tax_ids text[] := ARRAY[
    '94-1234567',
    '94-2345678',
    '94-3456789',
    '94-4567890',
    '94-5678901'
  ];
  billing_addresses jsonb[] := ARRAY[
    '{"street": "123 Main St", "city": "Los Angeles", "state": "CA", "zip": "90001", "country": "USA"}'::jsonb,
    '{"street": "456 Market Ave", "city": "San Francisco", "state": "CA", "zip": "94102", "country": "USA"}'::jsonb,
    '{"street": "789 Ocean Blvd", "city": "San Diego", "state": "CA", "zip": "92101", "country": "USA"}'::jsonb,
    '{"street": "321 Grove St", "city": "Oakland", "state": "CA", "zip": "94612", "country": "USA"}'::jsonb,
    '{"street": "654 Palm Dr", "city": "Sacramento", "state": "CA", "zip": "95814", "country": "USA"}'::jsonb
  ];
  contact_names text[] := ARRAY[
    'Sarah Martinez',
    'Michael Chen',
    'Jennifer Williams',
    'David Thompson',
    'Lisa Anderson'
  ];
  contact_emails text[] := ARRAY[
    'sarah@greenleafwellness.com',
    'michael@hightimesdispensary.com',
    'jennifer@cannabiscare.com',
    'david@healingherb.com',
    'lisa@elevatedremedies.com'
  ];
  contact_phones text[] := ARRAY[
    '+1-555-0201',
    '+1-555-0202',
    '+1-555-0203',
    '+1-555-0204',
    '+1-555-0205'
  ];
  i int := 1;
BEGIN
  -- Get existing customer IDs
  SELECT ARRAY_AGG(id ORDER BY created_at) INTO customer_ids FROM customers LIMIT 5;
  
  -- Fixed FOREACH loop to iterate over individual IDs, not array type
  FOREACH current_id IN ARRAY customer_ids
  LOOP
    UPDATE customers
    SET
      business_legal_name = dispensary_names[i],
      business_registration_number = registration_numbers[i],
      tax_id = tax_ids[i],
      billing_address = billing_addresses[i],
      shipping_address = billing_addresses[i], -- Same as billing for simplicity
      payment_terms = 'Net 30',
      credit_limit = 50000.00 + (i * 10000), -- Varying credit limits
      industry = 'Cannabis Retail',
      website = 'https://www.' || LOWER(REPLACE(dispensary_names[i], ' ', '')) || '.com',
      primary_contact_name = contact_names[i],
      primary_contact_email = contact_emails[i],
      primary_contact_phone = contact_phones[i],
      updated_at = NOW()
    WHERE id = current_id;
    
    i := i + 1;
    EXIT WHEN i > 5;
  END LOOP;
  
  RAISE NOTICE 'Successfully updated % customers to cannabis dispensaries', i - 1;
END $$;
