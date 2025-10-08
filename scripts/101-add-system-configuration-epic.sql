-- =====================================================================================
-- Epic 12: System Configuration (Phase 3 - Medium Priority)
-- =====================================================================================
-- Description: Comprehensive system configuration management for business settings,
--              market configurations, compliance settings, and system preferences.
-- Stories: 6 stories, ~30 story points
-- Dependencies: User Management, Audit Logging
-- =====================================================================================

-- Story 1: Configure Business Settings
INSERT INTO user_stories (
  story_id, title, description, user_role, user_action, user_benefit,
  status, priority, story_points, epic, acceptance_criteria,
  technical_notes, linked_files, linked_components, dependencies,
  created_at, updated_at
) VALUES
('CONFIG-001',
'Configure Business Settings and Rules',
'This feature allows system administrators to configure core business settings including discount limits, pricing rules, margin requirements, and operational parameters. Users can set global defaults, configure validation rules, and manage business constraints. The system validates settings and prevents invalid configurations.',
'System Administrator',
'configure business settings and rules',
'I can ensure the system operates according to business policies and requirements',
'Done',
'High',
5,
'System Configuration',
'### Scenario 1: Configure Discount Limits
```gherkin
Given I am on the Settings page
When I navigate to "Business Rules" > "Discounts"
And I configure discount settings:
  | Setting | Value |
  | Maximum Discount | 50% |
  | Require Approval Above | 25% |
  | Minimum Margin | 15% |
  | Allow Stacking | Yes |
  | Max Stacked Discounts | 3 |
And I click "Save Changes"
Then the discount settings are updated
And all discount rules validate against these limits
And I see confirmation "Discount settings saved successfully"
