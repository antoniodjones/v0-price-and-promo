-- Safe migration to add metadata column to user_stories table
-- This script is idempotent and can be run multiple times safely

-- Step 1: Add metadata column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_stories' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE user_stories 
        ADD COLUMN metadata JSONB DEFAULT '{"auto_commit_enabled": true}'::jsonb;
        
        RAISE NOTICE 'Added metadata column to user_stories table';
    ELSE
        RAISE NOTICE 'metadata column already exists, skipping';
    END IF;
END $$;

-- Step 2: Set default auto_commit_enabled for existing rows with NULL metadata
UPDATE user_stories 
SET metadata = '{"auto_commit_enabled": true}'::jsonb
WHERE metadata IS NULL;

-- Step 3: Create index if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'user_stories' 
        AND indexname = 'idx_user_stories_metadata'
    ) THEN
        CREATE INDEX idx_user_stories_metadata ON user_stories USING GIN (metadata);
        RAISE NOTICE 'Created GIN index on metadata column';
    ELSE
        RAISE NOTICE 'Index already exists, skipping';
    END IF;
END $$;

-- Step 4: Verify the changes
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_stories' 
AND column_name = 'metadata';

-- Show sample of updated data
SELECT task_id, metadata 
FROM user_stories 
LIMIT 5;
