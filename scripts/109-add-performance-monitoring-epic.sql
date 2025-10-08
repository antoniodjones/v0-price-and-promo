-- =====================================================================================
-- Epic 20: Performance Monitoring (5 stories, ~25 points)
-- =====================================================================================
-- This epic implements system performance monitoring including health monitoring,
-- response time tracking, error monitoring, resource utilization, and performance reporting.
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

-- Story 1: Monitor System Health
('PERF-001',
'Monitor System Health and Availability',
'This feature provides real-time system health monitoring including uptime tracking, service availability, health checks, and system status. Users can view system health dashboards and receive alerts for issues.',
'System Administrator',
'monitor system health and availability',
'I can ensure system reliability and quickly respond to issues',
'Done',
'High',
5,
'Performance Monitoring',
'### Scenario 1: View System Health Dashboard
```gherkin
Given I am on the Performance Monitoring dashboard
Then I see system health overview:
  | Component | Status | Uptime | Last Check |
  | Web Application | ✓ Healthy | 99.98% | 30 sec ago |
  | Database | ✓ Healthy | 99.99% | 30 sec ago |
  | Cache (Redis) | ✓ Healthy | 99.95% | 30 sec ago |
  | API Services | ✓ Healthy | 99.97% | 30 sec ago |
And I see overall system status: "All Systems Operational"
And I see uptime chart for last 30 days
