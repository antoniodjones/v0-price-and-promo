-- Add task for restructuring task ID format and hierarchy
-- This addresses the need to migrate from long task IDs to short format (RFTR-XXXX)
-- and implement proper parent/child task relationships

DO $$
DECLARE
    v_epic_id TEXT;
    v_task_exists BOOLEAN;
BEGIN
    -- Get or create the APP-REFACTOR epic
    SELECT id INTO v_epic_id
    FROM user_stories
    WHERE id = 'epic-refactor';

    IF v_epic_id IS NULL THEN
        INSERT INTO user_stories (
            id,
            title,
            description,
            status,
            priority,
            story_points,
            epic_category,
            created_at,
            updated_at
        ) VALUES (
            'epic-refactor',
            'Application Refactoring',
            'Systematic refactoring of application components to improve maintainability, reduce duplication, and establish consistent patterns.',
            'in_progress',
            'high',
            100,
            'APP-REFACTOR',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        v_epic_id := 'epic-refactor';
    END IF;

    -- Check if task already exists before inserting
    SELECT EXISTS(SELECT 1 FROM user_stories WHERE id = 'refactor-005') INTO v_task_exists;
    
    IF v_task_exists THEN
        RAISE NOTICE 'Task refactor-005 already exists, skipping creation';
    ELSE
        -- Create task for restructuring task IDs and hierarchy
        INSERT INTO user_stories (
            id,
            title,
            description,
            acceptance_criteria,
            status,
            priority,
            story_points,
            parent_id,
            metadata,
            created_at,
            updated_at
        ) VALUES (
            'refactor-005',
            'Restructure Task ID Format and Hierarchy',
            E'Migrate task management system to use clean, short task IDs and proper parent/child relationships.\n\n' ||
            E'**Current Issues:**\n' ||
            E'- Task IDs are too long (e.g., "refactor-003-a", "refactor-003-b")\n' ||
            E'- Phase suffixes make UI look cluttered\n' ||
            E'- Child tasks should be subtasks, not separate top-level tasks\n\n' ||
            E'**Target Format:**\n' ||
            E'- Short prefix (max 4 chars): RFTR-0001, RFTR-0002\n' ||
            E'- Parent tasks with subtasks (hierarchical structure)\n' ||
            E'- Clean titles without phase suffixes\n\n' ||
            E'**Implementation:**\n' ||
            E'1. Define task ID prefix standards (RFTR, FEAT, BUG, etc.)\n' ||
            E'2. Migrate existing tasks to new ID format\n' ||
            E'3. Restructure tasks to use parent/child relationships\n' ||
            E'4. Update task creation scripts to use new format\n' ||
            E'5. Update UI to display hierarchical task structure',
            jsonb_build_array(
                'Task IDs use short prefix format (max 4 chars)',
                'Parent/child task relationships properly established',
                'No phase suffixes in task titles',
                'All existing tasks migrated to new format',
                'Task creation scripts updated',
                'UI displays clean, hierarchical task structure'
            ),
            'todo',
            'high',
            8,
            v_epic_id,
            jsonb_build_object(
                'auto_commit_enabled', true,
                'task_type', 'refactor',
                'target_format', 'RFTR-XXXX',
                'max_prefix_length', 4
            ),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );

        RAISE NOTICE 'Task refactor-005 created successfully';
    END IF;
END $$;

-- Verify the task status
SELECT
    id,
    title,
    status,
    priority,
    story_points,
    parent_id
FROM user_stories
WHERE id = 'refactor-005';
