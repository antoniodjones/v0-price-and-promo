-- Create user profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user profiles
CREATE POLICY "users_can_view_own_profile" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "admins_can_view_all_profiles" 
  ON public.user_profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "admins_can_update_all_profiles" 
  ON public.user_profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    first_name, 
    last_name, 
    department, 
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'department', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update existing app_users table to work with new auth system
-- Add foreign key constraint to link with auth.users if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'app_users_id_fkey' 
    AND table_name = 'app_users'
  ) THEN
    ALTER TABLE public.app_users 
    ADD CONSTRAINT app_users_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS on app_users if not already enabled
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Create policies for app_users
DROP POLICY IF EXISTS "users_can_view_own_data" ON public.app_users;
CREATE POLICY "users_can_view_own_data" 
  ON public.app_users FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "users_can_update_own_data" ON public.app_users;
CREATE POLICY "users_can_update_own_data" 
  ON public.app_users FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "admins_can_manage_users" ON public.app_users;
CREATE POLICY "admins_can_manage_users" 
  ON public.app_users FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
