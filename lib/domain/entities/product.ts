export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sku: string,
    public readonly category: string,
    public readonly brand: string,
    public readonly price: number,
    public readonly cost?: number,
    public readonly inventoryCount?: number,
    public readonly batchId?: string,
    public readonly thcPercentage?: number,
    public readonly expirationDate?: string,
    public readonly createdAt?: string,
    public readonly updatedAt?: string,
  ) {}

  get margin(): number {
    if (!this.cost) return 0
    return ((this.price - this.cost) / this.price) * 100
  }

  get isLowStock(): boolean {
    return (this.inventoryCount || 0) < 10
  }

  get isExpiringSoon(): boolean {
    if (!this.expirationDate) return false
    const expirationDate = new Date(this.expirationDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expirationDate <= thirtyDaysFromNow
  }

  get isHighTHC(): boolean {
    return (this.thcPercentage || 0) >= 20
  }

  get isLowTHC(): boolean {
    return (this.thcPercentage || 0) < 15
  }

  get status(): "active" | "low_stock" | "expiring_soon" | "out_of_stock" {
    if ((this.inventoryCount || 0) === 0) return "out_of_stock"
    if (this.isLowStock) return "low_stock"
    if (this.isExpiringSoon) return "expiring_soon"
    return "active"
  }

  canApplyExpirationDiscount(): boolean {
    if (!this.expirationDate) return false
    const daysToExpiration = Math.ceil(
      (new Date(this.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    return daysToExpiration <= 30 && daysToExpiration > 0
  }

  canApplyLowTHCDiscount(): boolean {
    return this.category === "Flower" && this.isLowTHC
  }
}
