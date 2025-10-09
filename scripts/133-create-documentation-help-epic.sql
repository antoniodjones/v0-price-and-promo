-- =====================================================================================
-- Script 133: Create Documentation/Help System Epic and User Stories
-- =====================================================================================
-- Description: Creates epic and user stories for contextual help system with code links
-- =====================================================================================

-- Create Documentation/Help Epic
INSERT INTO user_stories (
  story_id,
  title,
  description,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  created_at,
  updated_at
) VALUES (
  'DOC-EPIC',
  'Contextual Help System',
  'Implement a comprehensive contextual help system with documentation links on every page, allowing users to access relevant user guides and tutorials directly from the interface.',
  'Documentation & Help',
  'epic',
  'Medium',
  'Done',
  21,
  E'- Book icon appears on all major pages\n- Links direct to relevant documentation\n- Admin can enable/disable per page\n- Configuration stored in database\n- Responsive and accessible design',
  'Uses system_config table for storage, integrates with existing header component, supports role-based access control',
  NOW() - INTERVAL '2 days',
  NOW()
);

-- DOC-001: Documentation Link Component
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_type,
  goal,
  reason,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  related_files,
  created_at,
  updated_at
) VALUES (
  'DOC-001',
  'Create Reusable Documentation Link Component',
  'As a developer, I want a reusable component that displays a book icon linking to documentation, so that I can easily add contextual help to any page.',
  'Developer',
  'create a reusable documentation link component',
  'to provide consistent contextual help across all pages',
  'Documentation & Help',
  'feature',
  'High',
  'Done',
  5,
  E'- Component accepts page key and optional URL\n- Displays book icon in top right\n- Opens documentation in new tab\n- Checks if feature is enabled\n- Respects user permissions\n- Accessible with proper ARIA labels',
  'Built with shadcn/ui components, uses BookOpen icon from lucide-react, integrates with documentation config service',
  ARRAY[
    'components/shared/documentation-link.tsx',
    'lib/types/documentation.ts'
  ],
  NOW() - INTERVAL '2 days',
  NOW()
);

-- DOC-002: Documentation Configuration Service
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_type,
  goal,
  reason,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  related_files,
  created_at,
  updated_at
) VALUES (
  'DOC-002',
  'Build Documentation Configuration Service',
  'As a system, I need a service to manage documentation configuration, so that settings can be stored and retrieved efficiently.',
  'System',
  'manage documentation configuration',
  'to enable dynamic control of help links',
  'Documentation & Help',
  'feature',
  'Medium',
  'Done',
  5,
  E'- Service reads from system_config table\n- Caches configuration for performance\n- Provides methods to get/set config\n- Handles page-specific overrides\n- Returns default URLs when not configured',
  'Uses Supabase client, stores config in system_config with category "documentation", includes 11 pre-configured page mappings',
  ARRAY[
    'lib/services/documentation-config.ts',
    'lib/types/documentation.ts'
  ],
  NOW() - INTERVAL '2 days',
  NOW()
);

-- DOC-003: Admin Settings UI for Documentation
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_type,
  goal,
  reason,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  related_files,
  created_at,
  updated_at
) VALUES (
  'DOC-003',
  'Create Admin Settings UI for Documentation Control',
  'As a system administrator, I want to configure documentation links from the settings page, so that I can enable/disable help links and customize URLs.',
  'System Administrator',
  'configure documentation links',
  'to control which pages show help and where they link',
  'Documentation & Help',
  'feature',
  'High',
  'Done',
  8,
  E'- Settings page shows all pages with documentation\n- Toggle to enable/disable globally\n- Toggle per page to enable/disable\n- Edit URL for each page\n- Preview documentation links\n- Save changes to database\n- Show unsaved changes warning',
  'Integrated into Settings → Documentation section, uses Card components, includes search/filter, organized by category',
  ARRAY[
    'components/settings/sections/documentation-settings.tsx'
  ],
  NOW() - INTERVAL '2 days',
  NOW()
);

-- DOC-004: Database Schema for Documentation Config
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_type,
  goal,
  reason,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  related_files,
  created_at,
  updated_at
) VALUES (
  'DOC-004',
  'Setup Database Schema for Documentation Configuration',
  'As a system, I need database storage for documentation configuration, so that settings persist across sessions.',
  'System',
  'store documentation configuration',
  'to persist admin settings and page mappings',
  'Documentation & Help',
  'technical',
  'Medium',
  'Done',
  3,
  E'- Uses existing system_config table\n- Stores global enabled flag\n- Stores page-specific configuration\n- Includes default documentation URLs\n- Supports JSON structure for flexibility',
  'Leverages existing system_config table with category "documentation", no new tables needed, includes seed data for 11 pages',
  ARRAY[
    'scripts/132-create-documentation-config-schema.sql'
  ],
  NOW() - INTERVAL '2 days',
  NOW()
);

-- DOC-005: Integration into Page Headers
INSERT INTO user_stories (
  story_id,
  title,
  description,
  user_type,
  goal,
  reason,
  epic,
  story_type,
  priority,
  status,
  story_points,
  acceptance_criteria,
  technical_notes,
  related_files,
  created_at,
  updated_at
) VALUES (
  'DOC-005',
  'Integrate Documentation Links into Page Headers',
  'As a user, I want to see a help icon on every page, so that I can quickly access relevant documentation.',
  'User',
  'access contextual help from any page',
  'to learn how to use features without leaving the app',
  'Documentation & Help',
  'feature',
  'High',
  'Done',
  5,
  E'- Book icon appears in top right of pages\n- Icon only shows when enabled\n- Clicking opens documentation in new tab\n- Works on all major pages\n- Responsive on mobile devices\n- Accessible with keyboard navigation',
  'Integrated into header component, added to products page as example, can be added to other pages using same pattern',
  ARRAY[
    'components/organisms/header.tsx',
    'app/products/page.tsx',
    'docs/CONTEXTUAL_HELP_SYSTEM.md'
  ],
  NOW() - INTERVAL '2 days',
  NOW()
);

-- Link code changes to user stories
INSERT INTO user_story_code_changes (story_id, file_path, change_type, lines_changed, description, commit_sha, committed_at)
SELECT 
  'DOC-001',
  'components/shared/documentation-link.tsx',
  'create',
  85,
  'Created reusable DocumentationLink component with book icon, permission checks, and accessibility features',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-001',
  'lib/types/documentation.ts',
  'create',
  45,
  'Created TypeScript types for documentation configuration and page mappings',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-002',
  'lib/services/documentation-config.ts',
  'create',
  120,
  'Built documentation configuration service with caching and default page mappings',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-003',
  'components/settings/sections/documentation-settings.tsx',
  'create',
  280,
  'Created admin settings UI for managing documentation links with enable/disable toggles and URL editing',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-004',
  'scripts/132-create-documentation-config-schema.sql',
  'create',
  95,
  'Created database schema and seed data for documentation configuration using system_config table',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-005',
  'components/organisms/header.tsx',
  'modify',
  25,
  'Integrated DocumentationLink component into page header for contextual help access',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-005',
  'app/products/page.tsx',
  'modify',
  15,
  'Added documentation link to products page as implementation example',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days'
UNION ALL SELECT 
  'DOC-005',
  'docs/CONTEXTUAL_HELP_SYSTEM.md',
  'create',
  180,
  'Created comprehensive documentation for contextual help system setup and usage',
  'feature/contextual-help',
  NOW() - INTERVAL '2 days';

-- Log in code_change_log for Git tracking
INSERT INTO code_change_log (
  task_id,
  file_path,
  change_type,
  component_name,
  lines_added,
  lines_removed,
  commit_message,
  commit_sha,
  branch_name,
  author,
  author_email,
  changed_at,
  metadata
)
SELECT 
  'DOC-001',
  'components/shared/documentation-link.tsx',
  'create',
  'DocumentationLink',
  85,
  0,
  'feat: create reusable documentation link component',
  'feature/contextual-help-001',
  'feature/contextual-help',
  'System',
  'system@greenthumb.com',
  NOW() - INTERVAL '2 days',
  jsonb_build_object(
    'story_points', 5,
    'epic', 'Documentation & Help',
    'feature', 'Contextual help system with book icon links',
    'impact', 'Enables users to access relevant documentation from any page'
  )
UNION ALL SELECT 
  'DOC-002',
  'lib/services/documentation-config.ts',
  'create',
  'DocumentationConfigService',
  120,
  0,
  'feat: build documentation configuration service',
  'feature/contextual-help-002',
  'feature/contextual-help',
  'System',
  'system@greenthumb.com',
  NOW() - INTERVAL '2 days',
  jsonb_build_object(
    'story_points', 5,
    'epic', 'Documentation & Help',
    'feature', 'Service for managing documentation configuration',
    'caching', true,
    'default_pages', 11
  )
UNION ALL SELECT 
  'DOC-003',
  'components/settings/sections/documentation-settings.tsx',
  'create',
  'DocumentationSettings',
  280,
  0,
  'feat: create admin settings UI for documentation control',
  'feature/contextual-help-003',
  'feature/contextual-help',
  'System',
  'system@greenthumb.com',
  NOW() - INTERVAL '2 days',
  jsonb_build_object(
    'story_points', 8,
    'epic', 'Documentation & Help',
    'feature', 'Admin UI for configuring documentation links',
    'capabilities', jsonb_build_array('global toggle', 'per-page toggle', 'URL editing', 'preview links')
  )
UNION ALL SELECT 
  'DOC-004',
  'scripts/132-create-documentation-config-schema.sql',
  'create',
  'DatabaseSchema',
  95,
  0,
  'feat: setup database schema for documentation config',
  'feature/contextual-help-004',
  'feature/contextual-help',
  'System',
  'system@greenthumb.com',
  NOW() - INTERVAL '2 days',
  jsonb_build_object(
    'story_points', 3,
    'epic', 'Documentation & Help',
    'feature', 'Database storage for documentation configuration',
    'table', 'system_config',
    'category', 'documentation'
  )
UNION ALL SELECT 
  'DOC-005',
  'components/organisms/header.tsx',
  'modify',
  'Header',
  25,
  0,
  'feat: integrate documentation links into page headers',
  'feature/contextual-help-005',
  'feature/contextual-help',
  'System',
  'system@greenthumb.com',
  NOW() - INTERVAL '2 days',
  jsonb_build_object(
    'story_points', 5,
    'epic', 'Documentation & Help',
    'feature', 'Integration of help links into page headers',
    'pages_updated', jsonb_build_array('products', 'header component')
  );

-- Update story metrics
UPDATE user_stories 
SET 
  code_files_count = (
    SELECT COUNT(DISTINCT file_path) 
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  ),
  total_lines_of_code = (
    SELECT COALESCE(SUM(lines_changed), 0)
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  ),
  last_code_change = (
    SELECT MAX(committed_at)
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id
  ),
  lines_added = (
    SELECT COALESCE(SUM(lines_changed), 0)
    FROM user_story_code_changes 
    WHERE story_id = user_stories.story_id AND change_type IN ('create', 'modify')
  )
WHERE story_id LIKE 'DOC-%';

-- Update epic metrics
UPDATE user_stories 
SET 
  code_files_count = (
    SELECT COUNT(DISTINCT file_path) 
    FROM user_story_code_changes usc
    JOIN user_stories us ON usc.story_id = us.story_id
    WHERE us.epic = 'Documentation & Help'
  ),
  total_lines_of_code = (
    SELECT COALESCE(SUM(lines_changed), 0)
    FROM user_story_code_changes usc
    JOIN user_stories us ON usc.story_id = us.story_id
    WHERE us.epic = 'Documentation & Help'
  )
WHERE story_id = 'DOC-EPIC';

-- Verification
SELECT 
  'Documentation & Help Epic Summary' as report,
  COUNT(DISTINCT story_id) as stories_created,
  COUNT(DISTINCT file_path) as files_linked,
  SUM(lines_changed) as total_lines,
  SUM(story_points) as total_story_points
FROM user_story_code_changes usc
JOIN user_stories us ON usc.story_id = us.story_id
WHERE us.epic = 'Documentation & Help';

-- Show created stories
SELECT 
  story_id,
  title,
  status,
  story_points,
  code_files_count,
  total_lines_of_code
FROM user_stories
WHERE epic = 'Documentation & Help'
ORDER BY story_id;
