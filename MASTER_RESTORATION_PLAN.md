# GTI Pricing Engine - Master Restoration Plan

## Executive Summary
This document consolidates all analysis and planning for the systematic restoration of the GTI Pricing Engine enterprise application. The application contains 438+ files with complex interdependencies that caused runtime failures. This plan uses Domain Driven Design, Clean Architecture, and Atomic Design principles to ensure safe, systematic restoration.

## Root Node Plans

### 📋 [Tier Management Build Plan](./tier_management_build.md)
Comprehensive 8-week plan for implementing a sophisticated tier management system with A/B/C tier assignments per discount rule, enhanced pricing calculation engine, and management UI components.

**Key Features:**
- Per-rule tier assignments (customers can be in different tiers for different rules)
- Three-tier system (A/B/C) with configurable discount values
- Enhanced wizard UI for tier configuration and customer assignment
- Tier-based pricing calculation engine
- Audit trail and management dashboards

**Status:** Planning Phase - Ready for Phase 1 implementation

## Critical Findings Summary

### Application Scale & Complexity
- **438 total files** across the entire project
- **90+ pages and routes** (admin, analytics, auth, pricing, etc.)
- **150+ React components** with complex interdependencies
- **60+ API routes** with database operations
- **50+ SQL scripts** for database setup
- **65+ instances of `toLowerCase()` calls** causing runtime errors
- **Complex authentication system** with Supabase integration
- **Advanced state management** with custom stores and contexts
- **Real-time features** with WebSocket connections
- **Multiple wizard-based workflows** for complex business logic

### Primary Risk Factors
1. **Runtime Errors**: 65+ `toLowerCase()` calls without null checks
2. **Complex Dependencies**: Circular imports and tightly coupled components
3. **Authentication Dependencies**: Many components require auth context
4. **State Management**: Complex global state causing cascading failures
5. **API Dependencies**: Components crash when API calls fail
6. **Real-time Features**: WebSocket connections causing instability

## Architecture Principles

### Domain Driven Design (DDD)
- **Core Domain**: Pricing Engine & Discount Management
- **Supporting Domains**: Authentication, Analytics, Inventory
- **Generic Domains**: UI Components, Utilities, Settings

### Clean Architecture Layers
1. **Entities**: Business logic (pricing rules, discount calculations)
2. **Use Cases**: Application services (create discount, calculate price)
3. **Interface Adapters**: Controllers, presenters, gateways
4. **Frameworks & Drivers**: React components, Supabase, APIs

### Atomic Design System
1. **Atoms**: Basic UI elements (Button, Input, Card)
2. **Molecules**: Simple component combinations (SearchBox, UserMenu)
3. **Organisms**: Complex UI sections (Header, Sidebar, DataTable)
4. **Templates**: Page layouts without content
5. **Pages**: Complete interfaces with real content

## Master Restoration Plan

### Phase 0: Foundation & Module System (CRITICAL - Build First)

#### Step 0.1: Error Prevention Infrastructure
- [ ] Create comprehensive error boundary system
- [ ] Add global error handling for unhandled promises
- [ ] Implement logging system for debugging
- [ ] Create fallback UI components for failed renders

#### Step 0.2: Modular Settings System (NEW ARCHITECTURE)
- [ ] **Module Registry**: Define all application modules with dependencies
  \`\`\`typescript
  interface ModuleConfig {
    id: string
    name: string
    enabled: boolean
    dependencies: string[]
    riskLevel: 'low' | 'medium' | 'high'
    domain: 'core' | 'pricing' | 'analytics' | 'admin'
    components: string[]
    routes: string[]
  }
  \`\`\`
- [ ] **Feature Flag System**: Runtime module enable/disable
- [ ] **Dynamic Component Loading**: Lazy load based on module status
- [ ] **Admin Interface**: Super user dashboard for module management
- [ ] **Dependency Validation**: Prevent enabling modules without dependencies

#### Step 0.3: Core Utilities (Atoms Layer)
- [ ] Fix all `toLowerCase()` calls: `(value || "").toLowerCase()`
- [ ] Create safe utility functions with null checks
- [ ] Implement `cn()` function for className management
- [ ] Add comprehensive TypeScript types for all domains

### Phase 1: Atomic Design - Atoms & Molecules (LOW RISK)

#### Step 1.1: Basic UI Atoms
- [ ] **Button Component**: Simple, no complex state
- [ ] **Input Component**: Basic form inputs with validation
- [ ] **Card Component**: Container with consistent styling
- [ ] **Badge Component**: Status indicators
- [ ] **Loading Component**: Spinner and skeleton states

#### Step 1.2: Form Molecules  
- [ ] **SearchBox**: Input + search icon
- [ ] **FormField**: Label + Input + Error message
- [ ] **ActionButtons**: Save/Cancel button groups
- [ ] **StatusIndicator**: Badge + text combinations

#### Step 1.3: Data Display Molecules
- [ ] **DataCell**: Table cell with formatting
- [ ] **MetricCard**: Number + label + trend
- [ ] **AlertMessage**: Icon + message + actions

### Phase 2: Layout & Navigation (Organisms Layer)

#### Step 2.1: Layout Organisms
- [ ] **AppLayout**: Main container with CSS Grid
  - Static layout, no dynamic calculations
  - Error boundary around each section
  - Module-aware rendering
- [ ] **Header**: Logo + navigation + user menu placeholder
  - No authentication dependencies initially
  - Static content only
- [ ] **Sidebar**: Navigation menu
  - Static navigation array
  - Module-aware menu items
  - No active state logic initially

#### Step 2.2: Navigation System
- [ ] **Route Configuration**: Module-based routing
- [ ] **Navigation Guards**: Basic route protection
- [ ] **Breadcrumb System**: Simple path display

### Phase 3: Authentication Domain (MEDIUM RISK)

#### Step 3.1: Authentication Infrastructure
- [ ] **Supabase Client**: Singleton with error handling
- [ ] **Auth Context**: Simple user state management
  - User object or null only
  - No complex auth flows initially
  - Comprehensive error boundaries

#### Step 3.2: Authentication Components
- [ ] **LoginForm**: Email/password only
- [ ] **UserMenu**: Profile dropdown with logout
- [ ] **ProtectedRoute**: Route guard component
- [ ] **AuthProvider**: Context provider with error handling

#### Step 3.3: Authentication Integration
- [ ] **Module Integration**: Auth-aware module loading
- [ ] **API Integration**: Authenticated API calls
- [ ] **Error Handling**: Graceful auth failure handling

### Phase 4: Core Business Domain - Pricing Engine (HIGH RISK)

#### Step 4.1: Pricing Entities & Use Cases
- [ ] **Product Entity**: Core product data structure
- [ ] **Price Calculator**: Pure functions for pricing logic
- [ ] **Pricing Rules Engine**: Business rule evaluation
- [ ] **Price History**: Audit trail functionality

#### Step 4.2: Pricing Components (Organisms)
- [ ] **ProductList**: Display products with basic filtering
  - Fix all `toLowerCase()` calls
  - Add comprehensive null checks
  - Static data initially, then API integration
- [ ] **PricingCalculator**: Interactive pricing tool
  - Extract business logic to pure functions
  - Add input validation and error handling
  - Progressive enhancement approach
- [ ] **PriceHistory**: Audit trail display
  - Read-only initially
  - Add filtering later

#### Step 4.3: Pricing API Integration
- [ ] **Product API**: CRUD operations with error handling
- [ ] **Pricing API**: Calculation endpoints
- [ ] **History API**: Audit trail endpoints

### Phase 5: Supporting Domains - Discounts & Promotions (HIGH RISK)

#### Step 5.1: Customer Discounts
- [ ] **Customer Discount Entity**: Data structure
- [ ] **Discount Calculator**: Business logic functions
- [ ] **Customer Assignment**: User-discount relationships
- [ ] **Discount List**: Display with safe filtering
- [ ] **Discount Wizard**: Simplified single-page form initially

#### Step 5.2: Inventory Discounts
- [ ] **Inventory Rules Engine**: Automated discount logic
- [ ] **Inventory Monitor**: Stock level tracking
- [ ] **Discount Application**: Automatic price adjustments
- [ ] **Inventory Dashboard**: Status display

#### Step 5.3: Promotions System
- [ ] **BOGO Promotions**: Buy-one-get-one logic
- [ ] **Bundle Deals**: Product bundling system
- [ ] **Promotion Wizard**: Multi-step workflow (simplified initially)
- [ ] **Promotion Calendar**: Schedule management

### Phase 6: Analytics Domain (HIGH RISK)

#### Step 6.1: Analytics Infrastructure
- [ ] **Data Collection**: Event tracking system
- [ ] **Metrics Calculation**: Business intelligence functions
- [ ] **Report Generation**: PDF/Excel export capabilities
- [ ] **Data Visualization**: Chart components

#### Step 6.2: Analytics Components
- [ ] **Dashboard Overview**: Key metrics display
- [ ] **Sales Analytics**: Revenue and performance metrics
- [ ] **Customer Analytics**: Customer behavior insights
- [ ] **Pricing Analytics**: Price optimization insights

#### Step 6.3: Reporting System
- [ ] **Report Builder**: Custom report creation
- [ ] **Scheduled Reports**: Automated report generation
- [ ] **Report History**: Archive and retrieval

### Phase 7: Admin Domain (HIGHEST RISK)

#### Step 7.1: System Administration
- [ ] **User Management**: Admin user controls
- [ ] **System Settings**: Global configuration
- [ ] **Module Management**: Feature flag controls
- [ ] **Audit Logging**: System activity tracking

#### Step 7.2: Business Administration
- [ ] **Tenant Management**: Multi-tenant controls
- [ ] **Business Rules**: Configurable business logic
- [ ] **Integration Management**: External system connections
- [ ] **Data Management**: Import/export capabilities

### Phase 8: Advanced Features (OPTIONAL)

#### Step 8.1: Real-time Features
- [ ] **WebSocket Integration**: Real-time updates
- [ ] **Live Notifications**: System alerts
- [ ] **Collaborative Features**: Multi-user interactions
- [ ] **Real-time Analytics**: Live dashboard updates

#### Step 8.2: Testing & Quality Assurance
- [ ] **Scenario Testing**: Business workflow testing
- [ ] **Performance Testing**: Load and stress testing
- [ ] **Integration Testing**: End-to-end workflows
- [ ] **User Acceptance Testing**: Business validation

## Refactoring Standards

### Universal Refactoring Principles
For EVERY component restored:

1. **Null Safety**: Add `?.` and `|| ""` everywhere
2. **Error Boundaries**: Wrap each component individually  
3. **Loading States**: Show loading UI instead of crashing
4. **Fallback Data**: Use mock data if API fails
5. **Pure Functions**: Extract business logic from components
6. **Simple State**: Use local state instead of complex global state
7. **Progressive Enhancement**: Start simple, add complexity gradually

### Specific Risk Mitigations

#### toLowerCase() Issues (65+ instances)
\`\`\`typescript
// Before: product.name.toLowerCase()
// After: (product?.name || "").toLowerCase()
\`\`\`

#### API Dependencies
- Mock data fallbacks for all API calls
- Comprehensive error handling
- Loading states for all async operations

#### Authentication Dependencies
- Optional auth, app works without login
- Graceful degradation for unauthenticated users
- Clear error messages for auth failures

#### Complex State Management
- Local component state instead of global stores
- Simple state machines for complex workflows
- Immutable state updates

#### Dynamic Content
- Static content first, dynamic features later
- Progressive enhancement approach
- Feature flags for advanced functionality

## Module Definitions

### Core Modules (Always Enabled)
\`\`\`typescript
const CORE_MODULES = {
  'error-handling': { riskLevel: 'low', dependencies: [] },
  'ui-atoms': { riskLevel: 'low', dependencies: ['error-handling'] },
  'layout-system': { riskLevel: 'low', dependencies: ['ui-atoms'] },
  'settings-system': { riskLevel: 'medium', dependencies: ['layout-system'] }
}
\`\`\`

### Business Modules (Configurable)
\`\`\`typescript
const BUSINESS_MODULES = {
  'authentication': { riskLevel: 'medium', dependencies: ['core-modules'] },
  'pricing-engine': { riskLevel: 'high', dependencies: ['authentication'] },
  'customer-discounts': { riskLevel: 'high', dependencies: ['pricing-engine'] },
  'inventory-discounts': { riskLevel: 'high', dependencies: ['pricing-engine'] },
  'promotions': { riskLevel: 'high', dependencies: ['customer-discounts'] },
  'analytics': { riskLevel: 'high', dependencies: ['pricing-engine'] },
  'admin-tools': { riskLevel: 'high', dependencies: ['analytics'] },
  'real-time-features': { riskLevel: 'high', dependencies: ['admin-tools'] }
}
\`\`\`

## Execution Strategy

### Safety Measures
1. **ONE component at a time** - Never restore multiple components simultaneously
2. **Immediate testing** after each addition
3. **Rollback plan** - If anything breaks, immediately revert
4. **Module isolation** - Use feature flags to control rollout
5. **Comprehensive logging** - Track all changes and issues

### Testing Protocol
1. **Component Testing**: Each component in isolation
2. **Integration Testing**: Component interactions
3. **Module Testing**: Complete module functionality
4. **System Testing**: End-to-end workflows
5. **Performance Testing**: Load and responsiveness

### Success Criteria
- [ ] No runtime errors or crashes
- [ ] All core business functionality working
- [ ] Responsive and performant UI
- [ ] Comprehensive error handling
- [ ] Modular architecture for future maintenance

## Risk Assessment

### Low Risk (Phases 0-2)
- Basic UI components
- Static layouts
- Simple navigation
- Error handling infrastructure

### Medium Risk (Phase 3)
- Authentication system
- User management
- Protected routes
- API integration

### High Risk (Phases 4-6)
- Complex business logic
- Data manipulation
- Advanced workflows
- Real-time features

### Highest Risk (Phases 7-8)
- Admin functionality
- System configuration
- Advanced integrations
- Performance optimization

## Conclusion

This master plan provides a systematic, risk-managed approach to restoring the GTI Pricing Engine. By following Domain Driven Design, Clean Architecture, and Atomic Design principles, we ensure a maintainable, scalable, and robust application architecture.

The modular approach allows for controlled rollout, easy testing, and business flexibility. Each phase builds upon the previous one, ensuring stability and reducing the risk of cascading failures.

Success depends on strict adherence to the refactoring standards, comprehensive testing at each step, and the discipline to not rush ahead without proper validation.
