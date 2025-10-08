-- Phase 4: Low Priority & Specialized Features
-- Epic 16: Customer Management (7 stories)
-- This epic covers customer record management, tier assignments, bulk operations, and customer analytics

-- Story 1: Create and Manage Customer Records
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
linked_files,
linked_components,
dependencies,
created_at,
updated_at
) VALUES
('CUST-001',
'Create and Manage Customer Records',
'This feature allows administrators to create, view, update, and delete customer records. Users can enter customer information including contact details, business information, and account settings. The system validates data and maintains customer history.',
'Administrator',
'create and manage customer records',
'I can maintain accurate customer information and track customer relationships',
'Done',
'High',
6,
'Customer Management',
'### Scenario 1: Create New Customer
```gherkin
Given I am on the Customer Management page
When I click "Add Customer"
And I enter customer details:
  | Field | Value |
  | Business Name | Green Valley Dispensary |
  | Contact Name | John Smith |
  | Email | john@greenvalley.com |
  | Phone | (555) 123-4567 |
  | Address | 123 Main St, Denver, CO 80202 |
  | Tax ID | 12-3456789 |
  | License Number | MED-12345 |
And I click "Create Customer"
Then the customer is created
And I see "Customer created successfully"
And the customer appears in the customer list
