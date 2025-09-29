import { CustomerEntity } from "../../domain/entities/customer"
import type { CustomerRepository } from "../../domain/repositories/customer-repository"
import { db } from "../../services/database"

export class SupabaseCustomerRepository implements CustomerRepository {
  async findById(id: string): Promise<CustomerEntity | null> {
    const client = db.getClient()
    const { data, error } = await client.from("customers").select("*").eq("id", id).single()

    if (error || !data) return null

    return this.mapToEntity(data)
  }

  async findAll(page = 1, limit = 50): Promise<{ customers: CustomerEntity[]; total: number }> {
    const client = db.getClient()
    const skip = (page - 1) * limit

    const [{ data: customers, error: customersError }, { count: total, error: countError }] = await Promise.all([
      client
        .from("customers")
        .select("*")
        .range(skip, skip + limit - 1)
        .order("created_at", { ascending: false }),
      client.from("customers").select("*", { count: "exact", head: true }),
    ])

    if (customersError || countError) {
      throw new Error(customersError?.message || countError?.message || "Failed to fetch customers")
    }

    return {
      customers: (customers || []).map(this.mapToEntity),
      total: total || 0,
    }
  }

  async findByTier(tier: "A" | "B" | "C"): Promise<CustomerEntity[]> {
    const client = db.getClient()
    const { data, error } = await client.from("customers").select("*").eq("tier", tier).order("name")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async findByMarket(market: string): Promise<CustomerEntity[]> {
    const client = db.getClient()
    const { data, error } = await client.from("customers").select("*").eq("market", market).order("name")

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async search(query: string): Promise<CustomerEntity[]> {
    const client = db.getClient()
    const { data, error } = await client
      .from("customers")
      .select("*")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(20)

    if (error) throw new Error(error.message)

    return (data || []).map(this.mapToEntity)
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    const client = db.getClient()

    const customerData = {
      name: customer.name,
      email: customer.email,
      tier: customer.tier,
      market: customer.market,
      status: customer.status,
      total_purchases: customer.totalPurchases || 0,
      updated_at: new Date().toISOString(),
    }

    let data, error

    if (customer.id && customer.id !== "new") {
      // Update existing customer
      const result = await client.from("customers").update(customerData).eq("id", customer.id).select().single()

      data = result.data
      error = result.error
    } else {
      // Create new customer
      const result = await client
        .from("customers")
        .insert({ ...customerData, created_at: new Date().toISOString() })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) throw new Error(error.message)
    if (!data) throw new Error("Failed to save customer")

    return this.mapToEntity(data)
  }

  async delete(id: string): Promise<void> {
    const client = db.getClient()
    const { error } = await client.from("customers").delete().eq("id", id)

    if (error) throw new Error(error.message)
  }

  private mapToEntity(data: any): CustomerEntity {
    return new CustomerEntity(
      data.id,
      data.name,
      data.email,
      data.tier,
      data.market,
      data.status,
      data.total_purchases,
      data.created_at,
      data.updated_at,
    )
  }
}
