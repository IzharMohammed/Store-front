"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  //   const { toast } = useToast()

  const handleAddToCart = (item: any) => {
    addToCart(item.product, 1);
    // toast({
    //   title: "Added to cart",
    //   description: `${item.product.name} has been added to your cart`,
    // })
  };

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    // toast({
    //   title: "Removed from wishlist",
    //   description: `${productName} has been removed from your wishlist`,
    // })
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-8">Your wishlist is empty</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Your Wishlist ({items.length} items)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group">
            <CardContent className="p-4">
              <Link href={`/product/${item.product.id}`}>
                <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={
                      item.product.image ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              </Link>

              <div className="space-y-2">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-semibold truncate hover:text-primary">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.product.category}
                </p>
                <p className="font-bold text-lg">${item.product.price}</p>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.stock === 0}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleRemoveFromWishlist(
                        item.product.id,
                        item.product.name
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
