-- =====================================================================================
-- Script 98: Add Promotion Management Epic (7 Stories)
-- =====================================================================================
-- Description: Creates comprehensive user stories for promotion management including
--              BOGO promotions, bundle deals, promotional campaigns, performance tracking,
--              scheduling, validation, and promotional codes.
-- 
-- Epic: Promotion Management (Phase 3 - Medium Priority)
-- Total Stories: 7
-- Total Story Points: 37
-- 
-- Dependencies: Pricing Engine, Product Management, Customer Management
-- =====================================================================================

-- Story 1: Create and Manage BOGO Promotions
INSERT INTO user_stories (
story_id, title, description, user_role, user_action, user_benefit,
status, priority, story_points, epic, acceptance_criteria,
technical_notes, linked_files, linked_components, dependencies,
created_at, updated_at)
VALUES
('PROMO-001',
'Create and Manage BOGO Promotions',
'This feature allows marketing managers to create Buy-One-Get-One (BOGO) promotional campaigns with flexible trigger and reward configurations. Users can define which products trigger the promotion, what products are rewarded, and set quantity thresholds. The system validates BOGO rules, prevents conflicts, and tracks performance.',
'Marketing Manager',
'create and manage BOGO promotions',
'I can drive sales and clear inventory with targeted promotional campaigns',
'Done',
'High',
5,
'Promotion Management',
'### Scenario 1: Create Simple BOGO Promotion
```gherkin
Given I am on the Promotions page
When I click "Create BOGO Promotion"
And I enter promotion details:
  | Field | Value |
  | Name | Buy 2 Get 1 Free - Blue Dream |
  | Trigger Product | Blue Dream 1g |
  | Trigger Quantity | 2 |
  | Reward Product | Blue Dream 1g |
  | Reward Quantity | 1 |
  | Start Date | April 1, 2025 |
  | End Date | April 30, 2025 |
And I click "Create Promotion"
Then the BOGO promotion is created
And it appears in the active promotions list
And customers receive the reward when purchasing 2+ units
