# Products Management User Guide

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Managing Products](#managing-products)
4. [Product Categories](#product-categories)
5. [Inventory Integration](#inventory-integration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

The Products Management system is your central hub for managing all product information, pricing, and inventory across your dispensary. This guide will help you effectively manage your product catalog and ensure accurate pricing.

### Key Features

- **Product Catalog**: Comprehensive product database with detailed information
- **Category Management**: Organize products by type, brand, and attributes
- **Pricing Control**: Set and manage base prices, market-specific pricing
- **Inventory Tracking**: Real-time inventory levels and batch information
- **Bulk Operations**: Import/export products and make bulk updates
- **Search & Filter**: Advanced search capabilities to find products quickly

## Getting Started

### Accessing Products

1. **Navigate to Products**: Click "Products" in the left sidebar
2. **Dashboard View**: See your complete product catalog with:
   - Total product count
   - Active products
   - Low stock alerts
   - Recent updates

### Understanding the Product List

The product list displays:
- **Product Name**: Full product name and SKU
- **Category**: Product type (Flower, Edibles, Concentrates, etc.)
- **Brand**: Manufacturer or brand name
- **Price**: Current base price
- **Stock**: Available inventory quantity
- **Status**: Active, Inactive, or Out of Stock

## Managing Products

### Adding a New Product

1. **Click "Add Product"** button in the top right
2. **Enter Basic Information**:
   - Product name (required)
   - SKU/Product code (auto-generated or custom)
   - Brand selection
   - Category and sub-category
3. **Set Pricing**:
   - Base price (required)
   - Cost (for margin calculations)
   - MSRP (manufacturer suggested retail price)
4. **Add Product Details**:
   - Description
   - Product images
   - Weight/size
   - THC/CBD percentages
5. **Configure Inventory**:
   - Initial stock quantity
   - Reorder point
   - Batch information
6. **Save Product**: Click "Create Product" to add to catalog

### Editing Products

1. **Find Product**: Use search or browse the product list
2. **Click Product Row**: Opens product detail view
3. **Click "Edit"**: Modify any product information
4. **Update Fields**: Change pricing, details, or inventory
5. **Save Changes**: Updates apply immediately

### Bulk Product Import

For adding multiple products at once:

1. **Click "Bulk Import"** in the top right
2. **Download Template**: Get the CSV template with correct format
3. **Fill in Product Data**:
   \`\`\`csv
   name,sku,brand,category,subcategory,price,cost,thc_percentage,cbd_percentage,weight,unit
   "Blue Dream 3.5g",BD-35,House Brand,Flower,Indica,35.00,18.00,22.5,0.5,3.5,g
   \`\`\`
4. **Upload File**: Select your completed CSV
5. **Review Results**: See import summary and any errors
6. **Fix Errors**: Correct any issues and re-upload if needed

### Deactivating Products

To remove products from active catalog without deleting:

1. **Select Product**: Find the product to deactivate
2. **Click "Deactivate"**: Product moves to inactive status
3. **Effect**: Product no longer appears in POS or online ordering
4. **Reactivate**: Can be reactivated anytime from inactive products view

## Product Categories

### Category Structure

Products are organized in a hierarchical structure:

**Main Categories**:
- Flower (Indica, Sativa, Hybrid)
- Edibles (Gummies, Chocolates, Beverages, Baked Goods)
- Concentrates (Wax, Shatter, Live Resin, Distillate)
- Vapes (Cartridges, Disposables, Batteries)
- Topicals (Lotions, Balms, Patches)
- Tinctures (Sublingual, Oral)
- Pre-Rolls (Singles, Packs, Infused)
- Accessories (Papers, Grinders, Storage)

### Managing Categories

1. **View Categories**: Click "Categories" tab in Products section
2. **Add Category**: Create new main or sub-category
3. **Edit Category**: Modify category names or structure
4. **Assign Products**: Move products between categories

### Category-Based Pricing

Set pricing rules by category:

1. **Select Category**: Choose the category to configure
2. **Set Markup**: Apply percentage markup to all products
3. **Price Floors**: Set minimum prices for category
4. **Auto-Apply**: New products in category inherit pricing rules

## Inventory Integration

### Batch Tracking

Products can be tracked by batch for compliance:

1. **View Batches**: Click product → "Batches" tab
2. **Batch Information**:
   - Batch ID/number
   - Harvest date
   - Expiration date
   - Test results (THC/CBD, contaminants)
   - Quantity remaining
3. **FIFO Management**: System automatically sells oldest batches first
4. **Batch-Specific Pricing**: Set different prices for different batches

### Stock Alerts

Configure low stock notifications:

1. **Set Reorder Point**: Define minimum quantity threshold
2. **Alert Preferences**: Choose notification method (email, in-app)
3. **Auto-Reorder**: Optional automatic purchase order creation
4. **Stock Reports**: View inventory levels and turnover rates

### Inventory Adjustments

Make manual inventory corrections:

1. **Select Product**: Find product needing adjustment
2. **Click "Adjust Inventory"**: Opens adjustment form
3. **Enter Adjustment**:
   - Quantity change (+ or -)
   - Reason (damaged, theft, recount, etc.)
   - Notes
4. **Submit**: Adjustment logged for audit trail

## Best Practices

### Product Information

**Complete Profiles**:
- Always include product images
- Write detailed descriptions
- Keep THC/CBD percentages current
- Update batch information regularly

**Accurate Pricing**:
- Review prices weekly
- Monitor competitor pricing
- Ensure cost data is current for margin tracking
- Use market-specific pricing for multi-location operations

**SKU Management**:
- Use consistent SKU format
- Include brand/category codes in SKU
- Never reuse SKUs for different products
- Document SKU structure for team reference

### Inventory Management

**Regular Audits**:
- Conduct physical inventory counts monthly
- Reconcile system vs. actual stock
- Investigate discrepancies immediately
- Update batch information after counts

**Batch Rotation**:
- Monitor expiration dates
- Use FIFO (First In, First Out) method
- Set up expiration alerts
- Apply automatic discounts to aging inventory

### Data Quality

**Consistency**:
- Use standardized brand names
- Follow category naming conventions
- Maintain consistent product naming format
- Regular data cleanup and deduplication

**Compliance**:
- Keep test results current
- Track batch lineage
- Maintain accurate weights/quantities
- Document all inventory adjustments

## Troubleshooting

### Common Issues

**Product Not Appearing in POS**:
- Check product status (must be Active)
- Verify inventory quantity > 0
- Ensure product has valid price
- Check category assignments

**Pricing Discrepancies**:
- Verify base price is set
- Check for active promotions
- Review market-specific pricing
- Ensure no conflicting price rules

**Inventory Sync Issues**:
- Refresh inventory data
- Check integration status
- Verify batch information
- Contact support if sync fails

**Bulk Import Errors**:
- Verify CSV format matches template
- Check for required fields
- Ensure SKUs are unique
- Validate price and quantity formats

### Getting Help

**In-App Support**:
- Click the book icon (📖) for this guide
- Use search function to find products quickly
- Check system status indicator

**Contact Support**:
- Technical issues: Use support chat
- Data questions: Email data@support.com
- Urgent issues: Call support hotline

---

## Quick Reference

### Product Creation Checklist

- [ ] Product name and SKU
- [ ] Brand and category
- [ ] Base price and cost
- [ ] Product description
- [ ] Product images
- [ ] THC/CBD percentages
- [ ] Initial inventory quantity
- [ ] Batch information (if applicable)

### Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New product
- `Ctrl/Cmd + E`: Edit selected product
- `Ctrl/Cmd + S`: Save changes

---

*Last Updated: January 2025*
*Version: 1.0*
