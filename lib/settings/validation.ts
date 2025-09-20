import type { SettingsData } from "./types"

export function validateSettings(settings: Partial<SettingsData>): string[] {
  const errors: string[] = []

  if (settings.discounts) {
    const { customerDiscountMax, inventoryDiscountMax, bundleDiscountMax, volumeDiscountMax } = settings.discounts
    const discounts = [
      { value: customerDiscountMax, name: "Customer discount" },
      { value: inventoryDiscountMax, name: "Inventory discount" },
      { value: bundleDiscountMax, name: "Bundle discount" },
      { value: volumeDiscountMax, name: "Volume discount" },
    ]

    discounts.forEach(({ value, name }) => {
      if (value && (value < 0 || value > 100)) {
        errors.push(`${name} must be between 0% and 100%`)
      }
    })
  }

  if (settings.pricing) {
    const { minimumMargin, bulkThreshold, premiumMarkup } = settings.pricing
    if (minimumMargin && (minimumMargin < 0 || minimumMargin > 100)) {
      errors.push("Minimum margin must be between 0% and 100%")
    }
    if (bulkThreshold && bulkThreshold < 1) {
      errors.push("Bulk threshold must be at least 1 unit")
    }
    if (premiumMarkup && (premiumMarkup < 0 || premiumMarkup > 200)) {
      errors.push("Premium markup must be between 0% and 200%")
    }
  }

  if (settings.expiration) {
    const { warningDays, criticalDays, warningDiscount, criticalDiscount } = settings.expiration
    if (warningDays && warningDays < 1) errors.push("Warning period must be at least 1 day")
    if (criticalDays && criticalDays < 1) errors.push("Critical period must be at least 1 day")
    if (warningDays && criticalDays && warningDays <= criticalDays) {
      errors.push("Warning period must be longer than critical period")
    }
    if (warningDiscount && (warningDiscount < 0 || warningDiscount > 100)) {
      errors.push("Warning discount must be between 0% and 100%")
    }
    if (criticalDiscount && (criticalDiscount < 0 || criticalDiscount > 100)) {
      errors.push("Critical discount must be between 0% and 100%")
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (settings.notifications) {
    const { lowMarginThreshold, reportEmail, approvalEmail } = settings.notifications
    if (lowMarginThreshold && (lowMarginThreshold < 0 || lowMarginThreshold > 100)) {
      errors.push("Low margin threshold must be between 0% and 100%")
    }
    if (reportEmail && !emailRegex.test(reportEmail)) {
      errors.push("Report email must be a valid email address")
    }
    if (approvalEmail && !emailRegex.test(approvalEmail)) {
      errors.push("Approval email must be a valid email address")
    }
  }

  // Additional validation rules would continue here...

  return errors
}
