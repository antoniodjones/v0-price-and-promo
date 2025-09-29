-- Adding realistic customer data for testing
INSERT INTO customers (name, email, tier, market, status, phone, address, city, state, zip_code, created_at, updated_at) VALUES
-- Tier 1 Customers (Premium)
('Green Leaf Dispensary', 'orders@greenleaf.com', 'Tier 1', 'California', 'active', '555-0101', '123 Main St', 'Los Angeles', 'CA', '90210', NOW(), NOW()),
('Premium Cannabis Co', 'purchasing@premiumcannabis.com', 'Tier 1', 'California', 'active', '555-0102', '456 Oak Ave', 'San Francisco', 'CA', '94102', NOW(), NOW()),
('Elite Wellness Center', 'buyer@elitewellness.com', 'Tier 1', 'Nevada', 'active', '555-0103', '789 Pine St', 'Las Vegas', 'NV', '89101', NOW(), NOW()),
('Top Shelf Collective', 'orders@topshelf.com', 'Tier 1', 'Colorado', 'active', '555-0104', '321 Elm St', 'Denver', 'CO', '80202', NOW(), NOW()),
('High Quality Herbs', 'purchasing@hqherbs.com', 'Tier 1', 'Oregon', 'active', '555-0105', '654 Maple Dr', 'Portland', 'OR', '97201', NOW(), NOW()),

-- Tier 2 Customers (Standard)
('City Cannabis', 'orders@citycannabis.com', 'Tier 2', 'California', 'active', '555-0201', '111 First St', 'Sacramento', 'CA', '95814', NOW(), NOW()),
('Valley Verde', 'buyer@valleverde.com', 'Tier 2', 'California', 'active', '555-0202', '222 Second Ave', 'Fresno', 'CA', '93701', NOW(), NOW()),
('Desert Bloom Dispensary', 'orders@desertbloom.com', 'Tier 2', 'Arizona', 'active', '555-0203', '333 Third St', 'Phoenix', 'AZ', '85001', NOW(), NOW()),
('Mountain High Cannabis', 'purchasing@mountainhigh.com', 'Tier 2', 'Colorado', 'active', '555-0204', '444 Fourth Ave', 'Boulder', 'CO', '80301', NOW(), NOW()),
('Pacific Coast Collective', 'orders@pacificcoast.com', 'Tier 2', 'Washington', 'active', '555-0205', '555 Fifth St', 'Seattle', 'WA', '98101', NOW(), NOW()),
('Sunshine State Cannabis', 'buyer@sunshinestate.com', 'Tier 2', 'Florida', 'active', '555-0206', '666 Sixth Ave', 'Miami', 'FL', '33101', NOW(), NOW()),
('Garden State Green', 'orders@gardenstate.com', 'Tier 2', 'New Jersey', 'active', '555-0207', '777 Seventh St', 'Newark', 'NJ', '07102', NOW(), NOW()),

-- Tier 3 Customers (Basic)
('Neighborhood Dispensary', 'orders@neighborhood.com', 'Tier 3', 'California', 'active', '555-0301', '888 Eighth Ave', 'San Diego', 'CA', '92101', NOW(), NOW()),
('Local Leaf', 'buyer@localleaf.com', 'Tier 3', 'Oregon', 'active', '555-0302', '999 Ninth St', 'Eugene', 'OR', '97401', NOW(), NOW()),
('Community Cannabis', 'orders@communitycannabis.com', 'Tier 3', 'Washington', 'active', '555-0303', '101 Tenth Ave', 'Spokane', 'WA', '99201', NOW(), NOW()),
('Budget Buds', 'purchasing@budgetbuds.com', 'Tier 3', 'Nevada', 'active', '555-0304', '202 Eleventh St', 'Reno', 'NV', '89501', NOW(), NOW()),
('Value Verde', 'orders@valueverde.com', 'Tier 3', 'Colorado', 'active', '555-0305', '303 Twelfth Ave', 'Colorado Springs', 'CO', '80903', NOW(), NOW()),
('Affordable Alternatives', 'buyer@affordable.com', 'Tier 3', 'Arizona', 'active', '555-0306', '404 Thirteenth St', 'Tucson', 'AZ', '85701', NOW(), NOW()),

-- Some Inactive Customers for testing
('Former Customer LLC', 'old@formercustomer.com', 'Tier 2', 'California', 'inactive', '555-0401', '505 Old St', 'Oakland', 'CA', '94601', NOW(), NOW()),
('Closed Shop', 'closed@shop.com', 'Tier 3', 'Nevada', 'inactive', '555-0402', '606 Closed Ave', 'Henderson', 'NV', '89002', NOW(), NOW());
