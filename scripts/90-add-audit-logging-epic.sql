-- =====================================================================================
-- Script 90: Add Audit Logging Epic (6 Stories)
-- =====================================================================================
-- Epic: Audit Logging
-- Description: Comprehensive audit trail for all system activities including pricing
--              calculations, discount applications, user actions, and system changes
-- Stories: 6 (AUDIT-001 through AUDIT-006)
-- Total Story Points: 31
-- =====================================================================================

-- Insert Audit Logging Epic Stories
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

-- Story 1: Comprehensive Audit Trail
('AUDIT-001',
'Maintain Comprehensive Audit Trail for All System Activities',
'This feature logs all significant system activities including pricing calculations, discount applications, user actions, configuration changes, and data modifications. The audit trail provides complete traceability for compliance, debugging, and security purposes.',
'System Administrator',
'view a comprehensive audit trail of all system activities',
'I can ensure compliance, debug issues, and maintain security',
'Done',
'Critical',
5,
'Audit Logging',
'### Scenario 1: View Audit Log
\`\`\`gherkin
Given I am logged in as a system administrator
When I navigate to the Audit Log page
Then I see a chronological list of all system activities:
  | Timestamp | User | Action | Entity | Details |
  | 2025-01-15 10:23 | john@example.com | Price Calculated | Product: Blue Dream | $20.00 → $18.00 (10% discount) |
  | 2025-01-15 10:22 | sarah@example.com | Discount Created | Customer Tier A | 20% discount |
  | 2025-01-15 10:20 | admin@example.com | User Created | john@example.com | Role: Pricing Manager |
And each entry shows complete details
