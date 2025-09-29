"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Eye, TrendingUp, Trash2 } from "lucide-react"
import type { Product } from "@/lib/types"
import { ProductInfo } from "../molecules/product-info"
import { BrandCategory } from "../molecules/brand-category"
import { PriceDisplay } from "../atoms/price-display"
import { InventoryDisplay } from "../molecules/inventory-display"
import { ExpirationDisplay } from "../molecules/expiration-display"
import { StatusBadge } from "../atoms/status-badge"

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <span>No products found matching your criteria.</span>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Brand & Category</TableHead>
          <TableHead>Pricing</TableHead>
          <TableHead>Inventory</TableHead>
          <TableHead>THC %</TableHead>
          <TableHead>Expiration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <ProductInfo product={product} />
            </TableCell>
            <TableCell>
              <BrandCategory brand={product.brand} category={product.category} />
            </TableCell>
            <TableCell>
              <PriceDisplay price={product.price} cost={product.cost} showMargin={true} />
            </TableCell>
            <TableCell>
              <InventoryDisplay count={product.inventoryCount || 0} />
            </TableCell>
            <TableCell>
              {product.thcPercentage ? (
                <div className="font-medium">{product.thcPercentage}%</div>
              ) : (
                <span className="text-muted-foreground">N/A</span>
              )}
            </TableCell>
            <TableCell>
              <ExpirationDisplay expirationDate={product.expirationDate} />
            </TableCell>
            <TableCell>
              <StatusBadge product={product} />
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Price History
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => onDelete(product.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
