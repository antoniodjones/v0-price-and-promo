-- Check current story ID format
SELECT 
  id,
  story_id,
  title,
  epic_name,
  phase
FROM user_stories
ORDER BY 
  CASE phase
    WHEN 'Phase 1: Critical MVP Features' THEN 1
    WHEN 'Phase 2: High Priority Business Features' THEN 2
    WHEN 'Phase 3: Medium Priority Features' THEN 3
    WHEN 'Phase 4: Low Priority & Specialized Features' THEN 4
    ELSE 5
  END,
  epic_name,
  created_at
LIMIT 20;
