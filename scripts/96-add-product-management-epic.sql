-- =====================================================================================
-- Script 96: Add Product Management Epic (8 Stories)
-- =====================================================================================
-- Description: Creates user stories for the Product Management feature
-- Epic: Product Management (8 stories, 41 story points)
-- Phase: 2 (High Priority Business Features)
-- =====================================================================================

-- Story 1: View Product Catalog
INSERT INTO user_stories (
story_id, title, description, user_role, user_action, user_benefit,
status, priority, story_points, epic, acceptance_criteria,
technical_notes, related_files, related_components, dependencies,
created_at, updated_at
) VALUES
('PROD-001',
'View Product Catalog with Search and Filters',
'This feature provides a comprehensive product catalog with search, filtering, and sorting capabilities. Business managers can view product details including SKU, pricing, inventory levels, categories, and brands. The interface supports quick access to product-specific actions and bulk operations.',
'Business Manager',
'view and search product catalog',
'I can quickly find products and access their information',
'Done',
'Critical',
5,
'Product Management',
'### Scenario 1: View Product Catalog
\`\`\`gherkin
Given I am logged in as a business manager
When I navigate to the Products page
Then I see a list of all products with:
  | Product Name | SKU | Category | Brand | Price | Stock | Status |
  | Blue Dream 1g | BD-001 | Flower | Premium | $25.00 | 450 | Active |
  | OG Kush 1g | OK-001 | Flower | Premium | $25.00 | 320 | Active |
  | Vape Pen | VP-001 | Vaporizers | VapeCo | $15.00 | 180 | Active |
And I can sort by any column
And I can filter by category, brand, or status
