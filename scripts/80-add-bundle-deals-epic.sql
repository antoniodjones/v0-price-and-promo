-- Add Bundle Deals Epic User Stories
-- Generated: January 2025
-- Epic: Bundle Deals
-- Stories: 6
-- Priority: Critical (MVP Phase 1)
-- Gap: 100% (Feature built, no documentation)

-- Epic: Bundle Deals
-- Description: Multi-product bundle promotions with flexible pricing strategies
-- Business Value: Increase average order value, move slow inventory, create compelling offers
-- Technical Complexity: Medium (product selection, pricing calculation, validation)

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

-- Story 1: Create Bundle Deal with Fixed Pricing
('BUNDLE-001',
'Create Bundle Deal with Fixed Pricing',
'This feature allows pricing managers to create bundle deals where customers purchase multiple products together at a fixed bundle price. The system validates product selection, calculates savings, and enforces bundle rules during checkout. This is critical for creating compelling multi-product offers that increase average order value.',
'Pricing Manager',
'create bundle deals with fixed pricing for multiple products',
'I can increase average order value and create compelling multi-product offers',
'Done',
'Critical',
8,
'Bundle Deals',
'### Scenario 1: Create Fixed-Price Bundle Deal
\`\`\`gherkin
Given I am logged in as a pricing manager
And I navigate to the Bundle Deals page
When I click "Create New Bundle"
And I enter "Starter Pack" as the bundle name
And I select "Fixed Price" as the pricing strategy
And I add "Blue Dream 1g" to the bundle
And I add "Vape Pen" to the bundle
And I add "Rolling Papers" to the bundle
And I set the bundle price to "$45.00"
And I set the start date to today
And I leave the end date blank
And I click "Create Bundle"
Then the bundle deal is created successfully
And I see a success message "Bundle deal created successfully"
And the bundle appears in the active bundles list
And the savings calculation shows the discount from individual prices
