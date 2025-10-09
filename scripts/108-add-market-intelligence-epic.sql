-- =====================================================================================
-- Epic 19: Market Intelligence (5 stories, ~25 points)
-- =====================================================================================
-- This epic implements market intelligence features including competitor analysis,
-- market trend tracking, price positioning, demand forecasting, and intelligence reporting.
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

-- Story 1: Analyze Competitor Pricing Strategies
('MARKET-001',
'Analyze Competitor Pricing Strategies',
'This feature provides deep analysis of competitor pricing strategies including pricing patterns, promotional tactics, price positioning, and competitive responses. Users can identify competitor strategies and develop counter-strategies.',
'Market Analyst',
'analyze competitor pricing strategies',
'I can understand competitive dynamics and develop effective pricing strategies',
'Done',
'High',
5,
'Market Intelligence',
'### Scenario 1: Analyze Competitor Pricing Patterns
\`\`\`gherkin
Given I am analyzing competitor "Green Leaf Dispensary"
When I view their pricing strategy analysis
Then I see pricing pattern insights:
  | Pattern | Frequency | Impact |
  | Weekend promotions | Weekly | High volume |
  | Bundle discounts | Monthly | Medium volume |
  | Loyalty rewards | Ongoing | Customer retention |
  | Flash sales | 2-3x/month | High urgency |
And I see pricing philosophy: "Value leader"
And I see average discount depth: 15-20%
