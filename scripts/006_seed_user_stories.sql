-- Pre-populate user stories based on existing features
INSERT INTO user_stories (
  title, user_type, goal, reason, description, acceptance_criteria, 
  priority, status, story_points, epic, assignee, reporter, labels
) VALUES 

-- User Management Stories
(
  'User Profile Management System',
  'system administrator',
  'manage user profiles with full CRUD operations',
  'I can efficiently onboard, update, and remove users from the internal application',
  'A comprehensive user management interface that allows administrators to create, read, update, and delete user profiles. The system should support bulk operations, search functionality, and role-based access without requiring Row Level Security since this is an internal application.',
  ARRAY[
    'Create new user profiles with all required fields',
    'Edit existing user information including roles and status',
    'Delete user accounts with confirmation dialogs',
    'Search and filter users by name, email, role, or status',
    'Bulk operations for adding multiple users at once',
    'Export user data to CSV format',
    'Real-time validation of user input fields',
    'Audit trail of all user management actions'
  ],
  'High',
  'Done',
  13,
  'User Management',
  'Development Team',
  'Product Manager',
  ARRAY['user-management', 'admin', 'crud']
),

(
  'SSO Integration and API Configuration',
  'system administrator',
  'configure SSO integration and API settings through a user interface',
  'I can easily set up authentication and API access without writing code',
  'A configuration interface that allows administrators to set up Single Sign-On integration, manage API keys, configure webhooks, and test connections. The system should store all configuration in the database and provide validation and testing capabilities.',
  ARRAY[
    'Configure SSO provider settings and endpoints',
    'Generate and manage API keys for automated systems',
    'Set up webhook URLs and test webhook connectivity',
    'Configure rate limiting and security settings',
    'Test SSO and API connections before saving',
    'Export configuration for backup purposes',
    'Real-time validation of configuration settings',
    'Documentation of all available API endpoints'
  ],
  'High',
  'Done',
  21,
  'Authentication & Integration',
  'Development Team',
  'Product Manager',
  ARRAY['sso', 'api', 'configuration', 'security']
),

-- Task Planning Stories
(
  'Task Planning and Project Management Interface',
  'project manager',
  'plan and track project tasks with comprehensive project management features',
  'I can effectively organize work, track progress, and ensure project deliverables are met',
  'A task planning interface that provides project overview, milestone tracking, resource allocation, and progress monitoring. The system should support different project phases and provide clear visibility into project status and deliverables.',
  ARRAY[
    'Create and manage project milestones and phases',
    'Assign tasks to team members with due dates',
    'Track project progress with visual indicators',
    'Resource allocation and capacity planning',
    'Generate project reports and status updates',
    'Integration with user management for team assignments',
    'Timeline view of project activities',
    'Risk assessment and mitigation tracking'
  ],
  'Medium',
  'Done',
  8,
  'Project Management',
  'Development Team',
  'Product Manager',
  ARRAY['planning', 'project-management', 'tracking']
),

(
  'User Story Management with Jira Integration',
  'product owner',
  'manage user stories in a Jira-compatible format with export capabilities',
  'I can maintain comprehensive user stories and integrate with existing project management tools',
  'A complete user story management system that follows Jira conventions, supports full CRUD operations, and provides export capabilities to CSV and direct Jira integration. The system should handle acceptance criteria, story points, dependencies, and related issues.',
  ARRAY[
    'Create user stories with proper Jira format (As a... I want... so that...)',
    'Manage acceptance criteria, tasks, and dependencies',
    'Assign story points using experienced engineer estimates',
    'Track story status (To Do, In Progress, Done)',
    'Export stories to CSV format for external tools',
    'Direct integration with Jira API for story creation',
    'Search and filter stories by multiple criteria',
    'Bulk operations for managing multiple stories'
  ],
  'High',
  'Done',
  34,
  'Agile Management',
  'Development Team',
  'Product Owner',
  ARRAY['user-stories', 'jira', 'agile', 'export']
),

-- Settings and Configuration Stories
(
  'Comprehensive Settings Management System',
  'system administrator',
  'manage all application settings through organized configuration interfaces',
  'I can customize the application behavior and maintain system configurations efficiently',
  'A multi-section settings interface that covers user management, security, multi-tenant configurations, and system administration. The system should provide organized navigation, validation, and the ability to export/import configurations.',
  ARRAY[
    'Organize settings into logical sections and categories',
    'User settings management with profile customization',
    'Security settings including authentication and access controls',
    'Multi-tenant configuration for different client environments',
    'System administration settings for performance and monitoring',
    'Import/export configuration for backup and deployment',
    'Real-time validation of setting changes',
    'Audit trail of all configuration modifications'
  ],
  'Medium',
  'Done',
  13,
  'System Configuration',
  'Development Team',
  'System Administrator',
  ARRAY['settings', 'configuration', 'admin']
),

-- Database and Infrastructure Stories
(
  'Database Integration with Supabase',
  'backend developer',
  'integrate with Supabase for reliable data storage and real-time capabilities',
  'the application has robust, scalable data persistence with real-time features',
  'Complete integration with Supabase including database schema design, real-time subscriptions, and proper connection management. The system should handle all CRUD operations efficiently and provide proper error handling and connection pooling.',
  ARRAY[
    'Design and implement comprehensive database schemas',
    'Set up Supabase client and server-side connections',
    'Implement real-time data synchronization where needed',
    'Create proper database indexes for performance',
    'Handle connection pooling and error recovery',
    'Implement database migrations and versioning',
    'Set up proper backup and recovery procedures',
    'Monitor database performance and optimize queries'
  ],
  'High',
  'Done',
  21,
  'Infrastructure',
  'Backend Team',
  'Technical Lead',
  ARRAY['database', 'supabase', 'infrastructure']
),

(
  'Redis Caching Integration',
  'backend developer',
  'implement Redis caching for improved application performance',
  'the application can handle high loads with fast response times',
  'Integration with Upstash Redis for caching frequently accessed data, session management, and performance optimization. The system should implement intelligent cache invalidation and provide monitoring of cache performance.',
  ARRAY[
    'Set up Redis connection and configuration',
    'Implement caching strategies for frequently accessed data',
    'Create cache invalidation mechanisms',
    'Session management and storage in Redis',
    'Performance monitoring and cache hit rate tracking',
    'Implement cache warming for critical data',
    'Handle cache failures gracefully with fallback mechanisms',
    'Optimize cache keys and expiration policies'
  ],
  'Medium',
  'Done',
  13,
  'Performance',
  'Backend Team',
  'Technical Lead',
  ARRAY['redis', 'caching', 'performance']
),

-- API and Integration Stories
(
  'RESTful API Development',
  'api developer',
  'create comprehensive REST APIs for all application functionality',
  'external systems and frontend applications can integrate seamlessly',
  'Development of RESTful APIs that cover all application functionality including user management, settings, and data operations. The APIs should follow REST conventions, include proper error handling, and provide comprehensive documentation.',
  ARRAY[
    'Design RESTful endpoints following industry standards',
    'Implement proper HTTP status codes and error responses',
    'Create comprehensive API documentation',
    'Add request/response validation and sanitization',
    'Implement rate limiting and security measures',
    'Provide API versioning strategy',
    'Create automated API testing suite',
    'Monitor API performance and usage analytics'
  ],
  'High',
  'Done',
  21,
  'API Development',
  'Backend Team',
  'API Lead',
  ARRAY['api', 'rest', 'integration']
),

-- Future Enhancement Stories
(
  'Pricing Engine Core Functionality',
  'pricing manager',
  'configure complex pricing rules and calculations',
  'I can implement sophisticated pricing strategies for different market conditions',
  'The core pricing engine that will handle dynamic pricing calculations, rule-based pricing, promotional pricing, and market-specific pricing strategies. This will be the heart of the pricing and promotion system.',
  ARRAY[
    'Create pricing rule configuration interface',
    'Implement dynamic pricing calculation engine',
    'Support for tiered and volume-based pricing',
    'Market-specific pricing rule deployment',
    'Real-time pricing calculation with sub-200ms response',
    'Integration with inventory and product data',
    'Pricing audit trail and change tracking',
    'Performance optimization for complex calculations'
  ],
  'Critical',
  'To Do',
  55,
  'Pricing Engine',
  'TBD',
  'Product Manager',
  ARRAY['pricing', 'calculations', 'rules', 'core-feature']
),

(
  'Promotion Management System',
  'marketing manager',
  'create and manage promotional campaigns with flexible rules',
  'I can drive sales through targeted promotions and special offers',
  'A comprehensive promotion management system that allows creation of various types of promotions including percentage discounts, BOGO offers, bundle deals, and time-limited campaigns. The system should integrate with the pricing engine and provide analytics.',
  ARRAY[
    'Create various promotion types (percentage, fixed amount, BOGO)',
    'Schedule promotions with start and end dates',
    'Target specific customer segments or products',
    'Set promotion limits and usage restrictions',
    'Integration with pricing engine for conflict resolution',
    'Real-time promotion performance analytics',
    'A/B testing capabilities for promotion effectiveness',
    'Automated promotion activation and deactivation'
  ],
  'High',
  'To Do',
  34,
  'Promotions',
  'TBD',
  'Marketing Manager',
  ARRAY['promotions', 'marketing', 'campaigns']
),

(
  'Analytics and Reporting Dashboard',
  'business analyst',
  'access comprehensive analytics on pricing and promotion performance',
  'I can make data-driven decisions to optimize pricing strategies',
  'A powerful analytics dashboard that provides insights into pricing effectiveness, promotion performance, customer behavior, and revenue impact. The system should support custom date ranges, multiple visualization types, and export capabilities.',
  ARRAY[
    'Real-time pricing and promotion performance metrics',
    'Customer behavior analysis and segmentation',
    'Revenue impact tracking with before/after comparisons',
    'Customizable dashboards with drag-and-drop widgets',
    'Automated report generation and scheduling',
    'Export capabilities for external analysis tools',
    'Predictive analytics for pricing optimization',
    'Integration with external business intelligence tools'
  ],
  'Medium',
  'To Do',
  21,
  'Analytics',
  'TBD',
  'Business Analyst',
  ARRAY['analytics', 'reporting', 'dashboard', 'insights']
);
