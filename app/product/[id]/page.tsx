"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { useProductStore } from "@/stores/product-store";
import { useCartStore } from "@/stores/cart-store";

export default function ProductDetailPage() {
  const params = useParams();
  const { products } = useProductStore();
  const { addToCart } = useCartStore();
  // const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  //   const { toast } = useToast()
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // toast({
    //   title: "Added to cart",
    //   description: `${product.name} has been added to your cart`,
    // })
  };

  // const handleWishlistToggle = () => {
  //   if (isInWishlist(product.id)) {
  //     removeFromWishlist(product.id)
  //   //   toast({
  //   //     title: "Removed from wishlist",
  //   //     description: `${product.name} has been removed from your wishlist`,
  //   //   })
  //   } else {
  //     addToWishlist(product)
  //   //   toast({
  //   //     title: "Added to wishlist",
  //   //     description: `${product.name} has been added to your wishlist`,
  //   //   })
  //   }
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.image || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (4.5) 123 reviews
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold">${product.price}</div>
            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              {/* <Button variant="outline" onClick={handleWishlistToggle}>
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </Button> */}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">{product.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
