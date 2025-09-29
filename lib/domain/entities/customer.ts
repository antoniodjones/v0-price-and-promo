export class CustomerEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly tier: "A" | "B" | "C",
    public readonly market: string,
    public readonly status: "active" | "inactive",
    public readonly totalPurchases?: number,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}

  get isPremiumTier(): boolean {
    return this.tier === "A"
  }

  get isActive(): boolean {
    return this.status === "active"
  }

  canReceiveDiscount(brand: string): boolean {
    return this.isPremiumTier && this.isActive && (brand === "Premium Buds" || brand === "Green Valley")
  }

  getDiscountPercentage(): number {
    switch (this.tier) {
      case "A":
        return 8
      case "B":
        return 5
      case "C":
        return 2
      default:
        return 0
    }
  }
}
