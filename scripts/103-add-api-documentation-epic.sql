-- =====================================================================================
-- Epic 14: API Documentation (Phase 3 - Medium Priority)
-- =====================================================================================
-- Description: Interactive API documentation with endpoint testing, code examples,
--              authentication guides, and developer resources.
-- Stories: 7 stories, ~35 story points
-- Dependencies: System Configuration
-- =====================================================================================

-- Story 1: Interactive API Documentation
INSERT INTO user_stories (
  story_id, title, description, user_role, user_action, user_benefit,
  status, priority, story_points, epic, acceptance_criteria,
  technical_notes, linked_files, linked_components, dependencies,
  created_at, updated_at
) VALUES
('API-001',
'Browse Interactive API Documentation',
'This feature provides comprehensive, interactive API documentation for all system endpoints. Developers can browse endpoints by category, view detailed specifications, see request/response examples, and understand authentication requirements. The documentation is auto-generated from code and always up-to-date.',
'API Developer',
'browse interactive API documentation',
'I can understand and integrate with the API quickly',
'Done',
'High',
5,
'API Documentation',
'### Scenario 1: Browse API Endpoints
\`\`\`gherkin
Given I am on the API Documentation page
Then I see endpoint categories:
  - Authentication (5 endpoints)
  - Products (12 endpoints)
  - Pricing (15 endpoints)
  - Discounts (10 endpoints)
  - Promotions (8 endpoints)
  - Orders (14 endpoints)
  - Reports (9 endpoints)
  - Users (11 endpoints)
And I can expand each category to see endpoints
