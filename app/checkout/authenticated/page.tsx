import React from "react";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCartItems } from "@/actions/cart";
import { CheckoutForm } from "@/components/order/checkout-form";

// Empty Cart Component
const EmptyCart: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            asChild
          >
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Order Item Component
interface OrderItemProps {
  item: any;
  index: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ item, index }) => {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-lg border bg-muted/30">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
        <Image
          src={item.product.image || "/placeholder.svg?height=64&width=64"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground line-clamp-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Qty: {item.quantity} × ${item.product.price.toFixed(2)}
        </p>
        {item.product.category && (
          <Badge variant="secondary" className="mt-1 text-xs">
            {item.product.category}
          </Badge>
        )}
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg text-foreground">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  items: any[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <Card className="sticky top-4 border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item, index) => (
            <OrderItem key={item.id} item={item} index={index} />
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 100 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm mb-2">
              <Truck className="w-4 h-4" />
              <span>
                Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, text: "Secure" },
            { icon: Truck, text: "Fast Ship" },
            { icon: CheckCircle, text: "Quality" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Checkout Page
export default async function CheckoutPage() {
  let cartData;
  
  try {
    cartData = await getCartItems();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return <EmptyCart />;
  }

  const cartItems = cartData?.data || [];

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">
                Complete your order securely
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckoutForm cartItems={cartItems} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={cartItems} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}