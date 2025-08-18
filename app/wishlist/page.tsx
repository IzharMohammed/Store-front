"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Minus,
  Plus,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import { z } from "zod";
import { ApiResponse, WishlistItem, WishlistResponse } from "@/types";

// Type-safe schemas
const createWishlistSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

const removeWishlistSchema = z.object({
  id: z.string().min(1, "Wishlist item ID is required"),
});

type CreateWishlistData = z.infer<typeof createWishlistSchema>;
type RemoveWishlistData = z.infer<typeof removeWishlistSchema>;

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (product: WishlistItem["product"]) => void;
  isRemoving: boolean;
}

interface OrderSummaryProps {
  items: WishlistItem[];
  itemCount: number;
}

// Smooth animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const summaryVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Wishlist item card component
const WishlistCard: React.FC<WishlistCardProps> = ({
  item,
  onRemove,
  onAddToCart,
  isRemoving,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleQuantityChange = (delta: number): void => {
    const newQuantity = Math.max(
      1,
      Math.min(item.product.stock || 999, quantity + delta)
    );
    setQuantity(newQuantity);
  };

  const totalPrice = item.product.price * quantity;

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      layout
      className="group"
    >
      <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product Image */}
            <div className="relative">
              <div className="w-full sm:w-24 h-48 sm:h-24 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={item.product.image || "/placeholder.jpg"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(item.id)}
                disabled={isRemoving}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-3 h-3" />
              </motion.button>
            </div>

            {/* Product Details */}
            <div className="flex-1 space-y-3">
              <div>
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.product.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700"
                >
                  {item.product.category}
                </Badge>
                {item.product.stock <= 5 && item.product.stock > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs animate-pulse"
                  >
                    Only {item.product.stock} left!
                  </Badge>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (item.product.stock || 999)}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-gray-600">
                  ${item.product.price.toFixed(2)} each
                </span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-4 sm:min-w-[120px]">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  ${totalPrice.toFixed(2)}
                </div>
                {quantity > 1 && (
                  <div className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)} × {quantity}
                  </div>
                )}
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  onClick={() => onAddToCart(item.product)}
                  disabled={item.product.stock === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {item.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Order Summary Component
const OrderSummary: React.FC<OrderSummaryProps> = ({ items, itemCount }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price, 0);
  const savings = subtotal * 0.15; // 15% savings example
  const total = subtotal - savings;

  return (
    <motion.div
      variants={summaryVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-8"
    >
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Wishlist Summary
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({itemCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>You save</span>
              <span>-${savings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-purple-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>Fast Ship</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>Quality</span>
            </div>
          </div>

          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add All to Cart
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <Button
              variant="outline"
              className="w-full border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              asChild
            >
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Loading skeleton
const WishlistSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="border border-gray-200">
        <CardContent className="p-6">
          <div className="flex gap-6 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
            <div className="text-right space-y-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Main component
export default function WishlistPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: Error) => {
      console.error("Remove from wishlist failed:", error);
    },
  });

  const handleRemoveFromWishlist = (itemId: string): void => {
    removeFromWishlistMutation.mutate(itemId);
  };

  const handleAddToCart = (product: WishlistItem["product"]): void => {
    // Add your cart logic here
    console.log(`Added ${product.name} to cart!`);
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
              </div>
              <WishlistSkeleton />
            </div>
            <div className="lg:col-span-1">
              <Card className="border border-gray-200">
                <CardContent className="p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="h-12 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!wishlistItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-200"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 mx-auto mb-8 bg-purple-100 rounded-full flex items-center justify-center"
            >
              <Heart className="w-12 h-12 text-purple-600" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h2>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
              Save items you love to your wishlist. Review them anytime and
              easily move them to your cart.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                asChild
              >
                <Link href="/products">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: -20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
              </div>
              <p className="text-gray-600">
                {wishlistData?.count || 0} items in your wishlist
              </p>
            </motion.div>

            {/* Wishlist Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                    isRemoving={removeFromWishlistMutation.isPending}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* You might also like section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  You might also like
                </h2>
              </div>
              <p className="text-gray-600 text-sm">
                Based on items in your wishlist
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={wishlistItems}
              itemCount={wishlistData?.count || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
