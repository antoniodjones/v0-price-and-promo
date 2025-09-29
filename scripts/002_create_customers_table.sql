-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'Standard',
  market TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  total_purchases DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_market ON customers(market);

-- Insert sample customers
INSERT INTO customers (name, email, tier, market, status, total_purchases) VALUES
('Acme Dispensary', 'orders@acmedispensary.com', 'Premium', 'California', 'Active', 15420.50),
('Green Valley Co-op', 'purchasing@greenvalley.com', 'Standard', 'Colorado', 'Active', 8750.25),
('High Times Retail', 'buyer@hightimes.com', 'Premium', 'Nevada', 'Active', 22100.75),
('Cannabis Corner', 'orders@cannabiscorner.com', 'Standard', 'Oregon', 'Active', 5680.00),
('The Herb Shop', 'contact@herbshop.com', 'Premium', 'Washington', 'Active', 18950.30),
('Wellness Dispensary', 'orders@wellnessdispensary.com', 'Standard', 'Arizona', 'Active', 7200.15),
('Natural Remedies', 'purchasing@naturalremedies.com', 'Premium', 'California', 'Active', 31500.80),
('Sunset Cannabis', 'buyer@sunsetcannabis.com', 'Standard', 'Colorado', 'Active', 4320.60),
('Mountain High', 'orders@mountainhigh.com', 'Premium', 'Nevada', 'Active', 19875.45),
('Pacific Coast Dispensary', 'contact@pacificcoast.com', 'Standard', 'Oregon', 'Active', 6540.90);
