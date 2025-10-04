-- Seed Customers for GTI Cannabis Dispensary (Version 5 - Fixed business_type)
-- 50 dispensaries across Green Thumb Industries markets

-- Clear existing customers (if any)
TRUNCATE TABLE customers CASCADE;

-- Fixed business_type to use 'LLC' to match the check constraint
-- Illinois Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Joliet LLC', 'RISE Joliet', 'GTI-IL-001', 'IL-DIS-2025-001', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1801 W Jefferson St', 'Joliet', 'IL', '60435', '1801 W Jefferson St', 'Joliet', 'IL', '60435', 'Michael Chen', 'michael.chen@risecannabis.com', '815-555-0101', 'Net 30', 150000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Naperville LLC', 'RISE Naperville', 'GTI-IL-002', 'IL-DIS-2025-002', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', 'Sarah Johnson', 'sarah.j@rise-naperville.com', '630-555-0101', 'Net 30', 125000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Mundelein LLC', 'RISE Mundelein', 'GTI-IL-003', 'IL-DIS-2025-003', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', 'David Park', 'david.park@risecannabis.com', '847-555-0101', 'Net 30', 135000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Canton LLC', 'RISE Canton', 'GTI-IL-004', 'IL-DIS-2025-004', 'IL', 'Illinois', 'Standard', 'external', 'LLC', 'Cannabis Retail', '2610 N Main St', 'Canton', 'IL', '61520', '2610 N Main St', 'Canton', 'IL', '61520', 'Jennifer Martinez', 'jennifer.m@risecannabis.com', '309-555-0101', 'Net 30', 95000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Effingham LLC', 'RISE Effingham', 'GTI-IL-005', 'IL-DIS-2025-005', 'IL', 'Illinois', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1101 S Keller Dr', 'Effingham', 'IL', '62401', '1101 S Keller Dr', 'Effingham', 'IL', '62401', 'Robert Williams', 'robert.w@risecannabis.com', '217-555-0101', 'Net 30', 88000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Bloomington LLC', 'RISE Bloomington', 'GTI-IL-006', 'IL-DIS-2025-006', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1503 N Veterans Pkwy', 'Bloomington', 'IL', '61704', '1503 N Veterans Pkwy', 'Bloomington', 'IL', '61704', 'Amanda Lee', 'amanda.lee@risecannabis.com', '309-555-0202', 'Net 30', 115000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Quincy LLC', 'RISE Quincy', 'GTI-IL-007', 'IL-DIS-2025-007', 'IL', 'Illinois', 'Standard', 'external', 'LLC', 'Cannabis Retail', '826 Broadway St', 'Quincy', 'IL', '62301', '826 Broadway St', 'Quincy', 'IL', '62301', 'Thomas Anderson', 'thomas.a@risecannabis.com', '217-555-0303', 'Net 30', 92000.00, 167000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Lake in the Hills LLC', 'RISE Lake in the Hills', 'GTI-IL-008', 'IL-DIS-2025-008', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '4741 Pyott Rd', 'Lake in the Hills', 'IL', '60156', '4741 Pyott Rd', 'Lake in the Hills', 'IL', '60156', 'Michelle Garcia', 'michelle.g@risecannabis.com', '847-555-0404', 'Net 30', 128000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Peoria LLC', 'RISE Peoria', 'GTI-IL-009', 'IL-DIS-2025-009', 'IL', 'Illinois', 'Standard', 'external', 'LLC', 'Cannabis Retail', '4308 N Prospect Rd', 'Peoria', 'IL', '61614', '4308 N Prospect Rd', 'Peoria', 'IL', '61614', 'Christopher Brown', 'chris.brown@risecannabis.com', '309-555-0505', 'Net 30', 105000.00, 201000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Champaign LLC', 'RISE Champaign', 'GTI-IL-010', 'IL-DIS-2025-010', 'IL', 'Illinois', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1833 S Neil St', 'Champaign', 'IL', '61820', '1833 S Neil St', 'Champaign', 'IL', '61820', 'Jessica Taylor', 'jessica.t@risecannabis.com', '217-555-0606', 'Net 30', 118000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW());

-- Florida Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Bonita Springs LLC', 'RISE Bonita Springs', 'GTI-FL-001', 'FL-DIS-2025-001', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', 'Maria Rodriguez', 'maria.r@risecannabis.com', '239-555-0101', 'Net 30', 145000.00, 356000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Deerfield Beach LLC', 'RISE Deerfield Beach', 'GTI-FL-002', 'FL-DIS-2025-002', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1740 W Hillsboro Blvd', 'Deerfield Beach', 'FL', '33442', '1740 W Hillsboro Blvd', 'Deerfield Beach', 'FL', '33442', 'Carlos Sanchez', 'carlos.s@risecannabis.com', '954-555-0101', 'Net 30', 152000.00, 389000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Hallandale Beach LLC', 'RISE Hallandale Beach', 'GTI-FL-003', 'FL-DIS-2025-003', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '301 S Federal Hwy', 'Hallandale Beach', 'FL', '33009', '301 S Federal Hwy', 'Hallandale Beach', 'FL', '33009', 'Nicole Thompson', 'nicole.t@risecannabis.com', '954-555-0202', 'Net 30', 148000.00, 378000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Kendall LLC', 'RISE Kendall', 'GTI-FL-004', 'FL-DIS-2025-004', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '13750 SW 88th St', 'Miami', 'FL', '33186', '13750 SW 88th St', 'Miami', 'FL', '33186', 'Luis Hernandez', 'luis.h@risecannabis.com', '305-555-0101', 'Net 30', 158000.00, 412000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Oviedo LLC', 'RISE Oviedo', 'GTI-FL-005', 'FL-DIS-2025-005', 'FL', 'Florida', 'Standard', 'external', 'LLC', 'Cannabis Retail', '7780 Red Bug Lake Rd', 'Oviedo', 'FL', '32765', '7780 Red Bug Lake Rd', 'Oviedo', 'FL', '32765', 'Patricia Wilson', 'patricia.w@risecannabis.com', '407-555-0101', 'Net 30', 112000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Pinellas Park LLC', 'RISE Pinellas Park', 'GTI-FL-006', 'FL-DIS-2025-006', 'FL', 'Florida', 'Standard', 'external', 'LLC', 'Cannabis Retail', '7901 Park Blvd', 'Pinellas Park', 'FL', '33781', '7901 Park Blvd', 'Pinellas Park', 'FL', '33781', 'James Mitchell', 'james.m@risecannabis.com', '727-555-0101', 'Net 30', 108000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary West Palm Beach LLC', 'RISE West Palm Beach', 'GTI-FL-007', 'FL-DIS-2025-007', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1950 Okeechobee Blvd', 'West Palm Beach', 'FL', '33409', '1950 Okeechobee Blvd', 'West Palm Beach', 'FL', '33409', 'Angela Davis', 'angela.d@risecannabis.com', '561-555-0101', 'Net 30', 142000.00, 367000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Lakeland LLC', 'RISE Lakeland', 'GTI-FL-008', 'FL-DIS-2025-008', 'FL', 'Florida', 'Standard', 'external', 'LLC', 'Cannabis Retail', '3750 US Hwy 98 N', 'Lakeland', 'FL', '33809', '3750 US Hwy 98 N', 'Lakeland', 'FL', '33809', 'Kevin Moore', 'kevin.m@risecannabis.com', '863-555-0101', 'Net 30', 98000.00, 223000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Jacksonville LLC', 'RISE Jacksonville', 'GTI-FL-009', 'FL-DIS-2025-009', 'FL', 'Florida', 'Standard', 'external', 'LLC', 'Cannabis Retail', '10261 River Marsh Dr', 'Jacksonville', 'FL', '32246', '10261 River Marsh Dr', 'Jacksonville', 'FL', '32246', 'Stephanie Clark', 'stephanie.c@risecannabis.com', '904-555-0101', 'Net 30', 105000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Tampa LLC', 'RISE Tampa', 'GTI-FL-010', 'FL-DIS-2025-010', 'FL', 'Florida', 'Premium', 'external', 'LLC', 'Cannabis Retail', '4107 W Hillsborough Ave', 'Tampa', 'FL', '33614', '4107 W Hillsborough Ave', 'Tampa', 'FL', '33614', 'Brandon White', 'brandon.w@risecannabis.com', '813-555-0101', 'Net 30', 138000.00, 345000.00, 'active', '2026-12-31', NOW(), NOW());

-- Nevada Dispensaries (10)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Las Vegas LLC', 'RISE Las Vegas', 'GTI-NV-001', 'NV-DIS-2025-001', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '4224 W Flamingo Rd', 'Las Vegas', 'NV', '89103', '4224 W Flamingo Rd', 'Las Vegas', 'NV', '89103', 'Daniel Harris', 'daniel.h@risecannabis.com', '702-555-0101', 'Net 30', 165000.00, 456000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Henderson LLC', 'RISE Henderson', 'GTI-NV-002', 'NV-DIS-2025-002', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '2300 E Sunset Rd', 'Henderson', 'NV', '89014', '2300 E Sunset Rd', 'Henderson', 'NV', '89014', 'Rachel Green', 'rachel.g@risecannabis.com', '702-555-0202', 'Net 30', 142000.00, 389000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary North Las Vegas LLC', 'RISE North Las Vegas', 'GTI-NV-003', 'NV-DIS-2025-003', 'NV', 'Nevada', 'Standard', 'external', 'LLC', 'Cannabis Retail', '2320 W Cheyenne Ave', 'North Las Vegas', 'NV', '89032', '2320 W Cheyenne Ave', 'North Las Vegas', 'NV', '89032', 'Marcus Johnson', 'marcus.j@risecannabis.com', '702-555-0303', 'Net 30', 118000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Reno LLC', 'RISE Reno', 'GTI-NV-004', 'NV-DIS-2025-004', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '5580 S Virginia St', 'Reno', 'NV', '89502', '5580 S Virginia St', 'Reno', 'NV', '89502', 'Olivia Martinez', 'olivia.m@risecannabis.com', '775-555-0101', 'Net 30', 135000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Sparks LLC', 'RISE Sparks', 'GTI-NV-005', 'NV-DIS-2025-005', 'NV', 'Nevada', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1950 E Greg St', 'Sparks', 'NV', '89431', '1950 E Greg St', 'Sparks', 'NV', '89431', 'Tyler Anderson', 'tyler.a@risecannabis.com', '775-555-0202', 'Net 30', 98000.00, 223000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Paradise LLC', 'RISE Paradise', 'GTI-NV-006', 'NV-DIS-2025-006', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '3650 S Decatur Blvd', 'Las Vegas', 'NV', '89103', '3650 S Decatur Blvd', 'Las Vegas', 'NV', '89103', 'Samantha Lee', 'samantha.l@risecannabis.com', '702-555-0404', 'Net 30', 152000.00, 412000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Spring Valley LLC', 'RISE Spring Valley', 'GTI-NV-007', 'NV-DIS-2025-007', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '7885 W Sahara Ave', 'Las Vegas', 'NV', '89117', '7885 W Sahara Ave', 'Las Vegas', 'NV', '89117', 'Jonathan Kim', 'jonathan.k@risecannabis.com', '702-555-0505', 'Net 30', 148000.00, 398000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Enterprise LLC', 'RISE Enterprise', 'GTI-NV-008', 'NV-DIS-2025-008', 'NV', 'Nevada', 'Standard', 'external', 'LLC', 'Cannabis Retail', '6420 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', '6420 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', 'Emily Chen', 'emily.c@risecannabis.com', '702-555-0606', 'Net 30', 112000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Summerlin LLC', 'RISE Summerlin', 'GTI-NV-009', 'NV-DIS-2025-009', 'NV', 'Nevada', 'Premium', 'external', 'LLC', 'Cannabis Retail', '10100 W Charleston Blvd', 'Las Vegas', 'NV', '89135', '10100 W Charleston Blvd', 'Las Vegas', 'NV', '89135', 'Andrew Wilson', 'andrew.w@risecannabis.com', '702-555-0707', 'Net 30', 158000.00, 423000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Carson City LLC', 'RISE Carson City', 'GTI-NV-010', 'NV-DIS-2025-010', 'NV', 'Nevada', 'Standard', 'external', 'LLC', 'Cannabis Retail', '2815 S Carson St', 'Carson City', 'NV', '89701', '2815 S Carson St', 'Carson City', 'NV', '89701', 'Victoria Brown', 'victoria.b@risecannabis.com', '775-555-0303', 'Net 30', 92000.00, 198000.00, 'active', '2026-12-31', NOW(), NOW());

-- Pennsylvania Dispensaries (7)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Mechanicsburg LLC', 'RISE Mechanicsburg', 'GTI-PA-001', 'PA-DIS-2025-001', 'PA', 'Pennsylvania', 'Premium', 'external', 'LLC', 'Cannabis Retail', '6930 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', '6930 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', 'Matthew Taylor', 'matthew.t@risecannabis.com', '717-555-0101', 'Net 30', 128000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Carlisle LLC', 'RISE Carlisle', 'GTI-PA-002', 'PA-DIS-2025-002', 'PA', 'Pennsylvania', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1235 Harrisburg Pike', 'Carlisle', 'PA', '17013', '1235 Harrisburg Pike', 'Carlisle', 'PA', '17013', 'Lauren Davis', 'lauren.d@risecannabis.com', '717-555-0202', 'Net 30', 98000.00, 212000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Chambersburg LLC', 'RISE Chambersburg', 'GTI-PA-003', 'PA-DIS-2025-003', 'PA', 'Pennsylvania', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1860 Lincoln Way E', 'Chambersburg', 'PA', '17202', '1860 Lincoln Way E', 'Chambersburg', 'PA', '17202', 'Ryan Miller', 'ryan.m@risecannabis.com', '717-555-0303', 'Net 30', 88000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Monroeville LLC', 'RISE Monroeville', 'GTI-PA-004', 'PA-DIS-2025-004', 'PA', 'Pennsylvania', 'Premium', 'external', 'LLC', 'Cannabis Retail', '4800 Northern Pike', 'Monroeville', 'PA', '15146', '4800 Northern Pike', 'Monroeville', 'PA', '15146', 'Ashley Garcia', 'ashley.g@risecannabis.com', '412-555-0101', 'Net 30', 135000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Cranberry LLC', 'RISE Cranberry', 'GTI-PA-005', 'PA-DIS-2025-005', 'PA', 'Pennsylvania', 'Premium', 'external', 'LLC', 'Cannabis Retail', '20550 Route 19', 'Cranberry Township', 'PA', '16066', '20550 Route 19', 'Cranberry Township', 'PA', '16066', 'Justin Thomas', 'justin.t@risecannabis.com', '724-555-0101', 'Net 30', 142000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Latrobe LLC', 'RISE Latrobe', 'GTI-PA-006', 'PA-DIS-2025-006', 'PA', 'Pennsylvania', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1000 Ligonier St', 'Latrobe', 'PA', '15650', '1000 Ligonier St', 'Latrobe', 'PA', '15650', 'Megan Robinson', 'megan.r@risecannabis.com', '724-555-0202', 'Net 30', 92000.00, 198000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Hermitage LLC', 'RISE Hermitage', 'GTI-PA-007', 'PA-DIS-2025-007', 'PA', 'Pennsylvania', 'Standard', 'external', 'LLC', 'Cannabis Retail', '2300 E State St', 'Hermitage', 'PA', '16148', '2300 E State St', 'Hermitage', 'PA', '16148', 'Brian Walker', 'brian.w@risecannabis.com', '724-555-0303', 'Net 30', 85000.00, 176000.00, 'active', '2026-12-31', NOW(), NOW());

-- New Jersey Dispensaries (3)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Paterson LLC', 'RISE Paterson', 'GTI-NJ-001', 'NJ-DIS-2025-001', 'NJ', 'New Jersey', 'Premium', 'external', 'LLC', 'Cannabis Retail', '300 Main St', 'Paterson', 'NJ', '07505', '300 Main St', 'Paterson', 'NJ', '07505', 'Christopher Lee', 'christopher.l@risecannabis.com', '973-555-0101', 'Net 30', 145000.00, 378000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield', 'GTI-NJ-002', 'NJ-DIS-2025-002', 'NJ', 'New Jersey', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1045 Broad St', 'Bloomfield', 'NJ', '07003', '1045 Broad St', 'Bloomfield', 'NJ', '07003', 'Natalie Martinez', 'natalie.m@risecannabis.com', '973-555-0202', 'Net 30', 138000.00, 356000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Paramus LLC', 'RISE Paramus', 'GTI-NJ-003', 'NJ-DIS-2025-003', 'NJ', 'New Jersey', 'Premium', 'external', 'LLC', 'Cannabis Retail', '240 Route 4 W', 'Paramus', 'NJ', '07652', '240 Route 4 W', 'Paramus', 'NJ', '07652', 'Eric Johnson', 'eric.j@risecannabis.com', '201-555-0101', 'Net 30', 152000.00, 389000.00, 'active', '2026-12-31', NOW(), NOW());

-- Ohio Dispensaries (3)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Lakewood LLC', 'RISE Lakewood', 'GTI-OH-001', 'OH-DIS-2025-001', 'OH', 'Ohio', 'Premium', 'external', 'LLC', 'Cannabis Retail', '14583 Madison Ave', 'Lakewood', 'OH', '44107', '14583 Madison Ave', 'Lakewood', 'OH', '44107', 'Gregory Smith', 'gregory.s@risecannabis.com', '216-555-0101', 'Net 30', 132000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Toledo LLC', 'RISE Toledo', 'GTI-OH-002', 'OH-DIS-2025-002', 'OH', 'Ohio', 'Standard', 'external', 'LLC', 'Cannabis Retail', '3550 Executive Pkwy', 'Toledo', 'OH', '43606', '3550 Executive Pkwy', 'Toledo', 'OH', '43606', 'Kimberly White', 'kimberly.w@risecannabis.com', '419-555-0101', 'Net 30', 105000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Lorain LLC', 'RISE Lorain', 'GTI-OH-003', 'OH-DIS-2025-003', 'OH', 'Ohio', 'Standard', 'external', 'LLC', 'Cannabis Retail', '5765 Oberlin Ave', 'Lorain', 'OH', '44053', '5765 Oberlin Ave', 'Lorain', 'OH', '44053', 'Patrick Brown', 'patrick.b@risecannabis.com', '440-555-0101', 'Net 30', 95000.00, 212000.00, 'active', '2026-12-31', NOW(), NOW());

-- Connecticut Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield CT', 'GTI-CT-001', 'CT-DIS-2025-001', 'CT', 'Connecticut', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1 Tunxis Ave', 'Bloomfield', 'CT', '06002', '1 Tunxis Ave', 'Bloomfield', 'CT', '06002', 'Steven Anderson', 'steven.a@risecannabis.com', '860-555-0101', 'Net 30', 125000.00, 278000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Branford LLC', 'RISE Branford', 'GTI-CT-002', 'CT-DIS-2025-002', 'CT', 'Connecticut', 'Standard', 'external', 'LLC', 'Cannabis Retail', '220 E Main St', 'Branford', 'CT', '06405', '220 E Main St', 'Branford', 'CT', '06405', 'Diana Martinez', 'diana.m@risecannabis.com', '203-555-0101', 'Net 30', 108000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW());

-- New York Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'Green Thumb New York LLC', 'RISE Dispensary Binghamton', 'GTI-NY-002', 'NY-OCM-2025-002', 'NY', 'New York', 'Standard', 'external', 'LLC', 'Cannabis Retail', '1200 Upper Front St', 'Binghamton', 'NY', '13901', '1200 Upper Front St', 'Binghamton', 'NY', '13901', 'Frank Murphy', 'frank.m@rise-binghamton.com', '607-555-0802', 'Net 30', 35000.00, 92000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'Green Thumb New York LLC', 'RISE Dispensary Syracuse', 'GTI-NY-001', 'NY-OCM-2025-001', 'NY', 'New York', 'Premium', 'external', 'LLC', 'Cannabis Retail', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', 'Amanda Wilson', 'amanda.w@risecannabis.com', '315-555-0101', 'Net 30', 45000.00, 125000.00, 'active', '2026-12-31', NOW(), NOW());

-- Minnesota (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'Green Thumb Minnesota LLC', 'RISE Dispensary Minneapolis', 'GTI-MN-001', 'MN-OCM-2025-001', 'MN', 'Minnesota', 'Premium', 'external', 'LLC', 'Cannabis Retail', '2550 Nicollet Ave', 'Minneapolis', 'MN', '55404', '2550 Nicollet Ave', 'Minneapolis', 'MN', '55404', 'Helen Bailey', 'helen.b@rise-minneapolis.com', '651-555-9001', 'Net 30', 50000.00, 138000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'Green Thumb Minnesota LLC', 'RISE Dispensary St. Paul', 'GTI-MN-002', 'MN-OCM-2025-002', 'MN', 'Minnesota', 'Premium', 'external', 'LLC', 'Cannabis Retail', '1450 University Ave W', 'St. Paul', 'MN', '55104', '1450 University Ave W', 'St. Paul', 'MN', '55104', 'George Ramirez', 'george.r@rise-stpaul.com', '651-555-9002', 'Net 30', 50000.00, 142000.00, 'active', '2026-12-31', NOW(), NOW());
