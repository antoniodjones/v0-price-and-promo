# Design Decisions - GTI Promotions Engine

## Color System

### Primary Brand Colors
- **Dark Green**: `#0f2922` - Primary buttons, navigation elements
- **Medium Green**: `#1a4d3a` - Button hover states, secondary elements
- **Bright Green**: `#4ade80` - Headers, accent text ("Pricing & Promotions")
- **Light Green**: `#86efac` - Subtle accents, success states

### Typography Hierarchy
- **Main Header**: "Pricing & Promotions" in bright green (`text-emerald-400`)
- **Page Titles**: Black text for main content titles
- **Descriptions**: Muted foreground for subtitle text

### Button Standards
- **Primary Buttons**: Dark green background (`bg-gti-dark-green`) with medium green hover
- **All buttons must maintain dark green theme** - no light green buttons
- Focus states include proper ring styling for accessibility

### Layout Patterns
- Consistent page header structure: Bright green "Pricing & Promotions" followed by black page title
- Sidebar retains "Promotions Engine" branding
- Use flexbox for most layouts, CSS Grid only for complex 2D layouts

## Component Standards

### Headers
\`\`\`tsx
<h1 className="text-2xl font-bold text-emerald-400 mb-2">Pricing & Promotions</h1>
<h2 className="text-3xl font-bold text-foreground mb-2">[Page Title]</h2>
<p className="text-muted-foreground">[Description]</p>
\`\`\`

### Buttons
- Default variant uses `bg-gti-dark-green` with `hover:bg-gti-medium-green`
- Never use light green for buttons unless explicitly requested
- Maintain consistent sizing: default (h-9), sm (h-8), lg (h-10)

## Accessibility
- All colors meet WCAG contrast requirements
- Focus states clearly visible with ring styling
- Proper semantic HTML structure maintained

## Clean Code Principles

This codebase follows Clean Code principles alongside Clean Architecture, Domain Driven Design, and Atomic Design to ensure maintainability, readability, and scalability.

### No Hardcoding Principle
- **Dynamic Discovery**: Components should discover data dynamically, not use hardcoded lists
- **Configuration Over Code**: Use configuration files or database queries instead of hardcoded arrays
- **Example Violations to Fix**:
  - ❌ ScriptRunner component has hardcoded script list - should read from `/api/admin/scripts` endpoint
  - ✅ Dynamic script discovery from file system or database
- **Benefits**: Easier maintenance, automatic updates when new items added, follows Open/Closed Principle

### Naming Conventions
- **Meaningful Names**: Use intention-revealing names that explain purpose without comments
  - ✅ `calculateTierDiscount()` not `calc()` or `getTD()`
  - ✅ `customerTierLevel` not `ctl` or `level`
- **Searchable Names**: Avoid single-letter variables except in short loops
- **Class Names**: Nouns or noun phrases (`PricingEngine`, `DiscountCalculator`)
- **Function Names**: Verbs or verb phrases (`validatePromotion`, `applyDiscount`)
- **Boolean Names**: Use `is`, `has`, `can` prefixes (`isActive`, `hasDiscount`, `canApply`)

### Function Design
- **Single Responsibility**: Each function does one thing well
- **Small Functions**: Aim for 5-20 lines; extract complex logic into named functions
- **Few Arguments**: Prefer 0-2 arguments; use objects for 3+ parameters
- **No Side Effects**: Pure functions when possible; clearly indicate mutations
- **Command Query Separation**: Functions either do something OR return something, not both

### Code Organization
- **DRY Principle**: Don't Repeat Yourself - extract common logic
- **Separation of Concerns**: Business logic separate from UI, data access separate from business rules
- **Dependency Direction**: Dependencies point inward (UI → Business Logic → Data)
- **Error Handling**: Use try-catch blocks; fail fast with meaningful error messages
- **Null Safety**: Always check for null/undefined before calling methods like `toLowerCase()`

### Comments and Documentation
- **Code Should Self-Document**: Write clear code that explains itself
- **Comments Explain Why, Not What**: Use comments for business rules, not obvious code
- **TODO Comments**: Include ticket numbers and assignee when possible
- **JSDoc for Public APIs**: Document function parameters, return types, and examples

### Testing Philosophy
- **Test Behavior, Not Implementation**: Focus on what code does, not how
- **Arrange-Act-Assert Pattern**: Clear test structure
- **One Assertion Per Test**: Keep tests focused and easy to debug
- **Meaningful Test Names**: `should_calculate_tier_discount_when_customer_qualifies`

### Refactoring Guidelines
- **Boy Scout Rule**: Leave code cleaner than you found it
- **Incremental Improvements**: Small, safe refactorings over big rewrites
- **Extract Method**: Break down complex functions into smaller, named pieces
- **Replace Magic Numbers**: Use named constants (`MAX_DISCOUNT_PERCENT = 50`)
- **Simplify Conditionals**: Extract complex conditions into well-named functions

### Code Smells to Avoid
- ❌ Long functions (>50 lines)
- ❌ Large classes (>300 lines)
- ❌ Long parameter lists (>3 parameters)
- ❌ Duplicate code
- ❌ Dead code (commented out or unused)
- ❌ Magic numbers and strings
- ❌ Nested conditionals (>3 levels deep)
- ❌ God objects (classes that do too much)

### TypeScript Best Practices
- **Strict Type Safety**: Enable strict mode, avoid `any`
- **Interface Over Type**: Use interfaces for object shapes
- **Discriminated Unions**: For complex state management
- **Type Guards**: Create custom type guards for runtime safety
- **Immutability**: Prefer `const` and readonly properties

### Performance Considerations
- **Premature Optimization**: Avoid until proven necessary
- **Measure First**: Use profiling before optimizing
- **Memoization**: Cache expensive calculations when appropriate
- **Lazy Loading**: Load components and data only when needed
- **Database Queries**: Minimize N+1 queries, use proper indexing

### Example: Before and After Clean Code

**Before:**
\`\`\`typescript
function calc(p: any, c: any) {
  if (c.t == 'gold' && p.amt > 100) {
    return p.amt * 0.9
  } else if (c.t == 'silver') {
    return p.amt * 0.95
  }
  return p.amt
}
\`\`\`

**After:**
\`\`\`typescript
interface Product {
  amount: number
}

interface Customer {
  tierLevel: 'gold' | 'silver' | 'bronze'
}

const GOLD_DISCOUNT_RATE = 0.10
const SILVER_DISCOUNT_RATE = 0.05
const GOLD_MINIMUM_PURCHASE = 100

function calculateTierDiscount(product: Product, customer: Customer): number {
  if (isGoldTierWithMinimumPurchase(product, customer)) {
    return applyDiscount(product.amount, GOLD_DISCOUNT_RATE)
  }
  
  if (customer.tierLevel === 'silver') {
    return applyDiscount(product.amount, SILVER_DISCOUNT_RATE)
  }
  
  return product.amount
}

function isGoldTierWithMinimumPurchase(product: Product, customer: Customer): boolean {
  return customer.tierLevel === 'gold' && product.amount > GOLD_MINIMUM_PURCHASE
}

function applyDiscount(amount: number, discountRate: number): number {
  return amount * (1 - discountRate)
}
\`\`\`

### Integration with Other Principles

**Clean Code + Clean Architecture:**
- Clean Code focuses on implementation details (how we write code)
- Clean Architecture focuses on system structure (how we organize code)
- Together they create maintainable, testable, scalable systems

**Clean Code + Domain Driven Design:**
- Use ubiquitous language in code (match business terminology)
- Domain entities should have clean, intention-revealing methods
- Business rules should be explicit and easy to understand

**Clean Code + Atomic Design:**
- Components should follow Single Responsibility Principle
- Atoms should be simple, focused, reusable
- Molecules should compose atoms with clear purpose
- Organisms should orchestrate without becoming god components
