-- =====================================================================================
-- Script 88: Add Discount Analytics Epic (6 Stories)
-- =====================================================================================
-- Epic: Discount Analytics
-- Description: Comprehensive analytics for discount performance, usage patterns, ROI,
--              and optimization recommendations
-- Stories: 6 (DISC-ANA-001 through DISC-ANA-006)
-- Total Story Points: 31
-- =====================================================================================

-- Insert Discount Analytics Epic Stories
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_role,
  user_action,
  user_benefit,
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

-- Story 1: Discount Usage Analytics
('DISC-ANA-001',
'View Discount Usage Analytics and Trends',
'This feature provides comprehensive analytics on discount usage including total applications, usage by type, trends over time, and customer adoption rates. Business managers can identify which discounts are most popular and track usage patterns to optimize discount strategies.',
'Business Manager',
'view discount usage analytics and trends',
'I can understand which discounts are most effective and optimize strategies',
'Done',
'High',
5,
'Discount Analytics',
'### Scenario 1: View Discount Usage Overview
\`\`\`gherkin
Given I am logged in as a business manager
When I navigate to the Discount Analytics page
Then I see discount usage metrics:
  | Metric | Value |
  | Total Discount Applications | 12,456 |
  | Customer Discounts | 5,678 (46%) |
  | Inventory Discounts | 3,234 (26%) |
  | Volume Discounts | 2,123 (17%) |
  | BOGO Promotions | 1,421 (11%) |
And I see a chart showing discount usage trends over time
