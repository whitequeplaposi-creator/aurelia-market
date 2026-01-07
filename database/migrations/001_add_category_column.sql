-- Migration: Add category column to products table
-- Date: 2025-01-07
-- Description: Adds category column to support product categorization

-- Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE products ADD COLUMN category VARCHAR(50);
        
        -- Create index for better query performance
        CREATE INDEX idx_products_category ON products(category);
        
        RAISE NOTICE 'Category column added successfully';
    ELSE
        RAISE NOTICE 'Category column already exists';
    END IF;
END $$;

-- Optional: Update existing products with default category
-- UPDATE products SET category = 'accessoarer' WHERE category IS NULL;

