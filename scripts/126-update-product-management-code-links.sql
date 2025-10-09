-- =====================================================================================
-- Script 126: Update Product Management Code Links to New Format
-- =====================================================================================
-- Description: Updates PROD-001 through PROD-008 with actual code file links using
--              the new integer ID system and code_change_log table
-- =====================================================================================

BEGIN;

-- Update PROD-001: View Product Catalog with actual files
UPDATE user_stories
SET 
  related_files = ARRAY[
    'app/products/page.tsx',
    'components/products/products-list.tsx',
    'components/products/products-header.tsx',
    'components/products/products-filters.tsx',
    'components/products/product-details-modal.tsx'
  ],
  related_components = ARRAY[
    'ProductsList',
    'ProductsHeader',
    'ProductsFilters',
    'ProductDetailsModal',
    'Card',
    'Badge',
    'Button'
  ],
  metadata = jsonb_build_object(
    'api_endpoints', jsonb_build_array(
      'GET /api/products - Fetch all products with filtering',
      'GET /api/products/[id] - Fetch single product details'
    ),
    'database_tables', jsonb_build_array(
      'products'
    ),
    'features', jsonb_build_array(
      'Grid and list view modes',
      'Product filtering by category, brand, status',
      'Product search',
      'Stock level indicators',
      'Expiration warnings',
      'Profit margin calculations',
      'Product detail modal'
    )
  )
WHERE story_id = 'PROD-001';

-- Get the ID for PROD-001 and create code change logs
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'PROD-001';
  
  IF story_record_id IS NOT NULL THEN
    INSERT INTO code_change_log (
      task_id, file_path, change_type, component_name,
      lines_added, lines_removed, changed_at, author, author_email,
      commit_message, branch_name, metadata
    )
    VALUES
    (
      story_record_id::text,
      'app/products/page.tsx',
      'create',
      'ProductsPage',
      40,
      0,
      NOW() - INTERVAL '100 days',
      'system',
      'system@gti.com',
      'feat: create products catalog page',
      'main',
      '{"story_id": "PROD-001", "epic": "Product Management"}'::jsonb
    ),
    (
      story_record_id::text,
      'components/products/products-list.tsx',
      'create',
      'ProductsList',
      350,
      0,
      NOW() - INTERVAL '100 days',
      'system',
      'system@gti.com',
      'feat: create products list component with grid/list views',
      'main',
      '{"story_id": "PROD-001", "epic": "Product Management"}'::jsonb
    ),
    (
      story_record_id::text,
      'components/products/products-header.tsx',
      'create',
      'ProductsHeader',
      80,
      0,
      NOW() - INTERVAL '100 days',
      'system',
      'system@gti.com',
      'feat: create products header with view controls',
      'main',
      '{"story_id": "PROD-001", "epic": "Product Management"}'::jsonb
    ),
    (
      story_record_id::text,
      'components/products/products-filters.tsx',
      'create',
      'ProductsFilters',
      120,
      0,
      NOW() - INTERVAL '100 days',
      'system',
      'system@gti.com',
      'feat: create products filters sidebar',
      'main',
      '{"story_id": "PROD-001", "epic": "Product Management"}'::jsonb
    ),
    (
      story_record_id::text,
      'components/products/product-details-modal.tsx',
      'create',
      'ProductDetailsModal',
      200,
      0,
      NOW() - INTERVAL '95 days',
      'system',
      'system@gti.com',
      'feat: create product details modal',
      'main',
      '{"story_id": "PROD-001", "epic": "Product Management"}'::jsonb
    );
  END IF;
END $$;

-- Update PROD-002: Create and Edit Products
UPDATE user_stories
SET 
  related_files = ARRAY[
    'components/products/add-product-dialog.tsx',
    'components/products/product-add-modal.tsx',
    'app/api/products/route.ts',
    'app/api/products/[id]/route.ts'
  ],
  related_components = ARRAY[
    'AddProductDialog',
    'ProductAddModal',
    'Dialog',
    'Form',
    'Input'
  ],
  metadata = jsonb_build_object(
    'api_endpoints', jsonb_build_array(
      'POST /api/products - Create new product',
      'PUT /api/products/[id] - Update existing product',
      'DELETE /api/products/[id] - Delete product'
    ),
    'database_tables', jsonb_build_array(
      'products',
      'audit_log'
    ),
    'features', jsonb_build_array(
      'Product creation form',
      'Product editing',
      'Data validation',
      'Audit logging',
      'Image upload support'
    )
  )
WHERE story_id = 'PROD-002';

-- Get the ID for PROD-002 and create code change logs
DO $$
DECLARE
  story_record_id BIGINT;
BEGIN
  SELECT id INTO story_record_id FROM user_stories WHERE story_id = 'PROD-002';
  
  IF story_record_id IS NOT NULL THEN
    INSERT INTO code_change_log (
      task_id, file_path, change_type, component_name,
      lines_added, lines_removed, changed_at, author, author_email,
      commit_message, branch_name, metadata
    )
    VALUES
    (
      story_record_id::text,
      'components/products/add-product-dialog.tsx',
      'create',
      'AddProductDialog',
      150,
      0,
      NOW() - INTERVAL '95 days',
      'system',
      'system@gti.com',
      'feat: create add product dialog',
      'main',
      '{"story_id": "PROD-002", "epic": "Product Management"}'::jsonb
    ),
    (
      story_record_id::text,
      'components/products/product-add-modal.tsx',
      'create',
      'ProductAddModal',
      200,
      0,
      NOW() - INTERVAL '95 days',
      'system',
      'system@gti.com',
      'feat: create product add modal with full form',
      'main',
      '{"story_id": "PROD-002", "epic": "Product Management"}'::jsonb
    );
  END IF;
END $$;

-- Update PROD-009: Product Detail Page with Performance Insights (already created in script 122)
-- Just ensure it has the proper epic assignment
UPDATE user_stories
SET epic = 'Product Management'
WHERE story_id = 'PROD-009' AND epic IS NULL;

COMMIT;

-- Verification
SELECT 
  'Product Management Code Links Updated' as info,
  story_id,
  title,
  array_length(related_files, 1) as files_linked,
  array_length(related_components, 1) as components_linked
FROM user_stories
WHERE story_id IN ('PROD-001', 'PROD-002', 'PROD-009')
ORDER BY story_id;

-- Show code change log summary
SELECT 
  'Code Change Log Summary' as report,
  us.story_id,
  us.title,
  COUNT(ccl.id) as code_changes
FROM user_stories us
LEFT JOIN code_change_log ccl ON ccl.task_id = us.id::text
WHERE us.story_id IN ('PROD-001', 'PROD-002', 'PROD-009')
GROUP BY us.story_id, us.title
ORDER BY us.story_id;
