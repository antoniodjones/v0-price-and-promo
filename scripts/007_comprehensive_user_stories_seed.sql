-- Comprehensive user stories based on actual codebase analysis
-- This replaces the previous basic seed with detailed stories covering all features

DELETE FROM user_stories;

-- Dashboard & Overview Stories
INSERT INTO user_stories (
  title, description, acceptance_criteria, priority, dependencies, tasks, 
  related_issues, status, story_points, epic, assignee, reporter, 
  created_at, updated_at
) VALUES 
(
  'Dashboard Overview with Real-time Metrics',
  'As a pricing manager, I want to see a comprehensive dashboard with key metrics so that I can monitor the overall health and performance of our pricing and promotion system.',
  '["Display active discounts count with trend", "Show customer tier distribution", "Display auto discounts applied with percentage change", "Show total savings generated", "Include recent activity feed with timestamps", "Provide quick action buttons for common tasks", "Display system alerts and warnings"]',
  'High',
  '[]',
  '["Create dashboard layout component", "Implement metrics calculation API", "Add real-time data updates", "Create activity feed component", "Add quick action navigation"]',
  '["Analytics API integration", "Real-time WebSocket connection"]',
  'Done',
  8,
  'Core Platform',
  'Lead Developer',
  'Product Manager',
  NOW(),
  NOW()
),

-- Customer Discount Management Stories
(
  'Multi-step Customer Discount Creation Wizard',
  'As a pricing administrator, I want to create customer-specific discounts through a guided wizard so that I can efficiently set up complex discount rules with proper validation.',
  '["6-step wizard: Assignment, Dates, Level, Review, Target, Value", "Customer tier selection with multi-select", "Market-specific discount application", "Date range validation with conflict detection", "Discount level selection (item, brand, category, subcategory)", "Percentage or fixed amount discount types", "Preview and confirmation before creation"]',
  'Critical',
  '["Customer management system", "Product catalog"]',
  '["Design wizard UI components", "Implement step validation logic", "Create discount calculation engine", "Add conflict detection", "Build preview functionality"]',
  '["Database schema for customer_discounts", "Customer tier management"]',
  'Done',
  13,
  'Discount Management',
  'Senior Developer',
  'Business Analyst',
  NOW(),
  NOW()
),

(
  'Customer Discount Assignment and Management',
  'As a pricing manager, I want to assign discounts to specific customers or customer tiers so that I can provide targeted pricing strategies.',
  '["Assign discounts to individual customers", "Assign discounts to customer tiers (A, B, C)", "Market-specific discount application", "Bulk customer assignment", "Assignment history tracking", "Remove or modify assignments"]',
  'High',
  '["Customer discount creation wizard"]',
  '["Create assignment interface", "Implement bulk operations", "Add assignment tracking", "Create management dashboard"]',
  '["Customer management API", "Discount validation system"]',
  'Done',
  8,
  'Discount Management',
  'Mid-level Developer',
  'Product Manager',
  NOW(),
  NOW()
),

-- Inventory Discount Management Stories
(
  'Automated Inventory-based Discount System',
  'As an inventory manager, I want to automatically apply discounts based on inventory conditions so that I can reduce waste and optimize inventory turnover.',
  '["Expiration-based auto discounts with configurable days", "THC percentage-based discounts", "Scope selection (all products, category, brand)", "Automatic application without manual intervention", "Real-time inventory monitoring", "Discount escalation based on time remaining"]',
  'Critical',
  '["Product catalog with expiration dates", "Inventory tracking system"]',
  '["Build auto-discount engine", "Create inventory monitoring service", "Implement discount escalation logic", "Add real-time notifications"]',
  '["Inventory management system", "Product database schema"]',
  'Done',
  13,
  'Inventory Management',
  'Senior Developer',
  'Operations Manager',
  NOW(),
  NOW()
),

(
  'Inventory Discount Configuration Wizard',
  'As an operations manager, I want to configure automated inventory discounts through a user-friendly interface so that I can set up complex discount rules without technical knowledge.',
  '["6-step configuration wizard", "Discount type selection (expiration, THC)", "Trigger value configuration", "Scope definition (all, category, brand)", "Discount value and type setting", "Schedule and timing configuration", "Preview and testing functionality"]',
  'High',
  '["Automated inventory discount system"]',
  '["Design configuration wizard", "Implement validation logic", "Create preview functionality", "Add testing capabilities"]',
  '["Auto-discount engine", "Product categorization"]',
  'Done',
  10,
  'Inventory Management',
  'Mid-level Developer',
  'Operations Manager',
  NOW(),
  NOW()
),

-- Bundle Deals Management Stories
(
  'Comprehensive Bundle Deal Creation System',
  'As a sales manager, I want to create various types of bundle deals so that I can increase average order value and move specific inventory.',
  '["Fixed bundle deals with specific products", "Category-based bundles", "Mix-and-match bundles", "Tiered bundle pricing", "Minimum quantity requirements", "Percentage or fixed discount types", "Date range scheduling", "Bundle performance tracking"]',
  'High',
  '["Product catalog", "Pricing calculation engine"]',
  '["Create bundle wizard interface", "Implement bundle types logic", "Add bundle validation", "Create performance tracking"]',
  '["Product management system", "Discount calculation engine"]',
  'Done',
  13,
  'Sales Tools',
  'Senior Developer',
  'Sales Manager',
  NOW(),
  NOW()
),

-- BOGO Promotions Stories
(
  'BOGO Promotion Management System',
  'As a marketing manager, I want to create and manage Buy-One-Get-One promotions so that I can drive sales and customer engagement.',
  '["Traditional BOGO (buy 1 get 1 free)", "Percentage-based BOGO (buy 1 get 50% off)", "Fixed amount BOGO discounts", "Item, brand, or category level triggers", "Flexible reward configuration", "Date scheduling and activation", "Performance tracking and analytics"]',
  'High',
  '["Product catalog", "Promotion engine"]',
  '["Design BOGO wizard interface", "Implement BOGO calculation logic", "Add promotion scheduling", "Create performance analytics"]',
  '["Pricing calculation engine", "Analytics system"]',
  'Done',
  10,
  'Marketing Tools',
  'Mid-level Developer',
  'Marketing Manager',
  NOW(),
  NOW()
),

-- Pricing Engine Stories
(
  'Advanced Pricing Calculation Engine',
  'As a system administrator, I want a sophisticated pricing engine that applies the best available discount so that customers always get optimal pricing without discount stacking.',
  '["Multi-tier discount evaluation", "Best deal logic (highest discount wins)", "No discount stacking", "Customer tier-based pricing", "Market-specific pricing", "Real-time calculation", "Audit trail for all pricing decisions", "Bulk pricing calculation support"]',
  'Critical',
  '["Customer management", "Product catalog", "Discount systems"]',
  '["Build pricing calculation engine", "Implement best deal logic", "Add audit trail", "Create bulk processing", "Add performance optimization"]',
  '["All discount systems", "Customer and product data"]',
  'Done',
  21,
  'Core Platform',
  'Lead Developer',
  'Technical Architect',
  NOW(),
  NOW()
),

(
  'Market-specific Pricing Strategies',
  'As a regional manager, I want to implement different pricing strategies by market so that I can adapt to local competition and regulations.',
  '["Volume-based pricing tiers", "Customer tier-based pricing", "Market-specific discount rules", "Configurable pricing strategies", "Strategy performance tracking", "Easy strategy switching"]',
  'High',
  '["Pricing calculation engine", "Customer management"]',
  '["Create market pricing interface", "Implement volume tiers", "Add strategy management", "Create performance tracking"]',
  '["Customer tier system", "Analytics platform"]',
  'Done',
  13,
  'Regional Management',
  'Senior Developer',
  'Regional Manager',
  NOW(),
  NOW()
),

-- Analytics and Reporting Stories
(
  'Comprehensive Analytics Dashboard',
  'As a business analyst, I want detailed analytics on pricing and promotion performance so that I can make data-driven decisions.',
  '["Customer analytics with segmentation", "Discount usage analytics", "Promotion performance metrics", "Revenue impact analysis", "Trend analysis over time", "Exportable reports", "Real-time data updates"]',
  'High',
  '["All pricing and promotion systems"]',
  '["Create analytics data pipeline", "Build dashboard components", "Implement export functionality", "Add real-time updates"]',
  '["Data warehouse", "Reporting infrastructure"]',
  'Done',
  13,
  'Analytics',
  'Senior Developer',
  'Business Analyst',
  NOW(),
  NOW()
),

(
  'Customer Insights and Segmentation',
  'As a customer success manager, I want detailed customer insights so that I can identify opportunities for upselling and retention.',
  '["Customer spending patterns", "Loyalty score calculation", "Risk factor identification", "Personalized recommendations", "Customer tier analysis", "Order frequency tracking", "Category preference analysis"]',
  'Medium',
  '["Customer management", "Analytics platform"]',
  '["Build customer analytics engine", "Create segmentation logic", "Implement recommendation system", "Add risk assessment"]',
  '["Customer data warehouse", "Machine learning models"]',
  'Done',
  10,
  'Customer Success',
  'Mid-level Developer',
  'Customer Success Manager',
  NOW(),
  NOW()
),

-- Testing and Validation Stories
(
  'Comprehensive Testing Tools Suite',
  'As a pricing analyst, I want testing tools to validate pricing scenarios so that I can ensure accuracy before deploying changes.',
  '["Basket testing with sample orders", "Historical scenario testing", "Pricing conflict detection", "Discount validation", "Performance impact testing", "A/B testing capabilities"]',
  'High',
  '["Pricing calculation engine", "All discount systems"]',
  '["Create testing framework", "Build scenario testing tools", "Implement conflict detection", "Add performance testing"]',
  '["Historical data", "Testing infrastructure"]',
  'Done',
  13,
  'Quality Assurance',
  'Senior Developer',
  'QA Manager',
  NOW(),
  NOW()
),

-- User Management and SSO Stories
(
  'Enterprise User Management System',
  'As a system administrator, I want comprehensive user management with SSO integration so that I can securely manage access to the pricing system.',
  '["User CRUD operations", "Role-based access control", "SSO integration with webhooks", "Bulk user operations", "API key management", "User activity tracking", "Automated user provisioning"]',
  'High',
  '["Authentication system"]',
  '["Build user management interface", "Implement SSO integration", "Add bulk operations", "Create API management"]',
  '["SSO provider", "Security infrastructure"]',
  'Done',
  13,
  'Security & Access',
  'Senior Developer',
  'IT Administrator',
  NOW(),
  NOW()
),

-- Settings and Configuration Stories
(
  'Comprehensive System Configuration',
  'As a system administrator, I want extensive configuration options so that I can customize the system for our specific business needs.',
  '["15+ configuration sections", "SSO/API configuration", "Webhook management", "Rate limiting controls", "System monitoring settings", "Backup and recovery options", "Integration management"]',
  'Medium',
  '["Core platform"]',
  '["Create settings framework", "Build configuration interfaces", "Implement validation", "Add backup functionality"]',
  '["System infrastructure", "Integration platforms"]',
  'Done',
  10,
  'System Administration',
  'Mid-level Developer',
  'System Administrator',
  NOW(),
  NOW()
),

-- API and Integration Stories
(
  'Comprehensive API Suite',
  'As an integration developer, I want a complete API suite so that I can integrate the pricing system with external applications.',
  '["50+ REST API endpoints", "Comprehensive CRUD operations", "Bulk processing capabilities", "Real-time WebSocket support", "API documentation", "Rate limiting and security", "Webhook support for real-time updates"]',
  'High',
  '["All core systems"]',
  '["Design API architecture", "Implement all endpoints", "Add security measures", "Create documentation", "Add monitoring"]',
  '["API gateway", "Security infrastructure"]',
  'Done',
  21,
  'Integration Platform',
  'Lead Developer',
  'Technical Architect',
  NOW(),
  NOW()
),

-- Task Planning and Project Management Stories
(
  'Advanced User Story Management',
  'As a project manager, I want comprehensive user story management so that I can track development progress and requirements.',
  '["Jira-style user story format", "Story points estimation", "Status tracking (To Do, In Progress, Done)", "Priority management", "CSV export functionality", "Jira API integration", "Bulk story operations"]',
  'Medium',
  '["Task planning system"]',
  '["Create story management interface", "Implement Jira integration", "Add export functionality", "Build bulk operations"]',
  '["Project management tools", "Jira API access"]',
  'Done',
  8,
  'Project Management',
  'Mid-level Developer',
  'Project Manager',
  NOW(),
  NOW()
),

-- Real-time Features Stories
(
  'Real-time System Updates',
  'As a user, I want real-time updates throughout the system so that I always see current data without manual refreshes.',
  '["WebSocket connection management", "Real-time inventory alerts", "Live pricing updates", "Instant notification system", "Connection status monitoring", "Automatic reconnection handling"]',
  'Medium',
  '["Core platform", "WebSocket infrastructure"]',
  '["Implement WebSocket server", "Create client connection management", "Add real-time components", "Build notification system"]',
  '["WebSocket infrastructure", "Message queue system"]',
  'Done',
  10,
  'Real-time Features',
  'Senior Developer',
  'Technical Lead',
  NOW(),
  NOW()
),

-- Performance and Optimization Stories
(
  'System Performance Optimization',
  'As a system administrator, I want optimized system performance so that users have fast response times even with large datasets.',
  '["Database query optimization", "API response caching", "Bulk operation efficiency", "Real-time update performance", "Memory usage optimization", "Load balancing support"]',
  'Medium',
  '["All core systems"]',
  '["Profile system performance", "Optimize database queries", "Implement caching", "Add load balancing"]',
  '["Performance monitoring tools", "Caching infrastructure"]',
  'Done',
  13,
  'Performance',
  'Senior Developer',
  'Technical Lead',
  NOW(),
  NOW()
),

-- Security and Compliance Stories
(
  'Enterprise Security Implementation',
  'As a security officer, I want comprehensive security measures so that sensitive pricing data is protected.',
  '["Role-based access control", "API key authentication", "Audit trail for all changes", "Data encryption", "Secure webhook handling", "Rate limiting protection", "Input validation and sanitization"]',
  'Critical',
  '["User management", "API platform"]',
  '["Implement authentication system", "Add authorization controls", "Create audit logging", "Add security monitoring"]',
  '["Security infrastructure", "Compliance requirements"]',
  'Done',
  13,
  'Security',
  'Senior Developer',
  'Security Officer',
  NOW(),
  NOW()
),

-- Mobile and Responsive Design Stories
(
  'Responsive Design Implementation',
  'As a mobile user, I want the system to work seamlessly on all devices so that I can manage pricing on the go.',
  '["Mobile-first responsive design", "Touch-friendly interfaces", "Optimized mobile navigation", "Fast loading on mobile networks", "Offline capability for key features", "Mobile-specific UI components"]',
  'Medium',
  '["All UI components"]',
  '["Implement responsive breakpoints", "Optimize mobile navigation", "Add touch interactions", "Implement offline features"]',
  '["Mobile testing infrastructure", "Progressive Web App setup"]',
  'Done',
  8,
  'User Experience',
  'Frontend Developer',
  'UX Designer',
  NOW(),
  NOW()
),

-- Data Import/Export Stories
(
  'Comprehensive Data Management',
  'As a data manager, I want robust import/export capabilities so that I can manage large datasets efficiently.',
  '["CSV export for all data types", "Bulk import functionality", "Data validation on import", "Export scheduling", "Format conversion support", "Error handling and reporting"]',
  'Medium',
  '["All data systems"]',
  '["Create export functionality", "Build import validation", "Add scheduling system", "Implement error handling"]',
  '["File processing infrastructure", "Data validation rules"]',
  'Done',
  10,
  'Data Management',
  'Mid-level Developer',
  'Data Manager',
  NOW(),
  NOW()
);
