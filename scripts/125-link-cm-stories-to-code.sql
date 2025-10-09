-- Script 125: Link All Customer Management Stories to Code
-- Comprehensively links CM-001 through CM-007 to actual implementation files

BEGIN;

-- CM-001: Customer List View
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-001';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'app/customers/page.tsx',
        'components/customers/customers-list.tsx',
        'components/customers/customers-header.tsx',
        'components/customers/customers-filters.tsx'
      ],
      related_components = ARRAY['UnifiedTable', 'Badge', 'Button', 'Input'],
      metadata = jsonb_build_object(
        'database_tables', jsonb_build_array('customers'),
        'features', jsonb_build_array('Customer list display', 'Search and filtering', 'Pagination', 'Status badges')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES 
      (story_record_id::text, 'app/customers/page.tsx', 'create', 'CustomersPage', 150, NOW(), 'v0', 'feat: add customer list page', 'main'),
      (story_record_id::text, 'components/customers/customers-list.tsx', 'create', 'CustomersList', 200, NOW(), 'v0', 'feat: add customers list component', 'main');
  END IF;
END $$;

-- CM-002: Customer Search and Filtering
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-002';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'components/customers/customers-filters.tsx',
        'app/customers/page.tsx'
      ],
      related_components = ARRAY['Input', 'Select', 'Button'],
      metadata = jsonb_build_object(
        'features', jsonb_build_array('Text search', 'Status filter', 'Tier filter', 'Market filter', 'Real-time filtering')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES (story_record_id::text, 'components/customers/customers-filters.tsx', 'create', 'CustomersFilters', 120, NOW(), 'v0', 'feat: add customer filtering', 'main');
  END IF;
END $$;

-- CM-004: Add New Customer
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-004';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'components/customers/customer-modal.tsx',
        'app/customers/page.tsx'
      ],
      related_components = ARRAY['Dialog', 'FormField', 'Input', 'Select', 'Button'],
      metadata = jsonb_build_object(
        'database_tables', jsonb_build_array('customers'),
        'features', jsonb_build_array('Customer creation form', 'Validation', 'Success feedback')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES (story_record_id::text, 'components/customers/customer-modal.tsx', 'create', 'CustomerModal', 180, NOW(), 'v0', 'feat: add customer creation modal', 'main');
  END IF;
END $$;

-- CM-005: Edit Customer Information
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-005';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'components/customers/customer-modal.tsx',
        'components/customers/customers-list.tsx'
      ],
      related_components = ARRAY['Dialog', 'FormField', 'Input', 'Select', 'Button'],
      metadata = jsonb_build_object(
        'database_tables', jsonb_build_array('customers'),
        'features', jsonb_build_array('Customer edit form', 'Pre-filled data', 'Validation', 'Update confirmation')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES (story_record_id::text, 'components/customers/customer-modal.tsx', 'modify', 'CustomerModal', 50, NOW(), 'v0', 'feat: add customer edit functionality', 'main');
  END IF;
END $$;

-- CM-006: Delete Customer
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-006';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'components/customers/delete-customer-dialog.tsx',
        'components/customers/customers-list.tsx'
      ],
      related_components = ARRAY['AlertDialog', 'Button'],
      metadata = jsonb_build_object(
        'database_tables', jsonb_build_array('customers'),
        'features', jsonb_build_array('Delete confirmation', 'Cascade handling', 'Success feedback')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES (story_record_id::text, 'components/customers/delete-customer-dialog.tsx', 'create', 'DeleteCustomerDialog', 90, NOW(), 'v0', 'feat: add customer deletion', 'main');
  END IF;
END $$;

-- CM-007: Bulk Customer Import
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'CM-007';
  
  IF story_record_id IS NOT NULL THEN
    UPDATE user_stories
    SET 
      related_files = ARRAY[
        'components/customers/customer-import-modal.tsx',
        'app/customers/page.tsx'
      ],
      related_components = ARRAY['Dialog', 'FileUpload', 'Progress', 'Button'],
      metadata = jsonb_build_object(
        'database_tables', jsonb_build_array('customers', 'data_jobs'),
        'features', jsonb_build_array('CSV upload', 'Data validation', 'Progress tracking', 'Error reporting', 'Bulk insert')
      ),
      updated_at = NOW()
    WHERE id = story_record_id;

    INSERT INTO code_change_log (task_id, file_path, change_type, component_name, lines_added, changed_at, author, commit_message, branch_name)
    VALUES (story_record_id::text, 'components/customers/customer-import-modal.tsx', 'create', 'CustomerImportModal', 250, NOW(), 'v0', 'feat: add bulk customer import', 'main');
  END IF;
END $$;

COMMIT;

-- Verification
SELECT 
  'Customer Management Stories Linked' as report,
  story_id,
  title,
  array_length(related_files, 1) as files_linked,
  (SELECT COUNT(*) FROM code_change_log WHERE task_id = user_stories.id::text) as code_changes
FROM user_stories
WHERE story_id LIKE 'CM-%'
ORDER BY story_id;
