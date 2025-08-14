"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { sessionManager } from "@/lib/session-manager";

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

const OrderHistoryPage: React.FC = () => {
  const {
    isAuthenticated,
    user,
    sessionType,
    isLoading: authLoading,
  } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error,
    refetch,
  } = useQuery<OrdersResponse>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await sessionManager.apiRequest<OrdersResponse>(
        "/api/v1/order"
      );
      return response;
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const orders = ordersData?.data || [];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">
            Please sign in to view your orders
          </h2>
          <p className="mb-6">
            You need to be logged in to access your order history.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4 text-red-600">
            Error loading orders
          </h2>
          <p className="mb-6">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No orders found</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    Order #{order.id.split("-")[0]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p>{order.shippingAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contact</h4>
                    <p>{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                    {order.customerPhone && <p>{order.customerPhone}</p>}
                  </div>
                  {order.store && (
                    <div>
                      <h4 className="font-medium mb-2">Store</h4>
                      <p>{order.store.name}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder?.id === order.id ? null : order
                    )
                  }
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {selectedOrder?.id === order.id
                    ? "Hide details"
                    : "View details"}
                </button>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start"
                        >
                          <div>
                            <p className="font-medium">
                              {item.product?.name ||
                                `Product ${item.productId}`}
                            </p>
                            {item.product?.description && (
                              <p className="text-sm text-gray-500">
                                {item.product.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p>
                              {item.quantity} × {formatCurrency(item.price)}
                            </p>
                            <p className="font-medium">
                              {formatCurrency(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
