-- Create price_sources table for admin dashboard
CREATE TABLE IF NOT EXISTS price_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    api_endpoint VARCHAR(500),
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
    sync_frequency VARCHAR(50) NOT NULL DEFAULT 'Every 4 hours',
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_price_sources_status ON price_sources(status);
CREATE INDEX IF NOT EXISTS idx_price_sources_created_at ON price_sources(created_at);

-- Add RLS policies
ALTER TABLE price_sources ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read price sources
CREATE POLICY "Users can view price sources" ON price_sources
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for admin users to manage price sources
CREATE POLICY "Admins can manage price sources" ON price_sources
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'user_metadata' ->> 'role' = 'admin'
    );

-- Insert some sample data
INSERT INTO price_sources (name, url, api_endpoint, status, sync_frequency, last_sync) VALUES
('Wholesale Direct', 'wholesale-direct.com', 'https://api.wholesale-direct.com/v1/products', 'active', 'Every 4 hours', NOW() - INTERVAL '2 hours'),
('Green Supply Co', 'greensupply.com', 'https://api.greensupply.com/products', 'active', 'Every 6 hours', NOW() - INTERVAL '1 hour'),
('Cannabis Wholesale', 'cannabiswholesale.com', NULL, 'error', 'Every 8 hours', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;
