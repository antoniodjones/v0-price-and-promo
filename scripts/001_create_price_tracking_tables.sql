-- Create price tracking and comparison tables
-- This script sets up the core tables for price comparison and promotion tracking

-- Stores information about different retailers/sources for price comparison
CREATE TABLE IF NOT EXISTS public.price_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT true,
  scraping_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores price history for products across different sources
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES price_sources(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2), -- For tracking discounts
  availability_status TEXT DEFAULT 'in_stock',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB -- Store additional data like shipping costs, ratings, etc.
);

-- Stores price alerts for users
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  target_price NUMERIC(10,2) NOT NULL,
  alert_type TEXT DEFAULT 'below', -- 'below', 'above', 'change'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  triggered_at TIMESTAMP WITH TIME ZONE,
  notification_sent BOOLEAN DEFAULT false
);

-- Stores promotion tracking data
CREATE TABLE IF NOT EXISTS public.promotion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID, -- Can reference different promotion tables
  promotion_type TEXT NOT NULL, -- 'bogo', 'bundle', 'customer_discount', 'inventory_discount'
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  revenue_impact NUMERIC(12,2) DEFAULT 0,
  cost_impact NUMERIC(12,2) DEFAULT 0,
  date_tracked DATE DEFAULT CURRENT_DATE,
  metadata JSONB
);

-- Stores competitor analysis data
CREATE TABLE IF NOT EXISTS public.competitor_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  competitor_price NUMERIC(10,2) NOT NULL,
  our_price NUMERIC(10,2) NOT NULL,
  price_difference NUMERIC(10,2) NOT NULL,
  market_position TEXT, -- 'higher', 'lower', 'competitive'
  analysis_date DATE DEFAULT CURRENT_DATE,
  recommendations JSONB
);

-- Enable Row Level Security
ALTER TABLE public.price_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for price_sources (admin only)
CREATE POLICY "Allow admin to manage price sources" ON public.price_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Create policies for price_history (read-only for authenticated users)
CREATE POLICY "Allow authenticated users to view price history" ON public.price_history
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin to manage price history" ON public.price_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Create policies for price_alerts (users can manage their own alerts)
CREATE POLICY "Users can manage their own price alerts" ON public.price_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for promotion_tracking (admin only)
CREATE POLICY "Allow admin to manage promotion tracking" ON public.promotion_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Create policies for competitor_analysis (admin only)
CREATE POLICY "Allow admin to manage competitor analysis" ON public.competitor_analysis
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM app_users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_source_id ON public.price_history(source_id);
CREATE INDEX IF NOT EXISTS idx_price_history_scraped_at ON public.price_history(scraped_at);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_product_id ON public.price_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_promotion_tracking_date ON public.promotion_tracking(date_tracked);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_product_id ON public.competitor_analysis(product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_date ON public.competitor_analysis(analysis_date);
