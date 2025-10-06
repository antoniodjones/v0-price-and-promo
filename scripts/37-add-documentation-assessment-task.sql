-- Add System Level Documentation Assessment Task
-- This task will evaluate where documentation gaps exist for business users
-- and ensure information is accessible within the application, not just in .md files

DO $$
DECLARE
  v_epic_id TEXT;
BEGIN
  -- Get the APP-REFACTOR epic ID (try both possible IDs)
  SELECT id INTO v_epic_id
  FROM user_stories
  WHERE id IN ('epic-refactor', 'APP-REFACTOR')
  LIMIT 1;

  -- Create epic if it doesn't exist
  IF v_epic_id IS NULL THEN
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
      created_at
    ) VALUES (
      'epic-refactor',
      'APP-REFACTOR: Systematic Code Refactoring & Deployment Optimization',
      'Address technical debt, fix TypeScript/ESLint errors, improve code organization, and ensure clean Vercel deployments.',
      'epic',
      'epic-refactor',
      'critical',
      'in_progress',
      'Antonio Jones',
      'Antonio Jones',
      jsonb_build_array(
        'All TypeScript errors resolved',
        'All ESLint errors resolved',
        'Clean Vercel deployments with no build warnings',
        'Code organization follows best practices',
        'Documentation updated and comprehensive'
      ),
      NOW()
    );
    v_epic_id := 'epic-refactor';
    RAISE NOTICE 'Created APP-REFACTOR epic';
  END IF;

  -- Create documentation assessment task
  INSERT INTO user_stories (
    id,
    title,
    description,
    acceptance_criteria,
    status,
    priority,
    story_points,
    parent_id,
    story_type,
    assignee,
    reporter,
    created_at,
    updated_at
  ) VALUES (
    'refactor-004',
    'System Level Documentation Assessment',
    E'Evaluate where documentation gaps exist for business users and ensure critical information is accessible within the application UI, not just in .md files.\n\n**Problem:**\n- Developers read .md files in /docs\n- Business users do NOT read .md files\n- Important information (refactor summaries, migration guides, system changes) is lost to business users\n\n**Solution:**\n- Audit existing documentation in /docs\n- Identify what needs to be surfaced in the application UI\n- Leverage settings?section=documentation for business user access\n- Ensure task records capture comprehensive information\n\n**Scope:**\n- Review all .md files in /docs directory\n- Identify business-critical information\n- Enhance settings?section=documentation UI\n- Create UI for viewing refactor summaries, migration guides, system changes\n- Ensure task manager displays rich documentation',
    jsonb_build_array(
      'All .md files in /docs have been reviewed and categorized',
      'Business-critical documentation identified and prioritized',
      'settings?section=documentation enhanced to display system documentation',
      'Task manager enhanced to display rich documentation from task records',
      'Refactor summaries, migration guides accessible to business users',
      'Business users can access system changes without reading .md files'
    ),
    'todo',
    'high',
    8,
    v_epic_id,
    'task',
    'Antonio Jones',
    'Antonio Jones',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    acceptance_criteria = EXCLUDED.acceptance_criteria,
    updated_at = NOW();

  RAISE NOTICE 'Created refactor-004: System Level Documentation Assessment';
END $$;

-- Verify the task was created
SELECT 
  id,
  title,
  status,
  priority,
  story_points,
  parent_id
FROM user_stories
WHERE id = 'refactor-004';
