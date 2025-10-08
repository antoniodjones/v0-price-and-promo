-- =====================================================================================
-- Script 94: Add Customer Management Epic (7 Stories)
-- =====================================================================================
-- Description: Creates user stories for the Customer Management feature
-- Epic: Customer Management (7 stories, 36 story points)
-- Phase: 2 (High Priority Business Features)
-- =====================================================================================

-- Story 1: View Customer List and Details
INSERT INTO user_stories (
story_id, title, description, user_role, user_action, user_benefit,
status, priority, story_points, epic, acceptance_criteria,
technical_notes, related_files, related_components, dependencies,
created_at, updated_at
) VALUES
('CUST-001',
'View Customer List and Details',
'This feature provides a comprehensive customer list with search, filtering, and sorting capabilities. Business managers can view customer details including contact information, tier assignments, purchase history, and discount eligibility. The interface supports bulk operations and quick access to customer-specific actions.',
'Business Manager',
'view and search customer list with details',
'I can quickly find customers and access their information',
'Done',
'Critical',
5,
'Customer Management',
'### Scenario 1: View Customer List
```gherkin
Given I am logged in as a business manager
When I navigate to the Customers page
Then I see a list of all customers with:
  | Customer Name | Tier | Total Orders | Total Spend | Status |
  | ABC Dispensary | A | 234 | $456,789 | Active |
  | XYZ Retail | B | 156 | $234,567 | Active |
  | 123 Shop | C | 89 | $123,456 | Active |
And I can sort by any column
And I can filter by tier, status, or market
