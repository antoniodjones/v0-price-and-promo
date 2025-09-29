export interface Product {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  price: number
  cost: number
  inventory_count: number
  thc_percentage?: number
  batch_id?: string
  expiration_date?: string
  created_at: string
  updated_at: string
}

export interface PriceSource {
  id: string
  name: string
  website_url: string
  api_endpoint?: string
  is_active: boolean
  scraping_config?: any
  created_at: string
  updated_at: string
}

export interface PriceHistory {
  id: string
  product_id: string
  source_id: string
  price: number
  original_price?: number
  availability_status: string
  scraped_at: string
  last_updated: string
  metadata?: any
}

export interface PriceAlert {
  id: string
  user_id: string
  product_id: string
  target_price: number
  alert_type: string
  is_active: boolean
  notification_sent: boolean
  created_at: string
  triggered_at?: string
}

export interface Promotion {
  id: string
  name: string
  type: string
  status: string
  start_date: string
  end_date: string
  discount_type?: string
  discount_value?: number
  trigger_level?: string
  trigger_value?: number
  reward_type?: string
  reward_value?: number
  created_at: string
  updated_at: string
}

export interface CompetitorAnalysis {
  id: string
  product_id: string
  competitor_name: string
  our_price: number
  competitor_price: number
  price_difference: number
  market_position: string
  analysis_date: string
  recommendations?: any
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface DealNotification {
  id: string
  product_id: string
  title: string
  description?: string
  discount_percentage?: number
  original_price?: number
  sale_price?: number
  source_url?: string
  valid_from: string
  valid_until?: string
  is_active: boolean
  created_at: string
  updated_at: string
  product?: Product
}

export interface PriceData {
  current_price: number
  previous_price?: number
  price_change?: number
  price_change_percentage?: number
  last_updated: string
}
