-- Check if products table has data and seed if empty
DO $$
DECLARE
    product_count INTEGER;
BEGIN
    -- Check current product count
    SELECT COUNT(*) INTO product_count FROM products;
    
    RAISE NOTICE 'Current product count: %', product_count;
    
    -- If no products exist, insert some basic test data
    IF product_count = 0 THEN
        RAISE NOTICE 'No products found, inserting test data...';
        
        INSERT INTO products (
            id, name, sku, category, brand, thc_percentage, price, cost, 
            expiration_date, batch_id, inventory_count, created_at, updated_at
        ) VALUES 
        (
            gen_random_uuid(),
            'Premium OG Kush',
            'POK-001',
            'Flower',
            'Rythm',
            24.5,
            45.00,
            27.00,
            CURRENT_DATE + INTERVAL '6 months',
            'BATCH-001',
            100,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Blue Dream Cartridge',
            'BDC-002',
            'Vape',
            'Dogwalkers',
            78.2,
            65.00,
            39.00,
            CURRENT_DATE + INTERVAL '1 year',
            'BATCH-002',
            50,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Sour Diesel',
            'SD-003',
            'Flower',
            'Rythm',
            22.8,
            42.00,
            25.20,
            CURRENT_DATE + INTERVAL '6 months',
            'BATCH-003',
            75,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Wedding Cake Edible',
            'WCE-004',
            'Edibles',
            'Kiva',
            0.0,
            25.00,
            15.00,
            CURRENT_DATE + INTERVAL '1 year',
            'BATCH-004',
            200,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Gelato Live Resin',
            'GLR-005',
            'Concentrate',
            'Rythm',
            85.6,
            80.00,
            48.00,
            CURRENT_DATE + INTERVAL '2 years',
            'BATCH-005',
            25,
            NOW(),
            NOW()
        );
        
        -- Check final count
        SELECT COUNT(*) INTO product_count FROM products;
        RAISE NOTICE 'Products inserted successfully. New count: %', product_count;
    ELSE
        RAISE NOTICE 'Products already exist, no seeding needed.';
    END IF;
END $$;

-- Display current products for verification
SELECT 
    name,
    sku,
    category,
    brand,
    price,
    inventory_count
FROM products 
ORDER BY created_at DESC 
LIMIT 10;
