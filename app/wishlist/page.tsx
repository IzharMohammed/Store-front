// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Trash2, ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useWishlistStore } from "@/stores/wishlist-store";
// import { useCartStore } from "@/stores/cart-store";

// export default function WishlistPage() {
//   const { items, removeFromWishlist } = useWishlistStore();
//   const { addToCart } = useCartStore();
//   //   const { toast } = useToast()

//   const handleAddToCart = (item: any) => {
//     addToCart(item.product, 1);
//     // toast({
//     //   title: "Added to cart",
//     //   description: `${item.product.name} has been added to your cart`,
//     // })
//   };

//   const handleRemoveFromWishlist = (productId: string, productName: string) => {
//     removeFromWishlist(productId);
//     // toast({
//     //   title: "Removed from wishlist",
//     //   description: `${productName} has been removed from your wishlist`,
//     // })
//   };

//   if (items.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
//         <p className="text-muted-foreground mb-8">Your wishlist is empty</p>
//         <Link href="/products">
//           <Button>Continue Shopping</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">
//         Your Wishlist ({items.length} items)
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {items.map((item) => (
//           <Card key={item.id} className="group">
//             <CardContent className="p-4">
//               <Link href={`/product/${item.product.id}`}>
//                 <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
//                   <Image
//                     src={
//                       item.product.image ||
//                       "/placeholder.svg?height=300&width=300"
//                     }
//                     alt={item.product.name}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform"
//                   />
//                 </div>
//               </Link>

//               <div className="space-y-2">
//                 <Link href={`/product/${item.product.id}`}>
//                   <h3 className="font-semibold truncate hover:text-primary">
//                     {item.product.name}
//                   </h3>
//                 </Link>
//                 <p className="text-sm text-muted-foreground">
//                   {item.product.category}
//                 </p>
//                 <p className="font-bold text-lg">${item.product.price}</p>

//                 <div className="flex gap-2 pt-2">
//                   <Button
//                     onClick={() => handleAddToCart(item)}
//                     disabled={item.product.stock === 0}
//                     className="flex-1"
//                     size="sm"
//                   >
//                     <ShoppingCart className="w-4 h-4 mr-2" />
//                     Add to Cart
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       handleRemoveFromWishlist(
//                         item.product.id,
//                         item.product.name
//                       )
//                     }
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { ApiResponse, WishlistItem, WishlistResponse } from "@/types";

const createWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

const removeWishlistSchema = z.object({
  id: z.string().min(1, "Wishlist item ID is required"),
});

type CreateWishlistData = z.infer<typeof createWishlistSchema>;
type RemoveWishlistData = z.infer<typeof removeWishlistSchema>;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);

  // Fetch wishlist query
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistResponse> => {
      const response = await fetch("/api/v1/wishlist", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      return response.json();
    },
  });
  console.log("wishlistData", wishlistData);

  const wishlistItems = wishlistData?.data || [];

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (itemId: string): Promise<ApiResponse> => {
      const response = await fetch(`/api/v1/wishlist/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from wishlist");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      alert("Item removed from wishlist!");
    },
    onError: (error: any) => {
      console.error("Remove from wishlist failed:", error);
      alert(`Failed to remove: ${error.message || "Something went wrong"}`);
    },
  });

  const handleRemoveFromWishlist = (itemId: string) => {
    if (
      confirm("Are you sure you want to remove this item from your wishlist?")
    ) {
      removeFromWishlistMutation.mutate(itemId);
    }
  };

  const handleAddToCart = (product: WishlistItem["product"]) => {
    // Add your cart logic here
    alert(`Added ${product.name} to cart!`);
  };

  if (wishlistLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlistItems.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start adding products you love to your wishlist. You can save items
            for later and never lose track of them.
          </p>
          <Link href="/products">
            <Button>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600 mt-2">Items you've saved for later</p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {wishlistData?.count || 0}{" "}
          {wishlistData?.count === 1 ? "item" : "items"}
        </Badge>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {wishlistItems.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card className="group hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.product.image || "/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={removeFromWishlistMutation.isPending}
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 hover:underline">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-semibold">
                      ${item.product.price.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.product.category}
                    </Badge>
                  </div>

                  {item.product.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {item.product.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleAddToCart(item.product)}
                      className="flex-1"
                      size="sm"
                      disabled={item.product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {item.product.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <Link href="/products">
          <Button variant="outline" size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
