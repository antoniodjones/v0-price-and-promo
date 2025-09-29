import { createClient } from "@supabase/supabase-js"

class DatabaseService {
  private static instance: DatabaseService
  private supabase: ReturnType<typeof createClient>

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public getClient() {
    return this.supabase
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("products").select("id").limit(1)
      return !error
    } catch {
      return false
    }
  }
}

export const db = DatabaseService.getInstance()
