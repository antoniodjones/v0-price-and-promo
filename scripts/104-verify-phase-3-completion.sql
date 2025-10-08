-- =====================================================================================
-- Phase 3 Completion Verification
-- =====================================================================================
-- Verify all Phase 3 stories have been created with proper structure
-- =====================================================================================

-- Summary by Epic
SELECT 
  epic,
  COUNT(*) as total_stories,
  SUM(story_points) as total_points,
  COUNT(*) FILTER (WHERE priority = 'Critical') as critical_count,
  COUNT(*) FILTER (WHERE priority = 'High') as high_count,
  COUNT(*) FILTER (WHERE priority = 'Medium') as medium_count,
  COUNT(*) FILTER (WHERE priority = 'Low') as low_count
FROM user_stories
WHERE epic IN (
  'Promotion Management',
  'Reporting & Exports',
  'System Configuration',
  'User Management',
  'API Documentation'
)
GROUP BY epic
ORDER BY 
  CASE epic
    WHEN 'Promotion Management' THEN 1
    WHEN 'Reporting & Exports' THEN 2
    WHEN 'System Configuration' THEN 3
    WHEN 'User Management' THEN 4
    WHEN 'API Documentation' THEN 5
  END;

-- Phase 3 Total
SELECT 
  'Phase 3 Total' as phase,
  COUNT(*) as total_stories,
  SUM(story_points) as total_points
FROM user_stories
WHERE epic IN (
  'Promotion Management',
  'Reporting & Exports',
  'System Configuration',
  'User Management',
  'API Documentation'
);

-- Verify all stories have required fields
SELECT 
  story_id,
  title,
  CASE 
    WHEN acceptance_criteria IS NULL OR acceptance_criteria = '' THEN 'Missing acceptance criteria'
    WHEN technical_notes IS NULL OR technical_notes = '' THEN 'Missing technical notes'
    WHEN linked_files IS NULL OR array_length(linked_files, 1) = 0 THEN 'Missing linked files'
    WHEN linked_components IS NULL OR array_length(linked_components, 1) = 0 THEN 'Missing linked components'
    ELSE 'Complete'
  END as validation_status
FROM user_stories
WHERE epic IN (
  'Promotion Management',
  'Reporting & Exports',
  'System Configuration',
  'User Management',
  'API Documentation'
)
ORDER BY epic, story_id;

-- List all Phase 3 stories
SELECT 
  story_id,
  title,
  epic,
  priority,
  story_points,
  status
FROM user_stories
WHERE epic IN (
  'Promotion Management',
  'Reporting & Exports',
  'System Configuration',
  'User Management',
  'API Documentation'
)
ORDER BY 
  CASE epic
    WHEN 'Promotion Management' THEN 1
    WHEN 'Reporting & Exports' THEN 2
    WHEN 'System Configuration' THEN 3
    WHEN 'User Management' THEN 4
    WHEN 'API Documentation' THEN 5
  END,
  story_id;
