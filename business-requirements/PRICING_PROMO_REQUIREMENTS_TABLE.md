# Pricing & Promo Requirements - Detailed Feature Matrix

This document provides a detailed breakdown of all pricing and promotion requirements organized by type, priority, and implementation details.

---

## Pricing Requirements

| Ref # | Type | Description | Details | MVP Priority | Comments/Notes | Potential UI |
|-------|------|-------------|---------|--------------|----------------|--------------|
| 1 | Base Price | Base price by product/item - applicable to all customers | N/A | N/A - D365 Setup | | |
| 2 | Customer Discounts | Customer reduced pricing off base/list price | - Can be dollars or percentage off<br>- Need to support at following levels:<br>&nbsp;&nbsp;&nbsp;a. Brand<br>&nbsp;&nbsp;&nbsp;b. Category (ex. Flower vs. Edibles)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.1 Sub-category (ex. Gummies, Chocolates, etc.)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b.2 Size (ex. 500mg, 1g, 2g) | **#1 - must have** | For Step 5 on UI in future could have customer groups to make management easier (tier A vs. B vs. C) | **Step 1**: Choose level of customer discount:<br>&nbsp;&nbsp;&nbsp;A. Brand Level<br>&nbsp;&nbsp;&nbsp;B. Category Level (with option to go to sub-category/size in category level)<br>**Step 2**: Choose Item/Brand/Category based on step 1 selection<br>**Step 3**: Set discount amount<br>&nbsp;&nbsp;&nbsp;- Choose dollars vs. %<br>&nbsp;&nbsp;&nbsp;- Allow entry of dollar or % for promo<br>**Step 4**: Set start and end date<br>**Step 5**: Allow customers to be added to the discount (some type of list or picker)<br>**Step 6**: Create discount name |
| 3 | Volume Discounts | Tiered pricing based on quantity being purchased | - Require ability to have customers in groups. Ex. High val vs. Standard<br>- Needs to support volume based on units or cases<br>- Need to support being able to set at the following tiers:<br>&nbsp;&nbsp;&nbsp;a. Total order qty<br>&nbsp;&nbsp;&nbsp;b. Qty tiers by brand<br>&nbsp;&nbsp;&nbsp;c. Category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 Size | Market to choose volume or tiered pricing, but not both in same market for MVP | | **Step 1**: Choose tiered pricing by volume (cases or units) vs. dollar total<br>**Step 2**: Choose what level to set the discount rule<br>&nbsp;&nbsp;&nbsp;A. Global Rule<br>&nbsp;&nbsp;&nbsp;B. Item Level<br>&nbsp;&nbsp;&nbsp;C. Brand Level<br>&nbsp;&nbsp;&nbsp;D. Category Level (with option to go to sub-category/size in category level)<br>**Step 3**: Choose Item/Brand/Category based on step 2 selection<br>**Step 4**: Build tiers either with Excel type table or UI where can add rows<br>&nbsp;&nbsp;&nbsp;- Each row enter volume/qty for tier based on selection in #1 (ex. > 50 units)<br>&nbsp;&nbsp;&nbsp;- Each row enter discount amount based on selection in #1 (Ex. 5%)<br>**Step 5**: Set start and end date<br>**Step 6**: Allow customers to be added to the discount (some type of list or picker)<br>**Step 7**: Create tiered pricing name |
| 4 | Tiered Pricing | Tiered pricing based on $$s spent on order | - Require ability to have customers in groups. Ex. High val vs. Standard<br>- Need to support being able to set at the following tiers:<br>&nbsp;&nbsp;&nbsp;a. Total order $$s<br>&nbsp;&nbsp;&nbsp;b. $$s by brand<br>&nbsp;&nbsp;&nbsp;c. Category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 Size | Market to choose volume or tiered pricing, but not both in same market for MVP | - Most complex UI for building pricing rules<br>- For Step 6 on UI in future could have customer groups to make management easier (tier A vs. B vs. C) | Same as Volume Discounts (Ref #3) |

### Additional Notes for Pricing:
1. Need ability to have start and end dates (optional blank for no planned end date)
2. **No stacking allowed for price or promos**
3. Customer tiers need to be setup for each rule. So, a customer can be A tier in some rules but not others.

---

## Promotion Requirements

| Ref # | Type | Description | Details | MVP Priority | Comments/Notes | Potential UI |
|-------|------|-------------|---------|--------------|----------------|--------------|
| 1 | % or $$ off Category, Brand, or Item | Basic promo of % or $ off | - Need to support at following levels:<br>&nbsp;&nbsp;&nbsp;a. X%, $ off or specific price for item<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a.1 batch level<br>&nbsp;&nbsp;&nbsp;b. X%, $ off or specific price for specific brand<br>&nbsp;&nbsp;&nbsp;c. X%, $ off or specific price for specific category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 specific size | **#1 - must have** | - Item batch level needed to allow liquidation option<br>- Specific price must also be allowed. Business will manage risk of potentially allowing too wide an update for this function | **Step 1**: Choose level of promo:<br>&nbsp;&nbsp;&nbsp;A. Item Level (with option to be batch specific)<br>&nbsp;&nbsp;&nbsp;B. Brand Level<br>&nbsp;&nbsp;&nbsp;C. Category Level (with option to go to sub-category/size in category level)<br>**Step 2**: Choose Item/Brand/Category based on step 1 selection<br>&nbsp;&nbsp;&nbsp;- Item selection also needs option to choose a specific batch<br>&nbsp;&nbsp;&nbsp;- Category level needs option to go down to sub-category/size as well<br>**Step 3**: Set promo amount<br>&nbsp;&nbsp;&nbsp;- Choose dollars, % or specific $$ amount<br>&nbsp;&nbsp;&nbsp;- Allow entry of dollar, % or specific $$ amount for promo<br>**Step 4**: Set start and end date<br>**Step 5**: Create promo name |
| 2 | BOGO - 3rd | Buy one get one free or reduced price | - Need to support at following levels:<br>&nbsp;&nbsp;&nbsp;a. Traditional Item Bogo (Buy one get 2nd X% or $ off)<br>&nbsp;&nbsp;&nbsp;b. Brand Bogo (Buy one incredible get 2nd X% or $ off)<br>&nbsp;&nbsp;&nbsp;c. Category Bogo (Buy one edible get 2nd X% or $ off)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 Size | **#3 - nice to have** | | **Step 1**: Choose type of Bogo:<br>&nbsp;&nbsp;&nbsp;A. Item Level<br>&nbsp;&nbsp;&nbsp;B. Brand Level<br>&nbsp;&nbsp;&nbsp;C. Category Level (with option to go to sub-category/size in category level)<br>**Step 2**: Choose Item/Brand/Category based on step 1 selection<br>**Step 3**: Set promo amount<br>&nbsp;&nbsp;&nbsp;- Choose dollars vs. %<br>&nbsp;&nbsp;&nbsp;- Allow entry of dollar or % for promo<br>**Step 4**: Set start and end date<br>**Step 5**: Create promo name |
| 3 | Bundle Deals | Buy X & Y and get % or $s off | - Need to support at following levels:<br>&nbsp;&nbsp;&nbsp;a. Item - Buy X cases of item A and X cases item B and get X% or $ off<br>&nbsp;&nbsp;&nbsp;b. Strain - Buy X cases strain A and X cases strain B and get X% or $ off<br>&nbsp;&nbsp;&nbsp;c. Brand<br>&nbsp;&nbsp;&nbsp;d. Category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d.2 Size | **#4 - not in MVP scope** | 4 or 5 max bundles seems reasonable | TBD |
| 4 | Discount (Aged or THC%) | Get % percent off or $s off for discounted product<br>&nbsp;&nbsp;&nbsp;a. THC% < X (#2)<br>&nbsp;&nbsp;&nbsp;b. Within X days of expiration date (#1) | - Need to support at following levels:<br>&nbsp;&nbsp;&nbsp;a. Item<br>&nbsp;&nbsp;&nbsp;b. Brand<br>&nbsp;&nbsp;&nbsp;c. Category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 Size | **#2 with expiration date (b) being higher than THC (a)** | Note - critical these rules are tied to an items at a batch level since THC & expiration date are batch level attributes | **Step 1**: Choose to discount by expiration date vs. THC%<br>**Step 2**: Choose what level to set the discount rule<br>&nbsp;&nbsp;&nbsp;A. Global Rule<br>&nbsp;&nbsp;&nbsp;B. Item Level<br>&nbsp;&nbsp;&nbsp;C. Brand Level<br>&nbsp;&nbsp;&nbsp;D. Category Level (with option to go to sub-category/size in category level)<br>**Step 3**: Choose Item/Brand/Category based on step 2 selection<br>**Step 4**: Set rule amount based on step 1 selection<br>&nbsp;&nbsp;&nbsp;- Expiration date - choose how many days prior to expiration to trigger discount<br>&nbsp;&nbsp;&nbsp;- THC% - select if product is below what percent to trigger the discount<br>**Step 5**: Set discount amount<br>&nbsp;&nbsp;&nbsp;- Choose dollars vs. %<br>&nbsp;&nbsp;&nbsp;- Allow entry of dollar or % for promo<br>**Step 6**: Set start and end date<br>**Step 7**: Create discount name |
| 5 | Rebates | Would not be part of pricing module. A rebate tool is a future need but would be a separate project | Need report for visibility.<br>By customers show list price vs. actual price with average discount by:<br>&nbsp;&nbsp;&nbsp;a. Strain<br>&nbsp;&nbsp;&nbsp;b. Brand<br>&nbsp;&nbsp;&nbsp;c. Category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.1 Sub-category<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c.2 Size | N/A | | |

### Additional Notes for Promotions:
1. Need ability to have start and end dates (optional blank for no planned end date)
2. **No stacking allowed for price or promos**
3. No customer tiers for promo (assume applies to all customers)

---

## Example Calculation Scenarios

### Volume Discount Example

**Volume Discount Table - Total Units**:
| Tier | Total Units | A Tier | B Tier | C Tier |
|------|-------------|--------|--------|--------|
| Tier 1 | 49-75 | 4.00% | 3.00% | 2.00% |
| Tier 2 | 76-99 | 5.00% | 4.00% | 3.00% |
| Tier 3 | >100 | 6.00% | 5.00% | 4.00% |

**Incredibles Volume Discount - Total Cases**:
| Tier | Total Cases | A Tier | B Tier | C Tier |
|------|-------------|--------|--------|--------|
| Tier 1 | >19 | 5.00% | 4.00% | 3.00% |
| Tier 2 | 20-49 | 6.00% | 5.00% | 4.00% |
| Tier 3 | >50 | 9.00% | 8.00% | 7.00% |

---

### Customer Discount Example

**Customer Discount Table**:
| Type | A Tier | B Tier | C Tier |
|------|--------|--------|--------|
| All Products | 3.00% | 2.00% | 1.00% |
| Incredibles | 4.00% | 3.00% | 2.00% |
| Category (Vape) | Percent Off | Percent Off | Percent Off |
| Sub-category (Vape/Disposable) | Percent Off | Percent Off | Percent Off |
| Size (Vape/Disposable/> 1G) | Percent Off | Percent Off | Percent Off |

---

### Example 1: C Tier Customer Purchases 80 Units (with 23 of them Incredibles)

**Order Details**:
| Item | Units | Cost | Total |
|------|-------|------|-------|
| A | 57 | $5.00 | $285.00 |
| Incredibles | 23 | $6.00 | $138.00 |
| **Total** | **80** | | **$423.00** |

**Discount Calculation**:
| Item | Percent | Savings |
|------|---------|---------|
| A | 1.00% | $2.85 |
| Incredibles | 2.00% | $2.76 |
| **Total** | | **$5.61** |

**Volume Discount Comparison**:
| Item | Volume Only Savings | Volume + Incredibles Savings |
|------|---------------------|------------------------------|
| A | 3.00% = $8.55 | 2.00% = $5.70 |
| Incredibles | 3.00% = $4.14 | 4.00% = $5.52 |
| **Total** | **$12.69** | **$11.22** |

---

### Tiered Discount Example

**Tiered Discount Table**:
| Type | A Tier | B Tier | C Tier |
|------|--------|--------|--------|
| All Products | 3.00% | 2.00% | 1.00% |
| Incredibles | 4.00% | 3.00% | 2.00% |
| Category (Vape) | 3.00% | 2.00% | 1.00% |
| Sub-category (Vape/Disposable) | Percent Off | Percent Off | Percent Off |
| Size (Vape/Disposable/> 1G) | Percent Off | Percent Off | Percent Off |

---

## Key Business Rules

### No Stacking Policy
- Only ONE discount can be applied per item
- System automatically applies the BEST available discount for the customer
- Exception: Special promotions may be configured to allow stacking (requires explicit configuration)

### Customer Tier Assignment
- Customers can be assigned to different tiers for different rules
- Example: Customer can be "A Tier" for Flower but "B Tier" for Concentrates
- Tier assignments are per-rule, not global

### Market Choice Constraint (MVP)
- Each market must choose EITHER volume-based OR tiered pricing
- Cannot use both in the same market during MVP phase
- Future phases may allow both

### Batch-Level Pricing
- Inventory discounts (aged, THC%) must be tied to specific batches
- THC percentage and expiration dates are batch-level attributes
- System must support batch-specific pricing rules

### Date Ranges
- All pricing and promotion rules support start and end dates
- End date is optional (can be left blank for no planned end)
- System automatically activates/deactivates rules based on dates

---

## Priority Summary

### Must Have (MVP Phase 1)
1. **Customer Discounts** - Brand, category, sub-category, size level
2. **Basic Promotions** - % or $ off at item/brand/category level with batch support

### High Priority (MVP Phase 2)
1. **Automated Inventory Discounts** - Expiration date based (higher priority)
2. **Automated Inventory Discounts** - THC% based (lower priority)

### Nice to Have (Phase 3)
1. **BOGO Promotions** - Item, brand, category level

### Future Phases (Phase 4+)
1. **Bundle Deals** - Multi-item bundles (4-5 items max)
2. **Volume/Tiered Pricing** - Based on market selection
3. **Rebate Reporting** - Separate project, not part of pricing module

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Source**: Business Requirements Spreadsheet
