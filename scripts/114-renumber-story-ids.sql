-- Renumber all story IDs to sequential format starting at 00001
-- This maintains the logical order: Phase 1 → Phase 2 → Phase 3 → Phase 4
-- Within each phase, stories are ordered by epic and creation date

-- Create a temporary sequence for renumbering
DO $$
DECLARE
  story_record RECORD;
  new_number INTEGER := 1;
  new_story_id TEXT;
BEGIN
  -- Loop through all stories in the correct order
  FOR story_record IN
    SELECT id
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
    -- Format the new story ID with leading zeros (00001, 00002, etc.)
    new_story_id := LPAD(new_number::TEXT, 5, '0');
    
    -- Update the story with the new ID
    UPDATE user_stories
    SET story_id = new_story_id
    WHERE id = story_record.id;
    
    -- Increment the counter
    new_number := new_number + 1;
  END LOOP;
  
  RAISE NOTICE 'Successfully renumbered % stories', new_number - 1;
END $$;

-- Verify the renumbering
SELECT 
  story_id,
  title,
  epic_name,
  phase
FROM user_stories
ORDER BY story_id::INTEGER
LIMIT 10;
