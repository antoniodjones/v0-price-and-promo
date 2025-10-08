-- =====================================================================================
-- Script 99: Link Promotion Management Code to User Stories
-- =====================================================================================
-- Description: Links existing promotion management code files to user stories with
--              Git history integration for comprehensive traceability.
-- =====================================================================================

-- Link PROMO-001: Create and Manage BOGO Promotions
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-001', 'app/api-docs/page.tsx', 'implementation', 'API documentation for BOGO promotions endpoint', NOW()),
('PROMO-001', 'app/demo-presentation/page.tsx', 'documentation', 'Demo presentation showing BOGO promotion features', NOW()),
('PROMO-001', 'app/api/promotions/bogo/route.ts', 'implementation', 'BOGO promotion API route handler', NOW()),
('PROMO-001', 'components/promotions/bogo-wizard.tsx', 'implementation', 'BOGO promotion creation wizard component', NOW());

-- Link PROMO-002: Create and Manage Bundle Deals
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-002', 'components/bundle-deals/bundle-deal-wizard.tsx', 'implementation', 'Bundle deal creation wizard', NOW()),
('PROMO-002', 'components/bundle-deals/bundle-deals-list.tsx', 'implementation', 'Bundle deals list display', NOW()),
('PROMO-002', 'components/bundle-deals/bundle-deals-stats.tsx', 'implementation', 'Bundle deals statistics dashboard', NOW()),
('PROMO-002', 'components/bundle-deals/bundle-deals-header.tsx', 'implementation', 'Bundle deals page header', NOW()),
('PROMO-002', 'components/bundle-deals/bundle-deal-edit-modal.tsx', 'implementation', 'Bundle deal editing modal', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-type-step.tsx', 'implementation', 'Bundle type selection step', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-products-step.tsx', 'implementation', 'Bundle products selection step', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-pricing-step.tsx', 'implementation', 'Bundle pricing configuration step', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-rules-step.tsx', 'implementation', 'Bundle rules configuration step', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-dates-step.tsx', 'implementation', 'Bundle dates configuration step', NOW()),
('PROMO-002', 'components/bundle-deals/wizard-steps/bundle-review-step.tsx', 'implementation', 'Bundle review and confirmation step', NOW()),
('PROMO-002', 'app/api/promotions/bundles/route.ts', 'implementation', 'Bundle promotions API route handler', NOW());

-- Link PROMO-003: Promotional Campaign Management
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-003', 'app/promotions/page.tsx', 'implementation', 'Main promotions management page', NOW()),
('PROMO-003', 'app/api/promotions/campaigns/route.ts', 'implementation', 'Campaign management API routes', NOW()),
('PROMO-003', 'components/promotions/campaign-manager.tsx', 'implementation', 'Campaign management interface', NOW()),
('PROMO-003', 'components/promotions/campaign-performance.tsx', 'implementation', 'Campaign performance analytics', NOW());

-- Link PROMO-004: Promotion Performance Tracking
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-004', 'app/api-docs/page.tsx', 'documentation', 'API documentation for promotion performance endpoints', NOW()),
('PROMO-004', 'app/api/promotions/performance/route.ts', 'implementation', 'Promotion performance API route', NOW()),
('PROMO-004', 'components/promotions/promotion-analytics.tsx', 'implementation', 'Promotion analytics dashboard', NOW()),
('PROMO-004', 'components/analytics/discount-analytics.tsx', 'implementation', 'Discount analytics component', NOW()),
('PROMO-004', 'components/analytics/advanced-analytics-dashboard.tsx', 'implementation', 'Advanced analytics dashboard with promotion metrics', NOW());

-- Link PROMO-005: Promotion Validation and Conflict Detection
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-005', 'app/api-docs/page.tsx', 'documentation', 'API documentation for promotion validation', NOW()),
('PROMO-005', 'app/api/promotions/validate/route.ts', 'implementation', 'Promotion validation API route', NOW()),
('PROMO-005', 'components/promotions/promotion-validator.tsx', 'implementation', 'Promotion validation interface', NOW()),
('PROMO-005', 'components/promotions/conflict-resolver.tsx', 'implementation', 'Promotion conflict resolution interface', NOW());

-- Link PROMO-006: Promotional Code Management
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-006', 'app/promo-codes/page.tsx', 'implementation', 'Promo codes management page', NOW()),
('PROMO-006', 'app/api/promo-codes/route.ts', 'implementation', 'Promo codes API routes', NOW()),
('PROMO-006', 'app/api/promo-codes/[id]/route.ts', 'implementation', 'Individual promo code API routes', NOW()),
('PROMO-006', 'components/promo-codes/promo-code-manager.tsx', 'implementation', 'Promo code management interface', NOW());

-- Link PROMO-007: Promotion Detection and Recommendations
INSERT INTO story_code_links (story_id, file_path, link_type, description, created_at)
VALUES
('PROMO-007', 'app/promotion-detection/page.tsx', 'implementation', 'Promotion detection and recommendations page', NOW()),
('PROMO-007', 'app/api/promotion-detection/route.ts', 'implementation', 'Promotion detection API routes', NOW()),
('PROMO-007', 'components/promotions/promotion-detector.tsx', 'implementation', 'AI-powered promotion detector', NOW()),
('PROMO-007', 'components/promotions/recommendation-card.tsx', 'implementation', 'Promotion recommendation card component', NOW());

-- Verification
SELECT 'Total code links for Promotion Management:' as info, COUNT(*) as count 
FROM story_code_links 
WHERE story_id LIKE 'PROMO-%';

SELECT 'Code links by story:' as info, story_id, COUNT(*) as link_count 
FROM story_code_links 
WHERE story_id LIKE 'PROMO-%'
GROUP BY story_id
ORDER BY story_id;
