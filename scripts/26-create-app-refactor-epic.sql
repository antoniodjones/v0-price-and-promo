-- Create APP-REFACTOR Epic and Tasks
-- Systematic refactoring to address technical debt and deployment issues

-- Create the APP-REFACTOR epic
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'epic-refactor',
  'APP-REFACTOR: Systematic Code Refactoring & Deployment Optimization',
  'Address technical debt, fix TypeScript/ESLint errors, improve code organization, and ensure clean Vercel deployments. This epic focuses on stabilizing the codebase foundation before adding new features.',
  'epic',
  'epic-refactor',
  'critical',
  'in_progress',
  'Antonio Jones',
  'Antonio Jones',
  'All TypeScript errors resolved, All ESLint errors resolved, Clean Vercel deployments with no build warnings, Code organization follows DESIGN_DECISIONS.md principles, Test coverage above 80%, Documentation updated and comprehensive',
  'Enhance Vercel deployment configuration, Fix TypeScript/ESLint errors (30 instances), Refactor large components (>500 lines), Improve error handling patterns, Add missing unit tests, Update documentation',
  NOW()
);

-- Task 1: Enhance Vercel Deployment Configuration (COMPLETED)
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at,
  updated_at
) VALUES (
  'refactor-001',
  'Enhance Vercel Deployment Configuration',
  'Update vercel.json with production-ready settings, add build validation scripts, and create deployment guide to ensure clean deployments.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'critical',
  'done',
  'Antonio Jones',
  'Antonio Jones',
  'vercel.json configured with proper build settings, Environment variables documented, Build validation scripts added to package.json, Deployment guide created with troubleshooting steps',
  'Update vercel.json with function timeouts and regions, Add type-check and validate scripts to package.json, Create DEPLOYMENT_GUIDE.md, Configure SKIP_LINT and SKIP_TYPE_CHECK env vars',
  NOW(),
  NOW()
);

-- Task 2: Fix TypeScript/ESLint Errors
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'refactor-002',
  'Fix TypeScript/ESLint Errors (30 instances)',
  'Resolve all TypeScript type errors and ESLint violations found across the codebase. Focus on files with @ts-ignore, @ts-expect-error, and any type usage.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'high',
  'in_progress',
  'Antonio Jones',
  'Antonio Jones',
  'Zero TypeScript errors when running pnpm run type-check, Zero ESLint errors when running pnpm run lint, No @ts-ignore or @ts-expect-error comments, Proper type definitions for all functions and components',
  'Fix type errors in app/api/discounts/validate/route.ts (7 instances), Fix type errors in app/api/tier-assignments/validate-bulk/route.ts (7 instances), Fix type errors in app/promotions/manage/page.tsx (5 instances), Fix remaining type errors in other files (11 instances), Remove all any types and add proper type definitions',
  NOW()
);

-- Task 3: Refactor Large Components
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'refactor-003',
  'Organize Component Structure',
  'Break down large components into smaller, reusable pieces following single responsibility principle. Improve code maintainability and testability.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'medium',
  'todo',
  'Antonio Jones',
  'Antonio Jones',
  'No component files exceed 500 lines, Components follow single responsibility principle, Shared logic extracted into custom hooks, UI components separated from business logic',
  'Identify components over 500 lines, Extract reusable UI components, Create custom hooks for shared logic, Split large pages into smaller components, Update imports and tests',
  NOW()
);

-- Task 4: Improve Error Handling Patterns
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'refactor-004',
  'Improve Error Handling',
  'Standardize error handling across the application with consistent patterns, proper error boundaries, and user-friendly error messages.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'medium',
  'todo',
  'Antonio Jones',
  'Antonio Jones',
  'Consistent error handling pattern across all API routes, Error boundaries implemented for all major sections, User-friendly error messages displayed, Errors logged to monitoring service, Proper HTTP status codes returned',
  'Create standardized error response format, Add error boundaries to major page sections, Implement error logging service integration, Update API routes to use consistent error handling, Add user-friendly error messages',
  NOW()
);

-- Task 5: Add Missing Unit Tests
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'refactor-005',
  'Add Integration Tests',
  'Increase test coverage from 60% to 80%+ by adding unit tests for critical business logic, utilities, and components.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'medium',
  'todo',
  'Antonio Jones',
  'Antonio Jones',
  'Test coverage above 80%, All utility functions have unit tests, Critical business logic has unit tests, API routes have integration tests, Components have snapshot tests',
  'Add tests for pricing calculation utilities, Add tests for discount validation logic, Add tests for GitHub workflow service, Add tests for Supabase client utilities, Add component snapshot tests',
  NOW()
);

-- Task 6: Update Documentation
INSERT INTO user_stories (
  id,
  title,
  description,
  story_type,
  parent_id,
  epic,
  priority,
  status,
  assignee,
  reporter,
  acceptance_criteria,
  tasks,
  created_at
) VALUES (
  'refactor-006',
  'Update Documentation',
  'Ensure all documentation is current, comprehensive, and follows best practices. Update README, API docs, and inline code comments.',
  'task',
  'epic-refactor',
  'epic-refactor',
  'low',
  'todo',
  'Antonio Jones',
  'Antonio Jones',
  'README.md is current and comprehensive, API routes documented with examples, Component props documented with JSDoc, Architecture decisions documented, Setup instructions tested and verified',
  'Update README.md with current setup instructions, Document all API routes with request/response examples, Add JSDoc comments to all exported functions, Update DESIGN_DECISIONS.md with recent changes, Create CONTRIBUTING.md with development guidelines',
  NOW()
);

-- Log epic creation
INSERT INTO task_events (
  task_id,
  event_type,
  triggered_by,
  metadata
) VALUES (
  'epic-refactor',
  'epic_created',
  'v0-agent',
  jsonb_build_object(
    'creation_note', 'Created APP-REFACTOR epic with 6 tasks to address technical debt',
    'total_tasks', 6,
    'completed_tasks', 1,
    'priority', 'critical'
  )
);
