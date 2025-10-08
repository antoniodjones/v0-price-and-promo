-- ============================================================================
-- Add Inventory Discounts Epic and User Stories
-- Epic: Inventory Discounts
-- Priority: Critical (MVP Priority #2)
-- Gap Analysis: 70% documentation gap - feature is 100% built but lacks stories
-- ============================================================================

-- Insert Inventory Discounts user stories
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
  story_type,
  created_by,
  updated_by,
  created_at,
  updated_at
) VALUES

-- Story INV-001: Create Expiration-Based Automatic Discount Rule
('INV-001', 
'Create Expiration-Based Automatic Discount Rule', 
'This feature allows pricing managers to configure automatic discounts that trigger when products approach their expiration date. The system monitors product batches in real-time and automatically applies the configured discount when the expiration threshold is met. This is critical for cannabis wholesale operations where product freshness is paramount and regulatory compliance requires proper inventory management.',
'Pricing Manager',
'create automatic discount rules based on product expiration dates',
'I can liquidate aging inventory before it expires and minimize waste',
'Done',
'Critical',
8,
'Inventory Discounts',
'Scenario 1: Create Global Expiration-Based Discount Rule
Given I am logged in as a pricing manager
And I navigate to the Inventory Discounts page
When I click "Create New Discount"
And I select "Expiration Date" as the discount trigger
And I select "Global Rule" as the scope
And I enter "30" days as the expiration threshold
And I select "Percentage" as the discount type
And I enter "15" as the discount value
And I set the start date to today
And I leave the end date blank
And I enter "30-Day Expiration Discount" as the rule name
And I click "Create Discount"
Then the discount rule is created successfully
And I see a success message "Discount rule created successfully"
And the rule appears in the active discounts list
And the rule status is "Active"

Scenario 2: Create Brand-Specific Expiration Discount
Given I am logged in as a pricing manager
And I navigate to the Inventory Discounts page
When I click "Create New Discount"
And I select "Expiration Date" as the discount trigger
And I select "Brand Level" as the scope
And I select "Incredibles" as the brand
And I enter "14" days as the expiration threshold
And I select "Percentage" as the discount type
And I enter "25" as the discount value
And I set the start date to today
And I set the end date to 90 days from today
And I enter "Incredibles 14-Day Clearance" as the rule name
And I click "Create Discount"
Then the discount rule is created successfully
And the rule applies only to Incredibles brand products
And products from other brands are not affected

Scenario 3: Automatic Discount Application
Given an active expiration-based discount rule exists
And the rule triggers at 30 days before expiration
And the rule applies a 15% discount
And a product batch has an expiration date of 25 days from today
When the pricing engine calculates the price for this product
Then the 15% expiration discount is automatically applied
And the discount reason shows "Expiration: 25 days remaining"
And the original price and discounted price are both displayed
And the discount is logged in the audit trail

Scenario 4: Validation - Invalid Expiration Threshold
Given I am creating an expiration-based discount rule
When I enter "0" days as the expiration threshold
And I click "Create Discount"
Then I see an error message "Expiration threshold must be at least 1 day"
And the discount rule is not created

Scenario 5: Batch-Level Attribute Support
Given I have two batches of the same product
And Batch A expires in 10 days
And Batch B expires in 60 days
And an expiration discount rule triggers at 30 days
When the pricing engine calculates prices
Then Batch A receives the expiration discount
And Batch B does not receive the expiration discount
And each batch is priced independently based on its expiration date',
'API Endpoints:
- POST /api/discounts/inventory - Create discount rule
- GET /api/discounts/inventory - List discount rules
- PUT /api/discounts/inventory/[id] - Update discount rule
- DELETE /api/discounts/inventory/[id] - Delete discount rule

Database Tables:
- inventory_discounts - Stores discount rules
- products - Contains batch-level expiration dates
- audit_logs - Tracks discount applications

Pricing Engine Integration:
- lib/pricing/engine.ts - applyInventoryDiscounts() method
- Real-time batch attribute lookup
- Date calculation logic',
ARRAY[
  'app/inventory-discounts/new/page.tsx',
  'components/inventory-discounts/inventory-discount-wizard.tsx',
  'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx',
  'components/inventory-discounts/wizard-steps/discount-scope-step.tsx',
  'components/inventory-discounts/wizard-steps/discount-value-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'InventoryDiscountWizard',
  'DiscountTriggerStep',
  'DiscountScopeStep',
  'DiscountValueStep',
  'DiscountDatesStep',
  'InventoryMonitoring'
],
'Product Management (batch tracking), Pricing Engine (discount calculation), Audit Logging (compliance tracking)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-002: Create THC Percentage-Based Automatic Discount Rule
('INV-002',
'Create THC Percentage-Based Automatic Discount Rule',
'This feature allows pricing managers to configure automatic discounts based on THC percentage thresholds. Products with THC levels above or below specified thresholds automatically receive discounts. This is useful for moving high-THC products that may have limited customer appeal or promoting lower-THC products for specific market segments.',
'Pricing Manager',
'create automatic discount rules based on THC percentage thresholds',
'I can optimize inventory turnover based on product potency and market demand',
'Done',
'Critical',
8,
'Inventory Discounts',
'Scenario 1: Create High-THC Discount Rule
Given I am logged in as a pricing manager
And I navigate to the Inventory Discounts page
When I click "Create New Discount"
And I select "THC Percentage" as the discount trigger
And I select "Above Threshold" as the condition
And I enter "30" as the THC percentage threshold
And I select "Percentage" as the discount type
And I enter "10" as the discount value
And I select "Global Rule" as the scope
And I enter "High-THC Clearance" as the rule name
And I click "Create Discount"
Then the discount rule is created successfully
And products with THC > 30% will receive the discount

Scenario 2: Automatic THC-Based Discount Application
Given an active THC-based discount rule exists
And the rule triggers for THC > 30%
And the rule applies a 10% discount
And a product has a THC percentage of 35%
When the pricing engine calculates the price for this product
Then the 10% THC discount is automatically applied
And the discount reason shows "High THC: 35%"
And the discount is logged in the audit trail

Scenario 3: Category-Specific THC Discount
Given I am creating a THC-based discount rule
And I select "Category Level" as the scope
And I select "Flower" as the category
And I set THC threshold to 25%
When I create the rule
Then the rule applies only to Flower category products
And other categories are not affected',
'API Endpoints:
- POST /api/discounts/inventory - Create THC-based rule
- GET /api/discounts/inventory - List rules

Database Tables:
- inventory_discounts - Stores THC-based rules
- products - Contains THC percentage data

Pricing Engine Integration:
- lib/pricing/engine.ts - applyInventoryDiscounts() method
- THC percentage comparison logic',
ARRAY[
  'app/inventory-discounts/new/page.tsx',
  'components/inventory-discounts/inventory-discount-wizard.tsx',
  'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'InventoryDiscountWizard',
  'DiscountTriggerStep',
  'DiscountValueStep'
],
'Product Management (THC tracking), Pricing Engine (discount calculation)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-003: Configure Multi-Level Inventory Discount Scope
('INV-003',
'Configure Multi-Level Inventory Discount Scope',
'This feature allows pricing managers to apply inventory discounts at different hierarchy levels: Global (all products), Brand (specific brand), Category (specific category), or Item (specific product). This provides flexibility in targeting discounts to specific inventory segments.',
'Pricing Manager',
'apply inventory discounts at different hierarchy levels',
'I can target discounts precisely to specific inventory segments that need liquidation',
'Done',
'High',
5,
'Inventory Discounts',
'Scenario 1: Create Global Inventory Discount
Given I am creating an inventory discount rule
When I select "Global Rule" as the scope
And I complete the discount configuration
Then the discount applies to all products in inventory
And no scope filtering is applied

Scenario 2: Create Brand-Level Inventory Discount
Given I am creating an inventory discount rule
When I select "Brand Level" as the scope
And I select "Wana" as the brand
And I complete the discount configuration
Then the discount applies only to Wana brand products
And other brands are excluded

Scenario 3: Create Category-Level Inventory Discount
Given I am creating an inventory discount rule
When I select "Category Level" as the scope
And I select "Edibles" as the category
And I complete the discount configuration
Then the discount applies only to Edibles category products
And other categories are excluded

Scenario 4: Create Item-Level Inventory Discount
Given I am creating an inventory discount rule
When I select "Item Level" as the scope
And I select a specific product SKU
And I complete the discount configuration
Then the discount applies only to that specific product
And other products are excluded',
'API Endpoints:
- POST /api/discounts/inventory - Create scoped rule

Database Tables:
- inventory_discounts - Stores scope configuration (scope, scope_value fields)

Pricing Engine Integration:
- lib/pricing/engine.ts - Scope filtering logic',
ARRAY[
  'components/inventory-discounts/wizard-steps/discount-scope-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'DiscountScopeStep',
  'ScopeSelector'
],
'Product Management (hierarchy data)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-004: Monitor Real-Time Inventory Discount Application
('INV-004',
'Monitor Real-Time Inventory Discount Application',
'This feature provides real-time monitoring of inventory discount application. Pricing managers can see which products currently have inventory discounts applied, why they were applied, and the impact on pricing. This visibility is critical for inventory management and compliance.',
'Pricing Manager',
'monitor real-time inventory discount application',
'I can track which products have automatic discounts and ensure proper inventory liquidation',
'Done',
'High',
5,
'Inventory Discounts',
'Scenario 1: View Active Inventory Discounts
Given I am logged in as a pricing manager
And I navigate to the Inventory Discounts page
When I view the "Active Discounts" section
Then I see a list of all active inventory discount rules
And each rule shows the trigger type, scope, and discount value
And I can see how many products are currently affected

Scenario 2: View Products with Applied Discounts
Given I am viewing the inventory monitoring dashboard
When I filter by "Discounted Products"
Then I see all products with active inventory discounts
And each product shows the discount reason (expiration or THC)
And I can see the original price and discounted price
And I can see the days until expiration or THC percentage

Scenario 3: Real-Time Discount Updates
Given a product batch is 31 days from expiration
And an expiration discount rule triggers at 30 days
When the product reaches 30 days from expiration
Then the discount is automatically applied
And the product appears in the discounted products list
And the pricing engine uses the discounted price',
'API Endpoints:
- GET /api/discounts/inventory - List active rules
- GET /api/discounts/inventory/monitoring - Get real-time discount data

Database Tables:
- inventory_discounts - Active rules
- products - Product data with batch attributes

Components:
- InventoryMonitoring component provides real-time dashboard',
ARRAY[
  'app/inventory-discounts/page.tsx',
  'components/inventory-discounts/inventory-monitoring.tsx',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'InventoryMonitoring',
  'InventoryDiscountsList',
  'DiscountedProductsTable'
],
'Pricing Engine (real-time calculation)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-005: View Automated Discount History
('INV-005',
'View Automated Discount History',
'This feature provides a historical view of all inventory discounts that have been automatically applied. Pricing managers can audit discount application, track inventory liquidation effectiveness, and generate compliance reports.',
'Pricing Manager',
'view historical data on automated inventory discounts',
'I can audit discount application and measure inventory liquidation effectiveness',
'Done',
'Medium',
3,
'Inventory Discounts',
'Scenario 1: View Discount Application History
Given I am logged in as a pricing manager
And I navigate to the Inventory Discounts page
When I click on "Discount History"
Then I see a chronological list of all discount applications
And each entry shows the product, discount type, amount, and date applied
And I can filter by date range, product, or discount type

Scenario 2: Generate Discount Audit Report
Given I am viewing the discount history
When I select a date range
And I click "Export Report"
Then a CSV file is generated with all discount applications
And the report includes product details, discount reasons, and amounts
And the report is suitable for compliance auditing',
'API Endpoints:
- GET /api/discounts/inventory/history - Get historical data
- GET /api/discounts/inventory/audit - Generate audit report

Database Tables:
- audit_logs - Tracks all discount applications',
ARRAY[
  'app/inventory-discounts/page.tsx',
  'components/inventory-discounts/discount-history.tsx',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'DiscountHistory',
  'AuditReportGenerator'
],
'Audit Logging (historical data)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-006: Set Up Expiration Date Monitoring Thresholds
('INV-006',
'Set Up Expiration Date Monitoring Thresholds',
'This feature allows pricing managers to configure multiple expiration date thresholds with different discount levels. For example, 30 days = 10% off, 14 days = 20% off, 7 days = 30% off. This creates a graduated discount structure that increases urgency as expiration approaches.',
'Pricing Manager',
'configure multiple expiration thresholds with graduated discounts',
'I can create urgency-based pricing that maximizes revenue while minimizing waste',
'Done',
'Medium',
5,
'Inventory Discounts',
'Scenario 1: Create Multi-Tier Expiration Discount
Given I am creating an expiration-based discount rule
When I add Tier 1: 30 days = 10% discount
And I add Tier 2: 14 days = 20% discount
And I add Tier 3: 7 days = 30% discount
And I create the rule
Then products automatically move through discount tiers as expiration approaches
And the highest applicable discount is always applied

Scenario 2: Graduated Discount Application
Given a multi-tier expiration discount rule exists
And a product is 15 days from expiration
When the pricing engine calculates the price
Then the 20% discount (Tier 2) is applied
And not the 10% discount (Tier 1)
And the discount reason shows "Expiration: 15 days remaining (Tier 2)"',
'API Endpoints:
- POST /api/discounts/inventory - Create multi-tier rule

Database Tables:
- inventory_discounts - Stores tier configuration in metadata

Pricing Engine Integration:
- lib/pricing/engine.ts - Multi-tier evaluation logic',
ARRAY[
  'components/inventory-discounts/wizard-steps/discount-value-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'DiscountValueStep',
  'TierConfigurationTable'
],
'Pricing Engine (tier evaluation)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-007: Manage THC Percentage Discount Triggers
('INV-007',
'Manage THC Percentage Discount Triggers',
'This feature allows pricing managers to configure THC percentage discount triggers with both "above threshold" and "below threshold" conditions. This enables discounting of both high-THC products (for limited markets) and low-THC products (for specific customer segments).',
'Pricing Manager',
'configure THC percentage discount triggers with flexible conditions',
'I can optimize pricing for different THC potency levels based on market demand',
'Done',
'Medium',
3,
'Inventory Discounts',
'Scenario 1: Create Above-Threshold THC Discount
Given I am creating a THC-based discount rule
When I select "Above Threshold" as the condition
And I enter "30" as the THC percentage
And I set a 10% discount
Then products with THC > 30% receive the discount

Scenario 2: Create Below-Threshold THC Discount
Given I am creating a THC-based discount rule
When I select "Below Threshold" as the condition
And I enter "10" as the THC percentage
And I set a 5% discount
Then products with THC < 10% receive the discount',
'API Endpoints:
- POST /api/discounts/inventory - Create THC rule with condition

Database Tables:
- inventory_discounts - Stores THC condition (trigger_value field)

Pricing Engine Integration:
- lib/pricing/engine.ts - THC comparison logic (>, <)',
ARRAY[
  'components/inventory-discounts/wizard-steps/discount-trigger-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/discounts/inventory/route.ts'
],
ARRAY[
  'DiscountTriggerStep',
  'THCConditionSelector'
],
'Pricing Engine (THC evaluation)',
'Feature',
'system',
'system',
NOW(),
NOW()),

-- Story INV-008: Manage Inventory Discount Lifecycle
('INV-008',
'Manage Inventory Discount Lifecycle',
'This feature allows pricing managers to create, edit, activate, deactivate, and delete inventory discount rules. Full lifecycle management ensures pricing managers can respond quickly to changing inventory conditions.',
'Pricing Manager',
'manage the complete lifecycle of inventory discount rules',
'I can quickly respond to changing inventory conditions and business needs',
'Done',
'High',
5,
'Inventory Discounts',
'Scenario 1: Edit Existing Discount Rule
Given I am viewing the inventory discounts list
And I click "Edit" on an existing rule
When I change the expiration threshold from 30 to 21 days
And I click "Save Changes"
Then the rule is updated
And the new threshold applies to all future discount calculations

Scenario 2: Deactivate Discount Rule
Given I am viewing the inventory discounts list
And I click "Deactivate" on an active rule
When I confirm the deactivation
Then the rule status changes to "Inactive"
And the rule no longer applies to pricing calculations
And existing discounts are removed

Scenario 3: Delete Discount Rule
Given I am viewing the inventory discounts list
And I click "Delete" on a rule
When I confirm the deletion
Then the rule is permanently removed
And all historical data is retained for audit purposes',
'API Endpoints:
- PUT /api/discounts/inventory/[id] - Update rule
- DELETE /api/discounts/inventory/[id] - Delete rule
- PATCH /api/discounts/inventory/[id]/status - Change status

Database Tables:
- inventory_discounts - Stores rule data and status',
ARRAY[
  'app/inventory-discounts/page.tsx',
  'components/inventory-discounts/inventory-discounts-list.tsx',
  'components/inventory-discounts/edit-discount-modal.tsx',
  'app/api/discounts/inventory/[id]/route.ts'
],
ARRAY[
  'InventoryDiscountsList',
  'EditDiscountModal',
  'DiscountActionsMenu'
],
'Audit Logging (track changes)',
'Feature',
'system',
'system',
NOW(),
NOW())

ON CONFLICT (id) DO NOTHING;

-- Verify the insertion
SELECT 'Inventory Discounts Epic Stories Created:' as info, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Inventory Discounts';

SELECT id, title, priority, story_points, status
FROM user_stories
WHERE epic = 'Inventory Discounts'
ORDER BY id;
