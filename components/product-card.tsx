"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { useWishlistStore } from "@/stores/wishlist-store"
import { formatCurrency } from "@/lib/format"
import type { ProductWithMeta } from "@/types"

export function ProductCard({ product }: { product: ProductWithMeta }) {
  const add = useCartStore((s) => s.add)
  const { toggle, has } = useWishlistStore()
  const inWishlist = has(product.id)

  return (
    <Card className="group h-full flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block overflow-hidden rounded-t-lg">
          <Image
            src={product.image ?? "/placeholder.svg?height=400&width=400&query=product%20photo"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-48 sm:h-56 object-cover transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${product.id}`} className="font-medium hover:underline line-clamp-1">
            {product.name}
          </Link>
          <button
            aria-label="Add to wishlist"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toggle(product)}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-foreground" : ""}`} />
          </button>
        </div>
        <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-semibold">{formatCurrency(product.price)}</div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <Star className="h-4 w-4 fill-foreground" />
            <span>{product.avgRating?.toFixed(1) ?? "5.0"}</span>
            <span className="text-muted-foreground">({product.reviewCount ?? 0})</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => add(product, 1)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  )
}
