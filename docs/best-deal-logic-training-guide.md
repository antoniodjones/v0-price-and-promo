# Best Deal Logic Engine - Complete Training Guide

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [System Architecture](#system-architecture)
4. [Configuration Guide](#configuration-guide)
5. [User Interface Guide](#user-interface-guide)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)

## Overview

The GTI Best Deal Logic Engine is a sophisticated pricing system designed for wholesale cannabis operations. It implements a **no-stacking policy** that ensures customers always receive the single best discount available for each product, providing maximum savings while maintaining pricing transparency.

### Key Features
- **Transparent Pricing**: Clear breakdown of all applied discounts
- **No-Stacking Policy**: Only one discount applies per item for maximum benefit
- **Priority-Based Resolution**: Automatic conflict resolution using priority levels
- **Real-Time Calculation**: Instant pricing updates with discount validation
- **Complete Audit Trail**: Full tracking of all pricing decisions
- **Multi-Level Discounts**: Customer, inventory, promotion, and bundle discounts

## Core Concepts

### 1. No-Stacking Policy
The engine applies only **one discount per item**, automatically selecting the discount that provides the highest savings to the customer.

**Example:**
- Product: Blue Dream 1oz ($240 base price)
- Available discounts:
  - Customer Discount: 8% ($19.20 savings)
  - Expiration Discount: 20% ($48.00 savings) ← **Applied**
  - THC Discount: 10% ($24.00 savings)
- **Final Price: $192.00** (20% expiration discount applied)

### 2. Priority System
When discounts provide equal savings, the system uses priority levels:

1. **Priority 1 (Highest)**: Expiration-based discounts
2. **Priority 2**: THC-based discounts  
3. **Priority 3**: Customer-specific discounts
4. **Priority 4 (Lowest)**: Volume discounts

### 3. Discount Types

#### Customer Discounts
- **Tier-based**: A, B, C customer tiers with different rates
- **Level-based**: Item, brand, category, or subcategory targeting
- **Market-specific**: Different rates per geographic market

#### Inventory Discounts
- **Expiration-based**: Automatic discounts for products nearing expiration
- **THC-based**: Discounts for low-THC products
- **Scope-based**: Apply to all products, specific categories, or brands

#### Promotions
- **BOGO Campaigns**: Buy-one-get-one offers with flexible rewards
- **Bundle Deals**: Multi-product packages with combined discounts

## System Architecture

### Core Components

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Best Deal Logic Engine                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Pricing         │  │ Discount        │  │ Conflict     │ │
│  │ Calculator      │  │ Validator       │  │ Resolver     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Customer        │  │ Inventory       │  │ Promotion    │ │
│  │ Discounts       │  │ Discounts       │  │ Engine       │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Database        │  │ API Layer       │  │ Audit        │ │
│  │ Layer           │  │                 │  │ Trail        │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Configuration Guide

### 1. Customer Discount Setup

#### Step 1: Navigate to Customer Discounts
1. Go to **Customer Discounts** in the sidebar
2. Click **"Create Customer Discount"**

#### Step 2: Configure Discount Level
Choose the appropriate level:
- **Item Level**: Specific product discounts
- **Brand Level**: All products from a specific brand
- **Category Level**: All products in a category
- **Subcategory Level**: Products in a subcategory

#### Step 3: Set Discount Parameters
\`\`\`
Discount Name: "Premium Cannabis - Dispensary ABC 8%"
Discount Type: Percentage
Discount Value: 8%
Target: Premium Cannabis (brand)
Customer Tiers: A, B
Markets: California, Nevada
Start Date: 2024-01-01
End Date: 2024-12-31
\`\`\`

#### Step 4: Review and Create
- Verify all settings
- Check for conflicts with existing discounts
- Activate the discount

### 2. Inventory Discount Setup

#### Expiration-Based Discounts
\`\`\`
Discount Name: "30-Day Expiration Auto Discount"
Trigger Type: Expiration
Trigger Value: 30 (days)
Discount Type: Percentage
Discount Value: 20%
Scope: All Products
Status: Active
\`\`\`

#### THC-Based Discounts
\`\`\`
Discount Name: "Low THC Flower Discount"
Trigger Type: THC
Trigger Value: 15 (percentage threshold)
Discount Type: Percentage
Discount Value: 10%
Scope: Category
Scope Value: Flower
Status: Active
\`\`\`

### 3. BOGO Promotion Setup

#### Step 1: Campaign Type
- Choose level: Item, Brand, or Category
- Set campaign name and description

#### Step 2: Trigger Configuration
\`\`\`
Trigger Level: Brand
Trigger Target: Premium Cannabis
Trigger Quantity: 2 (buy 2)
\`\`\`

#### Step 3: Reward Setup
\`\`\`
Reward Type: Free
Reward Target: Same as trigger
Reward Quantity: 1 (get 1 free)
Max Rewards Per Order: 3
\`\`\`

#### Step 4: Schedule
- Set start and end dates
- Configure usage limits

### 4. Bundle Deal Setup

#### Bundle Types
1. **Fixed Bundle**: Specific products bundled together
2. **Category Bundle**: Mix and match from categories
3. **Tiered Pricing**: Volume-based pricing tiers

#### Configuration Example
\`\`\`
Bundle Name: "Starter Pack"
Bundle Type: Fixed
Products: [Blue Dream 1oz, Vape Pen, Edibles Pack]
Discount Type: Percentage
Discount Value: 15%
Min Quantity: 1 (complete bundle)
\`\`\`

## User Interface Guide

### 1. Pricing Calculator

#### Accessing the Calculator
1. Navigate to **Best Deal Logic** → **Pricing Calculator**
2. The calculator loads automatically with product data

#### Using the Calculator
1. **Product Selection**: Products load automatically from inventory
2. **Customer Selection**: Choose customer from dropdown
3. **Quantity Input**: Enter desired quantities
4. **Real-Time Calculation**: Prices update automatically
5. **Discount Breakdown**: View applied discounts in detail

#### Understanding the Results
\`\`\`
Product: Blue Dream 1oz
Base Price: $240.00
Applied Discount: 30-Day Expiration (20%)
Discount Amount: -$48.00
Final Price: $192.00
Savings: $48.00 (20%)
\`\`\`

### 2. Conflict Resolution

#### Accessing Conflict Resolution
1. Navigate to **Best Deal Logic** → **Conflict Resolution**
2. Enter customer ID, product ID, and market
3. Click **"Validate Discounts"**

#### Resolving Conflicts
1. **Review Conflicts**: System shows all applicable discounts
2. **Best Deal Recommendation**: Highlighted discount provides maximum savings
3. **Manual Override**: Select different discount if needed
4. **Apply Resolution**: Confirm the selected discount

#### Conflict Resolution Interface
\`\`\`
┌─────────────────────────────────────────────────────────┐
│ Product: Wedding Cake 1oz ($250.00)                    │
├─────────────────────────────────────────────────────────┤
│ Available Discounts:                                    │
│ ✓ A-Tier Customer 6% - $15.00 savings [RECOMMENDED]    │
│   Volume Discount 5% - $12.50 savings                  │
├─────────────────────────────────────────────────────────┤
│ Final Price: $235.00                                    │
│ [Accept Recommendation] [Apply Best Deal]               │
└─────────────────────────────────────────────────────────┘
\`\`\`

### 3. Audit Trail

#### Viewing Audit Logs
1. Navigate to **Best Deal Logic** → **Audit Trail**
2. Filter by date range, customer, or product
3. Export reports for compliance

#### Audit Information Includes
- Timestamp of pricing calculation
- Customer and product details
- All evaluated discounts
- Applied discount and reasoning
- Final pricing breakdown
- User who initiated the calculation

## Best Practices

### 1. Discount Configuration

#### Naming Conventions
- Use descriptive names: "Premium Cannabis - Dispensary ABC 8%"
- Include discount value in name for clarity
- Specify target in name when applicable

#### Priority Management
- Set expiration discounts to Priority 1 (highest)
- Use Priority 2 for THC-based discounts
- Customer discounts should be Priority 3
- Volume discounts get Priority 4 (lowest)

#### Date Management
- Always set end dates for temporary discounts
- Use future start dates for scheduled promotions
- Review and update expiring discounts regularly

### 2. Testing and Validation

#### Before Going Live
1. **Test All Scenarios**: Verify discounts apply correctly
2. **Check Conflicts**: Ensure best deal logic works properly
3. **Validate Calculations**: Confirm math is accurate
4. **Review Audit Trail**: Ensure proper logging

#### Regular Maintenance
- Weekly review of active discounts
- Monthly analysis of discount performance
- Quarterly cleanup of expired rules
- Annual review of priority settings

### 3. Performance Optimization

#### Database Considerations
- Index frequently queried fields (customer_id, product_id, market)
- Archive old audit records regularly
- Monitor query performance on discount validation

#### Caching Strategy
- Cache customer tier information
- Cache active discount rules
- Invalidate cache when discounts change

## Troubleshooting

### Common Issues

#### 1. Discounts Not Applying
**Symptoms**: Expected discount not showing in calculator
**Causes**:
- Discount is inactive or expired
- Customer tier not included in discount
- Market not included in discount scope
- Product doesn't match discount target

**Resolution**:
1. Check discount status and dates
2. Verify customer tier and market settings
3. Confirm product matches discount criteria
4. Use Conflict Resolution tool to debug

#### 2. Wrong Discount Applied
**Symptoms**: Lower-value discount applied instead of higher-value
**Causes**:
- Priority settings incorrect
- Discount calculation error
- Cache not updated

**Resolution**:
1. Review priority settings for all applicable discounts
2. Clear cache and recalculate
3. Check discount value calculations
4. Verify best deal logic implementation

#### 3. Performance Issues
**Symptoms**: Slow pricing calculations
**Causes**:
- Too many active discounts
- Inefficient database queries
- Cache misses

**Resolution**:
1. Optimize database indexes
2. Implement query caching
3. Archive old discount rules
4. Monitor API response times

### Error Messages

#### "No applicable discounts found"
- Customer tier not eligible
- Product not in discount scope
- All discounts expired or inactive

#### "Discount validation failed"
- Invalid customer ID or product ID
- Market parameter missing
- Database connection issue

#### "Conflict resolution required"
- Multiple discounts with equal savings
- Manual intervention needed
- Priority settings unclear

## API Reference

### Pricing Calculation

#### Endpoint
\`\`\`
POST /api/pricing/calculate
\`\`\`

#### Request Body
\`\`\`json
{
  "customerId": "customer-1",
  "items": [
    {
      "productId": "product-1",
      "quantity": 2
    }
  ],
  "market": "california"
}
\`\`\`

#### Response
\`\`\`json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "product-1",
        "quantity": 2,
        "basePrice": 480.00,
        "discountedPrice": 384.00,
        "appliedDiscounts": [
          {
            "type": "expiration",
            "name": "30-Day Expiration Auto Discount",
            "value": 96.00
          }
        ]
      }
    ],
    "subtotal": 480.00,
    "totalDiscount": 96.00,
    "finalTotal": 384.00
  }
}
\`\`\`

### Discount Validation

#### Endpoint
\`\`\`
POST /api/discounts/validate
\`\`\`

#### Request Body
\`\`\`json
{
  "customerId": "customer-1",
  "productId": "product-1",
  "market": "california"
}
\`\`\`

#### Response
\`\`\`json
{
  "success": true,
  "data": {
    "product": {
      "id": "product-1",
      "name": "Blue Dream 1oz",
      "basePrice": 240.00
    },
    "customer": {
      "id": "customer-1",
      "tier": "A",
      "market": "california"
    },
    "applicableDiscounts": [
      {
        "id": "discount-1",
        "name": "30-Day Expiration Auto Discount",
        "type": "expiration",
        "value": 20,
        "priority": 1
      }
    ],
    "bestDiscount": {
      "id": "discount-1",
      "name": "30-Day Expiration Auto Discount"
    },
    "originalPrice": 240.00,
    "discountAmount": 48.00,
    "finalPrice": 192.00,
    "savings": 48.00,
    "savingsPercentage": 20.0
  }
}
\`\`\`

### Error Handling

#### Common Error Responses
\`\`\`json
{
  "success": false,
  "error": "Customer not found",
  "message": "The specified customer ID does not exist"
}
\`\`\`

\`\`\`json
{
  "success": false,
  "error": "Validation failed",
  "message": "Customer ID, Product ID, and Market are required"
}
\`\`\`

---

## Getting Started Checklist

### Initial Setup
- [ ] Configure customer tiers (A, B, C)
- [ ] Set up market definitions
- [ ] Create initial customer discounts
- [ ] Configure inventory discount rules
- [ ] Test pricing calculations
- [ ] Verify audit trail logging

### Daily Operations
- [ ] Monitor discount performance
- [ ] Review conflict resolutions
- [ ] Check for expired discounts
- [ ] Update pricing as needed

### Weekly Maintenance
- [ ] Analyze discount usage reports
- [ ] Update expiring promotions
- [ ] Review customer feedback
- [ ] Optimize slow queries

### Monthly Review
- [ ] Audit discount effectiveness
- [ ] Clean up expired rules
- [ ] Update customer tiers
- [ ] Performance optimization

---

*This training guide covers the complete Best Deal Logic Engine system. For additional support or advanced configuration, contact the GTI technical team.*
