-- Add Rebate Reports Epic User Stories
-- Generated: January 2025
-- Epic: Rebate Reports
-- Stories: 6
-- Priority: Critical (MVP Phase 1)
-- Gap: 70% (Feature built, minimal documentation)

-- Epic: Rebate Reports
-- Description: Vendor rebate calculation, tracking, and reporting system
-- Business Value: Maximize vendor rebates, ensure accurate calculations, improve cash flow
-- Technical Complexity: Medium (data aggregation, calculation logic, reporting)

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

-- Story 1: Calculate Vendor Rebates
('REB-001',
'Calculate Vendor Rebates Based on Purchase Volume',
'This feature automatically calculates vendor rebates based on purchase volume and rebate agreements. The system tracks purchases by vendor, applies rebate rates, and calculates the total rebate amount owed. This is critical for maximizing vendor rebates and ensuring accurate financial tracking.',
'Finance Manager',
'automatically calculate vendor rebates based on purchase volume',
'I can maximize rebate revenue and ensure accurate financial tracking',
'Done',
'Critical',
8,
'Rebate Reports',
'### Scenario 1: Calculate Rebate for Single Vendor
```gherkin
Given I am logged in as a finance manager
And I navigate to the Rebate Reports page
When I select vendor "Rythm"
And I select the time period "Q1 2025"
And the rebate rate for Rythm is 15%
And total purchases from Rythm in Q1 are $18,840
When I click "Calculate Rebate"
Then the system calculates the rebate as $2,826.00 (18,840 * 0.15)
And I see a breakdown of purchases by product
And I see the rebate calculation details
