-- Add Pricing Simulator Epic User Stories
-- Generated: January 2025
-- Epic: Pricing Simulator
-- Stories: 8
-- Priority: Critical (MVP Phase 1)
-- Gap: 60% (Feature built, limited documentation)

-- Epic: Pricing Simulator
-- Description: Interactive pricing simulation and testing tool
-- Business Value: Test pricing strategies, validate promotions, train staff
-- Technical Complexity: High (real-time calculation, complex scenarios, multi-promotion)

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

-- Story 1: Basic Price Simulation
('SIM-001',
'Simulate Pricing for Single Product',
'This feature allows users to simulate pricing for a single product by selecting the product, customer, market, and quantity. The system calculates the final price including all applicable discounts and promotions, showing a detailed breakdown of how the price was calculated.',
'Pricing Manager',
'simulate pricing for a single product to test pricing strategies',
'I can validate pricing logic and understand how discounts are applied',
'Done',
'Critical',
8,
'Pricing Simulator',
'### Scenario 1: Simulate Basic Product Price
\`\`\`gherkin
Given I am logged in as a pricing manager
And I navigate to the Pricing Simulator
When I select product "Blue Dream 1g"
And I select customer "ABC Dispensary"
And I select market "Colorado"
And I enter quantity "50"
And I click "Calculate Price"
Then I see the pricing breakdown:
  | Component | Value |
  | Base Price | $25.00 |
  | Volume Discount (15%) | -$3.75 |
  | Customer Tier Discount (5%) | -$1.25 |
  | Final Price per Unit | $20.00 |
  | Total (50 units) | $1,000.00 |
And I see which promotions were applied
