import { prisma } from "../database"
import type { Customer, Product, CustomerDiscount, InventoryDiscount, BogoPromotion, BundleDeal } from "./types"

// Database service class using Prisma
class DatabaseService {
  // Customer methods
  async getCustomers(page = 1, limit = 10): Promise<{ data: Customer[]; total: number }> {
    const skip = (page - 1) * limit

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count(),
    ])

    return {
      data: customers.map(this.mapCustomerFromPrisma),
      total,
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        discountAssignments: {
          include: {
            customerDiscount: true,
          },
        },
      },
    })

    return customer ? this.mapCustomerFromPrisma(customer) : null
  }

  async createCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    const newCustomer = await prisma.customer.create({
      data: {
        name: customer.name,
        email: customer.email,
        tier: customer.tier as any,
        market: customer.market,
        status: customer.status as any,
      },
    })

    return this.mapCustomerFromPrisma(newCustomer)
  }

  // Product methods
  async getProducts(page = 1, limit = 10): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ])

    return {
      data: products.map(this.mapProductFromPrisma),
      total,
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    })

    return product ? this.mapProductFromPrisma(product) : null
  }

  async createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        category: product.category,
        subCategory: product.subCategory,
        brand: product.brand,
        thcPercentage: product.thcPercentage,
        basePrice: product.basePrice,
        expirationDate: new Date(product.expirationDate),
        batchId: product.batchId,
        status: product.status as any,
      },
    })

    return this.mapProductFromPrisma(newProduct)
  }

  // Customer Discount methods
  async getCustomerDiscounts(): Promise<CustomerDiscount[]> {
    const discounts = await prisma.customerDiscount.findMany({
      include: {
        assignments: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return discounts.map(this.mapCustomerDiscountFromPrisma)
  }

  async createCustomerDiscount(
    discount: Omit<CustomerDiscount, "id" | "createdAt" | "updatedAt">,
  ): Promise<CustomerDiscount> {
    const newDiscount = await prisma.customerDiscount.create({
      data: {
        name: discount.name,
        type: discount.type as any,
        value: discount.value,
        level: discount.level as any,
        target: discount.target,
        markets: discount.markets,
        startDate: new Date(discount.startDate),
        endDate: new Date(discount.endDate),
        status: discount.status as any,
      },
      include: {
        assignments: {
          include: {
            customer: true,
          },
        },
      },
    })

    return this.mapCustomerDiscountFromPrisma(newDiscount)
  }

  // Inventory Discount methods
  async getInventoryDiscounts(): Promise<InventoryDiscount[]> {
    const discounts = await prisma.inventoryDiscount.findMany({
      orderBy: { createdAt: "desc" },
    })

    return discounts.map(this.mapInventoryDiscountFromPrisma)
  }

  async createInventoryDiscount(
    discount: Omit<InventoryDiscount, "id" | "createdAt" | "updatedAt">,
  ): Promise<InventoryDiscount> {
    const newDiscount = await prisma.inventoryDiscount.create({
      data: {
        name: discount.name,
        type: discount.type as any,
        triggerValue: discount.triggerValue,
        discountType: discount.discountType as any,
        discountValue: discount.discountValue,
        scope: discount.scope as any,
        scopeValue: discount.scopeValue,
        status: discount.status as any,
      },
    })

    return this.mapInventoryDiscountFromPrisma(newDiscount)
  }

  // BOGO Promotion methods
  async getBogoPromotions(): Promise<BogoPromotion[]> {
    const promotions = await prisma.bogoPromotion.findMany({
      orderBy: { createdAt: "desc" },
    })

    return promotions.map(this.mapBogoPromotionFromPrisma)
  }

  async createBogoPromotion(promotion: Omit<BogoPromotion, "id" | "createdAt" | "updatedAt">): Promise<BogoPromotion> {
    const newPromotion = await prisma.bogoPromotion.create({
      data: {
        name: promotion.name,
        type: promotion.type as any,
        triggerLevel: promotion.triggerLevel as any,
        triggerValue: promotion.triggerValue,
        rewardType: promotion.rewardType as any,
        rewardValue: promotion.rewardValue,
        startDate: new Date(promotion.startDate),
        endDate: new Date(promotion.endDate),
        status: promotion.status as any,
      },
    })

    return this.mapBogoPromotionFromPrisma(newPromotion)
  }

  // Bundle Deal methods
  async getBundleDeals(): Promise<BundleDeal[]> {
    const bundles = await prisma.bundleDeal.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return bundles.map(this.mapBundleDealFromPrisma)
  }

  async createBundleDeal(bundle: Omit<BundleDeal, "id" | "createdAt" | "updatedAt">): Promise<BundleDeal> {
    const newBundle = await prisma.bundleDeal.create({
      data: {
        name: bundle.name,
        type: bundle.type as any,
        discountType: bundle.discountType as any,
        discountValue: bundle.discountValue,
        minQuantity: bundle.minQuantity,
        startDate: new Date(bundle.startDate),
        endDate: new Date(bundle.endDate),
        status: bundle.status as any,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return this.mapBundleDealFromPrisma(newBundle)
  }

  private mapCustomerFromPrisma(customer: any): Customer {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      tier: customer.tier.toLowerCase(),
      market: customer.market,
      status: customer.status.toLowerCase(),
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    }
  }

  private mapProductFromPrisma(product: any): Product {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      subCategory: product.subCategory,
      brand: product.brand,
      thcPercentage: product.thcPercentage,
      basePrice: product.basePrice,
      expirationDate: product.expirationDate.toISOString().split("T")[0],
      batchId: product.batchId,
      status: product.status.toLowerCase(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }
  }

  private mapCustomerDiscountFromPrisma(discount: any): CustomerDiscount {
    return {
      id: discount.id,
      name: discount.name,
      type: discount.type.toLowerCase(),
      value: discount.value,
      level: discount.level.toLowerCase(),
      target: discount.target,
      customerTiers: discount.assignments?.map((a: any) => a.customerTier.toLowerCase()) || [],
      markets: discount.markets,
      startDate: discount.startDate.toISOString(),
      endDate: discount.endDate.toISOString(),
      status: discount.status.toLowerCase(),
      createdAt: discount.createdAt.toISOString(),
      updatedAt: discount.updatedAt.toISOString(),
    }
  }

  private mapInventoryDiscountFromPrisma(discount: any): InventoryDiscount {
    return {
      id: discount.id,
      name: discount.name,
      type: discount.type.toLowerCase(),
      triggerValue: discount.triggerValue,
      discountType: discount.discountType.toLowerCase(),
      discountValue: discount.discountValue,
      scope: discount.scope.toLowerCase(),
      scopeValue: discount.scopeValue,
      status: discount.status.toLowerCase(),
      createdAt: discount.createdAt.toISOString(),
      updatedAt: discount.updatedAt.toISOString(),
    }
  }

  private mapBogoPromotionFromPrisma(promotion: any): BogoPromotion {
    return {
      id: promotion.id,
      name: promotion.name,
      type: promotion.type.toLowerCase(),
      triggerLevel: promotion.triggerLevel.toLowerCase(),
      triggerValue: promotion.triggerValue,
      rewardType: promotion.rewardType.toLowerCase(),
      rewardValue: promotion.rewardValue,
      startDate: promotion.startDate.toISOString(),
      endDate: promotion.endDate.toISOString(),
      status: promotion.status.toLowerCase(),
      createdAt: promotion.createdAt.toISOString(),
      updatedAt: promotion.updatedAt.toISOString(),
    }
  }

  private mapBundleDealFromPrisma(bundle: any): BundleDeal {
    return {
      id: bundle.id,
      name: bundle.name,
      type: bundle.type.toLowerCase(),
      products: bundle.items?.map((item: any) => item.productId) || [],
      discountType: bundle.discountType.toLowerCase(),
      discountValue: bundle.discountValue,
      minQuantity: bundle.minQuantity,
      startDate: bundle.startDate.toISOString(),
      endDate: bundle.endDate.toISOString(),
      status: bundle.status.toLowerCase(),
      createdAt: bundle.createdAt.toISOString(),
      updatedAt: bundle.updatedAt.toISOString(),
    }
  }
}

export const db = new DatabaseService()
