import type { CustomerEntity } from "../entities/customer"

export interface CustomerRepository {
  findById(id: string): Promise<CustomerEntity | null>
  findAll(page?: number, limit?: number): Promise<{ customers: CustomerEntity[]; total: number }>
  findByTier(tier: "A" | "B" | "C"): Promise<CustomerEntity[]>
  findByMarket(market: string): Promise<CustomerEntity[]>
  search(query: string): Promise<CustomerEntity[]>
  save(customer: CustomerEntity): Promise<CustomerEntity>
  delete(id: string): Promise<void>
}
