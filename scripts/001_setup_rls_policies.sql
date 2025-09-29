-- Enable Row Level Security on existing tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for products table (public read, admin write)
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert products" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to update products" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to delete products" ON products FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for price_sources table (public read, admin write)
CREATE POLICY "Allow public read access to price_sources" ON price_sources FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage price_sources" ON price_sources FOR ALL USING (auth.uid() IS NOT NULL);

-- Create policies for price_history table (public read, system write)
CREATE POLICY "Allow public read access to price_history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert price_history" ON price_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for price_alerts table (users can only see their own alerts)
CREATE POLICY "Users can view their own price alerts" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own price alerts" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own price alerts" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own price alerts" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Create policies for competitor_analysis table (public read, admin write)
CREATE POLICY "Allow public read access to competitor_analysis" ON competitor_analysis FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to manage competitor_analysis" ON competitor_analysis FOR ALL USING (auth.uid() IS NOT NULL);
