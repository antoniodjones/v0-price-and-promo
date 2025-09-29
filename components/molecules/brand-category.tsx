interface BrandCategoryProps {
  brand: string
  category: string
}

export function BrandCategory({ brand, category }: BrandCategoryProps) {
  return (
    <div>
      <div className="font-medium">{brand}</div>
      <div className="text-sm text-muted-foreground">{category}</div>
    </div>
  )
}
