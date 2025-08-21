"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Minus,
  ShoppingCart,
  ChevronRight,
  Package,
  MapPin,
  User,
  Star,
  Heart,
  Eye,
  ArrowRight,
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Zod schemas matching your backend
const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

const createOrderSchema = z.object({
  customerEmail: z.string().email("Valid email is required"),
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  total: z.number().positive("Total must be positive"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
});

type CreateOrderData = z.infer<typeof createOrderSchema>;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category: string;
  status: "ACTIVE" | "INACTIVE";
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  count: number;
  message: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Enhanced Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
  },
};

export default function PlaceOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [pending, setPending] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);

  // Form setup matching your pattern
  const form = useForm<CreateOrderData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerEmail: "",
      customerName: "",
      customerPhone: "",
      shippingAddress: "",
      total: 0,
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch items to calculate total
  const watchedItems = form.watch("items");

  // Calculate total whenever items change
  useEffect(() => {
    const total = watchedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    form.setValue("total", total);
  }, [watchedItems, form]);

  // Fetch products query
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductsResponse> => {
      const response = await fetch("/api/v1/products", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const products = productsData?.data || [];

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderData): Promise<OrderResponse> => {
      const response = await fetch("/api/v1/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("Order placed successfully!");
      router.push("/orders");
    },
    onError: (error: any) => {
      console.error("Order creation failed:", error);
      alert(`Order failed: ${error.message || "Something went wrong"}`);
    },
  });

  // Add product to cart
  const addProductToCart = (product: Product) => {
    const existingIndex = fields.findIndex(
      (field) => field.productId === product.id
    );

    if (existingIndex >= 0) {
      const existingItem = watchedItems[existingIndex];
      if (existingItem.quantity < product.stock) {
        update(existingIndex, {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        });
      } else {
        alert(`Only ${product.stock} items available in stock`);
      }
    } else {
      if (product.stock > 0) {
        append({
          productId: product.id,
          quantity: 1,
          price: product.price,
        });
        setSelectedProducts((prev) => [...prev, product]);
        setCartVisible(true);
      } else {
        alert("Product out of stock");
      }
    }
  };

  // Remove product from cart
  const removeProductFromCart = (index: number) => {
    const removedItem = fields[index];
    remove(index);
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== removedItem.productId)
    );
  };

  // Update quantity
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromCart(index);
      return;
    }

    const item = watchedItems[index];
    const product = getProductById(item.productId);

    if (product && newQuantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    update(index, {
      ...item,
      quantity: newQuantity,
    });
  };

  const getProductById = (productId: string): Product | undefined => {
    return (
      selectedProducts.find((p) => p.id === productId) ||
      products.find((p) => p.id === productId)
    );
  };

  // Submit handler
  const onSubmit = async (data: CreateOrderData) => {
    if (data.items.length === 0) {
      alert("Please add at least one product to your order");
      return;
    }

    setPending(true);
    try {
      await createOrderMutation.mutateAsync(data);
    } finally {
      setPending(false);
    }
  };

  if (productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 mx-auto text-primary" />
          </motion.div>
          <p className="text-muted-foreground font-medium">
            Loading products...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-purple-50/50 to-pink-50/50 dark:from-primary/5 dark:via-purple-900/20 dark:to-pink-900/20 border-b"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto py-16 px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Badge
                variant="secondary"
                className="mb-4 px-4 py-2 text-sm font-medium"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Premium Shopping Experience
              </Badge>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-gray-100 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
            >
              Complete Your Order
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Discover premium products and enjoy a seamless shopping experience
              with secure checkout
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-8 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>Quality Guaranteed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Products Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="xl:col-span-3 space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center"
            >
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Featured Products
                </h2>
                <p className="text-muted-foreground mt-2">
                  {products.length} premium items available
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                onClick={() => setCartVisible(!cartVisible)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {cartVisible ? "Hide" : "Show"} Cart Preview
              </Button>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {products.map((product, index) => {
                  const inCart = fields.find(
                    (item) => item.productId === product.id
                  );
                  return (
                    <motion.div
                      key={product.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      layout
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-background to-muted/20 backdrop-blur transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <CardContent className="p-0 relative">
                          {/* Product Image */}
                          <div className="relative aspect-square w-full overflow-hidden">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.6 }}
                              className="h-full w-full"
                            >
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-muted via-muted/50 to-muted/20 flex items-center justify-center">
                                  <Package className="h-16 w-16 text-muted-foreground/50" />
                                </div>
                              )}
                            </motion.div>

                            {/* Overlay Elements */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Stock Badge */}
                            <motion.div
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="absolute top-4 left-4"
                            >
                              <Badge
                                className={cn(
                                  "font-medium shadow-lg",
                                  product.stock > 10
                                    ? "bg-green-500/90 hover:bg-green-500 text-white"
                                    : product.stock > 0
                                    ? "bg-amber-500/90 hover:bg-amber-500 text-white"
                                    : "bg-red-500/90 hover:bg-red-500 text-white"
                                )}
                              >
                                {product.stock > 0
                                  ? `${product.stock} left`
                                  : "Sold out"}
                              </Badge>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileHover={{ opacity: 1, y: 0 }}
                              className="absolute top-4 right-4 flex gap-2"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          </div>

                          {/* Product Info */}
                          <div className="p-6 space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                  {product.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-medium">
                                    4.8
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="text-2xl font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Free shipping included
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>

                            {/* Cart Controls */}
                            <div className="pt-2">
                              <AnimatePresence mode="wait">
                                {inCart ? (
                                  <motion.div
                                    key="cart-controls"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="space-y-3"
                                  >
                                    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                                      <div className="flex items-center gap-3">
                                        <motion.button
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                          onClick={() =>
                                            updateQuantity(
                                              fields.findIndex(
                                                (f) =>
                                                  f.productId === product.id
                                              ),
                                              inCart.quantity - 1
                                            )
                                          }
                                          className="h-8 w-8 rounded-full bg-background border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center transition-all"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </motion.button>

                                        <div className="text-center min-w-[3rem]">
                                          <div className="font-bold text-lg">
                                            {inCart.quantity}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            in cart
                                          </div>
                                        </div>

                                        <motion.button
                                          variants={buttonVariants}
                                          whileHover="hover"
                                          whileTap="tap"
                                          onClick={() =>
                                            addProductToCart(product)
                                          }
                                          disabled={
                                            inCart.quantity >= product.stock
                                          }
                                          className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center transition-all"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </motion.button>
                                      </div>

                                      <motion.button
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={() =>
                                          removeProductFromCart(
                                            fields.findIndex(
                                              (f) => f.productId === product.id
                                            )
                                          )
                                        }
                                        className="h-8 w-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="add-button"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                  >
                                    <Button
                                      onClick={() => addProductToCart(product)}
                                      disabled={product.stock === 0}
                                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-muted disabled:to-muted"
                                    >
                                      {product.stock === 0 ? (
                                        <>
                                          <Package className="mr-2 h-4 w-4" />
                                          Out of Stock
                                        </>
                                      ) : (
                                        <>
                                          <ShoppingCart className="mr-2 h-4 w-4" />
                                          Add to Cart
                                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                      )}
                                    </Button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            className="xl:col-span-1"
          >
            <div className="sticky top-4 space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Order Summary</CardTitle>
                      <CardDescription>Complete your purchase</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...form}>
                    <motion.form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Customer Info */}
                      <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <User className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">Customer Details</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="your@email.com"
                                  className="h-11 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="John Doe"
                                  className="h-11 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="+1 (555) 123-4567"
                                  className="h-11 bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Shipping Info */}
                      <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">Shipping Address</h3>
                        </div>

                        <FormField
                          control={form.control}
                          name="shippingAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Delivery Address
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="123 Main St, City, State ZIP"
                                  rows={3}
                                  className="bg-muted/30 border-0 focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <AnimatePresence>
                        {fields.length > 0 && (
                          <motion.div
                            variants={itemVariants}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div className="flex items-center gap-2 pb-2 border-b">
                              <ShoppingBag className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold">
                                Cart Items ({fields.length})
                              </h3>
                            </div>

                            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                              <AnimatePresence>
                                {fields.map((field, index) => {
                                  const product = getProductById(
                                    field.productId
                                  );
                                  return (
                                    <motion.div
                                      key={field.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      whileHover={{ scale: 1.02 }}
                                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur border hover:border-primary/20 transition-all"
                                    >
                                      <div className="relative h-12 w-12 min-w-[48px] rounded-md overflow-hidden bg-muted">
                                        {product?.image ? (
                                          <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                          />
                                        ) : (
                                          <Package className="h-full w-full p-2 text-muted-foreground" />
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="font-medium text-sm line-clamp-1">
                                          {product?.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-primary font-medium">
                                            ${field.price.toFixed(2)}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            ×{field.quantity}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() =>
                                            updateQuantity(
                                              index,
                                              field.quantity - 1
                                            )
                                          }
                                          className="h-6 w-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </motion.button>
                                        <span className="w-6 text-center text-xs font-medium">
                                          {field.quantity}
                                        </span>
                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() =>
                                            updateQuantity(
                                              index,
                                              field.quantity + 1
                                            )
                                          }
                                          disabled={
                                            field.quantity >=
                                            (product?.stock || 0)
                                          }
                                          className="h-6 w-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center transition-colors"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </motion.button>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Order Total */}
                      <motion.div
                        variants={itemVariants}
                        className="space-y-4 pt-4 border-t"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Subtotal ({fields.length} items)
                            </span>
                            <span className="font-medium">
                              ${form.watch("total").toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Shipping
                            </span>
                            <span className="text-green-600 font-medium">
                              Free
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">$0.00</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-primary">
                              ${form.watch("total").toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className={cn(
                            "w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-600/90 hover:to-pink-600/90 text-white shadow-xl hover:shadow-2xl transform transition-all duration-300",
                            pending && "opacity-70 cursor-not-allowed scale-95"
                          )}
                          disabled={pending || fields.length === 0}
                        >
                          {pending ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="mr-3"
                              >
                                <Loader2 className="h-5 w-5" />
                              </motion.div>
                              Processing Order...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-3 h-5 w-5" />
                              Complete Purchase
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="ml-3"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </motion.div>
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Trust Indicators */}
                      <motion.div
                        variants={itemVariants}
                        className="pt-4 space-y-3"
                      >
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="space-y-1">
                            <Shield className="h-4 w-4 mx-auto text-green-500" />
                            <p className="text-xs text-muted-foreground">
                              Secure
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Truck className="h-4 w-4 mx-auto text-blue-500" />
                            <p className="text-xs text-muted-foreground">
                              Free Ship
                            </p>
                          </div>
                          <div className="space-y-1">
                            <CheckCircle className="h-4 w-4 mx-auto text-purple-500" />
                            <p className="text-xs text-muted-foreground">
                              Guaranteed
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground leading-relaxed">
                          Your payment information is secured with 256-bit SSL
                          encryption
                        </p>
                      </motion.div>
                    </motion.form>
                  </Form>
                </CardContent>
              </Card>

              {/* Quick Cart Preview - Mobile Toggle */}
              <AnimatePresence>
                {cartVisible && fields.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="md:hidden"
                  >
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-purple-50/50 dark:to-purple-900/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            Cart Preview
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCartVisible(false)}
                            className="h-6 w-6 p-0"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {fields.slice(0, 3).map((field) => {
                            const product = getProductById(field.productId);
                            return (
                              <div
                                key={field.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                  <Package className="h-3 w-3" />
                                </div>
                                <div className="flex-1 truncate">
                                  <span className="font-medium">
                                    {product?.name}
                                  </span>
                                </div>
                                <span className="text-xs text-primary">
                                  ×{field.quantity}
                                </span>
                              </div>
                            );
                          })}
                          {fields.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center pt-2">
                              +{fields.length - 3} more items
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t z-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-bold text-lg text-primary">
                ${form.watch("total").toFixed(2)}
              </div>
            </div>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={pending || fields.length === 0}
              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              {pending ? "Processing..." : "Complete Order"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--primary)) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  );
}
