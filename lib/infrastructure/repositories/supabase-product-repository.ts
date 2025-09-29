import { ProductEntity } from "../../domain/entities/product"
import type { ProductRepository } from "../../domain/repositories/product-repository"
import { db } from "../../services/database"

export class SupabaseProductRepository implements ProductRepository {
  async findById(id: string): Promise<ProductEntity | null> {
    const client = db.getClient()
    const { data, error } = await client.from("products").select("*").eq("id", id).single()

    if (error || !data) return null

    return this.mapToEntity(data)
  }

  async findAll(page = 1, limit = 50): Promise<{ products: ProductEntity[]; total: number }> {
    const client = db.getClient()
    const skip = (page - 1) * limit

    const [{ data: products, error: productsError }, { count: total, error: countError }] = await Promise.all([
      client
        .from("products")
        .select("*")
        .range(skip, skip + limit - 1)
        .order("created_at", { ascending: false }),
      client.from("products").select("*", { count: "exact", head: true }),
    ])

    if (productsError || countError) {
      throw new Error(productsError?.message || countError?.message || "Failed to fetch products")
    }

    return {
      products: (products || []).map(this.mapToEntity),
      total: total || 0,
    }
  }

  async findByCategory(category: string): Promise<ProductEntity[]> {
    const client = db.getClient()
    const { data, error } = await client.from("products").select("*").eq("category", category).order("name")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async findByBrand(brand: string): Promise<ProductEntity[]> {
    const client = db.getClient()
    const { data, error } = await client.from("products").select("*").eq("brand", brand).order("name")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async findLowStock(threshold = 10): Promise<ProductEntity[]> {
    const client = db.getClient()
    const { data, error } = await client
      .from("products")
      .select("*")
      .lt("inventory_count", threshold)
      .order("inventory_count")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async findExpiringSoon(days = 30): Promise<ProductEntity[]> {
    const client = db.getClient()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    const { data, error } = await client
      .from("products")
      .select("*")
      .not("expiration_date", "is", null)
      .lte("expiration_date", futureDate.toISOString().split("T")[0])
      .order("expiration_date")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async search(query: string): Promise<ProductEntity[]> {
    const client = db.getClient()
    const { data, error } = await client
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,sku.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(20)

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    const client = db.getClient()

    const productData = {
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      price: product.price,
      cost: product.cost,
      inventory_count: product.inventoryCount,
      batch_id: product.batchId,
      thc_percentage: product.thcPercentage,
      expiration_date: product.expirationDate,
      updated_at: new Date().toISOString(),
    }

    let data, error

    if (product.id && product.id !== "new") {
      // Update existing product
      const result = await client.from("products").update(productData).eq("id", product.id).select().single()

      data = result.data
      error = result.error
    } else {
      // Create new product
      const result = await client
        .from("products")
        .insert({ ...productData, created_at: new Date().toISOString() })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) throw new Error(error.message)
    if (!data) throw new Error("Failed to save product")

    return this.mapToEntity(data)
  }

  async delete(id: string): Promise<void> {
    const client = db.getClient()
    const { error } = await client.from("products").delete().eq("id", id)

    if (error) throw new Error(error.message)
  }

  private mapToEntity(data: any): ProductEntity {
    return new ProductEntity(
      data.id,
      data.name,
      data.sku,
      data.category,
      data.brand,
      data.price,
      data.cost,
      data.inventory_count,
      data.batch_id,
      data.thc_percentage,
      data.expiration_date,
      data.created_at,
      data.updated_at,
    )
  }
}
