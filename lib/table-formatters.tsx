/**
 * Formats currency values consistently
 * Pure function with no side effects
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

/**
 * Formats percentage values consistently
 * Pure function with no side effects
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Formats dates consistently
 * Pure function with no side effects
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj)
}

/**
 * Formats datetime consistently
 * Pure function with no side effects
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

/**
 * Truncates long text with ellipsis
 * Pure function with no side effects
 */
export function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Formats status badges with consistent styling
 * Returns className string for badge styling
 */
export function getStatusBadgeClass(status: string): string {
  const statusLower = status.toLowerCase()

  if (statusLower === "active" || statusLower === "approved") {
    return "bg-green-100 text-green-800"
  }

  if (statusLower === "inactive" || statusLower === "rejected") {
    return "bg-red-100 text-red-800"
  }

  if (statusLower === "pending") {
    return "bg-yellow-100 text-yellow-800"
  }

  return "bg-gray-100 text-gray-800"
}
