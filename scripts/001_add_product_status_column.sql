-- Add status column to products table if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
