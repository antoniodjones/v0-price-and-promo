import { db } from "./database"
import type { Product, ApiResponse } from "../types"

export class ProductService {
  async getProducts(limit = 50): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await db.getClient().from("products").select("*").limit(limit)

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      const products: Product[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name || "Unknown Product",
        sku: item.sku || "Unknown SKU",
        category: item.category || "Unknown",
        brand: item.brand || "Unknown Brand",
        price: Number(item.price) || 0,
        cost: item.cost ? Number(item.cost) : undefined,
        inventoryCount: item.inventory_count ? Number(item.inventory_count) : undefined,
        batchId: item.batch_id,
        thcPercentage: item.thc_percentage ? Number(item.thc_percentage) : undefined,
        expirationDate: item.expiration_date,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))

      return {
        success: true,
        data: products,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await db.getClient().from("products").select("*").eq("id", id).single()

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      if (!data) {
        return {
          success: false,
          error: "Product not found",
        }
      }

      const product: Product = {
        id: data.id,
        name: data.name || "Unknown Product",
        sku: data.sku || "Unknown SKU",
        category: data.category || "Unknown",
        brand: data.brand || "Unknown Brand",
        price: Number(data.price) || 0,
        cost: data.cost ? Number(data.cost) : undefined,
        inventoryCount: data.inventory_count ? Number(data.inventory_count) : undefined,
        batchId: data.batch_id,
        thcPercentage: data.thc_percentage ? Number(data.thc_percentage) : undefined,
        expirationDate: data.expiration_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }

      return {
        success: true,
        data: product,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

export const productService = new ProductService()
