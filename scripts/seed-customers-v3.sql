-- Seed Customers for GTI Cannabis Dispensary (Version 3 - Complete 50 Dispensaries)
-- 50 dispensaries across Green Thumb Industries markets

-- Clear existing customers (if any)
TRUNCATE TABLE customers CASCADE;

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
  (gen_random_uuid(), 'RISE Dispensary Joliet LLC', 'RISE Joliet', 'GTI-IL-001', 'IL-DIS-2025-001', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1801 W Jefferson St', 'Joliet', 'IL', '60435', '1801 W Jefferson St', 'Joliet', 'IL', '60435', 'Michael Chen', 'michael.chen@risecannabis.com', '815-555-0101', 'Net 30', 150000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Naperville LLC', 'RISE Naperville', 'GTI-IL-002', 'IL-DIS-2025-002', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', '1209 S Naper Blvd', 'Naperville', 'IL', '60540', 'Sarah Johnson', 'sarah.johnson@risecannabis.com', '630-555-0102', 'Net 30', 150000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Mundelein LLC', 'RISE Mundelein', 'GTI-IL-003', 'IL-DIS-2025-003', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', '1325 Armour Blvd', 'Mundelein', 'IL', '60060', 'David Martinez', 'david.martinez@risecannabis.com', '847-555-0103', 'Net 30', 150000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Canton LLC', 'RISE Canton', 'GTI-IL-004', 'IL-DIS-2025-004', 'IL', 'Illinois', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '2730 N Main St', 'Canton', 'IL', '61520', '2730 N Main St', 'Canton', 'IL', '61520', 'Jennifer Lee', 'jennifer.lee@risecannabis.com', '309-555-0104', 'Net 30', 100000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Effingham LLC', 'RISE Effingham', 'GTI-IL-005', 'IL-DIS-2025-005', 'IL', 'Illinois', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1101 S Keller Dr', 'Effingham', 'IL', '62401', '1101 S Keller Dr', 'Effingham', 'IL', '62401', 'Robert Taylor', 'robert.taylor@risecannabis.com', '217-555-0105', 'Net 30', 100000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Bloomington LLC', 'RISE Bloomington', 'GTI-IL-006', 'IL-DIS-2025-006', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1112 Morrissey Dr', 'Bloomington', 'IL', '61701', '1112 Morrissey Dr', 'Bloomington', 'IL', '61701', 'Amanda White', 'amanda.white@risecannabis.com', '309-555-0106', 'Net 30', 150000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Quincy LLC', 'RISE Quincy', 'GTI-IL-007', 'IL-DIS-2025-007', 'IL', 'Illinois', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '3701 Broadway St', 'Quincy', 'IL', '62301', '3701 Broadway St', 'Quincy', 'IL', '62301', 'Christopher Brown', 'chris.brown@risecannabis.com', '217-555-0107', 'Net 30', 100000.00, 145000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Peoria LLC', 'RISE Peoria', 'GTI-IL-008', 'IL-DIS-2025-008', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '5001 W War Memorial Dr', 'Peoria', 'IL', '61615', '5001 W War Memorial Dr', 'Peoria', 'IL', '61615', 'Lisa Anderson', 'lisa.anderson@risecannabis.com', '309-555-0108', 'Net 30', 150000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Lake in the Hills LLC', 'RISE Lake in the Hills', 'GTI-IL-009', 'IL-DIS-2025-009', 'IL', 'Illinois', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '8970 US Highway 14', 'Lake in the Hills', 'IL', '60156', '8970 US Highway 14', 'Lake in the Hills', 'IL', '60156', 'Kevin Garcia', 'kevin.garcia@risecannabis.com', '847-555-0109', 'Net 30', 100000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Champaign LLC', 'RISE Champaign', 'GTI-IL-010', 'IL-DIS-2025-010', 'IL', 'Illinois', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1833 S Neil St', 'Champaign', 'IL', '61820', '1833 S Neil St', 'Champaign', 'IL', '61820', 'Michelle Rodriguez', 'michelle.rodriguez@risecannabis.com', '217-555-0110', 'Net 30', 150000.00, 276000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Ocala LLC', 'RISE Ocala', 'GTI-FL-001', 'FL-MMTC-2025-001', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '2801 SW College Rd', 'Ocala', 'FL', '34471', '2801 SW College Rd', 'Ocala', 'FL', '34471', 'Daniel Wilson', 'daniel.wilson@risecannabis.com', '352-555-0201', 'Net 30', 150000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Bonita Springs LLC', 'RISE Bonita Springs', 'GTI-FL-002', 'FL-MMTC-2025-002', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', '28801 S Tamiami Trail', 'Bonita Springs', 'FL', '34134', 'Patricia Moore', 'patricia.moore@risecannabis.com', '239-555-0202', 'Net 30', 150000.00, 256000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Brandon LLC', 'RISE Brandon', 'GTI-FL-003', 'FL-MMTC-2025-003', 'FL', 'Florida', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1951 W Brandon Blvd', 'Brandon', 'FL', '33511', '1951 W Brandon Blvd', 'Brandon', 'FL', '33511', 'James Thompson', 'james.thompson@risecannabis.com', '813-555-0203', 'Net 30', 100000.00, 167000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Clearwater LLC', 'RISE Clearwater', 'GTI-FL-004', 'FL-MMTC-2025-004', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '2655 Ulmerton Rd', 'Clearwater', 'FL', '33762', '2655 Ulmerton Rd', 'Clearwater', 'FL', '33762', 'Maria Hernandez', 'maria.hernandez@risecannabis.com', '727-555-0204', 'Net 30', 150000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Deerfield Beach LLC', 'RISE Deerfield Beach', 'GTI-FL-005', 'FL-MMTC-2025-005', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1836 SE 3rd Ct', 'Deerfield Beach', 'FL', '33441', '1836 SE 3rd Ct', 'Deerfield Beach', 'FL', '33441', 'Thomas Jackson', 'thomas.jackson@risecannabis.com', '954-555-0205', 'Net 30', 150000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Jacksonville LLC', 'RISE Jacksonville', 'GTI-FL-006', 'FL-MMTC-2025-006', 'FL', 'Florida', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '10261 Shops Ln', 'Jacksonville', 'FL', '32246', '10261 Shops Ln', 'Jacksonville', 'FL', '32246', 'Barbara Martin', 'barbara.martin@risecannabis.com', '904-555-0206', 'Net 30', 100000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Kendall LLC', 'RISE Kendall', 'GTI-FL-007', 'FL-MMTC-2025-007', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '13750 SW 88th St', 'Kendall', 'FL', '33186', '13750 SW 88th St', 'Kendall', 'FL', '33186', 'Richard Davis', 'richard.davis@risecannabis.com', '305-555-0207', 'Net 30', 150000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Orlando LLC', 'RISE Orlando', 'GTI-FL-008', 'FL-MMTC-2025-008', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '5860 Good Homes Rd', 'Orlando', 'FL', '32818', '5860 Good Homes Rd', 'Orlando', 'FL', '32818', 'Susan Miller', 'susan.miller@risecannabis.com', '407-555-0208', 'Net 30', 150000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Tallahassee LLC', 'RISE Tallahassee', 'GTI-FL-009', 'FL-MMTC-2025-009', 'FL', 'Florida', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1600 N Monroe St', 'Tallahassee', 'FL', '32303', '1600 N Monroe St', 'Tallahassee', 'FL', '32303', 'Joseph Wilson', 'joseph.wilson@risecannabis.com', '850-555-0209', 'Net 30', 100000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary West Palm Beach LLC', 'RISE West Palm Beach', 'GTI-FL-010', 'FL-MMTC-2025-010', 'FL', 'Florida', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1950 Okeechobee Blvd', 'West Palm Beach', 'FL', '33409', '1950 Okeechobee Blvd', 'West Palm Beach', 'FL', '33409', 'Nancy Anderson', 'nancy.anderson@risecannabis.com', '561-555-0210', 'Net 30', 150000.00, 287000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Henderson LLC', 'RISE Henderson', 'GTI-NV-001', 'NV-RET-2025-001', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '4300 E Sunset Rd Suite A3', 'Henderson', 'NV', '89014', '4300 E Sunset Rd Suite A3', 'Henderson', 'NV', '89014', 'Charles Taylor', 'charles.taylor@risecannabis.com', '702-555-0301', 'Net 30', 150000.00, 345000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Las Vegas Craig LLC', 'RISE Las Vegas Craig', 'GTI-NV-002', 'NV-RET-2025-002', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '4850 W Craig Rd', 'Las Vegas', 'NV', '89130', '4850 W Craig Rd', 'Las Vegas', 'NV', '89130', 'Karen Thomas', 'karen.thomas@risecannabis.com', '702-555-0302', 'Net 30', 150000.00, 367000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Las Vegas Nellis LLC', 'RISE Las Vegas Nellis', 'GTI-NV-003', 'NV-RET-2025-003', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '3650 Nellis Blvd', 'Las Vegas', 'NV', '89115', '3650 Nellis Blvd', 'Las Vegas', 'NV', '89115', 'Steven Martinez', 'steven.martinez@risecannabis.com', '702-555-0303', 'Net 30', 150000.00, 389000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Las Vegas Durango LLC', 'RISE Las Vegas Durango', 'GTI-NV-004', 'NV-RET-2025-004', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '7380 S Durango Dr', 'Las Vegas', 'NV', '89113', '7380 S Durango Dr', 'Las Vegas', 'NV', '89113', 'Betty Robinson', 'betty.robinson@risecannabis.com', '702-555-0304', 'Net 30', 150000.00, 356000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Las Vegas Rainbow LLC', 'RISE Las Vegas Rainbow', 'GTI-NV-005', 'NV-RET-2025-005', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '6464 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', '6464 S Rainbow Blvd', 'Las Vegas', 'NV', '89118', 'Donald Clark', 'donald.clark@risecannabis.com', '702-555-0305', 'Net 30', 150000.00, 378000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Las Vegas Tropicana LLC', 'RISE Las Vegas Tropicana', 'GTI-NV-006', 'NV-RET-2025-006', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '4045 W Tropicana Ave', 'Las Vegas', 'NV', '89103', '4045 W Tropicana Ave', 'Las Vegas', 'NV', '89103', 'Dorothy Lewis', 'dorothy.lewis@risecannabis.com', '702-555-0306', 'Net 30', 150000.00, 398000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Reno LLC', 'RISE Reno', 'GTI-NV-007', 'NV-RET-2025-007', 'NV', 'Nevada', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '5515 S Virginia St', 'Reno', 'NV', '89502', '5515 S Virginia St', 'Reno', 'NV', '89502', 'Paul Walker', 'paul.walker@risecannabis.com', '775-555-0307', 'Net 30', 100000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Carson City LLC', 'RISE Carson City', 'GTI-NV-008', 'NV-RET-2025-008', 'NV', 'Nevada', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '2815 S Carson St', 'Carson City', 'NV', '89701', '2815 S Carson St', 'Carson City', 'NV', '89701', 'Sandra Hall', 'sandra.hall@risecannabis.com', '775-555-0308', 'Net 30', 100000.00, 167000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Spanish Springs LLC', 'RISE Spanish Springs', 'GTI-NV-009', 'NV-RET-2025-009', 'NV', 'Nevada', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1185 Disc Dr', 'Sparks', 'NV', '89436', '1185 Disc Dr', 'Sparks', 'NV', '89436', 'Mark Allen', 'mark.allen@risecannabis.com', '775-555-0309', 'Net 30', 100000.00, 145000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'Cookies on the Strip Dispensary LLC', 'Cookies Las Vegas', 'GTI-NV-010', 'NV-RET-2025-010', 'NV', 'Nevada', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '3743 Las Vegas Blvd S', 'Las Vegas', 'NV', '89109', '3743 Las Vegas Blvd S', 'Las Vegas', 'NV', '89109', 'Kenneth Young', 'kenneth.young@cookieslv.com', '702-555-0310', 'Net 30', 150000.00, 412000.00, 'active', '2026-12-31', NOW(), NOW());

-- Pennsylvania Dispensaries (8)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Mechanicsburg LLC', 'RISE Mechanicsburg', 'GTI-PA-001', 'PA-DIS-2025-001', 'PA', 'Pennsylvania', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '6300 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', '6300 Carlisle Pike', 'Mechanicsburg', 'PA', '17050', 'Laura Hernandez', 'laura.hernandez@risecannabis.com', '717-555-0401', 'Net 30', 150000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Monroeville LLC', 'RISE Monroeville', 'GTI-PA-002', 'PA-DIS-2025-002', 'PA', 'Pennsylvania', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '4200 William Penn Hwy', 'Monroeville', 'PA', '15146', '4200 William Penn Hwy', 'Monroeville', 'PA', '15146', 'Brian King', 'brian.king@risecannabis.com', '412-555-0402', 'Net 30', 150000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Cranberry LLC', 'RISE Cranberry', 'GTI-PA-003', 'PA-DIS-2025-003', 'PA', 'Pennsylvania', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '20550 Perry Hwy', 'Cranberry Township', 'PA', '16066', '20550 Perry Hwy', 'Cranberry Township', 'PA', '16066', 'Carol Wright', 'carol.wright@risecannabis.com', '724-555-0403', 'Net 30', 100000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Duncansville LLC', 'RISE Duncansville', 'GTI-PA-004', 'PA-DIS-2025-004', 'PA', 'Pennsylvania', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1050 Plank Rd', 'Duncansville', 'PA', '16635', '1050 Plank Rd', 'Duncansville', 'PA', '16635', 'Edward Lopez', 'edward.lopez@risecannabis.com', '814-555-0404', 'Net 30', 100000.00, 156000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Hermitage LLC', 'RISE Hermitage', 'GTI-PA-005', 'PA-DIS-2025-005', 'PA', 'Pennsylvania', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '2300 E State St', 'Hermitage', 'PA', '16148', '2300 E State St', 'Hermitage', 'PA', '16148', 'Deborah Hill', 'deborah.hill@risecannabis.com', '724-555-0405', 'Net 30', 100000.00, 167000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Steelton LLC', 'RISE Steelton', 'GTI-PA-006', 'PA-DIS-2025-006', 'PA', 'Pennsylvania', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '301 N Front St', 'Steelton', 'PA', '17113', '301 N Front St', 'Steelton', 'PA', '17113', 'George Scott', 'george.scott@risecannabis.com', '717-555-0406', 'Net 30', 150000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Warminster LLC', 'RISE Warminster', 'GTI-PA-007', 'PA-DIS-2025-007', 'PA', 'Pennsylvania', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1000 Easton Rd', 'Warminster', 'PA', '18974', '1000 Easton Rd', 'Warminster', 'PA', '18974', 'Helen Green', 'helen.green@risecannabis.com', '215-555-0407', 'Net 30', 150000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary York LLC', 'RISE York', 'GTI-PA-008', 'PA-DIS-2025-008', 'PA', 'Pennsylvania', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1681 Kenneth Rd', 'York', 'PA', '17408', '1681 Kenneth Rd', 'York', 'PA', '17408', 'Frank Adams', 'frank.adams@risecannabis.com', '717-555-0408', 'Net 30', 100000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield', 'GTI-NJ-001', 'NJ-ATC-2025-001', 'NJ', 'New Jersey', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1 Watsessing Ave', 'Bloomfield', 'NJ', '07003', '1 Watsessing Ave', 'Bloomfield', 'NJ', '07003', 'Raymond Baker', 'raymond.baker@risecannabis.com', '973-555-0501', 'Net 30', 150000.00, 312000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Paterson LLC', 'RISE Paterson', 'GTI-NJ-002', 'NJ-ATC-2025-002', 'NJ', 'New Jersey', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '300 Main St', 'Paterson', 'NJ', '07505', '300 Main St', 'Paterson', 'NJ', '07505', 'Ruth Nelson', 'ruth.nelson@risecannabis.com', '973-555-0502', 'Net 30', 150000.00, 289000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Paramus LLC', 'RISE Paramus', 'GTI-NJ-003', 'NJ-ATC-2025-003', 'NJ', 'New Jersey', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '240 NJ-17', 'Paramus', 'NJ', '07652', '240 NJ-17', 'Paramus', 'NJ', '07652', 'Gary Carter', 'gary.carter@risecannabis.com', '201-555-0503', 'Net 30', 150000.00, 334000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Whitehall LLC', 'RISE Whitehall', 'GTI-OH-001', 'OH-DIS-2025-001', 'OH', 'Ohio', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '4800 E Broad St', 'Whitehall', 'OH', '43213', '4800 E Broad St', 'Whitehall', 'OH', '43213', 'Sharon Mitchell', 'sharon.mitchell@risecannabis.com', '614-555-0601', 'Net 30', 150000.00, 267000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Lakewood LLC', 'RISE Lakewood', 'GTI-OH-002', 'OH-DIS-2025-002', 'OH', 'Ohio', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '14583 Madison Ave', 'Lakewood', 'OH', '44107', '14583 Madison Ave', 'Lakewood', 'OH', '44107', 'Eric Perez', 'eric.perez@risecannabis.com', '216-555-0602', 'Net 30', 150000.00, 245000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Toledo LLC', 'RISE Toledo', 'GTI-OH-003', 'OH-DIS-2025-003', 'OH', 'Ohio', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '3550 Executive Pkwy', 'Toledo', 'OH', '43606', '3550 Executive Pkwy', 'Toledo', 'OH', '43606', 'Cynthia Roberts', 'cynthia.roberts@risecannabis.com', '419-555-0603', 'Net 30', 100000.00, 178000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Bloomfield LLC', 'RISE Bloomfield CT', 'GTI-CT-001', 'CT-DCP-2025-001', 'CT', 'Connecticut', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1 Tunxis Ave', 'Bloomfield', 'CT', '06002', '1 Tunxis Ave', 'Bloomfield', 'CT', '06002', 'Angela Turner', 'angela.turner@risecannabis.com', '860-555-0701', 'Net 30', 150000.00, 234000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Stamford LLC', 'RISE Stamford', 'GTI-CT-002', 'CT-DCP-2025-002', 'CT', 'Connecticut', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '1055 Washington Blvd', 'Stamford', 'CT', '06901', '1055 Washington Blvd', 'Stamford', 'CT', '06901', 'Timothy Phillips', 'timothy.phillips@risecannabis.com', '203-555-0702', 'Net 30', 150000.00, 256000.00, 'active', '2026-12-31', NOW(), NOW());

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
  (gen_random_uuid(), 'RISE Dispensary Syracuse LLC', 'RISE Syracuse', 'GTI-NY-001', 'NY-OCM-2025-001', 'NY', 'New York', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', '2801 Erie Blvd E', 'Syracuse', 'NY', '13224', 'Rebecca Campbell', 'rebecca.campbell@risecannabis.com', '315-555-0801', 'Net 30', 150000.00, 278000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary Binghamton LLC', 'RISE Binghamton', 'GTI-NY-002', 'NY-OCM-2025-002', 'NY', 'New York', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1 Glendale Dr', 'Binghamton', 'NY', '13905', '1 Glendale Dr', 'Binghamton', 'NY', '13905', 'Gregory Parker', 'gregory.parker@risecannabis.com', '607-555-0802', 'Net 30', 100000.00, 189000.00, 'active', '2026-12-31', NOW(), NOW());

-- Minnesota Dispensaries (2)
INSERT INTO customers (
  id, business_legal_name, dba_name, account_number, cannabis_license_number, 
  license_state, market, tier, customer_type, business_type, industry,
  shipping_address, shipping_city, shipping_state, shipping_zip_code,
  billing_address, billing_city, billing_state, billing_zip_code,
  primary_contact_name, primary_contact_email, primary_contact_phone,
  payment_terms, credit_limit, total_purchases, status, 
  license_expiration_date, created_at, updated_at
) VALUES
  (gen_random_uuid(), 'RISE Dispensary Minneapolis LLC', 'RISE Minneapolis', 'GTI-MN-001', 'MN-OCM-2025-001', 'MN', 'Minnesota', 'Premium', 'Retail', 'Dispensary', 'Cannabis Retail', '2801 Hennepin Ave', 'Minneapolis', 'MN', '55408', '2801 Hennepin Ave', 'Minneapolis', 'MN', '55408', 'Stephanie Evans', 'stephanie.evans@risecannabis.com', '612-555-0901', 'Net 30', 150000.00, 298000.00, 'active', '2026-12-31', NOW(), NOW()),
  (gen_random_uuid(), 'RISE Dispensary St. Paul LLC', 'RISE St. Paul', 'GTI-MN-002', 'MN-OCM-2025-002', 'MN', 'Minnesota', 'Standard', 'Retail', 'Dispensary', 'Cannabis Retail', '1515 University Ave W', 'St. Paul', 'MN', '55104', '1515 University Ave W', 'St. Paul', 'MN', '55104', 'Jeremy Collins', 'jeremy.collins@risecannabis.com', '651-555-0902', 'Net 30', 100000.00, 212000.00, 'active', '2026-12-31', NOW(), NOW());
