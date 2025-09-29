export class DiscountRule {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: "customer" | "expiration" | "thc" | "volume" | "tiered",
    public readonly discountType: "percentage" | "dollar",
    public readonly discountValue: number,
    public readonly priority: number,
    public readonly reason: string,
    public readonly applicable: boolean,
    public readonly startDate?: string,
    public readonly endDate?: string,
    public readonly status: "active" | "inactive" = "active",
  ) {}

  calculateSavings(basePrice: number): number {
    if (!this.applicable || this.status !== "active") return 0

    if (this.discountType === "percentage") {
      return (basePrice * this.discountValue) / 100
    } else {
      return Math.min(this.discountValue, basePrice)
    }
  }

  isValid(): boolean {
    const now = new Date()

    if (this.startDate && new Date(this.startDate) > now) return false
    if (this.endDate && new Date(this.endDate) < now) return false

    return this.applicable && this.status === "active"
  }

  comparePriority(other: DiscountRule): number {
    // Lower priority number = higher priority
    return this.priority - other.priority
  }
}
