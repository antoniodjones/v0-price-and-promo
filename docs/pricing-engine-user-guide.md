# Pricing Engine User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Base Pricing](#base-pricing)
4. [Market-Specific Pricing](#market-specific-pricing)
5. [Dynamic Pricing Rules](#dynamic-pricing-rules)
6. [Price Testing](#price-testing)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The Pricing Engine is the core system that calculates final prices for all products across all channels and markets. It combines base prices, market adjustments, promotions, and dynamic rules to deliver optimal pricing in real-time.

### Key Features

- **Base Price Management**: Set foundation prices for all products
- **Market Pricing**: Adjust prices by location or sales channel
- **Dynamic Rules**: Automated pricing based on inventory, competition, time
- **Promotion Integration**: Seamlessly applies discounts and offers
- **Price Testing**: A/B test different pricing strategies
- **Analytics**: Track pricing performance and elasticity

## Getting Started

### Accessing the Pricing Engine

1. **Navigate to Pricing Engine**: Click "Pricing Engine" in the left sidebar
2. **Dashboard View**: See pricing overview with:
   - Total products with pricing
   - Active pricing rules
   - Average margin
   - Recent price changes

### Understanding Price Calculation

The final price is calculated in this order:

1. **Base Price**: Starting price for the product
2. **Market Adjustment**: Location or channel-specific adjustment
3. **Dynamic Rules**: Automated adjustments (inventory, time, competition)
4. **Promotions**: Customer-specific or general discounts
5. **Final Price**: Price shown to customer

**Example**:
\`\`\`
Base Price: $50.00
Market Adjustment: +10% (California) = $55.00
Dynamic Rule: -5% (high inventory) = $52.25
Promotion: -20% (customer tier A) = $41.80
Final Price: $41.80
\`\`\`

## Base Pricing

### Setting Base Prices

**Individual Products**:
1. **Navigate to Products** → Select product
2. **Click "Edit Pricing"**
3. **Enter Base Price**: Foundation price before adjustments
4. **Set Cost**: For margin calculations
5. **Save**: Base price is now set

**Bulk Price Updates**:
1. **Click "Bulk Price Update"** in Pricing Engine
2. **Download Template**: Get CSV with current prices
3. **Update Prices**: Modify prices in spreadsheet
4. **Upload**: Import updated prices
5. **Review**: Confirm changes before applying

### Price Calculation Methods

**Cost-Plus Pricing**:
- Set desired margin percentage
- System calculates price: `Price = Cost / (1 - Margin%)`
- Example: $20 cost, 40% margin = $33.33 price

**Competitive Pricing**:
- Import competitor prices
- Set position (match, beat by X%, premium by X%)
- System adjusts prices automatically

**Value-Based Pricing**:
- Set prices based on perceived value
- Consider brand, quality, uniqueness
- Manual price setting with analytics feedback

## Market-Specific Pricing

### Creating Market Price Rules

Markets can be locations, channels, or customer segments:

1. **Navigate to Pricing Engine** → Market Pricing
2. **Click "Add Market Rule"**
3. **Define Market**:
   - Geographic (California, Nevada, etc.)
   - Channel (Online, In-Store, Delivery)
   - Customer Segment (Medical, Recreational)
4. **Set Adjustment**:
   - Percentage markup/markdown
   - Fixed dollar amount
   - Specific price override
5. **Apply to Products**:
   - All products
   - Specific categories
   - Selected brands
6. **Schedule**: Set effective dates
7. **Activate**: Rule applies immediately

### Market Priority

When multiple market rules apply:

1. **Most Specific Wins**: Product-specific > Category > Brand > All Products
2. **Geographic Priority**: Store-specific > City > State > National
3. **Channel Priority**: Specific channel > General
4. **Manual Override**: Always takes precedence

## Dynamic Pricing Rules

### Inventory-Based Pricing

Automatically adjust prices based on stock levels:

**High Inventory Discount**:
1. **Set Threshold**: Days of supply (e.g., >60 days)
2. **Set Discount**: Percentage to reduce (e.g., 10%)
3. **Scope**: Categories or brands to apply
4. **Auto-Apply**: Prices adjust as inventory changes

**Low Inventory Premium**:
1. **Set Threshold**: Days of supply (e.g., <7 days)
2. **Set Premium**: Percentage to increase (e.g., 5%)
3. **Scope**: High-demand products
4. **Auto-Apply**: Prices increase when stock is low

### Time-Based Pricing

Adjust prices by time of day, day of week, or season:

**Happy Hour Pricing**:
1. **Set Time Window**: 2pm-5pm weekdays
2. **Set Discount**: 15% off
3. **Apply to Categories**: Select products
4. **Activate**: Prices automatically adjust during window

**Seasonal Pricing**:
1. **Define Season**: Summer, holidays, etc.
2. **Set Adjustment**: Increase or decrease
3. **Schedule**: Start and end dates
4. **Auto-Revert**: Returns to base price after season

### Competitive Pricing

Match or beat competitor prices automatically:

1. **Import Competitor Data**: Upload competitor price list
2. **Set Strategy**:
   - Match prices exactly
   - Beat by X% (e.g., 5% lower)
   - Premium positioning (X% higher)
3. **Update Frequency**: Daily, weekly, or real-time
4. **Price Floors**: Set minimum acceptable prices
5. **Activate**: System monitors and adjusts prices

## Price Testing

### A/B Price Testing

Test different prices to find optimal pricing:

1. **Navigate to Pricing Engine** → Price Testing
2. **Click "Create Test"**
3. **Select Products**: Choose products to test
4. **Define Variants**:
   - Control: Current price
   - Variant A: Test price 1
   - Variant B: Test price 2 (optional)
5. **Set Traffic Split**: 50/50 or custom
6. **Duration**: Test length (minimum 2 weeks recommended)
7. **Success Metrics**: Revenue, margin, units sold
8. **Launch**: Test begins immediately

### Analyzing Test Results

After test completion:

1. **View Results**: Click on completed test
2. **Key Metrics**:
   - Revenue per variant
   - Units sold
   - Conversion rate
   - Profit margin
3. **Statistical Significance**: System shows confidence level
4. **Recommendation**: Suggested winning price
5. **Apply Winner**: Implement best-performing price

## Best Practices

### Pricing Strategy

**Margin Management**:
- Set minimum margin thresholds
- Monitor margin by category
- Balance volume vs. margin
- Protect profitability on promotions

**Competitive Positioning**:
- Know your market position
- Don't always be cheapest
- Emphasize value, not just price
- Monitor competitor moves

**Price Psychology**:
- Use charm pricing ($19.99 vs $20.00)
- Anchor with higher-priced options
- Bundle for perceived value
- Avoid frequent price changes

### Dynamic Pricing

**Inventory Rules**:
- Set conservative thresholds initially
- Monitor customer response
- Adjust gradually
- Combine with promotions for clearance

**Time-Based Rules**:
- Align with customer shopping patterns
- Test different time windows
- Measure impact on traffic
- Avoid cannibalizing full-price sales

**Competitive Rules**:
- Set realistic price floors
- Don't race to bottom
- Focus on key competitive products
- Maintain brand positioning

### Price Changes

**Communication**:
- Notify customers of major changes
- Explain value, not just price
- Grandfather existing orders
- Train staff on new pricing

**Timing**:
- Avoid frequent changes
- Change prices during slow periods
- Give advance notice when possible
- Coordinate with marketing

## Troubleshooting

### Common Issues

**Price Not Updating**:
- Check if pricing rule is active
- Verify product is in rule scope
- Clear cache and refresh
- Check for conflicting rules

**Wrong Price Displayed**:
- Verify market rules are correct
- Check promotion stacking
- Review dynamic rule priorities
- Ensure POS sync is working

**Margin Too Low**:
- Review active promotions
- Check dynamic pricing rules
- Verify cost data is current
- Set minimum margin thresholds

**Price Test Not Running**:
- Verify test is active
- Check traffic allocation
- Ensure products have inventory
- Review test configuration

### Getting Help

**In-App Support**:
- Click the book icon (📖) for this guide
- Use price calculator tool
- Check pricing rule conflicts

**Contact Support**:
- Pricing strategy: Schedule consultation
- Technical issues: Use support chat
- Urgent problems: Call support hotline

---

## Quick Reference

### Price Calculation Order

1. Base Price
2. Market Adjustment
3. Dynamic Rules
4. Promotions
5. Final Price

### Pricing Rule Priority

1. Manual Override (highest)
2. Product-Specific Rules
3. Category Rules
4. Brand Rules
5. Global Rules (lowest)

### Recommended Margins by Category

| Category | Target Margin | Minimum Margin |
|----------|---------------|----------------|
| Flower | 40-50% | 30% |
| Edibles | 45-55% | 35% |
| Concentrates | 35-45% | 25% |
| Vapes | 30-40% | 20% |
| Accessories | 50-60% | 40% |

---

*Last Updated: January 2025*
*Version: 1.0*
