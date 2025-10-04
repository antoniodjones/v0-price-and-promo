-- Seed Customers for GTI Cannabis Dispensary (Version 4 - Correct Schema)
-- 50 dispensaries across Green Thumb Industries markets

-- Clear existing customers
TRUNCATE TABLE customers CASCADE;

-- Illinois Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Joliet LLC', 'RISE Joliet', 'GTI-IL-001', 'IL-DIS-2025-001', 'IL', 'external', 'LLC', 'Cannabis Retail', '1801 W Jefferson St', 'Joliet', 'IL', '60435', '1801 W Jefferson St', 'Joliet', 'IL', '60435', 'Michael Chen', 'michael.chen@risecannabis.com', '815-555-0101', 'Net 30', 150000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Naperville LLC', 'RISE Naperville', 'GTI-IL-002', 'IL-DIS-2025-002', 'IL', 'external', 'LLC', 'Cannabis Retail', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', 'Sarah Johnson', 'sarah.johnson@risecannabis.com', '630-555-0102', 'Net 30', 120000.00, 198000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Mundelein LLC', 'RISE Mundelein', 'GTI-IL-003', 'IL-DIS-2025-003', 'IL', 'external', 'LLC', 'Cannabis Retail', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', 'David Martinez', 'david.martinez@risecannabis.com', '847-555-0103', 'Net 30', 100000.00, 167000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Canton LLC', 'RISE Canton', 'GTI-IL-004', 'IL-DIS-2025-004', 'IL', 'external', 'LLC', 'Cannabis Retail', '2260 N Main St', 'Canton', 'IL', '61520', '2260 N Main St', 'Canton', 'IL', '61520', 'Jennifer Lee', 'jennifer.lee@risecannabis.com', '309-555-0104', 'Net 30', 90000.00, 134000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Effingham LLC', 'RISE Effingham', 'GTI-IL-005', 'IL-DIS-2025-005', 'IL', 'external', 'LLC', 'Cannabis Retail', '1101 S Keller Dr', 'Effingham', 'IL', '62401', '1101 S Keller Dr', 'Effingham', 'IL', '62401', 'Robert Wilson', 'robert.wilson@risecannabis.com', '217-555-0105', 'Net 30', 85000.00, 112000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Bloomington LLC', 'RISE Bloomington', 'GTI-IL-006', 'IL-DIS-2025-006', 'IL', 'external', 'LLC', 'Cannabis Retail', '1503 N Veterans Pkwy', 'Bloomington', 'IL', '61704', '1503 N Veterans Pkwy', 'Bloomington', 'IL', '61704', 'Amanda Garcia', 'amanda.garcia@risecannabis.com', '309-555-0106', 'Net 30', 95000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Quincy LLC', 'RISE Quincy', 'GTI-IL-007', 'IL-DIS-2025-007', 'IL', 'external', 'LLC', 'Cannabis Retail', '3701 Broadway St', 'Quincy', 'IL', '62301', '3701 Broadway St', 'Quincy', 'IL', '62301', 'Thomas Anderson', 'thomas.anderson@risecannabis.com', '217-555-0107', 'Net 30', 80000.00, 98000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Champaign LLC', 'RISE Champaign', 'GTI-IL-008', 'IL-DIS-2025-008', 'IL', 'external', 'LLC', 'Cannabis Retail', '1914 W Springfield Ave', 'Champaign', 'IL', '61821', '1914 W Springfield Ave', 'Champaign', 'IL', '61821', 'Lisa Thompson', 'lisa.thompson@risecannabis.com', '217-555-0108', 'Net 30', 110000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Peoria LLC', 'RISE Peoria', 'GTI-IL-009', 'IL-DIS-2025-009', 'IL', 'external', 'LLC', 'Cannabis Retail', '4920 N University St', 'Peoria', 'IL', '61614', '4920 N University St', 'Peoria', 'IL', '61614', 'Kevin Brown', 'kevin.brown@risecannabis.com', '309-555-0109', 'Net 30', 105000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Lake in the Hills LLC', 'RISE Lake in the Hills', 'GTI-IL-010', 'IL-DIS-2025-010', 'IL', 'external', 'LLC', 'Cannabis Retail', '4900 Randall Rd', 'Lake in the Hills', 'IL', '60156', '4900 Randall Rd', 'Lake in the Hills', 'IL', '60156', 'Michelle Davis', 'michelle.davis@risecannabis.com', '847-555-0110', 'Net 30', 115000.00, 201000.00, 'active', '2026-12-31', NOW(), NOW());

-- Florida Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Bonita Springs LLC', 'RISE Bonita Springs', 'GTI-FL-001', 'FL-MMTC-2025-001', 'FL', 'external', 'LLC', 'Cannabis Retail', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', 'Carlos Rodriguez', 'carlos.rodriguez@risecannabis.com', '239-555-0201', 'Net 30', 140000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Deerfield Beach LLC', 'RISE Deerfield Beach', 'GTI-FL-002', 'FL-MMTC-2025-002', 'FL', 'external', 'LLC', 'Cannabis Retail', '1836 SE 3rd Ct', 'Deerfield Beach', 'FL', '33441', '1836 SE 3rd Ct', 'Deerfield Beach', 'FL', '33441', 'Maria Gonzalez', 'maria.gonzalez@risecannabis.com', '954-555-0202', 'Net 30', 135000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Hallandale Beach LLC', 'RISE Hallandale Beach', 'GTI-FL-003', 'FL-MMTC-2025-003', 'FL', 'external', 'LLC', 'Cannabis Retail', '2300 E Hallandale Beach Blvd', 'Hallandale Beach', 'FL', '33009', '2300 E Hallandale Beach Blvd', 'Hallandale Beach', 'FL', '33009', 'James Miller', 'james.miller@risecannabis.com', '954-555-0203', 'Net 30', 125000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Oviedo LLC', 'RISE Oviedo', 'GTI-FL-004', 'FL-MMTC-2025-004', 'FL', 'external', 'LLC', 'Cannabis Retail', '7780 Red Bug Lake Rd', 'Oviedo', 'FL', '32765', '7780 Red Bug Lake Rd', 'Oviedo', 'FL', '32765', 'Patricia White', 'patricia.white@risecannabis.com', '407-555-0204', 'Net 30', 130000.00, 256000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Pinellas Park LLC', 'RISE Pinellas Park', 'GTI-FL-005', 'FL-MMTC-2025-005', 'FL', 'external', 'LLC', 'Cannabis Retail', '7901 Park Blvd', 'Pinellas Park', 'FL', '33781', '7901 Park Blvd', 'Pinellas Park', 'FL', '33781', 'Christopher Harris', 'christopher.harris@risecannabis.com', '727-555-0205', 'Net 30', 145000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary West Palm Beach LLC', 'RISE West Palm Beach', 'GTI-FL-006', 'FL-MMTC-2025-006', 'FL', 'external', 'LLC', 'Cannabis Retail', '6940 Okeechobee Blvd', 'West Palm Beach', 'FL', '33411', '6940 Okeechobee Blvd', 'West Palm Beach', 'FL', '33411', 'Elizabeth Clark', 'elizabeth.clark@risecannabis.com', '561-555-0206', 'Net 30', 150000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Kendall LLC', 'RISE Kendall', 'GTI-FL-007', 'FL-MMTC-2025-007', 'FL', 'external', 'LLC', 'Cannabis Retail', '13750 SW 88th St', 'Miami', 'FL', '33186', '13750 SW 88th St', 'Miami', 'FL', '33186', 'Daniel Lewis', 'daniel.lewis@risecannabis.com', '305-555-0207', 'Net 30', 155000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Lakeland LLC', 'RISE Lakeland', 'GTI-FL-008', 'FL-MMTC-2025-008', 'FL', 'external', 'LLC', 'Cannabis Retail', '3750 US Highway 98 N', 'Lakeland', 'FL', '33809', '3750 US Highway 98 N', 'Lakeland', 'FL', '33809', 'Nancy Walker', 'nancy.walker@risecannabis.com', '863-555-0208', 'Net 30', 120000.00, 223000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Brandon LLC', 'RISE Brandon', 'GTI-FL-009', 'FL-MMTC-2025-009', 'FL', 'external', 'LLC', 'Cannabis Retail', '1950 W Brandon Blvd', 'Brandon', 'FL', '33511', '1950 W Brandon Blvd', 'Brandon', 'FL', '33511', 'Steven Young', 'steven.young@risecannabis.com', '813-555-0209', 'Net 30', 128000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Jacksonville LLC', 'RISE Jacksonville', 'GTI-FL-010', 'FL-MMTC-2025-010', 'FL', 'external', 'LLC', 'Cannabis Retail', '10261 Atlantic Blvd', 'Jacksonville', 'FL', '32225', '10261 Atlantic Blvd', 'Jacksonville', 'FL', '32225', 'Karen Allen', 'karen.allen@risecannabis.com', '904-555-0210', 'Net 30', 132000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW());

-- Nevada Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Las Vegas LLC', 'RISE Las Vegas', 'GTI-NV-001', 'NV-RET-2025-001', 'NV', 'external', 'LLC', 'Cannabis Retail', '6380 W Flamingo Rd', 'Las Vegas', 'NV', '89103', '6380 W Flamingo Rd', 'Las Vegas', 'NV', '89103', 'Richard King', 'richard.king@risecannabis.com', '702-555-0301', 'Net 30', 180000.00, 456000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Henderson LLC', 'RISE Henderson', 'GTI-NV-002', 'NV-RET-2025-002', 'NV', 'external', 'LLC', 'Cannabis Retail', '2300 E Sunset Rd', 'Henderson', 'NV', '89014', '2300 E Sunset Rd', 'Henderson', 'NV', '89014', 'Barbara Wright', 'barbara.wright@risecannabis.com', '702-555-0302', 'Net 30', 165000.00, 389000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Reno LLC', 'RISE Reno', 'GTI-NV-003', 'NV-RET-2025-003', 'NV', 'external', 'LLC', 'Cannabis Retail', '1370 E Plumb Ln', 'Reno', 'NV', '89502', '1370 E Plumb Ln', 'Reno', 'NV', '89502', 'William Scott', 'william.scott@risecannabis.com', '775-555-0303', 'Net 30', 155000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary North Las Vegas LLC', 'RISE North Las Vegas', 'GTI-NV-004', 'NV-RET-2025-004', 'NV', 'external', 'LLC', 'Cannabis Retail', '2234 Las Vegas Blvd N', 'North Las Vegas', 'NV', '89030', '2234 Las Vegas Blvd N', 'North Las Vegas', 'NV', '89030', 'Susan Green', 'susan.green@risecannabis.com', '702-555-0304', 'Net 30', 170000.00, 412000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Sparks LLC', 'RISE Sparks', 'GTI-NV-005', 'NV-RET-2025-005', 'NV', 'external', 'LLC', 'Cannabis Retail', '1950 E Lincoln Way', 'Sparks', 'NV', '89434', '1950 E Lincoln Way', 'Sparks', 'NV', '89434', 'Joseph Baker', 'joseph.baker@risecannabis.com', '775-555-0305', 'Net 30', 148000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Paradise LLC', 'RISE Paradise', 'GTI-NV-006', 'NV-RET-2025-006', 'NV', 'external', 'LLC', 'Cannabis Retail', '4750 S Maryland Pkwy', 'Las Vegas', 'NV', '89119', '4750 S Maryland Pkwy', 'Las Vegas', 'NV', '89119', 'Jessica Adams', 'jessica.adams@risecannabis.com', '702-555-0306', 'Net 30', 175000.00, 445000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Spring Valley LLC', 'RISE Spring Valley', 'GTI-NV-007', 'NV-RET-2025-007', 'NV', 'external', 'LLC', 'Cannabis Retail', '5940 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', '5940 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', 'Matthew Nelson', 'matthew.nelson@risecannabis.com', '702-555-0307', 'Net 30', 162000.00, 378000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Summerlin LLC', 'RISE Summerlin', 'GTI-NV-008', 'NV-RET-2025-008', 'NV', 'external', 'LLC', 'Cannabis Retail', '10100 W Charleston Blvd', 'Las Vegas', 'NV', '89135', '10100 W Charleston Blvd', 'Las Vegas', 'NV', '89135', 'Ashley Carter', 'ashley.carter@risecannabis.com', '702-555-0308', 'Net 30', 185000.00, 478000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Enterprise LLC', 'RISE Enterprise', 'GTI-NV-009', 'NV-RET-2025-009', 'NV', 'external', 'LLC', 'Cannabis Retail', '7885 W Sunset Rd', 'Las Vegas', 'NV', '89113', '7885 W Sunset Rd', 'Las Vegas', 'NV', '89113', 'Andrew Mitchell', 'andrew.mitchell@risecannabis.com', '702-555-0309', 'Net 30', 172000.00, 423000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Carson City LLC', 'RISE Carson City', 'GTI-NV-010', 'NV-RET-2025-010', 'NV', 'external', 'LLC', 'Cannabis Retail', '2815 S Carson St', 'Carson City', 'NV', '89701', '2815 S Carson St', 'Carson City', 'NV', '89701', 'Melissa Perez', 'melissa.perez@risecannabis.com', '775-555-0310', 'Net 30', 142000.00, 276000.00, 'active', '2026-12-31', NOW(), NOW());

-- Pennsylvania Dispensaries (8)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Mechanicsburg LLC', 'RISE Mechanicsburg', 'GTI-PA-001', 'PA-MMO-2025-001', 'PA', 'external', 'LLC', 'Cannabis Retail', '6300 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', '6300 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', 'Brian Roberts', 'brian.roberts@risecannabis.com', '717-555-0401', 'Net 30', 125000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Steelton LLC', 'RISE Steelton', 'GTI-PA-002', 'PA-MMO-2025-002', 'PA', 'external', 'LLC', 'Cannabis Retail', '301 N Front St', 'Steelton', 'PA', '17113', '301 N Front St', 'Steelton', 'PA', '17113', 'Nicole Turner', 'nicole.turner@risecannabis.com', '717-555-0402', 'Net 30', 118000.00, 212000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Dunmore LLC', 'RISE Dunmore', 'GTI-PA-003', 'PA-MMO-2025-003', 'PA', 'external', 'LLC', 'Cannabis Retail', '1900 E Drinker St', 'Dunmore', 'PA', '18512', '1900 E Drinker St', 'Dunmore', 'PA', '18512', 'Gregory Phillips', 'gregory.phillips@risecannabis.com', '570-555-0403', 'Net 30', 112000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Monroeville LLC', 'RISE Monroeville', 'GTI-PA-004', 'PA-MMO-2025-004', 'PA', 'external', 'LLC', 'Cannabis Retail', '4200 William Penn Hwy', 'Monroeville', 'PA', '15146', '4200 William Penn Hwy', 'Monroeville', 'PA', '15146', 'Stephanie Campbell', 'stephanie.campbell@risecannabis.com', '412-555-0404', 'Net 30', 135000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Cranberry LLC', 'RISE Cranberry', 'GTI-PA-005', 'PA-MMO-2025-005', 'PA', 'external', 'LLC', 'Cannabis Retail', '20550 Route 19', 'Cranberry Township', 'PA', '16066', '20550 Route 19', 'Cranberry Township', 'PA', '16066', 'Raymond Parker', 'raymond.parker@risecannabis.com', '724-555-0405', 'Net 30', 128000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Hermitage LLC', 'RISE Hermitage', 'GTI-PA-006', 'PA-MMO-2025-006', 'PA', 'external', 'LLC', 'Cannabis Retail', '2300 E State St', 'Hermitage', 'PA', '16148', '2300 E State St', 'Hermitage', 'PA', '16148', 'Deborah Evans', 'deborah.evans@risecannabis.com', '724-555-0406', 'Net 30', 105000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Carlisle LLC', 'RISE Carlisle', 'GTI-PA-007', 'PA-MMO-2025-007', 'PA', 'external', 'LLC', 'Cannabis Retail', '1235 Harrisburg Pike', 'Carlisle', 'PA', '17013', '1235 Harrisburg Pike', 'Carlisle', 'PA', '17013', 'Timothy Edwards', 'timothy.edwards@risecannabis.com', '717-555-0407', 'Net 30', 115000.00, 201000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Bloomsburg LLC', 'RISE Bloomsburg', 'GTI-PA-008', 'PA-MMO-2025-008', 'PA', 'external', 'LLC', 'Cannabis Retail', '1120 Columbia Blvd', 'Bloomsburg', 'PA', '17815', '1120 Columbia Blvd', 'Bloomsburg', 'PA', '17815', 'Angela Collins', 'angela.collins@risecannabis.com', '570-555-0408', 'Net 30', 98000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW());

-- New Jersey Dispensaries (3)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Paterson LLC', 'RISE Paterson', 'GTI-NJ-001', 'NJ-CRC-2025-001', 'NJ', 'external', 'LLC', 'Cannabis Retail', '300 Main St', 'Paterson', 'NJ', '07505', '300 Main St', 'Paterson', 'NJ', '07505', 'Frank Stewart', 'frank.stewart@risecannabis.com', '973-555-0501', 'Net 30', 145000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield', 'GTI-NJ-002', 'NJ-CRC-2025-002', 'NJ', 'external', 'LLC', 'Cannabis Retail', '1045 Broad St', 'Bloomfield', 'NJ', '07003', '1045 Broad St', 'Bloomfield', 'NJ', '07003', 'Rachel Sanchez', 'rachel.sanchez@risecannabis.com', '973-555-0502', 'Net 30', 138000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Paramus LLC', 'RISE Paramus', 'GTI-NJ-003', 'NJ-CRC-2025-003', 'NJ', 'external', 'LLC', 'Cannabis Retail', '240 Route 17 N', 'Paramus', 'NJ', '07652', '240 Route 17 N', 'Paramus', 'NJ', '07652', 'Victor Morris', 'victor.morris@risecannabis.com', '201-555-0503', 'Net 30', 152000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW());

-- Ohio Dispensaries (3)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Lakewood LLC', 'RISE Lakewood', 'GTI-OH-001', 'OH-DISP-2025-001', 'OH', 'external', 'LLC', 'Cannabis Retail', '14740 Detroit Ave', 'Lakewood', 'OH', '44107', '14740 Detroit Ave', 'Lakewood', 'OH', '44107', 'Christine Rogers', 'christine.rogers@risecannabis.com', '216-555-0601', 'Net 30', 132000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Toledo LLC', 'RISE Toledo', 'GTI-OH-002', 'OH-DISP-2025-002', 'OH', 'external', 'LLC', 'Cannabis Retail', '3550 W Central Ave', 'Toledo', 'OH', '43606', '3550 W Central Ave', 'Toledo', 'OH', '43606', 'Jeremy Reed', 'jeremy.reed@risecannabis.com', '419-555-0602', 'Net 30', 125000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Lorain LLC', 'RISE Lorain', 'GTI-OH-003', 'OH-DISP-2025-003', 'OH', 'external', 'LLC', 'Cannabis Retail', '4590 Oberlin Ave', 'Lorain', 'OH', '44053', '4590 Oberlin Ave', 'Lorain', 'OH', '44053', 'Heather Cook', 'heather.cook@risecannabis.com', '440-555-0603', 'Net 30', 118000.00, 212000.00, 'active', '2026-12-31', NOW(), NOW());

-- Connecticut Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield CT', 'GTI-CT-001', 'CT-RET-2025-001', 'CT', 'external', 'LLC', 'Cannabis Retail', '1220 Blue Hills Ave', 'Bloomfield', 'CT', '06002', '1220 Blue Hills Ave', 'Bloomfield', 'CT', '06002', 'Douglas Morgan', 'douglas.morgan@risecannabis.com', '860-555-0701', 'Net 30', 142000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Branford LLC', 'RISE Branford', 'GTI-CT-002', 'CT-RET-2025-002', 'CT', 'external', 'LLC', 'Cannabis Retail', '1040 W Main St', 'Branford', 'CT', '06405', '1040 W Main St', 'Branford', 'CT', '06405', 'Laura Bell', 'laura.bell@risecannabis.com', '203-555-0702', 'Net 30', 135000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW());

-- New York Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Syracuse LLC', 'RISE Syracuse', 'GTI-NY-001', 'NY-OCM-2025-001', 'NY', 'external', 'LLC', 'Cannabis Retail', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', 'Patrick Murphy', 'patrick.murphy@risecannabis.com', '315-555-0801', 'Net 30', 148000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary Binghamton LLC', 'RISE Binghamton', 'GTI-NY-002', 'NY-OCM-2025-002', 'NY', 'external', 'LLC', 'Cannabis Retail', '1240 Upper Front St', 'Binghamton', 'NY', '13901', '1240 Upper Front St', 'Binghamton', 'NY', '13901', 'Sandra Rivera', 'sandra.rivera@risecannabis.com', '607-555-0802', 'Net 30', 138000.00, 278000.00, 'active', '2026-12-31', NOW(), NOW());

-- Minnesota Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number,
  license_state, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status,
  license_expiration_date, created_at, updated_at
) VALUES
(gen_random_uuid(), 'RISE Dispensary Minneapolis LLC', 'RISE Minneapolis', 'GTI-MN-001', 'MN-RET-2025-001', 'MN', 'external', 'LLC', 'Cannabis Retail', '2540 Nicollet Ave', 'Minneapolis', 'MN', '55404', '2540 Nicollet Ave', 'Minneapolis', 'MN', '55404', 'Edward Cooper', 'edward.cooper@risecannabis.com', '612-555-0901', 'Net 30', 155000.00, 323000.00, 'active', '2026-12-31', NOW(), NOW()),
(gen_random_uuid(), 'RISE Dispensary St Paul LLC', 'RISE St Paul', 'GTI-MN-002', 'MN-RET-2025-002', 'MN', 'external', 'LLC', 'Cannabis Retail', '1450 University Ave W', 'St Paul', 'MN', '55104', '1450 University Ave W', 'St Paul', 'MN', '55104', 'Kimberly Richardson', 'kimberly.richardson@risecannabis.com', '651-555-0902', 'Net 30', 145000.00, 301000.00, 'active', '2026-12-31', NOW(), NOW());
