"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { useWishlist } from "./wishlist-provider"
import { formatCurrency } from "@/lib/format"

export type Product = {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  category?: string
}

const DEFAULT_PRODUCT: Product = {
  id: "demo",
  name: "Sample Product",
  price: 49.99,
  image: "/placeholder.svg?height=240&width=320",
  description: "A simple product for demo purposes.",
  category: "General",
}

export function ProductCard({ product = DEFAULT_PRODUCT }: { product?: Product } = { product: DEFAULT_PRODUCT }) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const wished = has(product.id)

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              src={product.image || "/placeholder.svg?height=240&width=320&query=clean%20minimal%20product"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="line-clamp-1 text-sm font-medium">{product.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{product.category ?? "Category"}</div>
          </div>
          <div className="text-sm font-semibold">{formatCurrency(product.price)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 p-4 pt-0">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() =>
            add({ id: product.id, name: product.name, price: product.price, image: product.image || "" }, 1)
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
        <Button
          variant={wished ? "secondary" : "outline"}
          size="icon"
          aria-label="Toggle wishlist"
          onClick={() => toggle({ id: product.id, name: product.name, price: product.price, image: product.image })}
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>
    </Card>
  )
}
