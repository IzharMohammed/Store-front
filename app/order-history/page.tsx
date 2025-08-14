"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    description: string;
  };
}

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  store?: {
    id: string;
    name: string;
  };
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  count: number;
  message: string;
}

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

export default function OrderHistoryPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery<OrdersResponse>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/v1/order", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const orders = ordersData?.data || [];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              Failed to Load Orders
            </h2>
            <p className="text-muted-foreground mb-4">
              {(error as Error).message}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Package className="h-8 w-8" />
            Order History
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your orders and view order details
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card className="max-w-md mx-auto">
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your
                  orders here!
                </p>
                <Button
                  onClick={() =>
                    (window.location.href = "/checkout/place-order")
                  }
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Your Orders ({orders.length})
                </h2>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-sm">
                            Order #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Items: {order.items.length}
                          </span>
                          <span className="font-semibold text-green-600">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.customerName}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {order.customerPhone}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Order Details */}
            <motion.div variants={itemVariants}>
              {selectedOrder ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Order Details</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">Order Information</h3>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Order ID:</span> #
                          {selectedOrder.id.slice(-8)}
                        </p>
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                        <p>
                          <span className="font-medium">Total:</span>{" "}
                          <span className="text-green-600 font-semibold">
                            ${selectedOrder.total.toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold">Customer Information</h3>
                      <div className="text-sm space-y-2">
                        <p className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {selectedOrder.customerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {selectedOrder.customerPhone}
                        </p>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{selectedOrder.shippingAddress}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">
                        Order Items ({selectedOrder.items.length})
                      </h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item, index) => (
                          <div
                            key={index}
                            className="bg-muted/50 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {item.product?.name || "Unknown Product"}
                                </p>
                                {item.product?.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {item.product.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Qty: {item.quantity}</span>
                                  <span>Price: ${item.price.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-sm">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Store Info */}
                    {selectedOrder.store && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Store Information</h3>
                        <p className="text-sm">{selectedOrder.store.name}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Select an Order
                    </h3>
                    <p className="text-muted-foreground">
                      Click on an order from the list to view its details
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
