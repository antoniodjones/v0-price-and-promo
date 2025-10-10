-- Script 123: Add D365 Integration Monitoring & Testing Dashboard Story
-- Creates user story for the webhook monitoring system

BEGIN;

-- Insert D365 Integration Monitoring story
INSERT INTO user_stories (
  story_id, title, description, status, priority, story_points,
  acceptance_criteria, technical_notes, epic, labels,
  created_by, updated_by, created_at, updated_at
)
VALUES (
  'SYS-009',
  'D365 Integration Monitoring & Testing Dashboard',
  'As a system administrator, I want to monitor D365 webhook activity, test webhook endpoints, and retry failed webhooks so that I can ensure reliable data synchronization between D365 and the promotions system.',
  'Done',
  'High',
  13,
  '### Scenario 1: View Webhook Dashboard
\`\`\`gherkin
Given I am logged in as an administrator
When I navigate to /admin/webhooks
Then I see the webhook monitoring dashboard
And I see real-time statistics: total webhooks, success rate, failed count, avg response time
And I see a filterable list of webhook logs
And I can filter by status (all/success/failed/pending)
And I can filter by entity type (customers/products)
And I can search webhook logs
And I see pagination controls
