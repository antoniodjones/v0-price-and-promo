-- Add Volume Pricing Epic User Stories
-- Generated: January 2025
-- Epic: Volume Pricing
-- Stories: 8
-- Priority: HIGH (MVP Priority #3, 60% documentation gap)

-- This epic documents the complete volume-based pricing feature that allows
-- pricing managers to create multi-tier volume discounts based on unit or case
-- quantities, with customer tier-specific discount percentages.

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

-- VOL-001: Create Volume Pricing Rule with Unit Tiers
('VOL-001',
'Create Volume-Based Pricing Rule with Unit Tiers',
'This feature allows pricing managers to configure volume-based pricing rules where discounts are applied based on the quantity of units purchased. The system supports multi-tier configurations where different discount percentages apply at different quantity thresholds. Customer tiers (A/B/C) can have different discount percentages at each volume tier, enabling sophisticated pricing strategies.',
'Pricing Manager',
'create volume-based pricing rules with unit quantity tiers',
'I can incentivize customers to purchase larger quantities and increase order sizes',
'Done',
'High',
8,
'Volume Pricing',
'Scenario 1: Create Multi-Tier Volume Pricing Rule
Given I am logged in as a pricing manager
And I navigate to the Market Pricing page
And I select "Volume Pricing" as the pricing strategy
When I click "Create New Volume Rule"
And I select "Units" as the volume measurement
And I select "Global Rule" as the scope
And I add Tier 1: 50-75 units with A: 4%, B: 3%, C: 2%
And I add Tier 2: 76-99 units with A: 5%, B: 4%, C: 3%
And I add Tier 3: 100+ units with A: 6%, B: 5%, C: 4%
And I set the start date to today
And I leave the end date blank
And I assign customers to tiers A, B, and C
And I enter "Global Volume Discount" as the rule name
And I click "Create Rule"
Then the volume pricing rule is created successfully
And all three tiers are saved correctly
And customer tier assignments are saved
And the rule appears in the active pricing rules list

Scenario 2: Volume Pricing Calculation - Tier 1
Given a volume pricing rule exists with tiers:
  | Min Units | Max Units | A Tier | B Tier | C Tier |
  | 50        | 75        | 4%     | 3%     | 2%     |
  | 76        | 99        | 5%     | 4%     | 3%     |
  | 100       | 999999    | 6%     | 5%     | 4%     |
And Customer X is assigned to Tier A
And Customer X adds 60 units to their cart
When the pricing engine calculates the order total
Then the 4% discount is applied to all 60 units
And the discount reason shows "Volume Discount: Tier 1 (50-75 units)"
And the customer tier is displayed as "Tier A"

Scenario 3: Volume Pricing Calculation - Tier Boundary
Given a volume pricing rule exists
And Customer Y is assigned to Tier B
And Customer Y adds exactly 76 units to their cart
When the pricing engine calculates the order total
Then the 4% Tier B discount is applied (Tier 2: 76-99 units)
And not the 3% Tier 1 discount
And the discount reason shows "Volume Discount: Tier 2 (76-99 units)"

Scenario 4: Validation - Overlapping Tiers
Given I am creating a volume pricing rule
When I add Tier 1: 50-75 units
And I try to add Tier 2: 70-100 units (overlaps with Tier 1)
Then I see an error message "Tier ranges cannot overlap"
And the overlapping tier is not saved',
'API Endpoints:
- POST /api/pricing/volume - Create volume pricing rule
- GET /api/pricing/volume - List volume pricing rules
- PUT /api/pricing/volume/[id] - Update volume pricing rule
- DELETE /api/pricing/volume/[id] - Delete volume pricing rule

Database Tables:
- volume_pricing_rules - Stores volume pricing rules
- volume_pricing_tiers - Stores tier configurations
- customer_tier_assignments - Stores customer tier assignments per rule

Pricing Engine Integration:
- lib/pricing/engine.ts - applyVolumePricing() method
- Quantity aggregation logic
- Tier boundary calculation
- Customer tier lookup',
ARRAY[
  'app/market-pricing/volume/page.tsx',
  'components/market-pricing/volume-pricing-wizard.tsx',
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'components/market-pricing/wizard-steps/customer-assignment-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/volume/route.ts'
],
ARRAY[
  'VolumePricingWizard',
  'TierConfigStep',
  'CustomerAssignmentStep',
  'ExcelLikeTierBuilder',
  'MarketConfigurationModal'
],
'Customer Management (tier assignment), Pricing Engine (volume calculation), Market Configuration (constraint enforcement)',
NOW(),
NOW()),

-- VOL-002: Create Volume Pricing Rule with Case Tiers
('VOL-002',
'Create Volume-Based Pricing Rule with Case Tiers',
'This feature allows pricing managers to configure volume-based pricing rules where discounts are applied based on the quantity of cases purchased instead of individual units. This is particularly useful for wholesale operations where products are sold by the case.',
'Pricing Manager',
'create volume-based pricing rules with case quantity tiers',
'I can incentivize bulk purchases at the case level and align with wholesale business models',
'Done',
'High',
5,
'Volume Pricing',
'Scenario 1: Create Case-Based Volume Pricing
Given I am logged in as a pricing manager
And I navigate to the Market Pricing page
When I click "Create New Volume Rule"
And I select "Cases" as the volume measurement
And I select "Brand Level" as the scope
And I select "Incredibles" as the brand
And I add Tier 1: 20-49 cases with A: 5%, B: 4%, C: 3%
And I add Tier 2: 50+ cases with A: 9%, B: 8%, C: 7%
And I enter "Incredibles Case Volume Discount" as the rule name
And I click "Create Rule"
Then the volume pricing rule is created successfully
And the rule applies only to Incredibles brand products
And quantities are measured in cases, not units

Scenario 2: Case Volume Calculation
Given a case-based volume pricing rule exists for Incredibles
And Tier 1 is 20-49 cases with A: 5%
And Customer X is assigned to Tier A
And Customer X orders 35 cases of Incredibles products
When the pricing engine calculates the order total
Then the 5% discount is applied to all 35 cases
And the discount reason shows "Volume Discount: Tier 1 (20-49 cases)"',
'API Endpoints:
- POST /api/pricing/volume - Create volume pricing rule with measurement_type: "cases"

Database Tables:
- volume_pricing_rules.measurement_type - Enum: "units" or "cases"

Pricing Engine Integration:
- lib/pricing/engine.ts - Case quantity aggregation logic
- Product-to-case conversion calculations',
ARRAY[
  'app/market-pricing/volume/page.tsx',
  'components/market-pricing/volume-pricing-wizard.tsx',
  'components/market-pricing/wizard-steps/measurement-type-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/volume/route.ts'
],
ARRAY[
  'VolumePricingWizard',
  'MeasurementTypeStep',
  'TierConfigStep'
],
'Product Management (case definitions), Pricing Engine (case calculations)',
NOW(),
NOW()),

-- VOL-003: Configure Customer Tier-Specific Volume Discounts
('VOL-003',
'Configure Customer Tier-Specific Volume Discounts',
'This feature allows pricing managers to configure different discount percentages for each customer tier (A/B/C) at each volume tier. This enables sophisticated pricing strategies where premium customers (Tier A) receive higher discounts than standard customers (Tier C) at the same volume levels.',
'Pricing Manager',
'configure different discount percentages for each customer tier at each volume level',
'I can reward premium customers with better pricing while maintaining profitability across all customer segments',
'Done',
'High',
5,
'Volume Pricing',
'Scenario 1: Configure Tier-Specific Discounts
Given I am creating a volume pricing rule
And I am on the tier configuration step
When I add a volume tier: 100-199 units
And I enter 8% for Tier A customers
And I enter 6% for Tier B customers
And I enter 4% for Tier C customers
Then all three discount percentages are saved
And the tier shows A: 8%, B: 6%, C: 4%

Scenario 2: Apply Tier-Specific Discount
Given a volume pricing rule exists with:
  | Min Units | Max Units | A Tier | B Tier | C Tier |
  | 100       | 199       | 8%     | 6%     | 4%     |
And Customer X is assigned to Tier A
And Customer Y is assigned to Tier C
And both customers order 150 units
When the pricing engine calculates their orders
Then Customer X receives an 8% discount
And Customer Y receives a 4% discount
And both see "Volume Discount: Tier 1 (100-199 units)"',
'API Endpoints:
- POST /api/pricing/volume - Create rule with tier-specific discounts

Database Tables:
- volume_pricing_tiers.tier_a_discount
- volume_pricing_tiers.tier_b_discount
- volume_pricing_tiers.tier_c_discount
- customer_tier_assignments.tier_level

Pricing Engine Integration:
- lib/pricing/engine.ts - Customer tier lookup and discount application',
ARRAY[
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/volume/route.ts'
],
ARRAY[
  'TierConfigStep',
  'ExcelLikeTierBuilder',
  'CustomerTierSelector'
],
'Customer Management (tier assignments)',
NOW(),
NOW()),

-- VOL-004: Build Multi-Tier Volume Pricing with Excel-Like Interface
('VOL-004',
'Build Multi-Tier Volume Pricing with Excel-Like Interface',
'This feature provides an Excel-like interface for building volume pricing tiers, allowing pricing managers to add, edit, and remove tiers inline with immediate validation. The interface supports copy-paste operations and keyboard navigation for efficient tier configuration.',
'Pricing Manager',
'use an Excel-like interface to quickly build and edit volume pricing tiers',
'I can efficiently configure complex multi-tier pricing structures without navigating through multiple forms',
'Done',
'Medium',
8,
'Volume Pricing',
'Scenario 1: Add Multiple Tiers Quickly
Given I am on the tier configuration step
When I click "Add Tier"
And I enter min: 50, max: 75, A: 4%, B: 3%, C: 2%
And I click "Add Tier" again
And I enter min: 76, max: 99, A: 5%, B: 4%, C: 3%
And I click "Add Tier" again
And I enter min: 100, max: 999999, A: 6%, B: 5%, C: 4%
Then all three tiers are displayed in the table
And I can edit any cell inline
And I can delete any tier with the delete icon

Scenario 2: Inline Editing
Given I have three volume tiers configured
When I click on the "Tier A %" cell for Tier 2
And I change the value from 5% to 6%
And I press Enter or click outside the cell
Then the value is updated to 6%
And the tier is marked as modified

Scenario 3: Validation - Negative Values
Given I am editing a tier
When I enter -5% for Tier A discount
And I press Enter
Then I see an error message "Discount percentage must be positive"
And the value is not saved',
'API Endpoints:
- POST /api/pricing/volume - Accepts array of tier configurations

Database Tables:
- volume_pricing_tiers - Stores all tiers for a rule

UI Components:
- components/market-pricing/wizard-steps/tier-config-step.tsx
- Excel-like table with inline editing
- Add/remove row functionality
- Real-time validation',
ARRAY[
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'components/ui/data-table.tsx',
  'lib/validation/tier-validation.ts'
],
ARRAY[
  'TierConfigStep',
  'ExcelLikeTierBuilder',
  'InlineEditableCell',
  'TierValidation'
],
'None',
NOW(),
NOW()),

-- VOL-005: Apply Volume Pricing to Brand/Category/Item
('VOL-005',
'Apply Volume Pricing to Brand/Category/Item Levels',
'This feature allows pricing managers to apply volume pricing rules at different scope levels: global (all products), brand-specific, category-specific, or item-specific. This enables targeted volume discounts for specific product lines or individual SKUs.',
'Pricing Manager',
'apply volume pricing rules at different scope levels (brand, category, item)',
'I can create targeted volume discounts for specific product lines without affecting the entire catalog',
'Done',
'High',
5,
'Volume Pricing',
'Scenario 1: Brand-Level Volume Pricing
Given I am creating a volume pricing rule
When I select "Brand Level" as the scope
And I select "Incredibles" as the brand
And I configure volume tiers
And I create the rule
Then the rule applies only to Incredibles brand products
And other brands are not affected

Scenario 2: Category-Level Volume Pricing
Given I am creating a volume pricing rule
When I select "Category Level" as the scope
And I select "Edibles" as the category
And I configure volume tiers
And I create the rule
Then the rule applies only to Edibles category products
And other categories are not affected

Scenario 3: Item-Level Volume Pricing
Given I am creating a volume pricing rule
When I select "Item Level" as the scope
And I select specific SKU "INC-GUMMY-100MG"
And I configure volume tiers
And I create the rule
Then the rule applies only to that specific SKU
And other items are not affected',
'API Endpoints:
- POST /api/pricing/volume - Create rule with scope and scope_id

Database Tables:
- volume_pricing_rules.scope - Enum: "global", "brand", "category", "item"
- volume_pricing_rules.scope_id - Foreign key to brands/categories/products

Pricing Engine Integration:
- lib/pricing/engine.ts - Scope-based rule matching logic',
ARRAY[
  'components/market-pricing/wizard-steps/scope-selection-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/volume/route.ts'
],
ARRAY[
  'ScopeSelectionStep',
  'BrandSelector',
  'CategorySelector',
  'ItemSelector'
],
'Product Management (brands, categories, items)',
NOW(),
NOW()),

-- VOL-006: Enforce Market Constraint (Volume XOR Tiered)
('VOL-006',
'Enforce Market Constraint: Volume XOR Tiered Pricing',
'This feature enforces a business rule that each market can use either volume pricing OR tiered pricing, but not both simultaneously. This prevents conflicting pricing strategies and ensures clear pricing logic per market.',
'Pricing Manager',
'ensure that each market uses either volume pricing or tiered pricing, but not both',
'I can maintain clear and consistent pricing strategies per market without conflicts',
'Done',
'High',
5,
'Volume Pricing',
'Scenario 1: Prevent Tiered Pricing When Volume Exists
Given Market A has an active volume pricing rule
When I try to create a tiered pricing rule for Market A
Then I see an error message "Market A already uses Volume Pricing. Please disable volume pricing to use tiered pricing."
And the tiered pricing rule cannot be created

Scenario 2: Prevent Volume Pricing When Tiered Exists
Given Market B has an active tiered pricing rule
When I try to create a volume pricing rule for Market B
Then I see an error message "Market B already uses Tiered Pricing. Please disable tiered pricing to use volume pricing."
And the volume pricing rule cannot be created

Scenario 3: Switch from Volume to Tiered
Given Market C has an active volume pricing rule
When I disable the volume pricing rule
And I create a tiered pricing rule for Market C
Then the tiered pricing rule is created successfully
And Market C now uses tiered pricing',
'API Endpoints:
- POST /api/pricing/volume - Validates market constraint before creation
- POST /api/pricing/tiered - Validates market constraint before creation

Database Tables:
- market_pricing_config.strategy - Enum: "volume" or "tiered"

Validation Logic:
- lib/validation/market-constraints.ts - Enforces XOR constraint',
ARRAY[
  'lib/validation/market-constraints.ts',
  'app/api/pricing/volume/route.ts',
  'app/api/pricing/tiered/route.ts',
  'components/market-pricing/market-config-modal.tsx'
],
ARRAY[
  'MarketConstraintValidator',
  'MarketConfigModal',
  'PricingStrategySelector'
],
'Market Configuration',
NOW(),
NOW()),

-- VOL-007: View Volume Pricing Performance Analytics
('VOL-007',
'View Volume Pricing Performance Analytics',
'This feature provides analytics on volume pricing performance, showing which volume tiers are most utilized, which customer tiers are benefiting most, and the overall impact on revenue and order sizes.',
'Pricing Manager',
'view analytics on volume pricing performance and utilization',
'I can optimize volume pricing strategies based on actual customer behavior and business impact',
'Done',
'Medium',
5,
'Volume Pricing',
'Scenario 1: View Volume Tier Utilization
Given I navigate to the Analytics page
And I select "Volume Pricing Performance"
When I view the tier utilization report
Then I see the number of orders in each volume tier
And I see the average order value per tier
And I see the total revenue per tier

Scenario 2: View Customer Tier Performance
Given I am viewing volume pricing analytics
When I filter by customer tier
Then I see Tier A customer volume pricing usage
And I see Tier B customer volume pricing usage
And I see Tier C customer volume pricing usage
And I can compare performance across customer tiers',
'API Endpoints:
- GET /api/analytics/volume-pricing - Volume pricing analytics

Database Tables:
- orders - Order data with volume discounts applied
- volume_pricing_rules - Active rules
- customer_tier_assignments - Customer tier data

Analytics Calculations:
- Tier utilization rates
- Average order value by tier
- Revenue impact analysis',
ARRAY[
  'app/analytics/page.tsx',
  'components/analytics/volume-pricing-analytics.tsx',
  'app/api/analytics/volume-pricing/route.ts'
],
ARRAY[
  'VolumePricingAnalytics',
  'TierUtilizationChart',
  'CustomerTierPerformance'
],
'Analytics Dashboard, Order Management',
NOW(),
NOW()),

-- VOL-008: Test Volume Pricing in Simulator
('VOL-008',
'Test Volume Pricing Scenarios in Pricing Simulator',
'This feature allows pricing managers to test volume pricing rules in the pricing simulator before activating them. Users can enter test baskets with different quantities and customer tiers to see how volume discounts will be applied.',
'Pricing Manager',
'test volume pricing rules in the simulator before activating them',
'I can validate that volume pricing rules work correctly and produce expected results before impacting real orders',
'Done',
'High',
5,
'Volume Pricing',
'Scenario 1: Test Volume Pricing with Different Quantities
Given I navigate to the Pricing Simulator
And a volume pricing rule exists with tiers:
  | Min Units | Max Units | A Tier | B Tier | C Tier |
  | 50        | 75        | 4%     | 3%     | 2%     |
  | 76        | 99        | 5%     | 4%     | 3%     |
When I select Customer X (Tier A)
And I add 60 units of Product Y to the test basket
And I click "Calculate Pricing"
Then I see the 4% volume discount applied
And the discount reason shows "Volume Discount: Tier 1 (50-75 units)"
And I see the original price and discounted price

Scenario 2: Test Tier Boundary Behavior
Given I am in the Pricing Simulator
And a volume pricing rule exists
When I test with 75 units (Tier 1 max)
Then I see the Tier 1 discount applied
When I test with 76 units (Tier 2 min)
Then I see the Tier 2 discount applied
And I can verify the tier boundary logic is correct',
'API Endpoints:
- POST /api/pricing/calculate - Calculate pricing with volume discounts

Simulator Features:
- Customer tier selection
- Quantity input
- Real-time pricing calculation
- Discount breakdown display',
ARRAY[
  'app/simulator/page.tsx',
  'components/simulator/pricing-simulator.tsx',
  'app/api/pricing/calculate/route.ts',
  'lib/pricing/engine.ts'
],
ARRAY[
  'PricingSimulator',
  'BasketBuilder',
  'PricingBreakdown',
  'DiscountExplanation'
],
'Pricing Simulator, Pricing Engine',
NOW(),
NOW());

-- Verification
SELECT 'Total Volume Pricing stories:' as info, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Volume Pricing';

SELECT 'Volume Pricing stories by status:' as info, status, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Volume Pricing'
GROUP BY status;
