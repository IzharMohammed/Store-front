"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
// import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types/index";
import { WishlistButton } from "./wishlist/wishlistButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartStore();
  // const { addToWishlist, removeFromWishlist, isInWishlist } =
  //   useWishlistStore();
  //   const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    // toast({
    //   title: "Added to cart",
    //   description: `${product.name} has been added to your cart`,
    // })
  };

  // const handleWishlistToggle = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (isInWishlist(product.id)) {
  //     removeFromWishlist(product.id);
  //     //   toast({
  //     //     title: "Removed from wishlist",
  //     //     description: `${product.name} has been removed from your wishlist`,
  //     //   })
  //   } else {
  //     addToWishlist(product);
  //     //   toast({
  //     //     title: "Added to wishlist",
  //     //     description: `${product.name} has been added to your wishlist`,
  //     //   })
  //   }
  // };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {product.stock === 0 && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              Out of Stock
            </Badge>
          )}
          {/* <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`w-4 h-4 ${
                isInWishlist(product.id) ? "fill-current text-red-500" : ""
              }`}
            />
          </Button> */}
          <WishlistButton productId={product.id} />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold truncate hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <Badge variant="outline">{product.stock} left</Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
