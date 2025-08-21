// "use client";

// import type React from "react";

// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Heart, ShoppingCart, Star } from "lucide-react";
// import { useCartStore } from "@/stores/cart-store";
// // import { useWishlistStore } from "@/stores/wishlist-store";
// // import { useToast } from "@/hooks/use-toast"
// import type { Product } from "@/types/index";
// import { WishlistButton } from "./wishlist/wishlistButton";
// import AddToCartButton from "./cart/AddToCartButton";

// interface ProductCardProps {
//   product: Product;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const { addToCart } = useCartStore();
//   // const { addToWishlist, removeFromWishlist, isInWishlist } =
//   //   useWishlistStore();
//   //   const { toast } = useToast()

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     addToCart(product, 1);
//     // toast({
//     //   title: "Added to cart",
//     //   description: `${product.name} has been added to your cart`,
//     // })
//   };

//   // const handleWishlistToggle = (e: React.MouseEvent) => {
//   //   e.preventDefault();
//   //   if (isInWishlist(product.id)) {
//   //     removeFromWishlist(product.id);
//   //     //   toast({
//   //     //     title: "Removed from wishlist",
//   //     //     description: `${product.name} has been removed from your wishlist`,
//   //     //   })
//   //   } else {
//   //     addToWishlist(product);
//   //     //   toast({
//   //     //     title: "Added to wishlist",
//   //     //     description: `${product.name} has been added to your wishlist`,
//   //     //   })
//   //   }
//   // };

//   return (
//     <Card className="group hover:shadow-lg transition-shadow">
//       <Link href={`/product/${product.id}`}>
//         <div className="aspect-square relative overflow-hidden rounded-t-lg">
//           <Image
//             src={product.image || "/placeholder.svg?height=300&width=300"}
//             alt={product.name}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform"
//           />
//           {product.stock === 0 && (
//             <Badge className="absolute top-2 left-2" variant="destructive">
//               Out of Stock
//             </Badge>
//           )}
//           {/* <Button
//             variant="ghost"
//             size="icon"
//             className="absolute top-2 right-2 bg-white/80 hover:bg-white"
//             onClick={handleWishlistToggle}
//           >
//             <Heart
//               className={`w-4 h-4 ${
//                 isInWishlist(product.id) ? "fill-current text-red-500" : ""
//               }`}
//             />
//           </Button> */}
//           <div className="absolute top-2 right-2">
//             <WishlistButton
//               productId={product.id}
//               variant="ghost"
//               size="default"
//               className="bg-white/80 hover:bg-white"
//             />
//           </div>
//         </div>
//       </Link>

//       <CardContent className="p-4">
//         <Link href={`/product/${product.id}`}>
//           <h3 className="font-semibold truncate hover:text-primary">
//             {product.name}
//           </h3>
//         </Link>
//         <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
//         <div className="flex items-center gap-1 mb-2">
//           {[...Array(5)].map((_, i) => (
//             <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//           ))}
//           <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-lg font-bold">${product.price}</span>
//           <Badge variant="outline">{product.stock} left</Badge>
//         </div>
//       </CardContent>

//       <CardFooter className="p-4 pt-0">
//         <AddToCartButton productId={product.id} productName={product.name} />
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";
import type { Product } from "@/types/index";
import { WishlistButton } from "./wishlist/wishlistButton";
import AddToCartButton from "./cart/AddToCartButton";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-500">
        {/* Product Image Container */}
        <div className="relative overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay gradient */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
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
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <WishlistButton
                productId={product.id}
                variant="ghost"
                size="sm"
                className="bg-white/90 hover:bg-white text-black border-0 shadow-lg backdrop-blur-sm"
              />
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          <Link href={`/product/${product.id}`}>
            <motion.h3
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-base leading-tight hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 line-clamp-2"
            >
              {product.name}
            </motion.h3>
          </Link>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text">
              {product.category}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">(4.5)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
            </motion.div>

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
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          initial={false}
        />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          whileHover={{
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
