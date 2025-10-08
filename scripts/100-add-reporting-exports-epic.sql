-- =====================================================================================
-- Script 100: Add Reporting & Exports Epic (8 Stories)
-- =====================================================================================
-- Description: Creates comprehensive user stories for reporting and export functionality
--              including custom reports, scheduled reports, export formats, report
--              templates, data visualization, report sharing, and audit reports.
-- 
-- Epic: Reporting & Exports (Phase 3 - Medium Priority)
-- Total Stories: 8
-- Total Story Points: 41
-- 
-- Dependencies: Analytics Dashboard, Audit Logging, All Data Sources
-- =====================================================================================

-- Story 1: Generate Custom Reports
INSERT INTO user_stories (
story_id, title, description, user_role, user_action, user_benefit,
status, priority, story_points, epic, acceptance_criteria,
technical_notes, linked_files, linked_components, dependencies,
created_at, updated_at)
VALUES
('REPORT-001',
'Generate Custom Reports',
'This feature allows business analysts to create custom reports by selecting data sources, metrics, filters, and groupings. Users can save report configurations, preview results, and export in multiple formats. The system provides a flexible report builder with drag-and-drop functionality.',
'Business Analyst',
'generate custom reports',
'I can analyze data according to specific business needs',
'Done',
'High',
5,
'Reporting & Exports',
'### Scenario 1: Create Custom Sales Report
```gherkin
Given I am on the Reports page
When I click "Create Custom Report"
And I select report type "Sales Analysis"
And I add data sources:
  - Orders
  - Products
  - Customers
And I select metrics:
  - Total Revenue
  - Order Count
  - Average Order Value
  - Profit Margin
And I add filters:
  - Date Range: Last 30 days
  - Market: Colorado
  - Customer Tier: A
And I group by: Product Category
And I click "Generate Report"
Then the report is generated with selected data
And I see results in a table format
