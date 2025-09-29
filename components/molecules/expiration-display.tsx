interface ExpirationDisplayProps {
  expirationDate?: string | null
}

export function ExpirationDisplay({ expirationDate }: ExpirationDisplayProps) {
  if (!expirationDate) {
    return <span className="text-muted-foreground">No expiration</span>
  }

  const date = new Date(expirationDate)
  const daysUntilExpiration = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  let textColor = "text-muted-foreground"
  if (daysUntilExpiration <= 7) {
    textColor = "text-red-600"
  } else if (daysUntilExpiration <= 30) {
    textColor = "text-orange-600"
  }

  return (
    <div>
      <div className="text-sm">{date.toLocaleDateString()}</div>
      <div className={`text-xs ${textColor}`}>{daysUntilExpiration} days left</div>
    </div>
  )
}
