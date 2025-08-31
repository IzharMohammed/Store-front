import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";
import type { Product } from "@/types/index";
import { WishlistButton } from "../wishlist/wishlistButton";
import AddToCartButton from "../cart/AddToCartButton";
import { getWishlistItems } from "@/actions/wishlist";

interface ProductCardProps {
  product: Product;
}

export async function ProductCard({ product }: ProductCardProps) {
  const wishlistData = await getWishlistItems();

  return (
    <div className="group">
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
        {/* Product Image Container */}
        <div className="relative overflow-hidden">
          <Link href={`/products/${product.id}`}>
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
              <div>
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </Link>

          {/* Stock Badge */}
          {product.stock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white border-0">
              Out of Stock
            </Badge>
          ) : product.stock <= 10 ? (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              {product.stock} left
            </Badge>
          ) : null}

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <div>
              <WishlistButton
                wishlistData={wishlistData}
                productId={product.id}
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white text-black border-0 shadow-lg backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-base leading-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text">
              {product.category}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
            </div>

            {product.stock > 0 && product.stock <= 10 && (
              <Badge
                variant="outline"
                className="text-xs border-orange-200 text-orange-600 bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-950/20"
              >
                Only {product.stock} left
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Footer with main CTA */}
        <CardFooter className="p-4 pt-0">
          <div className="w-full">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black dark:from-slate-200 dark:to-white dark:hover:from-white dark:hover:to-slate-100 dark:text-black border-0 shadow-lg transition-all duration-300"
            />
          </div>
        </CardFooter>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg pointer-events-none" />
      </Card>
    </div>
  );
}
