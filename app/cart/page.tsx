"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
  Truck,
  Shield,
  CreditCard,
  ShoppingCart,
  Package,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
}

interface CartResponse {
  success: boolean;
  data: CartItem[];
  count: number;
  message: string;
}

interface RemoveFromCartResponse {
  success: boolean;
  message: string;
}

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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
};

export default function CartPage() {
  const queryClient = useQueryClient();

  // Fetch cart items
  const {
    data: cartData,
    isLoading: cartLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<CartResponse> => {
      const userData = JSON.parse(localStorage.getItem("user_data")!);

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        credentials: "include",
      };

      // Add custom headers if user is authenticated
      if (userData) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch("/api/v1/cart", {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      return response.json();
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartId: string): Promise<RemoveFromCartResponse> => {
      const response = await fetch("/api/v1/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from cart");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      console.error("Remove from cart failed:", error);
    },
  });

  const handleRemoveFromCart = (cartId: string) => {
    removeFromCartMutation.mutate(cartId);
  };

  // Loading State
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
            <span className="ml-4 text-lg text-muted-foreground">
              Loading your cart...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-red-500 text-lg mb-4">
              Error loading cart: {(error as Error).message}
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const cartItems = cartData?.data || [];
  console.log("cartItems", cartItems);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const savings = totalAmount * 0.15; // Mock savings
  const shipping = totalAmount > 100 ? 0 : 9.99;
  const finalTotal = totalAmount + shipping;

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
            >
              <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            </motion.div>

            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              exploring our amazing products!
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                asChild
              >
                <Link href="/products">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              {/* Quick suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
                {["Electronics", "Clothing", "Home & Garden"].map(
                  (category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-background to-muted/30">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-semibold mb-2">{category}</h3>
                          <p className="text-sm text-muted-foreground">
                            Explore {category.toLowerCase()}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Product Image */}
                          <motion.div
                            className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40 shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Image
                              src={
                                item.product.image ||
                                "/placeholder.svg?height=128&width=128"
                              }
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </motion.div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <Link href={`/product/${item.product.id}`}>
                                  <motion.h3
                                    className="font-bold text-lg md:text-xl hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer"
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {item.product.name}
                                  </motion.h3>
                                </Link>
                                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                  {item.product.description}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  disabled={removeFromCartMutation.isPending}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  ${item.product.price} each
                                </div>
                              </div>

                              {/* Total Price */}
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-right"
                              >
                                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                  $
                                  {(item.product.price * item.quantity).toFixed(
                                    2
                                  )}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4 border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {totalAmount < 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-2">
                      <Truck className="w-4 h-4" />
                      <span>
                        Add ${(100 - totalAmount).toFixed(2)} more for FREE
                        shipping!
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(totalAmount / 100) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Shield, text: "Secure" },
                    { icon: Truck, text: "Fast Ship" },
                    { icon: Star, text: "Quality" },
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Checkout Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg group"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </motion.div>

                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recently Viewed or Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                You might also like
              </h3>
              <p className="text-muted-foreground mb-6">
                Based on items in your cart
              </p>
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                Recommendations will appear here
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
