-- Seed Framework Tasks (25 tasks from Phase 0-8)

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
