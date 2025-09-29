-- Create users table for internal user management
-- Note: This is separate from auth.users and doesn't use RLS as requested

CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'manager', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  updated_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_app_users_email ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON public.app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON public.app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_created_at ON public.app_users(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_users_updated_at 
    BEFORE UPDATE ON public.app_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample users for testing
INSERT INTO public.app_users (email, first_name, last_name, role, department, phone) VALUES
('admin@gti.com', 'System', 'Administrator', 'admin', 'IT', '555-0001'),
('manager@gti.com', 'Pricing', 'Manager', 'manager', 'Pricing', '555-0002'),
('editor@gti.com', 'Content', 'Editor', 'editor', 'Marketing', '555-0003'),
('viewer@gti.com', 'Regular', 'User', 'viewer', 'Sales', '555-0004')
ON CONFLICT (email) DO NOTHING;
