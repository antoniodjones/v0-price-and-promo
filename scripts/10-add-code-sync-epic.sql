-- Script to add Code Sync epic and tasks
-- Run this script to add the code-to-task traceability feature set to the task planning database

-- Step 1: Insert Code Sync tasks
INSERT INTO user_stories (
  id, title, description, status, priority, story_points, 
  tasks, dependencies, labels, epic, acceptance_criteria,
  created_by, updated_by
)
VALUES
-- Day 1: Foundation
('cs-001', 'Create Enhanced Database Schema', 'Design and implement enhanced database schema with code_change_log table, task-code mapping fields, and Jira integration columns for complete traceability', 'To Do', 'Critical', 4, '[]', '[]', '["Build", "Database"]', 'Code Sync', '["code_change_log table created", "user_stories table enhanced with git fields", "jira_sync_log table created", "Indexes added for performance", "RLS policies configured"]', 'system', 'system'),

-- Day 2: GitHub Integration + Retroactive Audit
('cs-002', 'Build GitHub Webhook Integration', 'Create webhook endpoint to receive GitHub push events, parse commit messages for task IDs, extract file changes, and automatically populate code_change_log table', 'To Do', 'Critical', 8, '[]', '["cs-001"]', '["Build", "Backend", "Integration"]', 'Code Sync', '["Webhook endpoint /api/webhooks/github created", "Commit message parser implemented", "File diff extraction working", "code_change_log auto-populated", "Error handling and retry logic"]', 'system', 'system'),

('cs-003', 'Perform Retroactive Code Audit', 'Analyze complete git history to extract all commits and file changes, infer task associations for untracked work, create retroactive tasks, and populate historical data in code_change_log', 'To Do', 'Critical', 12, '[]', '["cs-001"]', '["Build", "Data Migration"]', 'Code Sync', '["Git history extracted and parsed", "Task associations inferred", "Retroactive tasks created", "code_change_log populated with history", "Validation report generated"]', 'system', 'system'),

-- Day 3: Jira Integration
('cs-004', 'Build Jira API Integration', 'Implement complete Jira REST API integration with bi-directional sync, webhook listener, issue creation/update automation, and real-time status synchronization', 'To Do', 'Critical', 16, '[]', '["cs-001", "cs-002"]', '["Build", "Backend", "Integration"]', 'Code Sync', '["Jira API service layer created", "Bi-directional sync engine working", "Jira webhook endpoint implemented", "Issue creation/update automated", "Conflict resolution logic", "Retry and error handling"]', 'system', 'system'),

-- Day 4: UI Components + Code Annotations
('cs-005', 'Build Task-Code Linker UI', 'Create comprehensive UI components for task detail page showing related files, commit history, file browser for manual linking, and code change visualization', 'To Do', 'High', 8, '[]', '["cs-002", "cs-003"]', '["Build", "UI"]', 'Code Sync', '["Task detail page enhanced", "Related Files section displays changes", "File browser/selector working", "Manual file linking capability", "Commit history timeline", "Code metrics displayed"]', 'system', 'system'),

('cs-006', 'Add Code Annotations', 'Add standardized task annotations to all existing code files, create annotation linter/validator, build extraction tool, and generate comprehensive task-file mapping report', 'To Do', 'High', 6, '[]', '["cs-003"]', '["Build", "Documentation"]', 'Code Sync', '["All files annotated with @task tags", "Annotation linter created", "Extraction tool working", "Task-file mapping report generated", "Annotation standards documented"]', 'system', 'system'),

-- Day 5: Analytics, Documentation & Handoff
('cs-007', 'Build Analytics Dashboard', 'Create analytics dashboard showing code metrics per task, commit activity, Jira sync status, traceability reports, and team velocity metrics', 'To Do', 'Medium', 6, '[]', '["cs-002", "cs-004", "cs-005"]', '["Build", "UI"]', 'Code Sync', '["Analytics dashboard created", "Code metrics per task displayed", "Commit activity visualization", "Jira sync status monitoring", "Traceability reports", "Export capabilities"]', 'system', 'system'),

('cs-008', 'Create Documentation & Handoff Materials', 'Write comprehensive developer documentation, create workflow diagrams, document Jira integration setup, record demo video, and create troubleshooting guide for team handoff', 'To Do', 'High', 4, '[]', '["cs-001", "cs-002", "cs-003", "cs-004", "cs-005", "cs-006", "cs-007"]', '["Documentation"]', 'Code Sync', '["Developer documentation complete", "Workflow diagrams created", "Jira setup guide written", "Demo video recorded", "Troubleshooting guide created", "API documentation complete"]', 'system', 'system');

-- Step 2: Verify the changes
SELECT 'Total tasks after update:' as info, COUNT(*) as count FROM user_stories
UNION ALL
SELECT 'Code Sync tasks:' as info, COUNT(*) as count FROM user_stories WHERE epic = 'Code Sync'
UNION ALL
SELECT 'Code Sync story points:' as info, SUM(story_points) as count FROM user_stories WHERE epic = 'Code Sync'
UNION ALL
SELECT 'Total story points:' as info, SUM(story_points) as count FROM user_stories;
