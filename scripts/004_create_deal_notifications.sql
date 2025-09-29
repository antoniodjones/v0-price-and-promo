-- Create deal notifications table for tracking promotional offers
CREATE TABLE IF NOT EXISTS public.deal_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_percentage NUMERIC,
  original_price NUMERIC,
  sale_price NUMERIC,
  source_url TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on deal_notifications
ALTER TABLE public.deal_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for deal_notifications (public read, admin write)
CREATE POLICY "Allow public read access to deal_notifications" ON public.deal_notifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage deal_notifications" ON public.deal_notifications FOR ALL USING (auth.uid() IS NOT NULL);

-- Create index for performance
CREATE INDEX idx_deal_notifications_product_id ON public.deal_notifications(product_id);
CREATE INDEX idx_deal_notifications_active ON public.deal_notifications(is_active, valid_until);
