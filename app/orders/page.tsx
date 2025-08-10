"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useOrderStore } from "@/stores/order-store"
import { formatDate } from "@/lib/utils"

export default function OrdersPage() {
  const { orders } = useOrderStore()

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <Badge
                  variant={
                    order.status === "DELIVERED"
                      ? "default"
                      : order.status === "SHIPPED"
                        ? "secondary"
                        : order.status === "CANCELLED"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === "DELIVERED" && <Button size="sm">Reorder</Button>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
