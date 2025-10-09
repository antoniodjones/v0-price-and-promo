-- Link Existing Stories to Their Implementation Code
-- This script analyzes the codebase and links stories to the files/components that implement them

-- First, let's see which stories are missing code references
SELECT 
  id,
  title,
  epic,
  status,
  story_points,
  COALESCE(array_length(related_files, 1), 0) as file_count,
  COALESCE(array_length(related_components, 1), 0) as component_count,
  COALESCE(array_length(git_commits, 1), 0) as commit_count
FROM user_stories
WHERE 
  (related_files IS NULL OR array_length(related_files, 1) = 0)
  AND status != 'To Do'
ORDER BY epic, id;

-- Summary of stories needing code links
SELECT 
  epic,
  COUNT(*) as stories_without_code_links,
  SUM(story_points) as total_points
FROM user_stories
WHERE 
  (related_files IS NULL OR array_length(related_files, 1) = 0)
  AND status != 'To Do'
GROUP BY epic
ORDER BY stories_without_code_links DESC;
