-- Force renumber ALL story IDs to proper 5-digit format (00001-00999)
-- This will overwrite any existing story_id values

DO $$
DECLARE
  story_record RECORD;
  new_number INTEGER := 1;
  new_story_id TEXT;
  total_updated INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting story ID renumbering...';
  
  -- Loop through ALL stories in logical order
  FOR story_record IN
    SELECT id, story_id as old_story_id, title
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
  LOOP
    -- Format new ID with 5 digits and leading zeros
    new_story_id := LPAD(new_number::TEXT, 5, '0');
    
    -- Update the story
    UPDATE user_stories
    SET 
      story_id = new_story_id,
      updated_at = NOW()
    WHERE id = story_record.id;
    
    total_updated := total_updated + 1;
    
    -- Log progress every 50 stories
    IF new_number % 50 = 0 THEN
      RAISE NOTICE 'Processed % stories...', new_number;
    END IF;
    
    new_number := new_number + 1;
  END LOOP;
  
  RAISE NOTICE 'Successfully renumbered % stories to format 00001-00999', total_updated;
END $$;

-- Verify all stories now have proper format
SELECT 
  COUNT(*) as total_stories,
  COUNT(CASE WHEN story_id ~ '^\d{5}$' THEN 1 END) as properly_formatted,
  COUNT(CASE WHEN story_id !~ '^\d{5}$' THEN 1 END) as still_incorrect,
  MIN(story_id) as first_id,
  MAX(story_id) as last_id
FROM user_stories;

-- Show first and last 10 stories
(SELECT story_id, title, epic_name, phase FROM user_stories ORDER BY story_id::INTEGER LIMIT 10)
UNION ALL
(SELECT story_id, title, epic_name, phase FROM user_stories ORDER BY story_id::INTEGER DESC LIMIT 10)
ORDER BY story_id::INTEGER;
