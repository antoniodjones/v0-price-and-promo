# Tier Management Build Plan

## Planning Mode: Sophisticated Tier Management System

Based on comprehensive analysis of the codebase and requirements, this document outlines the complete plan to build a sophisticated tier management system.

---

## Current State Assessment

### What EXISTS:

- Basic customer tier field in database (`customers.tier`)
- Simple tier filtering in UI (premium/standard/basic)
- `customer_discounts` table with `customer_tiers` TEXT[] field
- `customer_discount_assignments` junction table (but not fully utilized)
- Customer assignment UI that assigns customers to discount rules

### What's MISSING:

- **Per-rule tier assignment** - Customers can't be in different tiers (A/B/C) for different discount rules
- **Tier configuration within discount rules** - No way to define A/B/C tier discount values within a single rule
- **Tier-based discount calculation** - Pricing engine doesn't evaluate customer's tier for each rule
- **Tier management UI** - No interface to assign customers to tiers per rule

---

## Implementation Plan

### Phase 1: Database Schema Enhancement

#### New Tables Needed:

\`\`\`sql
-- 1. Discount rules with tier support
CREATE TABLE discount_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL, -- 'customer_discount', 'volume_pricing', 'tiered_pricing'
    level TEXT NOT NULL, -- 'brand', 'category', 'subcategory', 'product'
    target_id TEXT, -- brand_id, category_id, product_id
    target_name TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tier definitions for each rule
CREATE TABLE discount_rule_tiers (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('A', 'B', 'C')),
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(rule_id, tier)
);

-- 3. Customer assignments to tiers per rule
CREATE TABLE customer_tier_assignments (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL REFERENCES discount_rules(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('A', 'B', 'C')),
    assigned_date DATE DEFAULT NOW(),
    assigned_by TEXT,
    UNIQUE(rule_id, customer_id) -- Customer can only be in one tier per rule
);
\`\`\`

---

### Phase 2: Core API Endpoints

#### 1. Discount Rules API (`/api/discount-rules`)

- `POST /api/discount-rules` - Create rule with tier configuration
- `GET /api/discount-rules` - List all rules
- `GET /api/discount-rules/[id]` - Get rule details with tiers
- `PUT /api/discount-rules/[id]` - Update rule
- `DELETE /api/discount-rules/[id]` - Delete rule

#### 2. Tier Assignment API (`/api/discount-rules/[id]/assignments`)

- `POST /api/discount-rules/[id]/assignments` - Assign customers to tiers
- `GET /api/discount-rules/[id]/assignments` - Get all assignments for a rule
- `PUT /api/discount-rules/[id]/assignments/[customerId]` - Update customer tier
- `DELETE /api/discount-rules/[id]/assignments/[customerId]` - Remove assignment

#### 3. Customer Tier Lookup API (`/api/customers/[id]/tiers`)

- `GET /api/customers/[id]/tiers` - Get all tier assignments for a customer
- Returns: `[{ ruleId, ruleName, tier, discountValue }]`

---

### Phase 3: Enhanced Wizard UI

#### New Wizard Flow:

**Step 1: Rule Configuration**
- Rule name
- Rule type (customer discount, volume pricing, etc.)
- Product level (brand, category, subcategory, product)
- Target selection

**Step 2: Tier Configuration** ⭐ NEW
- Define A-Tier discount (e.g., 8%)
- Define B-Tier discount (e.g., 5%)
- Define C-Tier discount (e.g., 3%)
- Option to enable/disable specific tiers

**Step 3: Customer Assignment to Tiers** ⭐ ENHANCED
- Three sections: A-Tier, B-Tier, C-Tier
- Search and assign customers to each tier
- Visual indication of tier assignments
- Bulk assignment tools

**Step 4: Dates & Review**
- Start/end dates
- Review all configurations
- Create rule

---

### Phase 4: Pricing Calculation Engine

#### Enhanced Pricing Logic:

\`\`\`typescript
async function calculateCustomerPrice(customerId, productId, quantity) {
  // 1. Find all applicable discount rules for this product
  const applicableRules = await findApplicableRules(productId);
  
  // 2. For each rule, check customer's tier assignment
  const customerDiscounts = [];
  
  for (const rule of applicableRules) {
    const tierAssignment = await getCustomerTierAssignment(customerId, rule.id);
    
    if (tierAssignment) {
      // Customer is assigned to this rule
      const tierDiscount = await getTierDiscount(rule.id, tierAssignment.tier);
      
      customerDiscounts.push({
        ruleId: rule.id,
        ruleName: rule.name,
        tier: tierAssignment.tier,
        discountType: tierDiscount.discount_type,
        discountValue: tierDiscount.discount_value,
        priority: getTierPriority(tierAssignment.tier) // A=3, B=2, C=1
      });
    }
  }
  
  // 3. Apply best discount (no stacking)
  const bestDiscount = findBestDiscount(customerDiscounts);
  
  return {
    basePrice,
    appliedDiscount: bestDiscount,
    finalPrice: calculateFinalPrice(basePrice, bestDiscount)
  };
}
\`\`\`

---

### Phase 5: Management UI Components

#### 1. Tier Assignment Matrix (New Component)

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ Rule: "Flower Volume Pricing"                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ A-Tier (8% discount)          [12 customers assigned]  │
│ ├─ Dispensary ABC                            [Remove]  │
│ ├─ Elite Cannabis Co                         [Remove]  │
│ └─ [+ Add customers]                                    │
│                                                         │
│ B-Tier (5% discount)          [8 customers assigned]   │
│ ├─ Standard Dispensary                       [Remove]  │
│ └─ [+ Add customers]                                    │
│                                                         │
│ C-Tier (3% discount)          [5 customers assigned]   │
│ └─ [+ Add customers]                                    │
└─────────────────────────────────────────────────────────┘
\`\`\`

#### 2. Customer Tier Dashboard (New Page)

Shows all tier assignments for a specific customer across all rules

#### 3. Bulk Tier Assignment Tool (New Feature)

- Upload CSV with customer-tier mappings
- Bulk assign multiple customers to tiers at once

---

## Implementation Timeline

### Week 1-2: Database & Core APIs
- Create new database tables
- Build discount rules API
- Build tier assignment API
- Migration scripts

### Week 3-4: Wizard UI Enhancement
- Add tier configuration step
- Enhance customer assignment step with tier sections
- Build tier assignment matrix component

### Week 5-6: Pricing Engine Integration
- Update pricing calculation logic
- Implement tier-based discount evaluation
- Add audit logging

### Week 7-8: Testing & Management Tools
- Build customer tier dashboard
- Add bulk assignment tools
- Comprehensive testing
- Documentation

---

## Key Design Decisions

1. **Three-Tier System (A/B/C)** - Matches business requirements exactly
2. **Per-Rule Assignment** - Same customer can be different tiers for different rules
3. **No Global Tiers** - Eliminates the current global `customers.tier` field in favor of per-rule assignments
4. **Best Deal Logic** - When multiple rules apply, highest discount wins (no stacking)
5. **Audit Trail** - Track who assigned customers to tiers and when

---

## Success Metrics

- Pricing managers can create rules with 3 tiers in < 5 minutes
- Customers can be assigned to different tiers across 10+ rules
- Pricing calculation evaluates tier assignments in < 200ms
- 100% audit trail for all tier assignments
- Business users can manage tiers without developer support

---

## Next Steps

Start with Phase 1 (Database Schema) and Phase 2 (Core APIs) first, then build the UI on top of that foundation. This ensures the data model is solid before investing in UI development.
