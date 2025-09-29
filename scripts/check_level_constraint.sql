-- Check the current check constraint on customer_discounts table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint 
WHERE conrelid = 'customer_discounts'::regclass 
AND contype = 'c';

-- Also check what values currently exist in the level column
SELECT DISTINCT level FROM customer_discounts;
