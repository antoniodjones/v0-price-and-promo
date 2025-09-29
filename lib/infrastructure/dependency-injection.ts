import { SupabaseProductRepository } from "./repositories/supabase-product-repository"
import { SupabaseCustomerRepository } from "./repositories/supabase-customer-repository"
import { PricingDomainService } from "../domain/services/pricing-domain-service"
import type { ProductRepository } from "../domain/repositories/product-repository"
import type { CustomerRepository } from "../domain/repositories/customer-repository"

class DIContainer {
  private static instance: DIContainer
  private productRepository: ProductRepository
  private customerRepository: CustomerRepository
  private pricingService: PricingDomainService

  private constructor() {
    // Initialize repositories
    this.productRepository = new SupabaseProductRepository()
    this.customerRepository = new SupabaseCustomerRepository()

    // Initialize domain services
    this.pricingService = new PricingDomainService()
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  public getProductRepository(): ProductRepository {
    return this.productRepository
  }

  public getCustomerRepository(): CustomerRepository {
    return this.customerRepository
  }

  public getPricingService(): PricingDomainService {
    return this.pricingService
  }
}

export const container = DIContainer.getInstance()
