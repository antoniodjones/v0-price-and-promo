-- Task: Refactor Admin Page (app/admin/page.tsx)
-- Epic: Application Refactoring (refactor-001)
-- Description: Refactor admin page from 630 lines to 150 lines by extracting components and services

INSERT INTO user_stories (
  id,
  epic, -- Changed from epic_id to epic (correct column name)
  title,
  description,
  status,
  priority,
  story_points,
  acceptance_criteria,
  technical_notes,
  created_at
)
VALUES (
  'refactor-001-admin-page',
  'refactor-001', -- Direct value instead of subquery
  'Refactor Admin Page',
  'Refactor app/admin/page.tsx from 630 lines to 150 lines by extracting AdminService, AdminStatsCards, PriceSourcesTab, AdminAnalyticsTab, AdminSettingsTab, and AdminProductsTab components.',
  'done',
  'high',
  5,
  'Admin page reduced from 630 to ~150 lines
AdminService created for data operations
Six focused components extracted
All functionality preserved
Code is more maintainable and testable',
  'Created lib/services/admin-service.ts
Created components/admin/admin-stats-cards.tsx
Created components/admin/price-sources-tab.tsx
Created components/admin/admin-analytics-tab.tsx
Created components/admin/admin-settings-tab.tsx
Created components/admin/admin-products-tab.tsx
Refactored app/admin/page.tsx to orchestration only',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  status = 'done',
  updated_at = NOW();
