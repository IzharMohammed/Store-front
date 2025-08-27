"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Calendar } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types/index";

interface OrderSummaryProps {
  order: Order;
}

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function OrderSummary({ order }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                {item.product.image ? (
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(item.quantity * item.price)}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <span className="font-medium">Total</span>
          <span className="font-bold">{formatCurrency(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
