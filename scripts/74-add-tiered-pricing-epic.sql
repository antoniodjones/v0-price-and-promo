-- Add Tiered Pricing Epic User Stories
-- Generated: January 2025
-- Epic: Tiered Pricing
-- Stories: 8
-- Priority: HIGH (MVP Priority #3, 60% documentation gap)

-- This epic documents the complete dollar-based tiered pricing feature that allows
-- pricing managers to create multi-tier pricing discounts based on total order dollar
-- amounts, with customer tier-specific discount percentages.

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

-- TIER-001: Create Dollar-Based Tiered Pricing Rule
('TIER-001',
'Create Dollar-Based Tiered Pricing Rule',
'This feature allows pricing managers to configure tiered pricing rules where discounts are applied based on the total dollar amount of an order. The system supports multi-tier configurations where different discount percentages apply at different dollar thresholds. Customer tiers (A/B/C) can have different discount percentages at each dollar tier.',
'Pricing Manager',
'create dollar-based tiered pricing rules with order value thresholds',
'I can incentivize customers to increase their order values and maximize revenue per transaction',
'Done',
'High',
8,
'Tiered Pricing',
'Scenario 1: Create Multi-Tier Dollar-Based Pricing
Given I am logged in as a pricing manager
And I navigate to the Market Pricing page
And I select "Tiered Pricing" as the pricing strategy
When I click "Create New Tiered Rule"
And I select "Global Rule" as the scope
And I add Tier 1: $5,000-$9,999 with A: 3%, B: 2%, C: 1%
And I add Tier 2: $10,000-$19,999 with A: 5%, B: 4%, C: 3%
And I add Tier 3: $20,000+ with A: 8%, B: 7%, C: 6%
And I set the start date to today
And I leave the end date blank
And I assign customers to tiers A, B, and C
And I enter "Global Dollar Tier Discount" as the rule name
And I click "Create Rule"
Then the tiered pricing rule is created successfully
And all three tiers are saved correctly
And customer tier assignments are saved
And the rule appears in the active pricing rules list

Scenario 2: Tiered Pricing Calculation - Tier 2
Given a tiered pricing rule exists with tiers:
  | Min Amount | Max Amount | A Tier | B Tier | C Tier |
  | $5,000     | $9,999     | 3%     | 2%     | 1%     |
  | $10,000    | $19,999    | 5%     | 4%     | 3%     |
  | $20,000    | $999,999   | 8%     | 7%     | 6%     |
And Customer X is assigned to Tier A
And Customer X has an order totaling $12,500
When the pricing engine calculates the order total
Then the 5% discount is applied to the entire order
And the discount reason shows "Tiered Discount: Tier 2 ($10,000-$19,999)"
And the customer tier is displayed as "Tier A"

Scenario 3: Tiered Pricing Calculation - Tier Boundary
Given a tiered pricing rule exists
And Customer Y is assigned to Tier B
And Customer Y has an order totaling exactly $10,000
When the pricing engine calculates the order total
Then the 4% Tier B discount is applied (Tier 2: $10,000-$19,999)
And not the 2% Tier 1 discount
And the discount reason shows "Tiered Discount: Tier 2 ($10,000-$19,999)"',
'API Endpoints:
- POST /api/pricing/tiered - Create tiered pricing rule
- GET /api/pricing/tiered - List tiered pricing rules
- PUT /api/pricing/tiered/[id] - Update tiered pricing rule
- DELETE /api/pricing/tiered/[id] - Delete tiered pricing rule

Database Tables:
- tiered_pricing_rules - Stores tiered pricing rules
- tiered_pricing_tiers - Stores tier configurations
- customer_tier_assignments - Stores customer tier assignments per rule

Pricing Engine Integration:
- lib/pricing/engine.ts - applyTieredPricing() method
- Order total calculation logic
- Tier boundary calculation
- Customer tier lookup',
ARRAY[
  'components/market-pricing/tiered-pricing-wizard.tsx',
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'components/market-pricing/wizard-steps/customer-assignment-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/tiered/route.ts'
],
ARRAY[
  'TieredPricingWizard',
  'TierConfigStep',
  'CustomerAssignmentStep',
  'ExcelLikeTierBuilder',
  'MarketConfigurationModal'
],
'Customer Management (tier assignment), Pricing Engine (tiered calculation), Market Configuration (constraint enforcement)',
NOW(),
NOW()),

-- TIER-002: Configure Customer Tier-Specific Tiered Discounts
('TIER-002',
'Configure Customer Tier-Specific Tiered Discounts',
'This feature allows pricing managers to configure different discount percentages for each customer tier (A/B/C) at each dollar tier. This enables sophisticated pricing strategies where premium customers receive higher discounts at the same order value levels.',
'Pricing Manager',
'configure different discount percentages for each customer tier at each dollar threshold',
'I can reward premium customers with better pricing while maintaining profitability across all customer segments',
'Done',
'High',
5,
'Tiered Pricing',
'Scenario 1: Configure Tier-Specific Discounts
Given I am creating a tiered pricing rule
And I am on the tier configuration step
When I add a dollar tier: $15,000-$24,999
And I enter 6% for Tier A customers
And I enter 5% for Tier B customers
And I enter 4% for Tier C customers
Then all three discount percentages are saved
And the tier shows A: 6%, B: 5%, C: 4%

Scenario 2: Apply Tier-Specific Discount
Given a tiered pricing rule exists with:
  | Min Amount | Max Amount | A Tier | B Tier | C Tier |
  | $15,000    | $24,999    | 6%     | 5%     | 4%     |
And Customer X is assigned to Tier A
And Customer Y is assigned to Tier C
And both customers have orders totaling $18,000
When the pricing engine calculates their orders
Then Customer X receives a 6% discount ($1,080 off)
And Customer Y receives a 4% discount ($720 off)
And both see "Tiered Discount: Tier 1 ($15,000-$24,999)"',
'API Endpoints:
- POST /api/pricing/tiered - Create rule with tier-specific discounts

Database Tables:
- tiered_pricing_tiers.tier_a_discount
- tiered_pricing_tiers.tier_b_discount
- tiered_pricing_tiers.tier_c_discount
- customer_tier_assignments.tier_level

Pricing Engine Integration:
- lib/pricing/engine.ts - Customer tier lookup and discount application',
ARRAY[
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/tiered/route.ts'
],
ARRAY[
  'TierConfigStep',
  'ExcelLikeTierBuilder',
  'CustomerTierSelector'
],
'Customer Management (tier assignments)',
NOW(),
NOW()),

-- TIER-003: Build Multi-Tier Pricing with Excel-Like Interface
('TIER-003',
'Build Multi-Tier Dollar Pricing with Excel-Like Interface',
'This feature provides an Excel-like interface for building dollar-based tiered pricing, allowing pricing managers to add, edit, and remove tiers inline with immediate validation. The interface supports dollar amount formatting and keyboard navigation.',
'Pricing Manager',
'use an Excel-like interface to quickly build and edit dollar-based pricing tiers',
'I can efficiently configure complex multi-tier pricing structures without navigating through multiple forms',
'Done',
'Medium',
8,
'Tiered Pricing',
'Scenario 1: Add Multiple Dollar Tiers Quickly
Given I am on the tier configuration step
When I click "Add Tier"
And I enter min: $5,000, max: $9,999, A: 3%, B: 2%, C: 1%
And I click "Add Tier" again
And I enter min: $10,000, max: $19,999, A: 5%, B: 4%, C: 3%
And I click "Add Tier" again
And I enter min: $20,000, max: $999,999, A: 8%, B: 7%, C: 6%
Then all three tiers are displayed in the table
And dollar amounts are formatted with commas and $ signs
And I can edit any cell inline
And I can delete any tier with the delete icon

Scenario 2: Dollar Amount Formatting
Given I am editing a tier
When I enter "10000" in the min amount field
And I press Enter or click outside the cell
Then the value is formatted as "$10,000"
And the underlying value is stored as 10000

Scenario 3: Validation - Overlapping Dollar Ranges
Given I have a tier: $5,000-$9,999
When I try to add a tier: $8,000-$12,000
Then I see an error message "Tier ranges cannot overlap"
And the overlapping tier is not saved',
'API Endpoints:
- POST /api/pricing/tiered - Accepts array of tier configurations

Database Tables:
- tiered_pricing_tiers - Stores all tiers for a rule

UI Components:
- components/market-pricing/wizard-steps/tier-config-step.tsx
- Excel-like table with inline editing
- Dollar amount formatting
- Real-time validation',
ARRAY[
  'components/market-pricing/wizard-steps/tier-config-step.tsx',
  'components/ui/data-table.tsx',
  'lib/validation/tier-validation.ts',
  'lib/utils/currency-formatter.ts'
],
ARRAY[
  'TierConfigStep',
  'ExcelLikeTierBuilder',
  'InlineEditableCell',
  'CurrencyFormatter',
  'TierValidation'
],
'None',
NOW(),
NOW()),

-- TIER-004: Apply Tiered Pricing to Brand/Category/Item
('TIER-004',
'Apply Tiered Pricing to Brand/Category/Item Levels',
'This feature allows pricing managers to apply tiered pricing rules at different scope levels: global (all products), brand-specific, category-specific, or item-specific. This enables targeted tiered discounts for specific product lines.',
'Pricing Manager',
'apply tiered pricing rules at different scope levels (brand, category, item)',
'I can create targeted tiered discounts for specific product lines without affecting the entire catalog',
'Done',
'High',
5,
'Tiered Pricing',
'Scenario 1: Brand-Level Tiered Pricing
Given I am creating a tiered pricing rule
When I select "Brand Level" as the scope
And I select "Incredibles" as the brand
And I configure dollar tiers
And I create the rule
Then the rule applies only to Incredibles brand products in the order total calculation
And other brands are not included in the tier calculation

Scenario 2: Category-Level Tiered Pricing
Given I am creating a tiered pricing rule
When I select "Category Level" as the scope
And I select "Edibles" as the category
And I configure dollar tiers
And I create the rule
Then the rule applies only to Edibles category products in the order total
And other categories are not included in the tier calculation

Scenario 3: Mixed Order with Brand-Level Tiered Pricing
Given a brand-level tiered pricing rule exists for Incredibles
And the rule has a tier: $5,000-$9,999 with 3% discount
And an order contains $6,000 of Incredibles products and $4,000 of other brands
When the pricing engine calculates the order
Then the 3% discount is applied only to the $6,000 of Incredibles products
And the other $4,000 is not discounted by this rule',
'API Endpoints:
- POST /api/pricing/tiered - Create rule with scope and scope_id

Database Tables:
- tiered_pricing_rules.scope - Enum: "global", "brand", "category", "item"
- tiered_pricing_rules.scope_id - Foreign key to brands/categories/products

Pricing Engine Integration:
- lib/pricing/engine.ts - Scope-based order total calculation logic',
ARRAY[
  'components/market-pricing/wizard-steps/scope-selection-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/pricing/tiered/route.ts'
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

-- TIER-005: Enforce Market Constraint (Volume XOR Tiered)
('TIER-005',
'Enforce Market Constraint: Tiered XOR Volume Pricing',
'This feature enforces a business rule that each market can use either tiered pricing OR volume pricing, but not both simultaneously. This prevents conflicting pricing strategies and ensures clear pricing logic per market.',
'Pricing Manager',
'ensure that each market uses either tiered pricing or volume pricing, but not both',
'I can maintain clear and consistent pricing strategies per market without conflicts',
'Done',
'High',
5,
'Tiered Pricing',
'Scenario 1: Prevent Volume Pricing When Tiered Exists
Given Market A has an active tiered pricing rule
When I try to create a volume pricing rule for Market A
Then I see an error message "Market A already uses Tiered Pricing. Please disable tiered pricing to use volume pricing."
And the volume pricing rule cannot be created

Scenario 2: Prevent Tiered Pricing When Volume Exists
Given Market B has an active volume pricing rule
When I try to create a tiered pricing rule for Market B
Then I see an error message "Market B already uses Volume Pricing. Please disable volume pricing to use tiered pricing."
And the tiered pricing rule cannot be created

Scenario 3: Switch from Tiered to Volume
Given Market C has an active tiered pricing rule
When I disable the tiered pricing rule
And I create a volume pricing rule for Market C
Then the volume pricing rule is created successfully
And Market C now uses volume pricing',
'API Endpoints:
- POST /api/pricing/tiered - Validates market constraint before creation
- POST /api/pricing/volume - Validates market constraint before creation

Database Tables:
- market_pricing_config.strategy - Enum: "volume" or "tiered"

Validation Logic:
- lib/validation/market-constraints.ts - Enforces XOR constraint',
ARRAY[
  'lib/validation/market-constraints.ts',
  'app/api/pricing/tiered/route.ts',
  'app/api/pricing/volume/route.ts',
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

-- TIER-006: Calculate Tiered Pricing in Mixed Orders
('TIER-006',
'Calculate Tiered Pricing in Mixed Orders',
'This feature handles the complex scenario where an order contains products from multiple brands/categories, and tiered pricing rules exist at different scope levels. The pricing engine must correctly calculate which products contribute to which tier thresholds.',
'Pricing Manager',
'correctly calculate tiered pricing when orders contain mixed products with different scope rules',
'I can ensure accurate pricing calculations regardless of order complexity',
'Done',
'High',
8,
'Tiered Pricing',
'Scenario 1: Global Tiered Pricing with Mixed Order
Given a global tiered pricing rule exists with tier: $10,000-$19,999 at 5%
And an order contains:
  | Brand       | Amount  |
  | Incredibles | $6,000  |
  | Wana        | $5,000  |
  | Other       | $2,000  |
And the total order value is $13,000
When the pricing engine calculates the order
Then the 5% discount is applied to the entire $13,000
And the discount amount is $650

Scenario 2: Brand-Level Tiered Pricing with Mixed Order
Given a brand-level tiered pricing rule exists for Incredibles with tier: $5,000-$9,999 at 3%
And an order contains:
  | Brand       | Amount  |
  | Incredibles | $6,000  |
  | Wana        | $5,000  |
And the Incredibles subtotal is $6,000 (qualifies for tier)
When the pricing engine calculates the order
Then the 3% discount is applied only to the $6,000 of Incredibles products
And the discount amount is $180
And the Wana products receive no discount from this rule

Scenario 3: Multiple Scope Rules in Same Order
Given a global tiered pricing rule exists with tier: $10,000+ at 4%
And a brand-level tiered pricing rule exists for Incredibles with tier: $5,000+ at 6%
And an order contains $6,000 of Incredibles and $5,000 of other brands (total $11,000)
When the pricing engine calculates the order
Then the brand-level rule applies to Incredibles (6% on $6,000 = $360 off)
And the global rule applies to the remaining products (4% on $5,000 = $200 off)
And the total discount is $560',
'API Endpoints:
- POST /api/pricing/calculate - Complex tiered pricing calculation

Database Tables:
- tiered_pricing_rules - Multiple rules with different scopes
- orders - Order line items with brand/category data

Pricing Engine Integration:
- lib/pricing/engine.ts - Complex order total calculation logic
- Scope-based subtotal aggregation
- Rule priority and conflict resolution',
ARRAY[
  'lib/pricing/engine.ts',
  'app/api/pricing/calculate/route.ts',
  'lib/pricing/tiered-calculator.ts'
],
ARRAY[
  'TieredPricingCalculator',
  'ScopeAggregator',
  'RulePriorityResolver'
],
'Pricing Engine, Order Management',
NOW(),
NOW()),

-- TIER-007: View Tiered Pricing Performance Analytics
('TIER-007',
'View Tiered Pricing Performance Analytics',
'This feature provides analytics on tiered pricing performance, showing which dollar tiers are most utilized, which customer tiers are benefiting most, and the overall impact on revenue and average order values.',
'Pricing Manager',
'view analytics on tiered pricing performance and utilization',
'I can optimize tiered pricing strategies based on actual customer behavior and business impact',
'Done',
'Medium',
5,
'Tiered Pricing',
'Scenario 1: View Dollar Tier Utilization
Given I navigate to the Analytics page
And I select "Tiered Pricing Performance"
When I view the tier utilization report
Then I see the number of orders in each dollar tier
And I see the average order value per tier
And I see the total revenue per tier
And I see the total discount amount per tier

Scenario 2: View Customer Tier Performance
Given I am viewing tiered pricing analytics
When I filter by customer tier
Then I see Tier A customer tiered pricing usage
And I see Tier B customer tiered pricing usage
And I see Tier C customer tiered pricing usage
And I can compare average order values across customer tiers

Scenario 3: Analyze Tier Threshold Effectiveness
Given I am viewing tiered pricing analytics
When I view the tier threshold analysis
Then I see how many orders fell just below each tier threshold
And I can identify opportunities to adjust thresholds to encourage larger orders',
'API Endpoints:
- GET /api/analytics/tiered-pricing - Tiered pricing analytics

Database Tables:
- orders - Order data with tiered discounts applied
- tiered_pricing_rules - Active rules
- customer_tier_assignments - Customer tier data

Analytics Calculations:
- Tier utilization rates
- Average order value by tier
- Revenue impact analysis
- Threshold effectiveness metrics',
ARRAY[
  'app/analytics/page.tsx',
  'components/analytics/tiered-pricing-analytics.tsx',
  'app/api/analytics/tiered-pricing/route.ts'
],
ARRAY[
  'TieredPricingAnalytics',
  'TierUtilizationChart',
  'CustomerTierPerformance',
  'ThresholdEffectivenessChart'
],
'Analytics Dashboard, Order Management',
NOW(),
NOW()),

-- TIER-008: Test Tiered Pricing in Simulator
('TIER-008',
'Test Tiered Pricing Scenarios in Pricing Simulator',
'This feature allows pricing managers to test tiered pricing rules in the pricing simulator before activating them. Users can enter test orders with different dollar amounts and customer tiers to see how tiered discounts will be applied.',
'Pricing Manager',
'test tiered pricing rules in the simulator before activating them',
'I can validate that tiered pricing rules work correctly and produce expected results before impacting real orders',
'Done',
'High',
5,
'Tiered Pricing',
'Scenario 1: Test Tiered Pricing with Different Order Values
Given I navigate to the Pricing Simulator
And a tiered pricing rule exists with tiers:
  | Min Amount | Max Amount | A Tier | B Tier | C Tier |
  | $5,000     | $9,999     | 3%     | 2%     | 1%     |
  | $10,000    | $19,999    | 5%     | 4%     | 3%     |
When I select Customer X (Tier A)
And I build a test order totaling $12,500
And I click "Calculate Pricing"
Then I see the 5% tiered discount applied
And the discount reason shows "Tiered Discount: Tier 2 ($10,000-$19,999)"
And I see the original total and discounted total

Scenario 2: Test Tier Threshold Behavior
Given I am in the Pricing Simulator
And a tiered pricing rule exists
When I test with an order total of $9,999 (Tier 1 max)
Then I see the Tier 1 discount applied
When I test with an order total of $10,000 (Tier 2 min)
Then I see the Tier 2 discount applied
And I can verify the tier boundary logic is correct

Scenario 3: Test Mixed Order Tiered Pricing
Given I am in the Pricing Simulator
And a brand-level tiered pricing rule exists for Incredibles
When I build a test order with $6,000 of Incredibles and $4,000 of other brands
And I click "Calculate Pricing"
Then I see the tiered discount applied only to the Incredibles subtotal
And I see a breakdown showing which products received the discount',
'API Endpoints:
- POST /api/pricing/calculate - Calculate pricing with tiered discounts

Simulator Features:
- Customer tier selection
- Order builder with multiple products
- Real-time pricing calculation
- Discount breakdown display
- Scope-based discount visualization',
ARRAY[
  'app/simulator/page.tsx',
  'components/simulator/pricing-simulator.tsx',
  'app/api/pricing/calculate/route.ts',
  'lib/pricing/engine.ts'
],
ARRAY[
  'PricingSimulator',
  'OrderBuilder',
  'PricingBreakdown',
  'DiscountExplanation',
  'ScopeVisualizer'
],
'Pricing Simulator, Pricing Engine',
NOW(),
NOW());

-- Verification
SELECT 'Total Tiered Pricing stories:' as info, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Tiered Pricing';

SELECT 'Tiered Pricing stories by status:' as info, status, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'Tiered Pricing'
GROUP BY status;
