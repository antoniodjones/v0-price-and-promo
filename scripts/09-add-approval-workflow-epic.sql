-- Script to add Approval Workflow epic and tasks
-- Run this script to add the approval workflow feature set to the task planning database

-- Step 1: Insert Approval Workflow tasks
INSERT INTO user_stories (
  id, title, description, status, priority, story_points, 
  tasks, dependencies, labels, epic, acceptance_criteria,
  created_by, updated_by
)
VALUES
-- Renamed task IDs from "approval-" to "apr-" prefix
('apr-001', 'Create Approval Database Schema', 'Design and implement database tables for approval_requests, approval_history, and approval_rules with proper relationships and indexes', 'To Do', 'High', 5, '[]', '[]', '["Build", "Database"]', 'Approval Workflow', '["Tables created with proper schema", "Indexes added for performance", "Foreign keys established", "Migration script tested"]', 'system', 'system'),

('apr-002', 'Build Approval Engine Core', 'Implement the core approval workflow engine that evaluates rules, routes requests, and enforces approval gates based on thresholds and user roles', 'To Do', 'High', 13, '[]', '["apr-001"]', '["Build", "Backend"]', 'Approval Workflow', '["Rule evaluation logic implemented", "Approval routing working", "Threshold checks functional", "Multi-level approvals supported"]', 'system', 'system'),

('apr-003', 'Create Approval API Endpoints', 'Build REST API endpoints for submitting approval requests, approving/rejecting items, fetching approval queues, and retrieving approval history', 'To Do', 'High', 8, '[]', '["apr-001", "apr-002"]', '["Build", "Backend"]', 'Approval Workflow', '["POST /api/approvals/request endpoint", "POST /api/approvals/approve endpoint", "POST /api/approvals/reject endpoint", "GET /api/approvals/queue endpoint", "GET /api/approvals/history endpoint"]', 'system', 'system'),

('apr-004', 'Build Approval Queue Dashboard', 'Create a manager dashboard showing pending approvals with filtering, sorting, bulk actions, and detailed request information', 'To Do', 'High', 8, '[]', '["apr-003"]', '["Build", "UI"]', 'Approval Workflow', '["Dashboard displays pending approvals", "Filter by type/priority/date", "Bulk approve/reject actions", "Request details modal", "Real-time updates"]', 'system', 'system'),

('apr-005', 'Implement Approval Notifications', 'Build notification system that alerts approvers via email and in-app when approval is needed, and notifies requesters of approval decisions', 'To Do', 'Medium', 5, '[]', '["apr-002", "apr-003"]', '["Build", "Integration"]', 'Approval Workflow', '["Email notifications sent to approvers", "In-app notifications working", "Requesters notified of decisions", "Notification preferences respected"]', 'system', 'system'),

('apr-006', 'Add Approval Gates to Wizards', 'Integrate approval workflow into pricing, discount, and promotion wizards so items requiring approval are submitted to approval queue instead of being immediately active', 'To Do', 'Medium', 8, '[]', '["apr-002", "apr-003"]', '["Build", "Integration"]', 'Approval Workflow', '["Wizards check approval requirements", "Items submitted to approval queue", "Approval status displayed", "Users notified of submission"]', 'system', 'system'),

('apr-007', 'Build Approval History & Audit Trail', 'Create comprehensive audit trail showing all approval actions with who approved/rejected what, when, and why, with export capabilities', 'To Do', 'Low', 5, '[]', '["apr-003"]', '["Build", "UI"]', 'Approval Workflow', '["History page shows all approvals", "Filter by user/date/type/status", "Export to CSV/PDF", "Detailed audit information", "Compliance-ready reporting"]', 'system', 'system');

-- Step 2: Verify the changes
SELECT 'Total tasks after update:' as info, COUNT(*) as count FROM user_stories
UNION ALL
SELECT 'Approval Workflow tasks:' as info, COUNT(*) as count FROM user_stories WHERE epic = 'Approval Workflow'
UNION ALL
SELECT 'Approval Workflow story points:' as info, SUM(story_points) as count FROM user_stories WHERE epic = 'Approval Workflow'
UNION ALL
SELECT 'Total story points:' as info, SUM(story_points) as count FROM user_stories;
