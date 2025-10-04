-- Update cs-003 description to reflect the revised approach
-- This task now requires pushing code to GitHub first

UPDATE user_stories
SET 
  description = 'PREREQUISITE: Push all current code to GitHub first. Then analyze complete git history to extract all commits and file changes from initial setup to present, infer task associations for untracked work, create retroactive tasks for all features built in v0, and populate complete historical data in code_change_log for full traceability',
  acceptance_criteria = '["All current code pushed to GitHub", "Complete git history extracted and parsed (5+ days)", "Task associations inferred for untracked work", "Retroactive tasks created for all v0 work", "code_change_log populated with complete history", "Validation report showing 100% coverage", "Task-file mappings verified"]'
WHERE id = 'cs-003';

-- Update cs-002 to note it should come after cs-003
UPDATE user_stories
SET 
  description = 'Create webhook endpoint to receive GitHub push events, parse commit messages for task IDs, extract file changes, and automatically populate code_change_log table. This enables real-time tracking of all future code changes',
  dependencies = '["cs-001", "cs-003"]'
WHERE id = 'cs-002';

-- Verify the updates
SELECT id, title, description, dependencies 
FROM user_stories 
WHERE id IN ('cs-002', 'cs-003')
ORDER BY id;
