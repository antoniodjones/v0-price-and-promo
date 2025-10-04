-- Add SKU and Batch ID columns to products table
-- Essential for cannabis inventory tracking and compliance

-- Add sku column (unique identifier for each product variant)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(50) UNIQUE;

-- Add batch_id column (critical for cannabis compliance and traceability)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS batch_id VARCHAR(50);

-- Add index on sku for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Add index on batch_id for compliance queries
CREATE INDEX IF NOT EXISTS idx_products_batch_id ON products(batch_id);

-- Add comment explaining the columns
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique identifier for product variant';
COMMENT ON COLUMN products.batch_id IS 'Batch identifier for compliance tracking and recalls';
