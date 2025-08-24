"use client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const orderItemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image?: string;
    price: number;
  };
}

interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
  billingAddress?:
    | string
    | {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
  items: OrderItem[];
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  count: number;
  message: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: "⏳",
  PROCESSING: "🔄",
  SHIPPED: "🚚",
  DELIVERED: "✅",
  CANCELLED: "❌",
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrdersResponse> => {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_BACKEND_API_KEY!,
      };

      // Add user ID header if user is authenticated
      if (userData?.id) {
        headers["x-user-id"] = userData.id;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/order`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      return response.json();
    },
  });

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatAddress = (address: string | object): string => {
    if (typeof address === "string") {
      return address;
    }
    const addr = address as any;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[400px]"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Failed to Load Orders
          </h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while fetching your orders. Please try
            again.
          </p>
          <motion.button
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!ordersData?.data || ordersData.data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to see your orders
            here!
          </p>
          <motion.button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Shopping
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            You have {ordersData.count} order{ordersData.count !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {ordersData.data.map((order, index) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl">
                          {statusIcons[order.status]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full border text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{
                          rotate: expandedOrders.has(order.id) ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </motion.svg>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Expandable Order Details */}
              <AnimatePresence>
                {expandedOrders.has(order.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 space-y-6">
                      {/* Customer & Shipping Info */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">
                            Customer Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            {order.customerName && (
                              <p>
                                <span className="text-muted-foreground">
                                  Name:
                                </span>{" "}
                                {order.customerName}
                              </p>
                            )}
                            <p>
                              <span className="text-muted-foreground">
                                Email:
                              </span>{" "}
                              {order.customerEmail}
                            </p>
                            {order.customerPhone && (
                              <p>
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>{" "}
                                {order.customerPhone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">
                            Shipping Address
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatAddress(order.shippingAddress)}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-4">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <motion.div
                              key={item.id}
                              variants={orderItemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: itemIndex * 0.05 }}
                              className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg"
                            >
                              {(item.productImage || item.product?.image) && (
                                <img
                                  src={item.productImage || item.product?.image}
                                  alt={
                                    item.productName ||
                                    item.product?.name ||
                                    "Product"
                                  }
                                  className="w-16 h-16 object-cover rounded-lg border border-border"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium text-foreground">
                                  {item.productName ||
                                    item.product?.name ||
                                    "Unknown Product"}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity} × $
                                  {item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-end">
                          <div className="text-right">
                            <div className="flex justify-between items-center mb-2 min-w-[200px]">
                              <span className="text-muted-foreground">
                                Subtotal:
                              </span>
                              <span className="font-medium">
                                $
                                {order.items
                                  .reduce(
                                    (sum, item) =>
                                      sum + item.quantity * item.price,
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Refresh Button */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.button
            onClick={() => refetch()}
            className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Orders
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
