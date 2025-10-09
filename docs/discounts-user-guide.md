# Discounts Management User Guide

## Table of Contents
1. [Overview](#overview)
2. [Discount Types](#discount-types)
3. [Creating Discounts](#creating-discounts)
4. [Managing Active Discounts](#managing-active-discounts)
5. [Discount Stacking](#discount-stacking)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

The Discounts system provides flexible tools to create and manage various types of discounts across your product catalog. This guide covers all discount types and how to use them effectively.

### Key Features

- **Multiple Discount Types**: Percentage, fixed amount, tiered, bundle
- **Flexible Targeting**: Product, brand, category, or customer-specific
- **Automatic Application**: Discounts apply automatically at checkout
- **Stacking Rules**: Control how discounts combine
- **Performance Tracking**: Monitor discount effectiveness
- **Scheduling**: Set start and end dates for campaigns

## Discount Types

### Percentage Discounts

Take a percentage off the regular price:
- 10% off, 20% off, 50% off, etc.
- Applied to base price before other calculations
- Most common discount type

**Best For**:
- Broad promotions
- Category-wide sales
- Customer loyalty rewards

### Fixed Amount Discounts

Take a specific dollar amount off:
- $5 off, $10 off, $25 off, etc.
- Applied after percentage discounts
- Good for high-value items

**Best For**:
- High-ticket items
- Minimum purchase promotions
- Customer acquisition

### Tiered Discounts

Increasing discounts based on quantity or spend:
- Buy 2 get 10% off, Buy 3 get 20% off
- Spend $100 get $10 off, Spend $200 get $25 off
- Encourages larger purchases

**Best For**:
- Volume sales
- Average order value increase
- Inventory movement

### Bundle Discounts

Discount when buying specific product combinations:
- Buy products A + B + C get 15% off
- Mix and match from category
- Pre-configured bundles

**Best For**:
- Cross-selling
- Product discovery
- Themed promotions

## Creating Discounts

### Creating a Percentage Discount

1. **Navigate to Discounts** → Click "Create Discount"
2. **Select Type**: Choose "Percentage Discount"
3. **Set Discount Amount**: Enter percentage (e.g., 20 for 20% off)
4. **Choose Scope**:
   - **All Products**: Site-wide discount
   - **Category**: Select categories to include
   - **Brand**: Select brands to include
   - **Specific Products**: Choose individual products
5. **Set Conditions** (optional):
   - Minimum purchase amount
   - Minimum quantity
   - Customer tiers
   - Markets/locations
6. **Schedule**:
   - Start date and time
   - End date and time (or leave blank for indefinite)
7. **Name & Description**: Internal name and customer-facing message
8. **Activate**: Turn on to make live

### Creating a Tiered Discount

1. **Select Type**: Choose "Tiered Discount"
2. **Choose Tier Basis**:
   - **Quantity**: Based on number of items
   - **Spend**: Based on total purchase amount
3. **Define Tiers**:
   \`\`\`
   Tier 1: Buy 1 = 0% off
   Tier 2: Buy 2 = 10% off
   Tier 3: Buy 3+ = 20% off
   \`\`\`
4. **Set Scope**: Products that qualify
5. **Schedule & Activate**

### Creating a Bundle Discount

1. **Select Type**: Choose "Bundle Discount"
2. **Choose Bundle Type**:
   - **Fixed Bundle**: Specific products required
   - **Category Bundle**: Any products from categories
   - **Mix & Match**: Choose X from Y products
3. **Select Products/Categories**
4. **Set Discount**: Percentage or fixed amount off bundle
5. **Set Minimum Quantity**: How many items required
6. **Schedule & Activate**

## Managing Active Discounts

### Viewing Active Discounts

1. **Navigate to Discounts**
2. **Filter by Status**:
   - Active (currently running)
   - Scheduled (future start date)
   - Expired (past end date)
   - Inactive (manually paused)
3. **Sort by**:
   - Start date
   - End date
   - Discount amount
   - Usage count

### Editing Discounts

1. **Find Discount**: Click on discount to edit
2. **Modify Settings**:
   - Change discount amount
   - Adjust scope
   - Update schedule
   - Modify conditions
3. **Save Changes**: Updates apply immediately

### Pausing Discounts

Temporarily stop a discount without deleting:

1. **Select Discount**: Find discount to pause
2. **Toggle Status**: Switch to "Inactive"
3. **Effect**: Discount stops applying immediately
4. **Resume**: Toggle back to "Active" anytime

### Discount Analytics

Track discount performance:

1. **Click Discount** → "Analytics" tab
2. **View Metrics**:
   - Total uses
   - Revenue impact
   - Average order value with discount
   - Customer acquisition from discount
   - Margin impact
3. **Export Data**: Download for further analysis

## Discount Stacking

### Stacking Rules

Control how multiple discounts combine:

**No Stacking** (Default):
- Only one discount applies per product
- System automatically selects best discount for customer
- Simplest and most common approach

**Additive Stacking**:
- Multiple discounts add together
- Example: 10% + 5% = 15% total
- Can significantly impact margins

**Multiplicative Stacking**:
- Discounts multiply
- Example: 10% then 5% = 14.5% total (not 15%)
- More conservative than additive

### Configuring Stacking

1. **Navigate to Settings** → Discount Settings
2. **Select Stacking Method**:
   - No stacking (recommended)
   - Additive stacking
   - Multiplicative stacking
3. **Set Maximum Discount**: Cap total discount percentage
4. **Define Priority**:
   - Customer-specific discounts first
   - Promotional discounts second
   - Automatic discounts last
5. **Save Configuration**

### Best Discount Selection

When stacking is disabled, system selects best discount:

1. **Calculate Each Discount**: Determine final price with each discount
2. **Compare Results**: Find lowest final price
3. **Apply Best**: Use discount that saves customer most
4. **Display**: Show which discount was applied

## Best Practices

### Discount Strategy

**Purpose-Driven Discounts**:
- Clear goal for each discount (acquisition, retention, clearance)
- Measure against goal
- Adjust based on performance
- Don't discount just to discount

**Margin Protection**:
- Set minimum margin thresholds
- Monitor discount impact on profitability
- Use tiered discounts to protect margins
- Avoid excessive stacking

**Customer Psychology**:
- Create urgency with time limits
- Use round numbers (20% vs 19%)
- Highlight savings amount
- Make discounts feel special

### Discount Timing

**Seasonal Discounts**:
- Plan major sales in advance
- Align with holidays and events
- Coordinate with inventory levels
- Communicate early to build anticipation

**Flash Sales**:
- Short duration (24-48 hours)
- Higher discount percentages
- Limited products
- Drive urgency and traffic

**Ongoing Discounts**:
- Lower percentages (5-10%)
- Loyalty rewards
- Category-specific
- Maintain consistent value

### Discount Communication

**Clear Messaging**:
- State discount clearly (20% off, not "Save!")
- Show original and sale price
- Display end date
- Explain any conditions

**Multi-Channel**:
- Email announcements
- In-store signage
- Website banners
- Social media posts
- SMS for time-sensitive offers

## Troubleshooting

### Common Issues

**Discount Not Applying**:
- Check discount is active
- Verify product is in scope
- Confirm conditions are met (minimum purchase, etc.)
- Check customer tier eligibility
- Review start/end dates

**Wrong Discount Amount**:
- Verify discount percentage/amount
- Check for stacking issues
- Review calculation method
- Ensure no conflicting discounts

**Discount Showing But Not Working**:
- Clear browser cache
- Check POS sync status
- Verify inventory availability
- Review discount configuration

**Too Many Discounts Stacking**:
- Review stacking settings
- Set maximum discount cap
- Disable stacking if needed
- Prioritize discount types

### Getting Help

**In-App Support**:
- Click the book icon (📖) for this guide
- Use discount calculator tool
- Check discount conflict checker

**Contact Support**:
- Strategy questions: Schedule consultation
- Technical issues: Use support chat
- Urgent problems: Call support hotline

---

## Quick Reference

### Discount Type Selection Guide

| Goal | Recommended Type | Example |
|------|------------------|---------|
| Clear old inventory | Percentage (high) | 40% off |
| Increase basket size | Tiered | Buy 3 get 20% off |
| Customer acquisition | Fixed amount | $10 off first order |
| Cross-sell products | Bundle | Buy A+B get 15% off |
| Reward loyalty | Percentage (moderate) | 15% off for VIPs |

### Discount Best Practices Checklist

- [ ] Clear business goal defined
- [ ] Margin impact calculated
- [ ] Start and end dates set
- [ ] Customer-facing message written
- [ ] Scope properly configured
- [ ] Stacking rules reviewed
- [ ] Performance tracking enabled
- [ ] Marketing materials prepared

---

*Last Updated: January 2025*
*Version: 1.0*
