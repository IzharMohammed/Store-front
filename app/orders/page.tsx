import React from "react";
import { Order } from "@/types";
import { getOrders } from "@/actions/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { OrderExpandToggle } from "@/components/order/order-expand-toggle";
import { RefreshOrdersButton } from "@/components/order/refresh-orders-button";

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  PROCESSING:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  SHIPPED:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  DELIVERED:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  CANCELLED:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
};

const statusIcons = {
  PENDING: "⏳",
  PROCESSING: "🔄",
  SHIPPED: "🚚",
  DELIVERED: "✅",
  CANCELLED: "❌",
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

// Order Item Component
interface OrderItemProps {
  item: any;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border">
      {(item.productImage || item.product?.image) && (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted">
          <img
            src={item.productImage || item.product?.image}
            alt={item.productName || item.product?.name || "Product"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <h5 className="font-medium text-foreground">
          {item.productName || item.product?.name || "Unknown Product"}
        </h5>
        <p className="text-sm text-muted-foreground">
          Quantity: {item.quantity} × ${item.price.toFixed(2)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-foreground">
          ${(item.quantity * item.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Order Card Component
interface OrderCardProps {
  order: Order;
  index: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, index }) => {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
      <CardContent className="p-6">
        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xl text-white">
                  {statusIcons[order.status]}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className={`px-3 py-1 text-sm font-medium ${
                statusColors[order.status]
              }`}
            >
              {order.status}
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${order.total.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <OrderExpandToggle orderId={order.id} />
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-3">
          {order.items.slice(0, 2).map((item, itemIndex) => (
            <OrderItem key={item.id} item={item} />
          ))}

          {order.items.length > 2 && (
            <div className="text-center p-2 text-sm text-muted-foreground bg-muted/30 rounded-lg">
              +{order.items.length - 2} more item
              {order.items.length - 2 !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h4>
            <div className="space-y-2 text-sm">
              {order.customerName && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span>{order.customerName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span>{order.customerEmail}</span>
              </div>
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h4>
            <p className="text-sm text-muted-foreground">
              {formatAddress(order.shippingAddress)}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <div className="text-right">
            <div className="flex justify-between items-center mb-2 min-w-[200px]">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">
                $
                {order.items
                  .reduce((sum, item) => sum + item.quantity * item.price, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2">
              <span>Total:</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty State Component
const EmptyOrders: React.FC = () => {
  return (
    <div className="text-center p-8 max-w-md mx-auto">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-4">No Orders Yet</h2>
      <p className="text-muted-foreground mb-6">
        You haven't placed any orders yet. Start shopping to see your orders
        here!
      </p>
      <Button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
        asChild
      >
        <Link href="/products">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Start Shopping
        </Link>
      </Button>
    </div>
  );
};

// Loading State Component
const OrdersLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    </div>
  );
};

// Error State Component
interface OrdersErrorProps {
  error: Error;
}

const OrdersError: React.FC<OrdersErrorProps> = ({ error }) => {
  return (
    <div className="text-center p-8 max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Failed to Load Orders
      </h2>
      <p className="text-muted-foreground mb-6">
        We encountered an error while fetching your orders. Please try again.
      </p>
      <RefreshOrdersButton />
    </div>
  );
};

// Main Orders Page Component
export default async function OrdersPage() {
  try {
    const ordersData = await getOrders();
    const orders = ordersData?.data || [];

    if (!orders.length) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <EmptyOrders />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
              </div>
            </div>
            <p className="text-muted-foreground">
              You have {ordersData.count} order
              {ordersData.count !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order, index) => (
              //@ts-ignore
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>

          {/* Refresh Button */}
          <div className="text-center mt-8">
            <RefreshOrdersButton />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <OrdersError error={error as Error} />
        </div>
      </div>
    );
  }
}
