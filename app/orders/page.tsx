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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Plus, Minus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function PlaceOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [pending, setPending] = useState(false);

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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold">Place Your Order</h1>
          <p className="text-muted-foreground mt-2">
            Select products and fill in your details to place an order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Available Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {products.map((product) => {
                    const inCart = fields.find(
                      (item) => item.productId === product.id
                    );
                    return (
                      <Card key={product.id} className="relative">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-green-600">
                                ${product.price.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {product.stock}
                              </span>
                            </div>
                            {inCart ? (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  In cart: {inCart.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addProductToCart(product)}
                                  disabled={inCart.quantity >= product.stock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => addProductToCart(product)}
                                disabled={product.stock === 0}
                              >
                                {product.stock === 0
                                  ? "Out of Stock"
                                  : "Add to Cart"}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Form */}
          <motion.div variants={itemVariants}>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <motion.form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    variants={containerVariants}
                  >
                    {/* Customer Email */}
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Customer Name */}
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter your name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Customer Phone */}
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="customerPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your phone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Shipping Address */}
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Address</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Enter your address"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Cart Items */}
                    {fields.length > 0 && (
                      <motion.div variants={itemVariants} className="space-y-3">
                        <h3 className="font-semibold">Cart Items</h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {fields.map((field, index) => {
                            const product = getProductById(field.productId);
                            return (
                              <div
                                key={field.id}
                                className="flex items-center justify-between p-2 bg-muted rounded"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {product?.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${field.price} × {field.quantity} = $
                                    {(field.price * field.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateQuantity(index, field.quantity - 1)
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm">
                                    {field.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateQuantity(index, field.quantity + 1)
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Total */}
                    <motion.div
                      variants={itemVariants}
                      className="pt-4 border-t"
                    >
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">
                          ${form.watch("total").toFixed(2)}
                        </span>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        className={cn(
                          "w-full",
                          pending &&
                            "opacity-50 cursor-not-allowed pointer-events-none"
                        )}
                        disabled={pending || fields.length === 0}
                      >
                        {pending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
