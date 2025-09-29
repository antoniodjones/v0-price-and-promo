interface InventoryDisplayProps {
  count: number
  lowStockThreshold?: number
}

export function InventoryDisplay({ count, lowStockThreshold = 10 }: InventoryDisplayProps) {
  return (
    <div>
      <div className="font-medium">{count} units</div>
      {count < lowStockThreshold && <div className="text-xs text-orange-600">Low stock</div>}
    </div>
  )
}
