-- Phase 4: Low Priority & Specialized Features
-- Epic 17: Product Management (8 stories)
-- This epic covers product catalog management, inventory tracking, batch management, and product analytics

-- Story 1: Create and Manage Product Catalog
INSERT INTO user_stories (
story_id,
title,
description,
user_role,
user_benefit,
user_action,
status,
priority,
story_points,
epic,
acceptance_criteria,
technical_notes,
linked_files,
linked_components,
dependencies,
created_at,
updated_at
) VALUES
('PROD-001',
'Create and Manage Product Catalog',
'This feature allows administrators to create, view, update, and delete products in the catalog. Users can enter product information including name, SKU, category, brand, pricing, and specifications. The system validates data and maintains product history.',
'Product Manager',
'I can maintain an accurate and comprehensive product catalog',
'create and manage product catalog',
'Done',
'High',
6,
'Product Management',
'### Scenario 1: Create New Product
\`\`\`gherkin
Given I am on the Product Management page
When I click "Add Product"
And I enter product details:
  | Field | Value |
  | Product Name | Blue Dream 1g |
  | SKU | BD-1G-001 |
  | Category | Flower |
  | Brand | Premium Cannabis Co |
  | Base Price | $25.00 |
  | THC % | 22.5% |
  | CBD % | 0.8% |
  | Description | Premium sativa-dominant hybrid |
And I upload product image
And I click "Create Product"
Then the product is created
And I see "Product created successfully"
And the product appears in the catalog
