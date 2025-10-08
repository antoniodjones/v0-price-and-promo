-- =====================================================================================
-- Epic 13: User Management (Phase 3 - Medium Priority)
-- =====================================================================================
-- Description: Comprehensive user account management including user creation, role
--              assignment, permission management, activity tracking, and bulk operations.
-- Stories: 7 stories, ~35 story points
-- Dependencies: System Configuration, Audit Logging
-- =====================================================================================

-- Story 1: Create and Manage User Accounts
INSERT INTO user_stories (
  story_id, title, description, user_role, user_action, user_benefit,
  status, priority, story_points, epic, acceptance_criteria,
  technical_notes, linked_files, linked_components, dependencies,
  created_at, updated_at
) VALUES
('USER-001',
'Create and Manage User Accounts',
'This feature allows administrators to create, edit, and manage user accounts including profile information, contact details, and account status. Users can be activated, deactivated, or deleted. The system validates user information and prevents duplicate accounts.',
'System Administrator',
'create and manage user accounts',
'I can control who has access to the system and maintain accurate user records',
'Done',
'High',
5,
'User Management',
'### Scenario 1: Create New User Account
```gherkin
Given I am on the User Management page
When I click "Add User"
And I enter user details:
  | Field | Value |
  | First Name | John |
  | Last Name | Smith |
  | Email | john.smith@example.com |
  | Phone | (555) 123-4567 |
  | Department | Sales |
  | Job Title | Sales Manager |
  | Status | Active |
And I click "Create User"
Then the user account is created
And John receives a welcome email with login instructions
And I see "User created successfully"
