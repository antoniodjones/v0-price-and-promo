-- Add Analytics Dashboard Epic User Stories
-- Generated: January 2025
-- Epic: Analytics Dashboard
-- Stories: 8
-- Priority: High (Phase 2)

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

-- Story 1: View Analytics Dashboard Overview
('DASH-001',
'View Comprehensive Analytics Dashboard with Key Metrics',
'This feature provides a comprehensive analytics dashboard showing key business metrics including total revenue, active promotions, customer counts, product inventory, and discount performance. The dashboard aggregates data from multiple sources and presents it in an easy-to-understand format with charts and visualizations.',
'Business Manager',
'view a comprehensive analytics dashboard with key business metrics',
'I can monitor business performance and make data-driven decisions',
'Done',
'Critical',
8,
'Analytics Dashboard',
'### Scenario 1: View Dashboard Overview
\`\`\`gherkin
Given I am logged in as a business manager
When I navigate to the Analytics Dashboard
Then I see key metrics displayed:
  | Metric | Value |
  | Total Revenue (MTD) | $1,245,678 |
  | Active Promotions | 24 |
  | Total Customers | 1,247 |
  | Total Products | 456 |
  | Active Discounts | 18 |
And I see charts showing:
  - Revenue trend over time
  - Discount usage by type
  - Customer tier distribution
  - Product category breakdown
