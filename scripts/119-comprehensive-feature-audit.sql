-- Comprehensive audit to identify ALL features that need user stories
-- This will help us create the missing 300-500+ stories

-- Current story distribution
SELECT 
    epic_name,
    COUNT(*) as story_count,
    SUM(story_points) as total_points,
    AVG(story_points) as avg_points
FROM user_stories
GROUP BY epic_name
ORDER BY story_count DESC;

-- Stories by phase
SELECT 
    phase,
    COUNT(*) as story_count,
    SUM(story_points) as total_points
FROM user_stories
GROUP BY phase
ORDER BY phase;

-- Story point distribution
SELECT 
    story_points,
    COUNT(*) as count
FROM user_stories
GROUP BY story_points
ORDER BY story_points;

-- Identify epics with too few stories (should have 15-30 each)
SELECT 
    epic_name,
    COUNT(*) as current_stories,
    30 - COUNT(*) as stories_needed
FROM user_stories
GROUP BY epic_name
HAVING COUNT(*) < 15
ORDER BY COUNT(*);
