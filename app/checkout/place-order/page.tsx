"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionManager } from "@/lib/session-manager";

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
  price: number;
  description: string;
  imageUrl?: string;
}

interface OrderResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, sessionType } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrderData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerEmail: isAuthenticated ? user?.email || "" : "",
      customerName: isAuthenticated ? user?.name || "" : "",
      customerPhone: "",
      shippingAddress: "",
      total: 0,
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items to calculate total
  const watchedItems = watch("items");

  // Calculate total whenever items change
  useEffect(() => {
    const total = watchedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setValue("total", total);
  }, [watchedItems, setValue]);

  // Fetch available products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const response = await sessionManager.apiRequest<{ data: Product[] }>(
        "/api/v1/products"
      );
      return response.data;
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderData): Promise<OrderResponse> => {
      const response = await sessionManager.apiRequest<OrderResponse>(
        "/api/v1/order",
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // Show success message
      alert("Order placed successfully!");

      // Redirect to orders page or success page
      router.push("/orders");
    },
    onError: (error: any) => {
      console.error("Order creation failed:", error);
      alert(`Order failed: ${error.message || "Something went wrong"}`);
    },
  });

  // Add product to order
  const addProduct = (product: Product) => {
    const existingIndex = fields.findIndex(
      (field) => field.productId === product.id
    );

    if (existingIndex >= 0) {
      // Update quantity if product already exists
      const existingItem = watchedItems[existingIndex];
      update(existingIndex, {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      });
    } else {
      // Add new product
      append({
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  // Remove product from order
  const removeProduct = (index: number) => {
    const removedItem = fields[index];
    remove(index);
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== removedItem.productId)
    );
  };

  // Submit form
  const onSubmit = async (data: CreateOrderData) => {
    if (data.items.length === 0) {
      alert("Please add at least one product to your order");
      return;
    }

    createOrderMutation.mutate(data);
  };

  const getProductById = (productId: string): Product | undefined => {
    return (
      selectedProducts.find((p) => p.id === productId) ||
      products?.find((p) => p.id === productId)
    );
  };

  if (productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (orders.length === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-16 text-center">
  //       <h1 className="text-2xl font-bold mb-4">My Orders</h1>
  //       <p className="text-muted-foreground">
  //         You haven't placed any orders yet.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    // <div className="container mx-auto px-4 py-8">
    //   <h1 className="text-2xl font-bold mb-6">My Orders</h1>
    //   <div className="space-y-4">
    //     {orders.map((order) => (
    //       <Card key={order.id}>
    //         <CardHeader>
    //           <div className="flex justify-between items-start">
    //             <div>
    //               <CardTitle className="text-lg">
    //                 Order #{order.id.slice(-8)}
    //               </CardTitle>
    //               <p className="text-sm text-muted-foreground">
    //                 Placed on {formatDate(order.createdAt)}
    //               </p>
    //             </div>
    //             <Badge
    //               variant={
    //                 order.status === "DELIVERED"
    //                   ? "default"
    //                   : order.status === "SHIPPED"
    //                   ? "secondary"
    //                   : order.status === "CANCELLED"
    //                   ? "destructive"
    //                   : "outline"
    //               }
    //             >
    //               {order.status}
    //             </Badge>
    //           </div>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="space-y-4">
    //             <div className="space-y-2">
    //               {order.items.map((item) => (
    //                 <div
    //                   key={item.id}
    //                   className="flex justify-between items-center"
    //                 >
    //                   <div>
    //                     <p className="font-medium">{item.product.name}</p>
    //                     <p className="text-sm text-muted-foreground">
    //                       Quantity: {item.quantity} × ${item.price}
    //                     </p>
    //                   </div>
    //                   <p className="font-medium">
    //                     ${(item.quantity * item.price).toFixed(2)}
    //                   </p>
    //                 </div>
    //               ))}
    //             </div>
    //             <div className="flex justify-between items-center pt-4 border-t">
    //               <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
    //               <div className="space-x-2">
    //                 <Button variant="outline" size="sm">
    //                   View Details
    //                 </Button>
    //                 {order.status === "DELIVERED" && (
    //                   <Button size="sm">Reorder</Button>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
          <p className="mt-2 text-gray-600">
            Session Type:{" "}
            <span className="font-semibold capitalize">{sessionType}</span>
            {isAuthenticated && user && (
              <span className="ml-4">Welcome, {user.name}!</span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Available Products</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.description}
                        </p>
                        <p className="text-lg font-semibold text-green-600 mt-2">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProduct(product)}
                        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Controller
                      name="customerName"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your full name"
                        />
                      )}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Controller
                      name="customerEmail"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your email"
                        />
                      )}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Controller
                      name="customerPhone"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your phone number"
                        />
                      )}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address
                    </label>
                    <Controller
                      name="shippingAddress"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your complete shipping address"
                        />
                      )}
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shippingAddress.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>

                {fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items in your order yet.</p>
                    <p className="text-sm">
                      Select products from the left to add them to your order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      const product = getProductById(field.productId);
                      return (
                        <div
                          key={field.id}
                          className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {product?.name || "Unknown Product"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${field.price.toFixed(2)} each
                            </p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Quantity
                              </label>
                              <Controller
                                name={`items.${index}.quantity`}
                                control={control}
                                render={({ field: quantityField }) => (
                                  <input
                                    {...quantityField}
                                    type="number"
                                    min="1"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}
                              />
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                Subtotal
                              </p>
                              <p className="font-semibold text-green-600">
                                $
                                {(
                                  field.price * watchedItems[index]?.quantity ||
                                  0
                                ).toFixed(2)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeProduct(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {errors.items && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.items.message}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Items ({fields.length})
                    </span>
                    <span>${watch("total").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">
                      ${watch("total").toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    createOrderMutation.isPending ||
                    fields.length === 0
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || createOrderMutation.isPending
                    ? "Placing Order..."
                    : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
