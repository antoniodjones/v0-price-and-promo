-- Script to add GitLab Integration epic and tasks
-- Run this script to add GitLab integration feature set to the task planning database

-- Insert GitLab Integration tasks with Gherkin-formatted acceptance criteria
INSERT INTO user_stories (
  id, title, description, status, priority, story_points, 
  tasks, dependencies, labels, epic, acceptance_criteria,
  created_by, updated_by
)
VALUES
-- Phase 1: Core Service Foundation (21 SP)
('gl-001', 'Create GitLab Service Foundation', 'Implement core GitLab API service with authentication, token management, and base API client similar to GitHub service', 'To Do', 'Critical', 8, '[]', '[]', '["Build", "Backend", "Integration"]', 'GitLab Integration', 
'- Given a GitLab personal access token
- When the service initializes
- Then it should authenticate successfully with GitLab API
- And store the token securely in environment variables
- And provide methods for token refresh
- And handle authentication errors gracefully', 'system', 'system'),

('gl-002', 'Implement GitLab Repository Operations', 'Build repository management functions including branch operations, file operations, and commit creation', 'To Do', 'High', 8, '[]', '["gl-001"]', '["Build', "Backend"]', 'GitLab Integration',
'- Given an authenticated GitLab service
- When repository operations are called
- Then it should create/update/delete branches successfully
- And read/write files to the repository
- And create commits with proper metadata
- And handle merge conflicts appropriately
- And return detailed error messages on failure', 'system', 'system'),

('gl-003', 'Build GitLab Merge Request Management', 'Implement complete merge request lifecycle management including creation, updates, reviews, and merging', 'To Do', 'High', 5, '[]', '["gl-002"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given a GitLab repository with changes
- When a merge request is created
- Then it should include title, description, and source/target branches
- And support draft/ready status toggling
- And allow adding reviewers and assignees
- And enable merge when approved
- And handle merge conflicts with clear messaging', 'system', 'system'),

-- Phase 2: Issue & Label Management (13 SP)
('gl-004', 'Implement GitLab Issue Management', 'Build complete issue tracking integration with creation, updates, comments, and status management', 'To Do', 'High', 8, '[]', '["gl-001"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given an authenticated GitLab service
- When an issue is created
- Then it should include title, description, and labels
- And support assigning to users
- And allow adding comments
- And enable status transitions (open/closed)
- And link to related merge requests
- And sync with local user_stories table', 'system', 'system'),

('gl-005', 'Build GitLab Label Management', 'Implement label operations for consistent categorization across issues and merge requests', 'To Do', 'Medium', 5, '[]', '["gl-004"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given a GitLab project
- When labels are managed
- Then it should create labels with name and color
- And update existing labels
- And delete unused labels
- And apply labels to issues and MRs
- And sync labels with local task categories', 'system', 'system'),

-- Phase 3: Webhook Integration (13 SP)
('gl-006', 'Create GitLab Webhook Handler', 'Build webhook endpoint to receive and process GitLab events including pushes, MRs, and issues', 'To Do', 'Critical', 8, '[]', '["gl-001"]', '["Build", "Backend", "Integration"]', 'GitLab Integration',
'- Given a GitLab webhook is configured
- When a push event is received
- Then it should parse commit messages for task IDs
- And extract file changes from the diff
- And populate code_change_log table
- And update related user_stories
- And handle webhook signature verification
- And log all webhook events for debugging', 'system', 'system'),

('gl-007', 'Implement GitLab Event Processing', 'Build event processors for merge request and issue events with bi-directional sync', 'To Do', 'Medium', 5, '[]', '["gl-006"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given a GitLab MR or issue event
- When the webhook receives the event
- Then it should update local user_stories status
- And sync comments bi-directionally
- And update assignees and labels
- And track state changes in audit log
- And handle concurrent updates gracefully', 'system', 'system'),

-- Phase 4: Auto-Commit & Code Sync (21 SP)
('gl-008', 'Build GitLab Auto-Commit Detection', 'Implement automatic commit detection and task association similar to GitHub integration', 'To Do', 'High', 8, '[]', '["gl-002", "gl-006"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given code changes are detected
- When a commit is made
- Then it should parse commit message for task IDs
- And extract changed files and line counts
- And create code_change_log entries
- And link commits to user_stories
- And support multiple task IDs per commit
- And handle commits without task IDs gracefully', 'system', 'system'),

('gl-009', 'Implement GitLab Code Change Tracking', 'Build comprehensive code change tracking with file-level granularity and metrics', 'To Do', 'High', 8, '[]', '["gl-008"]', '["Build", "Backend"]', 'GitLab Integration',
'- Given a commit with file changes
- When code changes are tracked
- Then it should record files added/modified/deleted
- And calculate lines added/removed per file
- And track file types and categories
- And compute code complexity metrics
- And generate change impact reports
- And visualize change patterns over time', 'system', 'system'),

('gl-010', 'Create GitLab Retroactive Audit', 'Build tool to analyze GitLab history and populate historical code change data', 'To Do', 'Medium', 5, '[]', '["gl-008"]', '["Build", "Data Migration"]', 'GitLab Integration',
'- Given a GitLab repository with history
- When the retroactive audit runs
- Then it should extract all historical commits
- And infer task associations from commit messages
- And populate code_change_log with history
- And create retroactive tasks for untracked work
- And generate audit completion report
- And handle large repositories efficiently', 'system', 'system'),

-- Phase 5: Dual Provider Support (13 SP)
('gl-011', 'Build Git Provider Abstraction Layer', 'Create unified interface for both GitHub and GitLab with provider-agnostic operations', 'To Do', 'High', 8, '[]', '["gl-001"]', '["Build", "Backend", "Architecture"]', 'GitLab Integration',
'- Given multiple git providers are configured
- When a git operation is requested
- Then it should route to the correct provider
- And provide consistent API across providers
- And handle provider-specific features gracefully
- And support switching providers per project
- And maintain separate authentication per provider
- And log provider-specific errors clearly', 'system', 'system'),

('gl-012', 'Implement Provider Selection UI', 'Build user interface for selecting and configuring git provider per project', 'To Do', 'Medium', 5, '[]', '["gl-011"]', '["Build", "UI"]', 'GitLab Integration',
'- Given a user is configuring a project
- When they select a git provider
- Then it should show GitHub and GitLab options
- And display provider-specific configuration fields
- And validate credentials before saving
- And show connection status indicators
- And allow switching providers
- And preserve provider-specific settings', 'system', 'system'),

-- Phase 6: UI Integration (13 SP)
('gl-013', 'Build GitLab Task Detail Components', 'Create UI components showing GitLab-specific information in task detail views', 'To Do', 'High', 8, '[]', '["gl-004", "gl-005"]', '["Build", "UI"]', 'GitLab Integration',
'- Given a task linked to GitLab
- When the task detail is viewed
- Then it should display related GitLab issues
- And show linked merge requests
- And display commit history from GitLab
- And provide links to GitLab resources
- And show GitLab-specific badges and status
- And support inline commenting on GitLab issues', 'system', 'system'),

('gl-014', 'Create GitLab Analytics Dashboard', 'Build analytics dashboard showing GitLab-specific metrics and activity', 'To Do', 'Medium', 5, '[]', '["gl-009", "gl-013"]', '["Build", "UI"]', 'GitLab Integration',
'- Given GitLab integration is active
- When the analytics dashboard loads
- Then it should show GitLab commit activity
- And display merge request statistics
- And show issue resolution metrics
- And visualize code change patterns
- And compare GitHub vs GitLab activity
- And export GitLab-specific reports', 'system', 'system'),

-- Phase 7: Testing & Quality (13 SP)
('gl-015', 'Create GitLab Integration Tests', 'Build comprehensive test suite for GitLab service and webhook handlers', 'To Do', 'High', 8, '[]', '["gl-001", "gl-002", "gl-006"]', '["Testing", "Backend"]', 'GitLab Integration',
'- Given GitLab service is implemented
- When integration tests run
- Then it should test all API operations
- And mock GitLab API responses
- And test webhook event processing
- And verify error handling
- And test authentication flows
- And achieve >80% code coverage', 'system', 'system'),

('gl-016', 'Perform GitLab End-to-End Testing', 'Execute complete end-to-end testing of GitLab integration workflows', 'To Do', 'Medium', 5, '[]', '["gl-015"]', '["Testing"]', 'GitLab Integration',
'- Given a test GitLab project
- When end-to-end tests execute
- Then it should test complete commit workflow
- And verify merge request lifecycle
- And test issue creation and sync
- And validate webhook processing
- And test dual provider scenarios
- And generate test coverage report', 'system', 'system'),

-- Phase 8: Documentation & Deployment (8 SP)
('gl-017', 'Create GitLab Integration Documentation', 'Write comprehensive documentation for GitLab integration setup and usage', 'To Do', 'High', 5, '[]', '["gl-001", "gl-006", "gl-011"]', '["Documentation"]', 'GitLab Integration',
'- Given GitLab integration is complete
- When documentation is written
- Then it should include setup instructions
- And document webhook configuration
- And explain provider selection
- And provide troubleshooting guide
- And include API reference
- And show example workflows', 'system', 'system'),

('gl-018', 'Deploy GitLab Integration', 'Deploy GitLab integration to production with monitoring and rollback plan', 'To Do', 'High', 3, '[]', '["gl-015", "gl-016", "gl-017"]', '["Deployment"]', 'GitLab Integration',
'- Given all GitLab features are tested
- When deployment occurs
- Then it should deploy without downtime
- And configure production webhooks
- And set up monitoring alerts
- And verify production connectivity
- And document rollback procedure
- And notify team of deployment', 'system', 'system');

-- Verify the changes
SELECT 'Total tasks after update:' as info, COUNT(*) as count FROM user_stories
UNION ALL
SELECT 'GitLab Integration tasks:' as info, COUNT(*) as count FROM user_stories WHERE epic = 'GitLab Integration'
UNION ALL
SELECT 'GitLab Integration story points:' as info, SUM(story_points) as count FROM user_stories WHERE epic = 'GitLab Integration'
UNION ALL
SELECT 'Total story points:' as info, SUM(story_points) as count FROM user_stories;
