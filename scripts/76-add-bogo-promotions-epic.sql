-- Add BOGO Promotions Epic User Stories
-- Generated: January 2025
-- Epic: BOGO Promotions
-- Stories: 8
-- Priority: Critical (MVP Phase 1)
-- Gap: 100% (No existing documentation)

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

-- BOGO-001: Create Item-Level BOGO Promotion
('BOGO-001',
'Create Item-Level BOGO Promotion',
'This feature allows marketing managers to create Buy-One-Get-One promotional campaigns at the item level. The system supports configuring trigger products (what must be purchased) and reward products (what the customer gets), with flexible reward types including percentage discounts, dollar amounts, or free items. The wizard guides users through trigger configuration, reward setup, date ranges, and customer targeting.',
'Marketing Manager',
'I want to create item-level BOGO promotions',
'So that I can drive sales of specific products and clear inventory through targeted promotional campaigns',
'Done',
'Critical',
8,
'BOGO Promotions',
'Scenario 1: Create Simple BOGO - Buy Product A, Get Product B Free
Given I am logged in as a marketing manager
And I navigate to the Promotions page
When I click "Create BOGO"
And I select "Item Level" as the BOGO scope
And I select "Product A" as the trigger product
And I enter "1" as the trigger quantity
And I select "Product B" as the reward product
And I select "Free" as the reward type
And I set the start date to today
And I set the end date to 30 days from today
And I enter "Buy A Get B Free" as the promotion name
And I click "Create Promotion"
Then the BOGO promotion is created successfully
And I see a success message "BOGO promotion created successfully"
And the promotion appears in the active promotions list

Scenario 2: Create BOGO with Percentage Discount
Given I am creating a BOGO promotion
And I select "Product C" as the trigger product
And I enter "2" as the trigger quantity (buy 2)
And I select "Product C" as the reward product (same product)
And I select "Percentage" as the reward type
And I enter "50" as the reward value (50% off)
When I create the promotion
Then customers who buy 2 of Product C get 50% off the second one
And the discount is automatically applied at checkout

Scenario 3: Create Brand-Level BOGO
Given I am creating a BOGO promotion
And I select "Brand Level" as the BOGO scope
And I select "Incredibles" as the trigger brand
And I enter "1" as the trigger quantity
And I select "Incredibles" as the reward brand
And I select "Free" as the reward type
When I create the promotion
Then customers who buy any Incredibles product get another Incredibles product free
And the system automatically selects the lowest-priced item as the free reward

Scenario 4: Validation - Missing Required Fields
Given I am creating a BOGO promotion
When I leave the trigger product blank
And I click "Create Promotion"
Then I see an error message "Trigger product is required"
And the promotion is not created

Scenario 5: BOGO Application at Checkout
Given an active BOGO promotion exists: Buy Product A, Get Product B Free
And a customer adds Product A to their cart
And the customer adds Product B to their cart
When the pricing engine calculates the cart total
Then Product B is marked as free (100% discount)
And the discount reason shows "BOGO: Buy A Get B Free"
And the original price and discounted price are both displayed',
'API Endpoints:
- POST /api/promotions/bogo - Create BOGO promotion
- GET /api/promotions/bogo - List BOGO promotions
- PUT /api/promotions/bogo/[id] - Update BOGO promotion
- DELETE /api/promotions/bogo/[id] - Delete BOGO promotion

Database Tables:
- bogo_promotions - Stores BOGO promotion rules
- promotion_applications - Tracks BOGO applications at checkout

Pricing Engine Integration:
- lib/pricing/engine.ts - applyBogoPromotions() method
- Automatic lowest-price selection for free items
- Multi-item BOGO support',
ARRAY[
  'app/promotions/new/page.tsx',
  'components/promotions/bogo-promotion-wizard.tsx',
  'components/promotions/wizard-steps/bogo-type-step.tsx',
  'components/promotions/wizard-steps/bogo-trigger-step.tsx',
  'components/promotions/wizard-steps/bogo-reward-step.tsx',
  'components/promotions/wizard-steps/bogo-dates-step.tsx',
  'app/api/promotions/bogo/route.ts',
  'lib/pricing/engine.ts'
],
ARRAY[
  'BogoPromotionWizard',
  'BogoTypeStep',
  'BogoTriggerStep',
  'BogoRewardStep',
  'BogoDatesStep'
],
'Product Management, Pricing Engine, Promotion Management',
NOW(),
NOW()),

-- BOGO-002: Edit Existing BOGO Promotion
('BOGO-002',
'Edit Existing BOGO Promotion',
'This feature allows marketing managers to edit existing BOGO promotions, updating trigger products, reward configurations, date ranges, and customer targeting. The system validates that changes don''t conflict with already-applied promotions and provides warnings if the edit will affect active customer orders.',
'Marketing Manager',
'I want to edit existing BOGO promotions',
'So that I can adjust promotional campaigns based on performance and business needs without creating new promotions',
'Done',
'High',
5,
'BOGO Promotions',
'Scenario 1: Edit BOGO Reward Value
Given an active BOGO promotion exists with 50% off reward
And I navigate to the Promotions page
When I click "Edit" on the BOGO promotion
And I change the reward value from "50" to "75"
And I click "Save Changes"
Then the promotion is updated successfully
And new orders receive 75% off instead of 50%
And existing orders are not affected

Scenario 2: Extend BOGO End Date
Given a BOGO promotion is set to end tomorrow
When I edit the promotion
And I extend the end date by 30 days
And I save the changes
Then the promotion remains active for 30 more days
And customers can continue to use the promotion

Scenario 3: Validation - Cannot Edit Active Promotion Trigger
Given a BOGO promotion has been applied to 50 orders
When I try to change the trigger product
Then I see a warning "This promotion has been applied to 50 orders. Changing the trigger may affect reporting."
And I can choose to proceed or cancel',
'API Endpoints:
- GET /api/promotions/bogo/[id] - Get BOGO details
- PUT /api/promotions/bogo/[id] - Update BOGO promotion

Validation:
- Check for active applications before allowing trigger changes
- Warn about impact on reporting and analytics',
ARRAY[
  'app/promotions/manage/page.tsx',
  'components/promotions/edit-bogo-modal.tsx',
  'app/api/promotions/bogo/[id]/route.ts'
],
ARRAY[
  'EditBogoModal',
  'BogoPromotionWizard'
],
'BOGO-001',
NOW(),
NOW()),

-- BOGO-003: Delete BOGO Promotion
('BOGO-003',
'Delete BOGO Promotion',
'This feature allows marketing managers to delete BOGO promotions. The system prevents deletion of promotions that have been applied to orders and instead offers to deactivate them. Soft deletion is used to preserve historical data for reporting and analytics.',
'Marketing Manager',
'I want to delete BOGO promotions',
'So that I can remove outdated or incorrect promotional campaigns from the active list',
'Done',
'Medium',
3,
'BOGO Promotions',
'Scenario 1: Delete Unused BOGO Promotion
Given a BOGO promotion exists with 0 applications
When I click "Delete" on the promotion
And I confirm the deletion
Then the promotion is permanently deleted
And it no longer appears in the promotions list

Scenario 2: Cannot Delete Applied BOGO
Given a BOGO promotion has been applied to 25 orders
When I try to delete the promotion
Then I see an error "Cannot delete promotion with existing applications. Deactivate instead."
And the promotion is not deleted
And I am offered the option to deactivate

Scenario 3: Deactivate Instead of Delete
Given a BOGO promotion has been applied to orders
When I choose to deactivate instead of delete
Then the promotion status changes to "Inactive"
And it no longer applies to new orders
And historical data is preserved',
'API Endpoints:
- DELETE /api/promotions/bogo/[id] - Delete BOGO promotion

Business Logic:
- Hard delete if 0 applications
- Soft delete (deactivate) if applications exist
- Preserve audit trail',
ARRAY[
  'app/promotions/manage/page.tsx',
  'app/api/promotions/bogo/[id]/route.ts'
],
ARRAY[
  'PromotionsList',
  'DeleteConfirmationDialog'
],
'BOGO-001',
NOW(),
NOW()),

-- BOGO-004: View BOGO Promotion Performance
('BOGO-004',
'View BOGO Promotion Performance',
'This feature provides marketing managers with detailed analytics on BOGO promotion performance, including application count, revenue impact, customer participation, and product-level insights. The dashboard shows which BOGO promotions are driving the most sales and which products are most popular as rewards.',
'Marketing Manager',
'I want to view BOGO promotion performance metrics',
'So that I can understand which promotional campaigns are most effective and optimize future promotions',
'Done',
'High',
5,
'BOGO Promotions',
'Scenario 1: View BOGO Performance Dashboard
Given I am logged in as a marketing manager
And I navigate to the Promotions History page
When I filter by "BOGO" promotion type
Then I see a list of all BOGO promotions
And each promotion shows: applications count, revenue impact, date range, status
And I can sort by performance metrics

Scenario 2: View Detailed BOGO Analytics
Given I click on a specific BOGO promotion
When I view the promotion details
Then I see: total applications, unique customers, revenue with/without promotion
And I see a chart of applications over time
And I see top trigger products and top reward products

Scenario 3: Compare BOGO Promotions
Given multiple BOGO promotions exist
When I select 2-3 promotions to compare
Then I see a side-by-side comparison of performance metrics
And I can identify which promotion structure works best',
'API Endpoints:
- GET /api/analytics/promotions?type=bogo - Get BOGO analytics
- GET /api/promotions/bogo/[id]/analytics - Get detailed promotion analytics

Metrics Calculated:
- Application count
- Revenue impact (with vs without promotion)
- Customer participation rate
- Average order value with BOGO
- Top trigger/reward products',
ARRAY[
  'app/promotions/history/page.tsx',
  'components/analytics/promotion-performance.tsx',
  'app/api/analytics/promotions/route.ts'
],
ARRAY[
  'PromotionPerformance',
  'PromotionComparisonChart',
  'PromotionMetrics'
],
'BOGO-001, Analytics Dashboard',
NOW(),
NOW()),

-- BOGO-005: Brand-Level BOGO Configuration
('BOGO-005',
'Brand-Level BOGO Configuration',
'This feature allows marketing managers to create BOGO promotions at the brand level, where purchasing any product from a specific brand triggers a reward from the same or different brand. The system automatically handles product selection and applies the promotion to the lowest-priced eligible item.',
'Marketing Manager',
'I want to create brand-level BOGO promotions',
'So that I can drive sales across entire brand portfolios and create flexible promotional campaigns',
'Done',
'High',
8,
'BOGO Promotions',
'Scenario 1: Create Same-Brand BOGO
Given I am creating a BOGO promotion
And I select "Brand Level" as the scope
And I select "Incredibles" as the trigger brand
And I enter "1" as the trigger quantity
And I select "Incredibles" as the reward brand
And I select "Free" as the reward type
When I create the promotion
Then customers who buy any Incredibles product get another Incredibles product free
And the system selects the lowest-priced Incredibles item as the free reward

Scenario 2: Create Cross-Brand BOGO
Given I am creating a BOGO promotion
And I select "Brand Level" as the scope
And I select "Wana" as the trigger brand
And I select "Incredibles" as the reward brand (different brand)
When I create the promotion
Then customers who buy any Wana product get an Incredibles product free
And the cross-brand promotion is applied correctly

Scenario 3: Brand BOGO with Multiple Trigger Items
Given a brand-level BOGO exists: Buy Incredibles, Get Incredibles Free
And a customer adds 3 Incredibles products to their cart
When the pricing engine calculates the cart
Then the customer gets 1 free Incredibles product (lowest priced)
And the other 2 are charged at full price',
'API Endpoints:
- POST /api/promotions/bogo - Create brand-level BOGO
- GET /api/products?brand=[brand] - Get products by brand

Pricing Engine Logic:
- Identify all products matching trigger brand
- Identify all products matching reward brand
- Select lowest-priced reward item
- Apply discount to selected item',
ARRAY[
  'app/promotions/new/page.tsx',
  'components/promotions/wizard-steps/bogo-type-step.tsx',
  'components/promotions/wizard-steps/bogo-trigger-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/promotions/bogo/route.ts'
],
ARRAY[
  'BogoPromotionWizard',
  'BogoTypeStep',
  'BogoTriggerStep'
],
'BOGO-001, Product Management',
NOW(),
NOW()),

-- BOGO-006: Category-Level BOGO Configuration
('BOGO-006',
'Category-Level BOGO Configuration',
'This feature allows marketing managers to create BOGO promotions at the category level (e.g., Edibles, Vapes, Flower), where purchasing any product from a specific category triggers a reward from the same or different category. This enables broad promotional campaigns across product types.',
'Marketing Manager',
'I want to create category-level BOGO promotions',
'So that I can drive sales across entire product categories and create flexible promotional campaigns',
'Done',
'High',
8,
'BOGO Promotions',
'Scenario 1: Create Same-Category BOGO
Given I am creating a BOGO promotion
And I select "Category Level" as the scope
And I select "Edibles" as the trigger category
And I enter "1" as the trigger quantity
And I select "Edibles" as the reward category
And I select "Free" as the reward type
When I create the promotion
Then customers who buy any Edibles product get another Edibles product free
And the system selects the lowest-priced Edibles item as the free reward

Scenario 2: Create Cross-Category BOGO
Given I am creating a BOGO promotion
And I select "Vapes" as the trigger category
And I select "Edibles" as the reward category (different category)
When I create the promotion
Then customers who buy any Vapes product get an Edibles product free

Scenario 3: Category BOGO Exclusions
Given a category-level BOGO exists for Edibles
And certain high-value Edibles products are marked as excluded
When a customer buys an excluded Edibles product
Then the BOGO promotion does not apply
And the customer is informed of the exclusion',
'API Endpoints:
- POST /api/promotions/bogo - Create category-level BOGO
- GET /api/products?category=[category] - Get products by category

Pricing Engine Logic:
- Identify all products matching trigger category
- Identify all products matching reward category
- Handle exclusions list
- Select lowest-priced eligible reward item',
ARRAY[
  'app/promotions/new/page.tsx',
  'components/promotions/wizard-steps/bogo-type-step.tsx',
  'components/promotions/wizard-steps/bogo-trigger-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/promotions/bogo/route.ts'
],
ARRAY[
  'BogoPromotionWizard',
  'BogoTypeStep',
  'BogoTriggerStep'
],
'BOGO-001, Product Management',
NOW(),
NOW()),

-- BOGO-007: BOGO Customer Targeting
('BOGO-007',
'BOGO Customer Targeting',
'This feature allows marketing managers to target BOGO promotions to specific customer segments, tiers, or individual customers. The system validates customer eligibility at checkout and only applies the BOGO promotion if the customer meets the targeting criteria.',
'Marketing Manager',
'I want to target BOGO promotions to specific customers',
'So that I can create personalized promotional campaigns and reward loyal customers',
'Done',
'Medium',
5,
'BOGO Promotions',
'Scenario 1: Create Tier-Targeted BOGO
Given I am creating a BOGO promotion
And I enable customer targeting
And I select "Tier A" customers only
When I create the promotion
Then only Tier A customers see and can use the BOGO promotion
And Tier B and C customers do not see the promotion

Scenario 2: Create Customer-Specific BOGO
Given I am creating a BOGO promotion
And I enable customer targeting
And I select specific customers: Customer X, Customer Y
When I create the promotion
Then only Customer X and Customer Y can use the promotion
And other customers do not see it

Scenario 3: Validation - Customer Not Eligible
Given a BOGO promotion is targeted to Tier A customers only
And Customer Z is in Tier B
When Customer Z tries to use the promotion
Then the promotion does not apply
And Customer Z sees a message "This promotion is not available for your account"',
'API Endpoints:
- POST /api/promotions/bogo - Create BOGO with customer targeting
- GET /api/customers/[id]/eligibility - Check customer eligibility

Validation Logic:
- Check customer tier assignment
- Check customer-specific targeting
- Validate at checkout before applying discount',
ARRAY[
  'components/promotions/wizard-steps/bogo-targeting-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/promotions/bogo/route.ts'
],
ARRAY[
  'BogoPromotionWizard',
  'BogoTargetingStep',
  'CustomerSelector'
],
'BOGO-001, Customer Management',
NOW(),
NOW()),

-- BOGO-008: BOGO Stacking Rules
('BOGO-008',
'BOGO Stacking Rules',
'This feature allows marketing managers to configure whether BOGO promotions can stack with other discounts (customer discounts, inventory discounts, volume pricing, etc.). The system enforces stacking rules at checkout and selects the best combination of discounts for the customer based on the configured strategy.',
'Marketing Manager',
'I want to configure BOGO stacking rules',
'So that I can control how BOGO promotions interact with other discounts and prevent excessive discounting',
'Done',
'Medium',
5,
'BOGO Promotions',
'Scenario 1: BOGO with No Stacking
Given I am creating a BOGO promotion
And I set stacking to "No Stacking"
And a customer has a 10% customer discount
When the customer uses the BOGO promotion
Then the system applies either the BOGO or the 10% discount (whichever is better)
And both discounts do not stack

Scenario 2: BOGO with Limited Stacking
Given I am creating a BOGO promotion
And I set stacking to "Stack with Customer Discounts Only"
And a customer has a 10% customer discount
When the customer uses the BOGO promotion
Then both the BOGO and the 10% discount apply
And the customer gets the combined benefit

Scenario 3: Best Discount Selection
Given a BOGO promotion offers a free item (value $20)
And a customer discount offers 15% off (value $18 on this order)
And stacking is disabled
When the pricing engine calculates the best discount
Then the BOGO promotion is applied (higher value)
And the customer discount is not applied',
'API Endpoints:
- POST /api/promotions/bogo - Create BOGO with stacking rules

Pricing Engine Logic:
- lib/pricing/engine.ts - selectBestDiscount() method
- Calculate value of each discount option
- Apply stacking rules
- Select best combination for customer',
ARRAY[
  'components/promotions/wizard-steps/bogo-stacking-step.tsx',
  'lib/pricing/engine.ts',
  'app/api/promotions/bogo/route.ts'
],
ARRAY[
  'BogoPromotionWizard',
  'BogoStackingStep',
  'DiscountStrategySelector'
],
'BOGO-001, Pricing Engine',
NOW(),
NOW());

-- Verification
SELECT 'Total BOGO Promotions stories:' as info, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'BOGO Promotions';

SELECT 'BOGO stories by priority:' as info, priority, COUNT(*) as count 
FROM user_stories 
WHERE epic = 'BOGO Promotions'
GROUP BY priority
ORDER BY 
  CASE priority 
    WHEN 'Critical' THEN 1 
    WHEN 'High' THEN 2 
    WHEN 'Medium' THEN 3 
    WHEN 'Low' THEN 4 
  END;
