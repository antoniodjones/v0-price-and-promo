-- Diagnostic: Check current state of user_stories ID column

-- Check the data type of the id column
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_stories' 
    AND column_name IN ('id', 'parent_id');

-- Check sample IDs to see their format
SELECT 
    id,
    pg_typeof(id) as id_type,
    title,
    created_at
FROM user_stories
ORDER BY created_at
LIMIT 10;

-- Check if sequence exists
SELECT 
    sequence_name,
    last_value,
    increment_by
FROM information_schema.sequences
WHERE sequence_name LIKE '%user_stories%';

-- Check total count and ID range
SELECT 
    COUNT(*) as total_stories,
    MIN(id::text) as min_id,
    MAX(id::text) as max_id
FROM user_stories;
