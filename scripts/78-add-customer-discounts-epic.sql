-- Add Customer Discounts Epic User Stories
-- Generated: January 2025
-- Epic: Customer Discounts
-- Stories: 6
-- Priority: Critical (MVP Phase 1)
-- Gap: 50% (Some existing documentation, missing detailed scenarios)

INSERT INTO user_stories (
  id,
  title,
  description,
  user_type,
  goal,
  reason,
  status,
  priority,
  story_points,
  epic,
  acceptance_criteria,
  technical_notes,
  related_files,
  related_components,
  dependencies,
  created_at,
  updated_at
) VALUES

-- CUST-001: Create Customer-Specific Discount Rule
('CUST-001',
'Create Customer-Specific Discount Rule',
'This feature allows pricing managers to create discount rules targeted to specific customers or customer groups. The system supports percentage and dollar-amount discounts at the item, brand, or category level. Customer assignments can be managed individually or in bulk, and the wizard guides users through scope selection, discount configuration, and customer assignment.',
'Pricing Manager',
'I want to create customer-specific discount rules',
'So that I can provide personalized pricing to key accounts and reward loyal customers',
'Done',
'Critical',
8,
'Customer Discounts',
'Scenario 1: Create Item-Level Customer Discount
Given I am logged in as a pricing manager
And I navigate to the Customer Discounts page
When I click "Create New Discount"
And I select "Item Level" as the scope
And I select "Product A" as the target product
And I select "Percentage" as the discount type
And I enter "15" as the discount value
And I assign "Customer X" to this discount
And I set the start date to today
And I leave the end date blank
And I enter "VIP Customer A Discount" as the rule name
And I click "Create Discount"
Then the discount rule is created successfully
And Customer X receives 15% off Product A
And other customers do not receive this discount

Scenario 2: Create Brand-Level Customer Discount
Given I am creating a customer discount
And I select "Brand Level" as the scope
And I select "Incredibles" as the target brand
And I select "Percentage" as the discount type
And I enter "10" as the discount value
And I assign multiple customers: Customer X, Customer Y, Customer Z
When I create the discount
Then all three customers receive 10% off all Incredibles products
And the discount applies automatically at checkout

Scenario 3: Create Category-Level Customer Discount
Given I am creating a customer discount
And I select "Category Level" as the scope
And I select "Edibles" as the target category
And I select "Dollar Amount" as the discount type
And I enter "5" as the discount value ($ off per unit)
When I create the discount
Then assigned customers receive $5 off each Edibles product

Scenario 4: Validation - Missing Customer Assignment
Given I am creating a customer discount
When I complete all fields except customer assignment
And I click "Create Discount"
Then I see an error message "At least one customer must be assigned"
And the discount is not created

Scenario 5: Automatic Discount Application
Given a customer discount exists for Customer X: 15% off Product A
And Customer X logs in and adds Product A to their cart
When the pricing engine calculates the cart total
Then the 15% discount is automatically applied
And the discount reason shows "Customer Discount: VIP Customer A Discount"',
'API Endpoints:
- POST /api/discounts/customer - Create customer discount
- GET /api/discounts/customer - List customer discounts
- PUT /api/discounts/customer/[id] - Update customer discount
- DELETE /api/discounts/customer/[id] - Delete customer discount

Database Tables:
- customer_discounts - Stores discount rules
- customer_discount_assignments - Maps customers to discounts

Pricing Engine Integration:
- lib/pricing/engine.ts - applyCustomerDiscounts() method
- Customer eligibility validation
- Scope-based product matching',
ARRAY[
  'app/customer-discounts/new/page.tsx',
  'app/customer-discounts/page.tsx',
  'components/customer-discounts/customer-discount-wizard.tsx',
  'components/customer-discounts/wizard-steps/discount-scope-step.tsx',
  'components/customer-discounts/wizard-steps/discount-value-step.tsx',
  'components/customer-discounts/wizard-steps/customer-assignment-step.tsx',
  'components/customer-discounts/wizard-steps/discount-dates-step.tsx',
  'app/api/discounts/customer/route.ts',
  'lib/pricing/engine.ts'
],
ARRAY[
  'CustomerDiscountWizard',
  'DiscountScopeStep',
  'DiscountValueStep',
  'CustomerAssignmentStep',
  'DiscountDatesStep'
],
'Customer Management, Pricing Engine',
NOW(),
NOW()),

-- CUST-002: Bulk Customer Assignment
('CUST-002',
'Bulk Customer Assignment to Discount Rules',
'This feature allows pricing managers to assign multiple customers to a discount rule at once using CSV upload or multi-select interface. The system validates customer IDs, prevents duplicate assignments, and provides a summary of successful and failed assignments.',
'Pricing Manager',
'I want to assign multiple customers to a discount rule at once',
'So that I can efficiently manage large customer groups without manual one-by-one assignment',
'Done',
'High',
5,
'Customer Discounts',
'Scenario 1: Bulk Assignment via Multi-Select
Given I am editing a customer discount rule
And I navigate to the customer assignment step
When I click "Bulk Assign"
And I select 50 customers from the customer list
And I click "Assign Selected"
Then all 50 customers are assigned to the discount rule
And I see a success message "50 customers assigned successfully"

Scenario 2: Bulk Assignment via CSV Upload
Given I have a CSV file with 100 customer IDs
And I am editing a customer discount rule
When I click "Upload CSV"
And I select my CSV file
And I click "Import"
Then the system validates all customer IDs
And assigns valid customers to the discount rule
And shows a summary: "95 customers assigned, 5 failed (invalid IDs)"

Scenario 3: Prevent Duplicate Assignments
Given Customer X is already assigned to a discount rule
When I try to assign Customer X again via bulk assignment
Then the system skips the duplicate
And shows a warning "1 customer skipped (already assigned)"',
'API Endpoints:
- POST /api/discounts/customer/[id]/assignments/bulk - Bulk assign customers
- POST /api/discounts/customer/[id]/assignments/csv - CSV upload

Validation:
- Validate customer IDs exist
- Check for duplicate assignments
- Provide detailed error reporting',
ARRAY[
  'components/customer-discounts/bulk-assignment-modal.tsx',
  'components/customer-discounts/csv-upload.tsx',
  'app/api/discounts/customer/[id]/assignments/bulk/route.ts'
],
ARRAY[
  'BulkAssignmentModal',
  'CsvUpload',
  'CustomerMultiSelect'
],
'CUST-001, Customer Management',
NOW(),
NOW()),

-- CUST-003: View Customer Discount Assignments
('CUST-003',
'View Customer Discount Assignments',
'This feature provides pricing managers with a comprehensive view of all customer discount assignments. The interface shows which customers are assigned to which discount rules, allows filtering and searching, and provides quick access to edit or remove assignments.',
'Pricing Manager',
'I want to view all customer discount assignments',
'So that I can understand which customers have which discounts and manage assignments effectively',
'Done',
'High',
3,
'Customer Discounts',
'Scenario 1: View All Assignments for a Discount Rule
Given I am viewing a customer discount rule
When I click "View Assignments"
Then I see a list of all customers assigned to this rule
And each customer shows: name, ID, assignment date, status
And I can search and filter the customer list

Scenario 2: View All Discounts for a Customer
Given I am viewing a customer profile
When I navigate to the "Discounts" tab
Then I see all discount rules assigned to this customer
And each discount shows: rule name, scope, discount value, date range
And I can see which discounts are currently active

Scenario 3: Remove Customer Assignment
Given I am viewing customer assignments for a discount rule
When I click "Remove" next to Customer X
And I confirm the removal
Then Customer X is removed from the discount rule
And no longer receives the discount',
'API Endpoints:
- GET /api/discounts/customer/[id]/assignments - Get assignments for a rule
- GET /api/customers/[id]/discounts - Get discounts for a customer
- DELETE /api/discounts/customer/[id]/assignments/[customerId] - Remove assignment

UI Components:
- Assignment list with search and filter
- Customer profile discount tab
- Quick remove functionality',
ARRAY[
  'app/customer-discounts/page.tsx',
  'components/customer-discounts/customer-discounts-list.tsx',
  'components/customer-discounts/assignment-list.tsx',
  'app/customers/[id]/page.tsx',
  'app/api/discounts/customer/[id]/assignments/route.ts'
],
ARRAY[
  'CustomerDiscountsList',
  'AssignmentList',
  'CustomerProfile'
],
'CUST-001, Customer Management',
NOW(),
NOW()),

-- CUST-004: Customer Discount Analytics
('CUST-004',
'Customer Discount Analytics',
'This feature provides pricing managers with detailed analytics on customer discount performance, including usage rates, revenue impact, customer participation, and discount effectiveness. The dashboard helps identify which customer discounts are driving the most value and which customers are most engaged.',
'Pricing Manager',
'I want to view customer discount analytics',
'So that I can understand discount effectiveness and optimize customer pricing strategies',
'Done',
'High',
5,
'Customer Discounts',
'Scenario 1: View Discount Usage Dashboard
Given I am logged in as a pricing manager
And I navigate to the Analytics page
When I select "Customer Discounts" as the analytics type
Then I see a dashboard showing: total discounts, active customers, revenue impact
And I see charts of discount usage over time
And I can filter by date range and discount rule

Scenario 2: View Top Performing Discounts
Given I am viewing customer discount analytics
When I sort by "Revenue Impact"
Then I see which customer discounts generated the most revenue
And I can identify the most valuable discount rules

Scenario 3: View Customer Engagement
Given I am viewing analytics for a specific discount rule
When I view the customer engagement metrics
Then I see: total assigned customers, active users, usage rate
And I can identify which customers are using their discounts most',
'API Endpoints:
- GET /api/analytics/discounts/customer - Get customer discount analytics
- GET /api/analytics/discounts/customer/[id] - Get analytics for specific rule

Metrics Calculated:
- Total discount value given
- Revenue with vs without discount
- Customer usage rate
- Average order value with discount
- Customer lifetime value impact',
ARRAY[
  'app/analytics/page.tsx',
  'components/analytics/discount-analytics.tsx',
  'components/analytics/customer-engagement.tsx',
  'app/api/analytics/discounts/customer/route.ts'
],
ARRAY[
  'DiscountAnalytics',
  'CustomerEngagement',
  'RevenueImpactChart'
],
'CUST-001, Analytics Dashboard',
NOW(),
NOW()),

-- CUST-005: Customer Tier Management
('CUST-005',
'Customer Tier Management (A/B/C Tiers)',
'This feature allows pricing managers to assign customers to tiers (A, B, C) for use in tiered discount rules. The system supports bulk tier assignment, tier migration, and provides analytics on tier distribution and performance. Customer tiers can be used across multiple discount rules.',
'Pricing Manager',
'I want to manage customer tier assignments',
'So that I can segment customers and provide differentiated pricing based on customer value',
'Done',
'High',
8,
'Customer Discounts',
'Scenario 1: Assign Customer to Tier
Given I am viewing a customer profile
When I click "Assign Tier"
And I select "Tier A" from the dropdown
And I click "Save"
Then the customer is assigned to Tier A
And receives Tier A pricing on all applicable discount rules

Scenario 2: Bulk Tier Assignment
Given I have a list of 100 customers
When I select all 100 customers
And I click "Bulk Assign Tier"
And I select "Tier B"
And I confirm the assignment
Then all 100 customers are assigned to Tier B
And I see a success message "100 customers assigned to Tier B"

Scenario 3: View Tier Distribution
Given I am viewing customer tier analytics
When I view the tier distribution chart
Then I see how many customers are in each tier (A, B, C)
And I can see tier migration trends over time

Scenario 4: Tier-Based Pricing Application
Given Customer X is assigned to Tier A
And a discount rule has different pricing for each tier: A=10%, B=7%, C=5%
When Customer X makes a purchase
Then they receive the 10% Tier A discount
And not the Tier B or C discount',
'API Endpoints:
- POST /api/customers/[id]/tier - Assign customer to tier
- POST /api/customers/tiers/bulk - Bulk tier assignment
- GET /api/customers/tiers - Get tier distribution

Database Tables:
- customer_tier_assignments - Maps customers to tiers per rule

Pricing Engine Integration:
- lib/pricing/engine.ts - getCustomerTier() method
- Tier-based discount calculation',
ARRAY[
  'app/customers/tiers/page.tsx',
  'components/customers/tier-assignment.tsx',
  'components/customers/bulk-tier-assignment.tsx',
  'app/api/customers/[id]/tier/route.ts',
  'app/api/customers/tiers/bulk/route.ts',
  'lib/pricing/engine.ts'
],
ARRAY[
  'TierAssignment',
  'BulkTierAssignment',
  'TierDistributionChart'
],
'CUST-001, Customer Management',
NOW(),
NOW()),

-- CUST-006: Customer Discount Conflict Resolution
('CUST-006',
'Customer Discount Conflict Resolution',
'This feature handles scenarios where a customer is eligible for multiple discount rules on the same product. The system provides configurable conflict resolution strategies (best for customer, best for business, first created, etc.) and clearly communicates which discount was applied and why.',
'Pricing Manager',
'I want to configure how discount conflicts are resolved',
'So that the system automatically selects the best discount when multiple rules apply to the same customer and product',
'Done',
'Medium',
5,
'Customer Discounts',
'Scenario 1: Best for Customer Strategy
Given Customer X has two applicable discounts: 15% off and $5 off
And the conflict resolution strategy is "Best for Customer"
And the product costs $40
When the pricing engine calculates the price
Then the system calculates: 15% off = $6 savings, $5 off = $5 savings
And applies the 15% discount (higher savings)
And shows "Applied: 15% discount (best value for you)"

Scenario 2: Best for Business Strategy
Given Customer X has two applicable discounts: 15% off and $5 off
And the conflict resolution strategy is "Best for Business"
When the pricing engine calculates the price
Then the system applies the $5 discount (lower cost to business)
And shows "Applied: $5 discount"

Scenario 3: Explicit Priority Configuration
Given I am creating a customer discount rule
When I set the priority to "High"
And another rule has priority "Medium"
Then the High priority rule is applied when conflicts occur
And the Medium priority rule is ignored',
'API Endpoints:
- GET /api/settings/discount-strategy - Get conflict resolution strategy
- PUT /api/settings/discount-strategy - Update strategy

Pricing Engine Logic:
- lib/pricing/engine.ts - resolveDiscountConflicts() method
- Calculate value of each applicable discount
- Apply configured strategy
- Log which discount was selected and why',
ARRAY[
  'app/settings/page.tsx',
  'components/settings/discount-strategy.tsx',
  'lib/pricing/engine.ts'
],
ARRAY[
  'DiscountStrategySettings',
  'ConflictResolutionSelector'
],
'CUST-001, Pricing Engine',
NOW(),
NOW());

-- Verification
SELECT 'Total Customer Discounts stories:' as info, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Customer Discounts';

SELECT 'Customer Discounts stories by priority:' as info, priority, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Customer Discounts'
GROUP BY priority
ORDER BY 
  CASE priority 
    WHEN 'Critical' THEN 1 
    WHEN 'High' THEN 2 
    WHEN 'Medium' THEN 3 
    WHEN 'Low' THEN 4 
  END;
