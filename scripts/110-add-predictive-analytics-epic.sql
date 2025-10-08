-- =====================================================================================
-- Epic 21: Predictive Analytics (5 stories, ~25 points)
-- =====================================================================================
-- This epic implements predictive analytics features including sales forecasting,
-- inventory prediction, demand analysis, AI recommendations, and analytics exports.
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

-- Story 1: Forecast Sales Trends
('PRED-001',
'Forecast Sales Trends and Revenue',
'This feature uses machine learning to forecast future sales trends and revenue based on historical data, seasonality, and market factors. Users can view forecasts, confidence intervals, and scenario analysis.',
'Business Analyst',
'forecast sales trends and revenue',
'I can plan business strategy and set realistic targets',
'Done',
'High',
5,
'Predictive Analytics',
'### Scenario 1: View Sales Forecast
```gherkin
Given I am viewing sales forecasts
When I select forecast period: Next 90 days
Then I see revenue forecast:
  | Period | Forecasted Revenue | Confidence | vs Last Year |
  | Week 1 | $125,000 | 92% | +8% |
  | Week 2 | $142,000 | 89% | +12% |
  | Week 3 | $118,000 | 87% | +5% |
  | Week 4 | $135,000 | 90% | +10% |
And I see forecast chart with confidence intervals
And I see key forecast drivers
