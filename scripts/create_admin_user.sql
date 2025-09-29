-- Create an admin user for testing
-- This script should be run after the user_profiles table is created

-- Insert admin user profile (assuming you have a user with this email)
-- Replace 'admin@gti.com' with your actual admin email
INSERT INTO public.user_profiles (
  id,
  first_name,
  last_name,
  department,
  role,
  status
) 
SELECT 
  id,
  'Admin',
  'User',
  'management',
  'admin',
  'active'
FROM auth.users 
WHERE email = 'admin@gti.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  department = 'management',
  status = 'active';

-- If no admin user exists, you can create one manually:
-- 1. Sign up through the app with admin@gti.com
-- 2. Run this script to upgrade the user to admin role
-- 3. Or update an existing user's role:

-- UPDATE public.user_profiles 
-- SET role = 'admin', department = 'management'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@gti.com');
