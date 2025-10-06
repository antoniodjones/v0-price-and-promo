# GTI Harvest - Customer Requirements Master Document
# Order-to-Cash Pricing & Promotions Engine

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Status**: Approved for Implementation  
**Stakeholders**: Antonio Jones, Brian Amend, Joseph Turcotte, Gautam Vanani

---

## Executive Summary

### Vision Statement

Create a flexible, scalable pricing and promotions engine that streamlines the wholesale order-to-cash process, empowering business users to manage complex B2B pricing strategies while maintaining seamless integration across the entire customer lifecycle.

### Mission

Build a comprehensive pricing and promotions platform that seamlessly integrates across the entire order-to-cash workflow to provide real-time, rule-based pricing decisions that optimize revenue while streamlining wholesale customer transactions from quote generation through payment processing.

### Bottom Line

The Order-to-Cash Pricing & Promotions Engine will transform manual pricing processes into an automated, rule-based system that optimizes the complete wholesale customer journey from initial quote through order fulfillment and payment processing.

**Investment**: $150K-200K development | $30-40K annual operations  
**ROI**: $70K+ annual savings vs. SaaS | 90% reduction in manual pricing work

---

## Product Strategy

### Build vs. Buy Decision

After evaluating Commercetools ($150K+ annually), Talon.One ($100K+ annually), and ERP-based solutions, the recommendation is to **build a custom rule engine**.

**Why Custom Engine**:
- **Cost Efficiency**: $30-40K annually vs. $100K+ for SaaS
- **Order-to-Cash Integration**: Maintains seamless flow across quote, order, fulfillment, invoicing
- **Flexibility**: Supports unique B2B wholesale requirements (batch-aware pricing, volume tiers, compliance)
- **Scalability**: Phased rollout with future extension across entire customer transaction lifecycle

### Market Context

**Current Pain Points**:
- Manual Excel-based pricing management across multiple markets
- Inconsistent promotional application and tracking
- Limited ability to implement sophisticated pricing strategies
- Poor visibility into discount effectiveness and rebate calculations
- Time-intensive setup for new promotions and pricing tiers

**Business Opportunities**:
- Order-to-Cash Optimization: Streamlined pricing across quote, order, fulfillment, invoicing
- Wholesale Customer Experience: Faster quote turnaround and transparent pricing
- Revenue Cycle Efficiency: Reduced order processing time and improved cash flow
- Competitive Differentiation: Advanced promotional capabilities
- Operational Scale: Support for multi-market expansion
- Data-Driven Insights: Comprehensive reporting across customer transaction lifecycle

---

## Product Roadmap

### Phase 1: MVP Foundation - Customer Discounts (Weeks 1-8)

**Priority**: #1 Must Have

**Scope**: Core customer discount management with highest business priority

**Deliverables**:
- Customer discount configuration UI (brand, category, sub-category, size levels)
- Individual customer assignment to discount rules
- Start/end date management with optional end dates
- Integration with order-to-cash platform for real-time application
- Basic reporting for discount utilization

**Success Criteria**:
- Replace 100% of current manual customer discount processes
- Support all discount granularity levels specified by business
- Achieve <200ms pricing calculation response times
- Enable business users to self-configure 80% of customer discounts

**Week 8 Checkpoint: "Customer Pricing Automated"**
- ✅ Business users configure customer discounts independently
- ✅ Real-time pricing applied across quote-to-order workflow
- ✅ Manual pricing processes eliminated for 80% of scenarios

---

### Phase 2: Automated Discounts - Aged Inventory (Weeks 9-12)

**Priority**: #2 Must Have

**Scope**: Batch-level automated discounts for inventory management

**Deliverables**:
- Expiration date-based automatic discount rules (higher priority)
- THC percentage-based automatic discount rules (secondary)
- Batch-level integration with inventory management
- Real-time monitoring and discount application
- Automated discount reporting and analytics

**Success Criteria**:
- Automate 100% of aged inventory pricing decisions
- Reduce manual intervention in inventory liquidation by 90%
- Provide real-time visibility into automated discount applications

**Week 12 Checkpoint: "Inventory Intelligence Active"**
- ✅ Automatic discounting prevents inventory write-offs
- ✅ Batch-level monitoring operational across all markets
- ✅ 90% reduction in manual inventory liquidation decisions

---

### Phase 3: Market Pricing Strategy (Weeks 13-16)

**Priority**: MVP Scope

**Scope**: Volume or tiered pricing selection per market

**Deliverables**:
- Volume-based pricing configuration (units/cases)
- Dollar-based tiered pricing configuration
- Market selection interface (volume XOR tiered pricing)
- Customer group management (High value vs. Standard)
- Advanced tier building UI with Excel-like functionality

**Success Criteria**:
- Enable market-specific pricing strategies
- Support complex tier structures as specified in business examples
- Maintain performance with complex multi-tier calculations

**Week 16 Checkpoint: "Market Strategy Enabled"**
- ✅ Volume or tiered pricing strategies deployed per market
- ✅ Complex multi-tier calculations perform within SLA (<200ms)
- ✅ Advanced customer segmentation capabilities operational

---

### Phase 4: BOGO and Enhanced Features (Weeks 17-24)

**Priority**: #3 Nice to Have

**Scope**: Nice-to-have promotional features and system optimization

**Deliverables**:
- BOGO promotional campaigns (item, brand, category levels)
- Basket testing tool for pricing validation
- Historical pricing simulation capabilities
- Enhanced customer group management
- Performance optimization and scale testing

**Success Criteria**:
- Support BOGO campaigns across all specified levels
- Enable business testing of pricing scenarios
- Prepare system for future bundle deals and advanced promotions

**Week 24 Checkpoint: "Advanced Promotions Live"**
- ✅ BOGO campaigns supported across product hierarchy
- ✅ Business testing tools enable pricing scenario analysis
- ✅ Platform ready for future bundle deals and loyalty programs

---

### Phase 5: Future Enhancements (Post-MVP)

**Priority**: #4 Not in MVP Scope

**Scope**: Advanced features for future phases

**Planned Features**:
- Bundle Deals (4-5 item bundles maximum)
- Rebate Management System (separate project)
- Advanced Customer Tier Management
- Predictive Pricing Analytics
- A/B Testing Framework

---

## Detailed Product Requirements

### Epic 1: Customer Discount Management (MVP Priority #1)

**Business Requirement**: Customer reduced pricing off base/list price

**Supported Levels**:
- Brand Level
- Category Level
  - Sub-category (e.g., Gummies, Chocolates)
  - Size (e.g., 500mg, 1g, 2g)

**Discount Types**:
- Dollar amount off
- Percentage off

**Customer Assignment**:
- Individual customer selection
- Future: Customer groups/tiers (A/B/C)

**Date Management**:
- Start date (required)
- End date (optional - blank for no planned end)

**UI Workflow**:
\`\`\`
Step 1: Choose level of customer discount
  A. Brand Level
  B. Category Level (with sub-category/size options)

Step 2: Choose Item/Brand/Category based on step 1

Step 3: Set discount amount
  - Choose dollars vs. percentage
  - Enter discount value

Step 4: Set start and end date (end date optional)

Step 5: Assign customers to discount (list/picker)

Step 6: Create discount name
\`\`\`

**Business Rules**:
- No stacking allowed for price or promos
- Customer tiers setup per rule (customer can be A tier in some rules but not others)
- Per-rule customer assignment (not global tier management)

---

### Epic 2: Automated Aged Inventory Discounts (MVP Priority #2)

**Business Requirement**: Automatic discounts based on product attributes

**Primary Focus**: Within X days of expiration date (higher priority than THC%)

**Secondary Focus**: THC% below threshold

**Critical Requirement**: Rules tied to batch level (THC & expiration are batch attributes)

**Supported Levels**:
- Global Rule
- Item Level
- Brand Level
- Category Level
  - Sub-category
  - Size

**UI Workflow**:
\`\`\`
Step 1: Choose discount trigger
  - Expiration Date
  - THC Percentage

Step 2: Choose rule level
  A. Global Rule
  B. Item Level
  C. Brand Level
  D. Category Level (with sub-category/size options)

Step 3: Choose Item/Brand/Category based on step 2

Step 4: Set rule trigger
  - Expiration: Days prior to expiration to trigger discount
  - THC%: Percentage threshold below which discount triggers

Step 5: Set discount amount (dollars vs. percentage)

Step 6: Set start and end date

Step 7: Create discount rule name
\`\`\`

**Batch-Level Processing**:
- Integration with inventory management for batch tracking
- Real-time monitoring of expiration dates and THC percentages
- Automatic application of discounts when conditions are met

---

### Epic 3: BOGO Promotions (Priority #3 - Nice to Have)

**Business Requirement**: Buy one, get one free or at reduced price

**Supported Levels**:
- Item Level (traditional item BOGO)
- Brand Level (brand BOGO)
- Category Level
  - Sub-category
  - Size

**Types**:
- Traditional item BOGO
- Brand BOGO
- Category BOGO

**UI Workflow**:
\`\`\`
Step 1: Choose type of BOGO
  A. Item Level
  B. Brand Level
  C. Category Level (with sub-category/size options)

Step 2: Choose Item/Brand/Category based on step 1

Step 3: Set promo amount
  - Choose dollars vs. percentage
  - Enter discount value

Step 4: Set start and end date

Step 5: Create promo name
\`\`\`

---

### Epic 4: Volume & Tiered Pricing (Market Choice)

**Business Constraint**: Markets must choose EITHER volume OR tiered pricing, not both for MVP

**Volume Discounts**: Based on quantity (units or cases)

**Tiered Pricing**: Based on dollar amounts spent

**Customer Groups**: High value vs. Standard customers

**Supported Levels**:
- Total order
- By brand
- By category
  - Sub-category
  - Size

**UI Workflow**:
\`\`\`
Step 1: Choose tiered pricing by volume (cases/units) vs. dollar total

Step 2: Choose discount rule level
  A. Global Rule
  B. Item Level
  C. Brand Level
  D. Category Level (with sub-category/size options)

Step 3: Choose Item/Brand/Category based on step 2

Step 4: Build tiers with Excel-type table or UI with add rows
  - Each row: volume/qty for tier (e.g., >50 units)
  - Each row: discount amount (e.g., 5%)

Step 5: Set start and end date

Step 6: Assign customers (list/picker)

Step 7: Create tiered pricing name
\`\`\`

**Example Volume Discount Configuration**:

Customer Tiers: A, B, C tier customers with different discount percentages

Unit-Based Tiers:
- Tier 1: 49-75 units (A: 4%, B: 3%, C: 2%)
- Tier 2: 76-99 units (A: 5%, B: 4%, C: 3%)
- Tier 3: 100+ units (A: 6%, B: 5%, C: 4%)

Brand-Specific Volume (Incredibles example):
- Tier 1: 20-49 cases (A: 5%, B: 4%, C: 3%)
- Tier 2: 50+ cases (A: 9%, B: 8%, C: 7%)

---

### Epic 5: Bundle Deals (Priority #4 - Not in MVP Scope)

**Business Requirement**: Buy X & Y and get % or $ off

**Scope**: Maximum 4-5 bundles reasonable for future

**Supported Levels**:
- Item Level
- Strain Level
- Brand Level
- Category Level
  - Sub-category
  - Size

**Status**: Moved to Phase 5 (post-MVP)

---

### Epic 6: Rebates (Separate Future Project)

**Business Requirement**: Rebate tool is a future need but would be a separate project

**MVP Scope**: Reporting only

**Required Reports**:
By customers show list price vs. actual price with average discount by:
- Strain
- Brand
- Category
  - Sub-category
  - Size

**Status**: Separate future project, need reporting only for MVP

---

## Core Business Rules

### Rule #1: No Stacking Policy (Critical)

**Policy**: No discount stacking allowed for price or promos

**Implementation**:
- Only ONE discount can be applied per item
- System automatically applies the BEST available discount
- Clear indication of which discount was applied and why
- Comprehensive audit trail for discount decisions

**Exception**: Special promotions may be configured to allow stacking (requires explicit configuration)

---

### Rule #2: Per-Rule Customer Tier Assignment

**Policy**: Customer tiers need to be setup for each rule

**Implementation**:
- Customers can be assigned to different tiers for different rules
- Example: Customer can be "A tier" in some rules but not others
- Per-rule customer management (not global tier assignment)
- Future enhancement: Customer groups A/B/C for easier management

---

### Rule #3: Market Choice Constraint (MVP)

**Policy**: Each market selects EITHER volume-based OR tiered pricing (not both)

**Implementation**:
- Market selection interface for pricing strategy
- Enforcement of either/or constraint
- Validation in rule creation
- Clear market configuration settings

---

### Rule #4: Batch-Level Processing (Critical)

**Policy**: Rules tied to batch level for THC & expiration attributes

**Implementation**:
- Integration with inventory management for batch tracking
- Real-time monitoring of batch attributes
- Automatic application of discounts when conditions are met
- Batch-specific pricing in quotes and orders

---

### Rule #5: Date-Based Activation

**Policy**: All pricing rules support start/end dates

**Implementation**:
- Start date (required)
- End date (optional - blank for no planned end)
- Automatic activation/deactivation based on dates
- Historical pricing tracking

---

## Integration Requirements

### System Integrations

**Order-to-Cash Platform**:
- Real-time pricing application across quote generation, order processing, fulfillment
- Seamless integration with billing systems for accurate invoice generation

**Quote Management**:
- Dynamic pricing for wholesale customer quotes
- Approval workflows for special pricing

**Order Processing**:
- Automated pricing validation during order entry and modification
- Real-time discount application

**Fulfillment Systems**:
- Final pricing confirmation before shipment and invoicing

**Invoicing & Billing**:
- Integration with billing systems for accurate invoice generation
- Discount tracking for financial reporting

**D365 ERP**:
- Base price management (no duplicate UI needed)
- Product catalog synchronization

**Inventory Management**:
- Batch-level data for automated discounts
- Real-time inventory tracking

**Accounting Systems**:
- Integration with Sage for financial reporting
- Rebate calculation support

---

### Data Requirements

**Product Data**:
- Real-time access to product catalog
- Batch information
- THC levels
- Expiration dates

**Customer Data**:
- Customer segmentation
- Individual assignments to discount rules
- Customer tier information

**Inventory Data**:
- Stock levels
- Batch details
- Expiration tracking
- THC percentage data

**Market Data**:
- Market-specific pricing rule selections (volume vs. tiered)
- Market configuration settings

---

## Reporting & Analytics

### MVP Reporting Requirements

**Rebate Support Reporting**:
List price vs. actual price with average discount by:
- Strain
- Brand
- Category (with sub-category and size breakdowns)

**Customer Discount Analytics**:
- Discount utilization by customer and rule type
- Customer tier performance analysis

**Aged Inventory Impact**:
- Reporting on automatic discount effectiveness
- Inventory liquidation metrics

---

### Advanced Analytics (Future Phase)

**Order-to-Cash Cycle Optimization**:
- Analysis of pricing impact on complete transaction cycles

**Wholesale Customer Lifetime Value**:
- Comprehensive customer profitability analysis

**Quote Conversion Intelligence**:
- Pricing strategies that optimize quote-to-order conversion

---

## UI/UX Requirements

### Pricing/Promo Type Selection

**Tile-Based Interface**:
- Visual selection of promo/price types
- Intuitive navigation

**Wizard Screens**:
- Step-by-step entry for each pricing/promo type
- Progress indicators
- Validation at each step

**Review Interface**:
- List view of existing promos/pricing rules
- Filter and search capabilities
- Bulk operations

---

### Advanced Features (Nice to Have)

**Basket Testing Tool**:
- Enter test basket and run price/promo calculation
- Validate pricing rules before deployment

**Historical Testing**:
- Test pricing with specific dates (past and future scenarios)
- Compare pricing across different time periods

**Drag and Drop Configuration**:
- Table-based rule building with intuitive interfaces
- Excel-like tier building
- Add/remove rows dynamically

---

## Success Metrics & KPIs

### Business Impact Metrics

**Customer Discount Management**:
- 100% replacement of manual processes
- 80% of pricing tasks completed without IT support

**Aged Inventory Optimization**:
- 90% reduction in manual liquidation decisions
- Automated discounting prevents inventory write-offs

**Pricing Accuracy**:
- 99.9% accuracy with full audit trail for compliance

**User Efficiency**:
- 80% of pricing tasks completed without IT support
- <2 hours training time for pricing managers

---

### Technical Performance Metrics

**Batch Processing**:
- Real-time monitoring of inventory attributes

**Response Time**:
- <200ms for all pricing calculations, including batch lookups

**Rule Complexity**:
- Support for multi-level tier structures without performance degradation

**Integration**:
- Seamless data flow between D365, inventory, and order systems

---

### User Experience Metrics

**Wizard Completion**:
- >95% success rate for discount rule creation

**Business User Adoption**:
- 100% adoption within 6 months

**Training Time**:
- <2 hours for pricing manager onboarding

**Error Rate**:
- <0.1% user-generated configuration errors

---

## Risk Assessment & Mitigation

### Technical Risks - LOW

**Risk**: Batch-level data integration complexity

**Mitigation**: Early integration with inventory systems and comprehensive batch data modeling

**Risk**: Real-time pricing calculation performance with complex rules

**Mitigation**: Implement caching strategy and optimize database queries for batch lookups

---

### Business Risks - MEDIUM

**Risk**: Market choice paralysis (volume vs. tiered pricing)

**Mitigation**: Provide precise business case analysis and pilot testing capabilities

**Risk**: Customer assignment complexity per rule

**Mitigation**: Phased approach with individual assignment first, customer groups in Phase 4

---

### Operational Risks - LOW

**Risk**: Automated discount rule conflicts

**Mitigation**: Built-in conflict detection and business rule validation

**Risk**: Business user adoption of complex tier building

**Mitigation**: Intuitive Excel-like interface with guided wizards

---

## Resource Requirements

### Core Team

- 1 Product Manager (full engagement)
- 1 Technical Lead + 2-3 Developers (backend/frontend)
- 1 QA Engineer (testing and validation)
- 0.5 DevOps Engineer (infrastructure)

### Business Support

- 1 Business Analyst (requirements and UAT)
- Pricing Managers (subject matter expertise and testing)
- Sales Team (user acceptance and feedback)

### Budget Summary

- **Development**: $150K-200K (one-time)
- **Annual Operations**: $30-40K (infrastructure + tools)
- **Training & Change Management**: $15-25K (one-time)

---

## Next Steps & Action Items

### Immediate Actions (Next 2 weeks)

1. ✅ Business Alignment: Present updated MVP scope to stakeholders for final approval
2. 🔨 Technical Architecture: Design batch-level data integration architecture
3. 🔨 UI Mockups: Create wizard interface mockups based on business-specified steps
4. 🔨 Market Strategy: Determine initial pilot markets for volume vs. tiered pricing

### Short-term Actions (Next 4 weeks)

1. 🔨 Customer Discount MVP: Begin development of highest priority features
2. 🔨 D365 Integration: Establish base pricing integration (no duplicate UI needed)
3. 🔨 Batch Data Integration: Implement inventory system integration for expiration/THC data
4. 🔨 Testing Strategy: Develop automated testing for complex discount scenarios

### Medium-term Actions (Next 12 weeks)

1. 🔨 MVP Deployment: Launch customer discount management in pilot markets
2. 🔨 Automated Discounts: Deploy aged inventory automation features
3. 🔨 Market Pricing: Implement volume or tiered pricing based on market feedback
4. 🔨 Performance Optimization: Scale testing with real-world data volumes

---

## Appendix: Key Changes from Version 1.0

### MVP Scope Refinement

- Prioritized Customer Discounts as #1 must-have feature with detailed UI specifications
- Added Automated Aged Inventory Discounts as #2 priority with batch-level requirements
- Simplified Volume/Tiered Pricing to market choice (not both) for MVP
- Removed Bundle Deals from MVP scope (Priority #4)
- Clarified BOGO as nice-to-have (Priority #3)

### Business Rule Updates

- No Stacking Policy explicitly defined for MVP
- Per-Rule Customer Assignment instead of global tier management
- Batch-Level Criticality emphasized for inventory-based discounts
- Market Selection Constraint added for volume vs. tiered pricing

### UI/UX Specifications

- Step-by-step Wizard Flows defined for each pricing type based on business input
- Tile-Based Selection for pricing/promo type selection
- Excel-like Tier Building for complex volume/tiered pricing configuration
- Basket Testing Tool identified as valuable enhancement

---

**Document Status**: ✅ Approved for Implementation  
**Next Review Date**: End of Phase 1 (Week 8)  
**Document Owner**: Product Engineering Team  
**Stakeholder Approval**: Antonio Jones, Brian Amend, Joseph Turcotte, Gautam Vanani
