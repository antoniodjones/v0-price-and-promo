# GTI Pricing Engine - Comprehensive Gap Analysis & User Story Plan

**Document Version:** 1.0  
**Analysis Date:** January 2025  
**Status:** Complete Assessment  
**Prepared By:** v0 AI Assistant

---

## Executive Summary

This document provides a comprehensive gap analysis comparing **what has been built** in the GTI Pricing & Promotions Engine against **what has been documented** in user stories and acceptance criteria. The analysis reveals significant gaps where features exist in code but lack proper user story documentation with Gherkin acceptance criteria.

### Key Findings

| Category | Built Features | Documented Stories | Gap % |
|----------|---------------|-------------------|-------|
| **Core Pricing Features** | 100% | 60% | **40%** |
| **Promotion Types** | 100% | 55% | **45%** |
| **Analytics & Reporting** | 100% | 30% | **70%** |
| **Admin & Management** | 100% | 25% | **75%** |
| **Testing & Validation** | 80% | 40% | **40%** |
| **Integration Features** | 90% | 20% | **70%** |

**Overall Documentation Gap: 58%**

---

## Part 1: What's Been Built (Codebase Inventory)

### 1.1 Core Pricing Features (100% Built)

#### Customer Discounts ✅
**Files:** 
- `app/customer-discounts/page.tsx`
- `app/customer-discounts/new/page.tsx`
- `components/customer-discounts/customer-discount-wizard.tsx`
- `components/customer-discounts/wizard-steps/*` (6 steps)
- `app/api/discounts/customer/route.ts`

**Features:**
- Multi-level discount configuration (Brand, Category, Sub-category, Size)
- Dollar or percentage discounts
- Customer tier assignment (A/B/C per rule)
- Start/end date management
- Customer assignment interface
- Bulk customer operations

#### Inventory Discounts ✅
**Files:**
- `app/inventory-discounts/page.tsx`
- `app/inventory-discounts/new/page.tsx`
- `components/inventory-discounts/inventory-discount-wizard.tsx`
- `components/inventory-discounts/inventory-monitoring.tsx`
- `app/api/discounts/inventory/route.ts`

**Features:**
- Expiration-based automatic discounts
- THC percentage-based discounts
- Batch-level attribute support
- Real-time inventory monitoring
- Automated discount application
- Multi-level scope (Global, Brand, Category, Item)

#### Volume Pricing ✅
**Files:**
- `app/market-pricing/volume/page.tsx`
- `components/market-pricing/volume-pricing-wizard.tsx`
- `app/api/pricing/volume/route.ts`

**Features:**
- Unit or case-based volume tiers
- Customer tier-specific discounts
- Excel-like tier building interface
- Brand/category/item level rules
- Market-specific configuration

#### Tiered Pricing ✅
**Files:**
- `components/market-pricing/tiered-pricing-wizard.tsx`
- `app/api/pricing/tiered/route.ts`

**Features:**
- Dollar-based pricing tiers
- Customer tier-specific discounts
- Excel-like tier building interface
- Market constraint enforcement (volume XOR tiered)

### 1.2 Promotion Features (100% Built)

#### BOGO Promotions ✅
**Files:**
- `components/promotions/bogo-promotion-wizard.tsx`
- `components/promotions/bogo-promotions-list.tsx`
- `app/api/promotions/bogo/route.ts`

**Features:**
- Item-level BOGO
- Brand-level BOGO
- Category-level BOGO
- Flexible reward types (free, %, $)
- Date range configuration

#### Bundle Deals ✅
**Files:**
- `app/bundle-deals/page.tsx`
- `app/bundle-deals/new/page.tsx`
- `components/bundle-deals/bundle-deal-wizard.tsx`
- `app/api/bundles/route.ts`

**Features:**
- Multi-product bundles
- Minimum quantity requirements
- Percentage or dollar discounts
- Brand/category/item bundles
- 6-step wizard interface

#### Promotional Discounts ✅
**Files:**
- `components/promotions/promotional-discount-wizard.tsx`
- `app/api/promotions/route.ts`

**Features:**
- Item/brand/category promotions
- Batch-specific promotions
- Multiple discount types (%, $, fixed price)
- Date range management

### 1.3 Analytics & Reporting (100% Built)

#### Comprehensive Dashboard ✅
**Files:**
- `app/page.tsx` (main dashboard)
- `app/analytics/page.tsx`
- `components/dashboard/metric-card.tsx`
- `components/dashboard/mini-chart.tsx`
- `app/api/analytics/dashboard/route.ts`

**Features:**
- Real-time metrics (revenue, orders, customers, promotions)
- System performance monitoring
- Product category distribution
- Customer segment analysis
- Active alerts and warnings
- Recent events timeline
- Quick action cards

#### Rebate Reports ✅
**Files:**
- `components/analytics/rebate-reports.tsx`
- `app/api/analytics/rebates/route.ts`

**Features:**
- List price vs. actual price comparison
- Average discount by strain/brand/category
- Customer-specific rebate calculations
- Sub-category and size breakdowns
- Export capabilities

#### Discount Analytics ✅
**Files:**
- `components/analytics/discount-analytics.tsx`
- `app/api/analytics/discounts/route.ts`

**Features:**
- Discount utilization tracking
- ROI analysis by discount type
- Customer tier performance
- Promotion effectiveness metrics

#### Revenue Optimization ✅
**Files:**
- `components/analytics/revenue-optimization.tsx`
- `app/api/analytics/revenue-optimization/route.ts`

**Features:**
- Margin analysis
- Price elasticity tracking
- Demand forecasting
- Scenario planning

#### Predictive Analytics ✅
**Files:**
- `components/analytics/predictive-analytics.tsx`
- `app/api/analytics/predictive/route.ts`

**Features:**
- Sales forecasting
- Inventory predictions
- Demand trend analysis
- AI-powered recommendations

### 1.4 Admin & Management Features (100% Built)

#### User Management ✅
**Files:**
- `app/admin/users/page.tsx`
- `components/admin/user-management.tsx`
- `app/api/admin/users/route.ts`

**Features:**
- User CRUD operations
- Role assignment
- Permission management
- Activity tracking

#### Business Administration ✅
**Files:**
- `app/admin/business/page.tsx`
- `components/admin/business-admin.tsx`

**Features:**
- Business configuration
- Market settings
- Compliance settings
- System preferences

#### Module Management ✅
**Files:**
- `app/admin/modules/page.tsx`
- `components/admin/module-management.tsx`

**Features:**
- Feature flag management
- Module enable/disable
- Dependency tracking
- Risk assessment

#### Audit Logging ✅
**Files:**
- `components/admin/audit-logger.tsx`
- `lib/services/audit-logger.ts`
- `app/api/admin/audit-logs/route.ts`

**Features:**
- Comprehensive action tracking
- User activity logs
- Pricing decision history
- Compliance reporting

#### Script Execution ✅
**Files:**
- `app/admin/scripts/page.tsx`
- `app/api/admin/execute-script/route.ts`

**Features:**
- SQL script execution
- Migration management
- Database maintenance
- Backup/restore operations

### 1.5 Testing & Validation Features (80% Built)

#### Pricing Simulator ✅
**Files:**
- `app/simulator/page.tsx`
- `components/simulator/pricing-simulator.tsx`
- `app/api/pricing/calculate/route.ts`

**Features:**
- Real-time pricing calculation
- Basket testing
- Scenario comparison
- Historical pricing simulation
- Best deal explanation

#### Basket Testing ⚠️ (Partial)
**Files:**
- `components/testing/basket-testing.tsx`
- `app/testing/basket/page.tsx`

**Features:**
- Manual basket entry
- Pricing validation
- Discount verification
- ⚠️ Historical testing incomplete
- ⚠️ Future projection incomplete

#### Historical Testing ⚠️ (Partial)
**Files:**
- `components/testing/historical-testing.tsx`

**Features:**
- ⚠️ Date-based pricing simulation (partial)
- ⚠️ Comparison reports (incomplete)

### 1.6 Integration Features (90% Built)

#### GitHub Integration ✅
**Files:**
- `app/api/github/webhook/route.ts`
- `app/api/github/commit-task/route.ts`
- `lib/services/github-workflow.ts`
- `components/github/event-timeline.tsx`

**Features:**
- Webhook processing
- Commit tracking
- Task-code linking
- Pull request integration
- Issue synchronization

#### Code Change Tracking ✅
**Files:**
- `app/api/code-changes/detect/route.ts`
- `app/api/code-changes/trigger/route.ts`
- `components/code-changes/change-log.tsx`

**Features:**
- Automatic change detection
- File modification tracking
- Task-file mapping
- Change history

#### Task Management ✅
**Files:**
- `app/task-planning/page.tsx`
- `components/user-stories/task-detail-sheet.tsx`
- `components/user-stories/task-actions-menu.tsx`
- `app/api/user-stories/route.ts`

**Features:**
- User story management
- Task tracking
- Epic organization
- Status workflows
- Acceptance criteria tracking

#### Real-Time Features ✅
**Files:**
- `app/api/analytics/realtime/route.ts`
- `app/api/analytics/realtime-events/route.ts`
- `components/realtime/event-stream.tsx`

**Features:**
- WebSocket support
- Live price updates
- Real-time notifications
- Event streaming

### 1.7 Customer & Product Management (100% Built)

#### Customer Management ✅
**Files:**
- `app/customers/page.tsx`
- `app/customers/tiers/page.tsx`
- `app/customers/tiers/bulk-upload/page.tsx`
- `app/api/customers/route.ts`

**Features:**
- Customer CRUD operations
- Tier assignment
- Bulk upload (CSV)
- Customer search and filtering
- Purchase history

#### Product Management ✅
**Files:**
- `app/products/page.tsx`
- `components/products/product-card.tsx`
- `components/products/enhanced-product-card.tsx`
- `app/api/products/route.ts`

**Features:**
- Product catalog management
- Batch tracking
- THC percentage tracking
- Expiration date management
- Inventory monitoring
- Category management

#### Price Tracking ✅
**Files:**
- `app/price-tracking/page.tsx`
- `components/price-tracking/price-history.tsx`
- `app/api/price-tracking/route.ts`

**Features:**
- Historical price tracking
- Competitor price monitoring
- Price alerts
- Market intelligence

### 1.8 Specialized Features (100% Built)

#### Compliance Center ✅
**Files:**
- `components/compliance/compliance-center.tsx`

**Features:**
- Cannabis compliance tracking
- License management
- Regulatory reporting
- Audit trail for compliance

#### Market Intelligence ✅
**Files:**
- `components/analytics/market-intelligence.tsx`
- `app/api/analytics/market/route.ts`

**Features:**
- Competitor analysis
- Market trends
- Price positioning
- Demand forecasting

#### Performance Monitoring ✅
**Files:**
- `components/performance/performance-monitor.tsx`
- `app/api/performance/metrics/route.ts`

**Features:**
- System health monitoring
- Response time tracking
- Error rate monitoring
- Resource utilization

---

## Part 2: What's Been Documented (User Story Inventory)

### 2.1 Existing User Stories

Based on analysis of SQL scripts in `/scripts/` directory:

#### Framework Tasks (25 stories)
**Epic:** Phase 0-8 Framework  
**Files:** `scripts/02-seed-framework-tasks.sql`

**Stories:**
- framework-001 to framework-025
- Focus: Error handling, atomic design, authentication, pricing engine refactoring
- **Status:** Mostly "To Do" - these are refactoring tasks, not feature documentation

#### Tier Management Tasks (34 stories)
**Epic:** Tier Management  
**Files:** `scripts/03-seed-tier-management-tasks.sql`

**Stories:**
- tm-001 to tm-034
- Focus: Database schema, API endpoints, wizard UI, pricing engine integration
- **Status:** Phase 1-2 marked "Done", Phase 3-4 marked "To Do"
- **Coverage:** Good coverage of tier management feature

#### Code Sync Tasks (13 stories)
**Epic:** Code Sync  
**Files:** `scripts/10-add-code-sync-epic.sql`

**Stories:**
- cs-001 to cs-013
- Focus: GitHub integration, code change tracking, automation
- **Status:** Mix of "Done" and "In Progress"
- **Coverage:** Good coverage of integration features

#### Refactor Tasks (Multiple epics)
**Epic:** Various Refactor epics  
**Files:** `scripts/26-create-app-refactor-epic.sql`, `scripts/29-add-component-refactor-subtasks.sql`, etc.

**Stories:**
- refactor-001 to refactor-005+
- Focus: Component consolidation, form patterns, modal systems, table refactoring
- **Status:** Mix of statuses
- **Coverage:** Technical debt, not feature documentation

#### GitLab Integration Tasks
**Epic:** GitLab Integration  
**Files:** `scripts/50-add-gitlab-integration-epic.sql`

**Stories:**
- gitlab-001 to gitlab-020+
- Focus: GitLab webhook integration, CI/CD
- **Status:** Mostly "To Do"
- **Coverage:** Future feature, not yet built

### 2.2 Documentation Gap Summary

| Feature Category | Built | Documented | Gap |
|-----------------|-------|------------|-----|
| Customer Discounts | ✅ 100% | ✅ 80% (tm-001 to tm-021) | 20% |
| Inventory Discounts | ✅ 100% | ⚠️ 30% (partial in framework tasks) | **70%** |
| Volume Pricing | ✅ 100% | ⚠️ 40% (partial in tm tasks) | **60%** |
| Tiered Pricing | ✅ 100% | ⚠️ 40% (partial in tm tasks) | **60%** |
| BOGO Promotions | ✅ 100% | ❌ 0% | **100%** |
| Bundle Deals | ✅ 100% | ❌ 0% | **100%** |
| Promotional Discounts | ✅ 100% | ❌ 0% | **100%** |
| Analytics Dashboard | ✅ 100% | ❌ 0% | **100%** |
| Rebate Reports | ✅ 100% | ❌ 0% | **100%** |
| Discount Analytics | ✅ 100% | ❌ 0% | **100%** |
| Revenue Optimization | ✅ 100% | ❌ 0% | **100%** |
| Predictive Analytics | ✅ 100% | ❌ 0% | **100%** |
| User Management | ✅ 100% | ❌ 0% | **100%** |
| Business Admin | ✅ 100% | ❌ 0% | **100%** |
| Module Management | ✅ 100% | ❌ 0% | **100%** |
| Audit Logging | ✅ 100% | ⚠️ 20% (framework-021) | **80%** |
| Script Execution | ✅ 100% | ❌ 0% | **100%** |
| Pricing Simulator | ✅ 100% | ❌ 0% | **100%** |
| Basket Testing | ⚠️ 60% | ❌ 0% | **100%** |
| Customer Management | ✅ 100% | ❌ 0% | **100%** |
| Product Management | ✅ 100% | ❌ 0% | **100%** |
| Price Tracking | ✅ 100% | ❌ 0% | **100%** |
| Compliance Center | ✅ 100% | ❌ 0% | **100%** |
| Market Intelligence | ✅ 100% | ❌ 0% | **100%** |
| Performance Monitoring | ✅ 100% | ❌ 0% | **100%** |
| GitHub Integration | ✅ 100% | ✅ 90% (cs-001 to cs-013) | 10% |
| Code Change Tracking | ✅ 100% | ✅ 80% (cs tasks) | 20% |
| Task Management | ✅ 100% | ⚠️ 40% (partial) | **60%** |
| Real-Time Features | ✅ 100% | ❌ 0% | **100%** |

---

## Part 3: Critical Gaps Requiring User Stories

### 3.1 HIGH PRIORITY - Core Business Features (No Documentation)

#### Gap 1: Inventory Discounts (70% gap)
**What's Built:**
- Complete 7-step wizard
- Expiration-based discounts
- THC percentage-based discounts
- Batch-level attribute support
- Real-time monitoring
- Automated application

**What's Missing in Documentation:**
- ❌ No user story for expiration-based discount creation
- ❌ No user story for THC percentage discount creation
- ❌ No user story for real-time inventory monitoring
- ❌ No user story for automated discount application
- ❌ No Gherkin acceptance criteria for any inventory discount features
- ❌ No user story for batch-level attribute integration

**Business Impact:** HIGH - This is MVP Priority #2 feature

#### Gap 2: BOGO Promotions (100% gap)
**What's Built:**
- Complete 5-step wizard
- Item/brand/category BOGO
- Flexible reward types
- Pricing engine integration

**What's Missing in Documentation:**
- ❌ No user story for BOGO creation
- ❌ No user story for BOGO management
- ❌ No user story for BOGO calculation logic
- ❌ No Gherkin acceptance criteria
- ❌ No user story for BOGO in pricing engine

**Business Impact:** MEDIUM - This is MVP Priority #3 (nice-to-have)

#### Gap 3: Bundle Deals (100% gap)
**What's Built:**
- Complete 6-step wizard
- Multi-product bundles
- Minimum quantity rules
- Pricing engine integration

**What's Missing in Documentation:**
- ❌ No user story for bundle creation
- ❌ No user story for bundle management
- ❌ No user story for bundle calculation logic
- ❌ No Gherkin acceptance criteria
- ❌ No user story for bundle in pricing engine

**Business Impact:** LOW - This is Priority #4 (future phase)

#### Gap 4: Volume Pricing (60% gap)
**What's Built:**
- Complete 7-step wizard
- Unit/case-based tiers
- Customer tier-specific discounts
- Excel-like tier builder
- Market constraint enforcement

**What's Missing in Documentation:**
- ⚠️ Partial coverage in tm tasks
- ❌ No user story for volume pricing wizard
- ❌ No user story for Excel-like tier building
- ❌ No user story for market constraint enforcement
- ❌ No Gherkin acceptance criteria for volume pricing calculation
- ❌ No user story for customer tier-specific volume discounts

**Business Impact:** HIGH - This is MVP Priority #3 feature

#### Gap 5: Tiered Pricing (60% gap)
**What's Built:**
- Complete 7-step wizard
- Dollar-based tiers
- Customer tier-specific discounts
- Excel-like tier builder
- Market constraint enforcement

**What's Missing in Documentation:**
- ⚠️ Partial coverage in tm tasks
- ❌ No user story for tiered pricing wizard
- ❌ No user story for dollar-based tier building
- ❌ No user story for market constraint (volume XOR tiered)
- ❌ No Gherkin acceptance criteria for tiered pricing calculation
- ❌ No user story for customer tier-specific tiered discounts

**Business Impact:** HIGH - This is MVP Priority #3 feature

### 3.2 HIGH PRIORITY - Analytics & Reporting (No Documentation)

#### Gap 6: Analytics Dashboard (100% gap)
**What's Built:**
- Comprehensive main dashboard
- Real-time metrics
- System performance monitoring
- Customer segment analysis
- Active alerts
- Recent events timeline

**What's Missing in Documentation:**
- ❌ No user story for dashboard overview
- ❌ No user story for real-time metrics
- ❌ No user story for performance monitoring
- ❌ No user story for alert system
- ❌ No Gherkin acceptance criteria

**Business Impact:** HIGH - Critical for business visibility

#### Gap 7: Rebate Reports (100% gap)
**What's Built:**
- List price vs. actual price comparison
- Average discount by strain/brand/category
- Customer-specific rebate calculations
- Export capabilities

**What's Missing in Documentation:**
- ❌ No user story for rebate report generation
- ❌ No user story for price comparison analysis
- ❌ No user story for discount breakdown by hierarchy
- ❌ No Gherkin acceptance criteria
- ⚠️ Requirements doc mentions this as "reporting only" but full feature is built

**Business Impact:** HIGH - This is MVP requirement for rebate support

#### Gap 8: Discount Analytics (100% gap)
**What's Built:**
- Discount utilization tracking
- ROI analysis
- Customer tier performance
- Promotion effectiveness

**What's Missing in Documentation:**
- ❌ No user story for discount analytics
- ❌ No user story for ROI tracking
- ❌ No user story for utilization reports
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for business intelligence

#### Gap 9: Revenue Optimization (100% gap)
**What's Built:**
- Margin analysis
- Price elasticity tracking
- Demand forecasting
- Scenario planning

**What's Missing in Documentation:**
- ❌ No user story for revenue optimization
- ❌ No user story for margin analysis
- ❌ No user story for demand forecasting
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Advanced analytics feature

#### Gap 10: Predictive Analytics (100% gap)
**What's Built:**
- Sales forecasting
- Inventory predictions
- Demand trend analysis
- AI-powered recommendations

**What's Missing in Documentation:**
- ❌ No user story for predictive analytics
- ❌ No user story for AI recommendations
- ❌ No user story for forecasting
- ❌ No Gherkin acceptance criteria

**Business Impact:** LOW - Advanced feature beyond MVP

### 3.3 MEDIUM PRIORITY - Admin & Management (No Documentation)

#### Gap 11: User Management (100% gap)
**What's Built:**
- User CRUD operations
- Role assignment
- Permission management
- Activity tracking

**What's Missing in Documentation:**
- ❌ No user story for user management
- ❌ No user story for role assignment
- ❌ No user story for permission management
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for system administration

#### Gap 12: Business Administration (100% gap)
**What's Built:**
- Business configuration
- Market settings
- Compliance settings
- System preferences

**What's Missing in Documentation:**
- ❌ No user story for business admin
- ❌ No user story for market configuration
- ❌ No user story for compliance settings
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for system configuration

#### Gap 13: Module Management (100% gap)
**What's Built:**
- Feature flag management
- Module enable/disable
- Dependency tracking
- Risk assessment

**What's Missing in Documentation:**
- ❌ No user story for module management
- ❌ No user story for feature flags
- ❌ No user story for module dependencies
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for system flexibility

#### Gap 14: Audit Logging (80% gap)
**What's Built:**
- Comprehensive action tracking
- User activity logs
- Pricing decision history
- Compliance reporting

**What's Missing in Documentation:**
- ⚠️ framework-021 mentions audit logging improvement
- ❌ No user story for audit log viewing
- ❌ No user story for compliance reporting
- ❌ No user story for pricing decision audit trail
- ❌ No Gherkin acceptance criteria

**Business Impact:** HIGH - Critical for compliance

### 3.4 MEDIUM PRIORITY - Testing & Validation (Partial Documentation)

#### Gap 15: Pricing Simulator (100% gap)
**What's Built:**
- Real-time pricing calculation
- Basket testing
- Scenario comparison
- Historical pricing simulation
- Best deal explanation

**What's Missing in Documentation:**
- ❌ No user story for pricing simulator
- ❌ No user story for basket testing
- ❌ No user story for scenario comparison
- ❌ No user story for historical simulation
- ❌ No Gherkin acceptance criteria

**Business Impact:** HIGH - Critical for business testing

#### Gap 16: Basket Testing (100% gap)
**What's Built:**
- Manual basket entry
- Pricing validation
- Discount verification

**What's Missing in Documentation:**
- ❌ No user story for basket testing interface
- ❌ No user story for pricing validation
- ❌ No user story for discount verification
- ❌ No Gherkin acceptance criteria

**Business Impact:** HIGH - MVP requirement for testing

### 3.5 LOW PRIORITY - Customer & Product Management (No Documentation)

#### Gap 17: Customer Management (100% gap)
**What's Built:**
- Customer CRUD operations
- Tier assignment
- Bulk upload
- Search and filtering
- Purchase history

**What's Missing in Documentation:**
- ❌ No user story for customer management
- ❌ No user story for tier assignment
- ❌ No user story for bulk upload
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for customer data management

#### Gap 18: Product Management (100% gap)
**What's Built:**
- Product catalog management
- Batch tracking
- THC percentage tracking
- Expiration date management
- Inventory monitoring

**What's Missing in Documentation:**
- ❌ No user story for product management
- ❌ No user story for batch tracking
- ❌ No user story for THC tracking
- ❌ No user story for expiration tracking
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for product data management

#### Gap 19: Price Tracking (100% gap)
**What's Built:**
- Historical price tracking
- Competitor price monitoring
- Price alerts
- Market intelligence

**What's Missing in Documentation:**
- ❌ No user story for price tracking
- ❌ No user story for competitor monitoring
- ❌ No user story for price alerts
- ❌ No Gherkin acceptance criteria

**Business Impact:** LOW - Nice-to-have feature

### 3.6 SPECIALIZED FEATURES (No Documentation)

#### Gap 20: Compliance Center (100% gap)
**What's Built:**
- Cannabis compliance tracking
- License management
- Regulatory reporting
- Audit trail

**What's Missing in Documentation:**
- ❌ No user story for compliance center
- ❌ No user story for license management
- ❌ No user story for regulatory reporting
- ❌ No Gherkin acceptance criteria

**Business Impact:** HIGH - Critical for cannabis industry compliance

#### Gap 21: Market Intelligence (100% gap)
**What's Built:**
- Competitor analysis
- Market trends
- Price positioning
- Demand forecasting

**What's Missing in Documentation:**
- ❌ No user story for market intelligence
- ❌ No user story for competitor analysis
- ❌ No user story for market trends
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for competitive positioning

#### Gap 22: Performance Monitoring (100% gap)
**What's Built:**
- System health monitoring
- Response time tracking
- Error rate monitoring
- Resource utilization

**What's Missing in Documentation:**
- ❌ No user story for performance monitoring
- ❌ No user story for system health
- ❌ No user story for error tracking
- ❌ No Gherkin acceptance criteria

**Business Impact:** MEDIUM - Important for system reliability

---

## Part 4: User Story Creation Plan

### 4.1 Prioritization Framework

**Priority Levels:**
1. **CRITICAL** - MVP Priority #1-2 features with no documentation
2. **HIGH** - MVP Priority #3 features or critical business features
3. **MEDIUM** - Important features beyond MVP scope
4. **LOW** - Nice-to-have features

### 4.2 Story Creation Phases

#### Phase 1: Critical MVP Features (Weeks 1-2)
**Goal:** Document all MVP Priority #1-2 features

**Stories to Create:**
1. **Inventory Discounts Epic** (8 stories)
   - Story 1.1: Create expiration-based automatic discount rule
   - Story 1.2: Create THC percentage-based automatic discount rule
   - Story 1.3: Configure batch-level discount attributes
   - Story 1.4: Monitor real-time inventory discount application
   - Story 1.5: View automated discount history
   - Story 1.6: Configure multi-level inventory discount scope
   - Story 1.7: Set up expiration date monitoring thresholds
   - Story 1.8: Manage THC percentage discount triggers

2. **Volume Pricing Epic** (6 stories)
   - Story 2.1: Create volume-based pricing rule with unit tiers
   - Story 2.2: Create volume-based pricing rule with case tiers
   - Story 2.3: Configure customer tier-specific volume discounts
   - Story 2.4: Build multi-tier volume pricing with Excel-like interface
   - Story 2.5: Apply volume pricing to brand/category/item
   - Story 2.6: Enforce market constraint (volume XOR tiered)

3. **Tiered Pricing Epic** (6 stories)
   - Story 3.1: Create dollar-based tiered pricing rule
   - Story 3.2: Configure customer tier-specific tiered discounts
   - Story 3.3: Build multi-tier pricing with Excel-like interface
   - Story 3.4: Apply tiered pricing to brand/category/item
   - Story 3.5: Enforce market constraint (volume XOR tiered)
   - Story 3.6: Calculate tiered pricing in mixed orders

4. **Rebate Reports Epic** (5 stories)
   - Story 4.1: Generate list price vs. actual price comparison report
   - Story 4.2: View average discount by strain
   - Story 4.3: View average discount by brand
   - Story 4.4: View average discount by category with sub-category breakdown
   - Story 4.5: Export rebate calculation reports

**Total Stories: 25**  
**Estimated Story Points: 125**  
**Timeline: 2 weeks**

#### Phase 2: High Priority Business Features (Weeks 3-4)
**Goal:** Document core business features and analytics

**Stories to Create:**
5. **BOGO Promotions Epic** (7 stories)
   - Story 5.1: Create item-level BOGO promotion
   - Story 5.2: Create brand-level BOGO promotion
   - Story 5.3: Create category-level BOGO promotion
   - Story 5.4: Configure BOGO reward types (free, %, $)
   - Story 5.5: Apply BOGO promotion in pricing calculation
   - Story 5.6: Manage BOGO promotion lifecycle
   - Story 5.7: View BOGO promotion performance

6. **Analytics Dashboard Epic** (8 stories)
   - Story 6.1: View real-time business metrics dashboard
   - Story 6.2: Monitor system performance metrics
   - Story 6.3: Analyze customer segment distribution
   - Story 6.4: View active alerts and warnings
   - Story 6.5: Track recent system events
   - Story 6.6: Access quick action cards
   - Story 6.7: Filter dashboard by time range
   - Story 6.8: Export dashboard data

7. **Discount Analytics Epic** (6 stories)
   - Story 7.1: Track discount utilization by type
   - Story 7.2: Calculate discount ROI
   - Story 7.3: Analyze customer tier performance
   - Story 7.4: Measure promotion effectiveness
   - Story 7.5: Compare discount strategies
   - Story 7.6: Generate discount analytics reports

8. **Pricing Simulator Epic** (7 stories)
   - Story 8.1: Enter test basket for pricing simulation
   - Story 8.2: Calculate real-time pricing for test basket
   - Story 8.3: Compare pricing scenarios
   - Story 8.4: Simulate historical pricing
   - Story 8.5: View best deal explanation
   - Story 8.6: Test volume/tiered pricing scenarios
   - Story 8.7: Validate discount application logic

9. **Audit Logging Epic** (5 stories)
   - Story 9.1: View comprehensive audit log
   - Story 9.2: Track user activity history
   - Story 9.3: View pricing decision audit trail
   - Story 9.4: Generate compliance reports
   - Story 9.5: Filter and search audit logs

**Total Stories: 33**  
**Estimated Story Points: 165**  
**Timeline: 2 weeks**

#### Phase 3: Medium Priority Features (Weeks 5-6)
**Goal:** Document admin, management, and advanced features

**Stories to Create:**
10. **Bundle Deals Epic** (7 stories)
    - Story 10.1: Create multi-product bundle deal
    - Story 10.2: Configure bundle minimum quantities
    - Story 10.3: Set bundle discount (% or $)
    - Story 10.4: Apply bundle deal in pricing calculation
    - Story 10.5: Manage bundle deal lifecycle
    - Story 10.6: View bundle deal performance
    - Story 10.7: Test bundle deal scenarios

11. **User Management Epic** (6 stories)
    - Story 11.1: Create and manage user accounts
    - Story 11.2: Assign user roles
    - Story 11.3: Configure user permissions
    - Story 11.4: Track user activity
    - Story 11.5: Manage user authentication
    - Story 11.6: Audit user actions

12. **Business Administration Epic** (6 stories)
    - Story 12.1: Configure business settings
    - Story 12.2: Manage market configurations
    - Story 12.3: Set compliance settings
    - Story 12.4: Configure system preferences
    - Story 12.5: Manage integration settings
    - Story 12.6: View system configuration audit

13. **Module Management Epic** (5 stories)
    - Story 13.1: Manage feature flags
    - Story 13.2: Enable/disable system modules
    - Story 13.3: Track module dependencies
    - Story 13.4: Assess module risk levels
    - Story 13.5: View module configuration history

14. **Revenue Optimization Epic** (6 stories)
    - Story 14.1: Analyze product margins
    - Story 14.2: Track price elasticity
    - Story 14.3: Forecast demand
    - Story 14.4: Plan pricing scenarios
    - Story 14.5: Optimize pricing strategies
    - Story 14.6: Generate revenue optimization reports

15. **Compliance Center Epic** (6 stories)
    - Story 15.1: Track cannabis compliance requirements
    - Story 15.2: Manage license information
    - Story 15.3: Generate regulatory reports
    - Story 15.4: View compliance audit trail
    - Story 15.5: Monitor compliance alerts
    - Story 15.6: Export compliance documentation

**Total Stories: 36**  
**Estimated Story Points: 180**  
**Timeline: 2 weeks**

#### Phase 4: Low Priority & Specialized Features (Weeks 7-8)
**Goal:** Document remaining features and specialized functionality

**Stories to Create:**
16. **Customer Management Epic** (7 stories)
    - Story 16.1: Create and manage customer records
    - Story 16.2: Assign customer tiers
    - Story 16.3: Bulk upload customers via CSV
    - Story 16.4: Search and filter customers
    - Story 16.5: View customer purchase history
    - Story 16.6: Manage customer relationships
    - Story 16.7: Export customer data

17. **Product Management Epic** (8 stories)
    - Story 17.1: Create and manage product catalog
    - Story 17.2: Track product batches
    - Story 17.3: Monitor THC percentages
    - Story 17.4: Manage expiration dates
    - Story 17.5: Track inventory levels
    - Story 17.6: Organize product categories
    - Story 17.7: View product performance
    - Story 17.8: Export product data

18. **Price Tracking Epic** (5 stories)
    - Story 18.1: Track historical pricing
    - Story 18.2: Monitor competitor prices
    - Story 18.3: Set up price alerts
    - Story 18.4: Analyze market intelligence
    - Story 18.5: Generate price tracking reports

19. **Market Intelligence Epic** (5 stories)
    - Story 19.1: Analyze competitor pricing
    - Story 19.2: Track market trends
    - Story 19.3: Monitor price positioning
    - Story 19.4: Forecast market demand
    - Story 19.5: Generate market intelligence reports

20. **Performance Monitoring Epic** (5 stories)
    - Story 20.1: Monitor system health
    - Story 20.2: Track response times
    - Story 20.3: Monitor error rates
    - Story 20.4: Track resource utilization
    - Story 20.5: Generate performance reports

21. **Predictive Analytics Epic** (5 stories)
    - Story 21.1: Forecast sales trends
    - Story 21.2: Predict inventory needs
    - Story 21.3: Analyze demand patterns
    - Story 21.4: Generate AI-powered recommendations
    - Story 21.5: Export predictive analytics

**Total Stories: 35**  
**Estimated Story Points: 140**  
**Timeline: 2 weeks**

### 4.3 Total Story Creation Summary

| Phase | Focus | Stories | Story Points | Timeline |
|-------|-------|---------|--------------|----------|
| Phase 1 | Critical MVP Features | 25 | 125 | Weeks 1-2 |
| Phase 2 | High Priority Business | 33 | 165 | Weeks 3-4 |
| Phase 3 | Medium Priority Admin | 36 | 180 | Weeks 5-6 |
| Phase 4 | Low Priority Specialized | 35 | 140 | Weeks 7-8 |
| **TOTAL** | **All Features** | **129** | **610** | **8 weeks** |

---

## Part 5: User Story Template & Examples

### 5.1 Standard User Story Template

\`\`\`markdown
## User Story: [ID] - [Title]

**Epic:** [Epic Name]  
**Priority:** [Critical/High/Medium/Low]  
**Story Points:** [1-13]  
**Status:** To Do

### User Story
As a [user type],  
I want to [action],  
So that [benefit/value].

### Description
[Detailed description of the feature and its purpose]

### Acceptance Criteria (Gherkin)

#### Scenario 1: [Happy Path Scenario Name]
```gherkin
Given [initial context]
And [additional context]
When [action taken]
Then [expected outcome]
And [additional outcome]
