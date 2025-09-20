import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create sample customers
  const customer1 = await prisma.customer.upsert({
    where: { email: "orders@greenvalley.com" },
    update: {},
    create: {
      name: "Green Valley Dispensary",
      email: "orders@greenvalley.com",
      tier: "A",
      market: "Illinois",
      status: "ACTIVE",
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { email: "purchasing@urbanleaf.com" },
    update: {},
    create: {
      name: "Urban Leaf Co",
      email: "purchasing@urbanleaf.com",
      tier: "B",
      market: "Pennsylvania",
      status: "ACTIVE",
    },
  })

  // Create sample products
  const product1 = await prisma.product.upsert({
    where: { sku: "GTI-OGK-001" },
    update: {},
    create: {
      name: "Premium OG Kush",
      sku: "GTI-OGK-001",
      category: "Flower",
      subCategory: "Indoor",
      brand: "Rythm",
      thcPercentage: 24.5,
      basePrice: 45.0,
      expirationDate: new Date("2024-06-15"),
      batchId: "BATCH-001",
      status: "ACTIVE",
    },
  })

  const product2 = await prisma.product.upsert({
    where: { sku: "GTI-BDC-002" },
    update: {},
    create: {
      name: "Blue Dream Cartridge",
      sku: "GTI-BDC-002",
      category: "Vape",
      subCategory: "Cartridge",
      brand: "Dogwalkers",
      thcPercentage: 85.2,
      basePrice: 35.0,
      expirationDate: new Date("2024-12-31"),
      batchId: "BATCH-002",
      status: "ACTIVE",
    },
  })

  // Create sample customer discount
  const customerDiscount = await prisma.customerDiscount.create({
    data: {
      name: "A-Tier Flower Discount",
      type: "PERCENTAGE",
      value: 8.0,
      level: "CATEGORY",
      target: "Flower",
      markets: ["Illinois", "Pennsylvania"],
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      status: "ACTIVE",
      assignments: {
        create: {
          customerId: customer1.id,
          customerTier: "A",
        },
      },
    },
  })

  // Create sample inventory discount
  const inventoryDiscount = await prisma.inventoryDiscount.create({
    data: {
      name: "Expiration Auto Discount",
      type: "EXPIRATION",
      triggerValue: 30, // 30 days before expiration
      discountType: "PERCENTAGE",
      discountValue: 20.0,
      scope: "ALL",
      status: "ACTIVE",
    },
  })

  // Create sample BOGO promotion
  const bogoPromotion = await prisma.bogoPromotion.create({
    data: {
      name: "Vape BOGO 50% Off",
      type: "PERCENTAGE",
      triggerLevel: "CATEGORY",
      triggerValue: "Vape",
      rewardType: "PERCENTAGE",
      rewardValue: 50.0,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-03-31"),
      status: "ACTIVE",
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log(`Created customers: ${customer1.name}, ${customer2.name}`)
  console.log(`Created products: ${product1.name}, ${product2.name}`)
  console.log(`Created discounts and promotions`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
