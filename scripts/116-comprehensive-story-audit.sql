-- Comprehensive audit of all user stories in the database
-- Check actual counts, identify gaps, and list all existing stories

-- 1. Get total count and breakdown
SELECT 
  'Total Stories' as metric,
  COUNT(*) as count
FROM user_stories
UNION ALL
SELECT 
  'Stories by Phase',
  COUNT(*)
FROM user_stories
GROUP BY phase
UNION ALL
SELECT
  'Unique Epics',
  COUNT(DISTINCT epic_name)
FROM user_stories;

-- 2. Count stories by epic
SELECT 
  epic_name,
  COUNT(*) as story_count,
  SUM(story_points) as total_points
FROM user_stories
GROUP BY epic_name
ORDER BY epic_name;

-- 3. List all story IDs and titles
SELECT 
  story_id,
  title,
  epic_name,
  phase,
  priority,
  story_points
FROM user_stories
ORDER BY story_id;

-- 4. Check for stories not in our documented phases
SELECT 
  story_id,
  title,
  epic_name,
  created_at
FROM user_stories
WHERE epic_name NOT IN (
  'Inventory Discounts',
  'Volume Pricing',
  'Tiered Pricing',
  'Rebate Reports',
  'BOGO Promotions',
  'Analytics Dashboard',
  'Discount Analytics',
  'Pricing Simulator',
  'Audit Logging',
  'Bundle Deals',
  'User Management',
  'Business Administration',
  'Module Management',
  'Revenue Optimization',
  'Compliance Center',
  'Customer Management',
  'Product Management',
  'Price Tracking',
  'Market Intelligence',
  'Performance Monitoring',
  'Predictive Analytics'
)
ORDER BY created_at;

-- 5. Summary statistics
SELECT 
  phase,
  COUNT(*) as stories,
  COUNT(DISTINCT epic_name) as epics,
  SUM(story_points) as points,
  AVG(story_points) as avg_points
FROM user_stories
GROUP BY phase
ORDER BY phase;
