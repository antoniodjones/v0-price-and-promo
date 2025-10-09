-- Check current story ID format and identify issues
SELECT 
    story_id,
    title,
    epic_name,
    phase,
    story_points,
    status
FROM user_stories
ORDER BY 
    CASE 
        WHEN story_id ~ '^\d+$' THEN LPAD(story_id, 10, '0')
        ELSE story_id
    END
LIMIT 50;

-- Count stories by ID format
SELECT 
    CASE 
        WHEN story_id ~ '^\d{5}$' THEN 'Correct Format (00001-99999)'
        WHEN story_id ~ '^\d+$' THEN 'Numeric but wrong length'
        ELSE 'Non-numeric format'
    END as id_format,
    COUNT(*) as count
FROM user_stories
GROUP BY 
    CASE 
        WHEN story_id ~ '^\d{5}$' THEN 'Correct Format (00001-99999)'
        WHEN story_id ~ '^\d+$' THEN 'Numeric but wrong length'
        ELSE 'Non-numeric format'
    END;

-- Show total count
SELECT COUNT(*) as total_stories FROM user_stories;
