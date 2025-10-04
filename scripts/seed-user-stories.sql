-- Migration script to populate user_stories table with all 59 tasks
-- This script seeds the database with Framework tasks and Tier Management tasks

-- Clear existing data (optional - remove if you want to keep existing stories)
-- DELETE FROM user_stories WHERE id LIKE 'framework-%' OR id LIKE 'tm-%';

-- Insert Framework Tasks (Phase 0-8: 25 tasks)
INSERT INTO user_stories (id, title, description, status, priority, story_points, tasks, dependencies, labels, epic, acceptance_criteria)
VALUES
-- Phase 0: Foundation & Module System
('framework-001', 'Implement Error Prevention Infrastructure', 'Add comprehensive error boundaries and null safety checks throughout the application', 'To Do', 'Critical', 8, '[]', '[]', '["Framework", "Error Handling"]', 'Phase 0: Foundation', '["Error boundaries implemented", "Null safety checks added", "Error logging configured"]'),
('framework-002', 'Create Modular Settings System', 'Implement feature flags and module-based configuration system for safer rollouts', 'To Do', 'Critical', 13, '[]', '[]', '["Framework", "Architecture"]', 'Phase 0: Foundation', '["Feature flags system created", "Module configuration implemented", "Settings UI built"]'),
('framework-003', 'Fix toLowerCase() Null Safety Issues', 'Add null checks to all 65+ toLowerCase() calls throughout the codebase', 'To Do', 'Critical', 5, '[]', '[]', '["Framework", "Bug Fix"]', 'Phase 0: Foundation', '["All toLowerCase calls have null checks", "Tests added for null safety", "Code review completed"]'),

-- Phase 1: Atomic Design
('framework-004', 'Create Basic UI Atoms', 'Build foundational UI components: Button, Input, Card, Badge, Loading indicators', 'To Do', 'High', 8, '[]', '[]', '["Framework", "UI Components"]', 'Phase 1: Atomic Design', '["Basic atoms created", "Component documentation written", "Storybook stories added"]'),
('framework-005', 'Build Form Molecules', 'Create reusable form components: SearchBox, FormField, ActionButtons', 'To Do', 'High', 5, '[]', '[]', '["Framework", "UI Components"]', 'Phase 1: Atomic Design', '["Form molecules built", "Validation integrated", "Accessibility tested"]'),
('framework-006', 'Create Data Display Molecules', 'Build components for data display: DataCell, MetricCard, AlertMessage', 'To Do', 'Medium', 5, '[]', '[]', '["Framework", "UI Components"]', 'Phase 1: Atomic Design', '["Display molecules created", "Responsive design verified", "Performance optimized"]'),

-- Phase 2: Layout & Navigation
('framework-007', 'Build Layout Organisms', 'Create AppLayout, Header, and Sidebar components with module-aware routing', 'To Do', 'High', 8, '[]', '[]', '["Framework", "Layout"]', 'Phase 2: Layout', '["Layout organisms built", "Module routing integrated", "Mobile responsive"]'),
('framework-008', 'Implement Navigation System', 'Build module-aware navigation with proper routing and breadcrumbs', 'To Do', 'High', 5, '[]', '[]', '["Framework", "Navigation"]', 'Phase 2: Layout', '["Navigation system implemented", "Breadcrumbs working", "Active states correct"]'),

-- Phase 3: Authentication
('framework-009', 'Add Auth Error Boundaries', 'Implement comprehensive error handling for authentication failures', 'To Do', 'High', 5, '[]', '[]', '["Framework", "Authentication"]', 'Phase 3: Authentication', '["Auth error boundaries added", "User-friendly error messages", "Retry logic implemented"]'),
('framework-010', 'Module-Aware Auth Integration', 'Integrate authentication with module system for feature-based access control', 'To Do', 'Medium', 8, '[]', '[]', '["Framework", "Authentication"]', 'Phase 3: Authentication', '["Auth integrated with modules", "Role-based access working", "Permissions tested"]'),

-- Phase 4: Pricing Engine
('framework-011', 'Refactor Pricing Engine - Null Safety', 'Fix all toLowerCase() calls and add null checks in pricing calculations', 'To Do', 'Critical', 8, '[]', '[]', '["Framework", "Pricing"]', 'Phase 4: Pricing Engine', '["Null safety added to pricing", "All edge cases handled", "Tests passing"]'),
('framework-012', 'Extract Pricing Business Logic', 'Move pricing calculations to pure functions for better testability', 'To Do', 'High', 13, '[]', '[]', '["Framework", "Pricing"]', 'Phase 4: Pricing Engine', '["Business logic extracted", "Pure functions created", "Unit tests added"]'),
('framework-013', 'Add Pricing Error Handling', 'Implement comprehensive error handling for pricing calculations', 'To Do', 'High', 5, '[]', '[]', '["Framework", "Pricing"]', 'Phase 4: Pricing Engine', '["Error handling added", "Fallback logic implemented", "Error logging configured"]'),

-- Phase 5: Discounts & Promotions
('framework-014', 'Safe Discount Filtering', 'Add null checks and safe filtering for discount operations', 'To Do', 'High', 5, '[]', '[]', '["Framework", "Discounts"]', 'Phase 5: Discounts', '["Null checks added", "Safe filtering implemented", "Edge cases tested"]'),
('framework-015', 'Simplify Promotion Wizards', 'Refactor promotion creation wizards for better UX and error handling', 'To Do', 'Medium', 8, '[]', '[]', '["Framework", "Promotions"]', 'Phase 5: Discounts', '["Wizards simplified", "UX improved", "Error handling enhanced"]'),
('framework-016', 'Module-Based Promotion Features', 'Add feature flags for promotion types and capabilities', 'To Do', 'Medium', 5, '[]', '[]', '["Framework", "Promotions"]', 'Phase 5: Discounts', '["Feature flags added", "Module integration complete", "Configuration tested"]'),

-- Phase 6: Analytics
('framework-017', 'Analytics Error Handling', 'Add comprehensive error handling to analytics infrastructure', 'To Do', 'Medium', 5, '[]', '[]', '["Framework", "Analytics"]', 'Phase 6: Analytics', '["Error handling added", "Graceful degradation implemented", "Monitoring configured"]'),
('framework-018', 'Analytics Null Safety', 'Add null checks to all analytics components and calculations', 'To Do', 'Medium', 5, '[]', '[]', '["Framework", "Analytics"]', 'Phase 6: Analytics', '["Null safety added", "Data validation implemented", "Tests passing"]'),
('framework-019', 'Refactor Reporting System', 'Improve reporting system with better error handling and performance', 'To Do', 'Low', 8, '[]', '[]', '["Framework", "Analytics"]', 'Phase 6: Analytics', '["Reporting refactored", "Performance improved", "Error handling enhanced"]'),

-- Phase 7: Admin
('framework-020', 'Build Module Management System', 'Create admin interface for managing feature flags and modules', 'To Do', 'Medium', 13, '[]', '[]', '["Framework", "Admin"]', 'Phase 7: Admin', '["Module management UI built", "Feature flags configurable", "Admin access controlled"]'),
('framework-021', 'Improve Audit Logging', 'Enhance audit logging system with better tracking and reporting', 'To Do', 'Low', 5, '[]', '[]', '["Framework", "Admin"]', 'Phase 7: Admin', '["Audit logging enhanced", "Reporting improved", "Compliance verified"]'),
('framework-022', 'Enhanced Data Management', 'Improve admin data management tools with better error handling', 'To Do', 'Low', 8, '[]', '[]', '["Framework", "Admin"]', 'Phase 7: Admin', '["Data management improved", "Error handling added", "Bulk operations supported"]'),

-- Phase 8: Advanced Features
('framework-023', 'Refine Real-Time Features', 'Optimize real-time updates and notifications system', 'To Do', 'Low', 8, '[]', '[]', '["Framework", "Real-Time"]', 'Phase 8: Advanced', '["Real-time optimized", "Notifications working", "Performance verified"]'),
('framework-024', 'Comprehensive Testing Suite', 'Build end-to-end testing suite for critical user flows', 'To Do', 'Medium', 13, '[]', '[]', '["Framework", "Testing"]', 'Phase 8: Advanced', '["E2E tests created", "Critical flows covered", "CI/CD integrated"]'),
('framework-025', 'Performance Optimization', 'Optimize application performance and loading times', 'To Do', 'Low', 8, '[]', '[]', '["Framework", "Performance"]', 'Phase 8: Advanced', '["Performance optimized", "Loading times improved", "Metrics tracked"]');

-- Insert Tier Management Tasks (Phase 1-4: 34 tasks)
INSERT INTO user_stories (id, title, description, status, priority, story_points, tasks, dependencies, labels, epic, acceptance_criteria)
VALUES
-- Phase 1: Database & Core APIs (15 tasks)
('tm-001', 'Create discount_rules table schema', 'Design and implement the core discount_rules table with all required fields', 'Done', 'Critical', 3, '[]', '[]', '["Build", "Database"]', 'Phase 1: Database & Core APIs', '["Table schema created", "Migrations run", "Indexes added"]'),
('tm-002', 'Create discount_rule_tiers table schema', 'Implement tier definitions table (A/B/C tiers with discount values)', 'Done', 'Critical', 3, '[]', '[]', '["Build", "Database"]', 'Phase 1: Database & Core APIs', '["Tier table created", "Foreign keys configured", "Data validated"]'),
('tm-003', 'Create customer_tier_assignments table', 'Implement per-rule customer tier assignment table', 'Done', 'Critical', 3, '[]', '[]', '["Build", "Database"]', 'Phase 1: Database & Core APIs', '["Assignment table created", "Relationships defined", "Constraints added"]'),
('tm-004', 'Create tier_assignment_audit table', 'Implement audit trail for tier assignment changes', 'Done', 'High', 2, '[]', '[]', '["Build", "Database"]', 'Phase 1: Database & Core APIs', '["Audit table created", "Triggers configured", "Logging working"]'),
('tm-005', 'Add database indexes for performance', 'Create indexes on frequently queried fields for optimal performance', 'Done', 'High', 2, '[]', '[]', '["Build", "Database"]', 'Phase 1: Database & Core APIs', '["Indexes created", "Query performance improved", "Execution plans verified"]'),
('tm-006', 'Create discount rules API endpoints', 'Implement CRUD API routes for discount rules management', 'Done', 'Critical', 5, '[]', '[]', '["Build", "API"]', 'Phase 1: Database & Core APIs', '["CRUD endpoints created", "Validation added", "Tests passing"]'),
('tm-007', 'Create tier configuration API endpoints', 'Implement API routes for managing tier definitions (A/B/C)', 'Done', 'Critical', 5, '[]', '[]', '["Build", "API"]', 'Phase 1: Database & Core APIs', '["Tier APIs created", "Documentation written", "Error handling added"]'),
('tm-008', 'Create customer assignment API endpoints', 'Implement API routes for assigning customers to tiers', 'Done', 'Critical', 5, '[]', '[]', '["Build", "API"]', 'Phase 1: Database & Core APIs', '["Assignment APIs created", "Bulk operations supported", "Validation working"]'),
('tm-009', 'Implement tier assignment validation logic', 'Add business rules validation for tier assignments', 'Done', 'High', 3, '[]', '[]', '["Build", "Business Logic"]', 'Phase 1: Database & Core APIs', '["Validation rules implemented", "Edge cases handled", "Tests added"]'),
('tm-010', 'Create audit logging service', 'Implement service to track all tier assignment changes', 'Done', 'High', 3, '[]', '[]', '["Build", "Audit"]', 'Phase 1: Database & Core APIs', '["Audit service created", "All changes logged", "Reporting available"]'),
('tm-011', 'Add error handling for API routes', 'Implement comprehensive error handling and validation', 'Done', 'High', 3, '[]', '[]', '["Build", "Error Handling"]', 'Phase 1: Database & Core APIs', '["Error handling added", "User-friendly messages", "Logging configured"]'),
('tm-012', 'Create data migration scripts', 'Build scripts to migrate existing discount data to new schema', 'Done', 'High', 5, '[]', '[]', '["Build", "Migration"]', 'Phase 1: Database & Core APIs', '["Migration scripts created", "Data migrated successfully", "Rollback tested"]'),
('tm-013', 'Implement rule conflict detection', 'Add logic to detect and prevent conflicting discount rules', 'Done', 'Medium', 3, '[]', '[]', '["Build", "Business Logic"]', 'Phase 1: Database & Core APIs', '["Conflict detection working", "Warnings displayed", "Prevention logic added"]'),
('tm-014', 'Add rule versioning support', 'Implement version control for discount rule changes', 'Done', 'Medium', 3, '[]', '[]', '["Build", "Versioning"]', 'Phase 1: Database & Core APIs', '["Versioning implemented", "History tracked", "Rollback supported"]'),
('tm-015', 'Create API documentation', 'Document all tier management API endpoints with examples', 'Done', 'Medium', 2, '[]', '[]', '["Documentation", "API Docs"]', 'Phase 1: Database & Core APIs', '["API docs written", "Examples provided", "Postman collection created"]'),

-- Phase 2: Wizard UI Enhancement (6 tasks)
('tm-016', 'Add tier configuration step to wizard', 'Extend discount wizard with tier definition interface (A/B/C)', 'Done', 'Critical', 8, '[]', '[]', '["Build", "UI"]', 'Phase 2: Wizard UI Enhancement', '["Wizard step added", "UI responsive", "Validation working"]'),
('tm-017', 'Build tier discount value input UI', 'Create interface for setting discount values per tier', 'Done', 'Critical', 5, '[]', '[]', '["Build", "UI"]', 'Phase 2: Wizard UI Enhancement', '["Input UI created", "Validation added", "UX tested"]'),
('tm-018', 'Create customer tier assignment interface', 'Build UI for assigning customers to tiers within a rule', 'Done', 'Critical', 8, '[]', '[]', '["Build", "UI"]', 'Phase 2: Wizard UI Enhancement', '["Assignment UI built", "Search working", "Bulk actions supported"]'),
('tm-019', 'Add bulk customer assignment tool', 'Implement CSV upload for bulk tier assignments', 'Done', 'High', 8, '[]', '[]', '["Build", "UI"]', 'Phase 2: Wizard UI Enhancement', '["CSV upload working", "Validation added", "Error reporting clear"]'),
('tm-020', 'Create tier assignment preview', 'Build preview showing which customers get which discounts', 'Done', 'High', 5, '[]', '[]', '["Build", "UI"]', 'Phase 2: Wizard UI Enhancement', '["Preview UI built", "Data accurate", "Performance optimized"]'),
('tm-021', 'Add wizard validation and error messages', 'Implement comprehensive validation for tier configuration', 'Done', 'High', 5, '[]', '[]', '["Build", "Validation"]', 'Phase 2: Wizard UI Enhancement', '["Validation complete", "Error messages clear", "User guidance provided"]'),

-- Phase 3: Pricing Engine Integration (7 tasks)
('tm-022', 'Integrate tier lookup in pricing engine', 'Add customer tier resolution to pricing calculation flow', 'To Do', 'Critical', 5, '[]', '[]', '["Build", "Pricing Engine"]', 'Phase 3: Pricing Engine Integration', '["Tier lookup integrated", "Performance acceptable", "Caching implemented"]'),
('tm-023', 'Implement tier-based discount calculation', 'Add logic to apply correct discount based on customer tier', 'To Do', 'Critical', 5, '[]', '[]', '["Build", "Pricing Engine"]', 'Phase 3: Pricing Engine Integration', '["Calculation logic added", "Tests passing", "Edge cases handled"]'),
('tm-024', 'Add tier precedence rules', 'Implement logic for handling multiple tier assignments', 'To Do', 'High', 5, '[]', '[]', '["Build", "Business Logic"]', 'Phase 3: Pricing Engine Integration', '["Precedence rules defined", "Logic implemented", "Documentation written"]'),
('tm-025', 'Implement tier caching for performance', 'Add Redis caching for tier assignments to optimize lookups', 'To Do', 'High', 5, '[]', '[]', '["Build", "Performance"]', 'Phase 3: Pricing Engine Integration', '["Caching implemented", "Performance improved", "Cache invalidation working"]'),
('tm-026', 'Add tier information to pricing response', 'Include tier details in pricing API responses for transparency', 'To Do', 'Medium', 3, '[]', '[]', '["Build", "API"]', 'Phase 3: Pricing Engine Integration', '["Tier info in response", "Documentation updated", "Backward compatible"]'),
('tm-027', 'Implement tier-based best deal logic', 'Extend no-stacking logic to consider tier-based discounts', 'To Do', 'High', 5, '[]', '[]', '["Build", "Business Logic"]', 'Phase 3: Pricing Engine Integration', '["Best deal logic updated", "Tier discounts considered", "Tests comprehensive"]'),
('tm-028', 'Add tier discount audit logging', 'Log all tier-based discount applications for compliance', 'To Do', 'High', 3, '[]', '[]', '["Build", "Audit"]', 'Phase 3: Pricing Engine Integration', '["Audit logging added", "Compliance verified", "Reporting available"]'),

-- Phase 4: Testing & Management Tools (6 tasks)
('tm-029', 'Build customer tier dashboard', 'Create management interface showing all tier assignments', 'To Do', 'High', 8, '[]', '[]', '["Build", "UI"]', 'Phase 4: Testing & Management', '["Dashboard built", "Data accurate", "Filters working"]'),
('tm-030', 'Create bulk tier assignment tool', 'Build interface for managing tier assignments at scale', 'To Do', 'Medium', 8, '[]', '[]', '["Build", "UI"]', 'Phase 4: Testing & Management', '["Bulk tool created", "Performance acceptable", "Error handling robust"]'),
('tm-031', 'Add tier testing to simulator', 'Extend pricing simulator to test tier-based scenarios', 'To Do', 'High', 8, '[]', '[]', '["Build", "Testing"]', 'Phase 4: Testing & Management', '["Simulator extended", "Tier scenarios testable", "Results accurate"]'),
('tm-032', 'Create tier management test suite', 'Build comprehensive unit and integration tests', 'Done', 'High', 8, '[]', '[]', '["Testing", "Testing"]', 'Phase 4: Testing & Management', '["Test suite created", "Coverage >80%", "CI/CD integrated"]'),
('tm-033', 'Write user documentation', 'Create end-user guides for tier management features', 'Done', 'Medium', 5, '[]', '[]', '["Documentation", "User Docs"]', 'Phase 4: Testing & Management', '["User docs written", "Screenshots added", "Examples provided"]'),
('tm-034', 'Write technical documentation', 'Document tier management architecture and APIs', 'Done', 'Medium', 5, '[]', '[]', '["Documentation", "Tech Docs"]', 'Phase 4: Testing & Management', '["Tech docs written", "Architecture diagrams added", "API reference complete"]');
