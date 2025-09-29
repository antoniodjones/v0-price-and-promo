import type { Product } from "@/lib/types"

interface ProductInfoProps {
  product: Product
  showBatch?: boolean
}

export function ProductInfo({ product, showBatch = true }: ProductInfoProps) {
  return (
    <div>
      <div className="font-medium">{product.name}</div>
      <div className="text-sm text-muted-foreground">{product.sku}</div>
      {showBatch && product.batchId && <div className="text-xs text-muted-foreground">Batch: {product.batchId}</div>}
    </div>
  )
}
