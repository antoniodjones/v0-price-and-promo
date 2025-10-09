-- =====================================================================================
-- Script 92: Add Basket Testing Epic (6 Stories)
-- =====================================================================================
-- Description: Creates user stories for the Basket Testing feature
-- Epic: Basket Testing (6 stories, 30 story points)
-- Phase: 2 (High Priority Business Features)
-- =====================================================================================

-- Story 1: Create Test Basket with Multiple Products
INSERT INTO user_stories (
story_id, title, description, user_role, user_action, user_benefit,
status, priority, story_points, epic, acceptance_criteria,
technical_notes, related_files, related_components, dependencies,
created_at, updated_at
) VALUES
('BASKET-001',
'Create Test Basket with Multiple Products',
'This feature allows pricing managers to create test baskets with multiple products to validate pricing calculations. Users can add products, specify quantities, select customers and markets, and run pricing calculations to verify that all discounts and promotions are applied correctly.',
'Pricing Manager',
'create test baskets with multiple products',
'I can validate pricing calculations before deploying to production',
'Done',
'Critical',
5,
'Basket Testing',
'### Scenario 1: Create Basic Test Basket
\`\`\`gherkin
Given I am logged in as a pricing manager
And I navigate to the Basket Testing page
When I click "Create Test Basket"
And I add product "Blue Dream 1g" with quantity 50
And I add product "OG Kush 1g" with quantity 30
And I add product "Vape Pen" with quantity 20
And I select customer "ABC Dispensary"
And I select market "Colorado"
And I click "Calculate Pricing"
Then I see pricing results for each product:
  | Product | Qty | Base Price | Discounts | Final Price |
  | Blue Dream 1g | 50 | $1,250 | -$250 (20%) | $1,000 |
  | OG Kush 1g | 30 | $750 | -$112.50 (15%) | $637.50 |
  | Vape Pen | 20 | $300 | -$30 (10%) | $270 |
And I see the total basket value: $1,907.50
