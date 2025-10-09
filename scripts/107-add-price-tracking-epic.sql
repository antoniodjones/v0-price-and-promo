-- =====================================================================================
-- Epic 18: Price Tracking (5 stories, ~25 points)
-- =====================================================================================
-- This epic implements comprehensive price tracking functionality including historical
-- pricing, competitor monitoring, price alerts, market intelligence, and reporting.
-- =====================================================================================

INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_role,
  user_goal,
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

-- Story 1: Track Historical Pricing
('PRICE-001',
'Track Historical Pricing Data',
'This feature tracks all price changes over time for products, creating a comprehensive historical record. Users can view price history, analyze trends, and understand pricing patterns. The system automatically records all price changes with timestamps and user attribution.',
'Pricing Manager',
'track historical pricing data',
'I can analyze pricing trends and make data-driven pricing decisions',
'Done',
'High',
5,
'Price Tracking',
'### Scenario 1: View Product Price History
\`\`\`gherkin
Given I am viewing product "Blue Dream 1g"
When I click "Price History"
Then I see complete price history:
  | Date | Price | Change | Changed By | Reason |
  | 2025-03-15 | $23.00 | -$2.00 (-8%) | admin@example.com | Market adjustment |
  | 2025-02-01 | $25.00 | +$1.00 (+4%) | manager@example.com | Cost increase |
  | 2025-01-01 | $24.00 | - | system | Initial price |
And I see a chart showing price trends over time
And I can filter by date range
