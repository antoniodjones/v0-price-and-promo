import type { ProductEntity } from "../entities/product"

export interface ProductRepository {
  findById(id: string): Promise<ProductEntity | null>
  findAll(page?: number, limit?: number): Promise<{ products: ProductEntity[]; total: number }>
  findByCategory(category: string): Promise<ProductEntity[]>
  findByBrand(brand: string): Promise<ProductEntity[]>
  findLowStock(threshold?: number): Promise<ProductEntity[]>
  findExpiringSoon(days?: number): Promise<ProductEntity[]>
  search(query: string): Promise<ProductEntity[]>
  save(product: ProductEntity): Promise<ProductEntity>
  delete(id: string): Promise<void>
}
