-- Create watchlists table for users to track favorite products
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on watchlists
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- Create policies for watchlists
CREATE POLICY "Users can view their own watchlist items" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add items to their watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove items from their watchlist" ON public.watchlists FOR DELETE USING (auth.uid() = user_id);
